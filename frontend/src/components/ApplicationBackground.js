/**
 * ApplicationBackground — Premium dark animated background for
 * LawyerApplication and LawFirmApplication pages.
 *
 * Layers (back→front):
 *  1. Deep navy gradient base
 *  2. Three slow-drifting radial gradient orbs (teal / indigo / violet)
 *  3. 40 tiny floating legal-themed dots / sparks animated with CSS
 *  4. A subtle grid noise texture overlay for depth
 */

import React, { useEffect, useRef } from 'react';

const KEYFRAMES = `
@keyframes orbDrift1 {
  0%   { transform: translate(0px,   0px)   scale(1);    opacity:.55; }
  25%  { transform: translate(-70px, 50px)  scale(1.08); opacity:.65; }
  50%  { transform: translate(40px,  -40px) scale(.94);  opacity:.5;  }
  75%  { transform: translate(-30px, -20px) scale(1.04); opacity:.6;  }
  100% { transform: translate(0px,   0px)   scale(1);    opacity:.55; }
}
@keyframes orbDrift2 {
  0%   { transform: translate(0px,  0px)   scale(1.02); opacity:.5;  }
  30%  { transform: translate(60px, -60px) scale(.94);  opacity:.6;  }
  60%  { transform: translate(-50px,40px)  scale(1.06); opacity:.45; }
  100% { transform: translate(0px,  0px)   scale(1.02); opacity:.5;  }
}
@keyframes orbDrift3 {
  0%   { transform: translate(0px,   0px)  scale(.96); opacity:.4;  }
  40%  { transform: translate(-80px, 30px) scale(1.1); opacity:.55; }
  80%  { transform: translate(55px, -45px) scale(.9);  opacity:.38; }
  100% { transform: translate(0px,   0px)  scale(.96); opacity:.4;  }
}
@keyframes sparkFloat {
  0%   { transform: translateY(0)   rotate(0deg);   opacity:.7; }
  50%  { transform: translateY(-28px) rotate(180deg); opacity:1;  }
  100% { transform: translateY(0)   rotate(360deg); opacity:.7; }
}
@keyframes gridShimmer {
  0%,100% { opacity:.025; }
  50%      { opacity:.045; }
}
`;

// Deterministic pseudo-random to avoid hydration mismatch
function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const SPARKS = Array.from({ length: 40 }, (_, i) => {
  const r = seededRand(i * 137 + 1);
  return {
    id: i,
    left: `${(r() * 100).toFixed(1)}%`,
    top:  `${(r() * 100).toFixed(1)}%`,
    size: 2 + r() * 3,
    dur:  `${(6 + r() * 14).toFixed(1)}s`,
    delay:`${(r() * 8).toFixed(1)}s`,
    hue:  r() > 0.5 ? '#5eead4' : r() > 0.25 ? '#818cf8' : '#a78bfa',
    opacity: 0.3 + r() * 0.5,
  };
});

export default function ApplicationBackground() {
  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* Fixed full-viewport layer, behind everything */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          overflow: 'hidden',
          background: '#000000',
        }}
      >
        {/* ── Orb 1: teal, top-left ── */}
        <div style={{
          position: 'absolute', top: '5%', left: '3%',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20,184,166,0.22) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'orbDrift1 22s ease-in-out infinite',
        }} />

        {/* ── Orb 2: indigo, bottom-right ── */}
        <div style={{
          position: 'absolute', bottom: '8%', right: '2%',
          width: 620, height: 620, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'orbDrift2 28s ease-in-out 6s infinite',
        }} />

        {/* ── Orb 3: violet, centre ── */}
        <div style={{
          position: 'absolute', top: '40%', left: '45%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'orbDrift3 18s ease-in-out 10s infinite',
          transform: 'translate(-50%,-50%)',
        }} />

        {/* ── Orb 4: deep-blue accent, top-right ── */}
        <div style={{
          position: 'absolute', top: '10%', right: '8%',
          width: 380, height: 380, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'orbDrift1 34s ease-in-out 15s infinite',
        }} />

        {/* ── Floating sparks / particles ── */}
        {SPARKS.map(s => (
          <div key={s.id} style={{
            position: 'absolute',
            left: s.left, top: s.top,
            width: s.size, height: s.size,
            borderRadius: '50%',
            background: s.hue,
            opacity: s.opacity,
            boxShadow: `0 0 ${s.size * 3}px ${s.hue}`,
            animation: `sparkFloat ${s.dur} ease-in-out ${s.delay} infinite`,
          }} />
        ))}

        {/* ── Subtle CSS grid-dot texture ── */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          animation: 'gridShimmer 8s ease-in-out infinite',
        }} />

        {/* ── Bottom gradient vignette ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
          background: 'linear-gradient(to top, rgba(3,7,18,0.8), transparent)',
        }} />
      </div>
    </>
  );
}
