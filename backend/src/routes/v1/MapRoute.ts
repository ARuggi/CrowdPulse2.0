import {Request, Response} from 'express';
import {AbstractRoute} from './AbstractRoute';
import {createMissingQueryParamResponse} from '../IRoute';
import {AnalyzedTweetSchema, getMongoConnection} from '../../database/database';
import {readArrayFromQuery} from '../../util/RequestUtil';
import {Country, loadCities} from '../../util/CountryUtil';

interface Filters {
    algorithm: string,
    sentiment: string,
    emotion: string,
    type: string,
    dateFrom: string,
    dateTo: string,
    tags: string[],
    processedText: string[],
    hashtags: string[],
    usernames: string[]
}

const cities = loadCities(Country.ITALY).map(current => {
    return {
        name: current.name.toLowerCase(),
        region: current.region.map(r => r.toLowerCase())}
});

const province = loadCities(Country.ITALY).filter(current => {
    switch (current.type) {
        case 'primary':
        case 'admin':
        case 'minor': return true;
        default: return false;
    }
}).map(current => {
        return {
            name: current.name.toLowerCase(),
            region: current.region.map(r => r.toLowerCase())}
    }
);

const regions = province.map(city => city.region)
    .filter((item, index, array) => array.indexOf(item) === index);

// noinspection DuplicatedCode
export class MapRoute extends AbstractRoute {

    async handleRouteRequest(req: Request, res: Response): Promise<void> {
        let dbs = readArrayFromQuery(req.query?.dbs);

        if (dbs.length === 0) {
            res.status(400);
            res.send(createMissingQueryParamResponse('dbs'));
            return;
        }

        const queryFilters: Filters = {
            algorithm:     req.query?.algorithm as string,
            sentiment:     req.query?.sentiment as string,
            emotion:       req.query?.emotion as string,
            type:          req.query?.type as string,
            dateFrom:      req.query?.dateFrom as string,
            dateTo:        req.query?.dateTo as string,
            tags:          readArrayFromQuery(req.query?.tags),
            processedText: readArrayFromQuery(req.query?.processedText),
            hashtags:      readArrayFromQuery(req.query?.hashtags),
            usernames:     readArrayFromQuery(req.query?.usernames)
        };

        if (!queryFilters.algorithm || queryFilters.algorithm.length === 0) {
            res.status(400);
            res.send(createMissingQueryParamResponse('algorithm'));
            return;
        }

        let filters = this.createFiltersPipeline(queryFilters);
        const data = regions.reduce((result, region) => {
            result[region.join(' ')] = {
                sentimentPositive: 0,
                sentimentNeutral:  0,
                sentimentNegative: 0,
                emotionJoy:     0,
                emotionSadness: 0,
                emotionAnger:   0,
                emotionFear:    0,
            };
            return result;
        }, {});

        try {

            for (const databaseName of dbs) {

                let database = getMongoConnection().useDb(databaseName);
                let model = database.model('Message', AnalyzedTweetSchema);

                let dbQuery = model.aggregate([
                    { $match: { processed: true, 'geo.user_location': { $ne: null }, ...filters } },
                    {
                        $project: queryFilters.algorithm === 'sent-it'
                            ? {
                                _id: 0,
                                'sentiment.sent-it.sentiment': 1,
                                'geo.user_location': 1,
                            } : {
                                _id: 0,
                                'sentiment.feel-it.sentiment': 1,
                                'sentiment.feel-it.emotion' : 1,
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
                            } : {
                                _id: '$geo.user_location',
                                sentimentPositive: { $sum: { $cond: [{ $eq: ['$sentiment.feel-it.sentiment', 'positive'] }, 1, 0 ] } },
                                sentimentNeutral:  { $sum: { $cond: [{ $eq: ['$sentiment.feel-it.sentiment', 'neutral']  }, 1, 0 ] } },
                                sentimentNegative: { $sum: { $cond: [{ $eq: ['$sentiment.feel-it.sentiment', 'negative'] }, 1, 0 ] } },
                                emotionJoy:        { $sum: { $cond: [{ $eq: ['$sentiment.feel-it.emotion', 'joy']     }, 1, 0 ] } },
                                emotionSadness:    { $sum: { $cond: [{ $eq: ['$sentiment.feel-it.emotion', 'sadness'] }, 1, 0 ] } },
                                emotionAnger:      { $sum: { $cond: [{ $eq: ['$sentiment.feel-it.emotion', 'anger']   }, 1, 0 ] } },
                                emotionFear:       { $sum: { $cond: [{ $eq: ['$sentiment.feel-it.emotion', 'fear']    }, 1, 0 ] } },
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
                            } : {
                                location: '$_id',
                                sentimentPositive: 1,
                                sentimentNeutral: 1,
                                sentimentNegative: 1,
                                emotionJoy: 1,
                                emotionSadness: 1,
                                emotionAnger: 1,
                                emotionFear: 1,
                                _id: 0,
                            }
                    },
                ]);

                let result = await dbQuery.exec();

                result.forEach(entry => {
                    let { location } = entry;
                    location = location.toLowerCase();

                    for (const city of province) {
                        if (location.includes(city.name) || city.region.some(r => location.includes(r))) {

                            const regionName = city.region.join(' ');

                            data[regionName].sentimentPositive += entry.sentimentPositive ? 1 : 0;
                            data[regionName].sentimentNeutral  += entry.sentimentNeutral  ? 1 : 0;
                            data[regionName].sentimentNegative += entry.sentimentNegative ? 1 : 0;
                            data[regionName].emotionJoy     += entry.emotionJoy     ? 1 : 0;
                            data[regionName].emotionSadness += entry.emotionSadness ? 1 : 0;
                            data[regionName].emotionAnger   += entry.emotionAnger   ? 1 : 0;
                            data[regionName].emotionFear    += entry.emotionFear    ? 1 : 0;
                            break;
                        }
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

    private createFiltersPipeline = (queryFilters: Filters) => {
        let filters: any = {};

        if (queryFilters.dateFrom && queryFilters.dateTo) {
            const dateFilter = {'created_at': {
                    $gte: new Date(queryFilters.dateFrom).toISOString(),
                    $lte: new Date(queryFilters.dateTo).toISOString()
                }};
            filters = {...filters, ...dateFilter};
        }

        if (queryFilters.tags && queryFilters.tags.length > 0) {
            //const tagsFilter = {'tags.tag_me': {$in: queryFilters.tags}};
            const tagsFilters = queryFilters.tags.map(tag => {
                return {'tags.tag_me': {$regex: new RegExp(tag, 'i')}};
            });

            filters = {...filters, ...{$and: tagsFilters}};
        }

        if (queryFilters.processedText && queryFilters.processedText.length > 0) {
            const processedTextFilters = queryFilters.processedText.map(processedText => {
                return {'spacy.processed_text': {$regex: new RegExp(processedText, 'i')}};
            });

            filters.$and = (filters.$and || []).concat(processedTextFilters);
        }

        if (queryFilters.hashtags && queryFilters.hashtags.length > 0) {
            const hashtagsFilters = queryFilters.hashtags.map(hashtag => {
                return {'twitter_entities.hashtags': {$regex: new RegExp(hashtag, 'i')}};
            });

            filters.$and = (filters.$and || []).concat(hashtagsFilters);
        }

        if (queryFilters.usernames && queryFilters.usernames.length > 0) {
            const usernamesFilters = queryFilters.usernames.map(username => {
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