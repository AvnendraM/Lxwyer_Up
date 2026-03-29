/**
 * ProfilePhotoUpload (Dark Edition) — Instagram-quality profile photo uploader
 * Designed for the dark navy/teal/indigo application pages.
 *
 * Features:
 *  • Drag-and-drop + click-to-browse
 *  • Live large preview with 1:1 aspect-ratio glassmorphism frame
 *  • Dimension / format / size guidance panel
 *  • Do / Don't tips panel
 *  • Client-side size + format validation
 *  • Image dimension check (warns if < 400×400)
 *  • Retake / Remove actions
 *  • Animated progress bar while loading
 */

import React, { useRef, useState, useCallback } from 'react';

const MAX_SIZE_MB = 3;
const IDEAL_W = 600;
const IDEAL_H = 600;

const TIPS = [
  { ok: true,  text: 'Clear face, front-facing, good lighting' },
  { ok: true,  text: 'Plain or light background (white / grey)' },
  { ok: true,  text: 'Professional attire (like a LinkedIn photo)' },
  { ok: false, text: 'No sunglasses, hats or heavy filters' },
  { ok: false, text: 'No group photos or cropped images' },
  { ok: false, text: 'No blurry / pixelated images' },
];

// ── Shared dark-glass style tokens ──
const card = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 14,
  padding: '14px 16px',
  backdropFilter: 'blur(8px)',
};

