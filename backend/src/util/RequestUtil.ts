import {Request} from "express";

/**
 * Returns a non-null array of database names from the query.
 * @param request The request from the HTTP request.
 */
export const getDatabasesFromQuery = (request: Request): string[] => {
    let dbs: Array<string> = [];

    if (request?.query?.dbs) {
        dbs = readArrayFromQuery(request.query.dbs);
    }

    return dbs;
}

/**
 * Returns a not-null array processed from the query parameter.
 * @param parameter The query parameter.
 */
export const readArrayFromQuery = (parameter: any): string[] => {

    if (parameter === null || parameter === undefined) {
        return [];
    }

    return Array.of(parameter).flat();
}