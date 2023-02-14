import React from 'react';
import Filters from "../filters";
import {Flex} from "@mantine/core";
import TimelineBarChart from "./TimelineBarChart";

interface IProps {
    dbs: string[]
}

const TimelineTab:React.FC<IProps> = ({dbs}) => {
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
            <TimelineBarChart/>
        </Flex>
    </>
}

export default TimelineTab;