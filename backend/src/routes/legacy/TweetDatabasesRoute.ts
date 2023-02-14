import {AbstractTweetRoute} from './AbstractTweetRoute';
import {Request, Response} from 'express';
import {getAdminConnection} from '../../database/database';
import {
    isCrowdPulseCollection,
    getDatabaseCollectionsInfo,
    isReservedDatabase
} from '../../util/DatabaseUtil';

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
            let listDatabases = await getAdminConnection().db.admin().listDatabases();
            listDatabases.databases = listDatabases.databases.filter((database) => !isReservedDatabase(database.name));
            let result: ResultType[] = [];

            for (const database of listDatabases.databases) {
                let collections: any[] = await getDatabaseCollectionsInfo(database.name);
                collections = collections.filter(collection => isCrowdPulseCollection(collection));

                if (collections.length > 0) {
                    result.push(database as unknown as ResultType);
                }
            }

            res.send({databases: result});
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