import {DatabasesResponse} from './DatabasesResponse';
import {SentimentResponse} from './SentimentResponse';
import {SentimentTimelineResponse} from './SentimentTimelineResponse';
import {WordResponse} from './WordResponse';

type BodyGet = {
    key: string,
    value: string
}

async function apiCall<Type> (method: string, url: string, body: any = null): Promise<Type | null> {
    if (url.indexOf('undefined') !== -1 || url.indexOf('null') !== -1) return null

    const options: RequestInit = { method }

    if (body) {
        if (method.toUpperCase() === 'GET') {
            body = body as Array<BodyGet>;
            if (body.length > 0) {
                const searchParams = new URLSearchParams();

                body.forEach((current: BodyGet) => {
                    searchParams.append(current.key, current.value);
                })

                url += '?' + searchParams.toString();
            }
        } else { // For other method requests, set body as json.
            options.body = JSON.stringify(body)
            options.headers = { 'Content-Type': 'application/json' }
        }
    }

    let responseBody
    try {
        const response = await fetch(url, options)
        responseBody = await response.json()
        return responseBody as Type
    } catch (e: any) {
        throw new Error(responseBody || e.toString())
    }
}

const api = {

    /**
     * Gets information about the remote databases of MongoDB.
     * Endpoint: GET - /v1/databases
     * @param dbs Specify a database filter or keep it empty.
     */
    GetDatabases(dbs: string[] | null = null): Promise<DatabasesResponse | null> {
        let body: Array<BodyGet> | null = null;

        if (dbs && dbs.length > 0)  {
            body = [];
            dbs.forEach((database) => {
                body?.push({key: 'dbs', value: database});
            });
        }

        return apiCall<DatabasesResponse>('GET', '/v1/databases', body);
    },

    /**
     * Gets information about sentiments.
     * Endpoint: GET - /v1/sentiment
     * @param dbs Specify an array of database names.
     * @param algorithm sent-it (default value) or feel-it.
     * @param dateFrom ISO date like 2022-01-09T00:00:00.000Z (dateTo required).
     * @param dateTo ISO date like 2022-01-09T00:00:00.000Z (dateFrom required).
     * @param tags An array of tags
     * @param processedText An array processed words
     * @param hashtags An array of hashtags (without #)
     * @param usernames An array of usernames.
     */
    GetSentiment(dbs: string[],
                 algorithm: string = 'sent-it',
                 dateFrom:  Date | undefined = undefined,
                 dateTo:    Date | undefined = undefined,
                 tags:          string[] | undefined = undefined,
                 processedText: string[] | undefined = undefined,
                 hashtags:      string[] | undefined = undefined,
                 usernames:     string[] | undefined = undefined): Promise<SentimentResponse | null> {
        let body: Array<BodyGet> = [];

        dbs.forEach((database) => {
            body.push({key: 'dbs', value: database});
        });

        body.push({key: 'algorithm', value: algorithm});

        if (dateFrom && dateTo) {
            body.push({key: 'dateFrom', value: dateFrom.toISOString()});
            body.push({key: 'dateTo', value: dateTo.toISOString()});
        }

        if (tags && tags.length > 0) {
            tags.forEach((tag) => {
                body.push({key: 'tags', value: tag});
            });
        }

        if (processedText && processedText.length > 0) {
            processedText.forEach((text) => {
                body.push({key: 'processedText', value: text});
            });
        }

        if (hashtags && hashtags.length > 0) {
            hashtags.forEach((hashtag) => {
                body.push({key: 'hashtags', value: hashtag});
            });
        }

        if (usernames && usernames.length > 0) {
            usernames.forEach((username) => {
                body.push({key: 'usernames', value: username});
            });
        }

        return apiCall<SentimentResponse>('GET', '/v1/sentiment', body);
    },

    /**
     * Gets information about sentiments.
     * Endpoint: GET - /v1/sentiment
     * @param dbs Specify an array of database names.
     * @param algorithm sent-it (default value) or feel-it.
     * @param dateFrom ISO date like 2022-01-09T00:00:00.000Z (dateTo required).
     * @param dateTo ISO date like 2022-01-09T00:00:00.000Z (dateFrom required).
     * @param tags An array of tags
     * @param processedText An array processed words
     * @param hashtags An array of hashtags (without #)
     * @param usernames An array of usernames.
     */
    GetSentimentTimeline(dbs: string[],
                         algorithm: string = 'sent-it',
                         dateFrom:  Date | undefined = undefined,
                         dateTo:    Date | undefined = undefined,
                         tags:          string[] | undefined = undefined,
                         processedText: string[] | undefined = undefined,
                         hashtags:      string[] | undefined = undefined,
                         usernames:     string[] | undefined = undefined): Promise<SentimentTimelineResponse | null> {
        let body: Array<BodyGet> = [];

        dbs.forEach((database) => {
            body.push({key: 'dbs', value: database});
        });

        body.push({key: 'algorithm', value: algorithm});

        if (dateFrom && dateTo) {
            body.push({key: 'dateFrom', value: dateFrom.toISOString()});
            body.push({key: 'dateTo', value: dateTo.toISOString()});
        }

        if (tags && tags.length > 0) {
            tags.forEach((tag) => {
                body.push({key: 'tags', value: tag});
            });
        }

        if (processedText && processedText.length > 0) {
            processedText.forEach((text) => {
                body.push({key: 'processedText', value: text});
            });
        }

        if (hashtags && hashtags.length > 0) {
            hashtags.forEach((hashtag) => {
                body.push({key: 'hashtags', value: hashtag});
            });
        }

        if (usernames && usernames.length > 0) {
            usernames.forEach((username) => {
                body.push({key: 'usernames', value: username});
            });
        }

        return apiCall<SentimentTimelineResponse>('GET', '/v1/sentiment/timeline', body);
    },

    /**
     * Gets information about sentiments.
     * Endpoint: GET - /v1/sentiment
     * @param dbs Specify an array of database names.
     * @param algorithm all (default value), sent-it or feel-it.
     * @param sentiment The sentiment: 'all', 'positive', 'neutral' or 'negative'.
     * @param emotion (Only if algorithm = 'feel-it'): 'all', 'joy', 'sadness', 'anger', 'fear'.
     * @param type 'text', 'tags' or 'hashtags'.
     * @param dateFrom ISO date like 2022-01-09T00:00:00.000Z (dateTo required).
     * @param dateTo ISO date like 2022-01-09T00:00:00.000Z (dateFrom required).
     * @param tags An array of tags
     * @param processedText An array processed words
     * @param hashtags An array of hashtags (without #)
     * @param usernames An array of usernames.
     */
    GetWord(dbs: string[],
            algorithm: string = 'all',
            sentiment: string = 'all',
            emotion: string = 'all',
            type: string = 'text',
            dateFrom:  Date | undefined = undefined,
            dateTo:    Date | undefined = undefined,
            tags:          string[] | undefined = undefined,
            processedText: string[] | undefined = undefined,
            hashtags:      string[] | undefined = undefined,
            usernames:     string[] | undefined = undefined): Promise<WordResponse | null> {
        let body: Array<BodyGet> = [];

        dbs.forEach((database) => {
            body.push({key: 'dbs', value: database});
        });

        body.push({key: 'algorithm', value: algorithm});
        body.push({key: 'sentiment', value: sentiment});
        body.push({key: 'type',      value: type});
        body.push({key: 'emotion',   value: emotion})

        if (dateFrom && dateTo) {
            body.push({key: 'dateFrom', value: dateFrom.toISOString()});
            body.push({key: 'dateTo', value: dateTo.toISOString()});
        }

        if (tags && tags.length > 0) {
            tags.forEach((tag) => {
                body.push({key: 'tags', value: tag});
            });
        }

        if (processedText && processedText.length > 0) {
            processedText.forEach((text) => {
                body.push({key: 'processedText', value: text});
            });
        }

        if (hashtags && hashtags.length > 0) {
            hashtags.forEach((hashtag) => {
                body.push({key: 'hashtags', value: hashtag});
            });
        }

        if (usernames && usernames.length > 0) {
            usernames.forEach((username) => {
                body.push({key: 'usernames', value: username});
            });
        }

        return apiCall<WordResponse>('GET', '/v1/word', body);
    }
}

export default api;