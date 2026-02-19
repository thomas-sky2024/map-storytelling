import React, { useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Upload, FileJson, X } from 'lucide-react';

export const LayerManager: React.FC = () => {
    const { overlayData, setOverlayData } = useAppStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                // Simple validation
                if (json.type === 'FeatureCollection' || json.type === 'Feature') {
                    setOverlayData(json);
                } else {
                    alert("Invalid GeoJSON format");
                }
            } catch (err) {
                alert("Failed to parse JSON");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-2">
            {!overlayData ? (
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept=".json,.geojson"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-700 rounded-lg hover:border-gray-500 hover:bg-gray-800/50 transition-colors text-gray-500 text-xs"
                    >
                        <Upload size={16} />
                        <span>Import GeoJSON</span>
                    </button>
                </div>
            ) : (
                <div className="bg-gray-800 rounded p-2 flex items-center justify-between border border-gray-700">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <FileJson size={14} className="text-yellow-500 shrink-0" />
                        <span className="text-xs text-gray-300 truncate">Overlay Data</span>
                    </div>
                    <button
                        onClick={() => setOverlayData(null)}
                        className="text-gray-500 hover:text-red-400 p-1"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}
        </div>
    );
};
