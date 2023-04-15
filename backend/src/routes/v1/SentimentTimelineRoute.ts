import {AbstractRoute} from './AbstractRoute';
import {Request, Response} from 'express';
import {getMongoConnection, AnalyzedTweetSchema} from '../../database/database';
import {readArrayFromQuery} from '../../util/RequestUtil';
import {createMissingQueryParamResponse} from '../IRoute';

interface QueryFilters {
    dbs: string[],
    algorithm: string,
    dateFrom: string,
    dateTo: string,
    tags: string[],
    processedText: string[],
    hashtags: string[],
    usernames: string[]
}

// noinspection DuplicatedCode
export class SentimentTimelineRoute extends AbstractRoute {

    async handleRouteRequest(req: Request, res: Response): Promise<void> {
        const queryFilters: QueryFilters = {
            dbs:           readArrayFromQuery(req.query?.dbs),
            algorithm:     req.query?.algorithm as string,
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

        const result = {
            algorithm: queryFilters.algorithm,
            data: []
        };

        try {

            for (const databaseName of queryFilters.dbs) {

                const database = getMongoConnection().useDb(databaseName);
                const model = database.model('Message', AnalyzedTweetSchema);
                const dbAggregationQuery = model
                    .aggregate(queryFilters.algorithm === 'sent-it'
                        ? this.createSentItAggregationPipeline(queryFilters)
                        : queryFilters.algorithm === 'feel-it'
                            ? this.createFeelItAggregationPipeline(queryFilters)
                            : this.createHateSpeechAggregationPipeline(queryFilters))
                    .sort('date');

                (await dbAggregationQuery.exec()).forEach(current => {

                    if (result.data.find(element => element.date === current.date)) {
                        result.data.forEach(element => {
                            if (element.date === current.date) {
                                element.value += current.value;
                            }
                        });
                    } else {
                        result.data.push(current);
                    }
                });

            }

            result.data = result.data.sort((d1, d2) => new Date(d1.date).getTime() - new Date(d2.date).getTime());
            res.send(result);

        } catch (error) {
            console.log(error)
            res.status(500);
            res.send({error: error.message});
        }
    }

    private createSentItAggregationPipeline(queryFilters: QueryFilters): any {
        const filters = this.createFiltersPipeline(queryFilters);
        const { algorithm } = queryFilters;

        return [
            { $match: {...filters, processed: true} },
            { $addFields: { date: { $dateFromString: { dateString: '$created_at' } } } },
            {
                $group: {
                    _id: {
                        day:   { $dateToString: { format: '%d', date: '$date' } },
                        month: { $dateToString: { format: '%m', date: '$date' } },
                        year:  { $dateToString: { format: '%Y', date: '$date' } },
                    },
                    sentimentPositiveCount: { $sum: { $cond: { if: { $eq: [`$sentiment.${algorithm}.sentiment`, 'positive'] }, then: 1, else: 0 } } },
                    sentimentNeutralCount:  { $sum: { $cond: { if: { $eq: [`$sentiment.${algorithm}.sentiment`, 'neutral']  }, then: 1, else: 0 } } },
                    sentimentNegativeCount: { $sum: { $cond: { if: { $eq: [`$sentiment.${algorithm}.sentiment`, 'negative'] }, then: 1, else: 0 } } }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: { $concat: ['$_id.year', '-', '$_id.month', '-', '$_id.day'] },
                    sentimentPositiveCount: 1,
                    sentimentNeutralCount: 1,
                    sentimentNegativeCount: 1
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, 'id_day': 1 } }
        ];
    }

    private createFeelItAggregationPipeline(queryFilters: QueryFilters): any {
        const filters = this.createFiltersPipeline(queryFilters);
        const { algorithm } = queryFilters;

        return [
            { $match: {...filters, processed: true} },
            { $addFields: { date: { $dateFromString: { dateString: '$created_at' } } } },
            {
                $group: {
                    _id: {
                        day:   { $dateToString: { format: '%d', date: '$date' } },
                        month: { $dateToString: { format: '%m', date: '$date' } },
                        year:  { $dateToString: { format: '%Y', date: '$date' } },
                    },
                    sentimentPositiveCount: { $sum: { $cond: { if: { $eq: [`$sentiment.${algorithm}.sentiment`, 'positive'] }, then: 1, else: 0 } } },
                    sentimentNeutralCount:  { $sum: { $cond: { if: { $eq: [`$sentiment.${algorithm}.sentiment`, 'neutral']  }, then: 1, else: 0 } } },
                    sentimentNegativeCount: { $sum: { $cond: { if: { $eq: [`$sentiment.${algorithm}.sentiment`, 'negative'] }, then: 1, else: 0 } } },
                    emotionJoyCount:        { $sum: { $cond: { if: { $eq: [`$sentiment.${algorithm}.emotion`,   'joy']      }, then: 1, else: 0 } } },
                    emotionSadnessCount:    { $sum: { $cond: { if: { $eq: [`$sentiment.${algorithm}.emotion`,   'sadness']  }, then: 1, else: 0 } } },
                    emotionAngerCount:      { $sum: { $cond: { if: { $eq: [`$sentiment.${algorithm}.emotion`,   'anger']    }, then: 1, else: 0 } } },
                    emotionFearCount:       { $sum: { $cond: { if: { $eq: [`$sentiment.${algorithm}.emotion`,   'fear']     }, then: 1, else: 0 } } },
                }
            },
            {
                $project: {
                    _id: 0,
                    date: { $concat: ['$_id.year', '-', '$_id.month', '-', '$_id.day'] },
                    sentimentPositiveCount: 1,
                    sentimentNeutralCount: 1,
                    sentimentNegativeCount: 1,
                    emotionJoyCount: 1,
                    emotionSadnessCount: 1,
                    emotionAngerCount: 1,
                    emotionFearCount: 1
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, 'id_day': 1 } }
        ];
    }

    private createHateSpeechAggregationPipeline(queryFilters: QueryFilters): any {
        const filters = this.createFiltersPipeline(queryFilters);
        const { algorithm } = queryFilters;

        return [
            { $match: {...filters, processed: true} },
            { $addFields: { date: { $dateFromString: { dateString: '$created_at' } } } },
            {
                $group: {
                    _id: {
                        day:   { $dateToString: { format: '%d', date: '$date' } },
                        month: { $dateToString: { format: '%m', date: '$date' } },
                        year:  { $dateToString: { format: '%Y', date: '$date' } },
                    },
                    hateSpeechAcceptableCount:    { $sum: { $cond: { if: { $eq: [`$sentiment.${algorithm}.hate_speech_it`, 'acceptable']    }, then: 1, else: 0 } } },
                    hateSpeechInappropriateCount: { $sum: { $cond: { if: { $eq: [`$sentiment.${algorithm}.hate_speech_it`, 'inappropriate'] }, then: 1, else: 0 } } },
                    hateSpeechOffensiveCount:     { $sum: { $cond: { if: { $eq: [`$sentiment.${algorithm}.hate_speech_it`, 'offensive']     }, then: 1, else: 0 } } },
                    hateSpeechViolentCount:       { $sum: { $cond: { if: { $eq: [`$sentiment.${algorithm}.hate_speech_it`, 'violent']       }, then: 1, else: 0 } } },
                }
            },
            {
                $project: {
                    _id: 0,
                    date: { $concat: ['$_id.year', '-', '$_id.month', '-', '$_id.day'] },
                    hateSpeechAcceptableCount: 1,
                    hateSpeechInappropriateCount: 1,
                    hateSpeechOffensiveCount: 1,
                    hateSpeechViolentCount: 1
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, 'id_day': 1 } }
        ];
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

        if (tags && tags.length > 0) {
            //const tagsFilter = {'tags.tag_me': {$in: queryFilters.tags}};
            const tagsFilters = tags.map(tag => {
                return {'tags.tag_me': {$regex: new RegExp(tag, 'i')}};
            });

            filters = {...filters, ...{$and: tagsFilters}};
        }

        if (processedText && processedText.length > 0) {
            const processedTextFilters = processedText.map(text => {
                return {'spacy.processed_text': {$regex: new RegExp(text, 'i')}};
            });

            filters.$and = (filters.$and || []).concat(processedTextFilters);
        }

        if (hashtags && hashtags.length > 0) {
            const hashtagsFilters = hashtags.map(hashtag => {
                return {'twitter_entities.hashtags': {$regex: new RegExp(hashtag, 'i')}};
            });

            filters.$and = (filters.$and || []).concat(hashtagsFilters);
        }

        if (usernames && usernames.length > 0) {
            const usernamesFilters = usernames.map(username => {
                return {'author_username': {$regex: new RegExp(username, 'i')}};
            });

            filters.$or = (filters.$or || []).concat(usernamesFilters);
        }

        return filters;
    }

    protected path(): string {
        return '/sentiment/timeline';
    }

    getMethod(): string {
        return 'get';
    }
}