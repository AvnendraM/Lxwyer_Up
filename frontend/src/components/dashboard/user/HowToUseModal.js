import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, LayoutDashboard, Calendar, Briefcase, MessageSquare,
    Scale, FileText, User, ChevronRight, ChevronLeft,
} from 'lucide-react';

const features = [
    {
        id: 'dashboard',
        icon: LayoutDashboard,
        color: 'from-blue-600 to-blue-400',
        en: {
            title: 'Dashboard',
            desc: 'Your home screen. See an overview of Active Cases, Pending Documents, Upcoming Bookings, and New Messages at a glance. Quick action buttons let you book a lawyer, ask AI, upload documents, or jump to your cases.',
            tips: [
                'Click "Book a Lawyer" to find and book a lawyer instantly.',
                '"Ask AI" opens the Lxwyer AI chatbot for quick legal questions.',
                '"Next Appointment" shows your nearest upcoming consultation.',
            ],
        },
        hi: {
            title: 'डैशबोर्ड',
            desc: 'यह आपका होम स्क्रीन है। यहाँ सक्रिय केस, पेंडिंग दस्तावेज़, आने वाली बुकिंग और नए संदेशों की एक झलक मिलती है। क्विक एक्शन बटन से वकील बुक करें, AI से पूछें, दस्तावेज़ अपलोड करें या केस देखें।',
            tips: [
                '"वकील बुक करें" से तुरंत वकील खोजें और बुक करें।',
                '"AI से पूछें" से Lxwyer AI चैटबॉट खुलता है।',
                '"नेक्स्ट अपॉइंटमेंट" आपकी अगली कंसल्टेशन दिखाता है।',
            ],
        },
    },
    {
        id: 'consultation',
        icon: Calendar,
        color: 'from-violet-600 to-violet-400',
        en: {
            title: 'Book a Lawyer',
            desc: 'Find your ideal legal expert. Choose "Direct Consultation" to browse and filter lawyers by specialisation, experience, and location. Or use "AI-Powered Recommendation" to answer a few questions and get matched instantly.',
            tips: [
                '"Find a Lawyer" shows all verified lawyers with filters.',
                '"Start Matching" lets AI recommend the best lawyer for your case.',
                'Consultations are End-to-End Encrypted for privacy.',
            ],
        },
        hi: {
            title: 'वकील बुक करें',
            desc: 'यहाँ आप अपना आदर्श कानूनी विशेषज्ञ खोज सकते हैं। "डायरेक्ट कंसल्टेशन" से विशेषज्ञता, अनुभव और स्थान के आधार पर फ़िल्टर करें। या "AI सिफारिश" से कुछ सवालों के जवाब दें और तुरंत मिलान पाएं।',
            tips: [
                '"वकील खोजें" से सभी सत्यापित वकील दिखते हैं।',
                '"मिलान शुरू करें" से AI आपके केस के लिए सबसे अच्छा वकील सुझाता है।',
                'कंसल्टेशन एंड-टू-एंड एन्क्रिप्टेड होती है।',
            ],
        },
    },
    {
        id: 'cases',
        icon: Briefcase,
        color: 'from-emerald-600 to-emerald-400',
        en: {
            title: 'My Cases',
            desc: 'Track all your active and past legal cases. Each case shows the assigned lawyer, type, status (Active / Pending / Closed), and key dates. You can view documents attached to each case.',
            tips: [
                'Click a case card to see full details.',
                'Filter by Active, Pending, or Closed using the tabs.',
                'Documents uploaded to a case are accessible here.',
            ],
        },
        hi: {
            title: 'मेरे केस',
            desc: 'अपने सभी सक्रिय और पुराने कानूनी केस ट्रैक करें। हर केस में नियुक्त वकील, प्रकार, स्थिति और महत्वपूर्ण तारीखें दिखती हैं। केस से जुड़े दस्तावेज़ भी देख सकते हैं।',
            tips: [
                'केस कार्ड पर क्लिक करके पूरी जानकारी देखें।',
                'टैब से सक्रिय, पेंडिंग या बंद केस फ़िल्टर करें।',
                'केस से जुड़े दस्तावेज़ यहाँ मिलेंगे।',
            ],
        },
    },
    {
        id: 'messages',
        icon: MessageSquare,
        color: 'from-sky-500 to-cyan-400',
        en: {
            title: 'Messages',
            desc: 'Secure in-app chat with your lawyers. View all conversations in the left panel, click to open a chat, and send messages directly. All chats are private and secure.',
            tips: [
                'Click a lawyer\'s name on the left to open the chat.',
                'Send messages, updates, or share document links.',
                'New messages appear automatically.',
            ],
        },
        hi: {
            title: 'संदेश',
            desc: 'अपने वकीलों के साथ सुरक्षित इन-ऐप चैट। बाईं ओर सभी बातचीत देखें, क्लिक करें और सीधे संदेश भेजें। सभी चैट निजी और सुरक्षित हैं।',
            tips: [
                'बाईं ओर वकील का नाम क्लिक करें।',
                'संदेश, अपडेट या दस्तावेज़ लिंक भेजें।',
                'नए संदेश स्वचालित रूप से दिखते हैं।',
            ],
        },
    },
    {
        id: 'chatbot',
        icon: Scale,
        color: 'from-indigo-500 to-purple-500',
        en: {
            title: 'Lxwyer AI',
            desc: 'Your personal AI legal assistant. Ask any legal question in plain language and get instant, accurate guidance. Covers topics like tenant rights, consumer complaints, criminal bail, property disputes, and more.',
            tips: [
                'Type your question in plain language — no legal jargon needed.',
                'Use the suggested prompts to get started quickly.',
                'Responses are informational — always confirm with a licensed lawyer.',
            ],
        },
        hi: {
            title: 'Lxwyer AI',
            desc: 'आपका व्यक्तिगत AI कानूनी सहायक। किसी भी कानूनी सवाल को सरल भाषा में पूछें और तुरंत सटीक मार्गदर्शन पाएं। किरायेदार अधिकार, उपभोक्ता शिकायत, जमानत, संपत्ति विवाद आदि विषयों पर मदद करता है।',
            tips: [
                'कोई भी सवाल आम भाषा में पूछें — कानूनी शब्दों की ज़रूरत नहीं।',
                'सुझाए गए प्रश्नों से शुरुआत करें।',
                'जवाब जानकारी के लिए हैं — हमेशा अपने वकील से पुष्टि करें।',
            ],
        },
    },
    {
        id: 'documents',
        icon: FileText,
        color: 'from-rose-500 to-pink-400',
        en: {
            title: 'Documents',
            desc: 'Upload, store, and manage your legal documents securely. Attach documents to your cases, and share them with your lawyers. Supported formats: PDF, Word, images, and more.',
            tips: [
                'Click "Upload Document" or drag & drop to upload.',
                'Documents can be attached to a specific case.',
                'Shared documents are accessible to your assigned lawyer.',
            ],
        },
        hi: {
            title: 'दस्तावेज़',
            desc: 'अपने कानूनी दस्तावेज़ सुरक्षित रूप से अपलोड करें, स्टोर करें और प्रबंधित करें। केस से दस्तावेज़ जोड़ें और वकील के साथ साझा करें। PDF, Word, इमेज आदि समर्थित हैं।',
            tips: [
                '"दस्तावेज़ अपलोड करें" पर क्लिक करें या ड्रैग & ड्रॉप करें।',
                'दस्तावेज़ किसी विशेष केस से जोड़े जा सकते हैं।',
                'साझा दस्तावेज़ आपके वकील को दिखते हैं।',
            ],
        },
    },
    {
        id: 'profile',
        icon: User,
        color: 'from-teal-500 to-green-400',
        en: {
            title: 'My Profile',
            desc: 'View and edit your personal information. Update your name, phone number, and location. Hover over your profile photo to upload a new one. Your email is shown for reference but cannot be changed here.',
            tips: [
                'Click "Edit Profile" to update your details.',
                'Hover over your photo to see the "Change" upload button.',
                'Changes are saved to your account immediately.',
            ],
        },
        hi: {
            title: 'मेरा प्रोफाइल',
            desc: 'अपनी व्यक्तिगत जानकारी देखें और संपादित करें। नाम, फोन नंबर और स्थान अपडेट करें। प्रोफाइल फोटो पर होवर करके नई फोटो अपलोड करें।',
            tips: [
                '"प्रोफाइल संपादित करें" पर क्लिक करें।',
                'फोटो पर होवर करके "Change" बटन से नई फोटो लगाएं।',
                'बदलाव तुरंत आपके अकाउंट में सेव हो जाते हैं।',
            ],
        },
    },
];

