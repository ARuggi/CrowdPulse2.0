import {ITweetRoute} from "./ITweetRoute";
import {Request, Response} from "express";
import {getMongoConnection} from "../../database/database";
import {createResponse, ResponseType} from "../IRoute";

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

    perform(req: Request, res: Response): void {
        const handler = req.body as RequestHandler;

        if (!handler.mongodb) {
            res.send(createResponse(ResponseType.KO,"missing 'mongodb' as query param"));
            return;
        }

        try {

            ITweetRoute.selectedDatabase = getMongoConnection().useDb(handler.mongodb);
            res.send(createResponse(ResponseType.OK, undefined, {selected: handler.mongodb}));

        } catch (error) {
            console.error(error);
            res.send(createResponse(ResponseType.KO, error.message));
        }
    }
}