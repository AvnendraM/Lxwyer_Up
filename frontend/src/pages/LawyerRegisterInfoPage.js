import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Scale, ArrowLeft, ArrowUpRight, CheckCircle2,
    BarChart2, FileText, Clock, Users, Zap, Briefcase
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useLang } from '../context/LanguageContext';

function DashboardWireframe() {
    return (
        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0d1117] shadow-2xl">
            <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-50 dark:bg-[#161b22] border-b border-slate-100 dark:border-white/[0.05]">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" /><span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" /><span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                <span className="flex-1 text-center text-[10px] font-mono text-slate-400 dark:text-slate-600">Lawyer Dashboard · Lxwyer Up</span>
            </div>
            <div className="flex">
                <div className="w-36 bg-slate-50 dark:bg-[#0a0d12] border-r border-slate-100 dark:border-white/[0.04] p-3 space-y-1">
                    {['Overview', 'Cases', 'Calendar', 'Messages', 'Documents', 'Billing'].map((item, i) => (
                        <div key={i} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium flex items-center gap-2 ${i === 0 ? 'bg-blue-600 text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                            <span className={`w-1 h-1 rounded-full ${i === 0 ? 'bg-blue-200' : 'bg-current opacity-30'}`} />{item}
                        </div>
                    ))}
                </div>
                <div className="flex-1 p-4 space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { l: 'Active Cases', v: '12', d: '+2 this week', c: 'text-slate-900 dark:text-white', blur: false },
                            { l: 'Hearings', v: '4', d: 'Upcoming', c: 'text-blue-600 dark:text-blue-400', blur: false },
                            { l: 'Revenue', v: '₹1.4L', d: '+18% MoM', c: 'text-emerald-600 dark:text-emerald-400', blur: true },
                        ].map((s, i) => (
                            <div key={i} className="p-2.5 rounded-xl border border-slate-100 dark:border-white/[0.05]">
                                <p className="text-[9px] text-slate-400 mb-0.5 uppercase tracking-wider">{s.l}</p>
                                <p className={`text-lg font-black ${s.c} ${s.blur ? 'blur-sm select-none' : ''}`}>{s.v}</p>
                                <p className={`text-[9px] text-slate-400 ${s.blur ? 'blur-sm select-none' : ''}`}>{s.d}</p>
                            </div>
                        ))}
                    </div>
                    <div className="rounded-xl border border-slate-100 dark:border-white/[0.05] p-3">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Active Cases</p>
                        {['Sharma v. State · IPC 302 · Hearing Due', 'Mehta Property Dispute · Ongoing', 'Corporate Contract Review'].map((c, i) => (
                            <div key={i} className="flex items-center gap-2 py-1.5 border-b border-slate-50 dark:border-white/[0.04] last:border-0">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === 0 ? 'bg-blue-500' : 'bg-slate-300 dark:bg-white/20'}`} />
                                <span className="text-[10px] text-slate-600 dark:text-slate-400 blur-sm select-none">{c}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LawyerRegisterInfoPage() {
    const navigate = useNavigate();
    const { t } = useLang();
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const features = [
        { icon: Zap,       title: t('lri_f1_title'), desc: t('lri_f1_desc') },
        { icon: BarChart2, title: t('lri_f2_title'), desc: t('lri_f2_desc') },
        { icon: FileText,  title: t('lri_f3_title'), desc: t('lri_f3_desc') },
        { icon: Clock,     title: t('lri_f4_title'), desc: t('lri_f4_desc') },
        { icon: Users,     title: t('lri_f5_title'), desc: t('lri_f5_desc') },
        { icon: Briefcase, title: t('lri_f6_title'), desc: t('lri_f6_desc') },
    ];

    const metrics = [
        { value: '2×',     label: t('lri_m1') },
        { value: '48 hrs', label: t('lri_m2') },
        { value: '100%',   label: t('lri_m3') },
    ];

    return (
        <div className="min-h-screen bg-black text-white transition-colors duration-300" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            <Navbar minimal />

            {/* Hero */}
            <div className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-50/50 via-transparent to-transparent dark:from-blue-950/20 dark:via-transparent dark:to-transparent -z-10" />

                <div className="max-w-6xl mx-auto px-6 mb-8">
                    <button onClick={() => navigate('/register')} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> {t('lri_back')}
                    </button>
                </div>

                <div className="max-w-6xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                            <span className="text-[10px] sm:text-xs font-bold text-blue-700 dark:text-blue-300 tracking-wider uppercase">
                                {t('lri_badge')}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4 max-w-2xl">
                            {t('lri_hero')}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg font-light leading-relaxed max-w-xl">
                            {t('lri_sub')}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 pb-24 pt-10">

                {/* CTA + Dashboard */}
                <div className="grid lg:grid-cols-2 gap-14 items-start mb-20">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-8 font-light max-w-md">
                            {t('lri_desc')}
                        </p>
                        <button
                            onClick={() => navigate('/lawyer-application')}
                            className="flex items-center gap-2 px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/25 hover:-translate-y-0.5 mb-3"
                        >
                            {t('lri_apply_btn')} <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{t('lri_apply_note')}</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                        <DashboardWireframe />
                        <p className="text-center text-[11px] text-slate-400 dark:text-slate-600 mt-3 tracking-wide">{t('lri_dashboard_cap')}</p>
                    </motion.div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                    {metrics.map((m, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }} className="p-6 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-white/[0.06]">
                            <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-1">{m.value}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">{m.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Features */}
                <div className="mb-20">
                    <p className="text-[11px] tracking-[0.22em] uppercase text-blue-600 dark:text-blue-400 font-semibold mb-3">{t('lri_what_get')}</p>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-10">{t('lri_built_for')}</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <motion.div key={i} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }} className="p-6 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-white/[0.06] hover:border-blue-200 dark:hover:border-blue-500/25 transition-all">
                                    <div className="w-9 h-9 rounded-lg bg-blue-600/10 dark:bg-blue-500/10 flex items-center justify-center mb-4">
                                        <Icon className="text-blue-600 dark:text-blue-400" strokeWidth={1.5} size={17} />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">{f.title}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">{f.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA block */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-2xl bg-slate-900 dark:bg-blue-950/40 dark:border dark:border-blue-500/20 p-10 md:p-14">
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg,white 0,white 1px,transparent 0,transparent 40px),repeating-linear-gradient(90deg,white 0,white 1px,transparent 0,transparent 40px)' }} />
                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <div>
                            <p className="text-[10px] tracking-[0.2em] uppercase text-blue-400 font-semibold mb-2">{t('lri_step')}</p>
                            <h3 className="text-3xl font-black text-white mb-2 tracking-tight">{t('lri_cta_h')}</h3>
                            <p className="text-slate-400 text-sm font-light max-w-md">{t('lri_cta_sub')}</p>
                        </div>
                        <button onClick={() => navigate('/lawyer-application')} className="flex items-center gap-2 shrink-0 px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 group">
                            <CheckCircle2 className="w-4 h-4" /> {t('lri_begin')} <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
