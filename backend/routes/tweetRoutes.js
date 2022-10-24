const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const router = express.Router();
let selectedDatabase;

// Require and config credentials
dotenv.config();
// Disable auto-pluralize Mongoose
mongoose.pluralize(null);

// Create the database connection.
let mongoConnection;
let adminConnection;

mongoose.createConnection(
    process.env.DATABASE_ACCESS,
    {},
    (error, connection) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log("Connected to MongoDB");
        mongoConnection = connection;
    });

mongoose.createConnection(
    process.env.DATABASE_ACCESS + "admin",
    {},
    (error, connection) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log("Connected to the MongoDB admin database")
        adminConnection = connection;
    });

/*
 * Data Schemas.
 */
const AnalyzedTweetTemplate = new mongoose.Schema({
    raw_text: {type: String},
    author_id: {type: String},
    author_name: {type: String},
    author_username: {type: String},
    created_at: {type: String},
    possibly_sensitive: {type: Boolean},
    complete_text: {type: Boolean},
    twitter_context_annotations: {type: Array},
    referenced_tweets: {type: Array},
    twitter_entities: {type: Object},
    metrics: {type: Object},
    processed: {type: Boolean},
    sentiment: {type: Object},
    tags: {type: Object},
    spacy: {type: Object},
})

/*
 * Route: "/tweet/setDbs"
 * Description: Set var mongodb.
*/
//TODO fix bug switch db
router.get("/setDbs", (req, res) => {
    let dbName = req.query.mongodb;
    selectedDatabase = mongoConnection.useDb(dbName);
    res.json(true);
});

/*
 * Route: "/tweet/collections"
 * Description: Extract all collections from a pre-selected DB.
 */
router.get("/collections", (req, res) => {
    selectedDatabase.db.listCollections().toArray((err, names) => {
        module.exports.Collection = names;
        res.json(names);
    });
});

/*
 * Route: "/tweet/dbs"
 * Description: Get all dbs.
 */
router.get("/dbs", (req, res) => {
    // connection established
    adminConnection.db.admin().listDatabases((err, result) => {
        // database list stored in result.databases
        res.json(result);
    });
});

/*
 * Route: "/tweet/getAnalyzedData"
 * Description: Get all Data.
 */
router.get("/getAnalyzedData", (req, res) => {
    const model = selectedDatabase.model(req.query.db, AnalyzedTweetTemplate);
    model.find({ }, {timeout: false})
        .lean()
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log("error: ", error);
            res.send(error);
        });
});

/*
 * Route: "/tweet/getTags"
 * Description: Get all Tags.
 */
router.get("/getTags", (req, res) => {
    const model = selectedDatabase.model(req.query.db, AnalyzedTweetTemplate);
    model.aggregate(
        [
            {$unwind : "$tags"},
            {
                $group: {
                    _id: "$tags",
                }
            }
        ],
        (error, data) => {
            if (error) {
                console.log(error)
                res.send(error);
            } else {
                //console.log(data)
                res.json(data);
            }
        },
    ).allowDiskUse(true);

    /*
     * model.find()
     * .lean()
     * .distinct("tags")
     * .then((data) => {
     *     res.json(data);
     * })
     * .catch((error) => {
     *     console.log("error: ", error);
     * });
     */
});

/*
 * Route: "/tweet/getHashtags"
 * Description: Get all Hashtags.
 */
router.get("/getHashtags", (req, res) => {
    const model = selectedDatabase.model(req.query.db, AnalyzedTweetTemplate);
    model.aggregate(
        [
            {
                $group: {
                    _id: "$twitter_entities",
                }
            }
        ],
        (error, data) => {
            if (error) {
                console.log(error)
                res.send(error);
            } else {
                //console.log(data)
                res.json(data);
            }
        },
    ).allowDiskUse(true);

    /*
     * model.find()
     * .lean()
     * .distinct("twitter_entities")
     * .then((data) => {
     *     res.json(data);
     * })
     * .catch((error) => {
     *     console.log("error: ", error);
     * });
     */
});

