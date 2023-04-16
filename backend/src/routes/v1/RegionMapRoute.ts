import {Request, Response} from 'express';
import {AbstractRoute} from './AbstractRoute';
import {createMissingQueryParamResponse} from '../IRoute';
import {AnalyzedTweetSchema, getMongoConnection} from '../../database/database';
import {readArrayFromQuery} from '../../util/RequestUtil';
import {Country, loadCities} from '../../util/CountryUtil';
import {Connection} from "mongoose";

interface QueryFilters {
    dbs: string[],
    algorithm: string,
    sentiment: string,
    emotion: string,
    hateSpeech: string,
    mapType: string,
    type: string,
    dateFrom: string,
    dateTo: string,
    tags: string[],
    processedText: string[],
    hashtags: string[],
    usernames: string[]
}

//const cities = loadCities(Country.ITALY)
//    .map(current => {
//        return {
//            name: current.name.toLowerCase(),
//            region: current.region.map(r => r.toLowerCase())}
//    });

/*
 * The cities are loaded and filtered to get only the provinces.
 */
const provinces = loadCities(Country.ITALY)
    .filter(current => {
        switch (current.type) {
            case 'primary': // the main city of the country, for Italy it's Rome.
            case 'admin':   // the main city of the region, for Italy it's the capital of each region.
            case 'minor': return true; // a province of the region.
            default: return false;
        }
    }).map(current => {
            return {
                name: current.name.toLowerCase(),
                region: current.region.map(r => r.toLowerCase())}
        }
    );

/*
 * The region names are extracted from the provinces and
 * filtered to get only the unique ones.
 */
const regions = provinces
    .map(city => city.region)
    .filter((item, index, array) => array.indexOf(item) === index);

// noinspection DuplicatedCode
export class RegionMapRoute extends AbstractRoute {

    async handleRouteRequest(req: Request, res: Response): Promise<void> {

        const queryFilters: QueryFilters = {
            dbs:           readArrayFromQuery(req.query?.dbs),
            algorithm:     req.query?.algorithm as string,
            sentiment:     req.query?.sentiment as string,
            emotion:       req.query?.emotion as string,
            hateSpeech:    req.query?.hateSpeech as string,
            mapType:       req.query?.mapType as string,
            type:          req.query?.type as string,
            dateFrom:      req.query?.dateFrom as string,
            dateTo:        req.query?.dateTo as string,
            tags:          readArrayFromQuery(req.query?.tags),
            processedText: readArrayFromQuery(req.query?.processedText),
            hashtags:      readArrayFromQuery(req.query?.hashtags),
            usernames:     readArrayFromQuery(req.query?.usernames)
        };

        // send an error if the query is missing the 'dbs' parameter.
        if (queryFilters.dbs.length === 0) {
            res.status(400);
            res.send(createMissingQueryParamResponse('dbs'));
            return;
        }

        // send an error if the query is missing the right 'algorithm' parameter.
        if (queryFilters.algorithm !== 'sent-it'
            && queryFilters.algorithm !== 'feel-it'
            && queryFilters.algorithm !== 'hate-speech') {
            res.status(400);
            res.send(createMissingQueryParamResponse('algorithm'));
            return;
        }

        const data = queryFilters.mapType === 'region'
            ? regions
                .reduce((result, regionNames) => {
                    result[regionNames.join(' ')] = {
                        sentimentPositive: 0,
                        sentimentNeutral:  0,
                        sentimentNegative: 0,
                        emotionJoy:     0,
                        emotionSadness: 0,
                        emotionAnger:   0,
                        emotionFear:    0,
                        hateSpeechAcceptable:    0,
                        hateSpeechInappropriate: 0,
                        hateSpeechOffensive:     0,
                        hateSpeechViolent:       0
                    };
                    return result;
                }, {})
            : provinces
                .reduce((result, province) => {
                    result[province.name] = {
                        sentimentPositive: 0,
                        sentimentNeutral:  0,
                        sentimentNegative: 0,
                        emotionJoy:     0,
                        emotionSadness: 0,
                        emotionAnger:   0,
                        emotionFear:    0,
                        hateSpeechAcceptable:    0,
                        hateSpeechInappropriate: 0,
                        hateSpeechOffensive:     0,
                        hateSpeechViolent:       0
                    };
                    return result;
                }, {});

        try {
            for (const databaseName of queryFilters.dbs) {

                const database = getMongoConnection().useDb(databaseName);
                const result = await this.getFromDatabase(database, queryFilters);

                result.forEach(entry => {
                    let { location } = entry;
                    location = location.toLowerCase();

                    for (const city of provinces) {
                        let entryName: string;

                        if (queryFilters.mapType === 'region') {
                            if (!location.includes(city.name) && !city.region.some(r => location.includes(r))) {
                                continue;
                            }

                            entryName = city.region.join(' ');
                        } else {
                            if (!location.includes(city.name)) {
                                continue;
                            }

                            entryName = city.name;
                        }

                        data[entryName].sentimentPositive += entry?.sentimentPositive ? 1 : 0;
                        data[entryName].sentimentNeutral  += entry?.sentimentNeutral  ? 1 : 0;
                        data[entryName].sentimentNegative += entry?.sentimentNegative ? 1 : 0;
                        data[entryName].emotionJoy     += entry?.emotionJoy     ? 1 : 0;
                        data[entryName].emotionSadness += entry?.emotionSadness ? 1 : 0;
                        data[entryName].emotionAnger   += entry?.emotionAnger   ? 1 : 0;
                        data[entryName].emotionFear    += entry?.emotionFear    ? 1 : 0;
                        data[entryName].hateSpeechAcceptable    += entry?.hateSpeechAcceptable ? 1 : 0;
                        data[entryName].hateSpeechInappropriate += entry?.hateSpeechInappropriate ? 1 : 0;
                        data[entryName].hateSpeechOffensive     += entry?.hateSpeechOffensive ? 1 : 0;
                        data[entryName].hateSpeechViolent       += entry?.hateSpeechViolent ? 1 : 0;
                        break;
                    }
                });

            }

            res.send(data);

        } catch (error) {
            console.log(error)
            res.status(500);
            res.send({error: error.message});
        }
    }

