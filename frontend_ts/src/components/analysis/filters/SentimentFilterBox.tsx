import React from 'react';
import {Box, Flex, SegmentedControl, Text} from '@mantine/core';

const AlgorithmFilterBox = () => {
    return <Box
        sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            textAlign: 'center',
            padding: theme.spacing.xl,
            borderRadius: theme.radius.md,
            height: '100%'
        })}>
        <Flex
            gap='md'
            justify='center'
            align='center'
            direction='row'
            wrap='wrap'>
            <Text><b>Sentiment</b></Text>
            <SegmentedControl
                style={{flex: 'fit-content'}}
                data={[
                    {label: 'all',      value: 'all'},
                    {label: 'positive', value: 'positive'},
                    {label: 'neutral',  value: 'neutral'},
                    {label: 'negative', value: 'negative'}
                ]}/>
        </Flex>
    </Box>
}

export default AlgorithmFilterBox;