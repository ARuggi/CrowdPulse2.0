import React from 'react';
import {Button, MediaQuery} from '@mantine/core';
import {useTranslation} from 'react-i18next';
import {BiAnalyse} from 'react-icons/bi';

const AnalyzeFloatingButton = () => {
    const { t } = useTranslation();
    return <>
        <MediaQuery styles={{display: 'none'}} smallerThan='md'>
            <Button
                style={{
                    position: 'fixed',
                    bottom: '0',
                    width: '50vh',
                    height: '50px',
                    marginBottom: '10%'
                }}
                fullWidth
                variant='gradient'
                gradient={{ from: 'indigo', to: 'cyan' }}
                leftIcon={<BiAnalyse/>}>
                {t('analyse')}
            </Button>
    </MediaQuery>
        <MediaQuery styles={{display: 'none'}} largerThan={'md'}>
            <Button
                style={{
                    position: 'fixed',
                    bottom: '0',
                    height: '50px'
                }}
                fullWidth
                variant='gradient'
                gradient={{ from: 'indigo', to: 'cyan' }}
                leftIcon={<BiAnalyse/>}>
                {t('analyse')}
            </Button>
        </MediaQuery>
    </>
}

export default AnalyzeFloatingButton;