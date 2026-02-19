import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Plus, Trash2 } from 'lucide-react';

export const Timeline: React.FC = () => {
    const {
        durationInFrames,
        currentTime,
        keyframes,
        setCurrentTime,
        addKeyframe,
        currentCamera,
        removeKeyframe,
        triggerFlyTo
    } = useAppStore();

    const handleAddKeyframe = () => {
        addKeyframe({
            id: crypto.randomUUID(),
            frame: currentTime,
            camera: { ...currentCamera },
            durationToNext: 60, // Default 2s gap
            easing: 'ease-in-out',
            label: `Keyframe ${keyframes.length + 1}`
        });
    };

    const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentTime(parseInt(e.target.value));
    };

    return (
        <div className="flex flex-col h-full bg-gray-950 border-t border-gray-800">
            {/* Controls Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900/50 backdrop-blur">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Time</span>
                        <span className="text-xs font-mono text-blue-400 font-bold">
                            {currentTime.toString().padStart(4, '0')} / {durationInFrames}
                        </span>
                    </div>

                    <div className="h-6 w-[1px] bg-gray-800" />

                    <div className="hidden lg:flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Lng / Lat</span>
                            <span className="text-[10px] font-mono text-gray-400">
                                {currentCamera.lng.toFixed(4)} / {currentCamera.lat.toFixed(4)}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Zoom / Pitch</span>
                            <span className="text-[10px] font-mono text-gray-400">
                                {currentCamera.zoom.toFixed(2)} / {currentCamera.pitch}°
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            if (confirm('Clear all keyframes?')) {
                                keyframes.forEach(k => removeKeyframe(k.id));
                            }
                        }}
                        className="text-gray-600 hover:text-red-400 p-1.5 transition-colors"
                        title="Clear All"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        onClick={handleAddKeyframe}
                        className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                    >
                        <Plus size={14} /> CAPTURE FRAME
                    </button>
                </div>
            </div>

            {/* Timeline Track */}
            <div className="relative flex-1 w-full overflow-hidden px-4 py-6">
                {/* Visual Grid */}
                <div className="absolute inset-x-4 top-10 bottom-10 flex justify-between pointer-events-none opacity-10">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="w-[1px] h-full bg-white" />
                    ))}
                </div>

                {/* Scrubber Input (Invisible but interactive) */}
                <input
                    type="range"
                    min={0}
                    max={durationInFrames}
                    value={currentTime}
                    onChange={handleScrubberChange}
                    className="absolute inset-x-4 top-0 bottom-0 w-[calc(100%-32px)] opacity-0 z-20 cursor-crosshair"
                />

                {/* Visualization */}
                <div className="relative w-full h-12 bg-gray-900 rounded-xl mt-2 border border-blue-500/10 overflow-visible group">
                    {/* Keyframe Markers */}
                    {keyframes.map(kf => {
                        const left = (kf.frame / durationInFrames) * 100;
                        return (
                            <div
                                key={kf.id}
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-500 rotate-45 z-10 hover:bg-white transition-all cursor-pointer shadow-lg shadow-yellow-500/20 border-2 border-gray-900"
                                style={{ left: `calc(${left}% - 8px)` }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentTime(kf.frame);
                                    triggerFlyTo(kf.camera);
                                }}
                            >
                                <div className="absolute -rotate-45 top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-[10px] px-2 py-1 rounded border border-gray-700 opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none text-yellow-500 font-bold uppercase tracking-tighter shadow-2xl">
                                    Capture @ {kf.frame}
                                </div>
                            </div>
                        );
                    })}

                    {/* Playhead */}
                    <div
                        className="absolute top-[-20px] bottom-[-20px] w-[2px] bg-blue-500 z-10 pointer-events-none transition-all duration-75 ease-linear shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        style={{ left: `${(currentTime / durationInFrames) * 100}%` }}
                    >
                        <div className="absolute top-0 -left-[5px] w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
                        <div className="absolute bottom-0 -left-[5px] w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
                    </div>
                </div>
            </div>
        </div>
    );
};
