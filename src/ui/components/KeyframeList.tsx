import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Trash2, Crosshair, Clock } from 'lucide-react';

export const KeyframeList: React.FC = () => {
    const { keyframes, removeKeyframe, triggerFlyTo, setCurrentTime } = useAppStore();

    if (keyframes.length === 0) {
        return (
            <div className="text-center py-8 border-2 border-dashed border-gray-800 rounded-lg">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">No Keyframes Captured</p>
                <p className="text-[9px] text-gray-600 mt-1">Move the map and click "Capture Frame"</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {keyframes.map((kf, index) => (
                <div
                    key={kf.id}
                    className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-3 hover:border-blue-500/50 transition-all group"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 bg-yellow-500 rotate-45 border border-gray-900" />
                            <span className="text-[10px] font-black text-white uppercase tracking-tighter">
                                Keyframe {index + 1}
                            </span>
                        </div>
                        <button
                            onClick={() => removeKeyframe(kf.id)}
                            className="text-gray-600 hover:text-red-500 transition-colors p-1"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                        <div className="flex flex-col">
                            <span className="text-[8px] text-gray-600 uppercase font-bold tracking-tighter flex items-center gap-1">
                                <Clock size={8} /> Frame
                            </span>
                            <span className="text-[10px] font-mono text-blue-400">{kf.frame.toString().padStart(4, '0')}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] text-gray-600 uppercase font-bold tracking-tighter flex items-center gap-1">
                                <Crosshair size={8} /> Zoom
                            </span>
                            <span className="text-[10px] font-mono text-gray-400">{kf.camera.zoom.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex flex-col mb-3">
                        <span className="text-[8px] text-gray-600 uppercase font-bold tracking-tighter">Coordinates</span>
                        <span className="text-[9px] font-mono text-gray-500 truncate">
                            {kf.camera.lat.toFixed(4)}°N, {kf.camera.lng.toFixed(4)}°E
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <span className="text-[8px] text-gray-600 uppercase font-bold tracking-tighter">Pitch</span>
                            <span className="text-[10px] font-mono text-gray-400">{kf.camera.pitch.toFixed(1)}°</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] text-gray-600 uppercase font-bold tracking-tighter">Bearing</span>
                            <span className="text-[10px] font-mono text-gray-400">{kf.camera.bearing.toFixed(1)}°</span>
                        </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-700/30 flex gap-2">
                        <button
                            onClick={() => {
                                setCurrentTime(kf.frame);
                                triggerFlyTo(kf.camera);
                            }}
                            className="flex-1 bg-gray-700/50 hover:bg-blue-600 text-[9px] font-bold py-1 rounded transition-colors uppercase tracking-widest text-gray-300 hover:text-white"
                        >
                            Jump to Frame
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
