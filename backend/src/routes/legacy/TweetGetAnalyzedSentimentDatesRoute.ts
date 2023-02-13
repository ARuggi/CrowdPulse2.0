import {AnalyzedTweetSchema, IAnalyzedTweetData, AbstractTweetRoute} from './AbstractTweetRoute';
import {Request, Response} from 'express';
import {createMissingQueryParamResponse} from '../IRoute';

type RequestHandler = {
    db: string;
}

export class TweetGetAnalyzedSentimentDatesRoute extends AbstractTweetRoute {

    private static TWEET_PATH = "/getAnalyzedSentimentDates";

    tweetPath(): string {
        return TweetGetAnalyzedSentimentDatesRoute.TWEET_PATH;
    }

    //TODO: check why TweetGetAnalyzedDataRoute has the same behavior
    async performTweetRequest(req: Request, res: Response): Promise<void> {
        const handler = req.query as RequestHandler;

        if (!handler.db) {
            res.status(400);
            res.send(createMissingQueryParamResponse("collection"));
            return;
        }

        try {
            const analyzedTweetModel = AbstractTweetRoute.selectedDatabase
                .model<IAnalyzedTweetData>(handler.db, AnalyzedTweetSchema);

            analyzedTweetModel
                .find({}, {timeout: false})
                .lean()
                .catch(error => {
                    throw error;
                })
                .then(result => {

                    let negative = 0;
                    let positive = 0;
                    let neutral = 0;

                    // Fixed issue: the original code won't check if "sent-it" exists.
                    result.forEach(value => {
                        let sentIt = value.sentiment["sent-it"];
                        if (sentIt) {
                            const sentiment = sentIt.sentiment;
                            switch (sentiment) {
                                case "negative": negative++; break;
                                case "positive": positive++; break;
                                default: neutral++; break;
                            }
                        }
                    });

                    let data = {positive, negative, neutral};
                    res.send(data);
                });
        } catch (error) {
            console.error(error);
            res.status(500);
            res.send({error: error.message});
        }
    }
}