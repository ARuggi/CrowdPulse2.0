import React from 'react';
import {
    Chart,
    AxisLinearOptions,
    AxisTimeOptions,
} from 'react-charts';

import {useMediaQuery} from '@mantine/hooks';
import {useMantineColorScheme} from '@mantine/core';

enum SentimentType {
    POSITIVE = 'positive',
    NEUTRAL  = 'neutral',
    NEGATIVE = 'negative'
}

type DataType = {
    date: Date,
    value: number
}

const SentimentLineChart = () => {

    const { colorScheme } = useMantineColorScheme();
    //const sentimentData = useContext(SentimentContext);

    const mediaQueryMd = useMediaQuery('(min-width: 992px) and (max-width: 1200px)');
    const mediaQuerySm = useMediaQuery('(min-width: 768px) and (max-width: 992px)');
    const mediaQueryXs = useMediaQuery('(max-width: 768px)');

    let width = mediaQueryMd ? 80 : mediaQuerySm ? 60 : mediaQueryXs ? 40 : 100;
    let height = 300;

    const sentimentChartData = [
        {
            id: 'sentimentPositive',
            label: SentimentType.POSITIVE,
            data: [
                {date: new Date('2021-10-12'), value: 10},
                {date: new Date('2021-11-12'), value: 20},
                {date: new Date('2021-12-12'), value:  1},
                {date: new Date('2022-01-15'), value: 17},
                {date: new Date('2022-02-22'), value: 12},
                {date: new Date('2022-03-11'), value: 25},
            ]
        },
        {
            id: 'sentimentNeutral',
            label: SentimentType.NEUTRAL,
            data: [
                {date: new Date('2021-10-12'), value: 20},
                {date: new Date('2021-11-12'), value: 10},
                {date: new Date('2021-12-12'), value: 14},
                {date: new Date('2022-01-15'), value: 30},
                {date: new Date('2022-02-22'), value: 17},
                {date: new Date('2022-03-11'), value: 22},
            ],

        },
        {
            id: 'sentimentNegative',
            label: SentimentType.NEGATIVE,
            data: [
                {date: new Date('2021-10-12'), value: 15},
                {date: new Date('2021-11-12'), value:  8},
                {date: new Date('2021-12-12'), value:  5},
                {date: new Date('2022-01-15'), value: 12},
                {date: new Date('2022-02-22'), value: 20},
                {date: new Date('2022-03-11'), value:  8},
            ]
        }
    ];

    const xAxis = React.useMemo(
        (): AxisTimeOptions<DataType> => ({
            getValue: datum => datum.date,
            min: new Date('2021-10-12'),
            max: new Date('2022-03-11'),
            scaleType: 'localTime',
            showGrid: true,
        }), []
    );

    const yAxis = React.useMemo(
        (): AxisLinearOptions<DataType>[] => [{
            getValue: datum => datum.value,
            showGrid: true,
            min: 0
        }], []
    );

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
                <Chart
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
                        interactionMode: 'closest',
                        defaultColors: ['#FFC234', '#059BFF', '#FF4069']
                    }}/>
            </div>
        </div>
    </>
}

export default SentimentLineChart;