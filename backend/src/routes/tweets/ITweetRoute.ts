import {IRoute} from "../IRoute";
import {Request, Response} from "express";

export abstract class ITweetRoute implements IRoute {

    path(): any {
        return '/tweet' + this.tweetPath();
    }

    abstract perform(req: Request, res: Response): void;

    abstract tweetPath(): String;
}