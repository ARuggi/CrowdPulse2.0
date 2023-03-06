import React from 'react';
import {Box, Center, Table, Text} from '@mantine/core';

interface IProps {
    regionName: string,
    regionData: any,
    includeEmotion: boolean,
}

const RegionMapTooltip:React.FC<IProps> = ({regionName, regionData, includeEmotion}) => {

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
                    <td>S. Positive</td>
                    <td>{regionData.sentimentPositive}</td>
                    <td>{createSvgBox('#FFCB52')}</td>
                </tr>
                <tr>
                    <td>S. Neutral</td>
                    <td>{regionData.sentimentNeutral}</td>
                    <td>{createSvgBox('#2AAAFF')}</td>
                </tr>
                <tr>
                    <td>S. Negative</td>
                    <td>{regionData.sentimentNegative}</td>
                    <td>{createSvgBox('#FF5C7F')}</td>
                </tr>
                {includeEmotion
                    && <>
                        <tr>
                            <td>E. Joy</td>
                            <td>{regionData.emotionJoy}</td>
                            <td>{createSvgBox('#FFA50082')}</td>
                        </tr>
                        <tr>
                            <td>E. Sadness</td>
                            <td>{regionData.emotionSadness}</td>
                            <td>{createSvgBox('#0000FF7C')}</td>
                        </tr>
                        <tr>
                            <td>E. Anger</td>
                            <td>{regionData.emotionAnger}</td>
                            <td>{createSvgBox('#FF00008C')}</td>
                        </tr>
                        <tr>
                            <td>E. Fear</td>
                            <td>{regionData.emotionFear}</td>
                            <td>{createSvgBox('#8000808E')}</td>
                        </tr>
                    </>}
                </tbody>
            </Table>
            : <Text>No data available</Text>}
    </Box>;
}

export default RegionMapTooltip;