import React, {useContext, useEffect, useRef} from 'react';
import {createChart, CrosshairMode, IChartApi, LineStyle} from 'lightweight-charts';
import {
    Box,
    Flex,
    Loader,
    useMantineColorScheme
} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';

import {TimelineContext} from './index';
import {TweetsTimelineResponse} from '../../../api/TweetsTimelineResponse';
import TimelineInfoBox from "./TimelineInfoBox";

const TimelineLineChart = () => {

    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi>();

    const { colorScheme } = useMantineColorScheme();
    const timelineData = useContext<TweetsTimelineResponse | null>(TimelineContext);

    const mediaQuery = useMediaQuery('(max-width: 576px)');

    let width = window.innerWidth * 0.80;
    let height = 300;

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

        if (timelineData && chartContainerRef.current) {

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
                        labelBackgroundColor: '#7DAAFF',
                    },
                    horzLine: {
                        color: '#7DAAFF',
                        labelBackgroundColor: '#7DAAFF',
                    }
                },
                ...layoutOptions
            });

            const data = timelineData && (timelineData as Array<any>).length > 0
                ? timelineData.map(current => {return {time: current.date, value: current.count}})
                : [{time: new Date().toISOString().slice(0, 10), value: 0}];

            chartRef.current?.addAreaSeries({
                topColor: 'rgba(0,140,255,0.13)',
                bottomColor: '#39ADFFA5',
                lineColor: '#3474ff',
                lineWidth: 2
            }).setData(data);

            chartRef.current?.timeScale().fitContent();
        }

    }, [timelineData]);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current?.applyOptions({width: width, height: height, ...layoutOptions});
        }
    }, [colorScheme]);

    return <Box
        style={mediaQuery ? {paddingBottom: '90px'} : {paddingBottom: '50px'}}
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
            {timelineData
                ? <div style={{display: 'inline-block', width: 'auto', borderRadius: '0.5rem'}}>
                    <div ref={chartContainerRef}/>
                    <TimelineInfoBox/>
                </div>
                : <Loader variant='bars' style={{}}/>}
        </Flex>
    </Box>
}

export default TimelineLineChart;