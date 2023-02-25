import React, {createContext, useEffect, useState} from 'react';
import {useLocation, useSearchParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {Tabs} from '@mantine/core';

import {AiFillInfoCircle, AiFillFileWord, AiOutlineUnorderedList} from 'react-icons/ai';
import {MdSentimentSatisfiedAlt} from 'react-icons/md';
import {RiTimeLine} from 'react-icons/ri';
import {BsMap} from 'react-icons/bs';
import {FiSettings} from 'react-icons/fi';

import InfoTab from './info';
import SentimentTab from './sentiment';
import WordTab from './word';
import TimelineTab from './timeline';
import TweetListTab from './tweetList';
import MapTab from './map';
import SettingsTab from './settings';
import {useMediaQuery} from '@mantine/hooks';

export type FiltersContextType = {
    [key: string]: any,
    algorithm: string,
    sentiment: string | undefined,
    emotion:   string | undefined,
    type:      string | undefined,
    dateFrom: Date | undefined,
    dateTo:   Date | undefined,
    tags:          string[] | undefined,
    processedText: string[] | undefined,
    hashtags:      string[] | undefined,
    usernames:     string[] | undefined
}

const defaultFilters: FiltersContextType = {
    algorithm: 'sent-it',
    sentiment: undefined,
    emotion: undefined,
    type: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    tags: undefined,
    processedText: undefined,
    hashtags: undefined,
    usernames: undefined
}

export const DatabasesContext = createContext<string[]>([]);
export const FiltersContext = createContext<{
    filters: FiltersContextType,
    setFilters: React.Dispatch<React.SetStateAction<FiltersContextType>>
}>({
    filters: defaultFilters,
    setFilters: () => {}
});

const Analysis = () => {
    const mediaQueryMd = useMediaQuery('(min-width: 992px)');

    const { t } = useTranslation();
    const location = useLocation();
    const [query] = useSearchParams();
    const [reload, setReload] = useState(false);

    const [sentimentFilters, setSentimentFilters] = useState<FiltersContextType>({...defaultFilters});
    const [wordFilters, setWordFilters] = useState<FiltersContextType>({...defaultFilters, ...{algorithm: 'all'}});
    const [timelineFilters, setTimelineFilters] = useState<FiltersContextType>({...defaultFilters, ...{algorithm: 'all'}});

    useEffect(() => {
        if (!reload) setReload(true);
        else window.location.reload();
    }, [location.search]);

    const dbs: string[] | undefined = query.getAll('dbs');

    return <DatabasesContext.Provider value={dbs}>
        <Tabs keepMounted={false} variant='default' defaultValue='info'>
            <Tabs.List>
                <Tabs.Tab value='info' icon={<AiFillInfoCircle size={14} />}>{mediaQueryMd ? t('info') : ''}</Tabs.Tab>
                <Tabs.Tab value='sentiment' icon={<MdSentimentSatisfiedAlt size={14} />}>{mediaQueryMd ? t('sentiment'): ''}</Tabs.Tab>
                <Tabs.Tab value='word' icon={<AiFillFileWord size={14} />}>{mediaQueryMd ? t('word'): ''}</Tabs.Tab>
                <Tabs.Tab value='timeline' icon={<RiTimeLine size={14} />}>{mediaQueryMd ? t('timeline') : ''}</Tabs.Tab>
                <Tabs.Tab value='tweet_list' icon={<AiOutlineUnorderedList size={14} />}>{mediaQueryMd ? t('tweetList') : ''}</Tabs.Tab>
                <Tabs.Tab value='map' icon={<BsMap size={14} />}>{mediaQueryMd ? t('map') : ''}</Tabs.Tab>
                <Tabs.Tab value='settings' icon={<FiSettings size={14} />} ml='auto'>{mediaQueryMd ? t('settings') : ''}</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value='info' pt='xs'><InfoTab/></Tabs.Panel>

            <FiltersContext.Provider value={{filters: sentimentFilters, setFilters: setSentimentFilters}}>
                <Tabs.Panel value='sentiment' pt='xs'><SentimentTab/></Tabs.Panel>
            </FiltersContext.Provider>

            <FiltersContext.Provider value={{filters: wordFilters, setFilters: setWordFilters}}>
                <Tabs.Panel value='word' pt='xs'><WordTab/></Tabs.Panel>
            </FiltersContext.Provider>

            <FiltersContext.Provider value={{filters: timelineFilters, setFilters: setTimelineFilters}}>
                <Tabs.Panel value='timeline' pt='xs'><TimelineTab/></Tabs.Panel>
            </FiltersContext.Provider>

            <Tabs.Panel value='tweet_list' pt='xs'><TweetListTab/></Tabs.Panel>
            <Tabs.Panel value='map' pt='xs'><MapTab/></Tabs.Panel>
            <Tabs.Panel value='settings' pt='xs'><SettingsTab/></Tabs.Panel>
        </Tabs>

    </DatabasesContext.Provider>
}

export default Analysis;