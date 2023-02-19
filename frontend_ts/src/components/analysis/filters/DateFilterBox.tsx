import React, {useContext, useEffect, useState} from 'react';
import {Box, Flex, Switch} from '@mantine/core';
import {DateRangePicker, DateRangePickerValue} from '@mantine/dates';
import {FiltersContext} from '../index';

const getDates = (): DateRangePickerValue => {
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    return [oneYearAgo, now];
}

const DateFilterBox = () => {
    const [value, setValue] = useState<DateRangePickerValue>(getDates());
    const [enabled, setEnabled] = useState(false);
    const {filters, setFilters} = useContext(FiltersContext);

    useEffect(() => {
        if (filters) {
            const dateFrom = value[0];
            const dateTo   = value[1];
            let newFilters = {...filters};

            if (enabled && dateFrom && dateTo) {
                newFilters.dateFrom = dateFrom;
                newFilters.dateTo =  dateTo;
            } else {
                newFilters.dateFrom = undefined;
                newFilters.dateTo =  undefined;
            }

            setFilters(newFilters);
        }
    }, [value]);

    const onChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEnabled(event.currentTarget.checked);
        setValue([...value]);
    }

    const onChangeDate = (value: DateRangePickerValue) => {
        setValue(value);
    }

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
            <Switch
                onLabel="ON"
                offLabel="OFF"
                onChange={onChangeSwitch}
                label={<b>Date filter</b>}
            />
            <DateRangePicker
                placeholder='Pick dates range'
                disabled={!enabled}
                value={value}
                onChange={onChangeDate}
                style={{flex: 'fit-content', paddingTop: '4px'}}
            />
        </Flex>
    </Box>
}

export default DateFilterBox;