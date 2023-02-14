import React, {CSSProperties, useEffect, useState} from 'react';
import {AxisBandOptions, AxisOptions, Chart} from 'react-charts';
import {Datum, DatumFocusStatus, DatumStyles, Series, UserSerie} from "react-charts/types/types";
import {useMediaQuery} from "@mantine/hooks";
import {Box, Flex, Loader, SegmentedControl, Text, useMantineColorScheme} from "@mantine/core";
import {SystemProp} from "@mantine/styles";
import {wait} from "@testing-library/user-event/dist/utils";

type DataType = {
    date: string,
    value: number,
    color: string
}

enum OrderingType {
    DATE = 'date',
    VALUE = 'value'
}

enum OrderingDirection {
    INCREASING = 'increasing',
    DECREASING = 'decreasing'
}

interface IProps {
}

const TimelineBarChart:React.FC<IProps> = () => {

    const { colorScheme } = useMantineColorScheme();
    const [data, setData] = useState<UserSerie<DataType>[]>([{id: 'Timeline', label: 'Timeline', data: [{date: '', value: 0, color: 'white'}]}]);
    const [orderingType, setOrderingType] = useState<OrderingType>(OrderingType.DATE);
    const [orderingDirection, setOrderingDirection] = useState<OrderingDirection>(OrderingDirection.DECREASING);
    const [chart, setChart] = useState<any>();
    const [loadingChart, setLoadingChart] = useState(false);

    const mediaQuerySmToMd = useMediaQuery('(min-width: 992px) and (max-width: 1200px)');
    const mediaQueryXsToSm = useMediaQuery('(min-width: 768px) and (max-width: 992px)');
    const mediaQuerySm = useMediaQuery('(max-width: 992px)');
    const mediaQueryXs = useMediaQuery('(max-width: 768px)');

    let width = mediaQuerySmToMd ? 80 : mediaQueryXsToSm ? 60 : mediaQueryXs ? 40 : 100;
    let height = 500;
    let direction: SystemProp<CSSProperties['flexDirection']> = mediaQuerySm ? 'column' : 'row';

    useEffect(() => {

        (async () => {
            const updatedData = data[0];
            updatedData.data = [
                { date: '2020-10-21', value: 100, color: '#ff4069' },
                { date: '2021-10-21', value:  50, color: '#059bff' },
                { date: '2022-10-21', value:  25, color: '#ffc234' },
                { date: '2021-06-12', value:  67, color: '#97f52b' },
                { date: '2021-11-25', value:  42, color: '#a720e1' },
                { date: '2021-01-09', value:  55, color: '#1e67cb' },
                { date: '2021-08-20', value:  16, color: '#1f64e9' },
                { date: '2021-05-03', value:  73, color: '#be12ca' },
                { date: '2021-03-01', value:  93, color: '#45c82b' },
                { date: '2021-09-11', value:  83, color: '#bcfc8d' },
                { date: '2021-02-16', value:  20, color: '#6ecf15' },
                { date: '2021-04-08', value:  57, color: '#ccba87' },
                { date: '2021-07-29', value:  25, color: '#7e24c4' },
            ];

            setData([updatedData]);
            setLoadingChart(true);
            setChart(<Flex
                bg="rgba(0, 0, 0, .3)"
                gap="md"
                justify="center"
                align="center"
                direction="row"
                wrap="wrap">
                <Loader variant="bars" style={{height: `${height}px`}}/>
            </Flex>);
        })();

    }, [orderingType, orderingDirection]);

    useEffect(() => {
        if (loadingChart) {
            (async () => {
                await wait(500);
                setLoadingChart(false);
                setChart(<Chart
                    style={{transition: 'none', transitionDelay: '0', transitionDuration: '0'}}
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
                        getSeriesOrder: seriesOrder,
                        getDatumStyle: datumStyle
                    }}/>);
            })();
        }
    }, [loadingChart]);

    const xAxis = React.useMemo(
        (): AxisBandOptions<DataType> => ({
            getValue: datum => datum.date,
            position: 'left',
            showGrid: true,
        }),
        []
    )

    const yAxis = React.useMemo(
        (): AxisOptions<DataType>[] => [{
            getValue: datum => datum.value,
            position: 'bottom',
            showGrid: true,
            min: 0
        }],
        []
    )

    const seriesOrder = (series: Series<DataType>[]): Series<DataType>[] => {

        const orderDates = (date1: string, date2: string): number => {
            return orderingDirection === OrderingDirection.DECREASING
                ? date1.localeCompare(date2)
                : date2.localeCompare(date1)
        }

        const orderValues = (value1: number, value2: number): number => {
            return orderingDirection === OrderingDirection.DECREASING
                ? value1 - value2
                : value2 - value1
        }

        return series.map(serie => {
            serie.datums = serie.datums.sort((d1, d2) => {
                return orderingType === OrderingType.DATE
                    ? orderDates(d1.originalDatum.date, d2.originalDatum.date)
                    : orderValues(d1.originalDatum.value, d2.originalDatum.value)
            });
            return serie;
        });
    }

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
                    height: `${height}px`
                }}>
                {chart}
            </div>
            <Box
                sx={(theme) => ({
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                    textAlign: 'center',
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.md,
                })}>
                <Flex
                    gap="md"
                    justify="center"
                    align="center"
                    direction={direction}
                    wrap="wrap">
                    <Text><b>Ordering</b></Text>
                    <SegmentedControl
                        onChange={(orderingType) => setOrderingType(orderingType as OrderingType)}
                        style={{flex: 'fit-content'}}
                        data={[
                            {label: 'date',  value: OrderingType.DATE},
                            {label: 'value', value: OrderingType.VALUE}
                        ]}/>
                    <Text><b>Direction</b></Text>
                    <SegmentedControl
                        onChange={(orderingDirection) => setOrderingDirection(orderingDirection as OrderingDirection)}
                        style={{flex: 'fit-content'}}
                        data={[
                            {label: 'increasing', value: OrderingDirection.INCREASING},
                            {label: 'decreasing', value: OrderingDirection.DECREASING}
                        ]}/>
                </Flex>
            </Box>
        </div>
    </>
}

export default TimelineBarChart;