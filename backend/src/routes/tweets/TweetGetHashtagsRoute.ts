import {AnalyzedTweetSchema, IAnalyzedTweetData, AbstractTweetRoute} from "./AbstractTweetRoute";
import {Request, Response} from "express";
import {createMissingQueryParamResponse, createResponse, ResponseType} from "../IRoute";

type RequestHandler = {
    collection: string;
}

export class TweetGetHashtagsRoute extends AbstractTweetRoute {

    private static TWEET_PATH = "/getHashtags";

    tweetPath(): string {
        return TweetGetHashtagsRoute.TWEET_PATH;
    }

    performTweetRequest(req: Request, res: Response): void {
        const handler = req.query as RequestHandler;

        if (!handler.collection) {
            res.send(createMissingQueryParamResponse("collection"));
            return;
        }

        try {
            const analyzedTweetModel = AbstractTweetRoute.selectedDatabase
                .model<IAnalyzedTweetData>(handler.collection, AnalyzedTweetSchema);

            analyzedTweetModel.aggregate([
                {$group: {_id: "$twitter_entities"}}
            ], (error, result) => {

                if (error) {
                    throw error;
                }

                res.send(createResponse(ResponseType.OK, undefined, result));
            }).allowDiskUse(true);
        } catch (error) {
            console.error(error);
            res.status(500);
            res.send(createResponse(ResponseType.KO, error.message));
        }
    }
}