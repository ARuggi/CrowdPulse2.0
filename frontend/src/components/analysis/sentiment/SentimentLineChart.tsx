import React, {useContext, useEffect, useRef, useState} from 'react';
import {createChart, CrosshairMode, IChartApi, LineStyle} from 'lightweight-charts';
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

function getWidthFromMediaQuery(mediaQueryLg:    boolean,
                                mediaQueryMdLg:  boolean,
                                mediaQuerySmMd:  boolean,
                                mediaQueryXsSm:  boolean,
                                mediaQuery2XsXs: boolean) {

    let size = 20;

    if (mediaQueryLg)    size = 70;
    if (mediaQueryMdLg)  size = 60;
    if (mediaQuerySmMd)  size = 55;
    if (mediaQueryXsSm)  size = 55;
    if (mediaQuery2XsXs) size = 50;

    const width = window.innerWidth;
    return width * (size / 100);

}

const getCurrentLocalDate = () => {
    return new Date().toISOString().slice(0, 10);
}

interface Visibility {
    showPositiveLine: boolean,
    showNeutralLine: boolean,
    showNegativeLine: boolean
}

const SentimentLineChart = () => {
    
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi>();

    const { t } = useTranslation();
    const { colorScheme } = useMantineColorScheme();
    const sentimentTimelineData = useContext<SentimentTimelineResponse | null>(SentimentTimelineContext);
    const [visibility, setVisibility] = useState<Visibility>({showNeutralLine: true, showPositiveLine: true, showNegativeLine: true});

    const mediaQueryLg    = useMediaQuery('(min-width: 1200px)');
    const mediaQueryMdLg  = useMediaQuery('(min-width: 992px) and (max-width: 1200px)');
    const mediaQuerySmMd  = useMediaQuery('(min-width: 768px) and (max-width: 992px)');
    const mediaQueryXsSm  = useMediaQuery('(min-width: 576px) and (max-width: 768px)');
    const mediaQuery2XsXs = useMediaQuery('(min-width: 300px) and (max-width: 576px)');

    let width = getWidthFromMediaQuery(mediaQueryLg, mediaQueryMdLg, mediaQuerySmMd, mediaQueryXsSm, mediaQuery2XsXs);
    let height = 300;

    const onChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>, propertyName: string) => {
        setVisibility({...visibility, [propertyName]: event.currentTarget.checked});
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

        if (sentimentTimelineData && chartContainerRef.current) {

            if (chartRef.current) {
                chartRef.current?.remove();
            }

            chartRef.current = createChart(chartContainerRef.current, {
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

            const positiveData = sentimentTimelineData && (sentimentTimelineData as Array<any>).length > 0
                ? sentimentTimelineData.map(current => {return {time: current.date, value: current.positiveCount}})
                : [{time: getCurrentLocalDate(), value: 0}];

            const neutralData = sentimentTimelineData && (sentimentTimelineData as Array<any>).length > 0
                ? sentimentTimelineData.map(current => {return {time: current.date, value: current.neutralCount}})
                : [{time: getCurrentLocalDate(), value: 0}];

            const negativeData = sentimentTimelineData && (sentimentTimelineData as Array<any>).length > 0
                ? sentimentTimelineData.map(current => {return {time: current.date, value: current.negativeCount}})
                : [{time: getCurrentLocalDate(), value: 0}];

            if (visibility.showPositiveLine) {
                chartRef.current?.addAreaSeries({
                    topColor: '#FFF200FF',
                    bottomColor: '#FFCD39A5',
                    lineColor: '#FFC234',
                    lineWidth: 2
                }).setData(positiveData);
            }

            if (visibility.showNeutralLine) {
                chartRef.current.addAreaSeries({
                    topColor: '#0077FF',
                    bottomColor: '#399CFF99',
                    lineColor: '#059BFF',
                    lineWidth: 2
                }).setData(neutralData);
            }

            if (visibility.showNegativeLine) {
                chartRef.current.addAreaSeries({
                    topColor: '#ff0000',
                    bottomColor: '#FF39390A',
                    lineColor: '#FF4069',
                    lineWidth: 2
                }).setData(negativeData);
            }

            chartRef.current?.timeScale().fitContent();
        }

    }, [sentimentTimelineData, visibility]);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current?.applyOptions({width: width, height: height, ...layoutOptions});
        }
    }, [colorScheme]);

    return <Box
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
            {sentimentTimelineData
                ? <>
                    <Switch label={t('tab.sentiment.positive')}
                            disabled={!visibility.showNeutralLine && !visibility.showNegativeLine}
                            defaultChecked={true}
                            size='xs'
                            color='yellow'
                            onChange={(event) => onChangeSwitch(event, 'showPositiveLine')}
                            style={{zIndex: 10}}/>
                    <Switch label={t('tab.sentiment.neutral')}
                            disabled={!visibility.showPositiveLine && !visibility.showNegativeLine}
                            defaultChecked={true}
                            size='xs'
                            color='blue'
                            style={{zIndex: 10}}
                            onChange={(event) => onChangeSwitch(event, 'showNeutralLine')}/>
                    <Switch label={t('tab.sentiment.negative')}
                            disabled={!visibility.showPositiveLine && !visibility.showNeutralLine}
                            defaultChecked={true}
                            size='xs'
                            color='red'
                            style={{zIndex: 10}}
                            onChange={(event) => onChangeSwitch(event, 'showNegativeLine')}/>
                    <div ref={chartContainerRef} style={{marginTop: '-30px', paddingBottom: '100px'}}/>
                </>
                : <Loader variant='bars' style={{}}/>}
        </Flex>
    </Box>
}

export default SentimentLineChart;