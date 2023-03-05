import React, {createContext, useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Flex, Tabs} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import isEqual from 'lodash.isequal';

import {AiFillInfoCircle} from 'react-icons/ai';

import {DatabasesContext, FiltersContext} from '../index';
import {MapResponse} from '../../../api/MapResponse';
import api from '../../../api';

import Filters from '../filters';
import MapBox from './MapBox';
import HeatMapBox from './HeatMapBox';


export const MapContext = createContext<MapResponse | null>(null);

const MapTab = () => {

    const { t } = useTranslation();
    const dbs = useContext(DatabasesContext);
    const [isError, setError] = useState(false);
    const [mapData, setMapData] = useState<MapResponse | null>(null);
    const {filters} = useContext(FiltersContext);
    const mediaQueryMd = useMediaQuery('(min-width: 992px)');

    useEffect(() => {
        setMapData(null);

        (async () => {
            try {
                const result =
                    await api.GetMap(
                        dbs,
                        filters.algorithm,
                        filters.sentiment,
                        filters.emotion,
                        filters.dateFrom,
                        filters.dateTo,
                        filters.tags,
                        filters.processedText,
                        filters.hashtags,
                        filters.usernames);
                setMapData(isEqual(mapData, result) ? mapData : result);
            } catch(error) {
                console.log(error);
                setError(true);
            }
        })();

    }, [filters]);

    if (isError) {
        return <p>{t('serverNotRespondingError')}</p>
    }

    return <>
        <Filters
            lock={!mapData}
            filters={{
                showAlgorithm: true,
                algorithm: {
                    disableAllLabel: true
                },
                showSentiment: false, // TODO: Check if this property is needed.
                showEmotion: false,   // TODO: Check if this property is needed.
                showType: false,
                showDataRangePicker: true,
                showTags: true,
                showProcessedText: true,
                showHashTags: true,
                showUsernames: true
            }}/>
        <Tabs keepMounted={false} variant='default' defaultValue='map'>
            <Tabs.List>
                <Tabs.Tab value='map'     icon={<AiFillInfoCircle size={14} />}>{mediaQueryMd ? 'Map'     : ''}</Tabs.Tab>
                <Tabs.Tab value='heatmap' icon={<AiFillInfoCircle size={14} />}>{mediaQueryMd ? 'Heatmap' : ''}</Tabs.Tab>
            </Tabs.List>

            <MapContext.Provider value={mapData}>
                <Tabs.Panel value='map' pt='xs'>
                    <Flex
                        gap='md'
                        justify='center'
                        align='center'
                        direction='row'
                        wrap='wrap'>
                        <MapBox/>
                    </Flex>
                </Tabs.Panel>
            </MapContext.Provider>

            <Tabs.Panel value='heatmap' pt='xs'>
                <Flex
                    gap='md'
                    justify='center'
                    align='center'
                    direction='row'
                    wrap='wrap'>
                    <HeatMapBox/>
                </Flex>
            </Tabs.Panel>
        </Tabs>
    </>
}

export default MapTab;