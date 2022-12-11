import {ITweetRoute} from "./ITweetRoute";
import {Request, Response} from "express";
import {getMongoConnection} from "../../database/database";
import {createMissingBodyParamResponse, createResponse, ResponseType} from "../IRoute";

type RequestHandler = {
    mongodb: string;
}

export class TweetSetDatabaseRoute extends ITweetRoute {

    private static TWEET_PATH = "/setDbs";

    method(): string {
        return "post";
    }

    tweetPath(): string {
        return TweetSetDatabaseRoute.TWEET_PATH;
    }

    performTweetRequest(req: Request, res: Response): void {
        const handler = req.body as RequestHandler;

        if (!handler.mongodb) {
            res.send(createMissingBodyParamResponse("mongodb"));
            return;
        }

        try {

            ITweetRoute.selectedDatabase = getMongoConnection().useDb(handler.mongodb);
            res.send(createResponse(ResponseType.OK, undefined, {selected: handler.mongodb}));

        } catch (error) {
            console.error(error);
            res.status(500);
            res.send(createResponse(ResponseType.KO, error.message));
        }
    }

    checkIntegrity(req: Request, res: Response): boolean {
        // Nothing to do, avoid the checking.
        return true;
    }

}