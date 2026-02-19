import React, { useState } from 'react';
import { X, Download, Terminal, Copy, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const RenderModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const store = useAppStore();
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleDownloadConfig = () => {
        const config = {
            keyframes: store.keyframes,
            mapboxToken: store.mapboxToken,
            mapStyle: store.mapStyle,
            overlayData: store.overlayData,
            projection: store.projection,
            durationInFrames: store.durationInFrames,
            fps: store.fps,
            width: store.width,
            height: store.height
        };

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'map-config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950/50">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Terminal size={20} className="text-blue-500" />
                        Export Video
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
                        <p className="font-semibold mb-1">Rendering Instructions</p>
                        <p className="opacity-80">
                            To ensure high-quality 4K export, please run the render command in your terminal.
                            <br /><br />
                            <span className="text-yellow-400 font-bold">Tip:</span> If the camera moves too fast or map is blurry, increase <b>Duration (Frames)</b> in Project Settings.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0 border border-gray-700 font-bold text-gray-400">1</div>
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-white mb-1">Download Project Configuration</h3>
                                <p className="text-xs text-gray-500 mb-3">Save your scene data to the project root folder as <code>map-config.json</code>.</p>
                                <button
                                    onClick={handleDownloadConfig}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-bold transition-all border border-gray-700 hover:border-gray-600 w-full justify-center"
                                >
                                    <Download size={14} /> DOWNLOAD map-config.json
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0 border border-gray-700 font-bold text-gray-400">2</div>
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-white mb-1">Open in Remotion Studio (Recommended)</h3>
                                <p className="text-xs text-gray-500 mb-2">Visually inspect frames and render with a GUI.</p>
                                <div className="relative group mb-4">
                                    <div className="bg-black border border-gray-800 rounded-lg p-3 pr-10 font-mono text-[10px] text-green-400 break-all">
                                        npx remotion studio src/remotion/index.ts --props=./map-config.json
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText("npx remotion studio src/remotion/index.ts --props=./map-config.json");
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }}
                                        className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-white bg-gray-900 hover:bg-gray-800 rounded border border-gray-700 transition-all"
                                        title="Copy to clipboard"
                                    >
                                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                    </button>
                                </div>

                                <h3 className="text-sm font-bold text-white mb-1">Or Render via Command Line</h3>
                                <p className="text-xs text-gray-500 mb-2">Use concurrency=1 to prevent WebGL contexts from crashing.</p>
                                <div className="relative group">
                                    <div className="bg-black border border-gray-800 rounded-lg p-3 pr-10 font-mono text-[10px] text-green-400 break-all">
                                        npx remotion render src/remotion/index.ts MapAnimation out/video.mp4 --props=./map-config.json --concurrency=1
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText("npx remotion render src/remotion/index.ts MapAnimation out/video.mp4 --props=./map-config.json --concurrency=1");
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }}
                                        className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-white bg-gray-900 hover:bg-gray-800 rounded border border-gray-700 transition-all"
                                        title="Copy to clipboard"
                                    >
                                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-800 text-center">
                        <p className="text-[10px] text-gray-500">
                            The video will be saved to <span className="text-gray-300 font-mono">out/video.mp4</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
