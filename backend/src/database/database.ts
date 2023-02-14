import mongoose, {Connection} from "mongoose";

// disable auto-pluralize Mongoose.
mongoose.pluralize(null);

let mongoConnection: Connection;
let adminConnection: Connection;

export const loadDatabase = () => {
    return new Promise((resolve, reject) => {
        console.log(`Connecting to: ${process.env.DATABASE_ACCESS} ...`);
        mongoConnection = mongoose
            .createConnection(process.env.DATABASE_ACCESS, {})
            .on('error', (error) => {
                reject(error);
            });

        mongoConnection.asPromise()
            .then(() => {
                console.log("Connected to the database!");
                console.log(`Connecting to: ${process.env.DATABASE_ACCESS}admin ...`);

                adminConnection = mongoose
                    .createConnection(process.env.DATABASE_ACCESS + "admin", {})
                    .on('error', (error) => {
                        reject(error);
                    });

                adminConnection.asPromise()
                    .then(() => {
                        console.log("Connected to the admin database!")
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