import {AnalyzedTweetSchema, IAnalyzedTweetData, AbstractTweetRoute} from "./AbstractTweetRoute";
import {Request, Response} from "express";
import {createMissingQueryParamResponse, createResponse, ResponseType} from "../IRoute";

type RequestHandler = {
    collection: string;
}

export class TweetGetAnalyzedDataRoute extends AbstractTweetRoute {

    private static TWEET_PATH = "/getAnalyzedData";

    tweetPath(): string {
        return TweetGetAnalyzedDataRoute.TWEET_PATH;
    }

    //TODO: check why TweetGetAnalyzedSentimentDatesRoute has the same behavior
    async performTweetRequest(req: Request, res: Response): Promise<void> {
        const handler = req.query as RequestHandler;

        if (!handler.collection) {
            res.send(createMissingQueryParamResponse("collection"));
            return;
        }

        try {
            const analyzedTweetModel = AbstractTweetRoute.selectedDatabase
                .model<IAnalyzedTweetData>(handler.collection, AnalyzedTweetSchema);

            analyzedTweetModel
                .find({}, {timeout: false})
                .lean()
                .catch(error => {
                    throw error;
                })
                .then(result => {
                    res.send(createResponse(ResponseType.OK, undefined, result));
                });
        } catch (error) {
            console.error(error);
            res.status(500);
            res.send(createResponse(ResponseType.KO, error.message));
        }
    }
}