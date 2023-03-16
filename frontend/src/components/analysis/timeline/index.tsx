import React, {createContext, useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import isEqual from 'lodash.isequal';
import {Flex} from '@mantine/core';

import api from '../../../api';
import Filters from '../filters';
import TimelineLineChart from './TimelineLineChart';
import {DatabasesContext, FiltersContext} from '../index';
import {TweetsTimelineResponse} from '../../../api/TweetsTimelineResponse';
import Error from '../../error';


export const TimelineContext = createContext<TweetsTimelineResponse | null>(null);

const TimelineTab = () => {

    const { t } = useTranslation();
    const [isError, setError] = useState(false);
    const [timelineData, setTimelineData] = useState<TweetsTimelineResponse | null>(null);

    const dbs = useContext(DatabasesContext);
    const {filters} = useContext(FiltersContext);

    useEffect(() => {
        setTimelineData(null);

        (async () => {
            try {
                const result =
                    await api.GetTweetsTimeline(
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
                setTimelineData(isEqual(timelineData, result) ? timelineData : result);
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
            lock={!timelineData}
            filters={{
                showAlgorithm: true,
                showSentiment: true,
                showEmotion: true,
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
            <TimelineContext.Provider value={timelineData}>
                <TimelineLineChart/>
            </TimelineContext.Provider>
        </Flex>
    </>
}

export default TimelineTab;