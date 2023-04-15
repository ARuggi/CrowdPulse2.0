import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {Loader, RingProgress, Text} from '@mantine/core';
import {SentimentContext} from './index';
import {SentimentResponse} from "../../../api/SentimentResponse";

const calcSentimentPercentages = (sentimentData: SentimentResponse) => {
    const sentimentTotal =
        sentimentData.sentimentData.positive
        + sentimentData.sentimentData.neutral
        + sentimentData.sentimentData.negative;

    return {
        positive: sentimentData.sentimentData.positive === 0 ? 0 : Number.parseFloat(((sentimentData.sentimentData.positive / sentimentTotal) * 100).toFixed(2)),
        neutral:  sentimentData.sentimentData.neutral  === 0 ? 0 : Number.parseFloat(((sentimentData.sentimentData.neutral  / sentimentTotal) * 100).toFixed(2)),
        negative: sentimentData.sentimentData.negative === 0 ? 0 : Number.parseFloat(((sentimentData.sentimentData.negative / sentimentTotal) * 100).toFixed(2))
    };
}

const SentItCakeChart = () => {
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
                {value: 100, color: 'gray', tooltip: t('loading')}
            ]}/>
    }

    const sentimentPercentages = calcSentimentPercentages(sentimentData);

    return <>
        <RingProgress
            size={250}
            thickness={30}
            label={
                <Text size='xs' align='center' px='xs' sx={{pointerEvents: 'none'}}>
                    <b>{t('tab.sentiment.percentage')}</b>
                </Text>
            }
            sections={[
                {value: sentimentPercentages.positive, color: '#FFC234', tooltip: `${t('tab.sentiment.positive')}: ${sentimentPercentages.positive}%`},
                {value: sentimentPercentages.neutral,  color: '#059BFF', tooltip: `${t('tab.sentiment.neutral')}: ${sentimentPercentages.neutral}%`},
                {value: sentimentPercentages.negative, color: '#FF4069', tooltip: `${t('tab.sentiment.negative')}: ${sentimentPercentages.negative}%`}
            ]}/>
    </>
}

export default SentItCakeChart;