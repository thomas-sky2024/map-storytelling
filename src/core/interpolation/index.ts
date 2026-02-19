import { CameraState, Keyframe } from '../../store/useAppStore';
import { Easing } from './easing';


// Helper for linear interpolation
const lerp = (start: number, end: number, t: number) => {
    return start * (1 - t) + end * t;
};

// Helper for bearing interpolation (shortest path)
const lerpBearing = (start: number, end: number, t: number) => {
    const diff = end - start;
    const delta = ((diff + 540) % 360) - 180; // Normalize to -180 to 180
    return start + delta * t;
};

// Helper for coordinate interpolation (Basic Linear for now, upgrading to Great Circle later if needed)
// Note: Mapbox's LngLat has built-in methods, but we might run this in Node environment for Remotion
// so we should keep it pure math if possible, or use mapbox-gl if available.
// For now, simple linear interpolation of LngLat is "okay" for short distances, 
// but for world-scale, we need spherical interpolation.

const lerpLngLat = (startLng: number, startLat: number, endLng: number, endLat: number, t: number) => {
    // Simple linear for V1. 
    // TODO: Upgrade to spherical interpolation (slerp)
    return {
        lng: lerp(startLng, endLng, t),
        lat: lerp(startLat, endLat, t)
    };
};


export const interpolateCamera = (
    frame: number,
    keyframes: Keyframe[]
): CameraState | null => {
    if (keyframes.length === 0) return null;

    // Sort keyframes just in case
    const sortedFrames = [...keyframes].sort((a, b) => a.frame - b.frame);

    // 1. Before first frame
    if (frame <= sortedFrames[0].frame) {
        return sortedFrames[0].camera;
    }

    // 2. After last frame
    if (frame >= sortedFrames[sortedFrames.length - 1].frame) {
        return sortedFrames[sortedFrames.length - 1].camera;
    }

    // 3. Between frames
    // Find the keyframe *before* the current frame
    let startIndex = 0;
    for (let i = 0; i < sortedFrames.length - 1; i++) {
        if (sortedFrames[i].frame <= frame && sortedFrames[i + 1].frame > frame) {
            startIndex = i;
            break;
        }
    }

    // Fallback if not found (should be covered by boundary checks)
    if (frame > sortedFrames[sortedFrames.length - 1].frame) {
        startIndex = sortedFrames.length - 1;
    }

    const startKeyframe = sortedFrames[startIndex];
    const endKeyframe = sortedFrames[startIndex + 1];

    if (!startKeyframe || !endKeyframe) return null;

    // Calculate local progress (t)
    const duration = endKeyframe.frame - startKeyframe.frame;
    if (duration === 0) return startKeyframe.camera;

    const localFrame = frame - startKeyframe.frame;
    let t = localFrame / duration;

    // Apply easing
    let easingFn = Easing.linear;

    if (startKeyframe.easing === 'ease-in-out') {
        easingFn = Easing.easeInOutCubic;
    } else if (startKeyframe.easing === 'ease-out') {
        easingFn = Easing.easeOutCubic;
    } else if (startKeyframe.easing === 'custom') {
        // Placeholder for custom easing
        easingFn = Easing.easeInOutCubic;
    }

    t = easingFn(t);

    const pos = lerpLngLat(
        startKeyframe.camera.lng,
        startKeyframe.camera.lat,
        endKeyframe.camera.lng,
        endKeyframe.camera.lat,
        t
    );

    // Distance calculation for zoom arc (simple Euclidean approximation is fine for this visual scale)
    const dx = endKeyframe.camera.lng - startKeyframe.camera.lng;
    const dy = endKeyframe.camera.lat - startKeyframe.camera.lat;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Zoom Logic: Parabolic Arc
    // When moving large distances, zoom out in the middle (lower zoom value)
    const baseZoom = lerp(startKeyframe.camera.zoom, endKeyframe.camera.zoom, t);

    // Parabolic curve: 0 at t=0, 1 at t=0.5, 0 at t=1
    const arcHeight = 4 * t * (1 - t);

    // Zoom offset factor: The further the distance, the more we zoom out.
    // Factor 0.1 means for 10 degrees of movement, we zoom out 1 level.
    const zoomOffset = distance * 0.15;

    // Subtract offset because lower zoom level = higher altitude
    const finalZoom = baseZoom - (arcHeight * zoomOffset);

    return {
        lng: pos.lng,
        lat: pos.lat,
        zoom: finalZoom,
        pitch: lerp(startKeyframe.camera.pitch, endKeyframe.camera.pitch, t),
        bearing: lerpBearing(startKeyframe.camera.bearing, endKeyframe.camera.bearing, t)
    };
};
