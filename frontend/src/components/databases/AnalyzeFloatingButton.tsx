import React from 'react';
import {Button, MediaQuery} from '@mantine/core';
import {useTranslation} from 'react-i18next';
import {BiAnalyse} from 'react-icons/bi';

interface IProps {
    disabled: boolean,
    onClick: any,
}

const AnalyzeFloatingButton:React.FC<IProps> = ({disabled, onClick}) => {
    const { t } = useTranslation();
    return <>
        <MediaQuery styles={{display: 'none'}} smallerThan='md'>
            <Button
                disabled={disabled}
                onClick={onClick}
                style={{
                    position: 'fixed',
                    bottom: '0',
                    width: '100vh',
                    height: '50px',
                    marginBottom: '0'
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
                disabled={disabled}
                onClick={onClick}
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