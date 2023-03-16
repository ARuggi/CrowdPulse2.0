import React, {createContext, useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TweetsListResponse} from '../../../api/TweetsListResponse';
import {FiltersContext} from '../index';
import api from '../../../api';
import isEqual from 'lodash.isequal';
import Filters from '../filters';
import TweetListTable from './TweetListTable';
import Error from '../../error';

interface IProps {
    db: string
}

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

const TweetListTab:React.FC<IProps> = ({db}) => {

    const { t } = useTranslation();
    const [isError, setError] = useState(false);
    const [tweetListData, setTweetListData] = useState<TweetsListResponse | null>(null);
    const [tablePreferences, setTablePreferences] = useState<TablePreferences>(defaultTablePreferences);
    const {filters} = useContext(FiltersContext);

    useEffect(() => {
        setTweetListData(null);

        (async () => {
            try {
                const result =
                    await api.GetTweetsList(
                        Array.of(db),
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
        return <Error message={t('serverNotRespondingError')!}/>
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