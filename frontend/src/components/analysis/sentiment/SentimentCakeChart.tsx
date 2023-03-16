import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {Loader, RingProgress, Text} from '@mantine/core';
import {SentimentContext} from './index';

const SentimentCakeChart = () => {
    const { t } = useTranslation();
    const sentimentData = useContext(SentimentContext);

    if (!sentimentData) {
        return <RingProgress
            size={250}
            thickness={30}
            label={
                <Text size='xs' align='center' px='xs' sx={{pointerEvents: 'none'}}>
                    <Loader size='xl' variant='bars'/>
                </Text>
            }
            sections={[
                {value: 100, color: 'gray', tooltip: 'loading...'}
            ]}/>
    }

    let total =
        sentimentData.sentimentData.positive
        + sentimentData.sentimentData.neutral
        + sentimentData.sentimentData.negative;

    const percentages = {
        positive: sentimentData.sentimentData.positive === 0 ? 0 : Number.parseFloat(((sentimentData.sentimentData.positive / total) * 100).toFixed(2)),
        neutral:  sentimentData.sentimentData.neutral  === 0 ? 0 : Number.parseFloat(((sentimentData.sentimentData.neutral  / total) * 100).toFixed(2)),
        negative: sentimentData.sentimentData.negative === 0 ? 0 : Number.parseFloat(((sentimentData.sentimentData.negative / total) * 100).toFixed(2))
    }

    return <RingProgress
        size={250}
        thickness={30}
        label={
            <Text size='xs' align='center' px='xs' sx={{pointerEvents: 'none'}}>
                <b>{t('tab.sentiment.percentage')}</b>
            </Text>
        }
        sections={[
            {value: percentages.positive, color: '#ffc234', tooltip: `${t('tab.sentiment.positive')}: ${percentages.positive}%`},
            {value: percentages.neutral,  color: '#059bff', tooltip: `${t('tab.sentiment.neutral')}: ${percentages.neutral}%`},
            {value: percentages.negative, color: '#ff4069', tooltip: `${t('tab.sentiment.negative')}: ${percentages.negative}%`}
        ]}/>
}

export default SentimentCakeChart;