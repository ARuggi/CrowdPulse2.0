import React from 'react';
import {Box, Flex, SegmentedControl, Text} from '@mantine/core';

const TypeFilterBox = () => {
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
            <Text><b>Type</b></Text>
            <SegmentedControl
                style={{flex: 'fit-content'}}
                data={[
                    {label: 'text',     value: 'text'},
                    {label: 'tags',     value: 'tags'},
                    {label: 'hashtags', value: 'hashtags'}
                ]}/>
        </Flex>
    </Box>
}

export default TypeFilterBox;