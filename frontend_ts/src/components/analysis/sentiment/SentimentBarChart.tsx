import React, {CSSProperties} from 'react';
import {AxisBandOptions, AxisOptions, Chart} from 'react-charts';
import {getCookie, hasCookie} from "cookies-next";
import {Datum, DatumFocusStatus, DatumStyles} from "react-charts/types/types";

enum SentimentType {
    POSITIVE='positive',
    NEUTRAL='neutral',
    NEGATIVE='negative'
}

type DataType = {
    sentiment: SentimentType,
    value: number,
    color: string
}

interface IProps {
    style: CSSProperties | undefined
}

const SentimentBarChart:React.FC<IProps> = ({style = undefined}) => {
    let colorScheme = undefined;

    if (hasCookie('mantine-color-scheme')) {
        colorScheme = getCookie('mantine-color-scheme');
    }

    const data = [
        {
            id: '',
            label: 'Sentiments',
            data: [
                {sentiment: SentimentType.POSITIVE, value: 150, color: 'cyan'},
                {sentiment: SentimentType.NEUTRAL,  value:  50, color: 'gray'},
                {sentiment: SentimentType.NEGATIVE, value:  10, color: 'red'}
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
        let color: string;
        let opacity = 0.75;

        switch (datum.originalDatum.sentiment) {
            case SentimentType.POSITIVE: color = '#ffc234'; break;
            case SentimentType.NEUTRAL:  color = '#059bff'; break;
            case SentimentType.NEGATIVE: color = '#ff4069'; break;
        }

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
            boxShadow: "5px 5px rgba(0,0,0,.1)",
            ...style,
        }}>
            <div
                style={{
                    width: '100vh',
                    height: '400px'
                }}>
                <Chart
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
            </div>
        </div>
    </>
}

export default SentimentBarChart;