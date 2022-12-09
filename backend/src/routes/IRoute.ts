import {Request, Response} from "express";

export interface IRoute {

    /**
     * @return The url path such as "/something".
     */
    path(): any;

    /**
     * The call request and response implementation.
     * @param req The request from the client.
     * @param res The response at the client.
     */
    perform(req: Request, res: Response): void;
}