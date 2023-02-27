import React, {useEffect, useRef, useState} from 'react';
import {useMap} from "react-leaflet";
import * as PIXI from 'pixi.js';

// Geographic coordinates of the center of Italy.
const centerLat = 42.5;
const centerLng = 12.5;

const HeatMapOverlay = () => {

    const map = useMap();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [overlayPane, setOverlayPane] = useState<HTMLElement | null>(null);
    const [application, setApplication] = useState<PIXI.Application | null>(null);
    const [container, setContainer] = useState<PIXI.Container | null>(null);

    useEffect(() => {
        if (canvasRef.current) return;

        const canvas = document
            .createElement('canvas');
        // Set the canvas size to match the map size.

        const mapSize = map.getSize();
        canvas.width = mapSize.x;
        canvas.height = mapSize.y;
        canvasRef.current = canvas;

        setApplication(
            new PIXI.Application({
                view: canvas,
                resizeTo: window,
                backgroundColor: 'red',
                backgroundAlpha: 0.1
            }));

        const overlayPane = map.createPane('pixiOverlay');
        overlayPane.appendChild(canvasRef.current);
        setOverlayPane(overlayPane);

        const pixiContainer = new PIXI.Container();
        application?.stage.addChild(pixiContainer);
        setContainer(pixiContainer);
    }, [canvasRef]);

    useEffect(() => {
        if (map && application && container && overlayPane) {
            // Set the initial position of the canvas.
            const canvasElement = overlayPane.firstChild as HTMLCanvasElement;

            const move = () => {
                const topLeft = map.latLngToLayerPoint([centerLat, centerLng]);
                const bottomRight = map.latLngToLayerPoint([centerLat - 2, centerLng + 2]);
                canvasElement.style.left = `${topLeft.x}px`;
                canvasElement.style.top = `${topLeft.y}px`;
                canvasElement.width = bottomRight.x - topLeft.x;
                canvasElement.height = bottomRight.y - topLeft.y;
            }

            const zoomStartHandler = () => {
                application.stage.alpha = 0;
                overlayPane.style.opacity = '0';
            };

            const zoomEndHandler = () => {
                application.stage.alpha = 1;
                overlayPane.style.opacity = '1';
                move();
            };

            move();

            // Update the position of the canvas every time the map is panned or resized.
            map.on('move',      move);
            map.on('zoomstart', zoomStartHandler);
            map.on('zoomend',   zoomEndHandler);

            return () => {
                map.off('move',      move);
                map.off('zoomstart', zoomStartHandler);
                map.off('zoomend',   zoomEndHandler);
            };
        }
    }, [map, application, container, overlayPane]);

    return <></>;
}

export default HeatMapOverlay;