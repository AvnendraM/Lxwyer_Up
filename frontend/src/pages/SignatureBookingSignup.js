import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Scale, User, Mail, Phone, Lock, Calendar, Clock, CreditCard,
  CheckCircle, ArrowLeft, ArrowRight, Loader2, MapPin, Briefcase,
  Shield, Eye, EyeOff, Sparkles
} from 'lucide-react';
import GoldenStars from '../components/GoldenStars';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '../App';

const SignatureNavbar = ({ navigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-[#d4af37]/20 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button onClick={() => navigate('/')} className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white tracking-widest uppercase flex items-center gap-2">
              L X W Y E R <span className="text-[#d4af37]">U P</span>
            </span>
            <div className="h-5 w-px bg-white/20 mx-3 hidden sm:block"></div>
            <span className="text-[#d4af37] text-xl hidden sm:block" style={{ fontFamily: '"Great Vibes", cursive' }}>
              Signature Access
            </span>
          </button>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/50 hover:text-[#d4af37] transition-colors font-medium tracking-wide"
          >
            <ArrowLeft className="w-4 h-4" />
            RETURN
          </button>
        </div>
      </div>
    </nav>
  );
};

// Generate available time slots
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 18; hour++) {
    if (hour !== 13) {
      slots.push(`${hour}:00`);
      if (hour !== 18) slots.push(`${hour}:30`);
    }
  }
  return slots;
};

// Generate available dates (next 14 days, excluding Sundays)
const generateAvailableDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    if (date.getDay() !== 0) {
      dates.push(date);
    }
  }
  return dates;
};

const SignatureBookingSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Extract lawyer from state
  const lawyer = location.state?.lawyer;

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    selectedDate: null,
    selectedTime: '',
    consultationType: 'video',
    caseDescription: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: ''
  });

  const timeSlots = generateTimeSlots();
  const availableDates = generateAvailableDates();

  useEffect(() => {
    if (!lawyer) {
      navigate('/find-lawyer/manual');
      return;
    }
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        updateField('full_name', parsedUser.full_name || parsedUser.name || '');
        updateField('email', parsedUser.email || '');
        setIsExistingUser(true);
      } catch (_) {}
    }
  }, [lawyer, navigate]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (stepNum) => {
    if (stepNum === 1) {
      if (!formData.full_name || !formData.email || !formData.phone || !formData.password) {
        toast.error('Please fill all required fields');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error('Please enter a valid email address');
        return false;
      }
      if (formData.password !== formData.confirm_password) {
        toast.error('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return false;
      }
    }
    if (stepNum === 2) {
      if (!formData.selectedDate || !formData.selectedTime) {
        toast.error('Please select a date and time');
        return false;
      }
    }
    if (stepNum === 3) {
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvv || !formData.cardName) {
        toast.error('Please fill all payment details');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const processPayment = async () => {
    if (!validateStep(3)) return;

    setPaymentProcessing(true);

    setTimeout(async () => {
      setPaymentSuccess(true);
      setPaymentProcessing(false);

      try {
        const response = await axios.post(`${API}/auth/signup`, {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          user_type: 'client'
        });

        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('user', JSON.stringify(response.data.user));

        toast.success('Signature Payment successful!');

        setTimeout(() => {
          setStep(4);
        }, 1000);
      } catch (error) {
        if (error.response?.data?.detail?.includes('already exists')) {
          toast.success('Signature Payment successful!');
          setTimeout(() => {
            setStep(4);
          }, 1000);
        } else {
          toast.error('Account creation failed. Please try again.');
        }
      }
    }, 3000);
  };

  if (!lawyer) return null;

  const consultationFee = parseInt(lawyer.feeMin || lawyer.charge_30min || 15000);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#d4af37] selection:text-black">
      <GoldenStars />
      <SignatureNavbar navigate={navigate} />

      {/* Ambient background shimmer */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(212,175,55,0.15) 0%, transparent 60%)' }} />

      <div className="pt-32 pb-20 max-w-5xl mx-auto px-4 relative z-10">
        
        {/* Elite Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[
            { num: 1, label: 'Concierge' },
            { num: 2, label: 'Itinerary' },
            { num: 3, label: 'Retainer' },
            { num: 4, label: 'Confirmed' }
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold tracking-widest transition-all duration-500 shadow-xl ${s.num === step ? 'bg-[#d4af37] text-black shadow-[#d4af37]/20 border border-[#b5952f]' :
                  s.num < step ? 'bg-white/10 text-[#d4af37] border border-[#d4af37]/50' :
                    'bg-white/5 text-white/30 border border-white/5'
                  }`}>
                  {s.num < step ? <CheckCircle className="w-5 h-5 text-[#d4af37]" /> : s.num}
                </div>
                <span className={`text-xs mt-3 uppercase tracking-widest font-semibold ${s.num <= step ? 'text-[#d4af37]' : 'text-white/30'}`}>
                  {s.label}
                </span>
              </div>
              {idx < 3 && (
                <div className={`w-10 sm:w-20 h-px mx-3 ${s.num < step ? 'bg-gradient-to-r from-[#d4af37] to-[#d4af37]/50' : 'bg-white/10'
                  }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          
          {/* Main Form Area */}
          <div className="md:col-span-3">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#050505] border border-[#d4af37]/20 shadow-[0_0_50px_rgba(212,175,55,0.03)] rounded-3xl p-8 sm:p-10 relative overflow-hidden"
            >
              {/* Internal Watermark */}
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 text-[150px] text-[#d4af37]/[0.02] pointer-events-none whitespace-nowrap" style={{ fontFamily: '"Great Vibes", cursive' }}>
                Signature
              </span>

              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-8 relative z-10">
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-white tracking-wide uppercase mb-2">Priority Access</h2>
                    <p className="text-[#d4af37] text-sm tracking-widest uppercase">Secure your private consultation</p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Client Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d4af37]" />
                        <Input
                          value={formData.full_name}
                          onChange={(e) => updateField('full_name', e.target.value)}
                          readOnly={isExistingUser}
                          placeholder="Legal Name"
                          className={`pl-12 py-6 border-[#d4af37]/30 rounded-xl text-white placeholder:text-white/20 focus:border-[#d4af37] focus:ring-[#d4af37]/20 ${isExistingUser ? 'bg-white/5 cursor-not-allowed' : 'bg-[#0a0a0a]'}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Email Contact</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d4af37]" />
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          readOnly={isExistingUser}
                          placeholder="executive@domain.com"
                          className={`pl-12 py-6 border-[#d4af37]/30 rounded-xl text-white placeholder:text-white/20 focus:border-[#d4af37] focus:ring-[#d4af37]/20 ${isExistingUser ? 'bg-white/5 cursor-not-allowed' : 'bg-[#0a0a0a]'}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Direct Line</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d4af37]" />
                        <Input
                          value={formData.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          placeholder="+91 Private Number"
                          className="pl-12 py-6 bg-[#0a0a0a] border-[#d4af37]/30 rounded-xl text-white placeholder:text-white/20 focus:border-[#d4af37] focus:ring-[#d4af37]/20"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Security Key</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => updateField('password', e.target.value)}
                            placeholder="••••••••"
                            className="pl-12 pr-10 py-6 bg-[#0a0a0a] border-[#d4af37]/30 rounded-xl text-white placeholder:text-white/20 focus:border-[#d4af37] focus:ring-[#d4af37]/20"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#d4af37]"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Verify Key</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                          <Input
                            type="password"
                            value={formData.confirm_password}
                            onChange={(e) => updateField('confirm_password', e.target.value)}
                            placeholder="••••••••"
                            className="pl-12 py-6 bg-[#0a0a0a] border-[#d4af37]/30 rounded-xl text-white placeholder:text-white/20 focus:border-[#d4af37] focus:ring-[#d4af37]/20"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-[#d4af37] to-[#aa8c2c] hover:from-[#e5c158] hover:to-[#b5952f] text-black font-extrabold uppercase tracking-widest rounded-xl py-6 mt-6 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all"
                  >
                    Proceed to Calendar
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                </div>
              )}

              {/* Step 2: Schedule */}
              {step === 2 && (
                <div className="space-y-8 relative z-10">
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-white tracking-wide uppercase mb-2">Private Itinerary</h2>
                    <p className="text-[#d4af37] text-sm tracking-widest uppercase">Reserve your dedicated time</p>
                  </div>

                  {/* Consultation Type */}
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Mode of Presence</label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: 'video', label: 'Encrypted Video', icon: '📹' },
                        { value: 'in-person', label: 'Chamber Visit', icon: '🏛️' },
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() => updateField('consultationType', type.value)}
                          className={`p-5 rounded-2xl border transition-all ${formData.consultationType === type.value
                            ? 'border-[#d4af37] bg-[#d4af37]/10 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                            : 'border-white/10 bg-[#0a0a0a] hover:border-[#d4af37]/50'
                            }`}
                        >
                          <div className="text-3xl mb-2 grayscale opacity-80">{type.icon}</div>
                          <div className={`text-sm font-bold uppercase tracking-wider ${formData.consultationType === type.value ? 'text-[#d4af37]' : 'text-white/60'}`}>{type.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Select Date</label>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                      {availableDates.slice(0, 14).map((date, idx) => {
                        const isSelected = formData.selectedDate?.toDateString() === date.toDateString();
                        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                        const dayNum = date.getDate();
                        const month = date.toLocaleDateString('en-US', { month: 'short' });

                        return (
                          <button
                            key={idx}
                            onClick={() => updateField('selectedDate', date)}
                            className={`p-3 rounded-xl border transition-all text-center ${isSelected
                              ? 'border-[#d4af37] bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20 scale-105'
                              : 'border-white/10 bg-[#0a0a0a] hover:border-[#d4af37]/50 hover:bg-[#d4af37]/5'
                              }`}
                          >
                            <div className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${isSelected ? 'text-black/60' : 'text-white/40'}`}>{dayName}</div>
                            <div className={`text-xl font-black ${isSelected ? 'text-black' : 'text-white'}`}>{dayNum}</div>
                            <div className={`text-[10px] uppercase tracking-widest font-bold mt-1 ${isSelected ? 'text-black/60' : 'text-[#d4af37]'}`}>{month}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Select Time</label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {timeSlots.map((time) => {
                        const isSelected = formData.selectedTime === time;
                        const isAvailable = Math.random() > 0.2;

                        return (
                          <button
                            key={time}
                            onClick={() => isAvailable && updateField('selectedTime', time)}
                            disabled={!isAvailable}
                            className={`py-3 px-3 rounded-xl border text-sm font-bold tracking-wider transition-all ${isSelected
                              ? 'border-[#d4af37] bg-[#d4af37] text-black shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                              : isAvailable
                                ? 'border-white/10 bg-[#0a0a0a] hover:border-[#d4af37]/50 text-white/80'
                                : 'border-black bg-[#111] text-white/20 cursor-not-allowed'
                              }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/5 hover:border-white/40 rounded-xl py-6 px-6"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#aa8c2c] hover:from-[#e5c158] hover:to-[#b5952f] text-black font-extrabold uppercase tracking-widest rounded-xl py-6 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all"
                    >
                      Proceed to Retainer
                      <ArrowRight className="w-5 h-5 ml-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && !paymentSuccess && (
                <div className="space-y-8 relative z-10">
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-white tracking-wide uppercase mb-2">Retainer Deposit</h2>
                    <p className="text-[#d4af37] text-sm tracking-widest uppercase flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Secure Tier Payment
                    </p>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-[#0a0a0a] border border-[#d4af37]/30 rounded-2xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white/60 font-medium tracking-wide uppercase text-xs">Signature Consultation</span>
                      <span className="font-bold text-white text-lg">₹{consultationFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white/60 font-medium tracking-wide uppercase text-xs">Priority Gateway</span>
                      <span className="font-bold text-[#d4af37] text-lg">₹500</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-white/60 font-medium tracking-wide uppercase text-xs">GST (18%)</span>
                      <span className="font-bold text-white text-lg">₹{Math.round((consultationFee + 500) * 0.18).toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-white/10 w-full mb-4" />
                    <div className="flex justify-between items-center">
                      <span className="font-black text-[#d4af37] tracking-widest uppercase">Total Authorization</span>
                      <span className="font-black text-3xl text-white drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">₹{(consultationFee + 500 + Math.round((consultationFee + 500) * 0.18)).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Card Designation</label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d4af37]" />
                        <Input
                          value={formData.cardNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                            const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
                            updateField('cardNumber', formatted);
                          }}
                          placeholder="0000 0000 0000 0000"
                          className="pl-12 py-6 bg-[#0a0a0a] border-[#d4af37]/30 rounded-xl text-white placeholder:text-white/20 focus:border-[#d4af37] focus:ring-[#d4af37]/20 font-mono tracking-widest"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Valid Thru</label>
                        <Input
                          value={formData.cardExpiry}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '').slice(0, 4);
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2);
                            }
                            updateField('cardExpiry', value);
                          }}
                          placeholder="MM/YY"
                          className="py-6 text-center bg-[#0a0a0a] border-[#d4af37]/30 rounded-xl text-white placeholder:text-white/20 focus:border-[#d4af37] font-mono tracking-widest"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">CVC Code</label>
                        <Input
                          value={formData.cardCvv}
                          onChange={(e) => updateField('cardCvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                          placeholder="•••"
                          type="password"
                          className="py-6 text-center bg-[#0a0a0a] border-[#d4af37]/30 rounded-xl text-white placeholder:text-white/20 focus:border-[#d4af37] font-mono tracking-widest"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Cardholder Name</label>
                      <Input
                        value={formData.cardName}
                        onChange={(e) => updateField('cardName', e.target.value.toUpperCase())}
                        placeholder="NAME ON CARD"
                        className="py-6 bg-[#0a0a0a] border-[#d4af37]/30 rounded-xl text-white placeholder:text-white/20 focus:border-[#d4af37] uppercase tracking-widest"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={() => setStep(2)}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/5 hover:border-white/40 rounded-xl py-6 px-6"
                      disabled={paymentProcessing}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={processPayment}
                      disabled={paymentProcessing}
                      className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#aa8c2c] hover:from-[#e5c158] hover:to-[#b5952f] text-black font-extrabold uppercase tracking-widest rounded-xl py-6 shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all"
                    >
                      {paymentProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          Authorizing...
                        </>
                      ) : (
                        <>
                          Authorize ₹{(consultationFee + 500 + Math.round((consultationFee + 500) * 0.18)).toLocaleString()}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <div className="text-center py-12 relative z-10">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', duration: 0.8 }}
                    className="w-28 h-28 bg-[#d4af37]/10 border-2 border-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(212,175,55,0.3)]"
                  >
                    <CheckCircle className="w-14 h-14 text-[#d4af37]" />
                  </motion.div>

                  <h2 className="text-3xl font-black text-white tracking-widest uppercase mb-3">Retained</h2>
                  <p className="text-[#d4af37] text-sm tracking-widest uppercase mb-10">
                    Your appointment with {lawyer.lastName || lawyer.name.split(' ')[1] || 'Counsel'} is locked.
                  </p>

                  <div className="bg-[#0a0a0a] border border-[#d4af37]/30 rounded-2xl p-8 mb-10 text-left relative overflow-hidden">
                    <Sparkles className="absolute top-4 right-4 w-5 h-5 text-[#d4af37]/30" />
                    <h3 className="font-bold text-white tracking-widest uppercase mb-6 text-sm">Verified Booking Data</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Date</span>
                        <span className="font-black text-[#d4af37]">
                          {formData.selectedDate?.toLocaleDateString('en-US', {
                            weekday: 'long', month: 'long', day: 'numeric'
                          }).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Time</span>
                        <span className="font-black text-[#d4af37]">{formData.selectedTime} HRS</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Format</span>
                        <span className="font-black text-[#d4af37] uppercase">{formData.consultationType.replace('-', ' ')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Dossier ID</span>
                        <span className="font-mono text-white/80">#SIG-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={() => navigate('/login')}
                      className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#aa8c2c] hover:from-[#e5c158] hover:to-[#b5952f] text-black font-extrabold uppercase tracking-widest rounded-xl py-6"
                    >
                      Access Dashboard
                    </Button>
                    <Button
                      onClick={() => navigate('/')}
                      variant="outline"
                      className="flex-1 border-[#d4af37]/30 text-white hover:bg-[#d4af37]/10 hover:text-[#d4af37] rounded-xl py-6 uppercase tracking-widest font-bold"
                    >
                      Return Home
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Lawyer Elite Profile Info */}
          <div className="md:col-span-2 hidden md:block">
            <div className="bg-[#050505] border border-[#d4af37]/20 shadow-[0_0_40px_rgba(212,175,55,0.05)] rounded-3xl p-8 sticky top-28 overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Scale className="w-40 h-40" />
              </div>
              
              <div className="flex items-center gap-3 mb-8">
                <Shield className="w-5 h-5 text-[#d4af37]" />
                <h3 className="text-xs font-black text-[#d4af37] tracking-[0.2em] uppercase">Signature Profile</h3>
              </div>

              <div className="flex flex-col gap-6 mb-8 relative z-10">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#d4af37]/50 p-1 bg-[#111]">
                  <img
                    src={lawyer.photo || lawyer.image}
                    alt={lawyer.name}
                    className="w-full h-full object-cover rounded-xl grayscale contrast-125"
                  />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white font-serif tracking-wide mb-1" style={{ fontFamily: '"Playfair Display", serif' }}>{lawyer.name}</h4>
                  <p className="text-xs tracking-widest text-[#d4af37] uppercase font-bold">{lawyer.specialization}</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-white/70 mb-8 font-medium">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                  <Briefcase className="w-5 h-5 text-[#d4af37]" />
                  <span className="tracking-wide">{lawyer.experience} Years Elite Practice</span>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                  <MapPin className="w-5 h-5 text-[#d4af37]" />
                  <span className="tracking-wide text-white uppercase text-xs">{lawyer.location}</span>
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent mb-8" />

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-end p-4 rounded-xl bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/20">
                  <span className="text-[10px] font-black text-white/50 tracking-widest uppercase">Base Retainer</span>
                  <span className="font-black text-xl text-[#d4af37]">₹{consultationFee.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureBookingSignup;
