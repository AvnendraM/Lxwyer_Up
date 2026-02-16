import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

export const NavbarWave = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handle = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handle);
        return () => window.removeEventListener('scroll', handle);
    }, []);

    const links = [
        { label: 'Features', path: '/#features' },
        { label: 'Services', path: '/#services' },
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' },
    ];

    const handleNavigation = (path) => {
        if (path.startsWith('/#')) {
            // Check if we are already on home page
            if (window.location.pathname === '/' || window.location.pathname === '/landing') {
                const element = document.querySelector(path.substring(1));
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            } else {
                navigate('/');
                // Small delay to allow navigation to engage before scrolling
                setTimeout(() => {
                    const element = document.querySelector(path.substring(1));
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }
        } else {
            navigate(path);
        }
    };

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
            style={{
                background: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent',
                backdropFilter: scrolled ? 'blur(24px) saturate(1.4)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
            }}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative flex justify-between items-center py-4">
                <button
                    onClick={() => {
                        navigate('/');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group relative z-10"
                >
                    <span
                        className="text-xl font-bold tracking-tight transition-colors"
                        style={{
                            fontFamily: "'Outfit', sans-serif",
                            color: scrolled ? '#0f172a' : '#1e293b',
                        }}
                    >
                        Lxwyer Up
                    </span>
                </button>

                {/* Desktop Links - Absolutely Centered */}
                <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    {links.map(l => (
                        <button
                            key={l.label}
                            onClick={() => handleNavigation(l.path)}
                            className="text-sm font-medium transition-colors"
                            style={{ color: scrolled ? '#475569' : '#64748b' }}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>

                {/* Desktop CTAs - Right Aligned */}
                <div className="hidden md:flex items-center gap-3 relative z-10">
                    <Button
                        onClick={() => navigate('/login')}
                        className="rounded-full px-6 py-2 text-sm font-medium transition-all"
                        style={{
                            background: 'transparent',
                            color: scrolled ? '#1e293b' : '#334155',
                            border: '1px solid rgba(0,0,0,0.12)',
                        }}
                    >
                        Login
                    </Button>
                    <Button
                        onClick={() => navigate('/role-selection')}
                        className="rounded-full px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all"
                        style={{
                            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                            boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
                        }}
                    >
                        Get Started
                    </Button>
                    {/* LxwyerAI Button */}
                    <Button
                        onClick={() => navigate('/quick-chat')}
                        className="rounded-full px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                        style={{
                            background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                            boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
                        }}
                    >
                        ✦ LxwyerAI
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden relative z-10" style={{ color: '#334155' }} onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden px-6 pb-6 flex flex-col gap-3"
                    style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)' }}
                >
                    {links.map(l => (
                        <button key={l.label} onClick={() => { setMenuOpen(false); handleNavigation(l.path); }} className="text-left py-2 text-sm" style={{ color: '#475569' }}>
                            {l.label}
                        </button>
                    ))}
                    <Button onClick={() => navigate('/login')} className="w-full mt-3 justify-center rounded-full" style={{ border: '1px solid rgba(0,0,0,0.1)', color: '#1e293b', background: 'transparent' }}>Login</Button>
                    <Button onClick={() => navigate('/role-selection')} className="w-full justify-center rounded-full text-white" style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)' }}>Get Started</Button>
                </motion.div>
            )}
        </nav>
    );
};
