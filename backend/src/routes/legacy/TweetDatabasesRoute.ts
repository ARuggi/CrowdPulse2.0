import {AbstractTweetRoute} from './AbstractTweetRoute';
import {Request, Response} from 'express';
import {createResponse, ResponseType} from '../IRoute';
import {getAdminConnection} from '../../database/database';
import {asyncFilter} from '../../util/AsyncUtil';
import {isReservedDatabase} from '../../util/DatabaseUtil';

type ResultType = {
    databases: Array<{
        name: string,       // Database name
        sizeOnDisk: number, // Size in Kbps
        empty: boolean      // True if it is an empty database
    }>
}

// noinspection DuplicatedCode
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

                        if (isReservedDatabase(database.name)) {
                            return false;
                        }

                        return await this.getDatabaseCollections(database)
                            .then((result) => {
                                return !result
                                    .filter(r => {
                                        return r.name == "Message" && r.type == "collection";
                                    }).empty;
                            });
                    });

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
        const collection = super.getMongoConnection()
            .useDb(database.name)
            .db
            .listCollections();

        return await collection
            .toArray()
            .catch(() => {return [];})
            .then((result) => {return result;});
    }
}