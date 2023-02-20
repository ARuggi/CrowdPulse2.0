import React, {useContext} from 'react';
import Filters from "../filters";
import {Flex} from "@mantine/core";
import MapBox from "./MapBox";
import {DatabasesContext} from "../index";

const MapTab = () => {
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