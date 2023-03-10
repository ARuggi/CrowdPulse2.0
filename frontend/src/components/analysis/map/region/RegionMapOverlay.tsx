import React, {useContext, useEffect} from 'react';
import {createRoot} from 'react-dom/client';

import {FiltersContext} from '../../index';
import {useMap, GeoJSON} from 'react-leaflet';
import {Tooltip as LeafletTooltip} from 'leaflet'

import RegionMapTooltip from './RegionMapTooltip';
import {MapResponse} from '../../../../api/MapResponse';

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
    geoJsonData: any,
    mapData: MapResponse
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

const fromGeoRegionNameToResponseRegionName = (reg_name: string) => {
    switch (reg_name.toLowerCase()) {
        case 'valle d\'aosta': return 'valle aosta';
        case 'friuli venezia giulia': return 'friuli giulia';
        default: return reg_name.toLowerCase();
    }
}

const RegionMapOverlay:React.FC<IProps> = ({geoJsonData, mapData}) => {
    const {filters} = useContext(FiltersContext);
    const map = useMap();

    useEffect(() => {
        hideBrowserOutlineFromLayers(map);
    }, [map]);

    const onEachFeature = (feature: any, layer: LeafletTooltip) => {
        const region = layer as unknown as Region;

        const regionName = feature.properties.reg_name;
        const regionData = mapData[fromGeoRegionNameToResponseRegionName(regionName)];

        if (regionData) {
            if (regionData.sentimentPositive === regionData.sentimentNeutral
                && regionData.sentimentPositive === regionData.sentimentNegative) {
                region.options.color = '#6B6B6B';
            } else if (regionData.sentimentPositive >= regionData.sentimentNeutral
                && regionData.sentimentPositive >= regionData.sentimentNegative) {
                region.options.color = '#FFCB52';
            } else if (regionData.sentimentNegative >= regionData.sentimentPositive
                && regionData.sentimentNegative >= regionData.sentimentNeutral) {
                region.options.color = '#FF5C7F';
            } else if (regionData.sentimentNeutral >= regionData.sentimentPositive
                && regionData.sentimentNeutral >= regionData.sentimentNegative) {
                region.options.color = '#2AAAFF';
            }

            if (filters.algorithm === 'feel-it') {
                if (regionData.emotionJoy === regionData.emotionSadness
                    && regionData.emotionJoy === regionData.emotionAnger
                    && regionData.emotionJoy === regionData.emotionFear) {
                    region.options.color = '#6B6B6B';
                } else if (regionData.emotionJoy >= regionData.emotionSadness
                    && regionData.emotionJoy >= regionData.emotionAnger
                    && regionData.emotionJoy >= regionData.emotionFear) {
                    region.options.color = '#FFA50082';
                } else if (regionData.emotionSadness >= regionData.emotionJoy
                    && regionData.emotionSadness >= regionData.emotionAnger
                    && regionData.emotionSadness >= regionData.emotionFear) {
                    region.options.color = '#0000FF7C';
                } else if (regionData.emotionAnger >= regionData.emotionJoy
                    && regionData.emotionAnger >= regionData.emotionSadness
                    && regionData.emotionAnger >= regionData.emotionFear) {
                    region.options.color = '#FF00008C';
                } else if (regionData.emotionFear >= regionData.emotionJoy
                    && regionData.emotionFear >= regionData.emotionSadness
                    && regionData.emotionFear >= regionData.emotionAnger) {
                    region.options.color = '#8000808E';
                }
            }
        }

        const contentLayer = (): HTMLElement => {
            const tooltipContent = document.createElement('div');
            const root = createRoot(tooltipContent);
            root.render(<RegionMapTooltip
                regionName={regionName}
                regionData={regionData}
                includeEmotion={filters.algorithm === 'feel-it'}/>);
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
            data={geoJsonData}
            onEachFeature={onEachFeature}
            style={{
                lineJoin: 'miter',
                lineCap: 'round',
                weight: 1,
            }}/>
    </>;
}

export default RegionMapOverlay;