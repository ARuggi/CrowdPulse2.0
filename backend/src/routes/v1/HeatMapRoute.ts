import {Request, Response} from 'express';
import {AbstractRoute} from './AbstractRoute';
import {createMissingQueryParamResponse} from '../IRoute';
import {AnalyzedTweetSchema, getMongoConnection} from '../../database/database';
import {readArrayFromQuery} from '../../util/RequestUtil';
import {Country, loadCities} from '../../util/CountryUtil';
import {Connection} from "mongoose";

// available query filters.
interface QueryFilters {
    dbs: string[],
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

const province = loadCities(Country.ITALY)
    .filter(current => {
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

export class HeatMapRoute extends AbstractRoute {

    async handleRouteRequest(req: Request, res: Response): Promise<void> {

        const queryFilters: QueryFilters = {
            dbs:           readArrayFromQuery(req.query?.dbs),
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

        if (queryFilters.dbs.length === 0) {
            res.status(400);
            res.send(createMissingQueryParamResponse('dbs'));
            return;
        }

        if (!queryFilters.algorithm || queryFilters.algorithm.length === 0) {
            res.status(400);
            res.send(createMissingQueryParamResponse('algorithm'));
            return;
        }

        const filters = this.createFiltersPipeline(queryFilters);
        const data: HeatMap[] = [];

        try {

            for (const databaseName of queryFilters.dbs) {

                const database = getMongoConnection().useDb(databaseName);
                const result = await this.getFromDatabase(database, filters);

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

        return dbQuery.exec();
    }

    /**
     * Create the filters pipeline for the aggregation query.
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

        // date filters.
        if (dateFrom && dateTo) {
            filters = {
                ...filters,
                ...{
                    'created_at': {
                        $gte: new Date(dateFrom).toISOString(),
                        $lte: new Date(dateTo).toISOString()
                    }
                }};
        }

        // tags filters.
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

        // processed text filters.
        if (processedText && processedText.length > 0) {
            const processedTextFilters = processedText.map(text => {
                return {'spacy.processed_text': {$regex: new RegExp(text, 'i')}};
            });

            filters.$and = (filters.$and || []).concat(processedTextFilters);
        }

        // hashtags filters.
        if (hashtags && hashtags.length > 0) {
            const hashtagsFilters = hashtags.map(hashtag => {
                return {'twitter_entities.hashtags': {$regex: new RegExp(hashtag, 'i')}};
            });

            filters.$and = (filters.$and || []).concat(hashtagsFilters);
        }

        // usernames filters.
        if (usernames && usernames.length > 0) {
            const usernamesFilters = usernames.map(username => {
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