import React, {useEffect} from 'react';
import {MapContainer, TileLayer} from 'react-leaflet'
import {ColorScheme, useMantineColorScheme} from '@mantine/core';

import {HeatmapLayerFactory} from '@vgrid/react-leaflet-heatmap-layer';
import {addressPoints} from './realword.10000';

import MapPanel, {Position} from './MapPanel';
import HeatMapPanel from './HeatMapPanel';

const DARK_MAP_URL  = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
const LIGHT_MAP_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';

const HeatmapLayer = HeatmapLayerFactory<[number, number, number]>()

/*
 * Force the AnalysisMap component to change the background color
 * when the theme is changed.
 */
const changeMapBackgroundColor = (colorScheme: ColorScheme) => {
    const mapElement = document.getElementById('AnalysisMap');

    if (mapElement) {
        mapElement.style.backgroundColor = colorScheme === 'dark' ? '#222327' : '#D0CFD3';
    }
}

const HeatMapBox = () => {
    const { colorScheme } = useMantineColorScheme();

    useEffect(() => {
        changeMapBackgroundColor(colorScheme);
    }, [colorScheme]);

    return <MapContainer
        id='AnalysisMap'
        style={{
            backgroundColor: colorScheme === 'dark' ? '#222327' : '#D0CFD3',
            height: `${window.innerHeight / 1.75}px`,
            width: '90%',
            marginBottom: '200px'}}
        center={[42.500, 12.900]}
        zoom={5}
        //maxZoom={7}
        //minZoom={4}
        scrollWheelZoom={true}>
        <TileLayer url={colorScheme === 'dark' ? DARK_MAP_URL : LIGHT_MAP_URL}/>
        <HeatmapLayer
            fitBoundsOnLoad
            fitBoundsOnUpdate
            points={addressPoints.map(current => [current[0] as number, current[1] as number, 0])}
            latitudeExtractor={m => m[0]}
            longitudeExtractor={m => m[1]}
            intensityExtractor={() => Math.random() * 1} />
        <MapPanel position={[Position.TOP, Position.RIGHT]} content={<HeatMapPanel/>}/>
    </MapContainer>

}

export default HeatMapBox;