import {ITweetRoute} from "./ITweetRoute";
import {Request, Response} from "express";

export class TweetGetDataTimelinesRoute extends ITweetRoute {

    private static TWEET_PATH = "/getDataTimelines";

    tweetPath(): string {
        return TweetGetDataTimelinesRoute.TWEET_PATH;
    }

    perform(req: Request, res: Response): void {
        //TODO: implement...
        res.send('Route: ' + TweetGetDataTimelinesRoute.TWEET_PATH);
    }
}