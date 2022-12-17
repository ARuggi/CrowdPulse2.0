import {AbstractTweetRoute} from "./AbstractTweetRoute";
import {Request, Response} from "express";
import {createResponse, ResponseType} from "../IRoute";
import {getAdminConnection} from "../../database/database";
import {asyncFilter} from '../../util/AsyncUtil';

type ResultType = {
    databases: Array<{
        name: string,       // Database name
        sizeOnDisk: number, // Size in Kbps
        empty: boolean      // True if it is an empty database
        info: {
            version: string,         // The data version
            targetVersion: number,   // 0 for legacy twitter database, 1+ for newer
            releaseDate: Date,       // The release date YYYY-MM-DD
            lastUpdateDate: Date,    // The last update date YYYY-MM-DD
            htmlDescription: string, // Html description
            icon: string,            // Base64 icon
        }
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

                        if (!this.isCrowdPulseDatabaseName(database.name)) {
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

                    for (const database of result.databases) {
                        database.info = await this.getCollectionInfo(database);
                    }

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

    private async getCollectionInfo(database): Promise<any> {

        const collection = super.getMongoConnection()
            .useDb(database.name)
            .collection("Info");

        return await collection.findOne()
            .then(result => {
                if (result) {
                    return {
                        version: result.version,
                        targetVersion: result.targetVersion,
                        releaseDate: result.releaseDate,
                        lastUpdateDate: result.lastUpdateDate,
                        htmlDescription: result.htmlDescription,
                        icon: result.icon
                    };
                } else {
                    return {
                        version: "",
                        targetVersion: 0,
                        releaseDate: undefined,
                        lastUpdateDate: undefined,
                        htmlDescription: "",
                        icon: ""
                    };
                }
            })
    }

    private isCrowdPulseDatabaseName(name: string) {
        switch (name) {
            case "admin":
            case "config":
            case "local":
                return false;
            default:
                return true;
        }
    }
}