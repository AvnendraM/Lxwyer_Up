import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, MapPin, Shield, Clock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const EmergencyPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        state: '',
        area: '',
        lawyerType: '',
        name: '',
        phone: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleBooking = () => {
        // Mock booking logic -> redirect to payment or confirmation
        // For now, just show a success alert or console log
        console.log('Booking Emergency Call:', formData);
        // In a real app, this would trigger a payment gateway
        alert('Redirecting to secure payment gateway for ₹299...');
    };

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ background: '#0f172a' }}>
            {/* ── Background Effects ── */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-red-600/20 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[100px]" />
            </div>

            {/* ── Navbar (Simplified) ── */}
            <nav className="relative z-20 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
                <div className="font-bold text-2xl text-white tracking-tight cursor-pointer" onClick={() => navigate('/')} style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Lxwyer Up <span className="text-red-500">SOS</span>
                </div>
                <Button
                    variant="ghost"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => navigate('/')}
                >
                    Back to Home
                </Button>
            </nav>

            {/* ── Main Content ── */}
            <main className="relative z-10 container mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-16">

                {/* Left: Hero Text */}
                <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-medium text-sm"
                    >
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        Urgent Legal Assistance
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl lg:text-7xl font-bold text-white leading-[1.1]"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        Talk to a Lawyer <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                            Instantly
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                    >
                        Facing an arrest, sudden legal notice, or immediate dispute?
                        Connect with a verified lawyer in your area within minutes.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <p className="text-white font-semibold">Verified Lawyers</p>
                                <p className="text-xs text-slate-500">Bar Council Registered</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <p className="text-white font-semibold">24/7 Availability</p>
                                <p className="text-xs text-slate-500">Instant Connection</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Booking Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="lg:w-1/2 w-full max-w-md mx-auto relative"
                >
                    {/* Glow effect behind form */}
                    <div className="absolute inset-0 bg-gradient-to-b from-red-500/20 to-blue-500/5 blur-3xl rounded-3xl" />

                    <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-white mb-2">Details for Call</h3>
                            <p className="text-slate-400 text-sm">Fill in your location to find the nearest expert.</p>
                        </div>

                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">State</Label>
                                    <Select onValueChange={(v) => setFormData({ ...formData, state: v })}>
                                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                            {['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Haryana'].map(s => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">City / Area</Label>
                                    <Input
                                        className="bg-slate-800 border-slate-700 text-white"
                                        placeholder="e.g. Connaught Place"
                                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-300">Legal Issue Type</Label>
                                <Select onValueChange={(v) => setFormData({ ...formData, lawyerType: v })}>
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                        <SelectValue placeholder="Select type of lawyer needed" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                        <SelectItem value="criminal">Criminal Defense (Arrest/Bail)</SelectItem>
                                        <SelectItem value="family">Family Dispute / Domestic</SelectItem>
                                        <SelectItem value="civil">Property / Civil Dispute</SelectItem>
                                        <SelectItem value="cyber">Cyber Crime / Fraud</SelectItem>
                                        <SelectItem value="traffic">Traffic / Accident</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-300">Your Phone Number</Label>
                                <div className="flex gap-3">
                                    <div className="bg-slate-800 border border-slate-700 text-slate-400 px-3 py-2 rounded-md text-sm flex items-center">
                                        +91
                                    </div>
                                    <Input
                                        className="bg-slate-800 border-slate-700 text-white flex-1"
                                        placeholder="98765 43210"
                                        type="tel"
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Price Tag */}
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-blue-400 font-semibold text-sm uppercase tracking-wide">Emergency Consultation</p>
                                    <p className="text-slate-400 text-xs">Priority connection • 10 Mins</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-white">₹299</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleBooking}
                                className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                style={{
                                    background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                                }}
                            >
                                <Phone className="w-5 h-5 mr-2 animate-pulse" />
                                Connect Now
                            </Button>

                            <p className="text-center text-xs text-slate-500 mt-4">
                                <Shield className="w-3 h-3 inline-block mr-1" />
                                Secure Payment • Confidential Call
                            </p>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default EmergencyPage;
