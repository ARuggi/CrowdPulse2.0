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

type HeatMap = {
    count: number
    coordinates: {
        latitude: number,
        longitude: number
    },
}

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
            region: current.region.map(r => r.toLowerCase()),
            coordinates: current.coordinates,
        }
    }
);

// noinspection DuplicatedCode
export class HeatMapRoute extends AbstractRoute {

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
        const data: HeatMap[] = [];

        try {

            for (const databaseName of dbs) {

                let database = getMongoConnection().useDb(databaseName);
                let model = database.model('Message', AnalyzedTweetSchema);

                let dbQuery = model.aggregate([
                    {
                        $match: {
                            $or: [
                                { 'geo.user_location': { $ne: null } },
                                { 'geo.coordinates': { $ne: null } },
                                { $and: [{ 'geo.user_location': { $ne: null } }, { 'geo.coordinates': { $ne: null } }] },
                            ],
                            $and: [ { ...filters } ]
                        },
                    },
                    {
                        $project: {
                            'user_location': '$geo.user_location',
                            'coordinates': '$geo.coordinates',
                        },
                    },
                    {
                        $group: {
                            _id: { 'user_location': '$user_location', 'coordinates': '$coordinates' },
                            count: { $sum: 1 },
                        },
                    },
                    {
                        $project: {
                            '_id': 0,
                            'user_location': '$_id.user_location',
                            'coordinates': '$_id.coordinates',
                            'count': 1,
                        },
                    },
                ]);

                let result = await dbQuery.exec();

                result.forEach(entry => {

                    if (!entry.coordinates && entry.user_location) {
                        const { user_location } = entry;

                        for (const city of province) {
                            if (user_location.includes(city.name) || city.region.some(r => user_location.includes(r))) {
                                entry.coordinates = city.coordinates;
                                break;
                            }
                        }
                    }

                    if (entry.coordinates) {
                        data.push({
                            count: entry.count,
                            coordinates: {
                                latitude: entry.coordinates.latitude,
                                longitude: entry.coordinates.longitude
                            }
                        });
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
        return '/heatmap';
    }

    getMethod(): string {
        return 'get';
    }
}