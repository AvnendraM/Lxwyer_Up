import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

/* Pages where back button should be hidden */
const HIDDEN_ON = new Set([
  '/', '/home', '/login', '/admin-login', '/monitor-login',
]);

/* Pages that have their own internal back navigation — hide global button */
const HAS_OWN_BACK = new Set([
  '/find-lawyer/ai', '/find-lawyer/manual',
  '/lxwyerai', '/lxwyerai-premium',
  '/book-consultation-signup'
]);

export default function GlobalBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  if (HIDDEN_ON.has(location.pathname)) return null;
  if (HAS_OWN_BACK.has(location.pathname)) return null;
  if (location.pathname.startsWith('/booking/')) return null;

  return (
    <button
      onClick={() => navigate(-1)}
      title="Go back"
      className="hidden md:flex items-center gap-1"
      style={{
        position: 'fixed',
        /* Sits in the far top-left corner of the CONTENT area (below navbar).
           Using top:72 gives just enough clearance on all pages. */
        top: 72,
        left: 18,
        zIndex: 999,
        padding: '5px 12px 5px 8px',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.09)',
        background: 'rgba(8,12,24,0.55)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        color: 'rgba(190,205,235,0.85)',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'inherit',
        cursor: 'pointer',
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
        transition: 'background 0.16s, color 0.16s, box-shadow 0.16s',
        willChange: 'transform',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(29,78,216,0.45)';
        e.currentTarget.style.color = '#fff';
        e.currentTarget.style.boxShadow = '0 4px 18px rgba(29,78,216,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(8,12,24,0.55)';
        e.currentTarget.style.color = 'rgba(190,205,235,0.85)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.3)';
      }}
    >
      <ChevronLeft style={{ width: 14, height: 14, flexShrink: 0 }} />
      Back
    </button>
  );
}
