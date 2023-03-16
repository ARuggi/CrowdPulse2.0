import {AbstractRoute} from './AbstractRoute';
import {Request, Response} from 'express';
import {getMongoConnection, AnalyzedTweetSchema} from '../../database/database';
import {readArrayFromQuery} from '../../util/RequestUtil';
import {createMissingQueryParamResponse} from '../IRoute';

interface Filters {
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
            dateFrom:      req.query?.dateFrom as string,
            dateTo:        req.query?.dateTo as string,
            tags:          readArrayFromQuery(req.query?.tags),
            processedText: readArrayFromQuery(req.query?.processedText),
            hashtags:      readArrayFromQuery(req.query?.hashtags),
            usernames:     readArrayFromQuery(req.query?.usernames),
            pageSize:      req.query?.pageSize ? Number.parseInt(req.query?.pageSize as string) : DEF_PAGE_SIZE,
            page:          req.query?.page ? Number.parseInt(req.query?.page as string) : DEF_PAGE
        };

        let data = { total: 0, values: [] };
        let filters = this.createFiltersPipeline(queryFilters);

        try {

            for (const databaseName of dbs) {

                let database = getMongoConnection().useDb(databaseName);
                let model = database.model('Message', AnalyzedTweetSchema);
                let dbFindQuery = model.aggregate([
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

                const result = (await dbFindQuery.exec());

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

    private createFiltersPipeline = (queryFilters: Filters) => {
        let filters: any = {};

        if (queryFilters.algorithm && queryFilters.algorithm !== 'all'
            && queryFilters.sentiment && queryFilters.sentiment !== 'all') {
            const filter = {[`sentiment.${queryFilters.algorithm}.sentiment`]: queryFilters.sentiment}
            filters = {...filters, ...filter};
        }

        if (queryFilters.algorithm && queryFilters.algorithm === 'feel-it'
            && queryFilters.emotion && queryFilters.emotion !== 'all') {

            const filter = {[`sentiment.${queryFilters.algorithm}.emotion`]: queryFilters.emotion}
            filters = {...filters, ...filter};

        }

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
        return '/tweets/list';
    }

    getMethod(): string {
        return 'get';
    }
}