import {ITweetRoute} from "./ITweetRoute";
import {Request, Response} from "express";

export class TweetDatabasesRoute extends ITweetRoute {

    private static TWEET_PATH = "/dbs";

    tweetPath(): String {
        return TweetDatabasesRoute.TWEET_PATH;
    }

    perform(req: Request, res: Response): void {
        //TODO: implement...
        res.send('Route: ' + TweetDatabasesRoute.TWEET_PATH);
    }
}