    /**
     * Get data from the database using the given filters.
     *
     * @param database the database to query.
     * @param queryFilters the query filters to apply.
     */
    private getFromDatabase = async (database: Connection, queryFilters: QueryFilters) => {
        const model = database.model('Message', AnalyzedTweetSchema);
        const filters = this.createFiltersPipeline(queryFilters);

        const dbQuery = model.aggregate([
            {
                $match: {
                    processed: true,
                    'geo.user_location': { $ne: null },
                    ...filters }
            },
            {
                $project: queryFilters.algorithm === 'sent-it'
                    ? {
                        _id: 0,
                        'sentiment.sent-it.sentiment': 1,
                        'geo.user_location': 1,
                    } : queryFilters.algorithm === 'feel-it'
                        ? {
                            _id: 0,
                            'sentiment.feel-it.sentiment': 1,
                            'sentiment.feel-it.emotion' : 1,
                            'geo.user_location': 1,
                        } : {
                            'sentiment.hate_speech_it.hate_speech_level': 1,
                            'geo.user_location': 1,
                        }
            },
            {
                $group: queryFilters.algorithm === 'sent-it'
                    ? {
                        _id: '$geo.user_location',
                        sentimentPositive: { $sum: { $cond: [{ $eq: ['$sentiment.sent-it.sentiment', 'positive'] }, 1, 0 ] } },
                        sentimentNeutral:  { $sum: { $cond: [{ $eq: ['$sentiment.sent-it.sentiment', 'neutral']  }, 1, 0 ] } },
                        sentimentNegative: { $sum: { $cond: [{ $eq: ['$sentiment.sent-it.sentiment', 'negative'] }, 1, 0 ] } },
                    } : queryFilters.algorithm === 'feel-it'
                        ? {
                            _id: '$geo.user_location',
                            sentimentPositive: { $sum: { $cond: [{ $eq: ['$sentiment.feel-it.sentiment', 'positive'] }, 1, 0 ] } },
                            sentimentNeutral:  { $sum: { $cond: [{ $eq: ['$sentiment.feel-it.sentiment', 'neutral']  }, 1, 0 ] } },
                            sentimentNegative: { $sum: { $cond: [{ $eq: ['$sentiment.feel-it.sentiment', 'negative'] }, 1, 0 ] } },
                            emotionJoy:        { $sum: { $cond: [{ $eq: ['$sentiment.feel-it.emotion', 'joy']     }, 1, 0 ] } },
                            emotionSadness:    { $sum: { $cond: [{ $eq: ['$sentiment.feel-it.emotion', 'sadness'] }, 1, 0 ] } },
                            emotionAnger:      { $sum: { $cond: [{ $eq: ['$sentiment.feel-it.emotion', 'anger']   }, 1, 0 ] } },
                            emotionFear:       { $sum: { $cond: [{ $eq: ['$sentiment.feel-it.emotion', 'fear']    }, 1, 0 ] } },
                        } : {
                            _id: '$geo.user_location',
                            hateSpeechAcceptable:    { $sum: { $cond: [{ $eq: ['$sentiment.hate_speech_it.hate_speech_level', 'acceptable']    }, 1, 0 ] } },
                            hateSpeechInappropriate: { $sum: { $cond: [{ $eq: ['$sentiment.hate_speech_it.hate_speech_level', 'inappropriate'] }, 1, 0 ] } },
                            hateSpeechOffensive:     { $sum: { $cond: [{ $eq: ['$sentiment.hate_speech_it.hate_speech_level', 'offensive']     }, 1, 0 ] } },
                            hateSpeechViolent:       { $sum: { $cond: [{ $eq: ['$sentiment.hate_speech_it.hate_speech_level', 'violent']       }, 1, 0 ] } },
                        }
            },
            {
                $project: queryFilters.algorithm === 'sent-it'
                    ? {
                        location: '$_id',
                        sentimentPositive: 1,
                        sentimentNeutral: 1,
                        sentimentNegative: 1,
                        _id: 0,
                    } : queryFilters.algorithm === 'feel-it'
                        ? {
                            location: '$_id',
                            sentimentPositive: 1,
                            sentimentNeutral: 1,
                            sentimentNegative: 1,
                            emotionJoy: 1,
                            emotionSadness: 1,
                            emotionAnger: 1,
                            emotionFear: 1,
                            _id: 0,
                        } : {
                            location: '$_id',
                            hateSpeechAcceptable: 1,
                            hateSpeechInappropriate: 1,
                            hateSpeechOffensive: 1,
                            hateSpeechViolent: 1,
                            _id: 0,
                        }
            },
        ]);

        return dbQuery.exec();
    }

