import React, { useState } from 'react';
import { Search, Loader2, MapPin } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface SearchResult {
    id: string;
    place_name: string;
    center: [number, number];
    bbox?: [number, number, number, number];
}

export const LocationSearch: React.FC<{ mapboxToken: string }> = ({ mapboxToken }) => {
    const { triggerFlyTo, setMode } = useAppStore();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || !mapboxToken) return;

        setLoading(true);
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&types=place,locality,neighborhood,address,poi,country,region`
            );
            const data = await response.json();
            if (data.features) {
                setResults(data.features);
                setIsOpen(true);
            }
        } catch (error) {
            console.error("Geocoding error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (result: SearchResult) => {
        // Switch to editor mode to ensure map is mounted and can fly
        setMode('edit');

        triggerFlyTo({
            lng: result.center[0],
            lat: result.center[1],
            zoom: 10,
            pitch: 0,
            bearing: 0
        });
        setIsOpen(false);
        setResults([]);
        setQuery(result.place_name);
    };

    return (
        <div className="relative">
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search location..."
                    className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 pl-9 text-xs focus:border-blue-500 outline-none transition-all placeholder:text-gray-600 text-white"
                />
                <button type="submit" className="absolute left-2.5 top-2 text-gray-500 hover:text-blue-400">
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                </button>
            </form>

            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto custom-scrollbar">
                    {results.map((result) => (
                        <button
                            key={result.id}
                            onClick={() => handleSelect(result)}
                            className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-gray-700/50 hover:text-white flex items-start gap-2 border-b border-gray-700/50 last:border-0"
                        >
                            <MapPin size={12} className="mt-0.5 shrink-0 text-blue-500" />
                            <span className="line-clamp-2">{result.place_name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
