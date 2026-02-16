import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const Orb = ({ orb, mouseX, mouseY }) => {
    const x = useTransform(mouseX, [0, 1], [orb.parallax, -orb.parallax]);
    const y = useTransform(mouseY, [0, 1], [orb.parallax, -orb.parallax]);

    return (
        <motion.div
            style={{
                position: 'absolute',
                top: `${orb.baseTop}%`,
                left: `${orb.baseLeft}%`,
                width: orb.size,
                height: orb.size,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
                filter: 'blur(60px)',
                animation: orb.anim,
                x,
                y
            }}
        />
    );
};

export const GradientOrbs = () => {
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    useEffect(() => {
        const handleMove = (e) => {
            mouseX.set(e.clientX / window.innerWidth);
            mouseY.set(e.clientY / window.innerHeight);
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, [mouseX, mouseY]);

    const orbs = [
        // Hero area – large orbs
        { color: 'rgba(59,130,246,0.25)', size: '50vw', baseTop: 5, baseLeft: 20, parallax: 35, anim: 'orbFloat1 20s ease-in-out infinite' },
        { color: 'rgba(96,165,250,0.18)', size: '40vw', baseTop: 2, baseLeft: 60, parallax: -25, anim: 'orbFloat2 24s ease-in-out infinite' },
        { color: 'rgba(147,197,253,0.15)', size: '35vw', baseTop: 10, baseLeft: -5, parallax: 20, anim: 'orbFloat3 22s ease-in-out infinite' },
        // Mid page
        { color: 'rgba(37,99,235,0.15)', size: '45vw', baseTop: 30, baseLeft: 50, parallax: -30, anim: 'orbFloat1 26s ease-in-out infinite' },
        { color: 'rgba(59,130,246,0.12)', size: '40vw', baseTop: 45, baseLeft: -10, parallax: 25, anim: 'orbFloat2 28s ease-in-out infinite' },
        { color: 'rgba(96,165,250,0.18)', size: '50vw', baseTop: 65, baseLeft: 30, parallax: -20, anim: 'orbFloat3 18s ease-in-out infinite' },
    ];

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
            {orbs.map((orb, i) => (
                <Orb key={i} orb={orb} mouseX={mouseX} mouseY={mouseY} />
            ))}
        </div>
    );
};
