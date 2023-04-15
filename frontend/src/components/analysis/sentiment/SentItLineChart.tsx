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
import {FiltersContext} from '../index';

interface ContentVisibility {
    showSentimentPositiveLine: boolean,
    showSentimentNeutralLine: boolean,
    showSentimentNegativeLine: boolean
}

const SENTIMENT_POSITIVE_LINE_AREA_SERIES: AreaSeriesPartialOptions = {
    topColor: '#FFF200FF',
    bottomColor: '#FFCD39A5',
    lineColor: '#FFC234',
    lineWidth: 2
};

const SENTIMENT_NEUTRAL_LINE_AREA_SERIES: AreaSeriesPartialOptions = {
    topColor: '#0077FF',
    bottomColor: '#399CFF99',
    lineColor: '#059BFF',
    lineWidth: 2
};

const SENTIMENT_NEGATIVE_LINE_AREA_SERIES: AreaSeriesPartialOptions = {
    topColor: '#ff0000',
    bottomColor: '#FF39390A',
    lineColor: '#FF4069',
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

const SentItLineChart = () => {

    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi>();

    const {t} = useTranslation();
    const {colorScheme} = useMantineColorScheme();
    const {filters} = useContext(FiltersContext);
    const sentimentTimelineData = useContext<SentimentTimelineResponse | null>(SentimentTimelineContext);

    const mediaQuery = useMediaQuery('(max-width: 576px)');
    const [visibility, setVisibility] = useState<ContentVisibility>({
        showSentimentPositiveLine: true,
        showSentimentNeutralLine: true,
        showSentimentNegativeLine: true
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

        if (visibility.showSentimentPositiveLine) {
            chartRef.current
                ?.addAreaSeries(SENTIMENT_POSITIVE_LINE_AREA_SERIES)
                .setData(calcDateFromTimeline(sentimentTimelineData, 'sentimentPositiveCount'));
        }

        if (visibility.showSentimentNeutralLine) {
            chartRef.current
                ?.addAreaSeries(SENTIMENT_NEUTRAL_LINE_AREA_SERIES)
                .setData(calcDateFromTimeline(sentimentTimelineData, 'sentimentNeutralCount'));
        }

        if (visibility.showSentimentNegativeLine) {
            chartRef.current
                ?.addAreaSeries(SENTIMENT_NEGATIVE_LINE_AREA_SERIES)
                .setData(calcDateFromTimeline(sentimentTimelineData, 'sentimentNegativeCount'));
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
        style={mediaQuery ? {paddingBottom: '30px'} : {}}
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
                    <Switch label={t('tab.sentiment.positive')}
                            disabled={!visibility.showSentimentNeutralLine && !visibility.showSentimentNegativeLine}
                            defaultChecked={true}
                            size='xs'
                            color='yellow'
                            style={{zIndex: 10, ...(mediaQuery ? {marginBottom: '20px'} : {})}}
                            onChange={(event) => onChangeSwitch(event, 'showSentimentPositiveLine')}/>
                    <Switch label={t('tab.sentiment.neutral')}
                            disabled={!visibility.showSentimentPositiveLine && !visibility.showSentimentNegativeLine}
                            defaultChecked={true}
                            size='xs'
                            color='blue'
                            style={{zIndex: 10, ...(mediaQuery ? {marginBottom: '20px'} : {})}}
                            onChange={(event) => onChangeSwitch(event, 'showSentimentNeutralLine')}/>
                    <Switch label={t('tab.sentiment.negative')}
                            disabled={!visibility.showSentimentPositiveLine && !visibility.showSentimentNeutralLine}
                            defaultChecked={true}
                            size='xs'
                            color='red'
                            style={{zIndex: 10, ...(mediaQuery ? {marginBottom: '20px'} : {})}}
                            onChange={(event) => onChangeSwitch(event, 'showSentimentNegativeLine')}/>
                    <div ref={chartContainerRef} style={{marginTop: '-30px', paddingBottom: '100px'}}/>
                </>
                : <Loader variant='bars' style={{}}/>}
        </Flex>
    </Box>
}

export default SentItLineChart;