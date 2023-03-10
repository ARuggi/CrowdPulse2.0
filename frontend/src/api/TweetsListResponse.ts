export type TweetsListResponse = {
    total: number, // The total of tweets.
    values: [TweetsListResponseEntry]
};

export type TweetsListResponseEntry = {
    author: string      // The author username
    text: string,       // The text written by the user
    lang: string,       // The language (IT, EN, ...)
    sensitive: boolean, // True if the text contains sensitive content
    created_at: string, // The creation timestamp
    tags: string[],     // An array of tags added by the user
}