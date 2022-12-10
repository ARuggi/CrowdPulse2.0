import {ITweetRoute} from "./ITweetRoute";
import {Request, Response} from "express";

export class TweetGetAnalyzedDataRoute extends ITweetRoute {

    private static TWEET_PATH = "/getAnalyzedData";

    tweetPath(): string {
        return TweetGetAnalyzedDataRoute.TWEET_PATH;
    }

    perform(req: Request, res: Response): void {
        //TODO: implement...
        res.send('Route: ' + TweetGetAnalyzedDataRoute.TWEET_PATH);
    }
}