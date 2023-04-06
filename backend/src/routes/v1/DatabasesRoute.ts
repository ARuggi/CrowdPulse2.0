import {AbstractRoute} from './AbstractRoute';
import {Request, Response} from 'express';
import {getAdminConnection} from '../../database/database';
import {
    getDatabaseCollectionsInfo,
    getCrowdPulseDatabaseInfo,
    isCrowdPulseCollection,
    isReservedDatabase
} from '../../util/DatabaseUtil';
import {getDatabasesFromQuery} from '../../util/RequestUtil';

export class DatabasesRoute extends AbstractRoute {

    async handleRouteRequest(req: Request, res: Response): Promise<void> {
        const dbs = getDatabasesFromQuery(req);

        try {

            const listDatabases = await getAdminConnection().db.admin().listDatabases();
            listDatabases.databases = listDatabases.databases.filter((database) => !isReservedDatabase(database.name));
            const result = [];

            for (const database of listDatabases.databases) {
                if (dbs.length > 0 && !dbs.find(name => name === database.name)) continue;

                let collections: any[] = await getDatabaseCollectionsInfo(database.name);
                collections = collections.filter(collection => isCrowdPulseCollection(collection));

                if (collections.length > 0) {
                    result.push(database);
                }
            }

            for (const database of result) {
                database.info = await getCrowdPulseDatabaseInfo(database.name);
            }

            res.send({databases: result});

        } catch (error) {
            console.log(error)
            res.status(500);
            res.send({error: error.message});
        }
    }

    protected path(): string {
        return '/databases';
    }

    getMethod(): string {
        return 'get';
    }
}