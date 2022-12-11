import {ITweetRoute} from "./ITweetRoute";
import {Request, Response} from "express";
import {createResponse, ResponseType} from "../IRoute";
import {getAdminConnection} from "../../database/database";

export class TweetDatabasesRoute extends ITweetRoute {

    private static TWEET_PATH = "/dbs";

    tweetPath(): string {
        return TweetDatabasesRoute.TWEET_PATH;
    }

    performTweetRequest(req: Request, res: Response): void {
        try {
            getAdminConnection().db.admin().listDatabases((error, result) => {

                if (error) {
                    throw error;
                }

                res.send(createResponse(ResponseType.OK, undefined, result));
            });
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