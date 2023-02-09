export type DatabaseType = {
    name: string,       // Database name
    sizeOnDisk: number, // Size in Kbps
    empty: boolean      // True if it is an empty database
    info: {
        version: string,         // The data version
        targetVersion: number,   // 0 for legacy twitter database, 1+ for newer
        releaseDate: Date,       // The release date YYYY-MM-DD
        lastUpdateDate: Date,    // The last update date YYYY-MM-DD
        htmlDescription: string, // Html description
        icon: string,            // Base64 icon
    }
}

export type DatabasesResponse = {
    databases: DatabaseType[]
}
