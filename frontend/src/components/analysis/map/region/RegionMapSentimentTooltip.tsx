import React from 'react';
import {useTranslation} from 'react-i18next';
import {Box, Center, Table, Text} from '@mantine/core';

interface IProps {
    name: string, // the region of city name.
    data: any     // the data of the region or city.
}

const RegionMapSentimentTooltip:React.FC<IProps> = ({name, data}) => {
    const { t } = useTranslation();
    
    const createSvgBox = (color: string) => {
        return <svg viewBox='0 0 16 16' width='16' height='16'>
            <rect x='0' y='0' width='16' height='16' fill={color} />
        </svg>
    }

    return <Box
        sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            textAlign: 'left'
        })}>
        <Center>
            <Text size={16}>{name}</Text>
        </Center>
        {data
            ? <Table verticalSpacing={2} fontSize='xs'>
                <tbody>
                <tr>
                    <td>{t('tab.map.regionsTooltip.positive')}</td>
                    <td>{data.sentimentPositive}</td>
                    <td>{createSvgBox('#FFCB52')}</td>
                </tr>
                <tr>
                    <td>{t('tab.map.regionsTooltip.neutral')}</td>
                    <td>{data.sentimentNeutral}</td>
                    <td>{createSvgBox('#2AAAFF')}</td>
                </tr>
                <tr>
                    <td>{t('tab.map.regionsTooltip.negative')}</td>
                    <td>{data.sentimentNegative}</td>
                    <td>{createSvgBox('#FF5C7F')}</td>
                </tr>
                </tbody>
            </Table>
            : <Text>{t('tab.map.regionsTooltip.noData')}</Text>}
    </Box>;
}

export default RegionMapSentimentTooltip;