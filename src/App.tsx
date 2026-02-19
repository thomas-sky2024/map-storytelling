import { useState } from 'react';
import { RemotionPlayer } from './ui/components/RemotionPlayer';
import { MapComponent } from './ui/components/MapComponent';
import { Timeline } from './ui/components/Timeline';
import { StyleSwitcher } from './ui/components/StyleSwitcher';
import { LayerManager } from './ui/components/LayerManager';
import { CameraPresets } from './ui/components/CameraPresets';
import { LocationSearch } from './ui/components/LocationSearch';
import { ProjectSettings } from './ui/components/ProjectSettings';
import { KeyframeList } from './ui/components/KeyframeList';
import { RenderModal } from './ui/components/RenderModal';
import { Settings, Save, MapIcon, Layers, Search, Download, Video } from 'lucide-react';
import { useAppStore } from './store/useAppStore';

function App() {
  const {
    mapboxToken,
    setMapboxToken,
    mode,
    setMode,
    mapStyle,
    projection,
    currentCamera,
    setCurrentCamera,
  } = useAppStore();

  const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-white overflow-hidden font-sans">
      <RenderModal isOpen={isRenderModalOpen} onClose={() => setIsRenderModalOpen(false)} />

      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col z-20 shadow-xl">
        <div className="p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
              <MapIcon size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wide text-white">MAP ENGINE</h1>
              <div className="text-[10px] text-blue-400 font-mono tracking-wider">PRO WEB EDITION</div>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-6">
          {!mapboxToken && (
            <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg animate-pulse-slow">
              <h3 className="text-sm font-semibold text-red-200 mb-2 flex items-center gap-2">
                <Settings size={14} /> Setup Required
              </h3>
              <input
                type="text"
                value={mapboxToken}
                autoComplete="off"
                placeholder="Paste Mapbox Public Token"
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-gray-600"
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <p className="text-[10px] text-gray-500 mt-2">
                Get one at <a href="https://mapbox.com" target="_blank" className="underline hover:text-blue-400">mapbox.com</a>
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-gray-700/20 p-3 rounded-lg border border-gray-700/50">
              <h3 className="text-xs font-bold uppercase text-gray-500 mb-3 ml-1 flex items-center gap-2"><Settings size={12} /> Render Settings</h3>
              <ProjectSettings />
            </div>

            <div className="bg-gray-700/20 p-3 rounded-lg border border-gray-700/50">
              <h3 className="text-xs font-bold uppercase text-gray-500 mb-3 ml-1 flex items-center gap-2"><Search size={12} /> Location</h3>
              <LocationSearch mapboxToken={mapboxToken} />
            </div>

            <div className="bg-gray-700/20 p-3 rounded-lg border border-gray-700/50">
              <h3 className="text-xs font-bold uppercase text-gray-500 mb-3 ml-1 flex items-center gap-2"><Layers size={12} /> Map Style</h3>
              <StyleSwitcher />
            </div>

            <div className="bg-gray-700/20 p-3 rounded-lg border border-gray-700/50">
              <h3 className="text-xs font-bold uppercase text-gray-500 mb-3 ml-1">Camera Presets</h3>
              <CameraPresets />
            </div>

            <div className="bg-gray-700/20 p-3 rounded-lg border border-gray-700/50">
              <h3 className="text-xs font-bold uppercase text-gray-500 mb-3 ml-1 flex items-center gap-2"><Video size={12} /> Keyframes</h3>
              <KeyframeList />
            </div>

            <div className="bg-gray-700/20 p-3 rounded-lg border border-gray-700/50">
              <h3 className="text-xs font-bold uppercase text-gray-500 mb-3 ml-1">Overlays</h3>
              <LayerManager />
            </div>
          </div>
        </div>

        <div className="h-48 border-t border-gray-700 bg-gray-900 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)]">
          <Timeline />
        </div>
      </div>

      <div className="flex-1 relative bg-black">
        <div className="absolute top-4 left-4 z-50 flex gap-4">
          <div className="flex bg-gray-900/80 backdrop-blur p-1 rounded-xl border border-gray-700 shadow-2xl">
            <button
              onClick={() => setMode('edit')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${mode === 'edit' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <Settings size={14} /> EDITOR
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${mode === 'preview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <Save size={14} /> PREVIEW
            </button>
          </div>

          <button
            onClick={() => setIsRenderModalOpen(true)}
            className="bg-gray-900/80 hover:bg-green-600/90 backdrop-blur px-4 py-1.5 rounded-xl border border-gray-700 hover:border-green-500 shadow-2xl text-xs font-bold transition-all flex items-center gap-2 text-green-400 hover:text-white group"
          >
            <Download size={14} className="group-hover:animate-bounce" /> EXPORT VIDEO
          </button>
        </div>

        {mapboxToken ? (
          mode === 'edit' ? (
            <MapComponent
              accessToken={mapboxToken}
              style={mapStyle}
              projection={projection}
              viewState={currentCamera} // Sync with sidebar sliders
              onCameraChange={setCurrentCamera}
              className="w-full h-full"
            />
          ) : (
            <RemotionPlayer />
          )
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-950">
            <div className="text-center p-8 max-w-sm">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-gray-800">
                <MapIcon size={32} className="text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">Map Engine Web</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Please enter your Mapbox Public Token in the sidebar to initialize the 3D cinematic renderer.
              </p>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}

export default App;
