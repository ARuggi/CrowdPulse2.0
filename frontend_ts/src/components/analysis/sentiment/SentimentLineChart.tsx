import React, {useContext, useEffect, useRef} from 'react';

import {useMediaQuery} from '@mantine/hooks';
import {Box, Flex, Loader, useMantineColorScheme} from '@mantine/core';
import {createChart, CrosshairMode, IChartApi} from 'lightweight-charts';

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

const SentimentLineChart = () => {

    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi>();

    const { colorScheme } = useMantineColorScheme();
    const sentimentTimelineData = useContext<SentimentTimelineResponse | null>(SentimentTimelineContext);

    const mediaQueryLg    = useMediaQuery('(min-width: 1200px)');
    const mediaQueryMdLg  = useMediaQuery('(min-width: 992px) and (max-width: 1200px)');
    const mediaQuerySmMd  = useMediaQuery('(min-width: 768px) and (max-width: 992px)');
    const mediaQueryXsSm  = useMediaQuery('(min-width: 576px) and (max-width: 768px)');
    const mediaQuery2XsXs = useMediaQuery('(min-width: 300px) and (max-width: 576px)');

    let width = getWidthFromMediaQuery(mediaQueryLg, mediaQueryMdLg, mediaQuerySmMd, mediaQueryXsSm, mediaQuery2XsXs);
    let height = 300;

    const layoutOptions = {
        layout: {
            background: {color: colorScheme === 'dark' ? 'rgb(26, 27, 30)' : '#FFF'},
            textColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : '#000',
        },
        grid: {
            vertLines: {
                color: '#334158',
            },
            horzLines: {
                color: '#334158',
            },
        },
        crosshair: {
            mode: CrosshairMode.Normal,
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
                ...layoutOptions
            });
            chartRef.current?.timeScale().fitContent();

            const positiveData = sentimentTimelineData && (sentimentTimelineData as Array<any>).length > 0
                ? sentimentTimelineData.map(current => {return {time: current.date, value: current.positiveCount}})
                : [{time: getCurrentLocalDate(), value: 0}];

            const neutralData = sentimentTimelineData && (sentimentTimelineData as Array<any>).length > 0
                ? sentimentTimelineData.map(current => {return {time: current.date, value: current.neutralCount}})
                : [{time: getCurrentLocalDate(), value: 0}];

            const negativeData = sentimentTimelineData && (sentimentTimelineData as Array<any>).length > 0
                ? sentimentTimelineData.map(current => {return {time: current.date, value: current.negativeCount}})
                : [{time: getCurrentLocalDate(), value: 0}];

            const positiveSeries = chartRef.current.addLineSeries();
            positiveSeries.setData(positiveData);
            positiveSeries.applyOptions({color: '#FFC234'});

            const neutralSeries = chartRef.current.addLineSeries();
            neutralSeries.setData(neutralData);
            neutralSeries.applyOptions({color: '#059BFF'});

            const negativeSeries = chartRef.current.addLineSeries();
            negativeSeries.setData(negativeData);
            negativeSeries.applyOptions({color: '#FF4069'});

        }

    }, [sentimentTimelineData]);

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
            cursor: 'pointer',

            '&:hover': {
                backgroundColor:
                    theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
            },
        })}>
        <Flex
            style={{width: `${width}px`, height: `${height}px`}}
            bg='rgba(0, 0, 0, .3)'
            gap='md'
            justify='center'
            align='center'
            direction='row'
            wrap='wrap'>
            {sentimentTimelineData
                ? <div ref={chartContainerRef}/>
                : <Loader variant='bars' style={{}}/>}
        </Flex>
    </Box>
}

export default SentimentLineChart;