import React, {createContext, useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import isEqual from 'lodash.isequal';
import {Flex} from '@mantine/core';

import api from '../../../api';
import {WordResponse} from '../../../api/WordResponse';

import {DatabasesContext, FiltersContext} from '../index';
import WordcloudBox from './WordcloudBox';
import Filters from '../filters';
import Error from '../../error';

export const WordContext = createContext<WordResponse | null>(null);

const WordTab = () => {

    const { t } = useTranslation();
    const [isError, setError] = useState(false);
    const [wordData, setWordData] = useState<WordResponse | null>(null);

    const dbs = useContext(DatabasesContext);
    const {filters} = useContext(FiltersContext);

    useEffect(() => {
        setWordData(null);

        (async () => {

            try {
                const result =
                    await api.GetWord(
                        dbs,
                        filters.algorithm,
                        filters.algorithm === 'all' ? undefined : filters.sentiment,
                        filters.algorithm !== 'feel-it' ? undefined : filters.emotion,
                        filters.type,
                        filters.dateFrom,
                        filters.dateTo,
                        filters.tags,
                        filters.processedText,
                        filters.hashtags,
                        filters.usernames);
                setWordData(isEqual(wordData, result) ? wordData : result);
            } catch(error) {
                console.log(error);
                setError(true);
            }

        })();
    }, [filters]);

    if (isError) {
        return <Error message={t('serverNotRespondingError')!}/>
    }

    return <>
        <Filters
            lock={!wordData}
            filters={{
                showAlgorithm: true,
                showSentiment: true,
                showEmotion: true,
                showType: true,
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
            <WordContext.Provider value={wordData}>
                <WordcloudBox/>
            </WordContext.Provider>
        </Flex>
    </>
}

export default WordTab;