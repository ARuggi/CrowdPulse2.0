const mongoose = require("mongoose");
const dotenv = require("dotenv");

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

function getMongoConnection() {
    return mongoConnection;
}

function getAdminConnection() {
    return adminConnection;
}

module.exports = {getMongoConnection, getAdminConnection};