import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {Loader, RingProgress, Text} from '@mantine/core';
import {SentimentContext} from './index';
import {SentimentResponse} from "../../../api/SentimentResponse";

const calcHateSpeechPercentages = (sentimentData: SentimentResponse) => {
    const hateSpeechTotal =
        sentimentData.hateSpeechData.acceptable
        + sentimentData.hateSpeechData.inappropriate
        + sentimentData.hateSpeechData.offensive
        + sentimentData.hateSpeechData.violent;


    return {
        acceptable:    sentimentData.hateSpeechData.acceptable    === 0 ? 0 : Number.parseFloat(((sentimentData.hateSpeechData.acceptable    / hateSpeechTotal) * 100).toFixed(2)),
        inappropriate: sentimentData.hateSpeechData.inappropriate === 0 ? 0 : Number.parseFloat(((sentimentData.hateSpeechData.inappropriate / hateSpeechTotal) * 100).toFixed(2)),
        offensive:     sentimentData.hateSpeechData.offensive     === 0 ? 0 : Number.parseFloat(((sentimentData.hateSpeechData.offensive     / hateSpeechTotal) * 100).toFixed(2)),
        violent:       sentimentData.hateSpeechData.violent       === 0 ? 0 : Number.parseFloat(((sentimentData.hateSpeechData.violent       / hateSpeechTotal) * 100).toFixed(2))
    }
}

const HateSpeechCakeChart = () => {
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

    const hateSpeechPercentages = calcHateSpeechPercentages(sentimentData);

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
                {value: hateSpeechPercentages.acceptable,    color: '#FFA50082', tooltip: `${t('tab.sentiment.acceptable')}:    ${hateSpeechPercentages.acceptable}%`},
                {value: hateSpeechPercentages.inappropriate, color: '#0000FF7C', tooltip: `${t('tab.sentiment.inappropriate')}: ${hateSpeechPercentages.inappropriate}%`},
                {value: hateSpeechPercentages.offensive,     color: '#FF00008C', tooltip: `${t('tab.sentiment.offensive')}:     ${hateSpeechPercentages.offensive}%`},
                {value: hateSpeechPercentages.violent,       color: '#8000808E', tooltip: `${t('tab.sentiment.violent')}:       ${hateSpeechPercentages.violent}%`}
            ]}/>
    </>
}

export default HateSpeechCakeChart;