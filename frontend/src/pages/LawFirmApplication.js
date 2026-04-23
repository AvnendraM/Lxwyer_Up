import { useState } from 'react';
import ApplicationBackground from '../components/ApplicationBackground';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, User, Phone, Mail, MapPin, FileText, CheckCircle, ArrowRight, ArrowLeft, Crown, CreditCard, Check, Loader2, Eye, EyeOff, Shield, Globe, Clock, Upload, Camera } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '../App';
import { WaveLayout } from '../components/WaveLayout';
import GoogleSignupButton from '../components/GoogleSignupButton';
import IndianPhoneInput from '../components/IndianPhoneInput';
import OtpVerificationModal from '../components/OtpVerificationModal';
import { useLang } from '../context/LanguageContext';

// Subscription Plans Data
const subscriptionPlans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small firms',
    monthlyPrice: 4999,
    yearlyPrice: 49999,
    lawyers: 5,
    clients: 50,
    features: [
      'Up to 5 Lawyers',
      'Up to 50 Clients',
      'Basic Dashboard',
      'Email Support',
      'Case Management',
      'Client Portal'
    ],
    popular: false
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Best for growing firms',
    monthlyPrice: 9999,
    yearlyPrice: 99999,
    lawyers: 15,
    clients: 200,
    features: [
      'Up to 15 Lawyers',
      'Up to 200 Clients',
      'Advanced Dashboard',
      'Priority Support',
      'Case Management',
      'Client Portal',
      'Analytics & Reports',
      'Document Management'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large law firms',
    monthlyPrice: 19999,
    yearlyPrice: 199999,
    lawyers: 50,
    clients: 'Unlimited',
    features: [
      'Up to 50 Lawyers',
      'Unlimited Clients',
      'Premium Dashboard',
      '24/7 Dedicated Support',
      'Advanced Case Management',
      'Client Portal',
      'Custom Analytics',
      'Document Management',
      'API Access',
      'White-label Option'
    ],
    popular: false
  }
];

