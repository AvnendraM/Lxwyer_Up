import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, LayoutDashboard, CalendarCheck, FileText, Calendar,
    MessageSquare, Folder, Users, Bot, TrendingUp, AlertTriangle,
    ChevronRight, ChevronLeft, Globe
} from 'lucide-react';

const features = [
    {
        id: 'dashboard',
        icon: LayoutDashboard,
        color: 'from-blue-600 to-blue-400',
        en: {
            title: 'Dashboard',
            desc: 'Your command center. Get a bird\'s eye view of your practice — total clients, active cases, appointments this month, and your weekly booking chart. Cancelled appointments appear in red on the chart.',
            tips: ['Use the Refresh button (↻) to sync latest data.', 'Toggle Full Screen for a distraction-free view.', 'Notification bell shows pending booking requests.'],
        },
        hi: {
            title: 'डैशबोर्ड',
            desc: 'यह आपका मुख्य केंद्र है। यहाँ आपको कुल क्लाइंट, सक्रिय केस, इस महीने की अपॉइंटमेंट और साप्ताहिक बुकिंग चार्ट दिखता है। रद्द की गई अपॉइंटमेंट चार्ट में लाल रंग में दिखेंगी।',
            tips: ['ताज़ा डेटा के लिए रिफ्रेश बटन (↻) दबाएं।', 'फुल स्क्रीन मोड में बिना डिस्ट्रैक्शन काम करें।', 'नोटिफिकेशन बेल में पेंडिंग बुकिंग रिक्वेस्ट देखें।'],
        },
    },
    {
        id: 'appointments',
        icon: CalendarCheck,
        color: 'from-violet-600 to-violet-400',
        en: {
            title: 'Appointments',
            desc: 'Manage all consultation requests. Confirm, reschedule, or decline appointments. Each booking shows the client name, date/time, type (video/audio/in-person), and current status.',
            tips: ['Pending → Confirm or Decline within 24 hrs.', 'Use Reschedule to propose a new time.', 'Completed appointments cannot be changed.'],
        },
        hi: {
            title: 'अपॉइंटमेंट',
            desc: 'सभी कंसल्टेशन रिक्वेस्ट यहाँ दिखती हैं। आप अपॉइंटमेंट कन्फर्म, रिशेड्यूल या अस्वीकार कर सकते हैं। हर बुकिंग में क्लाइंट का नाम, दिनांक/समय, प्रकार और स्थिति दिखती है।',
            tips: ['पेंडिंग रिक्वेस्ट को 24 घंटे में कन्फर्म या रद्द करें।', 'रिशेड्यूल करके नया समय सुझाएं।', 'पूरी हो चुकी अपॉइंटमेंट में बदलाव नहीं हो सकता।'],
        },
    },
    {
        id: 'cases',
        icon: FileText,
        color: 'from-emerald-600 to-emerald-400',
        en: {
            title: 'Cases',
            desc: 'Track all your legal cases with status (Active / Pending / Closed). Create new cases from here, add notes, and associate them with clients. Case details include type, court, filing date, and hearing schedule.',
            tips: ['Create a new case using the ＋ button.', 'Filter cases by status using the tabs.', 'Click a case to see full details and notes.'],
        },
        hi: {
            title: 'केस',
            desc: 'यहाँ आपके सभी कानूनी केस दिखते हैं — सक्रिय, पेंडिंग और बंद। आप नया केस बना सकते हैं, नोट्स जोड़ सकते हैं, और क्लाइंट से जोड़ सकते हैं। केस में प्रकार, कोर्ट, फाइलिंग तारीख आदि शामिल हैं।',
            tips: ['＋ बटन से नया केस बनाएं।', 'टैब से केस की स्थिति फ़िल्टर करें।', 'केस पर क्लिक करके पूरी जानकारी और नोट्स देखें।'],
        },
    },
    {
        id: 'calendar',
        icon: Calendar,
        color: 'from-orange-500 to-amber-400',
        en: {
            title: 'Calendar',
            desc: 'Visual calendar of all your bookings and events. Navigate month by month. Days with appointments are highlighted. Click any date to see bookings and add new events.',
            tips: ['Blue dots = bookings on that day.', 'Use ＋ Event button to add court dates, deadlines.', 'Arrows (← →) to move between months.'],
        },
        hi: {
            title: 'कैलेंडर',
            desc: 'यह आपकी सभी बुकिंग और कार्यक्रमों का विज़ुअल कैलेंडर है। महीना-दर-महीना नेविगेट करें। जिस दिन अपॉइंटमेंट हो वह हाइलाइट होगी। किसी तारीख पर क्लिक कर बुकिंग देखें या नया इवेंट जोड़ें।',
            tips: ['नीले बिंदु = उस दिन बुकिंग है।', '＋ इवेंट से कोर्ट की तारीखें और डेडलाइन जोड़ें।', '← → से महीने बदलें।'],
        },
    },
    {
        id: 'messages',
        icon: MessageSquare,
        color: 'from-sky-500 to-cyan-400',
        en: {
            title: 'Messages',
            desc: 'Secure in-app messaging with your clients. View all conversations on the left, click to open a chat, and reply directly. Messages sync every 4 seconds automatically.',
            tips: ['Click a client name to open their chat.', 'Messages are end-to-end secured.', 'New messages appear without refreshing the page.'],
        },
        hi: {
            title: 'संदेश',
            desc: 'क्लाइंट के साथ सुरक्षित इन-ऐप मैसेजिंग। बाईं ओर सभी बातचीत देखें, क्लिक करें और सीधे जवाब दें। संदेश हर 4 सेकंड में स्वचालित रूप से अपडेट होते हैं।',
            tips: ['किसी क्लाइंट का नाम क्लिक करें।', 'संदेश सुरक्षित हैं।', 'नए संदेश बिना रिफ्रेश के दिखते हैं।'],
        },
    },
    {
        id: 'documents',
        icon: Folder,
        color: 'from-rose-500 to-pink-400',
        en: {
            title: 'Documents',
            desc: 'Upload, organize, and share legal documents. Create folders to group case files. Share documents directly with clients. Storage limit shown in the header bar.',
            tips: ['Drag & drop or click to upload files.', 'Create folders for better organisation.', 'Share a document with a client via the Share icon.'],
        },
        hi: {
            title: 'दस्तावेज़',
            desc: 'कानूनी दस्तावेज़ अपलोड करें, व्यवस्थित करें और साझा करें। केस फ़ाइलों के लिए फ़ोल्डर बनाएं। दस्तावेज़ सीधे क्लाइंट के साथ साझा करें। स्टोरेज सीमा हेडर बार में दिखती है।',
            tips: ['ड्रैग & ड्रॉप या क्लिक करके फ़ाइल अपलोड करें।', 'फ़ोल्डर बनाकर फ़ाइलें व्यवस्थित करें।', 'शेयर आइकन से दस्तावेज़ क्लाइंट को भेजें।'],
        },
    },
    {
        id: 'network',
        icon: Users,
        color: 'from-teal-500 to-green-400',
        en: {
            title: 'Lxwyer Network',
            desc: 'Connect and collaborate with other lawyers on the platform. Browse verified lawyers by specialisation, send connection requests, and share case references with your network.',
            tips: ['Filter lawyers by specialisation or city.', 'Send a connection request to collaborate.', 'Network connections help with case referrals.'],
        },
        hi: {
            title: 'लxwyer नेटवर्क',
            desc: 'प्लेटफॉर्म पर अन्य वकीलों से जुड़ें और सहयोग करें। विशेषज्ञता के आधार पर वकील खोजें, कनेक्शन रिक्वेस्ट भेजें और केस रेफरेंस साझा करें।',
            tips: ['विशेषज्ञता या शहर से वकील फ़िल्टर करें।', 'सहयोग के लिए कनेक्शन रिक्वेस्ट भेजें।', 'नेटवर्क से केस रेफरल में मदद मिलती है।'],
        },
    },
    {
        id: 'paralegal',
        icon: Bot,
        color: 'from-indigo-500 to-purple-500',
        en: {
            title: 'Lxwyer AI',
            desc: 'Your AI-powered paralegal assistant (coming soon). It will help you draft legal documents, research case law, summarise judgments, and generate hearing notes — all from within the dashboard.',
            tips: ['Feature is currently in development.', 'Will support both Hindi and English.', 'Will integrate directly with your cases.'],
        },
        hi: {
            title: 'लxwyer AI',
            desc: 'आपका AI-संचालित पैरालीगल सहायक (जल्द आ रहा है)। यह कानूनी दस्तावेज़ तैयार करने, केस लॉ रिसर्च करने, निर्णय सारांशित करने और सुनवाई नोट्स बनाने में मदद करेगा।',
            tips: ['यह फीचर अभी विकास में है।', 'हिंदी और अंग्रेजी दोनों में काम करेगा।', 'सीधे आपके केस से जुड़ेगा।'],
        },
    },
    {
        id: 'earnings',
        icon: TrendingUp,
        color: 'from-yellow-500 to-orange-400',
        en: {
            title: 'Earnings',
            desc: 'Track your income from paid consultations. View total earnings, month-wise breakdown, and pending payouts. Filter by date range to see specific periods.',
            tips: ['Shows only paid (non-free-trial) bookings.', 'Monthly chart shows revenue trend.', 'Pending = payment initiated but not settled.'],
        },
        hi: {
            title: 'आमदनी',
            desc: 'भुगतान की गई कंसल्टेशन से आपकी आय ट्रैक करें। कुल आमदनी, महीने-वार विवरण और पेंडिंग भुगतान देखें। तारीख रेंज से फ़िल्टर करें।',
            tips: ['केवल भुगतान वाली बुकिंग दिखती हैं।', 'मासिक चार्ट राजस्व ट्रेंड दिखाता है।', 'पेंडिंग = भुगतान शुरू लेकिन पूरा नहीं।'],
        },
    },
];

const HowToUseModal = ({ darkMode, onClose }) => {
    const [lang, setLang] = useState('en'); // 'en' or 'hi'
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
                                    {/* Feature title */}
                                    <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                        {content.title}
                                    </h3>

                                    {/* Description */}
                                    <p className={`text-sm leading-relaxed mb-5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {content.desc}
                                    </p>

                                    {/* Tips */}
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
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
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
                                                    ? `w-5 h-2 bg-blue-500`
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

export default HowToUseModal;
