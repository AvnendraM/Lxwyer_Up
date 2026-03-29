import React from 'react';

// Static orbs — no mouse tracking, no framer-motion transforms.
// blur(60px) on large elements is the #1 paint cost, so we use
// a smaller blur and fewer orbs to stay smooth.
const ORBS = [
    { color: 'rgba(59,130,246,0.18)', size: '40vw', top: 5, left: 20, anim: 'orbFloat1 26s ease-in-out infinite' },
    { color: 'rgba(37,99,235,0.11)', size: '38vw', top: 60, left: 55, anim: 'orbFloat3 30s ease-in-out infinite' },
];

export const GradientOrbs = () => (
    <div
        className="dark:opacity-0 transition-opacity duration-700"
        style={{
            position: 'fixed', top: 0, left: 0,
            width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
            willChange: 'opacity',
        }}
    >
        {ORBS.map((orb, i) => (
            <div
                key={i}
                style={{
                    position: 'absolute',
                    top: `${orb.top}%`,
                    left: `${orb.left}%`,
                    width: orb.size,
                    height: orb.size,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
                    filter: 'blur(40px)',
                    animation: orb.anim,
                    willChange: 'transform',
                    transform: 'translateZ(0)',
                }}
            />
        ))}
    </div>
);
