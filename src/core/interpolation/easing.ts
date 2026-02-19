// Easing functions
// t is a value between 0 and 1

export const Easing = {
    linear: (t: number) => t,

    easeInQuad: (t: number) => t * t,
    easeOutQuad: (t: number) => t * (2 - t),
    easeInOutQuad: (t: number) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

    easeInCubic: (t: number) => t * t * t,
    easeOutCubic: (t: number) => (--t) * t * t + 1,
    easeInOutCubic: (t: number) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

    // Add more as needed
};

export type EasingType = keyof typeof Easing;
