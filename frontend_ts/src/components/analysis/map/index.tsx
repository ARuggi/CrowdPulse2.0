import React from 'react';
import Filters from "../filters";
import {Flex} from "@mantine/core";
import MapBox from "./MapBox";

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
        <Flex
            style={{marginTop: '50px'}}
            gap='md'
            justify='center'
            align='center'
            direction='row'
            wrap='wrap'>
            <MapBox/>
        </Flex>
    </>
}

export default MapTab;