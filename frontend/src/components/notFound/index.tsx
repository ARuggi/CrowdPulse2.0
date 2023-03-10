import {Alert, Text} from '@mantine/core';
import {FaExclamationCircle} from 'react-icons/fa';
import {GiCactus} from 'react-icons/gi';
import {useTranslation} from "react-i18next";

const NotFound = () => {
    const { t } = useTranslation();

    return<Alert icon={<FaExclamationCircle />} title='404' color='red'>
        <Text>{t('pageNotFound')} <GiCactus/></Text>
    </Alert>
}

export default NotFound;
