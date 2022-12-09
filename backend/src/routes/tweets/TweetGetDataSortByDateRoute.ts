import {ITweetRoute} from "./ITweetRoute";
import {Request, Response} from "express";

export class TweetGetDataSortByDateRoute extends ITweetRoute {

    private static TWEET_PATH = "/getDataSortByDate";

    tweetPath(): String {
        return TweetGetDataSortByDateRoute.TWEET_PATH;
    }

    perform(req: Request, res: Response): void {
        //TODO: implement...
        res.send('Route: ' + TweetGetDataSortByDateRoute.TWEET_PATH);
    }
}