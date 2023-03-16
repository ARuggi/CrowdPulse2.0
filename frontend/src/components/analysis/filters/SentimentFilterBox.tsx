import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import isEqual from 'lodash.isequal';

import {Box, Flex, SegmentedControl, Text} from '@mantine/core';
import {FiltersContext} from '../index';

const SentimentFilterBox = () => {
    const { t } = useTranslation();
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
            <Text><b>{t('tab.filters.sentiment.sentiment')}</b></Text>
            <SegmentedControl
                disabled={filters.algorithm === 'all'}
                style={{flex: 'fit-content'}}
                onChange={onChange}
                data={[
                    {label: t('tab.filters.sentiment.all'),      value: 'all'},
                    {label: t('tab.filters.sentiment.positive'), value: 'positive'},
                    {label: t('tab.filters.sentiment.neutral'),  value: 'neutral'},
                    {label: t('tab.filters.sentiment.negative'), value: 'negative'}
                ]}
                defaultValue={filters ? filters.sentiment : undefined}/>
        </Flex>
    </Box>
}

export default SentimentFilterBox;