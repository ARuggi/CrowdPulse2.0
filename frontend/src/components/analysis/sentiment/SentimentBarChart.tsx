import React, {useContext} from 'react';
import {AxisBandOptions, AxisOptions, Chart} from 'react-charts';
import {useTranslation} from 'react-i18next';

import {Datum, DatumFocusStatus, DatumStyles} from 'react-charts/types/types';
import {Flex, Loader, useMantineColorScheme} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';

import SentimentTotalBox from './SentimentTotalBox';
import {SentimentContext} from './index';
import {FiltersContext} from '../index';

enum SentimentType {
    POSITIVE = 'positive',
    NEUTRAL  = 'neutral',
    NEGATIVE = 'negative'
}

enum EmotionType {
    JOY      = 'joy',
    SADNESS  = 'sadness',
    ANGER    = 'anger',
    FEAR     = 'fear'
}

type DataType = {
    type: SentimentType | EmotionType,
    value: number,
    color: string
}

function getWidthFromMediaQuery(mediaQueryLg:    boolean,
                                mediaQueryMdLg:  boolean,
                                mediaQuerySmMd:  boolean,
                                mediaQueryXsSm:  boolean,
                                mediaQuery2XsXs: boolean) {
    if (mediaQueryLg)    return 80;
    if (mediaQueryMdLg)  return 70;
    if (mediaQuerySmMd)  return 50;
    if (mediaQueryXsSm)  return 55;
    if (mediaQuery2XsXs) return 35;

    return 20;
}

const SentimentBarChart = () => {

    const { t } = useTranslation();
    const { colorScheme } = useMantineColorScheme();
    const { filters } = useContext(FiltersContext);
    const sentimentData = useContext(SentimentContext);

    const mediaQueryLg    = useMediaQuery('(min-width: 1200px)');
    const mediaQueryMdLg  = useMediaQuery('(min-width: 992px) and (max-width: 1200px)');
    const mediaQuerySmMd  = useMediaQuery('(min-width: 768px) and (max-width: 992px)');
    const mediaQueryXsSm  = useMediaQuery('(min-width: 576px) and (max-width: 768px)');
    const mediaQuery2XsXs = useMediaQuery('(min-width: 300px) and (max-width: 576px)');

    let width = getWidthFromMediaQuery(mediaQueryLg, mediaQueryMdLg, mediaQuerySmMd, mediaQueryXsSm, mediaQuery2XsXs);
    let height = filters.algorithm === 'sent-it' ? 300 : 150;

    const sentimentChartData = [
        {
            id: 'sentiment',
            label: t('tab.sentiment.sentiment'),
            data: [
                {type: SentimentType.POSITIVE, value: sentimentData ? sentimentData.sentimentData.positive : 0, color: '#FFC234'},
                {type: SentimentType.NEUTRAL,  value: sentimentData ? sentimentData.sentimentData.neutral  : 0, color: '#059BFF'},
                {type: SentimentType.NEGATIVE, value: sentimentData ? sentimentData.sentimentData.negative : 0, color: '#FF4069'}
            ],
        }
    ];

    const emotionChartData = [
        {
            id: 'emotion',
            label: t('tab.sentiment.emotion'),
            data: [
                {type: EmotionType.JOY,     value: sentimentData ? sentimentData.emotionData.joy     : 0, color: 'rgba(255,165,0,0.51)'},
                {type: EmotionType.SADNESS, value: sentimentData ? sentimentData.emotionData.sadness : 0, color: 'rgba(0,0,255,0.49)'},
                {type: EmotionType.ANGER,   value: sentimentData ? sentimentData.emotionData.anger   : 0, color: 'rgba(255,0,0,0.55)'},
                {type: EmotionType.FEAR,    value: sentimentData ? sentimentData.emotionData.fear    : 0, color: 'rgba(128,0,128,0.56)'}
            ],
        }
    ];

    const xAxis = React.useMemo(
        (): AxisBandOptions<DataType> => ({
            getValue: datum => datum.type,
            showGrid: true,
        }),
        []
    )

    const yAxis = React.useMemo(
        (): AxisOptions<DataType>[] => [{
            getValue: datum => datum.value,
            showGrid: true,
            min: 0
        }],
        []
    )

    const datumStyle = (datum: Datum<DataType>, status: DatumFocusStatus): DatumStyles => {
        let color = datum.originalDatum.color;
        let opacity = 0.75;

        if (status === 'focused') {
            opacity = 1;
        }

        return {
            rectangle: {
                fill: color,
                fillOpacity: `${opacity}`,
                strokeWidth: 2,
                strokeOpacity: 0.5
            }
        };
    }

    return <>
        <div style={{
            display: 'inline-block',
            width: 'auto',
            borderRadius: '0.5rem',
            boxShadow: '1px 1px rgba(0,0,0,.1)',
        }}>
            <div
                style={{
                    width: `${width}vh`,
                    height: `${height}px`
                }}>
                {sentimentData
                    ? <Chart
                        options={{
                            // the tooltip works fine on react-charts 3.0.0-beta.38
                            // issue: https://github.com/TanStack/react-charts/issues/301
                            tooltip: {show: true},
                            dark: colorScheme === 'dark',
                            data: sentimentChartData,
                            primaryAxis: xAxis,
                            secondaryAxes: yAxis,
                            secondaryCursor: {show: false},
                            primaryCursor: {showLabel: false},
                            interactionMode: 'primary',
                            getDatumStyle: datumStyle
                        }}/>
                    : <Flex
                        bg='rgba(0, 0, 0, .3)'
                        gap='md'
                        justify='center'
                        align='center'
                        direction='row'
                        wrap='wrap'>
                        <Loader variant='bars' style={{height: `${height}px`}}/>
                    </Flex>}
            </div>
            <div
                style={{
                    display: filters.algorithm === 'feel-it' ? '' : 'none',
                    width: `${width}vh`,
                    height: `${height}px`
                }}>
                {filters.algorithm === 'feel-it'
                    ? sentimentData
                        ? <Chart
                            options={{
                                // the tooltip works fine on react-charts 3.0.0-beta.38
                                // issue: https://github.com/TanStack/react-charts/issues/301
                                tooltip: {show: true},
                                dark: colorScheme === 'dark',
                                data: emotionChartData,
                                primaryAxis: xAxis,
                                secondaryAxes: yAxis,
                                secondaryCursor: {show: false},
                                primaryCursor: {showLabel: false},
                                interactionMode: 'primary',
                                getDatumStyle: datumStyle
                            }}/>
                        : <Flex
                            bg='rgba(0, 0, 0, .3)'
                            gap='md'
                            justify='center'
                            align='center'
                            direction='row'
                            wrap='wrap'>
                            <Loader variant='bars' style={{height: `${height}px`}}/>
                        </Flex>
                    : <></>}
            </div>
            <SentimentTotalBox/>
        </div>
    </>
}

export default SentimentBarChart;