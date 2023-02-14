import React from 'react';
import {Divider, Flex} from '@mantine/core';
import SentimentBarChart from './SentimentBarChart';
import SentimentCakeChart from './SentimentCakeChart';
import SentimentFilters from './filters';

interface IProps {
    dbs: string[]
}

const SentimentTab:React.FC<IProps> = ({dbs}) => {
    return <>
        <SentimentFilters style={{marginBottom: '20px'}}/>
        <Divider my="md"/>
        <Flex
            gap='md'
            justify='center'
            align='center'
            direction='row'
            wrap='wrap'>
            <SentimentBarChart/>
            <SentimentCakeChart/>
        </Flex>
    </>
}

export default SentimentTab;