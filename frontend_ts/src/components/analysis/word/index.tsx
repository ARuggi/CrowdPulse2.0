import React from 'react';
import Filters from "../filters";

interface IProps {
    dbs: string[]
}

const WordTab:React.FC<IProps> = ({dbs}) => {
    return <>
        <Filters
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