import React, {ChangeEvent, useEffect, useState} from 'react';
import {Alert, Button, Center, Modal, Table, TextInput} from '@mantine/core';
import {useTranslation} from 'react-i18next';
import {DatabaseType} from '../../api/DatabasesResponse';
import {MdDriveFileRenameOutline} from 'react-icons/md';
import {AiTwotoneAlert} from 'react-icons/ai';
import {VscDebugStart} from 'react-icons/vsc';
import {getCookie, hasCookie, setCookie} from 'cookies-next';
import {useNavigate} from 'react-router-dom';

const COOKIE_SAVING_MAX_AGE = 20 * 356 * 60 * 60 * 24 * 30;

interface IProps {
    opened: boolean,
    onClose: any,
    selectedDatabases: DatabaseType[]
}

const SavingModal:React.FC<IProps> = ({opened, onClose, selectedDatabases}) => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const [savingName, setSavingName] = useState('');
    const [save, setSave] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const handleChangeText = (event: ChangeEvent<HTMLInputElement>) => {
        setSavingName(event.target.value);
    }

    useEffect(() => {
        if (save) {
            (async() => {

                if (!hasCookie('analysis')) {
                    setCookie('analysis', JSON.stringify([]), { maxAge: COOKIE_SAVING_MAX_AGE });
                }

                const analysisArray = JSON.parse(getCookie('analysis') as string) as Array<any>;

                if (analysisArray.find(current => current.name === savingName) === undefined) {
                    setCookie('analysis', [...analysisArray, {
                        name: savingName,
                        selectedDatabases: [...selectedDatabases].map(database => database.name)
                    }], { maxAge: COOKIE_SAVING_MAX_AGE });
                    let params = new URLSearchParams();
                    selectedDatabases.forEach(database => params.append('dbs', database.name));
                    navigate(`/analysis?${params}`);
                } else {
                    setError(t('savingModal.errorAlreadyExists')!);
                }

                setSave(false);
            })();
        }
    }, [save])

    return <Modal
        size='xl'
        opened={opened}
        onClose={() => {onClose(); setError(undefined)}}
        title={<b>{t('savingModal.title')}</b>}>
        <Center>
            <Alert style={{width: '100%', margin: '20px'}}
                   color='green'
                   variant='filled'
                   icon={<AiTwotoneAlert size={16} />}
                   title={t('savingModal.alertDescription')} radius='md' children={<></>}/>
        </Center>
        <Table
            style={{marginTop: '20px'}}
            striped
            withBorder
            withColumnBorders
            verticalSpacing='xs'
            fontSize='md'>
            <thead>
            <tr>
                <th>Name</th>
                <th>Release date</th>
                <th>Update date</th>
                <th>Version</th>
            </tr>
            </thead>
            <tbody>
            {selectedDatabases.map(database => {
                return <tr key={database.name}>
                    <td><u>{database.name}</u></td>
                    <td>{database.info.releaseDate?.toString()}</td>
                    <td>{database.info.lastUpdateDate?.toString()}</td>
                    <td>{database.info.version}</td>
                </tr>
            })}
            </tbody>
        </Table>
        {error ? <Center>
            <Alert style={{width: '100%', margin: '50px', marginTop: '20px', marginBottom: '0px'}}
                   color='red'
                   variant='filled'
                   icon={<AiTwotoneAlert size={16} />}
                   title={error} radius='md' children={<></>}/>
        </Center> : <></>}
        <TextInput
            style={{margin: '20px', marginTop: '20px', marginBottom: '50px'}}
            placeholder={t('savingModal.inputTextPlaceholder')!}
            label={t('savingModal.inputTextTitle')}
            icon={<MdDriveFileRenameOutline/>}
            radius='xs'
            size='md'
            withAsterisk
            onChange={handleChangeText}
        />
        <Center>
            <Button
                disabled={savingName.length === 0}
                onClick={() => setSave(true)}
                style={{
                    position: 'fixed',
                    bottom: '0',
                    height: '30px'
                }}
                fullWidth
                variant='gradient'
                gradient={{ from: 'indigo', to: 'cyan' }}
                leftIcon={<VscDebugStart/>}>
                {t('start')}
            </Button>
        </Center>
    </Modal>
}

export default SavingModal;