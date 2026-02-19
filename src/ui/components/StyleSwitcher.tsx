import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Layers, Map as MapIcon, Moon, Sun } from 'lucide-react';

const STYLES = [
    { name: 'Dark', url: 'mapbox://styles/mapbox/dark-v11', icon: Moon },
    { name: 'Satellite', url: 'mapbox://styles/mapbox/satellite-v9', icon: Layers },
    { name: 'Light', url: 'mapbox://styles/mapbox/light-v11', icon: Sun },
    { name: 'Outdoors', url: 'mapbox://styles/mapbox/outdoors-v12', icon: MapIcon },
];

export const StyleSwitcher: React.FC = () => {
    const { mapStyle, setMapStyle, projection, setProjection } = useAppStore();

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
                {STYLES.map((style) => (
                    <button
                        key={style.name}
                        onClick={() => setMapStyle(style.url)}
                        className={`flex items-center gap-2 p-2 rounded text-xs transition-all border ${mapStyle === style.url
                            ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/20 scale-[1.02]'
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                            }`}
                    >
                        <style.icon size={12} />
                        {style.name}
                    </button>
                ))}
            </div>

            <div className="pt-2 border-t border-gray-700">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1">Projection</h4>
                <div className="flex bg-gray-900 p-1 rounded-lg border border-gray-700">
                    <button
                        onClick={() => setProjection('globe')}
                        className={`flex-1 py-1 text-[10px] rounded transition-colors ${projection === 'globe' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Globe (3D)
                    </button>
                    <button
                        onClick={() => setProjection('mercator')}
                        className={`flex-1 py-1 text-[10px] rounded transition-colors ${projection === 'mercator' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Mercator (2D)
                    </button>
                </div>
            </div>

            <div className="pt-2">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-1 ml-1">Custom Style</h4>
                <input
                    type="text"
                    placeholder="mapbox://styles/..."
                    className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-1.5 text-[10px] text-gray-300 focus:border-blue-500 outline-none transition-all"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            setMapStyle(e.currentTarget.value);
                        }
                    }}
                />
            </div>
        </div>
    );
};
