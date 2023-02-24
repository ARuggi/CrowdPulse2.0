import React, {useContext} from 'react';
import {Box, Flex, SegmentedControl, Text} from '@mantine/core';
import {FiltersContext} from "../index";
import isEqual from "lodash.isequal";

const SentimentFilterBox = () => {
    const {filters, setFilters} = useContext(FiltersContext);

    const onChange = (value: string) => {
        const newFilters = {...filters, sentiment: value};
        setFilters(isEqual(filters, newFilters) ? filters : newFilters);
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
            <Text><b>Sentiment</b></Text>
            <SegmentedControl
                disabled={filters.algorithm === 'all'}
                style={{flex: 'fit-content'}}
                onChange={onChange}
                data={[
                    {label: 'all',      value: 'all'},
                    {label: 'positive', value: 'positive'},
                    {label: 'neutral',  value: 'neutral'},
                    {label: 'negative', value: 'negative'}
                ]}
                defaultValue={filters ? filters.sentiment : undefined}/>
        </Flex>
    </Box>
}

export default SentimentFilterBox;