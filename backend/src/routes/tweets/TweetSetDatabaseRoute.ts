import {ITweetRoute} from "./ITweetRoute";
import {Request, Response} from "express";

export class TweetSetDatabaseRoute extends ITweetRoute {

    private static TWEET_PATH = "/setDbs";

    tweetPath(): String {
        return TweetSetDatabaseRoute.TWEET_PATH;
    }

    perform(req: Request, res: Response): void {
        //TODO: implement...
        res.send('Route: ' + TweetSetDatabaseRoute.TWEET_PATH);
    }
}