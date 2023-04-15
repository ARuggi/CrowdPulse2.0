import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import isEqual from 'lodash.isequal';

import {Box, Flex, SegmentedControl, Text} from '@mantine/core';
import {FiltersContext} from '../index';

const HateSpeechFilterBox = () => {
    const { t } = useTranslation();
    const {filters, setFilters} = useContext(FiltersContext);

    const onChange = (value: string) => {
        const newFilters = {...filters, hateSpeech: value};
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
            <Text><b>{t('tab.filters.hateSpeech.hateSpeech')}</b></Text>
            <SegmentedControl
                disabled={filters.algorithm !== 'hate-speech'}
                style={{flex: 'fit-content'}}
                onChange={onChange}
                data={[
                    {label: t('tab.filters.hateSpeech.all'),           value: 'all'},
                    {label: t('tab.filters.hateSpeech.acceptable'),    value: 'acceptable'},
                    {label: t('tab.filters.hateSpeech.inappropriate'), value: 'inappropriate'},
                    {label: t('tab.filters.hateSpeech.offensive'),     value: 'offensive'},
                    {label: t('tab.filters.hateSpeech.violent'),       value: 'violent'}
                ]}
                defaultValue={filters ? filters.hateSpeech : undefined}/>
        </Flex>
    </Box>
}

export default HateSpeechFilterBox;