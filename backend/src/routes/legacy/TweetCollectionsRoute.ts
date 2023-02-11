import {AbstractTweetRoute} from './AbstractTweetRoute';
import {Request, Response} from 'express';

export class TweetCollectionsRoute extends AbstractTweetRoute {

    private static TWEET_PATH = "/collections";

    tweetPath(): string {
        return TweetCollectionsRoute.TWEET_PATH;
    }

    async performTweetRequest(req: Request, res: Response): Promise<void> {
        try {
            AbstractTweetRoute.selectedDatabase.db.listCollections()
                .toArray()
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