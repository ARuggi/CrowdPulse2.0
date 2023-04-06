import {AbstractRoute} from './AbstractRoute';
import {createMissingQueryParamResponse} from '../IRoute';
import {getMongoConnection, AnalyzedTweetSchema} from '../../database/database';
import {readArrayFromQuery} from '../../util/RequestUtil';

import {Request, Response} from 'express';
import emojiRegex from 'emoji-regex';
import {removeStopwords, ita} from 'stopword';
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

const EMOJI_REGEX = emojiRegex();

// The word must contain at least one letter and only alphanumeric characters.
const PATTERN = /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/;
const LIMIT = 50;

export class WordRoute extends AbstractRoute {

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

        // send an error if the query is missing the 'dbs' parameter.
        if (queryFilters.dbs.length === 0) {
            res.status(400);
            res.send(createMissingQueryParamResponse('dbs'));
            return;
        }

        const resultMap = new Map();

        try {

            for (const databaseName of queryFilters.dbs) {

                const database = getMongoConnection().useDb(databaseName);
                const result = await this.getFromDatabase(database, queryFilters);

                if (result && result.length > 0) {
                    for (const current of result) {

                        const obj = current as { word: string, count: number };
                        const {word} = obj;

                        //
                        if (word.length > 1 && PATTERN.test(word) && !EMOJI_REGEX.test(obj.word)) {
                            const result = removeStopwords([word], ita);

                            if (result && result.length > 0) {
                                const word = obj.word.toLowerCase();
                                let count = obj.count;

                                if (resultMap.has(word)) {
                                    count += resultMap.get(word);
                                }

                                resultMap.set(word, count);
                            }
                        }
                    }
                }
            }

            let result = [];

            resultMap.forEach((count, word) => {
                result.push({text: word, value: count})
            });

            result = result
                .sort((a, b) => b.value - a.value)
                .slice(0, LIMIT * queryFilters.dbs.length);

            res.send(result);

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
                    processed: true,
                    ...filters
                }
            },
            {
                $unwind: queryFilters.type === 'text'
                    ? '$spacy.processed_text'
                    : queryFilters.type === 'tags'
                        ? '$tags.tag_me'
                        : queryFilters.type === 'hashtags'
                            ? '$twitter_entities.hashtags'
                            : ''
            },
            {
                $group: {
                    _id: queryFilters.type === 'text'
                        ? {
                            $let: {
                                vars: {splitResult: {$split: ['$spacy.processed_text', ' POS : ']}},
                                in: {$toLower: {$arrayElemAt: ['$$splitResult', 0]}}
                            }
                        }
                        : queryFilters.type === 'tags'
                            ? {
                                $let: {
                                    vars: {splitResult: {$split: ['$tags.tag_me', ' : ']}},
                                    in: {$toLower: {$arrayElemAt: ['$$splitResult', 0]}}
                                }
                            }
                            : queryFilters.type === 'hashtags'
                                ? '$twitter_entities.hashtags'
                                : {}
                    ,
                    count: {$sum: 1}
                }
            },
            {$project: {word: '$_id', count: 1, _id: 0}},
            {$match: {word: {$not: {$regex: /\s/}}}}, // excludes all words that contains spaces.
            {$sort: {count: -1}}
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
        return '/word';
    }

    getMethod(): string {
        return 'get';
    }
}