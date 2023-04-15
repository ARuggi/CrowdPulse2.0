export type SentimentTimelineResponse = {
    algorithm: string,    // sent-it, feel-it or hate-speech
    data: [
        {
            sentimentPositiveCount: number,       // Number of positive sentiments
            sentimentNeutralCount: number,        // Number of neutral sentiments
            sentimentNegativeCount: number,       // Number of negative sentiments
            emotionJoyCount: number,              // Number of joy emotions
            emotionSadnessCount: number,          // Number of sadness emotions
            emotionAngerCount: number,            // Number of anger emotions
            emotionFearCount: number,             // Number of fear emotions
            hateSpeechAcceptableCount: number,    // Number of acceptable tweets
            hateSpeechInappropriateCount: number, // Number of inappropriate tweets
            hateSpeechOffensiveCount: number,     // Number of offensive tweets
            hateSpeechViolentCount: number,       // Number of violent tweets
            date: string,                         // year-month-day date format
        }
    ]
}