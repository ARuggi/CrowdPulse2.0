import React, {useEffect, useState} from 'react';
import api from '../../api';
import {DatabasesResponse} from '../../api/DatabasesResponse';
import {useTranslation} from 'react-i18next';
import {Center, Loader} from '@mantine/core';

interface IProps {
    dbs: string[]
}

const InfoTab:React.FC<IProps> = ({dbs}) => {

    const {t} = useTranslation();
    const [isError, setError] = useState(false);
    const [databasesData, setDatabasesData] = useState<DatabasesResponse | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const result = await api.GetDatabases(dbs);
                setDatabasesData(result);
            } catch(error) {
                console.log(error);
                setError(true);
            }
        })();
    }, []);

    if (isError) {
        return <p>{t('serverNotRespondingError')}</p>
    }

    if (!databasesData) {
        return <Center><Loader size='xl' variant='dots' /></Center>
    }

    return <p>{JSON.stringify(databasesData)}</p>
}

export default InfoTab;