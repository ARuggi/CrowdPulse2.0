import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    AreaData,
    AreaSeriesPartialOptions,
    createChart,
    CrosshairMode,
    IChartApi,
    LineStyle,
} from 'lightweight-charts';
import {useTranslation} from 'react-i18next';

import {
    Box,
    Flex,
    Loader,
    Switch,
    useMantineColorScheme
} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';

import {SentimentTimelineContext} from './index';
import {SentimentTimelineResponse} from '../../../api/SentimentTimelineResponse';
import {FiltersContext} from "../index";

interface ContentVisibility {
    showHateSpeechAcceptableLine: boolean,
    showHateSpeechInappropriateLine: boolean,
    showHateSpeechOffensiveLine: boolean,
    showHateSpeechViolentLine: boolean,
}

const HATE_SPEECH_ACCEPTABLE_LINE_AREA_SERIES: AreaSeriesPartialOptions = {
    topColor: '#8B5D0082',
    bottomColor: '#2D200082',
    lineColor: '#FFA50082',
    lineWidth: 2
};

const HATE_SPEECH_INAPPROPRIATE_LINE_AREA_SERIES: AreaSeriesPartialOptions = {
    topColor: '#0000707C',
    bottomColor: '#0000217C',
    lineColor: '#0000FF7C',
    lineWidth: 2
};

const HATE_SPEECH_OFFENSIVE_LINE_AREA_SERIES: AreaSeriesPartialOptions = {
    topColor: '#9B00008C',
    bottomColor: '#5000008C',
    lineColor: '#FF00008C',
    lineWidth: 2
};

const HATE_SPEECH_VIOLENT_LINE_AREA_SERIES: AreaSeriesPartialOptions = {
    topColor: '#8000808E',
    bottomColor: '#4900498E',
    lineColor: '#CC00CC8E',
    lineWidth: 2
};

const getCurrentLocalDate = () => {
    return new Date().toISOString().slice(0, 10);
}

const calcDateFromTimeline = (sentimentTimelineData: SentimentTimelineResponse, property: string): AreaData[] => {
    return sentimentTimelineData && (sentimentTimelineData.data as Array<any>).length > 0
        ? sentimentTimelineData
            .data
            .map(current => {
                return {
                    time: current.date,
                    value: (current as unknown as any)[property]
                };
            }) as AreaData[]
        : [{time: getCurrentLocalDate(), value: 0}] as AreaData[];
}

