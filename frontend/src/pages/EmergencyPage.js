import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Shield, Clock, AlertCircle, CheckCircle2, Loader2, User, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'sonner';
import { useLang } from '../context/LanguageContext';

const STATES = ['Delhi', 'Haryana', 'Uttar Pradesh'];

const EmergencyPage = () => {
    const navigate = useNavigate();
    const { t } = useLang();
    const [formData, setFormData] = useState({ state: '', city: '', issueType: '', name: '', phone: '' });
    const [step, setStep] = useState('form'); // form | searching | matched | no_lawyer | error
    const [matchedLawyer, setMatchedLawyer] = useState(null);
    const [sessionId, setSessionId] = useState(null);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    // Build issue labels dynamically so they translate when language toggles
    const ISSUE_LABELS = {
        criminal: t('ep_issue_criminal'),
        family:   t('ep_issue_family'),
        civil:    t('ep_issue_civil'),
        cyber:    t('ep_issue_cyber'),
        traffic:  t('ep_issue_traffic'),
    };

    const handleConnect = async () => {
        if (!formData.state || !formData.phone || !formData.issueType) {
            toast.error('Please fill in State, Phone, and Issue Type');
            return;
        }
        if (formData.phone.replace(/\D/g, '').length < 10) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        setStep('searching');
        try {
            const res = await axios.post(`${API}/sos/request`, {
                user_phone: formData.phone,
                user_name: formData.name || undefined,
                user_state: formData.state,
                user_city: formData.city || formData.state,
                issue_type: formData.issueType,
            });

            setSessionId(res.data.session_id);

            if (res.data.status === 'matched') {
                setMatchedLawyer(res.data.lawyer);
                setTimeout(() => setStep('matched'), 1500);
            } else {
                setStep('no_lawyer');
            }
        } catch (err) {
            console.error(err);
            setStep('error');
        }
    };

    const resetForm = () => {
        setStep('form');
        setMatchedLawyer(null);
        setSessionId(null);
        setFormData({ state: '', city: '', issueType: '', name: '', phone: '' });
    };

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ background: '#000000' }}>
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-red-600/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/8 blur-[120px]" />
            </div>

            {/* Navbar */}
            <nav className="relative z-20 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
                <div className="font-bold text-2xl text-white tracking-tight cursor-pointer" onClick={() => navigate('/')} style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Lxwyer Up <span className="text-red-500">SOS</span>
                </div>
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10" onClick={() => navigate('/')}>
                    {t('ep_back_home')}
                </Button>
            </nav>

            {/* Main */}
            <main className="relative z-10 container mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-16">

                {/* Left: Hero */}
                <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-medium text-sm">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        {t('ep_badge')}
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl lg:text-7xl font-bold text-white leading-[1.1]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {t('ep_hero_1')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">{t('ep_hero_2')}</span>
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        {t('ep_sub')}
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400"><Shield className="w-6 h-6" /></div>
                            <div className="text-left">
                                <p className="text-white font-semibold">{t('ep_verified_title')}</p>
                                <p className="text-xs text-slate-500">{t('ep_verified_sub')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400"><Clock className="w-6 h-6" /></div>
                            <div className="text-left">
                                <p className="text-white font-semibold">{t('ep_availability_title')}</p>
                                <p className="text-xs text-slate-500">{t('ep_availability_sub')}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Form / Status Panel */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
                    className="lg:w-1/2 w-full max-w-md mx-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-red-500/20 to-blue-500/5 blur-3xl rounded-3xl" />

                    <div className="relative bg-black/90 backdrop-blur-xl border border-white/[0.07] p-8 rounded-3xl shadow-2xl">
                        <AnimatePresence mode="wait">

                            {/* ── Form Step ── */}
                            {step === 'form' && (
                                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-bold text-white mb-2">{t('ep_form_title')}</h3>
                                        <p className="text-slate-400 text-sm">{t('ep_form_sub')}</p>
                                    </div>
                                    <div className="space-y-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-slate-300">{t('ep_state')} *</Label>
                                                <Select onValueChange={(v) => setFormData(f => ({ ...f, state: v }))}>
                                                    <SelectTrigger className="bg-white/[0.05] border-white/10 text-white">
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                                                        {STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-slate-300">{t('ep_city')}</Label>
                                                <Input className="bg-slate-800 border-slate-700 text-white" placeholder={t('ep_city_ph')}
                                                    onChange={(e) => setFormData(f => ({ ...f, city: e.target.value }))} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-slate-300">{t('ep_issue')} *</Label>
                                            <Select onValueChange={(v) => setFormData(f => ({ ...f, issueType: v }))}>
                                                <SelectTrigger className="bg-white/[0.05] border-white/10 text-white">
                                                    <SelectValue placeholder={t('ep_issue_ph')} />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                                                    {Object.entries(ISSUE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-slate-300">{t('ep_name')}</Label>
                                            <Input className="bg-white/[0.05] border-white/10 text-white" placeholder="Rajesh Kumar"
                                                onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-slate-300">{t('ep_phone')} *</Label>
                                            <div className="flex gap-3">
                                                <div className="bg-white/[0.04] border border-white/10 text-white/40 px-3 py-2 rounded-md text-sm flex items-center">+91</div>
                                                <Input className="bg-white/[0.05] border-white/10 text-white flex-1" placeholder="98765 43210" type="tel"
                                                    onChange={(e) => setFormData(f => ({ ...f, phone: e.target.value }))} />
                                            </div>
                                        </div>

                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-blue-400 font-semibold text-sm uppercase tracking-wide">{t('ep_consult_label')}</p>
                                                <p className="text-slate-400 text-xs">{t('ep_consult_sub')}</p>
                                            </div>
                                            <span className="text-2xl font-bold text-white">₹299</span>
                                        </div>

                                        <Button onClick={handleConnect}
                                            className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                            style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}>
                                            <Phone className="w-5 h-5 mr-2 animate-pulse" />
                                            {t('ep_connect')}
                                        </Button>

                                        <p className="text-center text-xs text-slate-500">
                                            <Shield className="w-3 h-3 inline-block mr-1" />
                                            {t('ep_secure')}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* ── Searching Step ── */}
                            {step === 'searching' && (
                                <motion.div key="searching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="py-12 flex flex-col items-center text-center space-y-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center">
                                            <Phone className="w-10 h-10 text-red-400" />
                                        </div>
                                        <div className="absolute inset-0 rounded-full border-2 border-red-400/30 animate-ping" />
                                        <div className="absolute inset-[-8px] rounded-full border border-red-400/20 animate-ping" style={{ animationDelay: '0.5s' }} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{t('ep_searching_title')}</h3>
                                        <p className="text-slate-400 text-sm">{t('ep_searching_sub')} {formData.state}...</p>
                                    </div>
                                    <Loader2 className="w-6 h-6 text-red-400 animate-spin" />
                                </motion.div>
                            )}

                            {/* ── Matched Step ── */}
                            {step === 'matched' && matchedLawyer && (
                                <motion.div key="matched" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="space-y-6">
                                    <div className="flex items-center gap-3 text-green-400">
                                        <CheckCircle2 className="w-6 h-6" />
                                        <span className="font-bold text-lg">{t('ep_matched_title')}</span>
                                    </div>

                                    <div className="bg-white/[0.04] rounded-2xl p-6 border border-white/[0.07] space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                                <User className="w-7 h-7 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-lg">{matchedLawyer.name || 'SOS Lawyer'}</h4>
                                                <p className="text-slate-400 text-sm">{matchedLawyer.specialization || 'Legal Expert'}</p>
                                            </div>
                                        </div>

                                        <div className="border-t border-slate-700 pt-4 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400 text-sm">{t('ep_status')}</span>
                                                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">{t('ep_available')}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400 text-sm">{t('ep_issue_type')}</span>
                                                <span className="text-white text-sm font-medium">{ISSUE_LABELS[formData.issueType] || formData.issueType}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400 text-sm">{t('ep_location')}</span>
                                                <span className="text-white text-sm">{formData.city || formData.state}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400 text-sm">{t('ep_session')}</span>
                                                <span className="text-slate-500 text-xs font-mono">{sessionId?.slice(0, 8)}...</span>
                                            </div>
                                        </div>
                                    </div>

                                    {matchedLawyer.phone && (
                                        <a href={`tel:+91${matchedLawyer.phone}`}
                                            className="flex items-center justify-center gap-3 w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all hover:scale-[1.02] bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                                            <Phone className="w-5 h-5 animate-pulse" />
                                            {t('ep_call_now')} {matchedLawyer.phone}
                                        </a>
                                    )}

                                    <p className="text-center text-xs text-slate-500">{t('ep_monitored')}</p>

                                    <button onClick={resetForm} className="w-full text-slate-400 hover:text-white text-sm transition-colors">
                                        {t('ep_new_request')}
                                    </button>
                                </motion.div>
                            )}

                            {/* ── No Lawyer Step ── */}
                            {step === 'no_lawyer' && (
                                <motion.div key="no_lawyer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="py-8 space-y-6 text-center">
                                    <div className="w-20 h-20 rounded-full bg-orange-500/20 border-2 border-orange-500/40 flex items-center justify-center mx-auto">
                                        <AlertCircle className="w-10 h-10 text-orange-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">{t('ep_no_lawyer_title')}</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            {t('ep_no_lawyer_sub_1')} <strong className="text-white">{formData.state}</strong> {t('ep_no_lawyer_sub_2')} <strong className="text-white">+91 {formData.phone}</strong> {t('ep_no_lawyer_sub_3')} <strong className="text-white">{t('ep_no_lawyer_sub_4')}</strong>.
                                        </p>
                                    </div>
                                    <div className="bg-white/[0.04] rounded-xl p-4 text-left border border-white/[0.07]">
                                        <p className="text-xs text-slate-400">{t('ep_ref')} <span className="text-white font-mono">{sessionId}</span></p>
                                    </div>
                                    <button onClick={resetForm} className="w-full py-3 rounded-xl text-sm text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors">
                                        {t('ep_try_again')}
                                    </button>
                                </motion.div>
                            )}

                            {/* ── Error Step ── */}
                            {step === 'error' && (
                                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="py-8 space-y-6 text-center">
                                    <X className="w-16 h-16 text-red-400 mx-auto" />
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">{t('ep_error_title')}</h3>
                                        <p className="text-slate-400 text-sm">{t('ep_error_sub')}</p>
                                    </div>
                                    <button onClick={resetForm} className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">
                                        {t('ep_try_again')}
                                    </button>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default EmergencyPage;
