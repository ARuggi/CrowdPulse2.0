import React, {createContext, useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import isEqual from 'lodash.isequal';

import api from '../../../api';
import Filters from '../filters';
import TweetListTable from './TweetListTable';
import {DatabasesContext, FiltersContext} from '../index';
import {TweetsListResponse} from '../../../api/TweetsListResponse';

interface TablePreferences {
    pageSize: number,
    page: number
}

const defaultTablePreferences: TablePreferences = {
    pageSize: 10,
    page: 1
}

export const TweetListContext = createContext<TweetsListResponse | null>(null);
export const TablePreferencesContext = createContext<{
    tablePreferences: TablePreferences,
    setTablePreferences: React.Dispatch<React.SetStateAction<TablePreferences>>
}>({
    tablePreferences: defaultTablePreferences,
    setTablePreferences: () => {}
});

const TweetListTab = () => {

    const { t } = useTranslation();
    const [isError, setError] = useState(false);
    const [tweetListData, setTweetListData] = useState<TweetsListResponse | null>(null);
    const [tablePreferences, setTablePreferences] = useState<TablePreferences>(defaultTablePreferences);

    const dbs = useContext(DatabasesContext);
    const {filters} = useContext(FiltersContext);

    useEffect(() => {
        setTweetListData(null);

        (async () => {
            try {
                const result =
                    await api.GetTweetsList(
                        dbs,
                        filters.algorithm,
                        filters.algorithm === 'all' ? undefined : filters.sentiment,
                        filters.algorithm !== 'feel-it' ? undefined : filters.emotion,
                        filters.dateFrom,
                        filters.dateTo,
                        filters.tags,
                        filters.processedText,
                        filters.hashtags,
                        filters.usernames,
                        tablePreferences.pageSize,
                        tablePreferences.page);
                setTweetListData(isEqual(tweetListData, result) ? tweetListData : result);
            } catch(error) {
                console.log(error);
                setError(true);
            }

        })();
    }, [filters, tablePreferences]);

    if (isError) {
        return <p>{t('serverNotRespondingError')}</p>
    }

    return <>
        <Filters
            lock={!tweetListData}
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
        <TweetListContext.Provider value={tweetListData}>
            <TablePreferencesContext.Provider
                value={{tablePreferences: tablePreferences, setTablePreferences: setTablePreferences}}>
                <TweetListTable/>
            </TablePreferencesContext.Provider>
        </TweetListContext.Provider>
    </>
}

export default TweetListTab;