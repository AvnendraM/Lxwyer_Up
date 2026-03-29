import { useEffect, useRef } from 'react';

// Feature items that orbit around the Scale of Justice
const FEATURES = [
  { label: 'AI Legal Help', emoji: '🤖', color: '#3b82f6' },
  { label: 'Verified Lawyers', emoji: '⚖️', color: '#10b981' },
  { label: 'Document Vault', emoji: '📄', color: '#f59e0b' },
  { label: '24/7 Support', emoji: '🕐', color: '#8b5cf6' },
  { label: 'Court Prep', emoji: '🏛️', color: '#ef4444' },
  { label: 'Secure & Private', emoji: '🔒', color: '#0891b2' },
];

const ORBIT_DURATION = 18000; // ms for one full revolution
const CONVERGE_START = 8000;  // ms — start spiraling inward
const CONVERGE_END   = 16000; // ms — reach minimum radius (then hold)
const RADIUS_MAX = 160;       // px — starting orbit radius
const RADIUS_MIN = 95;        // px — closest approach (no merge)

export default function OrbitingFeatures() {
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pills = container.querySelectorAll('.orbit-pill');
    const n = pills.length;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      // Compute current radius — eases from MAX to MIN between converge window, then holds
      let radius = RADIUS_MAX;
      if (elapsed > CONVERGE_START && elapsed <= CONVERGE_END) {
        const t = (elapsed - CONVERGE_START) / (CONVERGE_END - CONVERGE_START);
        // Ease-in-out cubic
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        radius = RADIUS_MAX - (RADIUS_MAX - RADIUS_MIN) * ease;
      } else if (elapsed > CONVERGE_END) {
        radius = RADIUS_MIN;
      }

      pills.forEach((pill, i) => {
        // Each pill starts at evenly-spaced angle offset
        const baseAngle = (2 * Math.PI * i) / n;
        const angle = baseAngle + (2 * Math.PI * (elapsed / ORBIT_DURATION));

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        // Keep pill upright (don't rotate it with the orbit)
        pill.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        pill.style.opacity = '1';
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-3">
        Everything Legal, <span className="text-blue-600">One Platform</span>
      </h2>
      <p className="text-gray-500 text-center mb-12 max-w-xl">
        All the tools you need for Indian legal matters revolve around one core mission — justice for everyone.
      </p>

      {/* Orbit Arena */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center"
        style={{ width: 380, height: 380 }}
      >
        {/* Orbit ring — visual guide */}
        <div
          className="absolute rounded-full border border-dashed border-blue-200 pointer-events-none transition-all duration-1000"
          style={{ width: RADIUS_MAX * 2 + 8, height: RADIUS_MAX * 2 + 8 }}
        />

        {/* Centre — Scale of Justice */}
        <div className="relative z-10 w-20 h-20 rounded-full bg-blue-600 shadow-2xl shadow-blue-300 flex flex-col items-center justify-center select-none">
          <span className="text-3xl">⚖️</span>
        </div>

        {/* Orbiting Pills */}
        {FEATURES.map((f, i) => (
          <div
            key={i}
            className="orbit-pill absolute z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow-lg select-none whitespace-nowrap"
            style={{
              background: f.color,
              opacity: 0,
              top: '50%',
              left: '50%',
              // initial position off-screen until RAF places it
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 4px 20px ${f.color}55`,
            }}
          >
            <span className="text-base leading-none">{f.emoji}</span>
            {f.label}
          </div>
        ))}
      </div>

      {/* Subtle note */}
      <p className="text-xs text-gray-400 mt-6 text-center">
        Features orbit and draw closer — always within reach, never in the way
      </p>
    </div>
  );
}
