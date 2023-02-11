import {AnalyzedTweetSchema, IAnalyzedTweetData, AbstractTweetRoute} from './AbstractTweetRoute';
import {Request, Response} from 'express';
import {createMissingQueryParamResponse} from '../IRoute';

type RequestHandler = {
    collection: string;
}

export class TweetGetUsersRoute extends AbstractTweetRoute {

    private static TWEET_PATH = "/getUsers";

    tweetPath(): string {
        return TweetGetUsersRoute.TWEET_PATH;
    }

    async performTweetRequest(req: Request, res: Response): Promise<void> {
        const handler = req.query as RequestHandler;

        if (!handler.collection) {
            res.status(400);
            res.send(createMissingQueryParamResponse("collection"));
            return;
        }

        try {
            const analyzedTweetModel = AbstractTweetRoute.selectedDatabase
                .model<IAnalyzedTweetData>(handler.collection, AnalyzedTweetSchema);

            analyzedTweetModel.aggregate([
                {$group: {_id: "$author_name"}}
            ], (error, result) => {

                if (error) {
                    throw error;
                }

                res.send(result);
            }).allowDiskUse(true);
        } catch (error) {
            console.error(error);
            res.status(500);
            res.send({error: error.message});
        }
    }
}