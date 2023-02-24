import React, {useContext} from 'react';
import {Box, Flex, SegmentedControl, Text} from '@mantine/core';
import {FiltersContext} from "../index";
import isEqual from "lodash.isequal";

const EmotionFilterBox = () => {
    const {filters, setFilters} = useContext(FiltersContext);

    const onChange = (value: string) => {
        const newFilters = {...filters, emotion: value};
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
            <Text><b>Emotion</b></Text>
            <SegmentedControl
                disabled={filters.algorithm !== 'feel-it'}
                style={{flex: 'fit-content'}}
                onChange={onChange}
                data={[
                    {label: 'all',     value: 'all'},
                    {label: 'joy',     value: 'joy'},
                    {label: 'sadness', value: 'sadness'},
                    {label: 'anger',   value: 'anger'},
                    {label: 'fear',    value: 'fear'}
                ]}
                defaultValue={filters ? filters.emotion : undefined}/>
        </Flex>
    </Box>
}

export default EmotionFilterBox;