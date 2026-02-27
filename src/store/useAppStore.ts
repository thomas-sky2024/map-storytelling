import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CameraState {
    lng: number;
    lat: number;
    zoom: number;
    pitch: number;
    bearing: number;
}

export interface Keyframe {
    id: string;
    frame: number; // Frame number in the timeline
    camera: CameraState;
    durationToNext: number; // Duration to next keyframe in frames (optional, used for spacing)
    easing: 'linear' | 'ease-in-out' | 'ease-out' | 'custom';
    label?: string;
}

interface AppState {
    // Project Settings
    fps: number;
    width: number;
    height: number;
    durationInFrames: number;

    // Editor State
    currentCamera: CameraState;
    mapStyle: string;
    overlayData: any | null; // GeoJSON
    showDataCounters: boolean;
    showWarningSystem: boolean;

    // Timeline
    currentTime: number; // Current frame
    isPlaying: boolean;
    keyframes: Keyframe[];

    // Actions
    setFPS: (fps: number) => void;
    setDimensions: (width: number, height: number) => void;
    setDuration: (frames: number) => void;
    setCurrentTime: (frame: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;

    setCurrentCamera: (camera: CameraState) => void;
    setMapStyle: (style: string) => void;
    setOverlayData: (data: any) => void;
    setShowDataCounters: (show: boolean) => void;
    setShowWarningSystem: (show: boolean) => void;

    addKeyframe: (keyframe: Keyframe) => void;
    updateKeyframe: (id: string, updates: Partial<Keyframe>) => void;
    removeKeyframe: (id: string) => void;
    sortKeyframes: () => void;
    flyToTarget: CameraState | null;
    triggerFlyTo: (target: CameraState) => void;
    clearFlyTo: () => void;
    mapboxToken: string;
    setMapboxToken: (token: string) => void;
    projection: 'globe' | 'mercator';
    setProjection: (projection: 'globe' | 'mercator') => void;
    mode: 'edit' | 'preview';
    setMode: (mode: 'edit' | 'preview') => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            fps: 30,
            width: 1920,
            height: 1080,
            durationInFrames: 300,

            currentCamera: { lng: 0, lat: 0, zoom: 0, pitch: 0, bearing: 0 },
            flyToTarget: null,
            mapStyle: 'mapbox://styles/mapbox/dark-v11',
            overlayData: null,
            showDataCounters: true,
            showWarningSystem: true,
            mapboxToken: '',
            projection: 'globe',
            mode: 'edit',

            currentTime: 0,
            isPlaying: false,
            keyframes: [],

            setFPS: (fps) => set({ fps }),
            setDimensions: (width, height) => set({ width, height }),
            setDuration: (durationInFrames) => set({ durationInFrames }),
            setCurrentTime: (currentTime) => set({ currentTime }),
            setIsPlaying: (isPlaying) => set({ isPlaying }),

            setCurrentCamera: (currentCamera) => set({ currentCamera }),
            setMapStyle: (mapStyle) => set({ mapStyle }),
            setOverlayData: (overlayData) => set({ overlayData }),
            setShowDataCounters: (showDataCounters) => set({ showDataCounters }),
            setShowWarningSystem: (showWarningSystem) => set({ showWarningSystem }),
            setMapboxToken: (mapboxToken) => set({ mapboxToken }),
            setProjection: (projection) => set({ projection }),
            setMode: (mode) => set({ mode }),

            triggerFlyTo: (target) => set({ flyToTarget: target }),
            clearFlyTo: () => set({ flyToTarget: null }),

            addKeyframe: (keyframe) => set((state) => {
                const newKeyframes = [...state.keyframes, keyframe].sort((a, b) => a.frame - b.frame);
                return { keyframes: newKeyframes };
            }),

            updateKeyframe: (id, updates) => set((state) => ({
                keyframes: state.keyframes.map((k) => k.id === id ? { ...k, ...updates } : k).sort((a, b) => a.frame - b.frame)
            })),

            removeKeyframe: (id) => set((state) => ({
                keyframes: state.keyframes.filter((k) => k.id !== id)
            })),

            sortKeyframes: () => set((state) => ({
                keyframes: [...state.keyframes].sort((a, b) => a.frame - b.frame)
            })),
        }),
        {
            name: 'map-engine-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                mapboxToken: state.mapboxToken,
                keyframes: state.keyframes,
                mapStyle: state.mapStyle,
                projection: state.projection,
                showDataCounters: state.showDataCounters,
                showWarningSystem: state.showWarningSystem
            }),
        }
    )
);
