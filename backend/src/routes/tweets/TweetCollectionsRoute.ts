import {AbstractTweetRoute} from "./AbstractTweetRoute";
import {Request, Response} from "express";
import {createResponse, ResponseType} from "../IRoute";

export class TweetCollectionsRoute extends AbstractTweetRoute {

    private static TWEET_PATH = "/collections";

    tweetPath(): string {
        return TweetCollectionsRoute.TWEET_PATH;
    }

    performTweetRequest(req: Request, res: Response): void {
        try {
            AbstractTweetRoute.selectedDatabase.db.listCollections()
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