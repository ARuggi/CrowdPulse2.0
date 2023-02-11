import React from 'react';
import {useSearchParams} from 'react-router-dom';
import {Tabs} from '@mantine/core';

import {AiFillInfoCircle, AiFillFileWord, AiOutlineUnorderedList} from 'react-icons/ai';
import {MdSentimentSatisfiedAlt} from 'react-icons/md';
import {RiTimeLine} from 'react-icons/ri';
import {BsMap} from 'react-icons/bs';

import InfoTab from './InfoTab';
import SentimentTab from './SentimentTab';
import WordTab from './WordTab';
import TimelineTab from './TimelineTab';
import TweetListTab from './TweetListTab';
import MapTab from './MapTab';

const Analysis = () => {

    const [query] = useSearchParams();
    const dbs: string[] | undefined = query.getAll('dbs');

    return <Tabs variant='outline' defaultValue='info'>
        <Tabs.List>
            <Tabs.Tab value='info' icon={<AiFillInfoCircle size={14} />}>info</Tabs.Tab>
            <Tabs.Tab value='sentiment' icon={<MdSentimentSatisfiedAlt size={14} />}>Sentiment</Tabs.Tab>
            <Tabs.Tab value='word' icon={<AiFillFileWord size={14} />}>Word</Tabs.Tab>
            <Tabs.Tab value='timeline' icon={<RiTimeLine size={14} />}>Timeline</Tabs.Tab>
            <Tabs.Tab value='tweet_list' icon={<AiOutlineUnorderedList size={14} />}>Tweet list</Tabs.Tab>
            <Tabs.Tab value='map' icon={<BsMap size={14} />}>Map</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='info' pt='xs'><InfoTab dbs={dbs}/></Tabs.Panel>
        <Tabs.Panel value='sentiment' pt='xs'><SentimentTab dbs={dbs}/></Tabs.Panel>
        <Tabs.Panel value='word' pt='xs'><WordTab dbs={dbs}/></Tabs.Panel>
        <Tabs.Panel value='timeline' pt='xs'><TimelineTab dbs={dbs}/></Tabs.Panel>
        <Tabs.Panel value='tweet_list' pt='xs'><TweetListTab dbs={dbs}/></Tabs.Panel>
        <Tabs.Panel value='map' pt='xs'><MapTab dbs={dbs}/></Tabs.Panel>
    </Tabs>
}

export default Analysis;