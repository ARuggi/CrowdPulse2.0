import {getMongoConnection} from '../database/database';

export type DatabaseCollectionInfo = {
    name: string,       // Database name
    sizeOnDisk: number, // Size in Kbps
    empty: boolean      // True if it is an empty database
}

export type CrowdPulseDatabaseInfo = {
    version: string,         // The data version
    targetVersion: number,   // 0 for legacy twitter database, 1+ for newer
    releaseDate: Date,       // The release date YYYY-MM-DD
    lastUpdateDate: Date,    // The last update date YYYY-MM-DD
    htmlDescription: string, // Html description
    icon: string,            // Base64 icon
}

/**
 * Check if the database name is a reserved resource of MongoDB.
 * @param databaseName The database name.
 * @return True if it is a reserved MongoDB database.
 */
export function isReservedDatabase(databaseName: string): boolean {
    switch (databaseName) {
        case "admin":
        case "config":
        case "local":return true;
        default: return false;
    }
}

/**
 * @param collection The MongoDB collection.
 * @return True if the collection name is "Message".
 */
export function isCrowdPulseCollection(collection: any) {
    return collection.name == "Message" && collection.type == "collection";
}

/**
 * @param databaseName The database name.
 * @return The {@link DatabaseCollectionInfo} of the database.
 */
export async function getDatabaseCollectionsInfo(databaseName: string): Promise<any> {
    const collection = getMongoConnection()
        .useDb(databaseName)
        .db
        .listCollections();

    return await collection
        .toArray()
        .catch(() => {return [];})
        .then((result) => {return result;}) as DatabaseCollectionInfo;
}

/**
 * @param databaseName The CrowdPulse database name.
 * @return The {@link CrowdPulseDatabaseInfo} of the database.
 */
export async function getCrowdPulseDatabaseInfo(databaseName: string): Promise<any> {
    const collection = getMongoConnection()
        .useDb(databaseName)
        .collection("Info");

    const info: CrowdPulseDatabaseInfo = {
        version: "",
        targetVersion: 0,
        releaseDate: undefined,
        lastUpdateDate: undefined,
        htmlDescription: "",
        icon: ""
    };

    return await collection
        .findOne()
        .then(result => {

            if (result) {
                info.version = result.version;
                info.targetVersion = result.targetVersion;
                info.releaseDate = result.releaseDate;
                info.lastUpdateDate = result.lastUpdateDate;
                info.htmlDescription = result.htmlDescription;
                info.icon = result.icon;
            }

            return info;
        });
}