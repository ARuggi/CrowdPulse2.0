import React, {createContext, useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Flex, Tabs, useMantineColorScheme} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import isEqual from 'lodash.isequal';

import {AiOutlineHeatMap} from 'react-icons/ai';
import {BsMap} from 'react-icons/bs';

import {DatabasesContext, FiltersContext} from '../index';
import {MapResponse} from '../../../api/MapResponse';
import {HeatMapResponse} from '../../../api/HeatMapResponse';
import api from '../../../api';

import Filters from '../filters';
import RegionMapBox from './region/RegionMapBox';
import HeatMapBox from './heatmap/HeatMapBox';
import Error from '../../error';

export const RegionMapContext = createContext<MapResponse | null>(null);
export const HeatMapContext = createContext<HeatMapResponse | null>(null);

const MapTab = () => {

    const { t } = useTranslation();
    const { colorScheme } = useMantineColorScheme();
    const { filters } = useContext(FiltersContext);

    const dbs = useContext(DatabasesContext);
    const [isError, setError] = useState(false);
    const [regionMapData, setRegionMapData] = useState<MapResponse | null>(null);
    const [heatMapData, setHeatMapData] = useState<HeatMapResponse | null>(null);

    const mediaQueryMd = useMediaQuery('(min-width: 992px)');

    useEffect(() => {

        setRegionMapData(null);
        setHeatMapData(null);

        (async () => {
            try {

                const regionMapDataResult =
                    await api.GetRegionMap(
                        dbs,
                        filters.algorithm,
                        filters.dateFrom,
                        filters.dateTo,
                        filters.mapType,
                        filters.tags,
                        filters.processedText,
                        filters.hashtags,
                        filters.usernames);
                setRegionMapData(isEqual(regionMapData, regionMapDataResult) ? regionMapData : regionMapDataResult);

                const heatMapDataResult =
                    await api.GetHeatMap(
                        dbs,
                        filters.algorithm,
                        filters.dateFrom,
                        filters.dateTo,
                        filters.tags,
                        filters.processedText,
                        filters.hashtags,
                        filters.usernames);
                setHeatMapData(isEqual(heatMapData, heatMapDataResult) ? heatMapData : heatMapDataResult);

            } catch(error) {
                console.log(error);
                setError(true);
            }
        })();

    }, [t, filters, colorScheme]);

    if (isError) {
        return <Error message={t('serverNotRespondingError')!}/>
    }

    return <>
        <Filters
            lock={!regionMapData}
            filters={{
                showAlgorithm: true,
                algorithm: {
                    disableAllLabel: true
                },
                showSentiment: false,
                showEmotion: false,
                showHateSpeech: false,
                showType: false,
                showMapType: true,
                showDataRangePicker: true,
                showTags: true,
                showProcessedText: true,
                showHashTags: true,
                showUsernames: true
            }}/>
        <Tabs keepMounted={false} variant='default' defaultValue='regionMap'>
            <Tabs.List>
                <Tabs.Tab value='regionMap' icon={<BsMap            size={14} />}>{mediaQueryMd ? t('tab.map.regions') : ''}</Tabs.Tab>
                <Tabs.Tab value='heatmap'   icon={<AiOutlineHeatMap size={14} />}>{mediaQueryMd ? t('tab.map.heatmap') : ''}</Tabs.Tab>
            </Tabs.List>

            <RegionMapContext.Provider value={regionMapData}>
                <Tabs.Panel value='regionMap' pt='xs'>
                    <Flex
                        gap='md'
                        justify='center'
                        align='center'
                        direction='row'
                        wrap='wrap'>
                        <RegionMapBox/>
                    </Flex>
                </Tabs.Panel>
            </RegionMapContext.Provider>

            <HeatMapContext.Provider value={heatMapData}>
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
            </HeatMapContext.Provider>
        </Tabs>
    </>
}

export default MapTab;