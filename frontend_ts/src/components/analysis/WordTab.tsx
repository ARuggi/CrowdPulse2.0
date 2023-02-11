import React from 'react';
import {Center, Loader} from '@mantine/core';

interface IProps {
    dbs: string[]
}

const WordTab:React.FC<IProps> = ({dbs}) => {
    return <Center><Loader size='xl' variant='dots' /></Center>
}

export default WordTab;