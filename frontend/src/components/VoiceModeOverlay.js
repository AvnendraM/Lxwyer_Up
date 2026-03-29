import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Send, Globe } from 'lucide-react';

/**
 * VoiceModeOverlay
 * A glassmorphic voice-input modal with:
 *  - Real-time interim transcription
 *  - Animated sound-wave bars while listening
 *  - Auto-send on final result (optional)
 *  - EN / Hindi language toggle
 */
export default function VoiceModeOverlay({ open, onClose, onSend, accentColor = '#3b82f6' }) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [finalText, setFinalText] = useState('');
  const [lang, setLang] = useState('en-IN');
  const [supported, setSupported] = useState(true);
  const [bars, setBars] = useState(Array(18).fill(0.2));
  const recognitionRef = useRef(null);
  const animFrameRef = useRef(null);

  /* ── Animate bars while listening ─────────────────────── */
  useEffect(() => {
    if (isListening) {
      const animate = () => {
        setBars(prev =>
          prev.map(() => isListening ? Math.random() * 0.75 + 0.25 : 0.2)
        );
        animFrameRef.current = requestAnimationFrame(animate);
      };
      animFrameRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animFrameRef.current);
      setBars(Array(18).fill(0.2));
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isListening]);

  /* ── Speech recognition setup ─────────────────────────── */
  const buildRecognition = (language) => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) { setSupported(false); return null; }
    const r = new SpeechRecognition();
    r.continuous = false;
    r.interimResults = true;
    r.lang = language;

    r.onstart = () => setIsListening(true);
    r.onend = () => { setIsListening(false); setInterimText(''); };

    r.onresult = (e) => {
      let interim = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          final += e.results[i][0].transcript;
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      if (interim) setInterimText(interim);
      if (final) {
        setFinalText(prev => (prev ? `${prev} ${final}` : final).trim());
        setInterimText('');
      }
    };

    r.onerror = () => { setIsListening(false); setInterimText(''); };
    return r;
  };

  const startListening = () => {
    setFinalText('');
    setInterimText('');
    const r = buildRecognition(lang);
    if (!r) return;
    recognitionRef.current = r;
    r.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  /* ── Send transcribed text ─────────────────────────────── */
  const handleSend = () => {
    const text = (finalText + ' ' + interimText).trim();
    if (!text) return;
    onSend(text);
    onClose();
  };

  /* ── Reset on close ────────────────────────────────────── */
  const handleClose = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setFinalText('');
    setInterimText('');
    onClose();
  };

  /* ── Cleanup when overlay unmounts ─────────────────────── */
  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  const displayText = finalText + (interimText ? (finalText ? ' ' : '') + interimText : '');

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center"
          style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'rgba(0,0,0,0.75)' }}
        >
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 400 }}
            className="relative w-full max-w-md mx-4 mb-6 sm:mb-0"
            style={{
              background: 'rgba(10,12,26,0.88)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 28,
              boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)`,
              padding: '28px 24px 24px',
            }}
          >
            {/* Close */}
            <button
              onClick={handleClose}
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 32, height: 32, borderRadius: 99,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(200,210,230,0.7)', cursor: 'pointer',
              }}
            >
              <X size={14} />
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(150,170,210,0.6)', marginBottom: 4 }}>
                Voice Mode
              </p>
              <p style={{ fontSize: 13, color: 'rgba(200,210,235,0.5)', fontWeight: 500 }}>
                {isListening ? 'Listening… speak now' : displayText ? 'Tap send or speak again' : 'Tap the mic to start speaking'}
              </p>
            </div>

            {/* Sound wave bars */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, height: 56, marginBottom: 24 }}>
              {bars.map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: isListening ? h : 0.18 }}
                  transition={{ duration: 0.12, ease: 'easeOut' }}
                  style={{
                    width: 3, height: 48, borderRadius: 99,
                    background: isListening
                      ? `linear-gradient(to top, ${accentColor}80, ${accentColor})`
                      : 'rgba(255,255,255,0.1)',
                    transformOrigin: 'center',
                  }}
                />
              ))}
            </div>

            {/* Mic button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <motion.button
                onClick={isListening ? stopListening : startListening}
                whileTap={{ scale: 0.93 }}
                style={{
                  width: 72, height: 72, borderRadius: 99,
                  background: isListening
                    ? 'rgba(239,68,68,0.18)'
                    : `linear-gradient(135deg, ${accentColor}22, ${accentColor}44)`,
                  border: `2px solid ${isListening ? 'rgba(239,68,68,0.6)' : accentColor + '66'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: isListening
                    ? '0 0 0 8px rgba(239,68,68,0.08), 0 0 32px rgba(239,68,68,0.2)'
                    : `0 0 0 8px ${accentColor}0D, 0 0 32px ${accentColor}22`,
                }}
              >
                <motion.div
                  animate={isListening ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                >
                  {isListening
                    ? <MicOff size={28} style={{ color: '#ef4444' }} />
                    : <Mic size={28} style={{ color: accentColor }} />
                  }
                </motion.div>
              </motion.button>
            </div>

            {/* Transcript box */}
            <div style={{
              minHeight: 56, borderRadius: 16, padding: '12px 16px', marginBottom: 16,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: displayText ? '#e2e8f0' : 'rgba(150,170,210,0.3)',
              fontSize: 14, lineHeight: 1.6, fontWeight: displayText ? 500 : 400,
              fontStyle: displayText ? 'normal' : 'italic',
              transition: 'color 0.2s',
            }}>
              {displayText || 'Your speech will appear here…'}
              {interimText && (
                <span style={{ color: 'rgba(150,170,210,0.5)' }}> {interimText}</span>
              )}
            </div>

            {/* Bottom row: lang toggle + send */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Language toggle */}
              <button
                onClick={() => setLang(l => l === 'en-IN' ? 'hi-IN' : 'en-IN')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 99, cursor: 'pointer',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: 'rgba(190,210,240,0.75)', fontSize: 12, fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                <Globe size={13} />
                {lang === 'en-IN' ? 'EN' : 'हिं'}
              </button>

              {/* Send */}
              <button
                onClick={handleSend}
                disabled={!displayText.trim()}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '11px 20px', borderRadius: 99, cursor: displayText.trim() ? 'pointer' : 'not-allowed',
                  background: displayText.trim()
                    ? `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${displayText.trim() ? accentColor + 'aa' : 'rgba(255,255,255,0.07)'}`,
                  color: displayText.trim() ? '#fff' : 'rgba(150,170,210,0.35)',
                  fontSize: 13, fontWeight: 700,
                  boxShadow: displayText.trim() ? `0 4px 20px ${accentColor}44` : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <Send size={14} />
                Send
              </button>
            </div>

            {!supported && (
              <p style={{ textAlign: 'center', fontSize: 11, color: '#f87171', marginTop: 12 }}>
                Speech recognition is not supported in this browser. Try Chrome.
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
