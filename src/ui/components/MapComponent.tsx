import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapComponentProps {
    accessToken: string;
    style?: string;
    initialCenter?: [number, number];
    initialZoom?: number;
    initialPitch?: number;
    initialBearing?: number;
    className?: string;
    containerStyle?: React.CSSProperties;
    // Controlled props
    viewState?: {
        lng: number;
        lat: number;
        zoom: number;
        pitch: number;
        bearing: number;
    } | null;
    overlayData?: any | null; // GeoJSON
    projection?: 'globe' | 'mercator';
    onCameraChange?: (state: { lng: number; lat: number; zoom: number; pitch: number; bearing: number }) => void;
    onLoad?: () => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
    accessToken,
    style = 'mapbox://styles/mapbox/dark-v11',
    initialCenter = [105, 35],
    initialZoom = 3,
    initialPitch = 0,
    initialBearing = 0,
    className,
    containerStyle,
    viewState,
    overlayData,
    projection = 'globe',
    onCameraChange,
    onLoad
}) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [error, setError] = useState<string | null>(null);
    const onLoadRef = useRef(onLoad);

    useEffect(() => {
        onLoadRef.current = onLoad;
    }, [onLoad]);

    // Sync projection
    useEffect(() => {
        if (!map.current || !projection) return;
        map.current.setProjection(projection);
    }, [projection]);

    // Sync viewState if provided
    useEffect(() => {
        if (!map.current || !viewState) return;

        const center = map.current.getCenter();
        const zoom = map.current.getZoom();
        const pitch = map.current.getPitch();
        const bearing = map.current.getBearing();

        // Calculate differences
        const dist = Math.sqrt(Math.pow(center.lng - viewState.lng, 2) + Math.pow(center.lat - viewState.lat, 2));
        const zoomDiff = Math.abs(zoom - viewState.zoom);
        const pitchDiff = Math.abs(pitch - viewState.pitch);
        const bearingDiff = Math.abs(bearing - viewState.bearing);

        // If onCameraChange is not provided, we are in a purely controlled mode (like preview/render)
        // so we should be highly precise and jump on any change.
        const isControlled = !onCameraChange;
        const threshold = isControlled ? 0 : 0.0001;
        const zoomThreshold = isControlled ? 0 : 0.05;
        const angularThreshold = isControlled ? 0 : 0.1;

        if (dist > threshold || zoomDiff > zoomThreshold || pitchDiff > angularThreshold || bearingDiff > angularThreshold) {
            map.current.jumpTo({
                center: [viewState.lng, viewState.lat],
                zoom: viewState.zoom,
                pitch: viewState.pitch,
                bearing: viewState.bearing
            });

            // Fast track: if map is already loaded (tiles cached), resolve immediately
            // instead of waiting for 'idle' event which might be delayed.
            requestAnimationFrame(() => {
                if (map.current?.loaded()) {
                    onLoadRef.current?.();
                }
            });
        } else {
            // Position is effectively same. 
            // ONLY resolve if the map is actually fully loaded.
            // If it's still initializing (loading style/tiles), we must wait for the 'idle' 
            // event (which is already listened to below).
            if (map.current?.loaded()) {
                onLoadRef.current?.();
            }
        }
    }, [viewState, onLoad]);

    const styleRef = useRef(style);

    // Sync Style
    useEffect(() => {
        if (!map.current || !style) return;
        if (style === styleRef.current) return;

        styleRef.current = style;
        map.current.setStyle(style);

        // Re-add terrain/fog/layers after style change because setStyle removes them
        map.current.once('style.load', () => {
            addTerrainAndFog(map.current!);
            if (overlayData) {
                updateOverlay(map.current!, overlayData);
            }
        });

    }, [style, overlayData]); // Added overlayData to deps to be safe, though mainly style triggers this path

    // Sync Overlay Data
    useEffect(() => {
        if (!map.current || !map.current.isStyleLoaded()) return;
        updateOverlay(map.current, overlayData);
    }, [overlayData]);


    const addTerrainAndFog = (mapInstance: mapboxgl.Map) => {
        if (!mapInstance.getSource('mapbox-dem')) {
            mapInstance.addSource('mapbox-dem', {
                'type': 'raster-dem',
                'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                'tileSize': 512,
                'maxzoom': 14
            });
        }

        mapInstance.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

        mapInstance.setFog({
            'range': [0.5, 10],
            'color': 'white',
            'horizon-blend': 0.3,
            'high-color': '#add8e6',
            'space-color': '#d8f2ff',
            'star-intensity': 0.0
        });
    };

    const updateOverlay = (mapInstance: mapboxgl.Map, data: any) => {
        if (!data) {
            if (mapInstance.getLayer('overlay-layer')) mapInstance.removeLayer('overlay-layer');
            if (mapInstance.getSource('overlay-source')) mapInstance.removeSource('overlay-source');
            return;
        }

        const source = mapInstance.getSource('overlay-source') as mapboxgl.GeoJSONSource;
        if (source) {
            source.setData(data);
        } else {
            mapInstance.addSource('overlay-source', {
                type: 'geojson',
                data: data
            });

            // Heuristic to determine layer type
            // For now, assume lines or polygons for visual effect
            mapInstance.addLayer({
                id: 'overlay-layer',
                type: 'line',
                source: 'overlay-source',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#ff0000',
                    'line-width': 3,
                    'line-opacity': 0.8
                }
            });

            mapInstance.addLayer({
                id: 'overlay-fill',
                type: 'fill',
                source: 'overlay-source',
                paint: {
                    'fill-color': '#ff0000',
                    'fill-opacity': 0.1
                }
            });
        }
    };

    // FlyTo logic from store
    const { flyToTarget, clearFlyTo } = useAppStore();

    useEffect(() => {
        if (!map.current || !flyToTarget) return;

        map.current.flyTo({
            center: [flyToTarget.lng, flyToTarget.lat],
            zoom: flyToTarget.zoom,
            pitch: flyToTarget.pitch,
            bearing: flyToTarget.bearing,
            essential: true
        });

        clearFlyTo();
    }, [flyToTarget]);

    // Initialize Map
    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) return;

        if (!accessToken) {
            setError("Missing Mapbox Access Token");
            return;
        }

        mapboxgl.accessToken = accessToken;

        try {
            console.log("Initialize Mapbox with:", style);
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: style,
                center: initialCenter,
                zoom: initialZoom,
                pitch: initialPitch,
                bearing: initialBearing,
                projection: projection,
                antialias: true,
                preserveDrawingBuffer: true,
                maxPitch: 85
            });

            styleRef.current = style; // Sync ref on init

            map.current.on('style.load', () => {
                console.log("Map style loaded");
                if (!map.current) return;
                addTerrainAndFog(map.current);
                if (overlayData) updateOverlay(map.current, overlayData);
            });

            map.current.on('idle', () => {
                console.log("Map idle - waiting for texture readiness...");
                setTimeout(() => {
                    onLoadRef.current?.();
                }, 100);
            });

            // Ensure we catch the initial load event specificially
            map.current.on('load', () => {
                console.log("Map load event - buffering...");
                setTimeout(() => {
                    onLoadRef.current?.();
                }, 100);
            });

            map.current.on('error', (e) => {
                console.error("Mapbox Error:", e);
                setError("Mapbox Error: " + e.error.message);
            });

            map.current.on('move', (e) => {
                if (!map.current || !onCameraChange) return;

                // Only update store if the move was initiated by user interaction
                // (mouse, touch, keyboard) to avoid infinite loops with store updates.
                if (e.originalEvent) {
                    const center = map.current.getCenter();
                    onCameraChange({
                        lng: center.lng,
                        lat: center.lat,
                        zoom: map.current.getZoom(),
                        pitch: map.current.getPitch(),
                        bearing: map.current.getBearing()
                    });
                }
            });

        } catch (err: any) {
            console.error("Error initializing map:", err);
            setError(err.message || "Failed to initialize map");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken]); // Only re-init if token changes. Ignore initial params updates.

    const combinedStyle = {
        position: 'absolute' as 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        ...containerStyle
    };

    return (
        <div className={`relative w-full h-full ${className || ''}`} style={combinedStyle}>
            {error && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-red-900/80 text-white p-4">
                    <p>Error: {error}</p>
                </div>
            )}
            <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};
