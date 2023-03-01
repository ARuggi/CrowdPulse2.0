import React, {useEffect, useState} from 'react';
import {MapContainer, TileLayer} from 'react-leaflet'
import HeatMapOverlay from './HeatMapOverlay';
import {GeoJsonObject} from "geojson";
import {Loader, useMantineColorScheme} from "@mantine/core";

const DARK_MAP_URL  = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
const LIGHT_MAP_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';

const MapBox = () => {

    const { colorScheme } = useMantineColorScheme();
    const [mapData, setMapData] = useState<GeoJsonObject | null>(null);

    useEffect(() => {
        (async () => {
            const response = await fetch('/map/limits_IT_regions.geojson');
            setMapData(await response.json());
        })();
    }, []);

    return mapData
        ? <MapContainer
            id='AnalysisMap'
            style={{height: '800px', width: '100%'}}
            center={[42.500, 12.900]}
            zoom={6}
            maxZoom={7}
            minZoom={4}
            scrollWheelZoom={true}>
            <TileLayer url={colorScheme === 'dark' ? DARK_MAP_URL : LIGHT_MAP_URL}/>
            <HeatMapOverlay mapData={mapData}/>
        </MapContainer>
        : <Loader/>

}

export default MapBox;