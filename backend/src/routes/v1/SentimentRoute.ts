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

        let data = {positive: 0, neutral: 0, negative: 0};
        let notProcessedCount = 0;

        let filters = this.createFindFilters(queryFilters);

        try {

            for (const databaseName of dbs) {

                let database = getMongoConnection().useDb(databaseName);
                let model = database.model('Message', AnalyzedTweetSchema);
                let dbQuery = model.find(filters).lean();
                let currentResults = await dbQuery.exec();

                currentResults.map(current => {
                    const sentiment = current?.sentiment;

                    if (!current?.processed) {
                        notProcessedCount++;
                        return;
                    }

                    if (sentiment) {
                        const typeContent = sentiment[queryFilters.algorithm];

                        if (typeContent) {
                            switch (typeContent.sentiment) {
                                case 'positive': data.positive++; break;
                                case 'neutral':  data.neutral++;  break;
                                case 'negative': data.negative++; break;
                            }
                        }
                    }
                });
            }

            let processedCount = data.positive + data.neutral + data.negative;

            const percentages = {
                positive: data.positive === 0 ? '0' : ((data.positive / processedCount) * 100).toFixed(2),
                neutral:  data.neutral  === 0 ? '0' : ((data.neutral  / processedCount) * 100).toFixed(2),
                negative: data.negative === 0 ? '0' : ((data.negative / processedCount) * 100).toFixed(2)
            }

            res.send({
                processed: processedCount,
                notProcessed: notProcessedCount,
                data: data,
                percentages: percentages
            });

        } catch (error) {
            console.log(error)
            res.status(500);
            res.send({error: error.message});
        }
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
        return '/sentiment';
    }

    getMethod(): string {
        return 'get';
    }
}