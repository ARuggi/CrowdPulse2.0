import {AbstractTweetRoute} from "./AbstractTweetRoute";
import {Request, Response} from "express";
import {createResponse, ResponseType} from "../IRoute";
import {getAdminConnection} from "../../database/database";
import {asyncFilter} from '../../util/AsyncUtil';

type ResultType = {
    databases: Array<{
        name: string,
        sizeOnDisk: number,
        empty: boolean
    }>
}

export class TweetDatabasesRoute extends AbstractTweetRoute {

    private static TWEET_PATH = "/dbs";

    tweetPath(): string {
        return TweetDatabasesRoute.TWEET_PATH;
    }

    async performTweetRequest(req: Request, res: Response): Promise<void> {
        try {
            getAdminConnection()
                .db
                .admin()
                .listDatabases(async (error, result: ResultType) => {

                    if (error) {
                        throw error;
                    }

                    result.databases = await asyncFilter(result.databases, async (database) => {

                        switch (database.name) {
                            case "admin":
                            case "config":
                            case "local":
                                return false;
                            default:
                                break;
                        }

                        return await this.getDatabaseCollections(database)
                            .then((result) => {
                                return !result
                                    .filter(r => {
                                        return r!.name == "Message" && r!.type == "collection";
                                    }).empty;
                            });
                    });

                    console.log(result);
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

    private async getDatabaseCollections(database): Promise<any> {
        let collection = super.getMongoConnection()
            .useDb(database.name)
            .db
            .listCollections();

        return await collection
            .toArray()
            .catch(() => {return [];})
            .then((result) => {return result;});
    }
}