import React, {createContext, useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Flex} from '@mantine/core';
import isEqual from 'lodash.isequal';

import {DatabasesContext, FiltersContext} from '../index';
import {MapResponse} from '../../../api/MapResponse';
import api from '../../../api';

import Filters from '../filters';
import MapBox from './MapBox';

export const MapContext = createContext<MapResponse | null>(null);

const MapTab = () => {

    const { t } = useTranslation();
    const dbs = useContext(DatabasesContext);
    const [isError, setError] = useState(false);
    const [mapData, setMapData] = useState<MapResponse | null>(null);
    const {filters} = useContext(FiltersContext);

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
        <Flex
            style={{marginTop: '50px'}}
            gap='md'
            justify='center'
            align='center'
            direction='row'
            wrap='wrap'>
            <MapContext.Provider value={mapData}>
                <MapBox/>
            </MapContext.Provider>
        </Flex>
    </>
}

export default MapTab;