import React, {useContext} from 'react';
import {AxisBandOptions, AxisOptions, Chart} from 'react-charts';
import {Datum, DatumFocusStatus, DatumStyles} from "react-charts/types/types";
import {useMediaQuery} from "@mantine/hooks";
import SentimentTotalBox from "./SentimentTotalBox";
import {Flex, Loader, useMantineColorScheme} from "@mantine/core";
import {SentimentContext} from "./index";

enum SentimentType {
    POSITIVE = 'positive',
    NEUTRAL  = 'neutral',
    NEGATIVE = 'negative'
}

type DataType = {
    sentiment: SentimentType,
    value: number,
    color: string
}

interface IProps {
}

const SentimentBarChart:React.FC<IProps> = () => {

    const { colorScheme } = useMantineColorScheme();
    const sentimentData = useContext(SentimentContext);

    const mediaQueryMd = useMediaQuery('(min-width: 992px) and (max-width: 1200px)');
    const mediaQuerySm = useMediaQuery('(min-width: 768px) and (max-width: 992px)');
    const mediaQueryXs = useMediaQuery('(max-width: 768px)');
    let width = mediaQueryMd ? 80 : mediaQuerySm ? 60 : mediaQueryXs ? 40 : 100;

    const values = {
        positive: sentimentData ? sentimentData.data.positive : 0,
        neutral: sentimentData ? sentimentData.data.neutral : 0,
        negative: sentimentData ? sentimentData.data.negative : 0
    };

    const data = [
        {
            id: '',
            label: 'Sentiments',
            data: [
                {sentiment: SentimentType.POSITIVE, value: values.positive, color: '#ffc234'},
                {sentiment: SentimentType.NEUTRAL,  value: values.neutral,  color: '#059bff'},
                {sentiment: SentimentType.NEGATIVE, value: values.negative, color: '#ff4069'}
            ],
        },
    ]

    const xAxis = React.useMemo(
        (): AxisBandOptions<DataType> => ({
            getValue: datum => datum.sentiment,
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
            display: "inline-block",
            width: "auto",
            borderRadius: "0.5rem",
            boxShadow: "1px 1px rgba(0,0,0,.1)",
        }}>
            <div
                style={{
                    width: `${width}vh`,
                    height: '300px'
                }}>
                {sentimentData
                    ? <Chart
                        options={{
                            // the tooltip works fine on react-charts 3.0.0-beta.38
                            // issue: https://github.com/TanStack/react-charts/issues/301
                            tooltip: {show: true},
                            dark: colorScheme === 'dark',
                            data: data,
                            primaryAxis: xAxis,
                            secondaryAxes: yAxis,
                            secondaryCursor: {show: false},
                            primaryCursor: {showLabel: false},
                            interactionMode: 'primary',
                            getDatumStyle: datumStyle
                        }}/>
                : <Flex
                        bg="rgba(0, 0, 0, .3)"
                        gap="md"
                        justify="center"
                        align="center"
                        direction="row"
                        wrap="wrap">
                        <Loader variant="bars" style={{height: '300px'}}/>
                    </Flex>}
            </div>
            <SentimentTotalBox/>
        </div>
    </>
}

export default SentimentBarChart;