export default function LawFirmApplication() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [step, setStep] = useState(1);
  // const [step, setStep] = useState(4);
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' or 'yearly'
  const [selectedPlan, setSelectedPlan] = useState('professional');

  const [formData, setFormData] = useState({
    // Step 1 — Firm Identity
    firm_name: '',
    firm_type: '',
    registration_number: '',
    gst_number: '',
    established_year: '',
    website: '',
    linkedin_url: '',
    // Step 2 — Contact
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    contact_designation: '',
    password: '',
    confirm_password: '',
    // Step 3 — Location
    address: '',
    city: '',
    state: '',
    court: '',
    additional_courts: [],
    pincode: '',
    office_hours: '',
    office_branches: '1',
    // Step 4 — Practice & Team
    practice_areas: [],
    client_categories: [],
    languages: [],
    emergency_available: false,
    avg_response_time: '',
    total_lawyers: '',
    total_staff: '',
    senior_partners: [{ name: '', specialization: '', experience: '' }],
    // Step 5 — About & Credentials
    description: '',
    unique_value: '',
    consultation_fee: '',
    achievements: '',
    professional_memberships: '',
    notable_cases: '',
    // Step 6 — Documents
    firm_reg_cert: '',
    bar_council_firm: '',
    pan_card_firm: '',
    gst_certificate: '',
    address_proof: '',
    firm_logo: '',
    // Payment
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: ''
  });

  const states = ["Delhi", "Haryana", "Uttar Pradesh"];
  const citiesByState = {
    "Delhi": [
      "Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi",
      "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"
    ],
    "Haryana": [
      "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind",
      "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari",
      "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"
    ],
    "Uttar Pradesh": [
      "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat",
      "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor",
      "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad",
      "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur",
      "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar",
      "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri",
      "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh",
      "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur",
      "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
    ]
  };

  const courtsByState = {
    "Delhi": [
      "Delhi High Court", "Tis Hazari Courts Complex", "Patiala House Courts Complex",
      "Karkardooma Courts Complex", "Rohini Courts Complex", "Dwarka Courts Complex",
      "Saket Courts Complex", "Rouse Avenue Courts Complex"
    ],
    "Haryana": [
      "Punjab and Haryana High Court", "District Court Ambala", "District Court Bhiwani", "District Court Charkhi Dadri",
      "District Court Faridabad", "District Court Fatehabad", "District Court Gurugram", "District Court Hisar",
      "District Court Jhajjar", "District Court Jind", "District Court Kaithal", "District Court Karnal",
      "District Court Kurukshetra", "District Court Mahendragarh", "District Court Nuh", "District Court Palwal",
      "District Court Panchkula", "District Court Panipat", "District Court Rewari", "District Court Rohtak",
      "District Court Sirsa", "District Court Sonipat", "District Court Yamunanagar"
    ],
    "Uttar Pradesh": [
      "Allahabad High Court", "Allahabad High Court - Lucknow Bench",
      "District Court Agra", "District Court Aligarh", "District Court Ambedkar Nagar", "District Court Amethi",
      "District Court Amroha", "District Court Auraiya", "District Court Ayodhya", "District Court Azamgarh",
      "District Court Baghpat", "District Court Bahraich", "District Court Ballia", "District Court Balrampur",
      "District Court Banda", "District Court Barabanki", "District Court Bareilly", "District Court Basti",
      "District Court Bhadohi", "District Court Bijnor", "District Court Budaun", "District Court Bulandshahr",
      "District Court Chandauli", "District Court Chitrakoot", "District Court Deoria", "District Court Etah",
      "District Court Etawah", "District Court Farrukhabad", "District Court Fatehpur", "District Court Firozabad",
      "District Court Gautam Buddha Nagar", "District Court Ghaziabad", "District Court Ghazipur", "District Court Gonda",
      "District Court Gorakhpur", "District Court Hamirpur", "District Court Hapur", "District Court Hardoi",
      "District Court Hathras", "District Court Jalaun", "District Court Jaunpur", "District Court Jhansi",
      "District Court Kannauj", "District Court Kanpur Dehat", "District Court Kanpur Nagar", "District Court Kasganj",
      "District Court Kaushambi", "District Court Kheri", "District Court Kushinagar", "District Court Lalitpur",
      "District Court Lucknow", "District Court Maharajganj", "District Court Mahoba", "District Court Mainpuri",
      "District Court Mathura", "District Court Mau", "District Court Meerut", "District Court Mirzapur",
      "District Court Moradabad", "District Court Muzaffarnagar", "District Court Pilibhit", "District Court Pratapgarh",
      "District Court Prayagraj", "District Court Raebareli", "District Court Rampur", "District Court Saharanpur",
      "District Court Sambhal", "District Court Sant Kabir Nagar", "District Court Shahjahanpur", "District Court Shamli",
      "District Court Shravasti", "District Court Siddharthnagar", "District Court Sitapur", "District Court Sonbhadra",
      "District Court Sultanpur", "District Court Unnao", "District Court Varanasi"
    ]
  };

  const practiceAreas = [
    "Criminal Law", "Family Law", "Property Law", "Corporate Law",
    "Civil Law", "Tax Law", "Labour Law", "Intellectual Property",
    "Banking Law", "Consumer Law", "Immigration Law", "Environmental Law"
  ];

  const handlePracticeAreaToggle = (area) => {
    setFormData(prev => ({
      ...prev,
      practice_areas: prev.practice_areas.includes(area)
        ? prev.practice_areas.filter(a => a !== area)
        : [...prev.practice_areas, area]
    }));
  };

  const handleToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const handleDocumentUpload = (field, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error(`File too large (${(file.size/1024/1024).toFixed(1)} MB). Max 3 MB.`);
      e.target.value = null; return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setFormData(prev => ({ ...prev, [field]: reader.result }));
    reader.readAsDataURL(file);
  };

  const addPartner = () => setFormData(prev => ({ ...prev, senior_partners: [...prev.senior_partners, { name: '', specialization: '', experience: '' }] }));
  const removePartner = (i) => setFormData(prev => ({ ...prev, senior_partners: prev.senior_partners.filter((_, idx) => idx !== i) }));
  const updatePartner = (i, field, val) => setFormData(prev => ({ ...prev, senior_partners: prev.senior_partners.map((p, idx) => idx === i ? { ...p, [field]: val } : p) }));

  const getSelectedPlanDetails = () => {
    return subscriptionPlans.find(p => p.id === selectedPlan);
  };

  const getPrice = () => {
    const plan = getSelectedPlanDetails();
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getGST = () => Math.round(getPrice() * 0.18);
  const getTotal = () => getPrice() + getGST();

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.firm_name || !formData.firm_type || !formData.registration_number || !formData.established_year) {
          toast.error('Please fill all required fields (Firm Name, Type, Registration, Year)');
          return false;
        }
        break;
      case 2:
        if (!formData.contact_name || !formData.contact_email || !formData.contact_phone || !formData.password) {
          toast.error('Please fill all required fields');
          return false;
        }
        if (formData.password !== formData.confirm_password) { toast.error('Passwords do not match'); return false; }
        if (formData.password.length < 6) { toast.error('Password must be at least 6 characters'); return false; }
        break;
      case 3:
        if (!formData.city || !formData.state || !formData.court) {
          toast.error('Please fill State, City and Primary Court');
          return false;
        }
        break;
      case 4:
        if (formData.practice_areas.length === 0 || !formData.total_lawyers) {
          toast.error('Select at least one practice area and enter total lawyers');
          return false;
        }
        break;
      case 5:
        if (!formData.description || formData.description.trim().split(/\s+/).length < 50) {
          toast.error('Please write at least 50 words in the About Your Firm section');
          return false;
        }
        break;
      case 6:
        if (!formData.firm_reg_cert) { toast.error('Firm Registration Certificate is required'); return false; }
        if (!formData.pan_card_firm) { toast.error('Firm PAN Card is required'); return false; }
        if (!formData.address_proof) { toast.error('Office Address Proof is required'); return false; }
        break;
      case 7:
        // Subscription plan - no validation needed
        break;
      case 8:
        if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvv || !formData.cardName) {
          toast.error('Please fill all payment details');
          return false;
        }
        break;
      default: break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step === 2) {
        if (formData.contact_phone.length !== 10) { toast.error('Please enter a valid 10-digit phone number'); return; }
        setOtpModalOpen(true);
      } else {
        setStep(prev => prev + 1);
      }
    }
  };

  const handleGoogleSignup = (googleData) => {
    setFormData(prev => ({
      ...prev,
      contact_name: googleData.name,
      contact_email: googleData.email,
      contact_phone: googleData.phone,
      password: `google_${Date.now()}`,
      confirm_password: `google_${Date.now()}`,
    }));
    toast.success('Google account connected! Fill in the remaining contact details to continue.');
  };

  const processPayment = async () => {
    if (!validateStep()) return;
    setPaymentProcessing(true);
    setTimeout(async () => {
      try {
        await axios.post(`${API}/lawfirms/applications`, {
          firm_name: formData.firm_name,
          firm_type: formData.firm_type,
          registration_number: formData.registration_number,
          gst_number: formData.gst_number,
          established_year: parseInt(formData.established_year),
          website: formData.website,
          linkedin_url: formData.linkedin_url,
          contact_name: formData.contact_name,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          contact_designation: formData.contact_designation,
          password: formData.password,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          court: formData.court,
          additional_courts: formData.additional_courts,
          pincode: formData.pincode,
          office_hours: formData.office_hours,
          office_branches: parseInt(formData.office_branches) || 1,
          practice_areas: formData.practice_areas,
          client_categories: formData.client_categories,
          languages: formData.languages,
          emergency_available: formData.emergency_available,
          avg_response_time: formData.avg_response_time,
          total_lawyers: parseInt(formData.total_lawyers),
          total_staff: parseInt(formData.total_staff) || 0,
          senior_partners: formData.senior_partners.filter(p => p.name),
          description: formData.description,
          unique_value: formData.unique_value,
          consultation_fee: parseInt(formData.consultation_fee) || 0,
          achievements: formData.achievements,
          professional_memberships: formData.professional_memberships,
          notable_cases: formData.notable_cases,
          firm_reg_cert: formData.firm_reg_cert,
          bar_council_firm: formData.bar_council_firm,
          pan_card_firm: formData.pan_card_firm,
          gst_certificate: formData.gst_certificate,
          address_proof: formData.address_proof,
          firm_logo: formData.firm_logo,
          subscription_plan: selectedPlan,
          billing_cycle: billingCycle,
          subscription_amount: getTotal()
        });
        toast.success('Payment successful! Application submitted.');
        setPaymentProcessing(false);
        setStep(9);
      } catch (error) {
        setPaymentProcessing(false);
        const errorMsg = error.response?.data?.detail;
        if (typeof errorMsg === 'string') toast.error(errorMsg);
        else toast.error('Failed to submit application. Please try again.');
      }
    }, 2000);
  };

  const steps = [
    { num: 1, title: 'Firm Identity', icon: Building2 },
    { num: 2, title: 'Contact', icon: User },
    { num: 3, title: 'Location', icon: MapPin },
    { num: 4, title: 'Practice & Team', icon: FileText },
    { num: 5, title: 'About Firm', icon: Shield },
    { num: 6, title: 'Documents', icon: Upload },
    { num: 7, title: 'Plan', icon: Crown },
    { num: 8, title: 'Payment', icon: CreditCard }
  ];

  // Success Page
  if (step === 9) {
    const plan = getSelectedPlanDetails();
    return (
      <WaveLayout>
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-2xl rounded-2xl p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-3">{t('lfa_success_title')}</h2>
            <p className="text-slate-300 mb-6">
              Your law firm <strong>{formData.firm_name}</strong> has been registered successfully.
            </p>

            <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-4 mb-6 text-left border border-white/10">
              <h3 className="font-semibold text-slate-200 mb-3">Subscription Details</h3>
              <div className="space-y-2 text-sm text-slate-700 dark:text-slate-400">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-500">Plan</span>
                  <span className="font-medium text-slate-200">{plan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-500">Billing</span>
                  <span className="font-medium text-slate-200 capitalize">{billingCycle}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="font-semibold text-slate-200">Amount Paid</span>
                  <span className="font-bold text-slate-200">₹{getTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => navigate('/login')}
                className="flex-1 bg-slate-900 text-white rounded-xl py-6 hover:bg-slate-800"
              >
                {t('login_badge') ? t('nav_login') : 'Go to Login'}
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="flex-1 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl py-6"
              >
                {t('la_back_home')}
              </Button>
            </div>
          </motion.div>
        </div>
      </WaveLayout>
    );
  }

  return (
    <WaveLayout>
      <OtpVerificationModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        onVerified={() => { setOtpModalOpen(false); setStep(prev => prev + 1); }}
        email={formData.contact_email}
        phone={formData.contact_phone}
      />
      <ApplicationBackground />
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:px-6 lg:px-8 pt-24 pb-12" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Register Your Law Firm</h1>
          <p className="text-slate-400">Join India's leading legal platform</p>
        </div>

        {/* Progress Steps */}
        <div className="w-full max-w-4xl flex justify-center mb-8 overflow-x-auto pb-4 no-scrollbar">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={s.num} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center w-[50px] sm:w-[70px] mx-0.5 sm:mx-2 text-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step > s.num
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                      : step === s.num
                        ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                        : 'bg-white/10 text-slate-400 border border-white/15'
                  }`}>
                    {step > s.num ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <span className={`text-[10px] sm:text-xs mt-1 leading-tight ${
                    step >= s.num ? 'text-teal-400 font-semibold' : 'text-slate-500'
                  }`}>{s.title}</span>
                </div>
                {idx !== steps.length - 1 && (
                  <div className={`w-3 sm:w-8 h-1 mx-0.5 sm:mx-1 rounded ${
                    step > s.num ? 'bg-indigo-500' : 'bg-white/10'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <div
          className="w-full max-w-4xl rounded-2xl p-4 sm:p-6 md:p-8"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Firm Identity */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="flex items-center space-x-3 mb-2">
                  <Building2 className="w-8 h-8 text-teal-700" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Firm Identity</h2>
                    <p className="text-sm text-slate-500">This information is verified through our APEX system</p>
                  </div>
                </div>

                <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4 flex gap-3">
                  <Shield className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <p className="text-sm text-teal-800 dark:text-teal-300"><strong>APEX Verification:</strong> We cross-check your registration with the Bar Council and MCA records. Ensure all details match official documents exactly.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Firm Name *</label>
                  <Input value={formData.firm_name} onChange={(e) => setFormData({ ...formData, firm_name: e.target.value })} placeholder="e.g., Sharma & Associates" className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Firm Type *</label>
                    <select value={formData.firm_type} onChange={(e) => setFormData({ ...formData, firm_type: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600">
                      <option value="">Select Firm Type</option>
                      {['Sole Proprietorship', 'Partnership Firm', 'Limited Liability Partnership (LLP)', 'Private Limited Company', 'Public Limited Company', 'Association of Persons'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Established Year *</label>
                    <Input type="number" value={formData.established_year} onChange={(e) => setFormData({ ...formData, established_year: e.target.value })} placeholder="e.g., 2010" className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Bar Council / MCA Registration Number *</label>
                  <Input value={formData.registration_number} onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })} placeholder="e.g., D/2247/2010 or LLP-IN-123456" className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">GST Number <span className="text-slate-400">(Optional)</span></label>
                    <Input value={formData.gst_number} onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })} placeholder="e.g., 07AADCS0472N1Z1" className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Website <span className="text-slate-400">(Optional)</span></label>
                    <Input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://yourfirm.com" className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">LinkedIn Company Page <span className="text-slate-400">(Optional — boosts trust score)</span></label>
                  <Input value={formData.linkedin_url} onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })} placeholder="https://linkedin.com/company/your-firm" className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20" />
                </div>
              </motion.div>
            )}


            {/* Step 2: Contact Person */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <User className="w-8 h-8 text-teal-700" />
                  <h2 className="text-2xl font-bold text-slate-800">Contact Person</h2>
                </div>

                {/* Google Signup */}
                <GoogleSignupButton onSuccess={handleGoogleSignup} theme="light" buttonLabel="Fill with Google" />

                {/* OR Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                  <span className="text-xs text-slate-400 font-medium">OR FILL MANUALLY</span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Full Name *</label>
                    <Input
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                      placeholder="Contact person name"
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Designation</label>
                    <Input
                      value={formData.contact_designation}
                      onChange={(e) => setFormData({ ...formData, contact_designation: e.target.value })}
                      placeholder="e.g., Managing Partner"
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Email *</label>
                  <Input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    placeholder="contact@yourfirm.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20"
                  />
                </div>

                <IndianPhoneInput
                  value={formData.contact_phone}
                  onChange={(digits) => setFormData({ ...formData, contact_phone: digits })}
                  label="Phone"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Password *</label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Min 6 characters"
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Confirm Password *</label>
                    <Input
                      type="password"
                      value={formData.confirm_password}
                      onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                      placeholder="Re-enter password"
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Location & Practice */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <MapPin className="w-8 h-8 text-teal-700" />
                  <h2 className="text-2xl font-bold text-slate-800">Location & Practice Areas</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Office Address</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Full office address"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">State *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value, city: '', court: '' })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                    >
                      <option value="">Select State</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">City *</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                      disabled={!formData.state}
                    >
                      <option value="">Select City</option>
                      {formData.state && citiesByState[formData.state]?.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Primary Court *</label>
                    <select
                      value={formData.court}
                      onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                      disabled={!formData.state}
                    >
                      <option value="">Select Court</option>
                      {formData.state && courtsByState[formData.state]?.map(court => (
                        <option key={court} value={court}>{court}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-slate-200 mb-2">Pincode</label>
                    <Input
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="110001"
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-3">Practice Areas * (Select all that apply)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {practiceAreas.map(area => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => handlePracticeAreaToggle(area)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${formData.practice_areas.includes(area)
                          ? 'bg-teal-700 text-white shadow-md shadow-teal-200'
                          : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Practice & Team */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <FileText className="w-8 h-8 text-teal-700" />
                  <h2 className="text-2xl font-bold text-white">Practice & Team</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Total Lawyers *</label>
                    <Input type="number" value={formData.total_lawyers} onChange={(e) => setFormData({ ...formData, total_lawyers: e.target.value })} placeholder="e.g., 12" className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Total Support Staff</label>
                    <Input type="number" value={formData.total_staff} onChange={(e) => setFormData({ ...formData, total_staff: e.target.value })} placeholder="e.g., 5" className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-3">Practice Areas * (Select all that apply)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['Criminal Law','Family Law','Property Law','Corporate Law','Civil Law','Tax Law','Labour Law','Intellectual Property','Banking Law','Consumer Law','Immigration Law','Environmental Law','Cyber Law','Constitutional Law','Medical Negligence'].map(area => (
                      <button key={area} type="button" onClick={() => handlePracticeAreaToggle(area)} className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${formData.practice_areas.includes(area) ? 'bg-teal-700 text-white shadow-md shadow-teal-200' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>{area}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-3">Client Categories Served</label>
                  <div className="flex flex-wrap gap-2">
                    {['Individuals','Corporates','Startups','Government Bodies','NGOs','MSMEs'].map(cat => (
                      <button key={cat} type="button" onClick={() => handleToggle('client_categories', cat)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${formData.client_categories.includes(cat) ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 border border-white/10'}`}>{cat}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-3">Languages Offered</label>
                  <div className="flex flex-wrap gap-2">
                    {['Hindi','English','Marathi','Punjabi','Gujarati','Tamil','Telugu','Bengali','Kannada','Urdu'].map(lang => (
                      <button key={lang} type="button" onClick={() => handleToggle('languages', lang)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${formData.languages.includes(lang) ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 border border-white/10'}`}>{lang}</button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Avg. Response Time</label>
                    <select value={formData.avg_response_time} onChange={(e) => setFormData({ ...formData, avg_response_time: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600">
                      <option value="">Select</option>
                      {['< 1 hour','1–2 hours','2–6 hours','Same day','Within 24 hours'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-3 pt-7">
                    <input type="checkbox" id="emergency" checked={formData.emergency_available} onChange={(e) => setFormData({ ...formData, emergency_available: e.target.checked })} className="w-5 h-5 text-teal-700 rounded" />
                    <label htmlFor="emergency" className="text-sm font-medium text-slate-200">Available for Emergency / SOS cases</label>
                  </div>
                </div>

                {/* Senior Partners */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-slate-200">Senior Partners / Key Members</label>
                    <button type="button" onClick={addPartner} className="text-xs text-teal-700 font-semibold hover:underline">+ Add Partner</button>
                  </div>
                  <div className="space-y-3">
                    {formData.senior_partners.map((p, i) => (
                      <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <Input value={p.name} onChange={(e) => updatePartner(i, 'name', e.target.value)} placeholder="Partner Name" className="bg-white/5 border-slate-200 dark:border-slate-700 text-white placeholder:text-slate-400" />
                        <Input value={p.specialization} onChange={(e) => updatePartner(i, 'specialization', e.target.value)} placeholder="Specialization" className="bg-white/5 border-slate-200 dark:border-slate-700 text-white placeholder:text-slate-400" />
                        <div className="flex gap-2">
                          <Input value={p.experience} onChange={(e) => updatePartner(i, 'experience', e.target.value)} placeholder="Yrs Exp." className="bg-white/5 border-slate-200 dark:border-slate-700 text-white placeholder:text-slate-400" />
                          {formData.senior_partners.length > 1 && <button type="button" onClick={() => removePartner(i)} className="px-2 text-red-500 hover:text-red-700">✕</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: About the Firm */}
            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-8 h-8 text-teal-700" />
                  <h2 className="text-2xl font-bold text-white">About Your Firm</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">About Your Firm * <span className="text-slate-400">(min 50 words)</span></label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe your firm's expertise, values, approach, landmark cases, and why clients choose you..." rows={5} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600" />
                  <p className="text-xs text-slate-400 mt-1">{formData.description.trim().split(/\s+/).filter(Boolean).length} / 50 words minimum</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">What Makes You Unique? <span className="text-slate-400">(Optional)</span></label>
                  <textarea value={formData.unique_value} onChange={(e) => setFormData({ ...formData, unique_value: e.target.value })} placeholder="e.g., 100% trial success in IP disputes, multilingual team, tech-forward case management..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Consultation Fee (₹)</label>
                    <Input type="number" value={formData.consultation_fee} onChange={(e) => setFormData({ ...formData, consultation_fee: e.target.value })} placeholder="e.g., 2000" className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Professional Memberships</label>
                    <Input value={formData.professional_memberships} onChange={(e) => setFormData({ ...formData, professional_memberships: e.target.value })} placeholder="e.g., FICCI, ASSOCHAM, IBA" className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Key Achievements & Awards <span className="text-slate-400">(Optional)</span></label>
                  <textarea value={formData.achievements} onChange={(e) => setFormData({ ...formData, achievements: e.target.value })} placeholder="Awards, recognitions, industry rankings, press mentions..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Notable Cases / Landmark Judgments <span className="text-slate-400">(Optional)</span></label>
                  <textarea value={formData.notable_cases} onChange={(e) => setFormData({ ...formData, notable_cases: e.target.value })} placeholder="Describe 1–3 landmark cases your firm handled (outcome, impact)..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600" />
                </div>
              </motion.div>
            )}

            {/* Step 6: Documents */}
            {step === 6 && (
              <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="flex items-center space-x-3 mb-2">
                  <Upload className="w-8 h-8 text-teal-700" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Document Verification</h2>
                    <p className="text-sm text-slate-500">Required for APEX certification. Max 3 MB per file (JPG/PNG/PDF).</p>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3">
                  <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-300">These documents are reviewed by our APEX verification team within 2–3 working days. Your listing goes live only after verification is complete.</p>
                </div>

                {[
                  { field: 'firm_reg_cert', label: 'Firm Registration Certificate *', hint: 'MOA, LLP Agreement, or Partnership Deed', required: true },
                  { field: 'bar_council_firm', label: 'Bar Council Registration (Firm)', hint: 'If registered as a firm with Bar Council', required: false },
                  { field: 'pan_card_firm', label: 'Firm PAN Card *', hint: 'PAN issued in the firm name', required: true },
                  { field: 'gst_certificate', label: 'GST Certificate', hint: 'If GST registered', required: false },
                  { field: 'address_proof', label: 'Office Address Proof *', hint: 'Electricity bill, lease agreement, or ownership deed', required: true },
                  { field: 'firm_logo', label: 'Firm Logo', hint: 'PNG/JPG format, shown on your public profile', required: false, isLogo: true },
                ].map(({ field, label, hint, required, isLogo }) => (
                  <div key={field}>
                    {isLogo ? (
                      <ProfilePhotoUpload
                        value={formData[field]}
                        onChange={(dataUrl) => setFormData(prev => ({ ...prev, [field]: dataUrl }))}
                        label="Firm Logo / Firm Photo"
                        hint="Your firm logo appears on your public profile card and in search results. PNG with transparent background recommended."
                      />
                    ) : (
                      <>
                        <label className="block text-sm font-medium text-slate-200 mb-1">{label}</label>
                        <p className="text-xs text-slate-400 mb-2">{hint}</p>
                        {formData[field] ? (
                          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                            <span className="text-sm text-green-700 dark:text-green-300 flex-1">Document uploaded</span>
                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, [field]: '' }))} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                          </div>
                        ) : (
                          <label className={`flex items-center gap-3 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${required ? 'border-teal-300 dark:border-teal-700 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20' : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                            <Camera className="w-5 h-5 text-slate-400 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-slate-300">Click to upload</p>
                              <p className="text-xs text-slate-400">JPG, PNG or PDF · Max 3 MB</p>
                            </div>
                            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleDocumentUpload(field, e)} />
                          </label>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {/* Step 7: Subscription Plans */}
            {step === 7 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <Crown className="w-12 h-12 text-teal-700 mx-auto mb-3" />
                  <h2 className="text-2xl font-bold text-slate-800">Choose Your Plan</h2>
                  <p className="text-slate-500">Select a subscription that fits your needs</p>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center mb-6">
                  <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex">
                    <button
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${billingCycle === 'monthly'
                        ? 'bg-white dark:bg-slate-700 text-teal-900 dark:text-teal-300 shadow'
                        : 'text-slate-400 hover:text-teal-900 dark:hover:text-teal-400'
                        }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle('yearly')}
                      className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${billingCycle === 'yearly'
                        ? 'bg-white dark:bg-slate-700 text-teal-900 dark:text-teal-300 shadow'
                        : 'text-slate-400 hover:text-teal-900 dark:hover:text-teal-400'
                        }`}
                    >
                      Yearly
                      <span className="ml-1 text-xs text-green-600 dark:text-green-400 font-bold">Save 17%</span>
                    </button>
                  </div>
                </div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-3 gap-4">
                  {subscriptionPlans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedPlan === plan.id
                        ? 'border-teal-700 bg-teal-50/50 dark:bg-teal-900/20'
                        : 'border-white/10 hover:border-teal-200 dark:hover:border-teal-800 bg-white/5'
                        }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-teal-700 text-white text-xs px-3 py-1 rounded-full shadow-sm">
                            Most Popular
                          </span>
                        </div>
                      )}

                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                        <p className="text-xs text-slate-400">{plan.description}</p>
                      </div>

                      <div className="text-center mb-4">
                        <span className="text-3xl font-bold text-white">
                          ₹{(billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice).toLocaleString()}
                        </span>
                        <span className="text-slate-400 text-sm">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                      </div>

                      <ul className="space-y-2 mb-4">
                        {plan.features.slice(0, 5).map((feature, idx) => (
                          <li key={idx} className="flex items-center text-xs text-slate-300">
                            <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {selectedPlan === plan.id && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle className="w-6 h-6 text-teal-700" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 8: Payment */}
            {step === 8 && (
              <motion.div
                key="step8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <CreditCard className="w-8 h-8 text-teal-700" />
                  <h2 className="text-2xl font-bold text-slate-800">Payment</h2>
                </div>

                <div className="bg-teal-50/50 p-6 rounded-xl border border-teal-100 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-slate-700">Total Amount</span>
                    <span className="text-2xl font-bold text-slate-900">₹{getTotal().toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-500">Includes 18% GST on {billingCycle} plan</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
                    <Input
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      placeholder="0000 0000 0000 0000"
                      className="bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                      <Input
                        value={formData.cardExpiry}
                        onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                        placeholder="MM/YY"
                        className="bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                      <Input
                        type="password"
                        value={formData.cardCvv}
                        onChange={(e) => setFormData({ ...formData, cardCvv: e.target.value })}
                        placeholder="123"
                        className="bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cardholder Name</label>
                    <Input
                      value={formData.cardName}
                      onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                      placeholder="Name on card"
                      className="bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
            {step > 1 ? (
              <Button
                variant="ghost"
                onClick={() => setStep(step - 1)}
                className="text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 -ml-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            ) : (
              <div></div>
            )}

            {step < 8 ? (
              <Button
                onClick={handleNext}
                className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/30 dark:shadow-teal-900/40 rounded-xl px-8"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={processPayment}
                disabled={paymentProcessing}
                className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/30 dark:shadow-teal-900/40 rounded-xl px-8"
              >
                {paymentProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Pay & Submit'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </WaveLayout>
  );
}
