import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import isEqual from 'lodash.isequal';

import {Box, Flex, SegmentedControl, Text} from '@mantine/core';
import {FiltersContext} from '../index';

const TypeFilterBox = () => {
    const { t } = useTranslation();
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
            <Text><b>{t('tab.filters.type.type')}</b></Text>
            <SegmentedControl
                style={{flex: 'fit-content'}}
                onChange={onChange}
                data={[
                    {label: t('tab.filters.type.text'),     value: 'text'},
                    {label: t('tab.filters.type.tags'),     value: 'tags'},
                    {label: t('tab.filters.type.hashtags'), value: 'hashtags'}
                ]}
                defaultValue={filters ? filters.type : undefined}/>
        </Flex>
    </Box>
}

export default TypeFilterBox;