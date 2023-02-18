export type SentimentResponse = {
    processed: number,    // Number of processed documents.
    notProcessed: number, // Number of not processed documents.
    data: {
        positive: number, // Number of positive sentiments
        neutral: number,  // Number of neutral sentiments
        negative: number, // Number of negative sentiments
    },
    percentages: {
        positive: number, // A value [0-100] of positive sentiments
        neutral: number,  // A value [0-100] of neutral sentiments
        negative: number, // A value [0-100] of negative sentiments
    }
}