const HateSpeechLineChart = () => {

    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi>();

    const {t} = useTranslation();
    const {colorScheme} = useMantineColorScheme();
    const {filters} = useContext(FiltersContext);
    const sentimentTimelineData = useContext<SentimentTimelineResponse | null>(SentimentTimelineContext);

    const mediaQuery = useMediaQuery('(max-width: 576px)');
    const [visibility, setVisibility] = useState<ContentVisibility>({
        showHateSpeechAcceptableLine: true,
        showHateSpeechInappropriateLine: true,
        showHateSpeechOffensiveLine: true,
        showHateSpeechViolentLine: true,
    });

    const width = window.innerWidth * 0.80;
    const height = 300;

    const onChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>, propertyName: string) => {
        if (visibility) setVisibility({...visibility, [propertyName]: event.currentTarget.checked});
    }

    const layoutOptions = {
        layout: {
            background: {color: colorScheme === 'dark' ? '#25262b' : '#F8F9FA'},
            textColor: colorScheme === 'dark' ? '#FFFFFFE5' : '#000',
        },
        grid: {
            vertLines: {visible: false},
            horzLines: {visible: false}
        },
    }

    if (chartRef.current) {
        chartRef.current?.resize(width, height);
    }

    useEffect(() => {
        if (!sentimentTimelineData) return;

        if (chartRef.current) {
            chartRef.current?.remove();
            (chartContainerRef?.current as HTMLElement).innerHTML = '';
        }

        chartRef.current = createChart(chartContainerRef.current as HTMLDivElement, {
            width: width,
            height: height,
            crosshair: {
                mode: CrosshairMode.Magnet,
                vertLine: {
                    width: 4,
                    color: '#C3BCDB44',
                    style: LineStyle.Solid,
                    labelBackgroundColor: '#9B7DFF',
                },
                horzLine: {
                    color: '#9B7DFF',
                    labelBackgroundColor: '#9B7DFF',
                }
            },
            ...layoutOptions
        });

        /*const seriesMap = Reflect.get(chartRef?.current as object, '_private__seriesMap') as Map<ISeriesApi<any>, Series<any>>;

        seriesMap.forEach((series, key) => {
            key.setData([] as AreaData[]);
        });*/

        if (visibility.showHateSpeechAcceptableLine) {
            chartRef.current
                ?.addAreaSeries(HATE_SPEECH_ACCEPTABLE_LINE_AREA_SERIES)
                .setData(calcDateFromTimeline(sentimentTimelineData, 'hateSpeechAcceptableCount'));
        }

        if (visibility.showHateSpeechInappropriateLine) {
            chartRef.current
                ?.addAreaSeries(HATE_SPEECH_INAPPROPRIATE_LINE_AREA_SERIES)
                .setData(calcDateFromTimeline(sentimentTimelineData, 'hateSpeechInappropriateCount'));
        }

        if (visibility.showHateSpeechOffensiveLine) {
            chartRef.current
                ?.addAreaSeries(HATE_SPEECH_OFFENSIVE_LINE_AREA_SERIES)
                .setData(calcDateFromTimeline(sentimentTimelineData, 'hateSpeechOffensiveCount'));
        }

        if (visibility.showHateSpeechViolentLine) {
            chartRef.current
                ?.addAreaSeries(HATE_SPEECH_VIOLENT_LINE_AREA_SERIES)
                .setData(calcDateFromTimeline(sentimentTimelineData, 'hateSpeechViolentCount'));
        }

        chartRef.current?.timeScale().fitContent();
        chartRef.current?.resize(width, height);

    }, [sentimentTimelineData, filters, visibility]);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current?.applyOptions({width: width, height: height, ...layoutOptions});
        }
    }, [colorScheme]);

    return <Box
        style={mediaQuery ? {paddingBottom: '60px'} : {paddingTop: '20px'}}
        sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            textAlign: 'center',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.md,
            cursor: 'pointer'
        })}>
        <Flex
            style={{width: `${width}px`, height: `${height}px`}}
            gap='md'
            justify='center'
            align='center'
            direction='row'
            wrap='wrap'>
            {sentimentTimelineData && visibility
                ? <>
                    <Switch label={t('tab.sentiment.acceptable')}
                            disabled={!visibility.showHateSpeechInappropriateLine
                                && !visibility.showHateSpeechOffensiveLine
                                && !visibility.showHateSpeechViolentLine}
                            defaultChecked={true}
                            size='xs'
                            color='yellow'
                            style={{zIndex: 10, ...(mediaQuery ? {marginBottom: '30px'} : {})}}
                            onChange={(event) => onChangeSwitch(event, 'showHateSpeechAcceptableLine')}/>
                    <Switch label={t('tab.sentiment.inappropriate')}
                            disabled={!visibility.showHateSpeechAcceptableLine
                                && !visibility.showHateSpeechOffensiveLine
                                && !visibility.showHateSpeechViolentLine}
                            defaultChecked={true}
                            size='xs'
                            color='blue'
                            style={{zIndex: 10, ...(mediaQuery ? {marginBottom: '30px'} : {})}}
                            onChange={(event) => onChangeSwitch(event, 'showHateSpeechInappropriateLine')}/>
                    <Switch label={t('tab.sentiment.offensive')}
                            disabled={!visibility.showHateSpeechAcceptableLine
                                && !visibility.showHateSpeechInappropriateLine
                                && !visibility.showHateSpeechViolentLine}
                            defaultChecked={true}
                            size='xs'
                            color='red'
                            style={{zIndex: 10, ...(mediaQuery ? {marginBottom: '30px'} : {})}}
                            onChange={(event) => onChangeSwitch(event, 'showHateSpeechOffensiveLine')}/>
                    <Switch label={t('tab.sentiment.violent')}
                            disabled={!visibility.showHateSpeechAcceptableLine
                                && !visibility.showHateSpeechInappropriateLine
                                && !visibility.showHateSpeechOffensiveLine}
                            defaultChecked={true}
                            size='xs'
                            color='pink'
                            style={{zIndex: 10, ...(mediaQuery ? {marginBottom: '30px'} : {})}}
                            onChange={(event) => onChangeSwitch(event, 'showHateSpeechViolentLine')}/>
                    <div ref={chartContainerRef} style={{marginTop: '-50px', paddingBottom: '120px'}}/>
                </>
                : <Loader variant='bars' style={{}}/>}
        </Flex>
    </Box>
}

export default HateSpeechLineChart;