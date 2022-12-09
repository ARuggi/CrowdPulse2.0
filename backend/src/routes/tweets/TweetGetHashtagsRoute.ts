import {ITweetRoute} from "./ITweetRoute";
import {Request, Response} from "express";

export class TweetGetHashtagsRoute extends ITweetRoute {

    private static TWEET_PATH = "/getHashtags";

    tweetPath(): String {
        return TweetGetHashtagsRoute.TWEET_PATH;
    }

    perform(req: Request, res: Response): void {
        //TODO: implement...
        res.send('Route: ' + TweetGetHashtagsRoute.TWEET_PATH);
    }
}