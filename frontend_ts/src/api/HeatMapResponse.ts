export type HeatMapResponse = HeatMapResponseEntry[];

export type HeatMapResponseEntry = {
    count: number            // Number of counted points at the same coordinates
    coordinates: {
        latitude:  number,    // Latitude into the map.
        longitude: number,    // Longitude into the map.
    }
}