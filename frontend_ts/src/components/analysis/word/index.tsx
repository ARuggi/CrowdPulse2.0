import React, {useContext} from 'react';
import Filters from "../filters";
import {DatabasesContext} from "../index";

const WordTab = () => {
    const dbs = useContext(DatabasesContext);

    return <>
        <Filters
            lock={false} //TODO: must be implemented
            filters={{
                showAlgorithm: true,
                showSentiment: true,
                showType: true,
                showDataRangePicker: true,
                showTags: true,
                showProcessedText: true,
                showHashTags: true,
                showUsernames: true
            }}/>
    </>
}

export default WordTab;