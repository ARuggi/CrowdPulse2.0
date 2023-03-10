import React, {useContext} from 'react';
import {Box, Flex, SegmentedControl, Text} from '@mantine/core';
import {FiltersContext} from "../index";
import isEqual from "lodash.isequal";

const TypeFilterBox = () => {
    const {filters, setFilters} = useContext(FiltersContext);

    const onChange = (value: string) => {
        const newFilters = {...filters, type: value};
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
            <Text><b>Type</b></Text>
            <SegmentedControl
                style={{flex: 'fit-content'}}
                onChange={onChange}
                data={[
                    {label: 'text',     value: 'text'},
                    {label: 'tags',     value: 'tags'},
                    {label: 'hashtags', value: 'hashtags'}
                ]}
                defaultValue={filters ? filters.type : undefined}/>
        </Flex>
    </Box>
}

export default TypeFilterBox;