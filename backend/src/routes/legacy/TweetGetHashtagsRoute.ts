import {AnalyzedTweetSchema, IAnalyzedTweetData, AbstractTweetRoute} from './AbstractTweetRoute';
import {Request, Response} from 'express';
import {createMissingQueryParamResponse} from '../IRoute';

type RequestHandler = {
    db: string;
}

export class TweetGetHashtagsRoute extends AbstractTweetRoute {

    private static TWEET_PATH = "/getHashtags";

    tweetPath(): string {
        return TweetGetHashtagsRoute.TWEET_PATH;
    }

    async performTweetRequest(req: Request, res: Response): Promise<void> {
        const handler = req.query as RequestHandler;

        if (!handler.db) {
            res.status(400);
            res.send(createMissingQueryParamResponse("collection"));
            return;
        }

        try {
            const analyzedTweetModel = AbstractTweetRoute.selectedDatabase
                .model<IAnalyzedTweetData>(handler.db, AnalyzedTweetSchema);

            analyzedTweetModel.aggregate([
                {$group: {_id: "$twitter_entities"}}
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