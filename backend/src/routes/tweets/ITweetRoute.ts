import {createResponse, IRoute, ResponseType} from "../IRoute";
import {Request, Response} from "express";
import {getMongoConnection, getAdminConnection} from "../../database/database";
import {Connection, Schema} from "mongoose";
export abstract class ITweetRoute implements IRoute {

    public static selectedDatabase: Connection = undefined;

    path(): any {
        return '/tweet' + this.tweetPath();
    }

    perform(req: Request, res: Response): void {
        console.log(`Performing [${req.method}] '${req.url}' by '${req.ip}' with request body: ` + JSON.stringify(req.body));
        let result = this.checkIntegrity(req, res);

        if (result) {
            this.performTweetRequest(req, res);
        }

    }

    abstract performTweetRequest(req: Request, res: Response): void;

    abstract tweetPath(): string;

    protected checkIntegrity(req: Request, res: Response): boolean {
        if (ITweetRoute.selectedDatabase) {
            return true;
        }
        res.status(500);
        res.send(createResponse(ResponseType.KO, "No database selected"));
        return false;
    }

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

export interface IAnalyzedTweetData {
    raw_text: string,
    author_id: string,
    author_name: string,
    author_username: string,
    created_at: Date,
    possibly_sensitive: boolean,
    complete_text: boolean,
    twitter_context_annotations: [],
    referenced_tweets: [],
    twitter_entities: object,
    metrics: object,
    processed: boolean,
    sentiment: object,
    tags: object,
    spacy: object,
}

export const AnalyzedTweetSchema = new Schema<IAnalyzedTweetData>({
    raw_text: {type: String},
    author_id: {type: String},
    author_name: {type: String},
    author_username: {type: String},
    created_at: {type: Date},
    possibly_sensitive: {type: Boolean},
    complete_text: {type: Boolean},
    twitter_context_annotations: {type: []},
    referenced_tweets: {type: []},
    twitter_entities: {type: Object},
    metrics: {type: Object},
    processed: {type: Boolean},
    sentiment: {type: Object},
    tags: {type: Object},
    spacy: {type: Object},
});