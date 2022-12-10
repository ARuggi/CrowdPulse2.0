import {ITweetRoute} from "./ITweetRoute";
import {Request, Response} from "express";

export class TweetGetAnalyzedSentimentDatesRoute extends ITweetRoute {

    private static TWEET_PATH = "/getAnalyzedSentimentDates";

    tweetPath(): string {
        return TweetGetAnalyzedSentimentDatesRoute.TWEET_PATH;
    }

    perform(req: Request, res: Response): void {
        //TODO: implement...
        res.send('Route: ' + TweetGetAnalyzedSentimentDatesRoute.TWEET_PATH);
    }
}