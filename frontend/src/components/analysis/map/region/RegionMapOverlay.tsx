import React, {useContext, useEffect} from 'react';
import {createRoot} from 'react-dom/client';

import {FiltersContext} from '../../index';
import {useMap, GeoJSON} from 'react-leaflet';
import {Tooltip as LeafletTooltip} from 'leaflet'

import RegionMapEmotionTooltip from './RegionMapEmotionTooltip';
import RegionMapSentimentTooltip from './RegionMapSentimentTooltip';
import RegionMapHateSpeechTooltip from './RegionMapHateSpeechTooltip';

import {MapResponse} from '../../../../api/MapResponse';

/*
 * The limits_IT_provinces.geojson file contains a list of entities that describe
 * the map of Italy. Each entity has a property called "feature.properties"
 * that contains the region name and the city name (if the entity is a city).
 */
type MapChunkContent = {
    feature: {
        properties: {
            prov_name?: string, // the city name, can be undefined (e.g. "Milano")
            reg_name: string    // the region name (e.g. "Lombardia")
        }
    }
    // not contained in the original entity, but added to add color to the painted region
    options: {
        color: string
    }
}

interface IProps {
    geoJsonData: any,          // The GeoJsonFile
    mapData: MapResponse // The region map data received from the backend
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

/*
 * The GeoJson file contains a little differences in the region names.
 * This function provides to fix them.
 */
const fromGeoRegionNameToResponseRegionName = (reg_name: string) => {
    switch (reg_name?.toLowerCase()) {
        case 'valle d\'aosta': return 'valle aosta';
        case 'friuli venezia giulia': return 'friuli giulia';
        default: return reg_name?.toLowerCase();
    }
}

const getColorFromSentimentData = (data: any, mapChunkContent: MapChunkContent)  => {

    // use default color if there is no data
    if (data.sentimentPositive === 0
        && data.sentimentNeutral === 0
        && data.sentimentNegative === 0) {
        return;
    }

    if (data.sentimentPositive === data.sentimentNeutral
        && data.sentimentPositive === data.sentimentNegative) {
        mapChunkContent.options.color = '#6B6B6B';
    } else if (data.sentimentPositive >= data.sentimentNeutral
        && data.sentimentPositive >= data.sentimentNegative) {
        mapChunkContent.options.color = '#FFCB52';
    } else if (data.sentimentNegative >= data.sentimentPositive
        && data.sentimentNegative >= data.sentimentNeutral) {
        mapChunkContent.options.color = '#FF5C7F';
    } else if (data.sentimentNeutral >= data.sentimentPositive
        && data.sentimentNeutral >= data.sentimentNegative) {
        mapChunkContent.options.color = '#2AAAFF';
    }
}

const getColorFromEmotionData = (data: any, mapChunkContent: MapChunkContent) => {

    // use default color if there is no data
    if (data.emotionJoy === 0
        && data.emotionSadness === 0
        && data.emotionAnger === 0
        && data.emotionFear === 0) {
        return;
    }

    if (data.emotionJoy === data.emotionSadness
        && data.emotionJoy === data.emotionAnger
        && data.emotionJoy === data.emotionFear) {
        mapChunkContent.options.color = '#6B6B6B';
    } else if (data.emotionJoy >= data.emotionSadness
        && data.emotionJoy >= data.emotionAnger
        && data.emotionJoy >= data.emotionFear) {
        mapChunkContent.options.color = '#FFA50082';
    } else if (data.emotionSadness >= data.emotionJoy
        && data.emotionSadness >= data.emotionAnger
        && data.emotionSadness >= data.emotionFear) {
        mapChunkContent.options.color = '#0000FF7C';
    } else if (data.emotionAnger >= data.emotionJoy
        && data.emotionAnger >= data.emotionSadness
        && data.emotionAnger >= data.emotionFear) {
        mapChunkContent.options.color = '#FF00008C';
    } else if (data.emotionFear >= data.emotionJoy
        && data.emotionFear >= data.emotionSadness
        && data.emotionFear >= data.emotionAnger) {
        mapChunkContent.options.color = '#8000808E';
    }
}

const getColorFromHateSpeechData = (data: any, mapChunkContent: MapChunkContent) => {

    // use default color if there is no data
    if (data.hateSpeechAcceptable === 0
        && data.hateSpeechInappropriate === 0
        && data.hateSpeechOffensive === 0
        && data.hateSpeechViolent === 0) {
        return;
    }

    if (data.hateSpeechAcceptable === data.hateSpeechInappropriate
        && data.hateSpeechAcceptable === data.hateSpeechOffensive
        && data.hateSpeechAcceptable === data.hateSpeechViolent) {
        mapChunkContent.options.color = '#6B6B6B';
    } else if (data.hateSpeechAcceptable >= data.hateSpeechInappropriate
        && data.hateSpeechAcceptable >= data.hateSpeechOffensive
        && data.hateSpeechAcceptable >= data.hateSpeechViolent) {
        mapChunkContent.options.color = '#FFA50082';
    } else if (data.hateSpeechInappropriate >= data.hateSpeechAcceptable
        && data.hateSpeechInappropriate >= data.hateSpeechOffensive
        && data.hateSpeechInappropriate >= data.hateSpeechViolent) {
        mapChunkContent.options.color = '#0000FF7C';
    } else if (data.hateSpeechOffensive >= data.hateSpeechAcceptable
        && data.hateSpeechOffensive >= data.hateSpeechInappropriate
        && data.hateSpeechOffensive >= data.hateSpeechViolent) {
        mapChunkContent.options.color = '#FF00008C';
    } else if (data.hateSpeechViolent >= data.hateSpeechAcceptable
        && data.hateSpeechViolent >= data.hateSpeechInappropriate
        && data.hateSpeechViolent >= data.hateSpeechOffensive) {
        mapChunkContent.options.color = '#8000808E';
    }
}

const RegionMapOverlay:React.FC<IProps> = ({geoJsonData, mapData}) => {
    const {filters} = useContext(FiltersContext);
    const map = useMap();

    useEffect(() => {
        hideBrowserOutlineFromLayers(map);
    }, [map]);

    // draw each region or city boundary on the map
    const onEachFeature = (feature: any, layer: LeafletTooltip) => {
        const mapChunkContent = layer as unknown as MapChunkContent;
        mapChunkContent.options.color = '#000'; // default region color

        let chunkName: string;
        let chunkData: any;

        if (filters.mapType === 'region') {
            chunkName = feature.properties.reg_name;
            chunkData = mapData[fromGeoRegionNameToResponseRegionName(chunkName)];
        } else {
            chunkName = feature.properties.prov_name;
            chunkData = mapData[chunkName?.toLowerCase()];

            if (chunkName.includes('-')) {
                const chunkNameArray = chunkName.toLowerCase().split('-');

                for (const name in chunkNameArray) {
                    const temp = mapData[name];

                    if (temp) {
                        chunkName = name;
                        chunkData = temp;
                        break;
                    }
                }
            }
        }

        if (chunkData) {

            if (filters.algorithm === 'sent-it') {
                getColorFromSentimentData(chunkData, mapChunkContent);
            }

            if (filters.algorithm === 'feel-it') {
                getColorFromEmotionData(chunkData, mapChunkContent);
            }

            if (filters.algorithm === 'hate-speech') {
                getColorFromHateSpeechData(chunkData, mapChunkContent);
            }
        }

        const contentLayer = (): HTMLElement => {
            const tooltipContent = document.createElement('div');
            const root = createRoot(tooltipContent);

            if (filters.algorithm === 'sent-it') {
                root.render(<RegionMapSentimentTooltip
                    name={chunkName}
                    data={
                        chunkData
                        && chunkData.sentimentPositive === 0
                        && chunkData.sentimentNeutral === 0
                        && chunkData.sentimentNegative === 0
                            ? undefined
                            : chunkData
                    }/>);
            } else if (filters.algorithm === 'feel-it') {
                root.render(<RegionMapEmotionTooltip
                    name={chunkName}
                    data={
                        chunkData
                        && chunkData.emotionJoy === 0
                        && chunkData.emotionSadness === 0
                        && chunkData.emotionAnger === 0
                        && chunkData.emotionFear === 0
                            ? undefined
                            : chunkData
                    }/>);
            } else if (filters.algorithm === 'hate-speech') {
                root.render(<RegionMapHateSpeechTooltip
                    name={chunkName}
                    data={
                        chunkData
                        && chunkData.hateSpeechAcceptable === 0
                        && chunkData.hateSpeechInappropriate === 0
                        && chunkData.hateSpeechOffensive === 0
                        && chunkData.hateSpeechViolent === 0
                            ? undefined
                            : chunkData
                    }/>);
            }

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