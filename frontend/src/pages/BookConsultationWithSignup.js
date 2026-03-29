import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Phone, Mail, CreditCard, Check, ArrowRight, Shield, Lock, Scale, MapPin, Briefcase, ArrowLeft, Star, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '../App';
import { WaveLayout } from '../components/WaveLayout';
import { Button } from '../components/ui/button';
import GoogleSignupButton from '../components/GoogleSignupButton';
import IndianPhoneInput from '../components/IndianPhoneInput';
import OtpVerificationModal from '../components/OtpVerificationModal';
import { useLang } from '../context/LanguageContext';

export default function BookConsultationWithSignup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLang();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const selectedLawyer = location.state?.lawyer || null;
  // const selectedLawyer = location.state?.lawyer || {
  //   name: "Verification Firm",
  //   specialization: "Corporate Law",
  //   experience: 15,
  //   city: "New Delhi",
  //   consultation_fee: 7500,
  //   feeMin: 7500
  // };

  const [signupData, setSignupData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: ''
  });

  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    description: '',
    consultationType: 'video'
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [isExistingUser, setIsExistingUser] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setSignupData({
          full_name: parsedUser.full_name || parsedUser.name || '',
          email: parsedUser.email || '',
          phone: parsedUser.phone || '',
          password: 'dummy_existing_user_password'
        });
        setIsExistingUser(true);
        // Automatically skip the signup step
        setStep(2);
      } catch (err) {
        console.error('Error parsing stored user', err);
      }
    }
  }, []);

  // Null guard — redirect if page is visited directly without a lawyer
  if (!selectedLawyer) {
    return (
      <WaveLayout>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">No lawyer selected. Please find a lawyer first.</p>
          <button
            onClick={() => navigate('/find-lawyer/manual')}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
          >
            Find a Lawyer
          </button>
        </div>
      </WaveLayout>
    );
  }

  const getFeeAmount = () => {
    // Helper to parse string "₹5,000" -> 5000
    const parseFeeString = (str) => {
      if (!str) return null;
      const match = str.toString().match(/₹?([\d,]+)/);
      if (match) {
        return parseInt(match[1].replace(/,/g, ''));
      }
      return null;
    };

    // 0. Explicit check for Law Firm generic fee if present
    if (selectedLawyer.firm_fee) { // specific field for firms if used
      const parsed = parseFeeString(selectedLawyer.firm_fee);
      if (parsed) return parsed;
    }

    // 1. Direct consultation_fee (backend/formatted)
    if (selectedLawyer.consultation_fee) {
      if (typeof selectedLawyer.consultation_fee === 'number') return selectedLawyer.consultation_fee;
      const parsed = parseFeeString(selectedLawyer.consultation_fee);
      if (parsed) return parsed;
    }

    // 2. Generic fee (formatted)
    if (selectedLawyer.fee) {
      if (typeof selectedLawyer.fee === 'number') return selectedLawyer.fee;
      const parsed = parseFeeString(selectedLawyer.fee);
      if (parsed) return parsed;
    }

    // 3. Fee Range (backend raw) - take the lower bound
    if (selectedLawyer.fee_range) {
      const parsed = parseFeeString(selectedLawyer.fee_range);
      if (parsed) return parsed;
    }

    // 4. Dummy Data (feeMin)
    if (selectedLawyer.feeMin) {
      return selectedLawyer.feeMin;
    }

    // 5. Fallback for law firms if they have 'price' or 'cost'
    if (selectedLawyer.price) {
      const parsed = parseFeeString(selectedLawyer.price);
      if (parsed) return parsed;
    }

    // Default fallback
    return 2000; // Reasonable default for a firm/lawyer
  };

  const consultationFee = getFeeAmount();

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!signupData.full_name || !signupData.email || !signupData.phone || !signupData.password) {
      toast.error('Please fill all signup fields');
      return;
    }
    if (signupData.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    setOtpModalOpen(true);
  };

  const handleGoogleSignup = async (googleData) => {
    setSignupData(prev => ({
      ...prev,
      full_name: googleData.name,
      email: googleData.email,
      phone: googleData.phone,
      password: `google_${Date.now()}`, // placeholder, won't be used
      _googleToken: googleData.accessToken,
    }));
    setStep(2);
    toast.success('Google account connected! Continue to booking.');
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingData.date || !bookingData.time) {
      toast.error('Please select date and time');
      return;
    }
    setStep(3);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Try both storage locations
      let currentToken = sessionStorage.getItem('token') || localStorage.getItem('token');

      // Detect if current token belongs to a non-client (lawyer/firm) — reject it
      let storedUser = null;
      try { storedUser = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user') || 'null'); } catch (_) { }
      const storedUserType = (storedUser?.user_type || storedUser?.role || '').toLowerCase();
      const isClientToken = storedUserType === 'client' || storedUserType === 'user';

      // Re-signup/login as client if no client token
      if (!isExistingUser || !currentToken || !isClientToken) {
        const userPayload = { ...signupData, user_type: 'client' };
        try {
          const signupResponse = await axios.post(`${API}/auth/signup`, userPayload);
          currentToken = signupResponse.data.token;
          sessionStorage.setItem('token', currentToken);
          sessionStorage.setItem('user', JSON.stringify(signupResponse.data.user));
        } catch (signupErr) {
          if (signupErr.response?.data?.detail?.includes('already exists')) {
            try {
              const loginRes = await axios.post(`${API}/auth/login`, { email: signupData.email, password: signupData.password });
              currentToken = loginRes.data.token;
              sessionStorage.setItem('token', currentToken);
              sessionStorage.setItem('user', JSON.stringify(loginRes.data.user));
            } catch (_) { throw signupErr; }
          } else { throw signupErr; }
        }
      }

      const bookingPayload = {
        lawyer_id: selectedLawyer.id,
        lawyer_name: selectedLawyer.name || selectedLawyer.full_name || '',
        lawyer_photo: selectedLawyer.photo || '',
        consultation_fee: consultationFee,   // lawyer's listed fee (even for free trial)
        date: bookingData.date,
        time: bookingData.time,
        consultation_type: bookingData.consultationType,
        description: bookingData.description,
        amount: consultationFee,
        status: 'pending',
        payment_status: 'paid',
        payment_method: 'card',
        card_last_four: paymentData.cardNumber.slice(-4)
      };

      await axios.post(`${API}/bookings`, bookingPayload, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });

      toast.success(isExistingUser ? 'Booking confirmed!' : 'Account created and booking confirmed!');
      setStep(4);

    } catch (error) {
      console.error('Error:', error);
      if (error.response?.data?.detail?.includes('already exists')) {
        toast.error('Email already registered. Please login instead.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(error.response?.data?.detail || 'Booking failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/user-dashboard');
  };

  return (
    <WaveLayout hideNavbar={true}>
      <OtpVerificationModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        onVerified={() => { setOtpModalOpen(false); setStep(2); }}
        email={signupData.email}
        phone={signupData.phone}
      />
      <div className="min-h-screen pt-20 pb-12 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">

          {/* Header & Back */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
              className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/60 dark:border-slate-700 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('bcs_back')}</span>
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 dark:text-white">{t('bcs_booking_title')}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('bcs_step_of')} {step} of 4</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Left Column: Lawyer Info & Progress */}
            <div className="lg:col-span-1 space-y-6">

              {/* Progress Steps (Vertical on large screens) */}
              <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-white/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="flex lg:flex-col justify-between lg:gap-8">
                  {[
                    { num: 1, labelKey: 'bcs_step_signup', icon: User },
                    { num: 2, labelKey: 'bcs_step_booking', icon: Calendar },
                    { num: 3, labelKey: 'bcs_step_payment', icon: CreditCard },
                    { num: 4, labelKey: 'bcs_step_confirm', icon: Check }
                  ].map((s) => (
                    <div key={s.num} className="flex items-center gap-3 relative">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all relative z-10
                        ${step > s.num ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-300 dark:text-slate-600'}
                      `}>
                        {step > s.num ? <Check className="w-5 h-5" /> : s.icon && <s.icon className="w-4 h-4" />}
                      </div>
                      <span className={`hidden lg:block font-medium ${step >= s.num ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-600'}`}>
                        {t(s.labelKey)}
                      </span>
                      {s.num < 4 && (
                        <div className={`
                          hidden lg:block absolute left-5 top-10 w-0.5 h-8 -ml-px transition-all
                          ${step > s.num ? 'bg-blue-600' : 'bg-slate-100 dark:bg-slate-800'}
                        `} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Lawyer Card */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 rounded-3xl p-6 shadow-lg shadow-blue-900/5 dark:shadow-blue-900/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 border border-blue-100 dark:border-slate-700 flex items-center justify-center shadow-sm">
                      <Scale className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{selectedLawyer.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-4">{selectedLawyer.specialization}</p>

                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Briefcase className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      <span>{selectedLawyer.experience || '10+'} years experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      <span>{selectedLawyer.city}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">{t('bcs_consult_fee')}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{consultationFee}</p>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200">{t('bcs_secure')}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('bcs_secure_sub')}</p>
                </div>
              </div>

            </div>

            {/* Right Column: Dynamic Form Steps */}
            <div className="lg:col-span-2">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none h-full"
              >

                {/* Step 1: Signup Form */}
                {step === 1 && (
                  <div className="max-w-lg mx-auto">
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-outfit">{t('bcs_create_acc')}</h2>
                      <p className="text-slate-500 dark:text-slate-400">{t('bcs_create_sub')}</p>
                    </div>

                    {/* Google Signup */}
                    <GoogleSignupButton onSuccess={handleGoogleSignup} theme="light" />

                    {/* OR Divider */}
                    <div className="flex items-center gap-4 my-4">
                      <div className="flex-1 h-px bg-slate-200" />
                      <span className="text-xs text-slate-400 font-medium">OR</span>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    <form onSubmit={handleSignupSubmit} className="space-y-5">
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">{t('bcs_full_name')}</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                          <input
                            type="text"
                            required
                            value={signupData.full_name}
                            onChange={(e) => setSignupData({ ...signupData, full_name: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">{t('bcs_email')}</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                          <input
                            type="email"
                            required
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <IndianPhoneInput
                        value={signupData.phone}
                        onChange={(digits) => setSignupData({ ...signupData, phone: digits })}
                        label="Phone Number"
                        required
                        className="space-y-1"
                      />

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">{t('bcs_password')}</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                            className="w-full pl-12 pr-12 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/25 py-6 rounded-xl text-lg font-semibold">
                          {t('bcs_continue')} <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </div>

                      <p className="text-center text-sm text-slate-500 mt-4">
                        {t('bcs_have_account')}{' '}
                        <button
                          type="button"
                          onClick={() => navigate('/login', { state: { lawyer: selectedLawyer } })}
                          className="text-blue-600 font-bold hover:underline"
                        >
                          {t('bcs_login')}
                        </button>
                      </p>
                    </form>
                  </div>
                )}

                {/* Step 2: Booking Details */}
                {step === 2 && (
                  <div className="max-w-lg mx-auto">
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-outfit">{t('bcs_select_time')}</h2>
                      <p className="text-slate-500 dark:text-slate-400">{t('bcs_select_time_sub')}</p>
                    </div>

                    <form onSubmit={handleBookingSubmit} className="space-y-6">
                      {/* Consultation Type */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 mb-3">{t('bcs_consult_type')}</label>
                        {(() => {
                          // ── Strict preference resolution ─────────────────────────
                          // Read from every possible field name the backend might set
                          const rawPref = (
                            selectedLawyer?.consultation_preferences ||
                            selectedLawyer?.consultation_type ||
                            selectedLawyer?.preferred_consultation_type ||
                            selectedLawyer?.consultationType ||
                            ''
                          ).toString().toLowerCase().trim();

                          // Normalise: "video call only" → "video", "in-person" → "in_person"
                          const pref = rawPref.includes('in_person') || rawPref.includes('in-person') || rawPref.includes('in person')
                            ? 'in_person'
                            : rawPref.includes('video')
                              ? 'video'
                              : rawPref === 'both' || rawPref === ''
                                ? 'both'
                                : rawPref;

                          const supportsVideo = pref === 'both' || pref === 'video';
                          const supportsInPerson = pref === 'both' || pref === 'in_person';

                          const typeOptions = [
                            ...(supportsVideo ? [{ value: 'video', label: 'Video Call', icon: '🎥' }] : []),
                            ...(supportsInPerson ? [{ value: 'in_person', label: 'In-Person', icon: '🏛️' }] : []),
                          ];

                          // Fallback: always show video if nothing resolved
                          if (typeOptions.length === 0) typeOptions.push({ value: 'video', label: 'Video Call', icon: '🎥' });

                          // Auto-select if only one option
                          if (typeOptions.length === 1 && bookingData.consultationType !== typeOptions[0].value) {
                            setTimeout(() => setBookingData(prev => ({ ...prev, consultationType: typeOptions[0].value })), 0);
                          }

                          return (
                            <div className={`grid gap-3 ${typeOptions.length === 1 ? 'grid-cols-1' : typeOptions.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                              {typeOptions.map((type) => (
                                <button
                                  key={type.value}
                                  type="button"
                                  onClick={() => setBookingData({ ...bookingData, consultationType: type.value })}
                                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${bookingData.consultationType === type.value
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500/50 bg-white dark:bg-slate-900/50'
                                    }`}
                                >
                                  <div className="text-2xl">{type.icon}</div>
                                  <div className={`text-sm font-semibold ${bookingData.consultationType === type.value ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {type.label}
                                  </div>
                                </button>
                              ))}
                            </div>
                          );
                        })()}
                      </div>


                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">{t('bcs_date')}</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="date"
                              required
                              min={new Date().toISOString().split('T')[0]}
                              value={bookingData.date}
                              onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">{t('bcs_time')}</label>
                          <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select
                              required
                              value={bookingData.time}
                              onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm appearance-none"
                            >
                              <option value="">Select Time</option>
                              <option value="10:00 AM">10:00 AM</option>
                              <option value="11:00 AM">11:00 AM</option>
                              <option value="12:00 PM">12:00 PM</option>
                              <option value="2:00 PM">2:00 PM</option>
                              <option value="3:00 PM">3:00 PM</option>
                              <option value="4:00 PM">4:00 PM</option>
                              <option value="5:00 PM">5:00 PM</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">{t('bcs_desc')}</label>
                        <textarea
                          rows={4}
                          value={bookingData.description}
                          onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                          className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
                          placeholder={t('bcs_desc_ph')}
                        />
                      </div>

                      <div className="pt-4">
                        <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/25 py-6 rounded-xl text-lg font-semibold">
                          {t('bcs_proceed_pay')} <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <div className="max-w-lg mx-auto">
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-outfit">{t('bcs_payment_title')}</h2>
                      <p className="text-slate-500 dark:text-slate-400">{t('bcs_payment_sub')}</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 mb-8">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">{t('bcs_order_summary')}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>{t('bcs_consult_with')}</span>
                          <span className="font-medium text-slate-900 dark:text-white">{selectedLawyer.name}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>{t('bcs_date_time')}</span>
                          <span className="font-medium text-slate-900 dark:text-white">{bookingData.date}, {bookingData.time}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800 mt-2">
                          <span className="font-semibold">{t('bcs_total')}</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">₹{consultationFee}</span>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handlePaymentSubmit} className="space-y-5">
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">{t('bcs_card_number')}</label>
                        <div className="relative group">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                          <input
                            type="text"
                            required
                            maxLength={16}
                            value={paymentData.cardNumber}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              setPaymentData({ ...paymentData, cardNumber: value });
                            }}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                            placeholder="0000 0000 0000 0000"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">{t('bcs_card_name')}</label>
                        <input
                          type="text"
                          required
                          value={paymentData.cardName}
                          onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                          className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                          placeholder="NAME ON CARD"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">{t('bcs_expiry')}</label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            placeholder="MM/YY"
                            value={paymentData.expiryDate}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
                              setPaymentData({ ...paymentData, expiryDate: value });
                            }}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">{t('bcs_cvv')}</label>
                          <input
                            type="password"
                            required
                            maxLength={3}
                            placeholder="123"
                            value={paymentData.cvv}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              setPaymentData({ ...paymentData, cvv: value });
                            }}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/25 py-6 rounded-xl text-lg font-semibold disabled:opacity-70">
                          {loading ? <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> {t('bcs_processing')}</span> : `${t('bcs_pay')} ₹${consultationFee}`}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Step 4: Success */}
                {step === 4 && (
                  <div className="text-center max-w-lg mx-auto py-8">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <Check className="w-12 h-12 text-green-600" />
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-outfit">{t('bcs_confirmed_title')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">{t('bcs_confirmed_sub')}</p>

                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-8 text-left max-w-md mx-auto">
                      <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-700 pb-4">
                        <span className="text-slate-500 dark:text-slate-400 text-sm">{t('bcs_booking_id')}</span>
                        <span className="text-slate-900 dark:text-white font-mono text-sm bg-white dark:bg-slate-900/50 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">#{Math.floor(Math.random() * 100000)}</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400 text-sm">{t('bcs_client')}</span>
                          <span className="font-medium text-slate-900 dark:text-white text-sm">{signupData.full_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400 text-sm">{t('bcs_lawyer')}</span>
                          <span className="font-medium text-slate-900 dark:text-white text-sm">{selectedLawyer.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400 text-sm">{t('bcs_date_time')}</span>
                          <span className="font-medium text-slate-900 dark:text-white text-sm">{bookingData.date}, {bookingData.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button onClick={handleLoginRedirect} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 px-8 py-6 rounded-xl text-base font-semibold">
                        {t('bcs_go_dashboard')}
                      </Button>
                      <Button onClick={() => navigate('/')} variant="outline" className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-8 py-6 rounded-xl text-base font-semibold">
                        {t('bcs_back_home')}
                      </Button>
                    </div>
                  </div>
                )}

              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </WaveLayout>
  );
}
