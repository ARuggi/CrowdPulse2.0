import {AbstractRoute} from './AbstractRoute';
import {Request, Response} from 'express';
import {asyncFilter} from '../../util/AsyncUtil';
import {createResponse, ResponseType} from '../IRoute';
import {getAdminConnection} from '../../database/database';
import {
    CrowdPulseDatabaseInfo,
    getDatabaseCollectionsInfo,
    getCrowdPulseDatabaseInfo,
    isCrowdPulseCollection,
    isReservedDatabase} from '../../util/DatabaseUtil';

type ResultType = {
    databases: Array<{
        name: string,       // Database name
        sizeOnDisk: number, // Size in Kbps
        empty: boolean      // True if it is an empty database
        info: CrowdPulseDatabaseInfo // database information
    }>
}

// noinspection DuplicatedCode
export class DatabasesRoute extends AbstractRoute {

    async performRequest(req: Request, res: Response): Promise<void> {
        try {
            getAdminConnection()
                .db
                .admin()
                .listDatabases(async (error, result: ResultType) => {

                    if (error) {
                        throw error;
                    }

                    result.databases = await asyncFilter(result.databases, async (database) => {
                        if (isReservedDatabase(database.name)) return false;

                        return await getDatabaseCollectionsInfo(database.name)
                            .then((result) => {
                                return !result
                                    .filter(r => {return isCrowdPulseCollection(r)})
                                    .empty;
                            });
                    });

                    for (const database of result.databases) {
                        database.info = await getCrowdPulseDatabaseInfo(database.name);
                    }

                    res.send(createResponse(ResponseType.OK, undefined, result));
                });

        } catch (error) {
            console.error(error);
            res.status(500);
            res.send(createResponse(ResponseType.KO, error.message));
        }
    }

    protected path(): string {
        return "/databases";
    }

    getMethod(): string {
        return "get";
    }
}