import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {Box, Flex, Loader, Text} from '@mantine/core';
import {SentimentContext} from './index';

const SentimentTotalBox = () => {
    const { t } = useTranslation();
    const sentimentData = useContext(SentimentContext);

    return <Box
        sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            textAlign: 'center',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm
        })}>
        <Flex
            gap='md'
            justify='center'
            align='center'
            direction='row'
            wrap='wrap'>
            <Text><b>{t('tab.sentiment.processed')}</b></Text>
            {sentimentData
                ? <Text>{sentimentData?.processed}</Text>
                : <Loader size='sm' variant='dots'/>}
            <Text><b>{t('tab.sentiment.notProcessed')}</b></Text>
            {sentimentData
                ? <Text>{sentimentData?.notProcessed}</Text>
                : <Loader size='sm' variant='dots'/>}
            <Text><b>{t('tab.sentiment.total')}</b></Text>
            {sentimentData
                ? <Text>{
                    sentimentData?.sentimentData.positive
                    + sentimentData?.sentimentData.neutral
                    + sentimentData?.sentimentData.negative
                }</Text>
                : <Loader size='sm' variant='dots'/>}
        </Flex>
    </Box>
}

export default SentimentTotalBox;