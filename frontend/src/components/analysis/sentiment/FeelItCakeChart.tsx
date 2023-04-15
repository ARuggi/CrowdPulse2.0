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

const calcEmotionPercentages = (sentimentData: SentimentResponse) => {
    const emotionTotal =
        sentimentData.emotionData.joy
        + sentimentData.emotionData.sadness
        + sentimentData.emotionData.anger
        + sentimentData.emotionData.fear;

    return {
        joy:      sentimentData.emotionData.joy     === 0 ? 0 : Number.parseFloat(((sentimentData.emotionData.joy     / emotionTotal) * 100).toFixed(2)),
        sadness:  sentimentData.emotionData.sadness === 0 ? 0 : Number.parseFloat(((sentimentData.emotionData.sadness / emotionTotal) * 100).toFixed(2)),
        anger:    sentimentData.emotionData.anger   === 0 ? 0 : Number.parseFloat(((sentimentData.emotionData.anger   / emotionTotal) * 100).toFixed(2)),
        fear:     sentimentData.emotionData.fear    === 0 ? 0 : Number.parseFloat(((sentimentData.emotionData.fear    / emotionTotal) * 100).toFixed(2))
    };
}

const FeelItCakeChart = () => {
    const { t } = useTranslation();
    const sentimentData = useContext(SentimentContext);

    if (!sentimentData) {
        return <>
            <RingProgress
                size={200}
                thickness={25}
                label={
                    <Text size='xs' align='center' px='xs' sx={{pointerEvents: 'none'}}>
                        <Loader size='xl' variant='bars'/>
                    </Text>
                }
                sections={[
                    {value: 100, color: 'gray', tooltip: t('loading')}
                ]}/>
            <RingProgress
                size={200}
                thickness={25}
                label={
                    <Text size='xs' align='center' px='xs' sx={{pointerEvents: 'none'}}>
                        <Loader size='xl' variant='bars'/>
                    </Text>
                }
                sections={[
                    {value: 100, color: 'gray', tooltip: t('loading')}
                ]}/>
        </>
    }

    const sentimentPercentages = calcSentimentPercentages(sentimentData);
    const emotionPercentages = calcEmotionPercentages(sentimentData);

    return <>
        <RingProgress
            size={200}
            thickness={25}
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
        <RingProgress
            size={200}
            thickness={25}
            label={
                <Text size='xs' align='center' px='xs' sx={{pointerEvents: 'none'}}>
                    <b>{t('tab.sentiment.percentage')}</b>
                </Text>
            }
            sections={[
                {value: emotionPercentages.joy,     color: '#FFA50082', tooltip: `${t('tab.sentiment.joy')}:     ${emotionPercentages.joy}%`},
                {value: emotionPercentages.sadness, color: '#0000FF7C', tooltip: `${t('tab.sentiment.sadness')}: ${emotionPercentages.sadness}%`},
                {value: emotionPercentages.anger,   color: '#FF00008C', tooltip: `${t('tab.sentiment.anger')}:   ${emotionPercentages.anger}%`},
                {value: emotionPercentages.fear,    color: '#8000808E', tooltip: `${t('tab.sentiment.fear')}:    ${emotionPercentages.fear}%`}
            ]}/>
    </>
}

export default FeelItCakeChart;