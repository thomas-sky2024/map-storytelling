# 🗺️ Cinematic Map Engine

A professional-grade map animation tool built with **Remotion**, **Mapbox GL JS**, and **React**. Create cinematic, high-resolution (up to 4K) map flyovers with smooth camera interpolation and automated rendering.

![Remotion](https://img.shields.io/badge/Remotion-4.0-blue?style=flat-square)
![Mapbox](https://img.shields.io/badge/Mapbox-GL_JS_v3-black?style=flat-square)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square)

## ✨ Features

- **Cinematic Interpolation**: Smooth camera movements with "zoom arcs" for long-distance travel.
- **4K Ultra HD Support**: Optimized for high-resolution renders with per-frame loading safety.
- **Visual Editor**: Real-time preview with manual Pitch, Bearing, and Zoom controls.
- **Keyframe System**: Capture points in time and animate between them effortlessly.
- **Persistent Storage**: Remembers your Mapbox token and project state across sessions.
- **Stunning Overlays**: Built-in cinematic vignettes, grid overlays, and data-driven labels.

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/your-username/map-engine.git
cd map-engine
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment
Rename `.env.example` to `.env` and add your Mapbox token:
```env
VITE_MAPBOX_TOKEN=pk.your_token_here
```

### 4. Run the Editor
```bash
npm run dev
```

### 5. Render Video
```bash
# Render with default settings
npm run render

# Render with custom keyframes/props
npx remotion render src/remotion/index.ts MapAnimation out/output.mp4 --props=./map-config.json
```

## 🛠 Tech Stack

- **Framework**: [Remotion](https://www.remotion.dev/)
- **Map Engine**: [Mapbox GL JS v3](https://www.mapbox.com/mapbox-gl-js)
- **State**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 🍎 macOS M1/M2 Optimization

This project is configured specifically for **Apple Silicon GPU acceleration**. The `remotion.config.ts` uses the `angle` renderer to ensure WebGL contexts load correctly in headless Chromium environments.

## 📜 License

MIT
