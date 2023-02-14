import React from 'react';
import {Flex} from '@mantine/core';
import SentimentBarChart from './SentimentBarChart';
import SentimentCakeChart from './SentimentCakeChart';
import Filters from '../filters';

interface IProps {
    dbs: string[]
}

const SentimentTab:React.FC<IProps> = ({dbs}) => {
    return <>
        <Filters />
        <Flex
            style={{marginTop: '50px'}}
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