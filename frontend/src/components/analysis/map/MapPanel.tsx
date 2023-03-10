import React from 'react';

export enum Position {
    TOP    = 'leaflet-top',
    BOTTOM = 'leaflet-bottom',
    RIGHT  = 'leaflet-right',
    LEFT   = 'leaflet-left'
}

interface IProps {
    position: Position[],
    content: any
}

const MapPanel:React.FC<IProps> = ({position, content}) => {
    const positionClassName = position.join(' ');

    return <div className={positionClassName}>
        <div
            className="leaflet-control leaflet-bar"
            style={{borderStyle: 'none'}}>
            {content}
        </div>
    </div>
}

export default MapPanel;