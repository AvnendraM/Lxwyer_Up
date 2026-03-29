import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Eye } from 'lucide-react';
import { getInitials } from '../utils/lawyerPhoto';

/* ── Specialization → professional banner color ── */
const SPEC_COLORS = {
  // Criminal
  'criminal law':        { from: '#1c0a0a', to: '#3b1212', accent: '#ef4444' },
  'criminal':            { from: '#1c0a0a', to: '#3b1212', accent: '#ef4444' },
  // Corporate / Business
  'corporate law':       { from: '#00101f', to: '#003366', accent: '#3b82f6' },
  'corporate':           { from: '#00101f', to: '#003366', accent: '#3b82f6' },
  'business law':        { from: '#00101f', to: '#003366', accent: '#3b82f6' },
  // Family
  'family law':          { from: '#0a1a0f', to: '#0d3320', accent: '#22c55e' },
  'family':              { from: '#0a1a0f', to: '#0d3320', accent: '#22c55e' },
  // Intellectual Property
  'intellectual property': { from: '#14073a', to: '#280d6e', accent: '#a78bfa' },
  'ip law':              { from: '#14073a', to: '#280d6e', accent: '#a78bfa' },
  // Tax
  'tax law':             { from: '#1a1500', to: '#332b00', accent: '#f59e0b' },
  'taxation':            { from: '#1a1500', to: '#332b00', accent: '#f59e0b' },
  // Civil
  'civil law':           { from: '#0d1520', to: '#1b2f4e', accent: '#60a5fa' },
  'civil litigation':    { from: '#0d1520', to: '#1b2f4e', accent: '#60a5fa' },
  // Labour / Employment
  'labour law':          { from: '#0a1f12', to: '#143d22', accent: '#4ade80' },
  'employment law':      { from: '#0a1f12', to: '#143d22', accent: '#4ade80' },
  // Cyber
  'cyber law':           { from: '#001a1f', to: '#003040', accent: '#22d3ee' },
  'cyber':               { from: '#001a1f', to: '#003040', accent: '#22d3ee' },
  // Constitutional
  'constitutional law':  { from: '#100a2e', to: '#1e1560', accent: '#818cf8' },
  // Consumer
  'consumer law':        { from: '#1a0e00', to: '#331c00', accent: '#fb923c' },
  // Banking / Finance
  'banking law':         { from: '#001030', to: '#002060', accent: '#38bdf8' },
  'banking':             { from: '#001030', to: '#002060', accent: '#38bdf8' },
  // Real Estate / Property
  'real estate law':     { from: '#15100a', to: '#2e2010', accent: '#d97706' },
  'property law':        { from: '#15100a', to: '#2e2010', accent: '#d97706' },
  // Medical Negligence
  'medical negligence':  { from: '#1a000a', to: '#360015', accent: '#fb7185' },
  // Divorce
  'divorce':             { from: '#0e0a1a', to: '#1e1340', accent: '#c084fc' },
};

const DEFAULT_COLOR = { from: '#0a1020', to: '#162040', accent: '#60a5fa' };

function getColors(spec = '') {
  const key = spec.toLowerCase().trim();
  return SPEC_COLORS[key] || DEFAULT_COLOR;
}

