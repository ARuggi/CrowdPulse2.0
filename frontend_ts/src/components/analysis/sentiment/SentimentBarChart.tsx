import React, {CSSProperties} from 'react';
import {AxisOptions, Chart} from 'react-charts';
import {getCookie, hasCookie} from "cookies-next";

type MyDatum = {
    date: number,
    stars: number
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
            label: 'React Charts',
            data: [
                {date: 10, stars: Math.floor(Math.random() * 10) + 1},
                {date: 20, stars: Math.floor(Math.random() * 10) + 1},
                {date: 30, stars: Math.floor(Math.random() * 10) + 1},
                {date: 40, stars: Math.floor(Math.random() * 10) + 1},
                {date: 50, stars: Math.floor(Math.random() * 10) + 1},
            ],
        },
    ]

    const primaryAxis = React.useMemo(
        (): AxisOptions<MyDatum> => ({
            getValue: datum => datum.date,
        }),
        []
    )

    const secondaryAxes = React.useMemo(
        (): AxisOptions<MyDatum>[] => [{
            getValue: datum => datum.stars,
        },
        ],
        []
    )

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
                        primaryAxis: primaryAxis,
                        secondaryAxes: secondaryAxes,
                        primaryCursor: {show: false},
                        secondaryCursor: {show: false},
                        interactionMode: 'primary'
                    }}/>
            </div>
        </div>
    </>
}

export default SentimentBarChart;