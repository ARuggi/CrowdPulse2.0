import mongoose, {Connection, Schema} from 'mongoose';

// disable auto-pluralize Mongoose.
mongoose.pluralize(null);

let mongoConnection: Connection;
let adminConnection: Connection;

export const loadDatabase = () => {
    return new Promise((resolve, reject) => {
        console.log(`Connecting to: ${process.env.DATABASE_ACCESS} ...`);
        mongoConnection = mongoose
            .createConnection(process.env.DATABASE_ACCESS, {readPreference: 'secondaryPreferred'})
            .on('error', (error) => {
                reject(error);
            });

        mongoConnection.asPromise()
            .then(() => {
                console.log('Connected to the database!');
                console.log(`Connecting to: ${process.env.DATABASE_ACCESS}admin ...`);

                adminConnection = mongoose
                    .createConnection(process.env.DATABASE_ACCESS + 'admin', {readPreference: 'secondaryPreferred'})
                    .on('error', (error) => {
                        reject(error);
                    });

                adminConnection.asPromise()
                    .then(() => {
                        console.log('Connected to the admin database!')
                        resolve(true);
                    })
            });
    });
}

export const getMongoConnection = (): Connection => {
    return mongoConnection;
}

export const getAdminConnection = (): Connection => {
    return adminConnection;
}

export const AnalyzedTweetSchema = new Schema({
    raw_text: String,
    author_id: String,
    author_name: String,
    author_username: String,
    created_at: String,
    lang: String,
    possibly_sensitive: Boolean,
    complete_text: Boolean,
    referenced_tweets: [],
    twitter_entities: {
        hashtags: [],
        mentions: []
    },
    geo: {
        user_location: String,
        coordinates: {
            latitude: Number,
            longitude: Number,
        }
    },
    metrics: {
        retweet_count: Number,
        reply_count: Number,
        like_count: Number,
        quote_count: Number
    },
    processed: Boolean,
    sentiment: {
        "sent-it": {
            subjectivity: String,
            sentiment: String
        },
        "feel-it": {
            emotion: String,
            sentiment: String
        }
    },
    tags: {
        tag_me: []
    },
    spacy: {
        processed_text: [],
        entities: []
    },
});