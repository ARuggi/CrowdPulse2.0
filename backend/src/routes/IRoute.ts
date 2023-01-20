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
     * The call request and response implementation.
     * @param req The request from the client.
     * @param res The response at the client.
     */
    perform(req: Request, res: Response): Promise<void>;
}

export function createMissingQueryParamResponse(paramName?: string, data?: any) {
    return createResponse(ResponseType.KO, `missing '${paramName}' as query param`, data);
}

export function createMissingBodyParamResponse(paramName?: string, data?: any) {
    return createResponse(ResponseType.KO, `missing '${paramName}' as body param`, data);
}

export function createResponse(responseType: ResponseType,
                               message?: string,
                               data?: any) {
    if (!message) {
        message = "done";
    }

    return {
        "type": responseType,
        "message": message,
        "data": data
    }
}

export enum ResponseType {
    OK = "OK",
    KO = "KO"
}