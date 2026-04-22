"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

function createBeam(width, height) {
    const angle = -35 + Math.random() * 10;
    return {
        x: Math.random() * width * 1.5 - width * 0.25,
        y: Math.random() * height * 1.5 - height * 0.25,
        width: 30 + Math.random() * 60,
        length: height * 2.5,
        angle: angle,
        speed: 0.6 + Math.random() * 1.2,
        opacity: 0.12 + Math.random() * 0.16,
        hue: 190 + Math.random() * 70,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
    };
}

export function BeamsBackground({
    className,
    intensity = "strong",
    children
}) {
    const canvasRef = useRef(null);
    const beamsRef = useRef([]);
    const animationFrameRef = useRef(0);
    const isVisibleRef = useRef(true); // pause when scrolled off-screen
    const MINIMUM_BEAMS = 10;

    const opacityMap = {
        subtle: 0.7,
        medium: 0.85,
        strong: 1,
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const updateCanvasSize = () => {
            const isMobile = window.innerWidth <= 768;
            // Cap DPR to 1 on mobile to prevent extreme lag, 1.25 on desktop
            const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.25); 
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);

            const effectiveMinBeams = isMobile ? Math.floor(MINIMUM_BEAMS / 2.5) : Math.floor(MINIMUM_BEAMS / 1.5);
            const totalBeams = effectiveMinBeams * 1.5;
            beamsRef.current = Array.from({ length: totalBeams }, () =>
                createBeam(canvas.width, canvas.height)
            );
        };

        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);

        function resetBeam(beam, index, totalBeams) {
            if (!canvas) return beam;
            
            const column = index % 3;
            const spacing = canvas.width / 3;

            beam.y = canvas.height + 100;
            beam.x =
                column * spacing +
                spacing / 2 +
                (Math.random() - 0.5) * spacing * 0.5;
            beam.width = 100 + Math.random() * 100;
            beam.speed = 0.5 + Math.random() * 0.4;
            beam.hue = 190 + (index * 70) / totalBeams;
            beam.opacity = 0.2 + Math.random() * 0.1;
            return beam;
        }

        function drawBeam(ctx, beam) {
            ctx.save();
            ctx.translate(beam.x, beam.y);
            ctx.rotate((beam.angle * Math.PI) / 180);

            // Calculate pulsing opacity
            const pulsingOpacity =
                beam.opacity *
                (0.8 + Math.sin(beam.pulse) * 0.2) *
                opacityMap[intensity];

            ctx.globalAlpha = pulsingOpacity;

            // Cache gradient to avoid creating it every frame
            if (!beam.gradient) {
                const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
                gradient.addColorStop(0, `hsla(${beam.hue}, 85%, 65%, 0)`);
                gradient.addColorStop(0.1, `hsla(${beam.hue}, 85%, 65%, 0.5)`);
                gradient.addColorStop(0.4, `hsla(${beam.hue}, 85%, 65%, 1)`);
                gradient.addColorStop(0.6, `hsla(${beam.hue}, 85%, 65%, 1)`);
                gradient.addColorStop(0.9, `hsla(${beam.hue}, 85%, 65%, 0.5)`);
                gradient.addColorStop(1, `hsla(${beam.hue}, 85%, 65%, 0)`);
                beam.gradient = gradient;
            }

            ctx.fillStyle = beam.gradient;
            ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
            ctx.restore();
        }

        let lastTime = 0;
        const TARGET_FPS = 30;
        const FRAME_INTERVAL = 1000 / TARGET_FPS;

        function animate(timestamp) {
            if (!canvas || !ctx) return;

            // Throttle to 30 fps — skips frames on fast displays, halving GPU load
            if (timestamp - lastTime < FRAME_INTERVAL) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }
            lastTime = timestamp;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const totalBeams = beamsRef.current.length;
            beamsRef.current.forEach((beam, index) => {
                beam.y -= beam.speed;
                beam.pulse += beam.pulseSpeed;

                // Reset beam when it goes off screen
                if (beam.y + beam.length < -100) {
                    resetBeam(beam, index, totalBeams);
                }

                drawBeam(ctx, beam);
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        }

        // Pause when tab is hidden — saves GPU entirely
        const handleVisibility = () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameRef.current);
            } else if (isVisibleRef.current) {
                animationFrameRef.current = requestAnimationFrame(animate);
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        // Pause when section scrolls off-screen
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisibleRef.current = entry.isIntersecting;
                if (entry.isIntersecting) {
                    animationFrameRef.current = requestAnimationFrame(animate);
                } else {
                    cancelAnimationFrame(animationFrameRef.current);
                }
            },
            { threshold: 0 }
        );
        if (canvas) observer.observe(canvas);

        animate(0);

        return () => {
            window.removeEventListener("resize", updateCanvasSize);
            document.removeEventListener('visibilitychange', handleVisibility);
            observer.disconnect();
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [intensity]);

    return (
        <div
            className={cn(
                "relative min-h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center",
                className
            )}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0"
            />

            <div className="absolute inset-0 bg-black/40 pointer-events-none" />

            <div className="relative z-10 flex h-full w-full items-center justify-center">
                {children}
            </div>
        </div>
    );
}
