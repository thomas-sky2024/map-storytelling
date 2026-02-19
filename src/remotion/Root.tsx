import React from 'react';
import { Composition } from 'remotion';
import { MapComposition } from './MapComposition';
import '../index.css'; // Ensure Tailwind is loaded

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="MapAnimation"
                component={MapComposition as any}
                durationInFrames={300} // Fallback
                fps={30} // Fallback
                width={1920} // Fallback
                height={1080} // Fallback
                defaultProps={{
                    keyframes: [],
                    mapboxToken: '',
                    durationInFrames: 300,
                    fps: 30,
                    width: 1920,
                    height: 1080
                }}
                calculateMetadata={async ({ props }) => {
                    return {
                        durationInFrames: (props as any).durationInFrames || 300,
                        fps: (props as any).fps || 30,
                        width: (props as any).width || 1920,
                        height: (props as any).height || 1080
                    };
                }}
            />
        </>
    );
};
