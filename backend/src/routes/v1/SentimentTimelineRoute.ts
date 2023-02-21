import {AbstractRoute} from './AbstractRoute';
import {Request, Response} from 'express';
import {getMongoConnection} from '../../database/database';
import {readArrayFromQuery} from '../../util/RequestUtil';
import {AnalyzedTweetSchema} from '../../database/database';
import {createMissingQueryParamResponse} from '../IRoute';

interface Filters {
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
        let dbs = readArrayFromQuery(req.query?.dbs);

        if (dbs.length === 0) {
            res.status(400);
            res.send(createMissingQueryParamResponse('dbs'));
            return;
        }

        const queryFilters: Filters = {
            algorithm:     req.query?.algorithm as string,
            dateFrom:      req.query?.dateFrom as string,
            dateTo:        req.query?.dateTo as string,
            tags:          readArrayFromQuery(req.query?.tags),
            processedText: readArrayFromQuery(req.query?.processedText),
            hashtags:      readArrayFromQuery(req.query?.hashtags),
            usernames:     readArrayFromQuery(req.query?.usernames)
        };

        let data = [];
        let filters = this.createFindFilters(queryFilters);

        try {

            for (const databaseName of dbs) {

                let database = getMongoConnection().useDb(databaseName);
                let model = database.model('Message', AnalyzedTweetSchema);
                let dbAggregationQuery = model
                    .aggregate(this.createAggregationPipeline(queryFilters.algorithm, filters))
                    .sort('date');

                (await dbAggregationQuery.exec()).map(current => {
                    data.push(current);
                });

            }

            res.send(data);

        } catch (error) {
            console.log(error)
            res.status(500);
            res.send({error: error.message});
        }
    }

    private createAggregationPipeline(algorithm: string, filters: any): any {
        return [
            {
                $match: {...filters, processed: true}
            },
            {
                $addFields: {
                    date: {
                        $dateFromString: {
                            dateString: '$created_at'
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        day: { $dateToString: { format: '%d', date: '$date' } },
                        month: { $dateToString: { format: '%m', date: '$date' } },
                        year: { $dateToString: { format: '%Y', date: '$date' } },
                    },
                    positiveCount: {
                        $sum: {
                            $cond: {
                                if: { $eq: [`$sentiment.${algorithm}.sentiment`, 'positive'] },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    neutralCount: {
                        $sum: {
                            $cond: {
                                if: { $eq: [`$sentiment.${algorithm}.sentiment`, 'neutral'] },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    negativeCount: {
                        $sum: {
                            $cond: {
                                if: { $eq: [`$sentiment.${algorithm}.sentiment`, 'negative'] },
                                then: 1,
                                else: 0
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: {
                        $concat: [
                            '$_id.year', '-', '$_id.month', '-', '$_id.day'
                        ]
                    },
                    positiveCount: 1,
                    neutralCount: 1,
                    negativeCount: 1
                }
            },
            {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1,
                    'id_day': 1
                }
            }
        ];
    }

    private createFindFilters = (queryFilters: Filters) => {
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
        return '/sentiment/timeline';
    }

    getMethod(): string {
        return 'get';
    }
}