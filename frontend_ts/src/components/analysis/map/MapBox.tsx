import React from 'react';
import {MapContainer, TileLayer} from 'react-leaflet'
import HeatMapOverlay from './HeatMapOverlay';

const MapBox = () => {
    return <MapContainer
        id='AnalysisMap'
        style={{height: '800px', width: '100%'}}
        center={[42.500, 12.900]}
        zoom={5}
        maxZoom={9}
        scrollWheelZoom={true}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png'
        />
        <HeatMapOverlay/>
    </MapContainer>
}

export default MapBox;