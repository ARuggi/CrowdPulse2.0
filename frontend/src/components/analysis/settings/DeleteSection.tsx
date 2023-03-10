import React, {useState} from "react";
import {Button, MediaQuery} from "@mantine/core";
import {AiOutlineDelete} from "react-icons/ai";
import {useTranslation} from "react-i18next";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface IProps {
    dbs: string[]
}

const DeleteSection:React.FC<IProps> = ({dbs}) => {
    const { t } = useTranslation();
    const [confirmDeleteModalOpened, setConfirmDeleteModalOpened] = useState(false);

    return <>
        <MediaQuery styles={{display: 'none'}} smallerThan='md'>
            <Button
                onClick={() => setConfirmDeleteModalOpened(true)}
                style={{
                    position: 'fixed',
                    bottom: '0',
                    width: '50vh',
                    height: '50px',
                    marginBottom: '10%'
                }}
                fullWidth
                variant='gradient'
                gradient={{ from: 'darkred', to: 'red' }}
                leftIcon={<AiOutlineDelete/>}>
                {t('delete')}
            </Button>
        </MediaQuery>
        <MediaQuery styles={{display: 'none'}} largerThan={'md'}>
            <Button
                onClick={() => setConfirmDeleteModalOpened(true)}
                style={{
                    position: 'fixed',
                    bottom: '0',
                    height: '50px'
                }}
                fullWidth
                variant='gradient'
                gradient={{ from: 'darkred', to: 'red' }}
                leftIcon={<AiOutlineDelete/>}>
                {t('delete')}
            </Button>
        </MediaQuery>
        <ConfirmDeleteModal
            opened={confirmDeleteModalOpened}
            onClose={() => setConfirmDeleteModalOpened(false)}
            dbs={dbs}/>
    </>
}

export default DeleteSection;