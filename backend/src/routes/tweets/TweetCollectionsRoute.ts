import {ITweetRoute} from "./ITweetRoute";
import {Request, Response} from "express";
import {createResponse, ResponseType} from "../IRoute";

export class TweetCollectionsRoute extends ITweetRoute {

    private static TWEET_PATH = "/collections";

    tweetPath(): string {
        return TweetCollectionsRoute.TWEET_PATH;
    }

    performTweetRequest(req: Request, res: Response): void {
        try {
            ITweetRoute.selectedDatabase.db.listCollections()
                .toArray()
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