import {AnalyzedTweetSchema, IAnalyzedTweetData, AbstractTweetRoute} from "./AbstractTweetRoute";
import {Request, Response} from "express";
import {createMissingQueryParamResponse, createResponse, ResponseType} from "../IRoute";

type RequestHandler = {
    collection: string;
}

export class TweetGetDataTimelinesRoute extends AbstractTweetRoute {

    private static TWEET_PATH = "/getDataTimelines";

    tweetPath(): string {
        return TweetGetDataTimelinesRoute.TWEET_PATH;
    }

    performTweetRequest(req: Request, res: Response): void {
        const handler = req.query as RequestHandler;

        if (!handler.collection) {
            res.send(createMissingQueryParamResponse("collection"));
            return;
        }

        try {
            const analyzedTweetModel = AbstractTweetRoute.selectedDatabase
                .model<IAnalyzedTweetData>(handler.collection, AnalyzedTweetSchema);

            //TODO: Does not work
            analyzedTweetModel.aggregate([{
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: 'ISODATE("$created_at")'
                        }
                    }
                }
            }], (error, result) => {

                if (error) {
                    throw error;
                }

                res.send(createResponse(ResponseType.OK, undefined, result));
            }).allowDiskUse(true);
        } catch (error) {
            console.error(error);
            res.status(500);
            res.send(createResponse(ResponseType.KO, error.message));
        }
    }
}