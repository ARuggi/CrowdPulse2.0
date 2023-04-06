import {AbstractRoute} from './AbstractRoute';
import {Request, Response} from 'express';
import {getMongoConnection, AnalyzedTweetSchema} from '../../database/database';
import {readArrayFromQuery} from '../../util/RequestUtil';
import {createMissingQueryParamResponse} from '../IRoute';
import {Connection} from "mongoose";

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
export class SentimentRoute extends AbstractRoute {

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

        const data = {
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

            for (const databaseName of queryFilters.dbs) {

                const database = getMongoConnection().useDb(databaseName);
                const result = await this.getFromDatabase(database, queryFilters);

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

    /**
     * Get data from the database using the given filters.
     *
     * @param database the database to query.
     * @param queryFilters the query filters to apply.
     */
    private getFromDatabase(database: Connection, queryFilters: QueryFilters) {
        const model = database.model('Message', AnalyzedTweetSchema);
        const filters = this.createFiltersPipeline(queryFilters);

        const dbQuery = model.aggregate([
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
        return '/sentiment';
    }

    getMethod(): string {
        return 'get';
    }
}