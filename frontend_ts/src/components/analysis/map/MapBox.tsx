import React from "react";
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'

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
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[42.500, 12.900]}>
            <Popup>Centre of Italy</Popup>
        </Marker>
    </MapContainer>
}

export default MapBox;