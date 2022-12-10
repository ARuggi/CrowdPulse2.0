import {ITweetRoute} from "./ITweetRoute";
import {Request, Response} from "express";

export class TweetGetUsersRoute extends ITweetRoute {

    private static TWEET_PATH = "/getUsers";

    tweetPath(): string {
        return TweetGetUsersRoute.TWEET_PATH;
    }

    perform(req: Request, res: Response): void {
        //TODO: implement...
        res.send('Route: ' + TweetGetUsersRoute.TWEET_PATH);
    }
}