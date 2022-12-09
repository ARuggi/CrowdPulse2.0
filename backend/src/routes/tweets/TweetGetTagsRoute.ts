import {ITweetRoute} from "./ITweetRoute";
import {Request, Response} from "express";

export class TweetGetTagsRoute extends ITweetRoute {

    private static TWEET_PATH = "/getTags";

    tweetPath(): String {
        return TweetGetTagsRoute.TWEET_PATH;
    }

    perform(req: Request, res: Response): void {
        //TODO: implement...
        res.send('Route: ' + TweetGetTagsRoute.TWEET_PATH);
    }
}