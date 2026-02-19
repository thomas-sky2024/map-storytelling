import { Config } from '@remotion/cli/config';

// Fix for WebGL on Apple Silicon (M1/M2)
// Using 'angle' backend resolves "Failed to initialize WebGL"
Config.setChromiumOpenGlRenderer('angle');
Config.setDelayRenderTimeoutInMilliseconds(90000);
Config.setPixelFormat('yuv444p10le');

console.log('Remotion config loaded: Optimized for macOS Apple Silicon.');
