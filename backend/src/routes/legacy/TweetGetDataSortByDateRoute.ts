import {AbstractTweetRoute} from './AbstractTweetRoute';
import {Request, Response} from 'express';
import {createMissingQueryParamResponse} from '../IRoute';
import {AnalyzedTweetSchema} from "../../database/database";

type RequestHandler = {
    db: string;
}

export class TweetGetDataSortByDateRoute extends AbstractTweetRoute {

    private static TWEET_PATH = "/getDataSortByDate";

    tweetPath(): string {
        return TweetGetDataSortByDateRoute.TWEET_PATH;
    }

    async performTweetRequest(req: Request, res: Response): Promise<void> {
        const handler = req.query as RequestHandler;

        if (!handler.db) {
            res.status(400);
            res.send(createMissingQueryParamResponse("collection"));
            return;
        }

        try {
            const analyzedTweetModel = AbstractTweetRoute.selectedDatabase.model(handler.db, AnalyzedTweetSchema);

            analyzedTweetModel
                .find()
                .lean()
                .sort("created_at")
                .allowDiskUse(true)
                .catch(error => {
                    throw error;
                })
                .then(result => {
                    res.send(result);
                });
        } catch (error) {
            console.error(error);
            res.status(500);
            res.send({error: error.message});
        }
    }
}