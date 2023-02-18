import React, {createContext, useContext, useEffect, useState} from 'react';
import {Flex} from '@mantine/core';
import SentimentBarChart from './SentimentBarChart';
import SentimentCakeChart from './SentimentCakeChart';
import Filters from '../filters';
import {DatabasesContext} from "../index";
import api from "../../../api";
import {SentimentResponse} from "../../../api/SentimentResponse";
import {useTranslation} from "react-i18next";

export const SentimentContext = createContext<SentimentResponse | null>(null);

const SentimentTab = () => {

    const { t } = useTranslation();
    const dbs = useContext(DatabasesContext);
    const [isError, setError] = useState(false);
    const [sentimentData, setSentimentData] = useState<SentimentResponse | null>(null);

    const algorithm = "sent-it";
    const dataFrom = undefined;
    const dataTo = undefined;
    const tags = undefined;
    const processedText = undefined;
    const hashtags = undefined;
    const usernames = undefined;

    useEffect(() => {
        (async () => {
            try {
                const result = await api.GetSentiment(
                    dbs,
                    algorithm,
                    dataFrom,
                    dataTo,
                    tags,
                    processedText,
                    hashtags,
                    usernames);
                setSentimentData(result);
            } catch(error) {
                console.log(error);
                setError(true);
            }
        })();
    }, []);

    if (isError) {
        return <p>{t('serverNotRespondingError')}</p>
    }

    return <>
        <Filters
            filters={{
                showAlgorithm: true,
                algorithm: {
                  disableAllLabel: true
                },
                showSentiment: false,
                showType: false,
                showDataRangePicker: true,
                showTags: true,
                showProcessedText: true,
                showHashTags: true,
                showUsernames: true
            }}/>
        <Flex
            style={{marginTop: '50px'}}
            gap='md'
            justify='center'
            align='center'
            direction='row'
            wrap='wrap'>
            <SentimentContext.Provider value={sentimentData}>
                <SentimentBarChart/>
                <SentimentCakeChart/>
            </SentimentContext.Provider>
        </Flex>
    </>
}

export default SentimentTab;