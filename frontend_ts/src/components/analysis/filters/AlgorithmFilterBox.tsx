import React, {useContext} from 'react';
import {Box, Flex, SegmentedControl, Text} from '@mantine/core';
import {FiltersContext} from '../index';
import isEqual from 'lodash.isequal';

interface IProps {
    disableAllLabel: boolean | undefined
}

const AlgorithmFilterBox:React.FC<IProps> = ({disableAllLabel = false}) => {
    const {filters, setFilters} = useContext(FiltersContext);

    const onChange = (value: string) => {
        const newFilters = {...filters, algorithm: value};
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
            <Text><b>Algorithm</b></Text>
            <SegmentedControl
                style={{flex: 'fit-content'}}
                onChange={onChange}
                data={disableAllLabel ? [
                    {label: 'sent-it', value: 'sent-it'},
                    {label: 'feel-it', value: 'feel-it'}
                ] : [
                    {label: 'all', value: 'all'},
                    {label: 'sent-it', value: 'sent-it'},
                    {label: 'feel-it', value: 'feel-it'}
                ]}
                defaultValue={filters ? filters.algorithm : undefined}/>
        </Flex>
    </Box>
}

export default AlgorithmFilterBox;