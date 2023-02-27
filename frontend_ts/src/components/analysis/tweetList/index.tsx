import React, {useContext} from 'react';
import {Tabs} from '@mantine/core';

import TweetListTab from './TweetListTab';
import {DatabasesContext} from '../index';
import {TbFileDatabase} from 'react-icons/tb';

const TweetList = () => {
    const dbs = useContext(DatabasesContext);

    if (dbs.length === 0) {
        return <></>
    }

    if (dbs.length === 1) {
        return <TweetListTab db={dbs[0]}/>
    }

    return <Tabs keepMounted={false} variant='outline' defaultValue={dbs[0]}>
        <Tabs.List>
            {dbs.map((db) => {
                return <Tabs.Tab value={db} icon={<TbFileDatabase/>}>{db}</Tabs.Tab>
            })}
        </Tabs.List>
        {dbs.map((db) => {
            return <Tabs.Panel value={db} pt='xs'>
                <TweetListTab db={db}/>
            </Tabs.Panel>
        })}
    </Tabs>
}

export default TweetList;