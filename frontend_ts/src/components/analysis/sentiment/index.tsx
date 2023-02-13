import React from 'react';
import {Center} from '@mantine/core';
import SentimentBarChart from "./SentimentBarChart";

interface IProps {
    dbs: string[]
}

const SentimentTab:React.FC<IProps> = ({dbs}) => {
    return <Center>
        <SentimentBarChart style={{}}/>
    </Center>
}

export default SentimentTab;