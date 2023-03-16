import React, {useContext, useEffect, useState} from 'react';
import api from '../../../api';
import {DatabasesResponse} from '../../../api/DatabasesResponse';
import {DatabasesContext} from '../index'
import {useTranslation} from 'react-i18next';
import {
    Center,
    Container,
    Divider, Flex,
    Highlight,
    Loader,
    Stack,
    Table,
    Title,
    TypographyStylesProvider
} from '@mantine/core';
import {TbFileDatabase} from 'react-icons/tb';
import Error from '../../error';

const bytesToKiloBytes = (bytes: number) => {
    return bytes / 1024;
}

const kiloBytesToMegaBytes = (kiloBytes: number) => {
    return kiloBytes / 1024;
}

const InfoTab = () => {

    const { t } = useTranslation();
    const [isError, setError] = useState(false);
    const [databasesData, setDatabasesData] = useState<DatabasesResponse | null>(null);
    const dbs = useContext(DatabasesContext);

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
        return <Error message={t('serverNotRespondingError')!}/>
    }

    if (!databasesData) {
        return <Center><Loader size='xl' variant='dots' /></Center>
    }

    return <Stack>{
        databasesData.databases.map(database => {
            return <div key={database.name}>
                <Container>
                    <Flex
                        gap='md'
                        justify='left'
                        align='center'
                        direction='row'
                        wrap='wrap'>
                        <TbFileDatabase size={30} style={{
                            marginTop: '5px',
                            color: '#38a0df',
                        }}/>
                        <Title order={1}>
                            <Highlight
                                align='center'
                                highlight={database.name}
                                highlightStyles={(theme) => ({
                                    backgroundImage: theme.fn.linearGradient(45, theme.colors.cyan[5], theme.colors.indigo[5]),
                                    fontWeight: 700,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                })}>
                                {database.name}
                            </Highlight>
                        </Title>
                    </Flex>
                    <Table
                        style={{marginTop: '20px', marginBottom: '20px'}}
                        striped
                        withBorder
                        withColumnBorders
                        verticalSpacing='xs'
                        fontSize='md'>
                        <thead>
                        <tr>
                            <th>{t('releaseDate')}</th>
                            <th>{t('lastUpdate')}</th>
                            <th>{t('version')}</th>
                            <th>{t('sizeOnDisk')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{database.info.releaseDate ? database.info.releaseDate.toString() : t('notDefined')}</td>
                            <td>{database.info.lastUpdateDate ? database.info.lastUpdateDate.toString() : t('notDefined')}</td>
                            <td>{database.info.version ? database.info.version : t('notDefined')}</td>
                            <td>{kiloBytesToMegaBytes(bytesToKiloBytes(database.sizeOnDisk)).toFixed(2)} MB</td>
                        </tr>
                        </tbody>
                    </Table>
                    <Title order={2}>{t('description')}</Title>
                    <TypographyStylesProvider>
                        {database?.info?.htmlDescription && <div dangerouslySetInnerHTML={{__html: database.info.htmlDescription}}/>}
                        {!database?.info?.htmlDescription && <p>{t('noDescription')}</p>}
                    </TypographyStylesProvider>
                    <Divider/>
                </Container>
            </div>
        })
    }</Stack>
}

export default InfoTab;