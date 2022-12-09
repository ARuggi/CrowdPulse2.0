import express, {Request, Response} from 'express';
import cors from 'cors';
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
        new TweetSetDatabaseRoute(),
        new TweetCollectionsRoute(),
        new TweetDatabasesRoute(),
        new TweetGetAnalyzedDataRoute(),
        new TweetGetTagsRoute(),
        new TweetGetHashtagsRoute(),
        new TweetGetUsersRoute(),
        new TweetGetTextRoute(),
        new TweetGetDataSortByDateRoute(),
        new TweetGetDataTimelinesRoute(),
        new TweetGetAnalyzedSentimentRoute(),
        new TweetGetAnalyzedSentimentDatesRoute()
    ];

    express: express.Application;
    port: number = 4000;

    constructor() {
        this.express = express();
        this.express.use(express.json());
        this.express.use(cors());

        this.registerRoutes();

        this.express.listen(this.port, () => {
            return console.log(`Server is listening at http://localhost:${this.port}`);
        });
    }

    private registerRoutes() {
        App.ROUTES.forEach(route => {
            this.express.get(route.path(), route.perform);
        })

        // handle 404 for unknown URLs.
        this.express.use((req: Request, res: Response) => {
            res.status(404);
            res.json({error: 'URL not found'});
        })
    }
}

export = new App();