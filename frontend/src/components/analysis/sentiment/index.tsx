import React, {createContext, useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Flex} from '@mantine/core';
import isEqual from 'lodash.isequal';

import api from '../../../api';
import {SentimentResponse} from '../../../api/SentimentResponse';
import {SentimentTimelineResponse} from '../../../api/SentimentTimelineResponse';
import {DatabasesContext, FiltersContext} from '../index';
import Filters from '../filters';
import SentItBarChart from './SentItBarChart';
import FeelItBarChart from './FeelItBarChart';
import HateSpeechBarChart from './HateSpeechBarChart';

import SentItCakeChart from './SentItCakeChart';
import FeelItCakeChart from './FeelItCakeChart';
import HateSpeechCakeChart from './HateSpeechCakeChart';

import SentItLineChart from './SentItLineChart';
import FeelItLineChart from './FeelItLineChart';
import HateSpeechLineChart from './HateSpeechLineChart';
import Error from '../../error';

export const SentimentContext = createContext<SentimentResponse | null>(null);
export const SentimentTimelineContext = createContext<SentimentTimelineResponse | null>(null);

const SentimentTab = () => {

    const { t } = useTranslation();
    const dbs = useContext(DatabasesContext);
    const [isError, setError] = useState(false);
    const [sentimentData, setSentimentData] = useState<SentimentResponse | null>(null);
    const [sentimentTimelineData, setSentimentTimelineData] = useState<SentimentTimelineResponse | null>(null);
    const {filters} = useContext(FiltersContext);

    useEffect(() => {

        setSentimentData(null);
        setSentimentTimelineData(null);

        (async () => {

            try {
                const result =
                    await api.GetSentiment(
                        dbs,
                        filters.algorithm,
                        filters.dateFrom,
                        filters.dateTo,
                        filters.tags,
                        filters.processedText,
                        filters.hashtags,
                        filters.usernames);
                setSentimentData(isEqual(sentimentData, result) ? sentimentData : result);
            } catch(error) {
                console.log(error);
                setError(true);
            }

            try {
                const result =
                    await api.GetSentimentTimeline(
                        dbs,
                        filters.algorithm,
                        filters.dateFrom,
                        filters.dateTo,
                        filters.tags,
                        filters.processedText,
                        filters.hashtags,
                        filters.usernames);
                setSentimentTimelineData(isEqual(sentimentTimelineData, result) ? sentimentTimelineData : result);
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
            lock={!sentimentData || !sentimentTimelineData}
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

                {
                    filters.algorithm === 'sent-it' &&
                    <>
                        <SentItBarChart/>
                        <SentItCakeChart/>
                    </>
                }

                {
                    filters.algorithm === 'feel-it' &&
                    <>
                        <FeelItBarChart/>
                        <FeelItCakeChart/>
                    </>
                }

                {
                    filters.algorithm === 'hate-speech' &&
                    <>
                        <HateSpeechBarChart/>
                        <HateSpeechCakeChart/>
                    </>
                }

            </SentimentContext.Provider>
            <SentimentTimelineContext.Provider value={sentimentTimelineData}>
                {filters.algorithm === 'sent-it' && <SentItLineChart/>}
                {filters.algorithm === 'feel-it' && <FeelItLineChart/>}
                {filters.algorithm === 'hate-speech' && <HateSpeechLineChart/>}
            </SentimentTimelineContext.Provider>
        </Flex>
    </>
}

export default SentimentTab;