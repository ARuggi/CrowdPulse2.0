import {AbstractRoute} from './AbstractRoute';
import {Request, Response} from 'express';
import {getMongoConnection} from '../../database/database';
import {getDatabasesFromQuery} from '../../util/RequestUtil';
import {AnalyzedTweetSchema, IAnalyzedTweetData} from "../legacy/AbstractTweetRoute";
import {createMissingQueryParamResponse} from "../IRoute";

export class SentimentRoute extends AbstractRoute {

    async handleRouteRequest(req: Request, res: Response): Promise<void> {
        let dbs = getDatabasesFromQuery(req);

        if (dbs.length === 0) {
            res.status(400);
            res.send(createMissingQueryParamResponse('dbs'));
            return;
        }

        let sentIt = {
            positive: 0,
            neutral:  0,
            negative: 0
        };

        let feelIt = {
            positive: 0,
            neutral:  0,
            negative: 0
        };

        try {

            for (const databaseName of dbs) {
                let database = getMongoConnection().useDb(databaseName);
                let model = database.model<IAnalyzedTweetData>("Message", AnalyzedTweetSchema);

                let currentResults = await model
                    .find({})
                    .allowDiskUse(true)
                    .lean()
                    .exec();

                currentResults.forEach(current => {
                    const {sentiment} = current;

                    if (sentiment) {
                        const sentItValue = this.getSentimentValue(sentiment, 'sent-it');
                        const feelItValue = this.getSentimentValue(sentiment, 'feel-it');

                        sentIt.positive += sentItValue.positive;
                        sentIt.neutral  += sentItValue.neutral;
                        sentIt.negative += sentItValue.negative;

                        feelIt.positive += feelItValue.positive;
                        feelIt.neutral  += feelItValue.neutral;
                        feelIt.negative += feelItValue.negative;
                    }
                });
            }

            res.send({
                sentIt: sentIt,
                feelIt: feelIt
            });

        } catch (error) {
            console.log(error)
            res.status(500);
            res.send({error: error.message});
        }
    }

    private getSentimentValue(sentiment: object, type: string) {
        let positive = 0;
        let neutral  = 0;
        let negative = 0;

        const typeContent = sentiment[type];

        if (typeContent) {
            switch (typeContent.sentiment) {
                case 'positive': positive++; break;
                case 'neutral':  neutral++;  break;
                case 'negative': negative++; break;
            }
        }

        return {positive: positive, neutral: neutral, negative: negative};
    }

    protected path(): string {
        return "/sentiment";
    }

    getMethod(): string {
        return "get";
    }
}