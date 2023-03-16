import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import isEqual from 'lodash.isequal';

import {Box, Flex, SegmentedControl, Text} from '@mantine/core';
import {FiltersContext} from '../index';

const EmotionFilterBox = () => {
    const { t } = useTranslation();
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
            <Text><b>{t('tab.filters.emotion.emotion')}</b></Text>
            <SegmentedControl
                disabled={filters.algorithm !== 'feel-it'}
                style={{flex: 'fit-content'}}
                onChange={onChange}
                data={[
                    {label: t('tab.filters.emotion.all'),     value: 'all'},
                    {label: t('tab.filters.emotion.joy'),     value: 'joy'},
                    {label: t('tab.filters.emotion.sadness'), value: 'sadness'},
                    {label: t('tab.filters.emotion.anger'),   value: 'anger'},
                    {label: t('tab.filters.emotion.fear'),    value: 'fear'}
                ]}
                defaultValue={filters ? filters.emotion : undefined}/>
        </Flex>
    </Box>
}

export default EmotionFilterBox;