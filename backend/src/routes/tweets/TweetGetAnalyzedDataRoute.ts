import {AnalyzedTweetSchema, IAnalyzedTweetData, ITweetRoute} from "./ITweetRoute";
import {Request, Response} from "express";
import {createMissingQueryParamResponse, createResponse, ResponseType} from "../IRoute";

type RequestHandler = {
    collection: string;
}

export class TweetGetAnalyzedDataRoute extends ITweetRoute {

    private static TWEET_PATH = "/getAnalyzedData";

    tweetPath(): string {
        return TweetGetAnalyzedDataRoute.TWEET_PATH;
    }

    //TODO: check why TweetGetAnalyzedSentimentDatesRoute has the same behavior
    performTweetRequest(req: Request, res: Response): void {
        const handler = req.query as RequestHandler;

        if (!handler.collection) {
            res.send(createMissingQueryParamResponse("collection"));
            return;
        }

        try {
            const analyzedTweetModel = ITweetRoute.selectedDatabase
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