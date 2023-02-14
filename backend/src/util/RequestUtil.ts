import {Request} from "express";

/**
 * Returns a non-null array of database names from the query.
 * @param request The request from the HTTP request.
 */
export const getDatabasesFromQuery = (request: Request): string[] => {
    let dbs: Array<string> = [];

    if (request?.query?.dbs) {
        let queryDbs = request.query.dbs;

        if ((typeof(queryDbs)) === 'string') {
            dbs = [queryDbs as string];
        } else {
            dbs = request.query.dbs as string[];
        }
    }

    return dbs;
}