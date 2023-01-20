/**
 * Check if the database name is a reserved resource of MongoDB.
 * @param databaseName The database name.
 * return true if it is a reserved MongoDB database.
 */
export function isReservedDatabase(databaseName: string): boolean {
    switch (databaseName) {
        case "admin":
        case "config":
        case "local":return true;
        default: return false;
    }
}