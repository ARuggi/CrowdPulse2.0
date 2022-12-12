import React from 'react';
import {TweetDatabasesData} from '../requests/tweet/TweetDatabasesRequest';

export type Content = {
    tweetDatabasesData: TweetDatabasesData;
}

class DatabaseSelection extends React.Component<Content> {

    render() {
        return(
            <>
                <p>{JSON.stringify(this.props.tweetDatabasesData.databases)}</p>
            </>
        );
    }
}

export default DatabaseSelection;