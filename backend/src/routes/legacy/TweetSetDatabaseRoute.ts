import {AbstractTweetRoute} from './AbstractTweetRoute';
import {Request, Response} from 'express';
import {createMissingBodyParamResponse} from '../IRoute';

type RequestHandler = {
    mongodb: string;
}

export class TweetSetDatabaseRoute extends AbstractTweetRoute {

    private static TWEET_PATH = "/setDbs";

    getMethod(): string {
        return "get";
    }

    tweetPath(): string {
        return TweetSetDatabaseRoute.TWEET_PATH;
    }

    async performTweetRequest(req: Request, res: Response): Promise<void> {
        const handler = req.query as RequestHandler;

        if (!handler.mongodb) {
            res.status(400);
            res.send(createMissingBodyParamResponse("database"));
            return;
        }

        try {

            AbstractTweetRoute.selectedDatabase = super.getMongoConnection().useDb(handler.mongodb);
            res.send({selected: handler.mongodb});

        } catch (error) {
            console.error(error);
            res.status(500);
            res.send({error: error.message});
        }
    }

    checkIntegrity(req: Request, res: Response): boolean {
        // Nothing to do, avoid the checking.
        return true;
    }

}