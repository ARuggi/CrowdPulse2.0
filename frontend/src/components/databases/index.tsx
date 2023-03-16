import {useTranslation} from 'react-i18next';
import React, {useEffect, useState} from 'react';
import {
    Center,
    Container,
    Space,
    Title,
} from '@mantine/core';

import api from '../../api';
import {DatabasesResponse} from '../../api/DatabasesResponse';

import DatabaseCardsContainer from '../databases/DatabaseCardContainer';
import DatabaseCardContainerSkeleton from '../databases/DatabaseCardContainerSkeleton';
import Error from '../error';

const Databases = () => {

    const {t} = useTranslation();
    const [isError, setError] = useState(false);
    const [databasesData, setDatabasesData] = useState<DatabasesResponse | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const result = await api.GetDatabases();
                setDatabasesData(result);
            } catch(error) {
                console.log(error);
                setError(true);
            }
        })();
    }, []);

    if (isError) {
        return <Error message={t('serverNotRespondingError')!}/>
    }

    if (!databasesData) {
        return <>
            <Space h='xl'/>
            <DatabaseCardContainerSkeleton/>
        </>
    }

    return <Container>
        <Center>
            <Title order={2}>{t('selectDatabases')}</Title>
        </Center>
        <DatabaseCardsContainer databasesData={databasesData.databases}/>
    </Container>
}

export default Databases;