import React, { useState, useEffect, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../App';


/* Single fixed star layer — painted ONCE by the GPU, never repainted on scroll */
const STAR_STYLE = {
  position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
  backgroundImage: [
    'radial-gradient(circle, rgba(255,255,255,0.85) 1px, transparent 1px)',
    'radial-gradient(circle, rgba(255,255,255,0.60) 1px, transparent 1px)',
    'radial-gradient(circle, rgba(147,197,253,0.70) 1px, transparent 1px)',
    'radial-gradient(circle, rgba(255,255,255,0.45) 1px, transparent 1px)',
  ].join(','),
  backgroundSize: '100px 100px, 150px 150px, 200px 200px, 280px 280px',
  backgroundPosition: '10px 24px, 70px 90px, 140px 52px, 220px 170px',
  willChange: 'transform',
  transform: 'translateZ(0)',
};

/* ════════════════════════════════════════════════════════════
   Compact Signup Form
   ════════════════════════════════════════════════════════════ */
const VisionaryForm = memo(function VisionaryForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) return;
    setStatus('loading');
    try {
      await fetch(`${API}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '2rem 0' }}>
      <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(37,99,235,0.4)' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <p style={{ fontSize: '1rem', fontWeight: 700, color: '#1e40af' }}>You're on the list!</p>
      <p style={{ fontSize: '0.82rem', color: '#64748b', textAlign: 'center' }}>We'll reach out at {form.email} when we launch.</p>
    </div>
  );

  const inp = {
    width: '100%', padding: '10px 13px', borderRadius: 10,
    border: '1.5px solid #e2e8f0', background: '#f8fafc',
    fontSize: '0.85rem', color: '#0f172a', outline: 'none',
    fontFamily: 'inherit', transition: 'border-color 0.2s',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Full Name *</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required style={inp}
            onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
        </div>
        <div>
          <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Email *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required style={inp}
            onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 00000 00000" style={inp}
            onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
        </div>
        <div>
          <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>I Am A *</label>
          <select name="role" value={form.role} onChange={handleChange} required style={{ ...inp, cursor: 'pointer' }}>
            <option value="">Select role</option>
            <option value="client">Client / Individual</option>
            <option value="lawyer">Lawyer</option>
            <option value="lawfirm">Law Firm</option>
            <option value="student">Law Student</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div>
        <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>What Excites You? (Optional)</label>
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="AI legal matching, SOS help, transparent fees..." rows={3}
          style={{ ...inp, resize: 'vertical', minHeight: 64 }}
          onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
      </div>
      <button type="submit" disabled={status === 'loading'} style={{
        marginTop: 4,
        padding: '13px 24px', borderRadius: 12, border: 'none', cursor: 'pointer',
        background: 'linear-gradient(135deg,#1d4ed8,#4f46e5)',
        color: '#fff', fontSize: '0.92rem', fontWeight: 700, letterSpacing: '0.02em',
        boxShadow: '0 6px 20px rgba(37,99,235,0.35)', fontFamily: 'inherit',
        transition: 'opacity 0.2s', opacity: status === 'loading' ? 0.7 : 1,
      }}>
        {status === 'loading' ? 'Sending…' : 'Join the Movement →'}
      </button>
      {status === 'error' && <p style={{ fontSize: '0.8rem', color: '#ef4444', textAlign: 'center' }}>Something went wrong. Try again.</p>}
      <p style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginTop: 2 }}>
        Questions? <a href="mailto:avnendram.7@gmail.com" style={{ color: '#2563eb', fontWeight: 600 }}>avnendram.7@gmail.com</a>
      </p>
    </form>
  );
});

/* ════════════════════════════════════════════════════════════
   Main Component
   ════════════════════════════════════════════════════════════ */
export default function RevolutionisingSoon() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const signupRef = useRef(null);
  const bannerRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const targets = [signupRef.current, bannerRef.current].filter(Boolean);
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('rs-in'); });
    }, { threshold: 0.06 });
    targets.forEach(t => obs.observe(t));
    return () => obs.disconnect();
  }, []);

  const handleDemo = (e) => {
    setTransitioning(true);
    setTimeout(() => navigate('/home'), 650);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #000; font-family: 'Outfit','Inter',sans-serif; }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        select option { background: #fff; color: #0f172a; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(37,99,235,0.2); border-radius: 3px; }

        /* Performant scroll reveal — only opacity + transform on compositor */
        .rs-reveal {
          opacity: 0;
          transform: translate3d(0, 24px, 0);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .rs-reveal.rs-in {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        @keyframes rsFadeUp { from { opacity:0; transform:translate3d(0,18px,0); } to { opacity:1; transform:translate3d(0,0,0); } }
        @keyframes rsReveal { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }
        @keyframes shimmer  { from { background-position:-200% center; } to { background-position:200% center; } }
        @keyframes floatOrb { 0%,100% { transform:translate3d(0,0,0); } 50% { transform:translate3d(0,-16px,0); } }
        @keyframes rsRingPulse {
          0%   { box-shadow: 0 0 0 0 rgba(37,99,235,0.6); }
          70%  { box-shadow: 0 0 0 8px rgba(37,99,235,0); }
          100% { box-shadow: 0 0 0 0 rgba(37,99,235,0); }
        }
        /* Circle burst transition */
        @keyframes rsCircleBurst {
          0%   { clip-path: circle(0% at var(--ox) var(--oy)); }
          100% { clip-path: circle(175% at var(--ox) var(--oy)); }
        }
        /* Glass utility */
        .rs-glass {
          backdrop-filter: blur(20px) saturate(1.5);
          -webkit-backdrop-filter: blur(20px) saturate(1.5);
        }
      `}</style>

      {/* ── Clean professional transition overlay ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        pointerEvents: transitioning ? 'all' : 'none',
        background: 'linear-gradient(180deg,#030d1f 0%,#000 100%)',
        opacity: transitioning ? 1 : 0,
        transition: 'opacity 0.55s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Top progress bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, height: 2,
          background: 'linear-gradient(90deg,#2563eb,#6366f1)',
          width: transitioning ? '100%' : '0%',
          transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 0 12px rgba(37,99,235,0.8)',
        }} />
      </div>

      {/* ══════════════════════════════════════════════
          SECTION 1 — VIDEO HERO
      ══════════════════════════════════════════════ */}
      {/* ── Single fixed star layer — GPU compositor, zero scroll repaint ── */}
      <div style={STAR_STYLE} aria-hidden />

      <section style={{
        position: 'relative', width: '100%', height: '100vh', background: '#000', zIndex: 1,
      }}>
        {/* Lxwyer Up — glass header */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
          padding: '18px 28px',
          background: 'rgba(0,0,0,0.30)',
          backdropFilter: 'blur(18px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          opacity: mounted ? 1 : 0, transition: 'opacity 0.7s ease 0.3s',
        }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', letterSpacing: '0.01em' }}>
            Lxwyer Up
          </span>
        </div>

        {/* Video — 5% inset, GPU layer */}
        <div style={{
          position: 'absolute', top: '5%', left: '5%', right: '5%', bottom: '5%',
          borderRadius: 18, overflow: 'hidden', background: '#000',
          boxShadow: '0 0 0 1px rgba(37,99,235,0.12), 0 40px 120px rgba(0,0,0,0.85)',
          opacity: mounted ? 1 : 0,
          animation: mounted ? 'rsReveal 1.2s cubic-bezier(0.22,1,0.36,1) both' : 'none',
        }}>
          <video autoPlay muted loop playsInline
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}>
            <source src="/videos/3.mp4" type="video/mp4" />
          </video>
          {/* Bottom vignette */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,10,0.72) 0%,transparent 28%)', pointerEvents: 'none' }} />
        </div>

        {/* Explore Demo button — near bottom, 1 cm left of center */}
        <button
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          onClick={handleDemo}
          style={{
            position: 'absolute', bottom: '3%', left: '50%',
            transform: btnHover
              ? 'translate3d(calc(-50% - 38px), -2px, 0) scale(1.06)'
              : 'translate3d(calc(-50% - 38px), 0, 0)',
            zIndex: 10,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 16px', borderRadius: 8,
            border: '1.5px solid rgba(37,99,235,0.7)',
            cursor: 'pointer',
            fontSize: '0.68rem', fontWeight: 600, fontFamily: 'inherit',
            letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff',
            background: btnHover ? 'rgba(37,99,235,0.18)' : 'rgba(0,0,0,0.38)',
            backdropFilter: 'blur(16px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.6)',
            boxShadow: btnHover ? '0 0 18px rgba(37,99,235,0.35)' : '0 4px 24px rgba(0,0,0,0.4)',
            animation: mounted ? 'rsFadeUp 0.7s ease 1s both, rsRingPulse 2.5s ease-out 2.2s infinite' : 'none',
            transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1), background 0.2s ease, box-shadow 0.2s ease',
            opacity: mounted ? 1 : 0,
            whiteSpace: 'nowrap',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="rgba(37,99,235,0.85)" strokeWidth="1.5" />
            <polygon points="10 7.5 17 12 10 16.5" fill="white" />
          </svg>
          Explore Demo
        </button>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2 — SIGNUP (Realize-style card)
      ══════════════════════════════════════════════ */}
      <section style={{
        position: 'relative', background: 'rgba(3,8,24,0.92)', zIndex: 1,
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3rem)',
      }}>

        {/* Ambient glow blobs */}
        <div style={{ position: 'absolute', top: '15%', left: '8%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle,rgba(29,78,216,0.15) 0%,transparent 70%)', animation: 'floatOrb 8s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '12%', right: '6%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)', animation: 'floatOrb 10s ease-in-out 2s infinite', pointerEvents: 'none' }} />

        {/* ─── THE CARD (Realize layout) ─── */}
        <div
          ref={signupRef}
          className="rs-reveal"
          style={{
            display: 'flex', width: '100%', maxWidth: 880,
            borderRadius: 22, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(37,99,235,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {/* LEFT: frosted glass form panel */}
          <div style={{
            flex: '0 0 55%',
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(26px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(26px) saturate(1.8)',
            borderRight: '1px solid rgba(255,255,255,0.18)',
            padding: 'clamp(2.2rem,4vw,3.2rem)',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Brand — text only, once */}
            <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e40af', marginBottom: '1.8rem', letterSpacing: '0.01em' }}>
              Lxwyer Up
            </p>

            <h2 style={{ fontSize: 'clamp(1.5rem,2.6vw,2rem)', fontWeight: 800, color: '#0f172a', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              Sign up for<br />Early Access
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.8rem', maxWidth: 340 }}>
              Join India's future legal platform. Get priority access and be first to experience smarter justice.
            </p>

            <VisionaryForm />
          </div>

          {/* RIGHT: dark glass brand panel */}
          <div style={{
            flex: 1,
            background: 'rgba(5,12,40,0.55)',
            backdropFilter: 'blur(26px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(26px) saturate(1.6)',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
            padding: 'clamp(2.2rem,4vw,3.2rem)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Decorative rings */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 340, height: 340, borderRadius: '50%', border: '1px solid rgba(37,99,235,0.1)', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(37,99,235,0.05)', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '12%', right: '-12%', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle,rgba(37,99,235,0.28) 0%,transparent 70%)', pointerEvents: 'none' }} />

            {/* Copy */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(147,197,253,0.55)', marginBottom: '1rem' }}>
                For Visionaries
              </p>
              <h3 style={{ fontSize: 'clamp(1.5rem,2.5vw,2.1rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#fff', marginBottom: '1rem' }}>
                Revolutionise<br />
                <span style={{
                  backgroundImage: 'linear-gradient(135deg,#93c5fd,#60a5fa,#818cf8)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text', backgroundSize: '200% auto',
                  animation: 'shimmer 4s linear infinite',
                }}>
                  Legal Justice
                </span>
              </h3>
              <p style={{ color: 'rgba(148,163,184,0.6)', lineHeight: 1.8, fontSize: '0.85rem', marginBottom: '1.6rem' }}>
                AI-matched lawyers, SOS legal help, transparent fees — justice that truly works.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {[
                  'SOS Legal Help — instant 24/7 access',
                  'AI Lawyer Matching — perfect fit every time',
                  '1000+ Apex Lawyers — coming soon',
                  'Transparent Fees — zero hidden charges',
                ].map(tx => (
                  <div key={tx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 2, height: 14, borderRadius: 2, background: 'linear-gradient(180deg,#3b82f6,#6366f1)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.82rem', color: 'rgba(203,213,225,0.72)', lineHeight: 1.4 }}>{tx}</span>
                  </div>
                ))}
              </div>
            </div>

            <p style={{ fontSize: 10, color: 'rgba(148,163,184,0.22)', letterSpacing: '0.15em', textTransform: 'uppercase', position: 'relative', zIndex: 2 }}>
              Made in India — AI-Powered
            </p>
          </div>
        </div>

        {/* ── India badge — absolute bottom of blue section ── */}
        <div ref={bannerRef} style={{ position: 'absolute', bottom: '2rem', left: 0, right: 0, textAlign: 'center', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            padding: '9px 24px', borderRadius: 999,
            border: '1px solid rgba(147,197,253,0.22)',
            background: 'rgba(14,20,60,0.45)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 6px #3b82f6' }} />
            <span style={{
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase',
              background: 'linear-gradient(90deg,#93c5fd,#60a5fa,#818cf8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', backgroundSize: '200% auto',
              animation: 'shimmer 4s linear infinite',
            }}>
              India's First Legal Tech Ecosystem
            </span>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 6px #3b82f6' }} />
          </div>
        </div>
      </section>
    </>
  );
}