export default function ProfilePhotoUpload({ value, onChange, label = 'Profile Photo', hint = '' }) {
  const inputRef    = useRef(null);
  const [dragging, setDragging]   = useState(false);
  const [loading,  setLoading]    = useState(false);
  const [progress, setProgress]   = useState(0);
  const [error,    setError]      = useState('');
  const [warn,     setWarn]       = useState('');
  const [imgDims,  setImgDims]    = useState(null);

  const processFile = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Only image files accepted (JPG, PNG, WEBP).');
      return;
    }
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      setError(`File is ${sizeMB.toFixed(1)} MB — max allowed is ${MAX_SIZE_MB} MB.`);
      return;
    }
    setError(''); setWarn(''); setLoading(true); setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => { if (prev >= 90) { clearInterval(interval); return prev; } return prev + Math.floor(Math.random() * 18) + 5; });
    }, 80);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        setImgDims({ w: img.naturalWidth, h: img.naturalHeight });
        if (img.naturalWidth < 400 || img.naturalHeight < 400)
          setWarn(`Image is ${img.naturalWidth}×${img.naturalHeight}px — recommend at least 400×400 px.`);
        clearInterval(interval); setProgress(100);
        setTimeout(() => { setLoading(false); setProgress(0); }, 400);
        onChange(dataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleInputChange = (e) => processFile(e.target.files[0]);
  const handleDrop = useCallback((e) => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); }, [processFile]);
  const handleDragOver  = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleRemove = () => { onChange(''); setImgDims(null); setError(''); setWarn(''); if (inputRef.current) inputRef.current.value = ''; };

  return (
    <div style={{ fontFamily: 'inherit', color: '#e2e8f0' }}>

      {/* ── Label row ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{label}</span>
        <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.08)', color: '#94a3b8', borderRadius: 20, padding: '2px 8px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)' }}>
          JPG · PNG · WEBP · Max {MAX_SIZE_MB} MB
        </span>
        <span style={{ fontSize: 11, background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', borderRadius: 20, padding: '2px 8px', fontWeight: 600, border: '1px solid rgba(99,102,241,0.3)' }}>
          Ideal: {IDEAL_W}×{IDEAL_H} px (1:1)
        </span>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* ── Upload / Preview zone ── */}
        <div style={{ flex: '0 0 auto' }}>
          {value ? (
            <div style={{ position: 'relative', width: 180, height: 180 }}>
              {/* Preview frame */}
              <div style={{
                width: 180, height: 180, borderRadius: 20,
                border: '2px solid rgba(99,102,241,0.6)',
                boxShadow: '0 0 0 4px rgba(99,102,241,0.15), 0 8px 32px rgba(0,0,0,0.5)',
                overflow: 'hidden', background: '#0f172a',
              }}>
                <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }} />
              </div>

              {/* Remove button */}
              <button type="button" onClick={handleRemove} title="Remove" style={{
                position: 'absolute', top: -10, right: -10,
                width: 28, height: 28, borderRadius: '50%',
                background: '#ef4444', border: '2px solid #0f172a',
                color: 'white', fontSize: 16, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(239,68,68,0.5)', lineHeight: 1,
              }}>×</button>

              {/* Dimension badge */}
              {imgDims && (
                <div style={{
                  position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)',
                  background: warn ? '#b45309' : '#0d9488',
                  color: 'white', fontSize: 10, fontWeight: 700,
                  borderRadius: 20, padding: '2px 10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)', whiteSpace: 'nowrap',
                }}>
                  {imgDims.w}×{imgDims.h} px
                </div>
              )}

              {/* Retake hover overlay */}
              <div onClick={() => inputRef.current?.click()} style={{
                position: 'absolute', inset: 0, borderRadius: 18,
                background: 'rgba(0,0,0,0)', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 4,
                transition: 'background 0.2s', color: 'transparent',
              }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(0,0,0,0.5)'; e.currentTarget.style.color='white'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(0,0,0,0)'; e.currentTarget.style.color='transparent'; }}
              >
                <span style={{ fontSize: 22 }}>📷</span>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>RETAKE</span>
              </div>
            </div>
          ) : (
            /* Drop zone */
            <div onClick={() => inputRef.current?.click()} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
              style={{
                width: 180, height: 180, borderRadius: 20,
                border: `2px dashed ${dragging ? '#818cf8' : 'rgba(255,255,255,0.15)'}`,
                background: dragging ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.04)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 10, cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: dragging ? '0 0 0 4px rgba(129,140,248,0.2)' : 'none',
              }}
            >
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: dragging ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 34, transition: 'background 0.2s',
              }}>👤</div>
              <div style={{ textAlign: 'center', padding: '0 10px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: dragging ? '#a5b4fc' : '#94a3b8', margin: 0 }}>
                  {dragging ? 'Drop to upload' : 'Tap or drag photo here'}
                </p>
                <p style={{ fontSize: 10, color: '#64748b', margin: '4px 0 0' }}>JPG, PNG, WEBP · max {MAX_SIZE_MB} MB</p>
              </div>
              {loading && (
                <div style={{ width: '80%', height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg,#6366f1,#14b8a6)', borderRadius: 2, width:`${progress}%`, transition:'width 0.15s' }} />
                </div>
              )}
            </div>
          )}

          {value && loading && (
            <div style={{ width: 180, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', marginTop: 8 }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg,#6366f1,#14b8a6)', borderRadius: 2, width:`${progress}%`, transition:'width 0.15s' }} />
            </div>
          )}

          {value && (
            <button type="button" onClick={() => inputRef.current?.click()} style={{
              marginTop: 12, width: 180, padding: '7px 0',
              background: 'linear-gradient(135deg,#6366f1,#0d9488)',
              color: 'white', border: 'none', borderRadius: 10,
              fontSize: 12, fontWeight: 700, letterSpacing: '0.04em',
              cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
            }}>📁 Change Photo</button>
          )}
        </div>

        {/* ── Right: Spec card + Tips ── */}
        <div style={{ flex: 1, minWidth: 200 }}>

          {/* Specs */}
          <div style={{ ...card, marginBottom: 12, borderColor: 'rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.08)' }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: '#818cf8', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>
              📐 Photo Specifications
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px 16px' }}>
              {[
                ['Dimension',    `Min 400×400 px`],
                ['Ideal size',   `${IDEAL_W}×${IDEAL_H} px`],
                ['Aspect ratio', '1:1 (Square)'],
                ['Format',       'JPG · PNG · WEBP'],
                ['File size',    `Max ${MAX_SIZE_MB} MB`],
                ['Colour mode',  'RGB (not CMYK)'],
              ].map(([k, v]) => (
                <div key={k}>
                  <p style={{ fontSize: 10, color: '#6366f1', fontWeight: 700, margin: 0 }}>{k}</p>
                  <p style={{ fontSize: 12, color: '#c7d2fe', fontWeight: 600, margin: 0 }}>{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div style={{ ...card }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>
              ✅ Photo Tips
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {TIPS.map((tip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    background: tip.ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                    color: tip.ok ? '#34d399' : '#f87171',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700,
                    border: `1px solid ${tip.ok ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
                  }}>{tip.ok ? '✓' : '✗'}</span>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{tip.text}</span>
                </div>
              ))}
            </div>
          </div>

          {hint && <p style={{ fontSize: 11, color: '#475569', marginTop: 8 }}>ℹ️ {hint}</p>}
        </div>
      </div>

      {/* Hidden input */}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleInputChange} />

      {/* Messages */}
      {error && (
        <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 12, fontWeight: 600 }}>
          ❌ {error}
        </div>
      )}
      {!error && warn && (
        <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', fontSize: 12, fontWeight: 600 }}>
          ⚠️ {warn}
        </div>
      )}
      {value && !error && !warn && (
        <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', fontSize: 12, fontWeight: 600 }}>
          ✅ Photo looks great! Your profile will stand out to clients.
        </div>
      )}
    </div>
  );
}
