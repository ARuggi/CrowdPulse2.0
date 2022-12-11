import {AnalyzedTweetSchema, IAnalyzedTweetData, ITweetRoute} from "./ITweetRoute";
import {Request, Response} from "express";
import {createMissingBodyParamResponse, createResponse, ResponseType} from "../IRoute";

type RequestHandler = {
    collection: string;
}

export class TweetGetUsersRoute extends ITweetRoute {

    private static TWEET_PATH = "/getUsers";

    tweetPath(): string {
        return TweetGetUsersRoute.TWEET_PATH;
    }

    performTweetRequest(req: Request, res: Response): void {
        const handler = req.body as RequestHandler;

        if (!handler.collection) {
            res.send(createMissingBodyParamResponse("collection"));
            return;
        }

        try {
            const analyzedTweetModel = ITweetRoute.selectedDatabase
                .model<IAnalyzedTweetData>(handler.collection, AnalyzedTweetSchema);

            analyzedTweetModel.aggregate([
                {$group: {_id: "$author_name"}}
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