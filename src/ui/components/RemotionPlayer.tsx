import React from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { MapComposition } from '../../remotion/MapComposition';
import { useAppStore } from '../../store/useAppStore';

export const RemotionPlayer: React.FC = () => {
    const { keyframes, mapboxToken, fps, durationInFrames, width, height, currentTime, setCurrentTime, mapStyle, overlayData, projection, showDataCounters, showWarningSystem } = useAppStore();
    const playerRef = React.useRef<PlayerRef>(null);

    // Sync Store -> Player (when clicking keyframes or scrubbing timeline)
    React.useEffect(() => {
        if (playerRef.current) {
            const playerFrame = playerRef.current.getCurrentFrame();
            if (Math.abs(playerFrame - currentTime) > 0.5) {
                playerRef.current.seekTo(currentTime);
            }
        }
    }, [currentTime]);

    return (
        <div className="w-full h-full bg-black flex items-center justify-center">
            {mapboxToken ? (
                <Player
                    ref={playerRef}
                    component={MapComposition as any}
                    durationInFrames={durationInFrames}
                    compositionWidth={width}
                    compositionHeight={height}
                    fps={fps}
                    controls
                    loop
                    {...({
                        onFrameUpdate: (frame: number) => {
                            if (Math.abs(currentTime - frame) > 0.1) {
                                setCurrentTime(frame);
                            }
                        }
                    } as any)}
                    inputProps={{
                        keyframes,
                        mapboxToken,
                        mapStyle,
                        overlayData,
                        projection,
                        showDataCounters,
                        showWarningSystem,
                        durationInFrames,
                        fps,
                        width,
                        height
                    }}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                />
            ) : (
                <div className="text-white">Please enter Mapbox Token</div>
            )}
        </div>
    );
};