    /**
     * Creates the filters pipeline for the aggregation query.
     * @param queryFilters the query filters to apply.
     */
    private createFiltersPipeline = (queryFilters: QueryFilters) => {

        const {
            dateFrom,
            dateTo,
            tags,
            processedText,
            hashtags,
            usernames
        } = queryFilters;

        let filters: any = {};

        // date filter.
        if (dateFrom && dateTo) {
            filters = {
                ...filters,
                ...{
                    'created_at': {
                        $gte: new Date(dateFrom).toISOString(),
                        $lte: new Date(dateTo).toISOString()
                    }
                }
            };
        }

        // tags filter.
        if (tags && tags.length > 0) {
            const tagsFilters = tags.map(tag => {
                return {'tags.tag_me': {$regex: new RegExp(tag, 'i')}};
            });

            filters = {
                ...filters,
                ...{
                    $and: tagsFilters
                }
            };
        }

        // processed text filter.
        if (processedText && processedText.length > 0) {
            const processedTextFilters = processedText.map(text => {
                return {'spacy.processed_text': {$regex: new RegExp(text, 'i')}};
            });

            filters.$and = (filters.$and || []).concat(processedTextFilters);
        }

        // hashtags filter.
        if (hashtags && hashtags.length > 0) {
            const hashtagsFilters = hashtags.map(hashtag => {
                return {'twitter_entities.hashtags': {$regex: new RegExp(hashtag, 'i')}};
            });

            filters.$and = (filters.$and || []).concat(hashtagsFilters);
        }

        // usernames filter.
        if (usernames && usernames.length > 0) {
            const usernamesFilters = usernames.map(username => {
                return {'author_username': {$regex: new RegExp(username, 'i')}};
            });

            filters.$or = (filters.$or || []).concat(usernamesFilters);
        }

        return filters;
    }

    protected path(): string {
        return '/map';
    }

    getMethod(): string {
        return 'get';
    }
}