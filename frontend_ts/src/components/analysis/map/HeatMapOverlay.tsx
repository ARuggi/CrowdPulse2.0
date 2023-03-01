import React, {useEffect} from 'react';
import {createRoot} from 'react-dom/client';

import {useMap, GeoJSON} from 'react-leaflet';
import {Tooltip as LeafletTooltip} from 'leaflet'

import HeatMapTooltip from './HeatMapTooltip';

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

type Region = {
    feature: {
        properties: {
            reg_name: string
        }
    }
    options: {
        color: string
    }
}

interface IProps {
    mapData: any
}

/*
 * I never found an official way to remove the browser's boring
 * rectangle around each map layer (region).
 *
 * >> Very raw implementation.
 */
const hideBrowserOutlineFromLayers = (map: any) => {
    // Get the SVG elements inside the map container
    const svgElements = map.getContainer().getElementsByTagName('svg');
    // Retrieve the first SVG element that contains all layers paths.
    const svgLayersElement = svgElements.item(0);

    if (svgLayersElement) {
        const layers = svgLayersElement.getElementsByTagName('path') as HTMLCollection;

        for (let i = 0 ; i < layers.length ; i++) {
            const layer = layers.item(i)! as HTMLElement;
            layer.style.outline = 'none'; // Remove the outline of the current layer
        }
    }
}

const HeatMapOverlay:React.FC<IProps> = ({mapData}) => {
    const map = useMap();

    useEffect(() => {
        hideBrowserOutlineFromLayers(map);
    }, [map]);

    const onEachFeature = (feature: any, layer: LeafletTooltip) => {
        const region = layer as unknown as Region;
        region.options.color = `${getRandomColor()}`;

        const reg_name = feature.properties.reg_name;

        const contentLayer = (): HTMLElement => {
            const tooltipContent = document.createElement('div');
            const root = createRoot(tooltipContent);
            root.render(<HeatMapTooltip regionName={reg_name}/>);
            return tooltipContent;
        }

        layer.bindTooltip(contentLayer, {
            permanent: false,
            direction: 'top',
            opacity: 0.9,
            offset: [0, 0],
            className: ''
        });

        layer.on({
            mousemove: (event: any) => {
                layer.getTooltip()?.setLatLng(event.latlng);
            }
        });
    }

    return <>
        <GeoJSON
            data={mapData}
            onEachFeature={onEachFeature}
            style={{
                lineJoin: 'miter',
                lineCap: 'round',
                weight: 1,
            }}/>
    </>;
}

export default HeatMapOverlay;