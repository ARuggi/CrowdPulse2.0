import React, {useContext} from 'react';
import {
    Chart,
    AxisLinearOptions,
    AxisTimeOptions,
} from 'react-charts';

import {useMediaQuery} from '@mantine/hooks';
import {Flex, Loader, useMantineColorScheme} from '@mantine/core';
import {SentimentTimelineContext} from "./index";
import {SentimentTimelineResponse} from "../../../api/SentimentTimelineResponse";

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
    const sentimentTimelineData = useContext<SentimentTimelineResponse | null>(SentimentTimelineContext);

    const mediaQueryMd = useMediaQuery('(min-width: 992px) and (max-width: 1200px)');
    const mediaQuerySm = useMediaQuery('(min-width: 768px) and (max-width: 992px)');
    const mediaQueryXs = useMediaQuery('(max-width: 768px)');

    let width = mediaQueryMd ? 80 : mediaQuerySm ? 60 : mediaQueryXs ? 40 : 100;
    let height = 300;

    const positiveData = !sentimentTimelineData
        ? [{date: new Date(), value: 0}]
        : sentimentTimelineData.map(current => {
            return {date: new Date(current.date), value: current.positiveCount};
        });

    const neutralData = !sentimentTimelineData
        ? [{date: new Date(), value: 0}]
        : sentimentTimelineData.map(current => {
            return {date: new Date(current.date), value: current.neutralCount};
        });

    const negativeData = !sentimentTimelineData
        ? [{date: new Date(), value: 0}]
        : sentimentTimelineData.map(current => {
            return {date: new Date(current.date), value: current.negativeCount};
        });

    const sentimentChartData = [
        {
            id: 'sentimentPositive',
            label: SentimentType.POSITIVE,
            data: positiveData
        },
        {
            id: 'sentimentNeutral',
            label: SentimentType.NEUTRAL,
            data: neutralData

        },
        {
            id: 'sentimentNegative',
            label: SentimentType.NEGATIVE,
            data: negativeData
        }
    ];

    const xAxis = React.useMemo(
        (): AxisTimeOptions<DataType> => ({
            getValue: datum => datum.date,
            scaleType: 'time',
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
                {sentimentTimelineData
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
                            interactionMode: 'closest',
                            defaultColors: ['#FFC234', '#059BFF', '#FF4069']
                        }}/>
                    : <Flex
                        bg="rgba(0, 0, 0, .3)"
                        gap="md"
                        justify="center"
                        align="center"
                        direction="row"
                        wrap="wrap">
                        <Loader variant="bars" style={{height: `${height}px`}}/>
                    </Flex>}
            </div>
        </div>
    </>
}

export default SentimentLineChart;