import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {Box, Table} from '@mantine/core';
import {FiltersContext} from '../../index';

const RegionMapPanel = () => {
    const { t } = useTranslation();
    const { filters } = useContext(FiltersContext);

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
            {
                (filters.algorithm === 'sent-it' || filters.algorithm === 'feel-it') &&
                <>
                    <tr>
                        <td>{t('tab.map.regionsPanel.positive')}</td>
                        <td>{createSvgBox('#FFCB52')}</td>
                    </tr>
                    <tr>
                        <td>{t('tab.map.regionsPanel.neutral')}</td>
                        <td>{createSvgBox('#2AAAFF')}</td>
                    </tr>
                    <tr>
                        <td>{t('tab.map.regionsPanel.negative')}</td>
                        <td>{createSvgBox('#FF5C7F')}</td>
                    </tr>
                    {filters.algorithm === 'feel-it'
                        && <>
                            <tr>
                                <td>{t('tab.map.regionsPanel.joy')}</td>
                                <td>{createSvgBox('#FFA50082')}</td>
                            </tr>
                            <tr>
                                <td>{t('tab.map.regionsPanel.sadness')}</td>
                                <td>{createSvgBox('#0000FF7C')}</td>
                            </tr>
                            <tr>
                                <td>{t('tab.map.regionsPanel.anger')}</td>
                                <td>{createSvgBox('#FF00008C')}</td>
                            </tr>
                            <tr>
                                <td>{t('tab.map.regionsPanel.fear')}</td>
                                <td>{createSvgBox('#8000808E')}</td>
                            </tr>
                        </>}
                </>
            }

            {filters.algorithm === 'hate-speech'
                && <>
                    <tr>
                        <td>{t('tab.map.regionsPanel.acceptable')}</td>
                        <td>{createSvgBox('#FFA50082')}</td>
                    </tr>
                    <tr>
                        <td>{t('tab.map.regionsPanel.inappropriate')}</td>
                        <td>{createSvgBox('#0000FF7C')}</td>
                    </tr>
                    <tr>
                        <td>{t('tab.map.regionsPanel.offensive')}</td>
                        <td>{createSvgBox('#FF00008C')}</td>
                    </tr>
                    <tr>
                        <td>{t('tab.map.regionsPanel.violent')}</td>
                        <td>{createSvgBox('#8000808E')}</td>
                    </tr>
                </>}

            <tr>
                <td>{t('tab.map.noData')}</td>
                <td>{createSvgBox('#6B6B6B')}</td>
            </tr>
            </tbody>
        </Table>
    </Box>;
}

export default RegionMapPanel;