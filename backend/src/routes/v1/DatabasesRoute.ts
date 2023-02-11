import {AbstractRoute} from './AbstractRoute';
import {Request, Response} from 'express';
import {asyncFilter} from '../../util/AsyncUtil';
import {getAdminConnection} from '../../database/database';
import {
    getDatabaseCollectionsInfo,
    getCrowdPulseDatabaseInfo,
    isCrowdPulseCollection,
    isReservedDatabase} from '../../util/DatabaseUtil';

// noinspection DuplicatedCode
export class DatabasesRoute extends AbstractRoute {

    async handleRouteRequest(req: Request, res: Response): Promise<void> {
        let filters = {dbs: []};

        if (req?.query?.dbs) {
            filters.dbs.push(req.query.dbs);
        }

        try {

            let result = await this.getInfoFromDatabase(filters);
            res.send(result);

        } catch (error) {
            console.log(error)
            res.status(500);
            res.send({error: error.message});
        }
    }

    private async getInfoFromDatabase(filters: {dbs: Array<string>}): Promise<any> {
        let admin = getAdminConnection().db.admin();
        let result = await admin.listDatabases();

        result.databases = await asyncFilter(result.databases, async (database) => {
            if (isReservedDatabase(database.name)
                || (filters.dbs.length !== 0
                    && !filters.dbs.find(name => name == database.name))) {
                return false;
            }

            let collectionsInfo = await getDatabaseCollectionsInfo(database.name);
            return !collectionsInfo.filter(r => isCrowdPulseCollection(r)).empty;
        });

        for (const database of result.databases) {
            database.info = await getCrowdPulseDatabaseInfo(database.name);
        }

        return result;
    }

    protected path(): string {
        return "/databases";
    }

    getMethod(): string {
        return "get";
    }
}