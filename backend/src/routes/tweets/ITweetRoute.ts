import {IRoute} from "../IRoute";
import {Request, Response} from "express";
import {getMongoConnection, getAdminConnection} from "../../database/database";
import {Connection} from "mongoose";
export abstract class ITweetRoute implements IRoute {

    public static selectedDatabase: Connection = undefined;

    path(): any {
        return '/tweet' + this.tweetPath();
    }

    abstract perform(req: Request, res: Response): void;

    abstract tweetPath(): string;

    protected getMongoConnection() {
        return getMongoConnection();
    }

    protected getAdminConnection() {
        return getAdminConnection();
    }

    method(): string {
        return "get";
    }

}