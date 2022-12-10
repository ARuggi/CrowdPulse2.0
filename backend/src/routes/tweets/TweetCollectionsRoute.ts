import {ITweetRoute} from "./ITweetRoute";
import {Request, Response} from "express";

export class TweetCollectionsRoute extends ITweetRoute {

    private static TWEET_PATH = "/collections";

    tweetPath(): string {
        return TweetCollectionsRoute.TWEET_PATH;
    }

    perform(req: Request, res: Response): void {
        //TODO: implement...
        res.send('Route: ' + TweetCollectionsRoute.TWEET_PATH);
    }
}