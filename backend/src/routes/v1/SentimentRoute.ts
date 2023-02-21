import {AbstractRoute} from './AbstractRoute';
import {Request, Response} from 'express';
import {getMongoConnection, AnalyzedTweetSchema} from '../../database/database';
import {readArrayFromQuery} from '../../util/RequestUtil';
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
export class SentimentRoute extends AbstractRoute {

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

        let filters = this.createFiltersPipeline(queryFilters);
        let data = {
            algorithm: queryFilters.algorithm,
            processed: 0,
            notProcessed: 0,
            sentimentData: {
                positive: 0,
                neutral:  0,
                negative: 0
            },
            emotionData: {
                joy: 0,
                sadness: 0,
                anger: 0,
                fear: 0
            }
        }

        try {

            for (const databaseName of dbs) {

                let database = getMongoConnection().useDb(databaseName);
                let model = database.model('Message', AnalyzedTweetSchema);

                let dbQuery = model.aggregate([
                    {
                        $facet: {
                            processedCount: [
                                { $match: { processed: true } },
                                { $count: 'processed' }
                            ],
                            notProcessedCount: [
                                { $match: { processed: false } },
                                { $count: 'processed' }
                            ],
                            data: [
                                { $match: filters },
                                {
                                    $group: {
                                        _id: "$sentiment.sentiment",
                                        positive: { $sum: { $cond: [{ $eq: [`$sentiment.${queryFilters.algorithm}.sentiment`, 'positive'] }, 1, 0] } },
                                        neutral:  { $sum: { $cond: [{ $eq: [`$sentiment.${queryFilters.algorithm}.sentiment`, 'neutral']  }, 1, 0] } },
                                        negative: { $sum: { $cond: [{ $eq: [`$sentiment.${queryFilters.algorithm}.sentiment`, 'negative'] }, 1, 0] } },
                                        joy:      { $sum: { $cond: [{ $eq: [`$sentiment.${queryFilters.algorithm}.emotion`,   'joy']      }, 1, 0] } },
                                        sadness:  { $sum: { $cond: [{ $eq: [`$sentiment.${queryFilters.algorithm}.emotion`,   'sadness']  }, 1, 0] } },
                                        anger:    { $sum: { $cond: [{ $eq: [`$sentiment.${queryFilters.algorithm}.emotion`,   'anger']    }, 1, 0] } },
                                        fear:     { $sum: { $cond: [{ $eq: [`$sentiment.${queryFilters.algorithm}.emotion`,   'fear']     }, 1, 0] } },
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $project: {
                            processedCount: 1,
                            notProcessedCount: 1,
                            data: 1
                        }
                    }
                ]);

                let result = await dbQuery.exec();
                const [aggregationResult] = result;

                if (aggregationResult) {
                    const [processedCountResult] = aggregationResult.processedCount;
                    const [notProcessedCountResult] = aggregationResult.notProcessedCount;
                    const [dataResult] = aggregationResult.data;

                    data.processed    += processedCountResult?.processed    ? processedCountResult.processed    : 0;
                    data.notProcessed += notProcessedCountResult?.processed ? notProcessedCountResult.processed : 0;
                    data.sentimentData.positive += dataResult?.positive ? dataResult?.positive : 0;
                    data.sentimentData.neutral  += dataResult?.neutral  ? dataResult?.neutral  : 0;
                    data.sentimentData.negative += dataResult?.negative ? dataResult?.negative : 0;
                    data.emotionData.joy     += dataResult?.joy     ? dataResult?.joy     : 0;
                    data.emotionData.sadness += dataResult?.sadness ? dataResult?.sadness : 0;
                    data.emotionData.anger   += dataResult?.anger   ? dataResult?.anger   : 0;
                    data.emotionData.fear    += dataResult?.fear    ? dataResult?.fear    : 0;
                }
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
        return '/sentiment';
    }

    getMethod(): string {
        return 'get';
    }
}