import React from 'react';
import Filters from "../filters";

interface IProps {
    dbs: string[]
}

const MapTab:React.FC<IProps> = ({dbs}) => {
    return <>
        <Filters
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

export default MapTab;