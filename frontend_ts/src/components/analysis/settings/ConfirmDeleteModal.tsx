import React from "react";
import {Button, Center, Modal} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {AiOutlineDelete} from "react-icons/ai";
import {getCookie, hasCookie, setCookie} from "cookies-next";
import analysis from "../index";
import {useNavigate} from "react-router-dom";

interface IProps {
    opened: boolean,
    onClose: any,
    dbs: string[]
}

const ConfirmDeleteModal:React.FC<IProps> = ({opened, onClose, dbs}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    if (!hasCookie('analysis')) {
        return <></>;
    }

    let analysisArray = JSON.parse(getCookie('analysis') as string) as Array<any>;
    const currentAnalyse = analysisArray.find(current => JSON.stringify(current?.selectedDatabases) === JSON.stringify(dbs));

    const triggerDeleting = () => {
        analysisArray = analysisArray.filter(current => JSON.stringify(current) !== JSON.stringify(currentAnalyse));
        setCookie('analysis', JSON.stringify(analysisArray));
        navigate('/');
    }

    return <Modal
        size='sm'
        centered
        opened={opened}
        onClose={onClose}
        title={<i>{t('deleteModal.alert')} <b>{currentAnalyse?.name}</b></i>}>
        <Center>
            <Button
                onClick={triggerDeleting}
                fullWidth
                variant='gradient'
                gradient={{ from: 'darkred', to: 'red' }}
                leftIcon={<AiOutlineDelete/>}>
                {t('delete')}
            </Button>
        </Center>
    </Modal>
}

export default ConfirmDeleteModal;