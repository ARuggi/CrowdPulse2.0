import {AbstractRoute} from './AbstractRoute';
import {Request, Response} from 'express';
import {getMongoConnection} from '../../database/database';
import {getDatabasesFromQuery} from '../../util/RequestUtil';
import {AnalyzedTweetSchema, IAnalyzedTweetData} from "../legacy/AbstractTweetRoute";

export class SentimentRoute extends AbstractRoute {

    async handleRouteRequest(req: Request, res: Response): Promise<void> {
        let dbs = getDatabasesFromQuery(req);
        let result = [];

        try {

            for (const databaseName of dbs) {
                let database = getMongoConnection().useDb(databaseName);
                let model = database.model<IAnalyzedTweetData>("Message", AnalyzedTweetSchema);

                let currentResults = await model
                    .find({})
                    .allowDiskUse(true)
                    .lean();

                currentResults.forEach(current => result.push(current));
            }

            res.send(result);

        } catch (error) {
            console.log(error)
            res.status(500);
            res.send({error: error.message});
        }
    }

    protected path(): string {
        return "/sentiment";
    }

    getMethod(): string {
        return "get";
    }
}