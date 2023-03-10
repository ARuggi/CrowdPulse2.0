import React, {useContext, useEffect, useState} from 'react';
import {Box, Table} from '@mantine/core';
import {HeatMapContext} from '../index';

const HeatMapDataPanel = () => {

    const heatMapData = useContext(HeatMapContext);
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {

        if (heatMapData) {
            setCount(heatMapData
                .reduce((accumulator, current) =>
                    accumulator + current.count, 0));
        }

    }, [heatMapData]);

    const createSvgBox = (color: string) => {
        return <svg viewBox='0 0 16 16' width='16' height='16'>
            <rect x='0' y='0' width='16' height='16' fill={color} />
        </svg>
    }

    return <Box
        sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            textAlign: 'left',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.md
        })}>
        <Table verticalSpacing={2} fontSize='xs'>
            <tbody>
            <tr>
                <td>Many</td>
                <td>{createSvgBox('red')}</td>
            </tr>
            <tr>
                <td>Some</td>
                <td>{createSvgBox('green')}</td>
            </tr>
            <tr>
                <td>Few</td>
                <td>{createSvgBox('blue')}</td>
            </tr>
            <tr>
                <td><b>Total tweets</b></td>
                <td>{count ? count : '...'}</td>
            </tr>
            </tbody>
        </Table>
    </Box>;
}

export default HeatMapDataPanel;