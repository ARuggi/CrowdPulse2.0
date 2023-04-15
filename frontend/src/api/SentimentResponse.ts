export type SentimentResponse = {
    algorithm: string,    // sent-it, feel-it or hate-speech
    processed: number,    // Number of processed documents
    notProcessed: number, // Number of not processed documents
    sentimentData: {      // Only for sent-it and feel-it
        positive: number, // Number of positive sentiments tweets
        neutral: number,  // Number of neutral sentiments tweets
        negative: number, // Number of negative sentiments tweets
    },
    emotionData: {       // Only for feel-it
        joy: number,     // Number of joy emotions tweets
        sadness: number, // Number of sadness emotions tweets
        anger: number,   // Number of anger emotions tweets
        fear: number,    // Number of fear emotions tweets
    },
    hateSpeechData: {          // Only for hate-it
        acceptable: number,    // Number of acceptable tweets
        inappropriate: number, // Number of inappropriate tweets
        offensive: number,     // Number of offensive tweets
        violent: number        // Number of violent tweets
    }
}