import React, {useContext, useEffect, useState} from 'react';
import {MapContainer, TileLayer} from 'react-leaflet'
import {ColorScheme, Loader, useMantineColorScheme} from '@mantine/core';
import {GeoJsonObject} from 'geojson';

import HeatMapOverlay from './HeatMapOverlay';
import MapPanel, {Position} from './MapPanel';
import HeatMapPanel from './HeatMapPanel';
import {MapContext} from './index';

const DARK_MAP_URL  = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
const LIGHT_MAP_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';

/*
 * Force the AnalysisMap component to change the background color
 * when the theme is changed.
 */
const changeMapBackgroundColor = (colorScheme: ColorScheme) => {
    const mapElement = document.getElementById('AnalysisMap');

    if (mapElement) {
        mapElement.style.backgroundColor = colorScheme === 'dark' ? '#222327' : '#d0cfd3';
    }
}

const MapBox = () => {
    
    const { colorScheme } = useMantineColorScheme();
    const [geoJsonData, setGeoJsonData] = useState<GeoJsonObject | null>(null);
    const mapData = useContext(MapContext);
    
    useEffect(() => {
        changeMapBackgroundColor(colorScheme);
    }, [colorScheme]);

    useEffect(() => {
        (async () => {
            const response = await fetch('/map/limits_IT_regions.geojson');
            setGeoJsonData(await response.json());
        })();
    }, []);

    return geoJsonData && mapData
        ? <MapContainer
            id='AnalysisMap'
            style={{
                backgroundColor: colorScheme === 'dark' ? '#222327' : '#D0CFD3',
                height: `${window.innerHeight / 1.75}px`,
                width: '90%',
                marginBottom: '200px'}}
            center={[42.500, 12.900]}
            zoom={5}
            maxZoom={7}
            minZoom={4}
            scrollWheelZoom={true}>
            <TileLayer url={colorScheme === 'dark' ? DARK_MAP_URL : LIGHT_MAP_URL}/>
            <HeatMapOverlay geoJsonData={geoJsonData} mapData={mapData}/>
            <MapPanel position={[Position.TOP, Position.RIGHT]} content={<HeatMapPanel/>}/>
        </MapContainer>
        : <Loader/>

}

export default MapBox;