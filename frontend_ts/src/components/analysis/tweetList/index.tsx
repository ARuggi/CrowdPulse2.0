import React, {useContext} from 'react';
import Filters from "../filters";
import {DatabasesContext} from "../index";

const TweetListTab = () => {
    const dbs = useContext(DatabasesContext);

    return <>
        <Filters
            lock={false} //TODO: must be implemented
            filters={{
                showAlgorithm: true,
                showSentiment: true,
                showType: false,
                showDataRangePicker: true,
                showTags: true,
                showProcessedText: true,
                showHashTags: true,
                showUsernames: true
            }}/>
    </>
}

export default TweetListTab;