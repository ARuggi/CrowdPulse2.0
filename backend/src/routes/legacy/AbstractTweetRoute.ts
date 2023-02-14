import {IRoute} from '../IRoute';
import {Request, Response} from 'express';
import {getMongoConnection, getAdminConnection} from '../../database/database';
import {Connection, Schema} from 'mongoose';

export abstract class AbstractTweetRoute implements IRoute {

    public static selectedDatabase: Connection = undefined;

    async handleRequest(req: Request, res: Response): Promise<void> {
        let method = this.getMethod().toLowerCase();

        if (method === "get") {
            console.log(`Performing [${req.method}] '${req.url}' by '${req.ip}'`);
        } else {
            console.log(`Performing [${req.method}] '${req.url}' by '${req.ip}' with request body: ` + JSON.stringify(req.body));
        }
        
        let result = this.checkIntegrity(req, res);

        if (result) {
            return await this.performTweetRequest(req, res).then(result => {return result});
        }
    }

    abstract performTweetRequest(req: Request, res: Response): Promise<void>;

    abstract tweetPath(): string;

    getMethod(): string {
        return "get";
    }

    getPath(): string {
        return '/tweet' + this.tweetPath();
    }

    protected checkIntegrity(req: Request, res: Response): boolean {
        if (AbstractTweetRoute.selectedDatabase) {
            return true;
        }
        res.status(500);
        res.send({error: "No database selected"});
        return false;
    }

    protected getMongoConnection() {
        return getMongoConnection();
    }

    protected getAdminConnection() {
        return getAdminConnection();
    }
}

export interface IAnalyzedTweetData {
    raw_text: string,
    author_id: string,
    author_name: string,
    author_username: string,
    created_at: Date,
    lang?: string
    possibly_sensitive?: boolean,
    complete_text?: boolean,
    referenced_tweets?: [],
    twitter_entities?: {
        mentions: []
    },
    metrics?: {
        retweet_count?: number,
        reply_count?: number,
        like_count?: number,
        quote_count?: number
    },
    processed: boolean,
    sentiment?: {
        "sent-it"?: {
            subjectivity: string,
            sentiment: string
        },
        "feel-it"?: {
            emotion: string,
            sentiment: string
        }
    },
    tags?: {
        tag_me: []
    },
    spacy?: {
        processed_text: [],
        entities: []
    },
}

export const AnalyzedTweetSchema = new Schema<IAnalyzedTweetData>();