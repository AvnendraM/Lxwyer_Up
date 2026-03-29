import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, CheckCircle, RefreshCw, X, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '../App';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';

/**
 * OtpVerificationModal
 *
 * Props:
 *   isOpen     – boolean
 *   onClose    – () => void
 *   onVerified – () => void  called when BOTH email + phone are verified
 *   email      – string (the user's email)
 *   phone      – string (10-digit number, without +91)
 *   darkMode   – bool (optional)
 */
const OtpVerificationModal = ({ isOpen, onClose, onVerified, email, phone, darkMode = false }) => {
    // Separate state for email and phone OTP
    const [emailOtp, setEmailOtp] = useState('');
    const [phoneOtp, setPhoneOtp] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [activeTab, setActiveTab] = useState('email'); // 'email' | 'phone'
    const [loading, setLoading] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);

    // Auto-send OTPs when modal opens
    useEffect(() => {
        if (isOpen) {
            sendOtp('email');
            sendOtp('phone');
            setResendCountdown(30);
        }
    }, [isOpen]);

    // Countdown timer
    useEffect(() => {
        if (resendCountdown > 0) {
            const t = setTimeout(() => setResendCountdown(c => c - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [resendCountdown]);

    const sendOtp = async (type) => {
        try {
            if (type === 'email') {
                await axios.post(`${API}/auth/otp/send-email`, { email });
            } else {
                await axios.post(`${API}/auth/otp/send-phone`, { phone });
            }
        } catch (e) {
            // Silently ignore — OTP still generated server-side and logged
        }
    };

    const handleResend = async () => {
        setResendCountdown(30);
        await sendOtp(activeTab);
        toast.success(`OTP resent to your ${activeTab === 'email' ? 'email' : 'phone'}`);
    };

    const verifyOtp = async (type) => {
        const code = type === 'email' ? emailOtp : phoneOtp;
        if (code.length < 6) {
            toast.error('Please enter all 6 digits');
            return;
        }
        const target = type === 'email' ? email : `+91${phone}`;
        setLoading(true);
        try {
            await axios.post(`${API}/auth/otp/verify`, { target, otp: code });
            if (type === 'email') {
                setEmailVerified(true);
                toast.success('Email verified! ✓');
                if (!phoneVerified) setActiveTab('phone');
            } else {
                setPhoneVerified(true);
                toast.success('Phone verified! ✓');
                if (!emailVerified) setActiveTab('email');
            }
        } catch (e) {
            toast.error(e.response?.data?.detail || 'Invalid OTP. Try again.');
        } finally {
            setLoading(false);
        }
    };

    // Auto-proceed once both verified
    useEffect(() => {
        if (emailVerified && phoneVerified) {
            setTimeout(() => onVerified(), 600);
        }
    }, [emailVerified, phoneVerified]);

    if (!isOpen) return null;

    const bg = darkMode ? 'bg-slate-900' : 'bg-white dark:bg-slate-900';
    const border = darkMode ? 'border-slate-700' : 'border-slate-200 dark:border-slate-700';
    const text = darkMode ? 'text-white' : 'text-slate-900 dark:text-white';
    const subtext = darkMode ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400';
    const inputBg = darkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white';
    const tabBase = `flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2`;
    const tabActive = 'bg-blue-600 text-white shadow';
    const tabInactive = darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white';

    const activeType = activeTab;
    const val = activeType === 'email' ? emailOtp : phoneOtp;
    const setVal = activeType === 'email' ? setEmailOtp : setPhoneOtp;
    const verified = activeType === 'email' ? emailVerified : phoneVerified;
    const target = activeType === 'email' ? email : `+91${phone}`;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
                    onClick={e => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                        className={`relative w-full max-w-md rounded-2xl border shadow-2xl ${bg} ${border}`}
                    >
                        {/* Header */}
                        <div className={`flex items-center justify-between p-6 border-b ${border}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className={`font-bold text-lg ${text}`}>Verify Your Details</h2>
                                    <p className={`text-xs ${subtext}`}>Enter the 6-digit codes we sent you</p>
                                </div>
                            </div>
                            <button onClick={onClose} className={`${subtext} hover:${text} transition-colors`}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Progress bar */}
                        <div className={`flex gap-3 px-6 pt-5`}>
                            <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                <div className={`h-full rounded-full transition-all duration-500 ${emailVerified ? 'bg-green-500 w-full' : 'bg-blue-400 w-1/3'}`} />
                            </div>
                            <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                <div className={`h-full rounded-full transition-all duration-500 ${phoneVerified ? 'bg-green-500 w-full' : 'bg-blue-400 w-1/3'}`} />
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className={`flex gap-2 mx-6 mt-4 p-1 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-slate-100 dark:bg-slate-800'}`}>
                            <button
                                className={`${tabBase} ${activeTab === 'email' ? tabActive : tabInactive}`}
                                onClick={() => {
                                    if (!emailVerified) setEmailOtp('');
                                    setActiveTab('email');
                                }}
                            >
                                <Mail className="w-4 h-4" />
                                Email
                                {emailVerified && <CheckCircle className="w-3.5 h-3.5 text-green-400" />}
                            </button>
                            <button
                                className={`${tabBase} ${activeTab === 'phone' ? tabActive : tabInactive}`}
                                onClick={() => {
                                    if (!phoneVerified) setPhoneOtp('');
                                    setActiveTab('phone');
                                }}
                            >
                                <Phone className="w-4 h-4" />
                                Phone
                                {phoneVerified && <CheckCircle className="w-3.5 h-3.5 text-green-400" />}
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <div className="space-y-5">
                                <p className={`text-sm text-center ${subtext}`}>
                                    OTP sent to <span className={`font-semibold ${text}`}>{target}</span>
                                </p>

                                {verified ? (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                        className="flex flex-col items-center gap-3 py-4"
                                    >
                                        <CheckCircle className="w-14 h-14 text-green-500" />
                                        <p className="text-green-500 font-semibold text-lg">Verified!</p>
                                    </motion.div>
                                ) : (
                                    <>
                                        {/* 6-digit OTP Inputs */}
                                        <div className="flex justify-center mb-6">
                                            <InputOTP maxLength={6} value={val} onChange={(value) => setVal(value)}>
                                                <InputOTPGroup>
                                                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                                                        <InputOTPSlot
                                                            key={idx}
                                                            index={idx}
                                                            className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500 transition-all rounded-md mx-0.5 sm:mx-1"
                                                        />
                                                    ))}
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>

                                        <button
                                            onClick={() => verifyOtp(activeType)}
                                            disabled={loading || val.length < 6}
                                            className="w-full py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            {loading ? 'Verifying…' : `Verify ${activeType === 'email' ? 'Email' : 'Phone'}`}
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Resend */}
                            <div className={`mt-4 text-center text-sm ${subtext}`}>
                                Didn't receive it?{' '}
                                {resendCountdown > 0 ? (
                                    <span>Resend in <strong>{resendCountdown}s</strong></span>
                                ) : (
                                    <button
                                        onClick={handleResend}
                                        className="text-blue-500 font-semibold hover:underline inline-flex items-center gap-1"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" /> Resend OTP
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OtpVerificationModal;
