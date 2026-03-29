import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Gavel, BookOpen, UserCheck, Clock, ShieldCheck, MessagesSquare,
    FileSignature, Siren, BarChart2, Scale, ArrowRight, Star, CheckCircle,
} from 'lucide-react';
import { NavbarWave } from '../components/NavbarWave';

/* ── CSS animation injection ──────────────────────────────────────── */
const CSS = `
@keyframes spEnter {
  from { opacity:0; transform:translateY(24px); }
  to   { opacity:1; transform:translateY(0); }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('sp-css')) {
    const s = document.createElement('style');
    s.id = 'sp-css';
    s.textContent = CSS;
    document.head.appendChild(s);
}

/* ── Data ──────────────────────────────────────────────────────────── */
const SERVICES = [
    {
        icon: Gavel,
        title: 'Court Representation',
        desc: 'Professional representation in courts across India by experienced, verified advocates — from district courts to High Courts.',
        color: '#3b82f6',
        glow: 'rgba(59,130,246,.15)',
        bg: 'bg-blue-50 dark:bg-blue-950/20',
        border: 'border-blue-200/60 dark:border-blue-800/50',
        iconColor: 'text-blue-600 dark:text-blue-400',
        points: ['District & High Court advocates', 'Criminal & civil cases', 'Bail & appeal support'],
    },
    {
        icon: BookOpen,
        title: 'Legal Documentation',
        desc: 'Expert drafting and review of contracts, agreements, notices, and other legal documents — precise, clear, and court-ready.',
        color: '#8b5cf6',
        glow: 'rgba(139,92,246,.15)',
        bg: 'bg-violet-50 dark:bg-violet-950/20',
        border: 'border-violet-200/60 dark:border-violet-800/50',
        iconColor: 'text-violet-600 dark:text-violet-400',
        points: ['Contracts & agreements', 'Legal notices & affidavits', 'Property & rent deeds'],
    },
    {
        icon: UserCheck,
        title: 'Lawyer Verification',
        desc: 'Every lawyer on LxwyerUp is verified with Bar Council credentials, client reviews, and case history — so you always know who you\'re trusting.',
        color: '#10b981',
        glow: 'rgba(16,185,129,.15)',
        bg: 'bg-emerald-50 dark:bg-emerald-950/20',
        border: 'border-emerald-200/60 dark:border-emerald-800/50',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        points: ['Bar Council verified', 'Client ratings & reviews', 'Case history transparency'],
    },
    {
        icon: Siren,
        title: 'SOS Legal Support',
        desc: 'One-click access to verified lawyers in urgent legal situations. Immediate guidance, faster intake, and confident action during critical moments.',
        color: '#ef4444',
        glow: 'rgba(239,68,68,.15)',
        bg: 'bg-red-50 dark:bg-red-950/20',
        border: 'border-red-200/60 dark:border-red-800/50',
        iconColor: 'text-red-500 dark:text-red-400',
        points: ['24/7 emergency access', 'Immediate consultation', 'Priority response queue'],
    },
    {
        icon: FileSignature,
        title: 'Digital Signatures',
        desc: 'Court-admissible digital signatures that are tamper-proof, timestamped, and legally recognised — no printing or scanning required.',
        color: '#f59e0b',
        glow: 'rgba(245,158,11,.15)',
        bg: 'bg-amber-50 dark:bg-amber-950/20',
        border: 'border-amber-200/60 dark:border-amber-800/50',
        iconColor: 'text-amber-600 dark:text-amber-400',
        points: ['Blockchain-verified', 'Legally admissible in India', 'Timestamped audit trail'],
    },
    {
        icon: MessagesSquare,
        title: 'AI Legal Guidance',
        desc: 'Get instant, plain-language answers to your legal questions through our Gemini-powered AI chatbot — available 24/7, no appointment needed.',
        color: '#06b6d4',
        glow: 'rgba(6,182,212,.15)',
        bg: 'bg-cyan-50 dark:bg-cyan-950/20',
        border: 'border-cyan-200/60 dark:border-cyan-800/50',
        iconColor: 'text-cyan-600 dark:text-cyan-400',
        points: ['Plain-language answers', 'Powered by Gemini AI', 'Available 24/7'],
    },
    {
        icon: Scale,
        title: 'Case Tracking',
        desc: 'Monitor your case in real-time — status, hearing dates, key milestones, and upcoming deadlines, all in one clean dashboard.',
        color: '#6366f1',
        glow: 'rgba(99,102,241,.15)',
        bg: 'bg-indigo-50 dark:bg-indigo-950/20',
        border: 'border-indigo-200/60 dark:border-indigo-800/50',
        iconColor: 'text-indigo-500 dark:text-indigo-400',
        points: ['Live case status', 'Hearing reminders', 'Milestone tracking'],
    },
    {
        icon: ShieldCheck,
        title: 'Secure Documents',
        desc: 'Upload, organise, and share legal documents with end-to-end encryption. Accessible from any device, always safe.',
        color: '#14b8a6',
        glow: 'rgba(20,184,166,.15)',
        bg: 'bg-teal-50 dark:bg-teal-950/20',
        border: 'border-teal-200/60 dark:border-teal-800/50',
        iconColor: 'text-teal-600 dark:text-teal-400',
        points: ['End-to-end encrypted', 'Lawyer-client sharing', 'Any device access'],
    },
];

/* ── Service Card ─────────────────────────────────────────────────── */
function ServiceCard({ svc, index }) {
    return (
        <div
            className={`group relative rounded-3xl border ${svc.border} ${svc.bg} p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            style={{
                animationName: 'spEnter',
                animationDuration: '0.5s',
                animationTimingFunction: 'cubic-bezier(.22,.68,0,1.2)',
                animationFillMode: 'both',
                animationDelay: `${index * 0.06}s`,
            }}
        >
            {/* Glow orb */}
            <div
                className="absolute -top-6 -right-6 w-28 h-28 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: svc.glow }}
            />

            <div className="relative">
                {/* Icon */}
                <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: svc.glow, border: `1px solid ${svc.color}25` }}
                >
                    <svc.icon className={`w-7 h-7 ${svc.iconColor}`} />
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 transition-colors">{svc.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5">{svc.desc}</p>

                {/* Bullet points */}
                <ul className="space-y-1.5">
                    {svc.points.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${svc.iconColor}`} />
                            {p}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

/* ── Page ─────────────────────────────────────────────────────────── */
export default function ServicesPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-[#050813] text-slate-900 dark:text-white transition-colors duration-300">
            <NavbarWave />

            {/* ── HERO ──────────────────────────────────────────────────── */}
            <section className="pt-36 pb-20 px-6 text-center">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
                    <Star size={12} /> Professional Legal Services
                </div>
                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900 dark:text-white">
                    Services{' '}
                    <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                        We Offer
                    </span>
                </h1>
                <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10">
                    From AI-powered guidance to court representation — LxwyerUp provides every legal service you need, right at your fingertips.
                </p>
                <button
                    onClick={() => navigate('/user-get-started')}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl inline-flex items-center gap-2 transition-all hover:gap-3 text-sm"
                >
                    Consult Now <ArrowRight size={16} />
                </button>
            </section>

            {/* ── SERVICES GRID ─────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 pb-24">
                <div className="text-center mb-14">
                    <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">What We Do</span>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2 transition-colors">
                        Everything under one roof
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SERVICES.map((svc, i) => (
                        <ServiceCard key={svc.title} svc={svc} index={i} />
                    ))}
                </div>
            </section>

            {/* ── WHY US STRIP ──────────────────────────────────────────── */}
            <section className="bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200/60 dark:border-slate-800 py-16 px-6 transition-colors duration-300">
                <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-10 text-center">
                    {[
                        { stat: '10,000+', label: 'Cases Handled', icon: BarChart2 },
                        { stat: '500+', label: 'Verified Lawyers', icon: UserCheck },
                        { stat: '24/7', label: 'AI Support', icon: MessagesSquare },
                    ].map(({ stat, label, icon: Icon }) => (
                        <div key={label} className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stat}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ───────────────────────────────────────────────────── */}
            <section className="max-w-4xl mx-auto px-6 py-28 text-center">
                <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-blue-50 dark:bg-gradient-to-br dark:from-blue-950/40 dark:to-slate-950 p-12 transition-colors duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
                    <div className="relative">
                        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-slate-900 dark:text-white transition-colors">
                            Ready to Get Legal Help?
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                            Start your journey towards justice today. Our team is ready to assist you.
                        </p>
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            <button
                                onClick={() => navigate('/user-get-started')}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 transition-all hover:gap-3 text-sm"
                            >
                                Consult Now <ArrowRight size={16} />
                            </button>
                            <button
                                onClick={() => navigate('/contact')}
                                className="border border-slate-300 dark:border-slate-700 hover:border-slate-500 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all"
                            >
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
