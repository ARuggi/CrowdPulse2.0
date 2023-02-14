import React, {useState} from 'react';
import {Box, Flex, Text} from '@mantine/core';
import {DateRangePicker, DateRangePickerValue} from '@mantine/dates';

const DateFilterBox = () => {
    const [value, setValue] = useState<DateRangePickerValue>([
        new Date(2023, 2, 1),
        new Date(2023, 2, 14),
    ]);

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
            <Text><b>Data range</b></Text>
            <DateRangePicker
                placeholder='Pick dates range'
                value={value}
                onChange={setValue}
                style={{flex: 'fit-content', paddingTop: '4px'}}
            />
        </Flex>
    </Box>
}

export default DateFilterBox;