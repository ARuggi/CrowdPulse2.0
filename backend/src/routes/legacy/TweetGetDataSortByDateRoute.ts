import {AnalyzedTweetSchema, IAnalyzedTweetData, AbstractTweetRoute} from './AbstractTweetRoute';
import {Request, Response} from 'express';
import {createMissingQueryParamResponse, createResponse, ResponseType} from '../IRoute';

type RequestHandler = {
    collection: string;
}

export class TweetGetDataSortByDateRoute extends AbstractTweetRoute {

    private static TWEET_PATH = "/getDataSortByDate";

    tweetPath(): string {
        return TweetGetDataSortByDateRoute.TWEET_PATH;
    }

    async performTweetRequest(req: Request, res: Response): Promise<void> {
        const handler = req.query as RequestHandler;

        if (!handler.collection) {
            res.send(createMissingQueryParamResponse("collection"));
            return;
        }

        try {
            const analyzedTweetModel = AbstractTweetRoute.selectedDatabase
                .model<IAnalyzedTweetData>(handler.collection, AnalyzedTweetSchema);

            analyzedTweetModel
                .find()
                .lean()
                .sort("created_at")
                .allowDiskUse(true)
                .catch(error => {
                    throw error;
                })
                .then(result => {
                    res.send(createResponse(ResponseType.OK, undefined, result));
                });
        } catch (error) {
            console.error(error);
            res.status(500);
            res.send(createResponse(ResponseType.KO, error.message));
        }
    }
}