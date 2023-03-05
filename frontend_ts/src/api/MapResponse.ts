export type MapResponse = {
    [key: string]: {               // Name of region, such as "Lombardia"
        sentimentPositive: number, // Number of positive sentiments.
        sentimentNeutral:  number, // Number of neutral sentiments.
        sentimentNegative: number, // Number of negative sentiments.
        emotionJoy:     number,    // Number of feel-it joy emotions.
        emotionSadness: number,    // Number of feel-it sadness emotions.
        emotionAnger:   number,    // Number of feel-it anger emotions.
        emotionFear:    number,    // Number of feel-it fear emotions.
    }
}