import React, {useEffect, useState} from 'react';
import {Button, Flex, TextInput} from '@mantine/core';
import {getCookie, hasCookie, setCookie} from "cookies-next";
import {useTranslation} from "react-i18next";

interface IProps {
    dbs: string[]
}

const RenameSection:React.FC<IProps> = ({dbs}) => {
    const { t } = useTranslation();
    const [value, setValue] = useState('');
    let analysisArray: any[] | undefined = undefined;
    let currentAnalyse: any = undefined;

    if (hasCookie('analysis')) {
        analysisArray = JSON.parse(getCookie('analysis') as string) as Array<any>;
        currentAnalyse = analysisArray.find(current => JSON.stringify(current?.selectedDatabases) === JSON.stringify(dbs));
    }

    useEffect(() => {
        if (currentAnalyse) setValue(currentAnalyse.name);
    }, []);

    const triggerNameSaving = () => {
        if (value.trim().length === 0 || !analysisArray) return;
        if (analysisArray.find(current => current.name.trim() === value.trim())) return;

        analysisArray = analysisArray.filter(current => JSON.stringify(current) !== JSON.stringify(currentAnalyse));
        currentAnalyse.name = value.trim();
        analysisArray.push(currentAnalyse);
        setCookie('analysis', JSON.stringify(analysisArray));
        window.location.reload();
    }

    const triggerError = () => {
        return value.trim().length === 0;
    }

    return <Flex
        gap="xs"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap">
        <TextInput
            value={value}
            label={t('name')}
            onErrorCapture={triggerError}
            onChange={(event) => setValue(event.currentTarget.value)}
        />
        <Button fullWidth onClick={triggerNameSaving}>Save</Button>
    </Flex>
}

export default RenameSection;