function LawyerCard({ lawyer, index = 0, onProfileClick, onBookClick }) {
  const hasPhoto = !!(lawyer.photo && lawyer.photo.length > 5);
  const colors   = getColors(lawyer.specialization);

  const charge30 = lawyer.charge_30min || lawyer.consultation_fee_30min;
  const charge60 = lawyer.charge_60min || lawyer.consultation_fee_60min;
  const feeRange = lawyer.fee_range || lawyer.consultation_fee;
  const feeLabel = charge30
    ? `₹${charge30} / 30m`
    : charge60
    ? `₹${charge60} / hr`
    : feeRange || null;

  const courts = (lawyer.court_experience || lawyer.courts || [])
    .slice(0, 2)
    .map(c => (typeof c === 'object' ? c.court_name : c))
    .filter(Boolean);
  const tags = courts.length ? courts : lawyer.specialization ? [lawyer.specialization] : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.04 }}
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
      style={{
        background: '#0b0f1a',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 20,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
        willChange: 'transform',
      }}
    >
      {/* ════ BANNER ════ */}
      <div style={{
        height: 120,
        background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* "Lxwyer Up" watermark — centred & visible */}
        <span style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 38, fontWeight: 900,
          color: 'rgba(255,255,255,0.07)',
          letterSpacing: '-0.03em',
          userSelect: 'none', pointerEvents: 'none',
          whiteSpace: 'nowrap', lineHeight: 1,
          fontFamily: 'inherit',
        }}>
          Lxwyer Up
        </span>

        {/* Accent glow */}
        <div style={{
          position: 'absolute', top: -40, left: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.accent}22 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {/* Bottom fade to card bg */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, transparent 40%, ${colors.from}99 100%)`,
          pointerEvents: 'none',
        }} />

        {/* Verified badge */}
        {lawyer.verified && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '3px 9px', borderRadius: 999,
            background: 'rgba(16,185,129,0.15)',
            border: '1px solid rgba(16,185,129,0.35)',
            fontSize: 10, fontWeight: 700, color: '#34d399',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 5px #10b981' }} />
            Verified
          </div>
        )}
      </div>

      {/* ════ AVATAR ROW ════ */}
      <div style={{
        padding: '0 20px',
        marginTop: -38,
        marginBottom: 12,
        zIndex: 2,
        position: 'relative',
      }}>
        <div style={{
          width: 76, height: 76, borderRadius: '50%',
          border: `3px solid ${colors.accent}60`,
          outline: '3px solid #0b0f1a',
          overflow: 'hidden', flexShrink: 0,
          background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
          boxShadow: `0 4px 20px rgba(0,0,0,0.6), 0 0 0 1px ${colors.accent}25`,
        }}>
          {hasPhoto ? (
            <img
              src={lawyer.photo}
              alt={lawyer.name}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center 5%',
                display: 'block',
              }}
              onError={e => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          {/* Initials fallback */}
          <div style={{
            width: '100%', height: '100%',
            display: hasPhoto ? 'none' : 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontSize: 26, fontWeight: 900,
              color: colors.accent,
              letterSpacing: '-0.03em',
              opacity: 0.85,
            }}>
              {getInitials(lawyer.name)}
            </span>
          </div>
        </div>
      </div>

      {/* ════ CARD BODY ════ */}
      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Name */}
        <h3 style={{
          fontSize: 17, fontWeight: 800, color: '#f0f4ff',
          letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {lawyer.name}
        </h3>

        {/* Specialization */}
        <p style={{
          fontSize: 12, fontWeight: 600, marginBottom: 14,
          color: colors.accent,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {lawyer.specialization || 'Legal Expert'}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {tags.map((t, i) => (
              <span key={i} style={{
                padding: '3px 10px', borderRadius: 999,
                background: `${colors.accent}14`,
                border: `1px solid ${colors.accent}30`,
                fontSize: 10, fontWeight: 600,
                color: colors.accent,
                letterSpacing: '0.02em', whiteSpace: 'nowrap',
              }}>{t}</span>
            ))}
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Stats row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          padding: '12px 0',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          marginBottom: 16,
        }}>
          {/* Experience */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f0f4ff', letterSpacing: '-0.01em', lineHeight: 1 }}>
              {lawyer.experience}<span style={{ fontSize: 10, fontWeight: 600, color: '#475569' }}>yr</span>
            </div>
            <div style={{ fontSize: 9, color: '#475569', fontWeight: 600, marginTop: 2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Exp.</div>
          </div>

          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.07)' }} />

          {/* Location */}
          <div style={{ flex: 1, textAlign: 'center', padding: '0 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
              <MapPin style={{ width: 10, height: 10, color: colors.accent, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 62 }}>
                {lawyer.city || lawyer.state || '—'}
              </span>
            </div>
            <div style={{ fontSize: 9, color: '#475569', fontWeight: 600, marginTop: 2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Location</div>
          </div>

          {feeLabel && (
            <>
              <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.07)' }} />
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: colors.accent, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                  {feeLabel}
                </div>
                <div style={{ fontSize: 9, color: '#475569', fontWeight: 600, marginTop: 2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Fee</div>
              </div>
            </>
          )}
        </div>

        {/* Action row — Profile + Book side by side */}
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Profile button */}
          <button
            onClick={e => { e.stopPropagation(); onProfileClick(lawyer); }}
            style={{
              flex: '0 0 auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              padding: '11px 16px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(200,210,230,0.8)',
              fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
              transition: 'all 0.18s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(200,210,230,0.8)'; }}
          >
            <Eye style={{ width: 13, height: 13 }} />
            Profile
          </button>

          {/* Book button — always professional blue */}
          <button
            onClick={e => { e.stopPropagation(); onBookClick(lawyer); }}
            style={{
              flex: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '11px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #1d4ed8, #4338ca)',
              color: '#fff', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.02em', fontFamily: 'inherit',
              boxShadow: '0 4px 16px rgba(29,78,216,0.35)',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#2563eb,#4f46e5)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(29,78,216,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#1d4ed8,#4338ca)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(29,78,216,0.35)'; }}
          >
            Book Consultation
            <ArrowRight style={{ width: 13, height: 13 }} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(LawyerCard);
