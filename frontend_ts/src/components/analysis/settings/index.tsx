import React, {useContext} from 'react';
import {Center} from '@mantine/core';
import {useTranslation} from "react-i18next";
import DeleteSection from "./DeleteSection";
import RenameSection from "./RenameSection";
import {DatabasesContext} from "../index";

const SettingsTab = () => {

    const dbs = useContext(DatabasesContext);
    const { t } = useTranslation();

    return <Center>
        <RenameSection dbs={dbs}/>
        <DeleteSection dbs={dbs}/>
    </Center>
}

export default SettingsTab;