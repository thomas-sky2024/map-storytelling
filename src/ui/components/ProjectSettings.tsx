import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const ProjectSettings: React.FC = () => {
    const {
        fps, width, height, durationInFrames,
        currentCamera, setCurrentCamera,
        setFPS, setDimensions, setDuration
    } = useAppStore();

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs text-gray-500 uppercase font-bold">FPS</label>
                    <input
                        type="number"
                        value={fps}
                        onChange={(e) => setFPS(Number(e.target.value))}
                        className="w-full bg-gray-950 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300 focus:border-blue-500 outline-none"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-gray-500 uppercase font-bold">Duration (Frames)</label>
                    <input
                        type="number"
                        value={durationInFrames}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full bg-gray-950 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300 focus:border-blue-500 outline-none"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-gray-500 uppercase font-bold">Width</label>
                    <input
                        type="number"
                        value={width}
                        onChange={(e) => setDimensions(Number(e.target.value), height)}
                        className="w-full bg-gray-950 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300 focus:border-blue-500 outline-none"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-gray-500 uppercase font-bold">Height</label>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => setDimensions(width, Number(e.target.value))}
                        className="w-full bg-gray-950 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300 focus:border-blue-500 outline-none"
                    />
                </div>
            </div>

            <div className="pt-2 border-t border-gray-800 space-y-4">
                <h4 className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Active Camera</h4>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-600 uppercase font-bold flex justify-between">
                            <span>Pitch</span>
                            <span className="text-gray-400 font-mono">{currentCamera.pitch.toFixed(0)}°</span>
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={85}
                            value={currentCamera.pitch}
                            onChange={(e) => setCurrentCamera({ ...currentCamera, pitch: Number(e.target.value) })}
                            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-600 uppercase font-bold flex justify-between">
                            <span>Bearing</span>
                            <span className="text-gray-400 font-mono">{currentCamera.bearing.toFixed(0)}°</span>
                        </label>
                        <input
                            type="range"
                            min={-180}
                            max={180}
                            value={currentCamera.bearing}
                            onChange={(e) => setCurrentCamera({ ...currentCamera, bearing: Number(e.target.value) })}
                            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                </div>

                <div className='text-[10px] text-gray-500 flex justify-between'>
                    <span>Total Duration: {(durationInFrames / fps).toFixed(2)}s</span>
                    <span className="font-mono text-gray-600">v1.2-ALPHA</span>
                </div>
            </div>
        </div>
    );
};
