import React from 'react';
import {useTranslation} from 'react-i18next';
import {Box, Center, Table, Text} from '@mantine/core';

interface IProps {
    regionName: string,
    regionData: any
}

const RegionMapEmotionTooltip:React.FC<IProps> = ({regionName, regionData}) => {
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
            <Text size={16}>{regionName}</Text>
        </Center>
        {regionData
            ? <Table verticalSpacing={2} fontSize='xs'>
                <tbody>
                <tr>
                    <td>{t('tab.map.regionsTooltip.positive')}</td>
                    <td>{regionData.sentimentPositive}</td>
                    <td>{createSvgBox('#FFCB52')}</td>
                </tr>
                <tr>
                    <td>{t('tab.map.regionsTooltip.neutral')}</td>
                    <td>{regionData.sentimentNeutral}</td>
                    <td>{createSvgBox('#2AAAFF')}</td>
                </tr>
                <tr>
                    <td>{t('tab.map.regionsTooltip.negative')}</td>
                    <td>{regionData.sentimentNegative}</td>
                    <td>{createSvgBox('#FF5C7F')}</td>
                </tr>
                <tr>
                    <td>{t('tab.map.regionsTooltip.joy')}</td>
                    <td>{regionData.emotionJoy}</td>
                    <td>{createSvgBox('#FFA50082')}</td>
                </tr>
                <tr>
                    <td>{t('tab.map.regionsTooltip.sadness')}</td>
                    <td>{regionData.emotionSadness}</td>
                    <td>{createSvgBox('#0000FF7C')}</td>
                </tr>
                <tr>
                    <td>{t('tab.map.regionsTooltip.anger')}</td>
                    <td>{regionData.emotionAnger}</td>
                    <td>{createSvgBox('#FF00008C')}</td>
                </tr>
                <tr>
                    <td>{t('tab.map.regionsTooltip.fear')}</td>
                    <td>{regionData.emotionFear}</td>
                    <td>{createSvgBox('#8000808E')}</td>
                </tr>
                </tbody>
            </Table>
            : <Text>{t('tab.map.regionsTooltip.noData')}</Text>}
    </Box>;
}

export default RegionMapEmotionTooltip;