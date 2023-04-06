import * as http from 'http';
import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {loadDatabase} from './database/database'
import {IRoute} from './routes/IRoute';
import {TweetSetDatabaseRoute} from './routes/legacy/TweetSetDatabaseRoute';
import {TweetCollectionsRoute} from './routes/legacy/TweetCollectionsRoute';
import {TweetDatabasesRoute} from './routes/legacy/TweetDatabasesRoute';
import {TweetGetAnalyzedDataRoute} from './routes/legacy/TweetGetAnalyzedDataRoute';
import {TweetGetTagsRoute} from './routes/legacy/TweetGetTagsRoute';
import {TweetGetHashtagsRoute} from './routes/legacy/TweetGetHashtagsRoute';
import {TweetGetUsersRoute} from './routes/legacy/TweetGetUsersRoute';
import {TweetGetTextRoute} from './routes/legacy/TweetGetTextRoute';
import {TweetGetDataSortByDateRoute} from './routes/legacy/TweetGetDataSortByDateRoute';
import {TweetGetDataTimelinesRoute} from './routes/legacy/TweetGetDataTimelinesRoute';
import {TweetGetAnalyzedSentimentRoute} from './routes/legacy/TweetGetAnalyzedSentimentRoute';
import {TweetGetAnalyzedSentimentDatesRoute} from './routes/legacy/TweetGetAnalyzedSentimentDatesRoute';
import {DatabasesRoute} from './routes/v1/DatabasesRoute';
import {SentimentRoute} from './routes/v1/SentimentRoute';
import {SentimentTimelineRoute} from './routes/v1/SentimentTimelineRoute';
import {WordRoute} from './routes/v1/WordRoute';
import {TweetsTimelineRoute} from './routes/v1/TweetsTimelineRoute';
import {TweetsListRoute} from './routes/v1/TweetsListRoute';
import {MapRoute} from './routes/v1/MapRoute';
import {HeatMapRoute} from './routes/v1/HeatMapRoute';

class App {

    private static ROUTES: Array<IRoute> = [
        // Legacy endpoints
        new TweetSetDatabaseRoute(),               // GET - /tweet/setDbs
        new TweetDatabasesRoute(),                 // GET  - /tweet/dbs
        new TweetCollectionsRoute(),               // GET  - /tweet/collections
        new TweetGetAnalyzedDataRoute(),           // GET  - /tweet/getAnalyzedData
        new TweetGetTagsRoute(),                   // GET  - /tweet/getTags
        new TweetGetHashtagsRoute(),               // GET  - /tweet/getHashtags
        new TweetGetUsersRoute(),                  // GET  - /tweet/getUsers
        new TweetGetTextRoute(),                   // GET  - /tweet/getText
        new TweetGetDataSortByDateRoute(),         // GET  - /tweet/getDataSortByDate
        new TweetGetDataTimelinesRoute(),          // GET  - /tweet/getDataTimelines
        new TweetGetAnalyzedSentimentRoute(),      // GET  - /tweet/getAnalyzedSentiment
        new TweetGetAnalyzedSentimentDatesRoute(), // GET  - /tweet/getAnalyzedSentimentDates

        // new endpoints
        new DatabasesRoute(),         // GET - /v1/databases
        new SentimentRoute(),         // GET - /v1/sentiment
        new SentimentTimelineRoute(), // GET - /v1/sentiment/timeline
        new WordRoute(),              // GET - /v1/word
        new TweetsTimelineRoute(),    // GET - /v1/tweets/timeline
        new TweetsListRoute(),        // GET - /v1/tweets/list
        new MapRoute(),               // GET - /v1/map
        new HeatMapRoute(),           // GET - /v1/heatmap
    ];

    express: express.Application;
    server: http.Server;
    port = 4000;

    constructor() {

        dotenv.config();
        loadDatabase()
            .then(() => {

                this.port = parseInt(process.env.SERVER_PORT);
                this.express = express();
                this.express.use(express.json());
                //his.express.use(cors({ optionsSuccessStatus: 204 }));
                this.express.use(cors({
                    origin: '*',
                    methods: ['GET', 'POST', 'PUT', 'DELETE'],
                    allowedHeaders: ['Content-Type', 'Authorization']
                }));

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

    // register all routes by using reflection.
    private registerRoutes() {
        App.ROUTES.forEach(route => {
            const method = Reflect.get(this.express, route.getMethod()) as (path: string, perform: void) => unknown;
            Reflect.apply(method, this.express, [route.getPath(), async (req, res) => route.handleRequest(req, res)]);
            console.log('Registered endpoint: [' + route.getMethod().toUpperCase() + '] ' + route.getPath());
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