/*
 * Route: "/tweet/getUsers"
 * Description: Get all Users.
 */
router.get("/getUsers", (req, res) => {
    const model = selectedDatabase.model(req.query.db, AnalyzedTweetTemplate);
    model.aggregate(
        [
            {
                $group: {
                    _id: "$author_name",
                }
            }
        ],
        (error, data) => {
            if (error) {
                console.log(error)
                res.send(error);
            } else {
                //console.log(data)
                res.json(data);
            }
        },
    ).allowDiskUse(true);

    /*
     * model.find()
     * .lean()
     * .distinct("spacy")
     * .then((data) => {
     *     res.json(data);
     * })
     * .catch((error) => {
     *     console.log("error: ", error);
     * });
     */
});

/*
 * Route: "/tweet/getText"
 * Description: Get all Text.
 */
router.get("/getText", (req, res) => {
    const model = selectedDatabase.model(req.query.db, AnalyzedTweetTemplate);
    model.aggregate(
        [
            {
                $group: {
                    _id: "$spacy",
                }
            }
        ],
        (error, data) => {
            if (error) {
                console.log(error)
                res.send(error);
            } else {
                //console.log(data)
                res.json(data);
            }
        },
    ).allowDiskUse(true);

    /*
     * model.find()
     * .lean()
     * .distinct("spacy")
     * .then((data) => {
     *     res.json(data);
     * })
     * .catch((error) => {
     *     console.log("error: ", error);
     * });
     */
});

/*
 * Route: "/tweet/getDataSortByDate"
 * Description: Get all Data sorted by Date.
 */
router.get("/getDataSortByDate", (req, res) => {
    const model = selectedDatabase.model(req.query.db, AnalyzedTweetTemplate);
    model.find()
        .lean()
        .sort("created_at")
        .allowDiskUse(true)
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log("error: ", error);
            res.send(error);
        });
});

/*
 * Route: "/tweet/getDataTimelines"
 * Description: Get all Data group by Date.
 */
router.get("/getDataTimelines", (req, res) => {
    const model = selectedDatabase.model(req.query.db, AnalyzedTweetTemplate);
    model.aggregate(
        [
            {
                $group: {
                    _id: { $dateToString: { format: "%y-%m-$d", date: ISODATE("$created_at") } },
                }
            }
        ],
        (error, result) => {
            if (error) {
                console.log(error)
                res.send(error);
            } else {
                //console.log(result)
                res.json(result);
            }
        }
    ).allowDiskUse(true);
});

/*
 * Route: "/tweet/getAnalyzedSentiment"
 * Description: Get all Sentiment info.
 */
router.get("/getAnalyzedSentiment", (req, res) => {
    const model = selectedDatabase.model(req.query.db, AnalyzedTweetTemplate);
    model.find({}, {timeout: false})
        .lean()
        .then((data) => {
            let negative = 0
            let positive = 0
            let neutral = 0

            data.forEach(value => {
                const sentiment = value.sentiment["sent-it"].sentiment;
                switch (sentiment) {
                    case "negative": negative++; break;
                    case "positive": positive++; break;
                    default: neutral++; break;
                }
            });
            res.json({positive, negative, neutral});
        })
        .catch((error) => {
            console.log("error: ", error);
        });
});

/*
 * Route: "/tweet/getAnalyzedSentimentDates"
 * Description: Get all Sentiment info group by Date.
 */
router.get("/getAnalyzedSentimentDates", (req, res) => {
    const model = selectedDatabase.model(req.query.db, AnalyzedTweetTemplate);
    model.find({ }, {timeout: false})
        .lean()
        .then((data) => {
            let negative = 0;
            let positive = 0;
            let neutral = 0;

            data.forEach(value => {
                const sentiment = value.sentiment["sent-it"].sentiment;
                switch (sentiment) {
                    case "negative": negative++; break;
                    case "positive": positive++; break;
                    default: neutral++; break;
                }
            });
            res.json({positive, negative, neutral});
        })
        .catch((error) => {
            console.log("error: ", error);
        });
});

module.exports = router;