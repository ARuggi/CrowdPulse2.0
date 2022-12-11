import * as http from "http";
import express, {Request, Response} from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import {loadDatabase} from "./database/database"
import {IRoute} from "./routes/IRoute";
import {TweetSetDatabaseRoute} from "./routes/tweets/TweetSetDatabaseRoute";
import {TweetCollectionsRoute} from "./routes/tweets/TweetCollectionsRoute";
import {TweetDatabasesRoute} from "./routes/tweets/TweetDatabasesRoute";
import {TweetGetAnalyzedDataRoute} from "./routes/tweets/TweetGetAnalyzedDataRoute";
import {TweetGetTagsRoute} from "./routes/tweets/TweetGetTagsRoute";
import {TweetGetHashtagsRoute} from "./routes/tweets/TweetGetHashtagsRoute";
import {TweetGetUsersRoute} from "./routes/tweets/TweetGetUsersRoute";
import {TweetGetTextRoute} from "./routes/tweets/TweetGetTextRoute";
import {TweetGetDataSortByDateRoute} from "./routes/tweets/TweetGetDataSortByDateRoute";
import {TweetGetDataTimelinesRoute} from "./routes/tweets/TweetGetDataTimelinesRoute";
import {TweetGetAnalyzedSentimentRoute} from "./routes/tweets/TweetGetAnalyzedSentimentRoute";
import {TweetGetAnalyzedSentimentDatesRoute} from "./routes/tweets/TweetGetAnalyzedSentimentDatesRoute";

class App {

    private static ROUTES: Array<IRoute> = [
        new TweetSetDatabaseRoute(),               // ENDPOINT: /tweet/setDbs
        new TweetDatabasesRoute(),                 // ENDPOINT: /tweet/dbs
        new TweetCollectionsRoute(),               // ENDPOINT: /tweet/collections
        new TweetGetAnalyzedDataRoute(),           // ENDPOINT: /tweet/getAnalyzedData
        new TweetGetTagsRoute(),                   // ENDPOINT: /tweet/getTags
        new TweetGetHashtagsRoute(),               // ENDPOINT: /tweet/getHashtags
        new TweetGetUsersRoute(),                  // ENDPOINT: /tweet/getUsers
        new TweetGetTextRoute(),                   // ENDPOINT: /tweet/getText
        new TweetGetDataSortByDateRoute(),         // ENDPOINT: /tweet/getDataSortByDate
        new TweetGetDataTimelinesRoute(),          // ENDPOINT: /tweet/getDataTimelines
        new TweetGetAnalyzedSentimentRoute(),      // ENDPOINT: /tweet/getAnalyzedSentiment
        new TweetGetAnalyzedSentimentDatesRoute(), // ENDPOINT: /tweet/getAnalyzedSentimentDates
    ];

    express: express.Application;
    server: http.Server;
    port: number = 3000;

    constructor() {

        dotenv.config();
        loadDatabase()
            .then(() => {

                this.port = parseInt(process.env.SERVER_PORT);
                this.express = express();
                this.express.use(express.json());
                this.express.use(cors());
                this.registerRoutes();

                this.server = this.express.listen(this.port, () => {
                    return console.log(`Server is listening at http://localhost:${this.port}`);
                });

            })
            .catch((error) => {
                app.stop(error.message);
            });
    }

    public stop(stopMessage: string = undefined) {
        if (this.server) {
            this.server.close(() => {
                stopMessage
                    ? console.log(`Server is stopping due to the following error: ${stopMessage}`)
                    : console.log(`Server is stopping...`)
            })
        } else {
            stopMessage
                ? console.log(`Server is stopping due to the following error: ${stopMessage}`)
                : console.log(`Server is stopping...`)
        }
    }

    private registerRoutes() {
        App.ROUTES.forEach(route => {
            const method = Reflect.get(this.express, route.method()) as (path: string, perform: void) => {};
            Reflect.apply(method, this.express, [route.path(), (req, res) => route.perform(req, res)]);
            console.log("Registered endpoint: [" + route.method().toUpperCase() + "] " + route.path());
        })

        // handle 404 for unknown URLs.
        this.express.use((req: Request, res: Response) => {
            res.status(404);
            res.json({error: 'URL not found'});
        })
    }
}

const app = new App();
export {app}