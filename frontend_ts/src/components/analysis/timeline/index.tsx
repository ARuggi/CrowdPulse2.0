import React, {useContext} from 'react';
import Filters from "../filters";
import {Flex} from "@mantine/core";
import TimelineBarChart from "./TimelineBarChart";
import {DatabasesContext} from "../index";

const TimelineTab = () => {
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
            <TimelineBarChart/>
        </Flex>
    </>
}

export default TimelineTab;