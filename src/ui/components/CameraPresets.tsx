import React from 'react';
import { Camera, Globe, LocateFixed, Plane, Building2 } from 'lucide-react';
import { useAppStore, CameraState } from '../../store/useAppStore';

const PRESETS: { name: string; icon: React.ElementType; camera: Partial<CameraState>; useCurrentLocation?: boolean }[] = [
    {
        name: 'Global View',
        icon: Globe,
        camera: { lng: 0, lat: 20, zoom: 1.5, pitch: 0, bearing: 0 }
    },
    {
        name: 'Cinematic Orbit',
        icon: Camera,
        camera: { zoom: 13, pitch: 60, bearing: -45 },
        useCurrentLocation: true
    },
    {
        name: 'Top-Down Analysis',
        icon: LocateFixed,
        camera: { zoom: 14, pitch: 0, bearing: 0 },
        useCurrentLocation: true
    },
    {
        name: 'Low Flyover',
        icon: Plane,
        camera: { zoom: 15.5, pitch: 70, bearing: 90 },
        useCurrentLocation: true
    },
    {
        name: 'Urban Reveal',
        icon: Building2,
        camera: { lng: -74.006, lat: 40.7128, zoom: 15.5, pitch: 75, bearing: -20 }
    }
];

export const CameraPresets: React.FC = () => {
    const { currentCamera, triggerFlyTo } = useAppStore();

    const applyPreset = (preset: typeof PRESETS[0]) => {
        const targetCamera = {
            ...currentCamera, // Base on current
            ...preset.camera, // Override with preset
            // If explicit location needed, it comes from preset.camera
            // If current location needed, it comes from currentCamera
        };

        if (preset.useCurrentLocation) {
            targetCamera.lng = currentCamera.lng;
            targetCamera.lat = currentCamera.lat;
        }

        triggerFlyTo(targetCamera as CameraState);
    };

    return (
        <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((preset) => (
                <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="flex items-center gap-2 p-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded text-xs text-gray-300 transition-all group text-left"
                >
                    <preset.icon size={14} className="text-gray-500 group-hover:text-blue-400" />
                    <span>{preset.name}</span>
                </button>
            ))}
        </div>
    );
};
