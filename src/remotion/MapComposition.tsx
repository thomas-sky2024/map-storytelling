import React, { useEffect, useState } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, delayRender, continueRender } from 'remotion';
import { MapComponent } from '../ui/components/MapComponent';
import { interpolateCamera } from '../core/interpolation';
import { Keyframe } from '../store/useAppStore';

interface MapCompositionProps {
    keyframes: Keyframe[];
    mapboxToken?: string;
    mapStyle?: string;
    overlayData?: any;
    projection?: 'globe' | 'mercator';
    durationInFrames?: number;
    fps?: number;
    width?: number;
    height?: number;
    showDataCounters?: boolean;
    showWarningSystem?: boolean;
}

export const MapComposition: React.FC<MapCompositionProps> = ({
    keyframes,
    mapboxToken,
    mapStyle,
    overlayData,
    projection,
    showDataCounters = true,
    showWarningSystem = true
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Debugging Token
    const token = mapboxToken || process.env.VITE_MAPBOX_TOKEN;
    if (!token) {
        console.warn("⚠️ Mapbox Token is MISSING! Map will not render.");
    } else {
        console.log("✅ Mapbox Token Present:", token.slice(0, 5) + "...");
    }

    // Track the render handle for the current frame
    const [renderHandle, setRenderHandle] = useState<number | null>(null);

    const resolveFrame = React.useCallback(() => {
        if (renderHandle) {
            continueRender(renderHandle);
            setRenderHandle(null);
        }
    }, [renderHandle]);

    // Every time we move to a new frame, we create a new delay handle.
    // This forces Remotion to wait until Mapbox signals 'idle' or 'loaded' for this specific frame.
    useEffect(() => {
        const handle = delayRender(`Frame ${frame} load`);
        setRenderHandle(handle);

        // Safety timeout in case Mapbox hangs
        const t = setTimeout(() => {
            continueRender(handle);
            setRenderHandle(null);
        }, 10000);

        return () => {
            clearTimeout(t);
        };
    }, [frame]);

    // Sync isResolved state with handle for props
    const isResolved = renderHandle === null;

    // Interpolate camera for current frame
    const cameraState = interpolateCamera(frame, keyframes);

    if (!cameraState) {
        // If no camera state (e.g. empty keyframes), we still need to resolve to not block
        if (!isResolved) resolveFrame();
        return <AbsoluteFill className="bg-black text-white flex items-center justify-center">No Camera State</AbsoluteFill>;
    }

    return (
        <AbsoluteFill>
            {/* Base Map */}
            <MapComponent
                accessToken={token || ''}
                style={mapStyle}
                projection={projection}
                overlayData={overlayData}
                viewState={cameraState}
                currentFrame={frame}
                onLoad={resolveFrame}
                className="w-full h-full"
                containerStyle={{ width: '100%', height: '100%' }}
            />

            {/* Cinematic Overlays */}
            <AbsoluteFill className="pointer-events-none">
                {/* Vignette */}
                <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.6)]" />

                {/* Top Info Labels */}
                {showDataCounters && (
                    <div className="absolute top-12 left-12 flex gap-4">
                        <div className="bg-black/80 backdrop-blur-md border-l-4 border-blue-500 p-5 shadow-2xl">
                            <div className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mb-1">Satellite Navigation</div>
                            <div className="text-3xl font-black text-white tracking-tighter tabular-nums">
                                {cameraState.lat.toFixed(4)}°N {cameraState.lng.toFixed(4)}°E
                            </div>
                            <div className="flex gap-4 mt-3">
                                <div className="flex flex-col">
                                    <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Altitude</span>
                                    <span className="text-xs font-bold text-gray-300">{(cameraState.zoom * 1500).toFixed(0)}m</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Pitch</span>
                                    <span className="text-xs font-bold text-gray-300">{cameraState.pitch.toFixed(1)}°</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Bearing</span>
                                    <span className="text-xs font-bold text-gray-300">{cameraState.bearing.toFixed(1)}°</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Dynamic Warning System */}
                {showWarningSystem && cameraState.pitch > 60 && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-900/80 backdrop-blur-lg border-2 border-red-500 p-8 rounded-xl shadow-[0_0_50px_rgba(239,68,68,0.5)] flex flex-col items-center">
                        <div className="text-red-400 text-sm font-black uppercase tracking-[0.5em] mb-2 animate-pulse">Warning</div>
                        <div className="text-white text-4xl font-black uppercase tracking-wider">Low Altitude</div>
                        <div className="text-red-200 mt-2 text-sm">PITCH ANGLE CRITICAL ({cameraState.pitch.toFixed(1)}°)</div>
                    </div>
                )}

                {/* REC Indicator */}
                <div className="absolute top-12 right-12 flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl">
                    <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
                    <span className="text-xs text-white font-black tracking-[0.2em] uppercase">Recording System Active</span>
                </div>

                {/* Grid Elements */}
                <div className="absolute inset-0 border-[20px] border-white/5 opacity-20 pointer-events-none" />
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/5" />
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/5" />

                {/* Bottom Timeline Progress */}
                <div className="absolute bottom-12 left-12 right-12">
                    <div className="flex justify-between items-end mb-4">
                        <div className="bg-black/90 backdrop-blur-xl p-5 border-b-4 border-yellow-500 shadow-2xl">
                            <div className="text-[10px] text-yellow-500 font-black uppercase tracking-[0.4em] mb-2">Alpha Render Engine</div>
                            <div className="flex items-baseline gap-4">
                                <span className="text-2xl font-black text-white font-mono tracking-tighter">
                                    {Math.floor(frame / fps).toString().padStart(2, '0')}:
                                    {Math.floor((frame % fps) * (100 / fps)).toString().padStart(2, '0')}
                                </span>
                                <span className="text-gray-500 font-bold text-xs">/ Frame {frame.toString().padStart(4, '0')}</span>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                            <div className="flex gap-2">
                                <div className="bg-blue-600/20 text-blue-400 text-[8px] px-2 py-0.5 rounded border border-blue-500/30 font-black uppercase">4K RAW</div>
                                <div className="bg-gray-800/50 text-gray-400 text-[8px] px-2 py-0.5 rounded border border-white/10 font-black uppercase">60 FPS</div>
                            </div>
                            <div className="text-[10px] font-mono text-white/40 tracking-widest">MAPS_V3_DOCUMENTARY_EXPORT</div>
                        </div>
                    </div>
                    <div className="h-2 bg-gray-900/80 w-full overflow-hidden rounded-full border border-white/5 p-[2px]">
                        <div
                            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all duration-75 ease-linear rounded-full"
                            style={{ width: `${(frame / (useVideoConfig().durationInFrames || 1)) * 100}%` }}
                        />
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill >
    );
};


