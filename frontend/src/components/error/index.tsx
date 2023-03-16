import React from 'react';
import {Alert, Text} from '@mantine/core';
import {BiErrorAlt} from 'react-icons/bi';
import {useTranslation} from 'react-i18next';

interface IProps {
    message?: string | undefined
}

const NotFound:React.FC<IProps> = ({message = undefined}) => {
    const { t } = useTranslation();

    return <Alert icon={<BiErrorAlt />} title={t('error')} color='red'>
        <Text>{message}</Text>
    </Alert>
}

export default NotFound;
