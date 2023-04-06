import {AbstractRoute} from './AbstractRoute';
import {Request, Response} from 'express';
import {getMongoConnection, AnalyzedTweetSchema} from '../../database/database';
import {readArrayFromQuery} from '../../util/RequestUtil';
import {createMissingQueryParamResponse} from '../IRoute';
import {Connection} from "mongoose";

interface QueryFilters {
    dbs: string[],
    algorithm: string,
    sentiment: string,
    emotion: string,
    dateFrom: string,
    dateTo: string,
    tags: string[],
    processedText: string[],
    hashtags: string[],
    usernames: string[],
    pageSize: number,
    page: number
}

const DEF_PAGE_SIZE = 10;
const DEF_PAGE = 1;

// noinspection DuplicatedCode
export class TweetsListRoute extends AbstractRoute {

    async handleRouteRequest(req: Request, res: Response): Promise<void> {

        const queryFilters: QueryFilters = {
            dbs:           readArrayFromQuery(req.query?.dbs),
            algorithm:     req.query?.algorithm as string,
            sentiment:     req.query?.sentiment as string,
            emotion:       req.query?.emotion as string,
            dateFrom:      req.query?.dateFrom as string,
            dateTo:        req.query?.dateTo as string,
            tags:          readArrayFromQuery(req.query?.tags),
            processedText: readArrayFromQuery(req.query?.processedText),
            hashtags:      readArrayFromQuery(req.query?.hashtags),
            usernames:     readArrayFromQuery(req.query?.usernames),
            pageSize:      req.query?.pageSize ? Number.parseInt(req.query?.pageSize as string) : DEF_PAGE_SIZE,
            page:          req.query?.page ? Number.parseInt(req.query?.page as string) : DEF_PAGE
        };

        // send an error if the query is missing the 'dbs' parameter.
        if (queryFilters.dbs.length === 0) {
            res.status(400);
            res.send(createMissingQueryParamResponse('dbs'));
            return;
        }

        const data = { total: 0, values: [] };

        try {

            for (const databaseName of queryFilters.dbs) {

                const database = getMongoConnection().useDb(databaseName);
                const result = await this.getFromDatabase(database, queryFilters);

                if (result && result.length > 0) {
                    data.total += result[0]?.total;
                    result[0]?.values.forEach(current => data.values.push({
                        author: current.author_username,
                        text: current.raw_text,
                        lang: current.lang,
                        sensitive: current.possibly_sensitive,
                        created_at: current.created_at,
                        tags: current.tags
                            ?.map(tag => tag.split(' : ')[0].trim().toLowerCase())
                            .filter(tag => !tag.includes(' '))
                    }));
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
    private getFromDatabase = async (database: Connection, queryFilters: QueryFilters) => {
        const model = database.model('Message', AnalyzedTweetSchema);
        const filters = this.createFiltersPipeline(queryFilters);

        const dbQuery = model.aggregate([
            { $match: { processed: true, ...filters } },
            {
                $facet: {
                    count: [ { $count: "total" } ],
                    values: [
                        {
                            $project: {
                                author_username: 1,
                                raw_text: 1,
                                created_at: { $dateFromString: { dateString: "$created_at" } },
                                lang: 1,
                                possibly_sensitive: 1,
                                tags: "$tags.tag_me"
                            }
                        },
                        { $sort: { author_username: 1 } },
                        { $skip: queryFilters.pageSize * (queryFilters.page - 1) },
                        { $limit: queryFilters.pageSize },
                    ]
                }
            },
            {
                $project: {
                    _id: 0,
                    total: { $arrayElemAt: ["$count.total", 0] },
                    values: 1
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
            algorithm,
            sentiment,
            emotion,
            dateFrom,
            dateTo,
            tags,
            processedText,
            hashtags,
            usernames
        } = queryFilters;

        let filters: any = {};

        // sentiment filter.
        if (algorithm && algorithm !== 'all' && sentiment && sentiment !== 'all') {
            filters = {
                ...filters,
                ...{[`sentiment.${algorithm}.sentiment`]: sentiment}
            };
        }

        // emotion filter.
        if (algorithm && algorithm === 'feel-it' && emotion && emotion !== 'all') {
            filters = {
                ...filters,
                ...{[`sentiment.${algorithm}.emotion`]: emotion}
            };

        }

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
        return '/tweets/list';
    }

    getMethod(): string {
        return 'get';
    }
}