import {AbstractRoute} from './AbstractRoute';
import {createMissingQueryParamResponse} from '../IRoute';
import {getMongoConnection, AnalyzedTweetSchema} from '../../database/database';
import {readArrayFromQuery} from '../../util/RequestUtil';

import {Request, Response} from 'express';
import emojiRegex from 'emoji-regex';
import {removeStopwords, ita} from 'stopword';

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

// The word must contain at least one letter and only alphanumeric characters.
const PATTERN = /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/;
const LIMIT = 50;

// noinspection DuplicatedCode
export class WordRoute extends AbstractRoute {

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

        const emojiRegexPattern = emojiRegex();
        let filters = this.createFiltersPipeline(queryFilters);
        let resultMap = new Map();

        try {

            for (const databaseName of dbs) {

                let database = getMongoConnection().useDb(databaseName);
                let model = database.model('Message', AnalyzedTweetSchema);

                let dbQuery = model.aggregate([
                    { $match: { processed: true, ...filters} },
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
                                        vars: { splitResult: { $split: ['$spacy.processed_text', ' POS : '] } },
                                        in: { $toLower: { $arrayElemAt: ['$$splitResult', 0] } }
                                    }
                                }
                                : queryFilters.type === 'tags'
                                    ? {
                                        $let: {
                                            vars: { splitResult: { $split: ['$tags.tag_me', ' : '] } },
                                            in: { $toLower: { $arrayElemAt: ['$$splitResult', 0] } }
                                        }
                                    }
                                    : queryFilters.type === 'hashtags'
                                        ? '$twitter_entities.hashtags'
                                        : {}
                            ,
                            count: { $sum: 1 }
                        }
                    },
                    { $project: { word: '$_id', count: 1, _id: 0 } },
                    { $match: { word: { $not: { $regex: /\s/ } } } }, // excludes all words that contains spaces.
                    { $sort: { count: -1 } }
                ]);

                let result = await dbQuery.exec();

                if (result && result.length > 0) {
                    for (const current of result) {

                        const obj = current as { word: string, count: number };
                        const {word} = obj;

                        if (word.length > 1 && PATTERN.test(word) && !emojiRegexPattern.test(obj.word)) {
                            const result = removeStopwords([word], ita);

                            if (result && result.length > 0) {
                                let word = obj.word.toLowerCase();
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
                .slice(0, LIMIT * dbs.length);

            res.send(result);

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
        return '/word';
    }

    getMethod(): string {
        return 'get';
    }
}