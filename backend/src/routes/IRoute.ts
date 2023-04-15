import {Request, Response} from 'express';

export interface IRoute {

    /**
     * The method TYPE: GET, POST, PUT, ...
     */
    getMethod(): string;

    /**
     * @return The url path such as "/something".
     */
    getPath(): string;

    /**
     * Handle the request with a proper response.
     * @param req The request from the client.
     * @param res The response at the client.
     */
    handleRequest(req: Request, res: Response): Promise<void>;
}

export function createMissingQueryParamResponse(paramName?: string, data?: any) {
    return {error: `missing or incorrect '${paramName}' query param`, data};
}

export function createMissingBodyParamResponse(paramName?: string, data?: any) {
    return {error: `missing '${paramName}' as body param`, data};
}