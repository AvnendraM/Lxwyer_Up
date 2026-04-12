import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Send, Globe, AlertCircle, RefreshCw } from 'lucide-react';

/**
 * VoiceModeOverlay — Fully fixed speech recognition overlay
 * Fixes:
 *  - Proper microphone permission request with user-facing error messages
 *  - Robust error handling for all SpeechRecognition error codes
 *  - continuous=true so recognition doesn't stop after one phrase
 *  - Auto-restart if recognition ends without a result (network glitches)
 *  - Shows specific error messages (denied, no-speech, network, etc.)
 *  - Retry button on error
 *  - EN / Hindi language toggle that restarts recognition in new language
 */
export default function VoiceModeOverlay({ open, onClose, onSend, accentColor = '#3b82f6' }) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [finalText, setFinalText] = useState('');
  const [lang, setLang] = useState('en-IN');
  const [supported, setSupported] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [bars, setBars] = useState(Array(18).fill(0.2));
  const recognitionRef = useRef(null);
  const animFrameRef = useRef(null);
  const shouldRestartRef = useRef(false);
  const hasResultRef = useRef(false);
  const langRef = useRef('en-IN'); // always reflects current lang for closures

  /* ── Animate bars while listening ─────────────────────────────────────── */
  useEffect(() => {
    if (isListening) {
      const animate = () => {
        setBars(prev => prev.map(() => Math.random() * 0.75 + 0.25));
        animFrameRef.current = requestAnimationFrame(animate);
      };
      animFrameRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animFrameRef.current);
      setBars(Array(18).fill(0.2));
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isListening]);

  /* ── Build SpeechRecognition instance ─────────────────────────────────── */
  const buildRecognition = useCallback((language) => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return null;
    }

    const r = new SpeechRecognition();
    r.continuous = true;        // Keep listening across multiple phrases
    r.interimResults = true;    // Show words as they are spoken
    r.lang = language;
    r.maxAlternatives = 1;

    r.onstart = () => {
      setIsListening(true);
      setErrorMsg('');
      hasResultRef.current = false;
    };

    r.onresult = (e) => {
      let interim = '';
      let final = '';
      hasResultRef.current = true;

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      if (interim) setInterimText(interim);
      if (final) {
        setFinalText(prev => (prev ? `${prev} ${final}` : final).trim());
        setInterimText('');
      }
    };

    r.onerror = (e) => {
      setIsListening(false);
      setInterimText('');
      shouldRestartRef.current = false;

      const errorMessages = {
        'not-allowed': '🎤 Microphone access denied. Please allow mic permission in your browser settings and try again.',
        'permission-denied': '🎤 Microphone access denied. Please allow mic permission in your browser settings and try again.',
        'no-speech': '🔇 No speech detected. Please speak clearly and try again.',
        'audio-capture': '🎤 No microphone found. Please connect a microphone and try again.',
        'network': '🌐 Network error. Please check your internet connection and try again.',
        'service-not-allowed': '🚫 Speech service not allowed. Please use Chrome or Edge browser.',
        'aborted': '',  // User stopped manually — no error needed
        'language-not-supported': `🌐 Language "${language}" not supported. Switching to English.`,
      };

      const msg = errorMessages[e.error] || `❌ Speech error: ${e.error}. Please try again.`;
      if (msg) setErrorMsg(msg);

      // Auto-switch language if not supported
      if (e.error === 'language-not-supported') {
        setLang('en-IN');
      }
    };

    r.onend = () => {
      setIsListening(false);
      setInterimText('');

      // Auto-restart: create a FRESH instance (can't reuse stopped instance)
      if (shouldRestartRef.current) {
        setTimeout(() => {
          if (!shouldRestartRef.current) return;
          const fresh = buildRecognition(langRef.current);
          if (!fresh) return;
          recognitionRef.current = fresh;
          try {
            fresh.start();
          } catch (_) {}
        }, 350);
      }
    };

    return r;
  }, []);

  /* ── Request mic permission first, then start listening ───────────────── */
  const startListening = async () => {
    setErrorMsg('');
    setFinalText('');
    setInterimText('');
    langRef.current = lang;  // sync ref before building recognition

    // Check if mic permission is already explicitly denied
    if (navigator.permissions) {
      try {
        const status = await navigator.permissions.query({ name: 'microphone' });
        if (status.state === 'denied') {
          setErrorMsg('🎤 Microphone access is blocked. Please allow it in your browser/site settings and refresh the page.');
          return;
        }
      } catch (_) {
        // permissions API not available in all browsers — continue anyway
      }
    }

    // Stop any existing instance
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }

    const r = buildRecognition(lang);
    if (!r) return;

    recognitionRef.current = r;
    shouldRestartRef.current = true;

    try {
      r.start();
    } catch (err) {
      setErrorMsg('❌ Could not start microphone. Please try again.');
    }
  };

  const stopListening = () => {
    shouldRestartRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch (_) {}
    setIsListening(false);
  };

  /* ── Language toggle — restart recognition in new language ─────────────── */
  const toggleLang = () => {
    const newLang = lang === 'en-IN' ? 'hi-IN' : 'en-IN';
    setLang(newLang);
    langRef.current = newLang;
    setErrorMsg('');

    // If currently listening, restart with new language
    if (isListening) {
      shouldRestartRef.current = false;
      try { recognitionRef.current?.stop(); } catch (_) {}

      setTimeout(() => {
        const r = buildRecognition(newLang);
        if (!r) return;
        recognitionRef.current = r;
        shouldRestartRef.current = true;
        try { r.start(); } catch (_) {}
      }, 400);
    }
  };

  /* ── Send transcribed text ─────────────────────────────────────────────── */
  const handleSend = () => {
    const text = (finalText + ' ' + interimText).trim();
    if (!text) return;
    stopListening();
    onSend(text);
    onClose();
  };

  /* ── Reset on close ────────────────────────────────────────────────────── */
  const handleClose = () => {
    stopListening();
    setFinalText('');
    setInterimText('');
    setErrorMsg('');
    onClose();
  };

  /* ── Cleanup when overlay unmounts ────────────────────────────────────── */
  useEffect(() => {
    return () => {
      shouldRestartRef.current = false;
      try { recognitionRef.current?.stop(); } catch (_) {}
    };
  }, []);

  /* ── Reset state when overlay opens ───────────────────────────────────── */
  useEffect(() => {
    if (open) {
      setFinalText('');
      setInterimText('');
      setErrorMsg('');
      setIsListening(false);
    } else {
      stopListening();
    }
  }, [open]);

  const displayText = finalText + (interimText ? (finalText ? ' ' : '') + interimText : '');
  const hasError = Boolean(errorMsg);

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
              background: 'rgba(10,12,26,0.92)',
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
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(150,170,210,0.6)', marginBottom: 4 }}>
                Voice Mode
              </p>
              <p style={{ fontSize: 13, color: hasError ? '#fca5a5' : 'rgba(200,210,235,0.5)', fontWeight: 500, minHeight: 20 }}>
                {hasError
                  ? ''
                  : isListening
                    ? '🎤 Listening… speak now'
                    : displayText
                      ? 'Tap send or tap mic to speak again'
                      : 'Tap the mic to start speaking'}
              </p>
            </div>

            {/* Error state */}
            {hasError ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  margin: '0 0 20px',
                  padding: '14px 16px',
                  borderRadius: 16,
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                }}
              >
                <AlertCircle size={16} style={{ color: '#f87171', marginTop: 2, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: '#fca5a5', lineHeight: 1.5, flex: 1 }}>{errorMsg}</p>
              </motion.div>
            ) : (
              /* Sound wave bars */
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, height: 56, marginBottom: 20 }}>
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
            )}

            {/* Mic button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <motion.button
                onClick={hasError ? startListening : (isListening ? stopListening : startListening)}
                whileTap={{ scale: 0.93 }}
                style={{
                  width: 72, height: 72, borderRadius: 99,
                  background: hasError
                    ? 'rgba(239,68,68,0.12)'
                    : isListening
                      ? 'rgba(239,68,68,0.18)'
                      : `linear-gradient(135deg, ${accentColor}22, ${accentColor}44)`,
                  border: `2px solid ${hasError
                    ? 'rgba(239,68,68,0.4)'
                    : isListening
                      ? 'rgba(239,68,68,0.6)'
                      : accentColor + '66'}`,
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
                  {hasError
                    ? <RefreshCw size={26} style={{ color: '#f87171' }} />
                    : isListening
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
              border: `1px solid ${displayText ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'}`,
              color: displayText ? '#e2e8f0' : 'rgba(150,170,210,0.3)',
              fontSize: 14, lineHeight: 1.6, fontWeight: displayText ? 500 : 400,
              fontStyle: displayText ? 'normal' : 'italic',
              transition: 'color 0.2s, border-color 0.2s',
            }}>
              {finalText && <span>{finalText}</span>}
              {interimText && (
                <span style={{ color: 'rgba(150,190,255,0.55)' }}>{finalText ? ' ' : ''}{interimText}</span>
              )}
              {!displayText && 'Your speech will appear here…'}
            </div>

            {/* Bottom row: lang toggle + send */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Language toggle */}
              <button
                onClick={toggleLang}
                title={lang === 'en-IN' ? 'Switch to Hindi' : 'Switch to English'}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 99, cursor: 'pointer',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: 'rgba(190,210,240,0.75)', fontSize: 12, fontWeight: 700,
                  flexShrink: 0, letterSpacing: '0.04em',
                  transition: 'all 0.2s',
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
                  padding: '11px 20px', borderRadius: 99,
                  cursor: displayText.trim() ? 'pointer' : 'not-allowed',
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

            {/* Browser support warning */}
            {!supported && (
              <p style={{ textAlign: 'center', fontSize: 11, color: '#f87171', marginTop: 14 }}>
                ⚠️ Speech recognition is not supported in this browser. Please use Chrome or Edge.
              </p>
            )}

            {/* Helper hint when idle */}
            {supported && !hasError && !isListening && !displayText && (
              <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(120,140,170,0.4)', marginTop: 14 }}>
                Works best in Chrome · {lang === 'en-IN' ? 'English' : 'Hindi'} mode
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
