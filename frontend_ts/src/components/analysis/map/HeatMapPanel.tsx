import React, {useContext} from 'react';
import {Box, Table} from '@mantine/core';
import {FiltersContext} from '../index';

const HeatMapPanel = () => {
    const {filters} = useContext(FiltersContext);

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
                <td>Positive</td>
                <td>{createSvgBox('#FFCB52')}</td>
            </tr>
            <tr>
                <td>Neutral</td>
                <td>{createSvgBox('#2AAAFF')}</td>
            </tr>
            <tr>
                <td>Negative</td>
                <td>{createSvgBox('#FF5C7F')}</td>
            </tr>
            {filters.algorithm === 'feel-it'
                && <>
                    <tr>
                        <td>Joy</td>
                        <td>{createSvgBox('#FFA50082')}</td>
                    </tr>
                    <tr>
                        <td>Sadness</td>
                        <td>{createSvgBox('#0000FF7C')}</td>
                    </tr>
                    <tr>
                        <td>Anger</td>
                        <td>{createSvgBox('#FF00008C')}</td>
                    </tr>
                    <tr>
                        <td>Fear</td>
                        <td>{createSvgBox('#8000808E')}</td>
                    </tr>
                </>}
            <tr>
                <td>No data</td>
                <td>{createSvgBox('#6B6B6B')}</td>
            </tr>
            </tbody>
        </Table>
    </Box>;
}

export default HeatMapPanel;