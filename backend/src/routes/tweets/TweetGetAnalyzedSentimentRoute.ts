import {ITweetRoute} from "./ITweetRoute";
import {Request, Response} from "express";

export class TweetGetAnalyzedSentimentRoute extends ITweetRoute {

    private static TWEET_PATH = "/getAnalyzedSentiment";

    tweetPath(): String {
        return TweetGetAnalyzedSentimentRoute.TWEET_PATH;
    }

    perform(req: Request, res: Response): void {
        //TODO: implement...
        res.send('Route: ' + TweetGetAnalyzedSentimentRoute.TWEET_PATH);
    }
}