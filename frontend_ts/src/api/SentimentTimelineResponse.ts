export type SentimentTimelineResponse = [
    {
        positiveCount: number, // Number of positive sentiments
        neutralCount: number,  // Number of neutral sentiments
        negativeCount: number, // Number of negative sentiments
        date: string,          // year-month-day date format
    }
]