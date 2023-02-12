import React from 'react';
import {Center} from '@mantine/core';
import {useTranslation} from "react-i18next";
import DeleteSection from "./DeleteSection";
import RenameSection from "./RenameSection";

interface IProps {
    dbs: string[]
}

const SettingsTab:React.FC<IProps> = ({dbs}) => {

    const { t } = useTranslation();

    return <Center>
        <RenameSection dbs={dbs}/>
        <DeleteSection dbs={dbs}/>
    </Center>
}

export default SettingsTab;