const UserHowToUseModal = ({ darkMode, onClose }) => {
    const [lang, setLang] = useState('en');
    const [activeIdx, setActiveIdx] = useState(0);

    const feature = features[activeIdx];
    const content = feature[lang];
    const Icon = feature.icon;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Backdrop */}
                <div className={`absolute inset-0 ${darkMode ? 'bg-black/70' : 'bg-slate-900/40'} backdrop-blur-sm`} />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    onClick={e => e.stopPropagation()}
                    className={`relative w-full max-w-2xl rounded-3xl shadow-2xl border overflow-hidden ${darkMode ? 'bg-[#111113] border-white/10' : 'bg-white border-slate-200'
                        }`}
                >
                    {/* Header */}
                    <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? 'border-white/8' : 'border-slate-100'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow`}>
                                <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h2 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                    How to Use the Dashboard
                                </h2>
                                <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {activeIdx + 1} of {features.length} — {content.title}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Language Toggle */}
                            <div className={`flex items-center rounded-lg p-0.5 text-xs font-semibold ${darkMode ? 'bg-white/8' : 'bg-slate-100'}`}>
                                <button
                                    onClick={() => setLang('en')}
                                    className={`px-3 py-1 rounded-md transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow' : (darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800')}`}
                                >EN</button>
                                <button
                                    onClick={() => setLang('hi')}
                                    className={`px-3 py-1 rounded-md transition-all ${lang === 'hi' ? 'bg-blue-600 text-white shadow' : (darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800')}`}
                                >हिं</button>
                            </div>
                            <button
                                onClick={onClose}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${darkMode ? 'text-slate-500 hover:bg-white/10 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex" style={{ minHeight: '380px' }}>
                        {/* Left — Feature List */}
                        <div className={`w-48 shrink-0 border-r overflow-y-auto py-3 ${darkMode ? 'border-white/8 bg-black/20' : 'border-slate-100 bg-slate-50'}`}>
                            {features.map((f, i) => {
                                const FIcon = f.icon;
                                const isActive = i === activeIdx;
                                return (
                                    <button
                                        key={f.id}
                                        onClick={() => setActiveIdx(i)}
                                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-all ${isActive
                                                ? (darkMode ? 'bg-white/8 text-white' : 'bg-blue-50 text-blue-700')
                                                : (darkMode ? 'text-slate-500 hover:bg-white/5 hover:text-slate-300' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700')
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br ${f.color} ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                            <FIcon className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <span className="text-[12px] font-semibold truncate">{f[lang].title}</span>
                                        {isActive && <ChevronRight className="w-3 h-3 ml-auto shrink-0 opacity-60" />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right — Content */}
                        <div className="flex-1 p-6 flex flex-col">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${activeIdx}-${lang}`}
                                    initial={{ opacity: 0, x: 12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -12 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1"
                                >
                                    <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                        {content.title}
                                    </h3>
                                    <p className={`text-sm leading-relaxed mb-5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {content.desc}
                                    </p>
                                    <div>
                                        <p className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                                            {lang === 'en' ? 'Quick Tips' : 'त्वरित टिप्स'}
                                        </p>
                                        <ul className="space-y-2">
                                            {content.tips.map((tip, i) => (
                                                <li key={i} className={`flex items-start gap-2.5 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 text-white bg-gradient-to-br ${feature.color}`}>{i + 1}</span>
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation */}
                            <div className={`flex items-center justify-between mt-6 pt-4 border-t ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
                                <button
                                    onClick={() => setActiveIdx(i => Math.max(0, i - 1))}
                                    disabled={activeIdx === 0}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 ${darkMode ? 'bg-white/8 hover:bg-white/12 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                        }`}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    {lang === 'en' ? 'Previous' : 'पिछला'}
                                </button>

                                {/* Dots */}
                                <div className="flex gap-1.5">
                                    {features.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveIdx(i)}
                                            className={`rounded-full transition-all ${i === activeIdx
                                                    ? 'w-5 h-2 bg-blue-500'
                                                    : `w-2 h-2 ${darkMode ? 'bg-white/20 hover:bg-white/40' : 'bg-slate-300 hover:bg-slate-400'}`
                                                }`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={() => {
                                        if (activeIdx < features.length - 1) setActiveIdx(i => i + 1);
                                        else onClose();
                                    }}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all"
                                >
                                    {activeIdx < features.length - 1
                                        ? (lang === 'en' ? 'Next' : 'अगला')
                                        : (lang === 'en' ? 'Done ✓' : 'समाप्त ✓')
                                    }
                                    {activeIdx < features.length - 1 && <ChevronRight className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UserHowToUseModal;
