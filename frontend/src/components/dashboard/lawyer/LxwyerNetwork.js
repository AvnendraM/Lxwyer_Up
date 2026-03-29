
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, Paperclip, FileText, Download, X, Search,
    Image as ImageIcon, Users, Hash, Smile, ChevronDown,
    Shield, Star, ArrowLeft, Loader2
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '../../../App';
import LawyerProfileModal from './LawyerProfileModal';

const QUICK_EMOJIS = ['👍', '❤️', '😂', '🎉', '🙏', '⚖️'];

// Returns a deterministic color from a name string
function nameToColor(name = '') {
    const colors = [
        '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B',
        '#EF4444', '#06B6D4', '#EC4899', '#6366F1'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

function Avatar({ name = '', photo, size = 8, onClick }) {
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const bg = nameToColor(name);
    const px = size * 4;
    const [imgFailed, setImgFailed] = useState(false);
    const resolvedPhoto = photo && !imgFailed
        ? (photo.startsWith('http') || photo.startsWith('data:') ? photo : `http://localhost:8000${photo}`)
        : null;

    return (
        <div
            style={{
                width: `${px}px`,
                height: `${px}px`,
                background: resolvedPhoto ? undefined : bg,
                cursor: onClick ? 'pointer' : 'default',
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: '#fff',
                fontSize: `${Math.max(10, px * 0.35)}px`,
                userSelect: 'none',
            }}
            onClick={onClick}
        >
            {resolvedPhoto
                ? <img src={resolvedPhoto} alt={name} onError={() => setImgFailed(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                : initials
            }
        </div>
    );
}

// Group messages by date for date separators
function groupByDate(messages) {
    const groups = [];
    let lastDate = null;
    messages.forEach(msg => {
        const d = new Date(msg.timestamp);
        const dateKey = d.toDateString();
        if (dateKey !== lastDate) {
            groups.push({ type: 'separator', date: d });
            lastDate = dateKey;
        }
        groups.push({ type: 'message', data: msg });
    });
    return groups;
}

function DateSeparator({ date, darkMode }) {
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    let label;
    if (date.toDateString() === today.toDateString()) label = 'Today';
    else if (date.toDateString() === yesterday.toDateString()) label = 'Yesterday';
    else label = date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="flex items-center gap-3 my-4 px-2">
            <div className={`flex-1 h-px ${darkMode ? 'bg-white/10' : 'bg-slate-200'}`} />
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${darkMode ? 'bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                {label}
            </span>
            <div className={`flex-1 h-px ${darkMode ? 'bg-white/10' : 'bg-slate-200'}`} />
        </div>
    );
}

export default function LxwyerNetwork({ currentUser, darkMode, selectedState }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const debounceRef = useRef(null);
    const [showSearch, setShowSearch] = useState(false);
    const [hoveredMsg, setHoveredMsg] = useState(null);
    const [reactions, setReactions] = useState({}); // msgIdx -> emoji[]
    const [showEmojiFor, setShowEmojiFor] = useState(null);
    const [showMembers, setShowMembers] = useState(false);
    const [showGuidelines, setShowGuidelines] = useState(false);
    const [networkLawyers, setNetworkLawyers] = useState([]);
    const [loadingLawyers, setLoadingLawyers] = useState(false);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const token = sessionStorage.getItem('token');

    // Admin can override state, otherwise use the user's state
    const activeState = selectedState || currentUser?.state;

    const fetchMessages = useCallback(async () => {
        try {
            const url = activeState
                ? `${API}/network/messages?limit=80&state=${encodeURIComponent(activeState)}`
                : `${API}/network/messages?limit=80`;
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data.reverse());
        } catch (error) {
            console.error('Error fetching network messages', error);
        }
    }, [token, activeState]);

    useEffect(() => {
        if (activeState) {
            setLoadingLawyers(true);
            axios.get(`${API}/lawyers?state=${encodeURIComponent(activeState)}`)
                .then(res => setNetworkLawyers(res.data))
                .catch(err => console.error('Error fetching state lawyers', err))
                .finally(() => setLoadingLawyers(false));
        }
    }, [activeState]);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 10000);
        return () => clearInterval(interval);
    }, [fetchMessages]);

    const prevMsgCount = useRef(0);
    useEffect(() => {
        if (messages.length !== prevMsgCount.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            prevMsgCount.current = messages.length;
        }
    }, [messages.length]);

    // Unique members visible in chat (memoized)
    const members = useMemo(() => [...new Map(
        messages.map(m => [m.sender_id, { id: m.sender_id, name: m.sender_name, photo: m.sender_photo }])
    ).values()].slice(0, 20), [messages]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) { toast.error('File too large (max 10MB)'); return; }
        setSelectedFile(file);
    };

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if ((!newMessage.trim() && !selectedFile) || loading) return;
        setLoading(true);
        try {
            let fileData = {};
            if (selectedFile) {
                setUploading(true);
                const formData = new FormData();
                formData.append('file', selectedFile);
                const uploadRes = await axios.post(`${API}/documents/upload`, formData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                fileData = {
                    file_url: uploadRes.data.url || uploadRes.data.file_url,
                    file_name: selectedFile.name,
                    file_type: selectedFile.type
                };
                setUploading(false);
            }
            const postUrl = activeState 
                ? `${API}/network/messages?state=${encodeURIComponent(activeState)}`
                : `${API}/network/messages`;
            
            await axios.post(postUrl, { content: newMessage, ...fileData }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewMessage('');
            setSelectedFile(null);
            fetchMessages();
        } catch {
            toast.error('Failed to send message');
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    const handleReact = (msgIdx, emoji) => {
        setReactions(prev => {
            const current = prev[msgIdx] || [];
            const existing = current.find(r => r.emoji === emoji);
            if (existing) {
                return {
                    ...prev,
                    [msgIdx]: current.map(r => r.emoji === emoji ? { ...r, count: r.count + 1 } : r)
                };
            }
            return { ...prev, [msgIdx]: [...current, { emoji, count: 1 }] };
        });
        setShowEmojiFor(null);
    };

    const handleSearchChange = useCallback((e) => {
        const val = e.target.value;
        setSearchTerm(val);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => setDebouncedSearchTerm(val), 250);
    }, []);

    const filteredMessages = useMemo(() => messages.filter(msg =>
        !debouncedSearchTerm ||
        msg.content?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        msg.sender_name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ), [messages, debouncedSearchTerm]);

    const filteredLawyers = useMemo(() => networkLawyers.filter(lw => 
        !debouncedSearchTerm || 
        lw.full_name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
        lw.specialization?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ), [networkLawyers, debouncedSearchTerm]);

    const grouped = useMemo(() => groupByDate(filteredMessages), [filteredMessages]);
    const lastMsg = messages[messages.length - 1];

    // Chat color palette — matches dashboard dark aesthetic
    const WA = {
        headerBg: darkMode ? '#0a0a0a' : '#1d4ed8',
        headerText: '#fff',
        sidebarBg: darkMode ? '#0f1012' : '#fff', // Matches the dashboard sidebar
        sidebarBorder: darkMode ? '#1f2937' : '#e5e7eb',
        sidebarItemHover: darkMode ? '#1a1b1e' : '#f3f4f6',
        sidebarItemActive: darkMode ? '#1f2937' : '#eff6ff',
        chatBg: darkMode ? '#000000' : '#f0f4ff', // Pure black chat background
        sentBg: darkMode ? '#1e3a8a' : '#dbeafe',
        sentText: darkMode ? '#e0eaff' : '#1e3a8a',
        recvBg: darkMode ? '#1f2937' : '#ffffff',
        recvText: darkMode ? '#e5e7eb' : '#111827',
        inputBg: darkMode ? '#111111' : '#ffffff',
        inputBorder: darkMode ? '#222222' : '#e5e7eb',
        inputText: darkMode ? '#e5e7eb' : '#111827',
        footerBg: darkMode ? '#0a0a0a' : '#f3f4f6',
        timeText: darkMode ? '#6b7280' : '#6b7280',
        senderName: '#60a5fa',
        searchBg: darkMode ? '#111111' : '#f3f4f6',
        accent: '#2563eb',
    };

    return (
        <div className="flex h-full overflow-hidden rounded-[1rem] shadow-xl" style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", border: `1px solid ${WA.sidebarBorder}` }}>

            {/* Profile Modal */}
            {selectedProfile && (
                <LawyerProfileModal
                    user={selectedProfile}
                    onClose={() => setSelectedProfile(null)}
                    darkMode={darkMode}
                    allowEditing={selectedProfile.id === currentUser?.id}
                    onBook={(user) => {
                        toast.success(`Booking request sent to ${user.full_name || 'Lawyer'}`);
                        setSelectedProfile(null);
                    }}
                />
            )}

            {/* ─────────────── FULL PAGE CHAT ─────────────── */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-black">

                {/* Chat background with LXWYER AI watermark */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: WA.chatBg }} />
                <div className="absolute inset-0 pointer-events-none overflow-hidden select-none"
                    style={{
                        opacity: darkMode ? 0.02 : 0.025,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='80'%3E%3Ctext x='10' y='50' font-family='Outfit,Inter,sans-serif' font-size='16' font-weight='800' letter-spacing='0.15em' fill='${encodeURIComponent(darkMode ? '#93c5fd' : '#1d4ed8')}' transform='rotate(-25 110 40)'%3ELxwyer Network%3C/text%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat',
                    }}
                />



                {/* Main Header */}
                <div className="relative z-10 flex items-center justify-between px-6 py-4" style={{ background: WA.headerBg, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold"
                            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                            <Hash className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-black text-white text-lg tracking-wide uppercase flex items-center gap-2">
                                {activeState || 'Lxwyer'} Network
                            </h3>
                            <p className="text-[12px] text-blue-200 mt-0.5 flex items-center gap-2">
                                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {members.length} Active Members</span>
                            </p>
                        </div>
                    </div>
                    
                    {/* Header Action Buttons */}
                    <div className="flex items-center gap-2">
                        {/* Guidelines Button */}
                        <button 
                            onClick={() => setShowGuidelines(true)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all font-semibold text-sm mr-2"
                        >
                            <Star className="w-4 h-4 fill-amber-400" />
                            Guidelines
                        </button>

                        <button onClick={() => setShowMembers(!showMembers)}
                            className={`p-2.5 rounded-full transition-colors ${showMembers ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}
                            title="Lawyer Directory"
                        >
                            <Users className="w-5 h-5" />
                        </button>
                        <button onClick={() => setShowSearch(s => !s)}
                            className={`p-2.5 rounded-full transition-colors ${showSearch ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}
                            title="Search Messages"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Inline message search */}
                <AnimatePresence>
                    {showSearch && !showMembers && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }} 
                            animate={{ height: 'auto', opacity: 1 }} 
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="relative z-20 overflow-hidden" 
                            style={{ background: WA.searchBg }}>
                            <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                <div className="relative max-w-2xl mx-auto">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                                    <input autoFocus placeholder="Search in network conversation..."
                                        value={searchTerm} onChange={handleSearchChange}
                                        className="w-full pl-11 pr-4 py-2.5 rounded-full text-sm border focus:outline-none transition-all"
                                        style={{ background: 'rgba(0,0,0,0.5)', borderColor: 'rgba(59,130,246,0.3)', color: WA.inputText }} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* OVERLAYS (Full Page Over Chat Widget) */}
                <AnimatePresence mode="sync">
                    {showGuidelines && (
                        <motion.div
                            key="guidelines"
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className="absolute inset-0 z-[100] bg-black/95 backdrop-blur-md p-8 overflow-y-auto"
                        >
                            <div className="max-w-2xl mx-auto mt-8">
                                <div className="flex items-center justify-between mb-6 border-b border-amber-500/20 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30">
                                            <Star className="w-6 h-6 text-amber-500" />
                                        </div>
                                        <h2 className="text-2xl font-black text-white">Community Guidelines</h2>
                                    </div>
                                    <button onClick={() => setShowGuidelines(false)} className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="space-y-6 text-slate-300">
                                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                        <h4 className="text-amber-400 font-bold mb-2 flex items-center gap-2"><Shield className="w-4 h-4"/> Maintain Confidentiality</h4>
                                        <p className="text-sm leading-relaxed">Never share sensitive, identifiable personal data, or specifics regarding active and sealed cases. Protect Attorney-Client privilege at all times.</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                        <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2"><Users className="w-4 h-4"/> Professional Conduct</h4>
                                        <p className="text-sm leading-relaxed">Communicate with fellow colleagues respectfully. The Lxwyer Network is a place for collaboration, referrals, and high-level debate, not hostility.</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                        <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2"><FileText className="w-4 h-4"/> Cite Your Sources</h4>
                                        <p className="text-sm leading-relaxed">When sharing case law or statutory interpretations, try to provide citations, case numbers, or attach relevant public documents directly to the thread.</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowGuidelines(false)} className="mt-8 w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-colors">
                                    I Understand
                                </button>
                            </div>
                        </motion.div>
                    )}
                    {showMembers && (
                        <motion.div
                            key="members"
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            style={{ willChange: 'opacity' }}
                            className="absolute inset-0 z-[100] bg-[#0a0a0a] p-6 overflow-y-auto"
                        >
                            <div className="max-w-4xl mx-auto">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-3xl font-black text-white tracking-tight">{activeState || 'Lxwyer'} Lawyers</h2>
                                        <p className="text-blue-400 mt-1 font-medium">{networkLawyers.length} registered professionals in your state network</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input 
                                                placeholder="Search lawyers by name or specialty..."
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                                className="pl-10 pr-4 py-2.5 rounded-full text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 w-[250px] transition-all"
                                            />
                                        </div>
                                        <button onClick={() => { setShowMembers(false); setSearchTerm(''); setDebouncedSearchTerm(''); }} className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {loadingLawyers ? (
                                    <div className="flex flex-col items-center justify-center p-20 gap-4">
                                        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                                        <p className="text-slate-400 font-medium tracking-wide animate-pulse">Loading state network...</p>
                                    </div>
                                ) : filteredLawyers.length === 0 ? (
                                    <div className="p-16 text-center border border-white/5 rounded-3xl bg-black/40">
                                        <Users className="w-16 h-16 text-white/10 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-white mb-2">No lawyers found</h3>
                                        <p className="text-slate-500">Could not find anyone matching your search in the {activeState} network.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {filteredLawyers.map((lw) => (
                                            <div 
                                                key={lw._id || lw.id}
                                                className="flex items-center gap-4 p-4 rounded-2xl bg-[#111111] hover:bg-[#1a1b1e] border border-white/5 cursor-pointer transition-colors shadow-lg hover:border-white/10"
                                                onClick={() => setSelectedProfile({ full_name: lw.full_name, photo: lw.photo, id: lw._id || lw.id, unique_id: lw.unique_id, specialization: lw.specialization })}
                                            >
                                                <Avatar name={lw.full_name} photo={lw.photo} size={14} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-white text-[15px] truncate">{lw.full_name}</p>
                                                    <p className="text-[13px] text-blue-400 truncate mt-0.5">{lw.specialization || 'General Practice'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content Area (Messages OR Overlays) */}
                <div className="relative z-10 flex-1 overflow-y-auto px-4 py-3"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: darkMode ? 'rgba(255,255,255,0.1) transparent' : 'rgba(0,0,0,0.1) transparent' }}>

                    {grouped.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center gap-3">
                            <div className="px-5 py-3 rounded-lg text-[13px]" style={{ background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', color: WA.timeText }}>
                                No messages yet — start the conversation!
                            </div>
                        </div>
                    )}

                    {grouped.map((item, idx) => {
                        if (item.type === 'separator') {
                            const d = item.date;
                            const today = new Date();
                            const yest = new Date(today); yest.setDate(yest.getDate() - 1);
                            const label = d.toDateString() === today.toDateString() ? 'Today'
                                : d.toDateString() === yest.toDateString() ? 'Yesterday'
                                    : d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
                            return (
                                <div key={`sep-${d.toISOString()}`} className="flex justify-center my-4">
                                    <span className="px-3 py-1 rounded-lg text-[11px] font-medium shadow-sm"
                                        style={{ background: darkMode ? '#182229' : '#ffffff', color: WA.timeText, boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                                        {label}
                                    </span>
                                </div>
                            );
                        }

                        const msg = item.data;
                        // Use stable msg.id as key; fall back to idx only if no id
                        const msgKey = msg.id || `msg-${idx}`;
                        const msgIdx = msg.id || idx;
                        const isMe = msg.sender_id === currentUser?.id;
                        const prevItem = grouped[idx - 1];
                        const showSender = !prevItem || prevItem.type === 'separator' || prevItem.data?.sender_id !== msg.sender_id;
                        const nextItem = grouped[idx + 1];
                        const isLast = !nextItem || nextItem.type === 'separator' || nextItem.data?.sender_id !== msg.sender_id;
                        const msgReactions = reactions[msgIdx] || [];

                        return (
                            <div
                                key={msgKey}
                                onMouseEnter={() => setHoveredMsg(msgIdx)}
                                onMouseLeave={() => { setHoveredMsg(null); setShowEmojiFor(null); }}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${showSender && idx > 0 ? 'mt-3' : 'mt-0.5'} relative px-1`}
                            >
                                {/* Avatar for others (only for first in a group) */}
                                {!isMe && (
                                    <div className="w-8 mr-1.5 flex-shrink-0 self-end mb-1">
                                        {isLast && (
                                            <Avatar name={msg.sender_name} photo={msg.sender_photo} size={8}
                                                onClick={() => setSelectedProfile({ full_name: msg.sender_name, photo: msg.sender_photo, id: msg.sender_id, unique_id: msg.sender_unique_id, specialization: msg.sender_specialization })} />
                                        )}
                                    </div>
                                )}

                                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[65%]`}>
                                    {/* Sender name (others only, first in group) */}
                                    {!isMe && showSender && (
                                        <button
                                            onClick={() => setSelectedProfile({ full_name: msg.sender_name, photo: msg.sender_photo, id: msg.sender_id, unique_id: msg.sender_unique_id, specialization: msg.sender_specialization })}
                                            className="text-[12px] font-semibold mb-1 ml-3 hover:underline"
                                            style={{ color: WA.senderName }}>
                                            {msg.sender_name}
                                        </button>
                                    )}

                                    {/* Message bubble */}
                                    <div className="relative" style={{
                                        background: isMe ? WA.sentBg : WA.recvBg,
                                        color: isMe ? WA.sentText : WA.recvText,
                                        borderRadius: isMe
                                            ? (isLast ? '12px 12px 4px 12px' : '12px')
                                            : (isLast ? '12px 12px 12px 4px' : '12px'),
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                                        maxWidth: '100%',
                                        paddingLeft: '9px',
                                        paddingRight: '9px',
                                        paddingTop: '6px',
                                        paddingBottom: '6px',
                                    }}>
                                        {/* File attachment */}
                                        {msg.file_url && (
                                            <div className="mb-1.5 rounded-lg overflow-hidden"
                                                style={{ background: isMe ? 'rgba(0,0,0,0.07)' : (darkMode ? 'rgba(255,255,255,0.05)' : '#f0f2f5') }}>
                                                {msg.file_type?.startsWith('image/') ? (
                                                    <a href={msg.file_url.startsWith('http') ? msg.file_url : `http://localhost:8000${msg.file_url}`}
                                                        target="_blank" rel="noopener noreferrer" className="block">
                                                        <img
                                                            src={msg.file_url.startsWith('http') ? msg.file_url : `http://localhost:8000${msg.file_url}`}
                                                            alt={msg.file_name || 'image'}
                                                            className="w-full max-h-60 object-cover rounded-md hover:opacity-90 transition-opacity" />
                                                    </a>
                                                ) : (
                                                    <a href={msg.file_url.startsWith('http') ? msg.file_url : `http://localhost:8000${msg.file_url}`}
                                                        target="_blank" rel="noopener noreferrer"
                                                        className="flex items-center gap-2.5 px-3 py-2.5 hover:opacity-80 transition-opacity">
                                                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                                                            style={{ background: '#2563eb' }}>
                                                            <FileText className="w-4 h-4 text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[13px] font-medium truncate">{msg.file_name || 'Document'}</p>
                                                            <p className="text-[11px] uppercase font-medium mt-0.5" style={{ color: WA.timeText }}>
                                                                {msg.file_type?.split('/')[1] || 'file'}
                                                            </p>
                                                        </div>
                                                        <Download className="w-4 h-4 flex-shrink-0" style={{ color: WA.timeText }} />
                                                    </a>
                                                )}
                                            </div>
                                        )}

                                        {/* Text content */}
                                        {msg.content && (
                                            <p className="text-[14px] leading-relaxed whitespace-pre-wrap break-words pr-12" style={{ color: isMe ? WA.sentText : WA.recvText }}>
                                                {msg.content}
                                            </p>
                                        )}

                                        {/* Timestamp + delivered label */}
                                        <div className="flex justify-end items-center gap-1.5 mt-0.5" style={{ marginBottom: '-2px' }}>
                                            <span className="text-[11px]" style={{ color: isMe ? (darkMode ? 'rgba(224,234,255,0.5)' : 'rgba(30,58,138,0.5)') : WA.timeText }}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {isMe && (
                                                <span className="text-[9px] font-semibold tracking-wide" style={{ color: darkMode ? 'rgba(96,165,250,0.7)' : 'rgba(37,99,235,0.6)' }}>
                                                    Delivered
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Reactions */}
                                    {msgReactions.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {msgReactions.map((r, ri) => (
                                                <button key={ri} onClick={() => handleReact(msgIdx, r.emoji)}
                                                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] shadow-sm"
                                                    style={{ background: darkMode ? '#182229' : '#fff', border: `1px solid ${WA.sidebarBorder}` }}>
                                                    {r.emoji} <span className="font-bold">{r.count}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Emoji picker on hover */}
                                {hoveredMsg === msgIdx && (
                                    <div className={`absolute ${isMe ? 'right-full mr-2' : 'left-full ml-2'} top-1/2 -translate-y-1/2 z-20`}>
                                        <AnimatePresence>
                                            {showEmojiFor === msgIdx ? (
                                                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                                                    className="flex gap-1 p-2 rounded-2xl shadow-xl"
                                                    style={{ background: darkMode ? '#182229' : '#fff', border: `1px solid ${WA.sidebarBorder}` }}>
                                                    {QUICK_EMOJIS.map(e => (
                                                        <button key={e} onClick={() => handleReact(msgIdx, e)}
                                                            className="text-lg hover:scale-125 transition-transform leading-none p-0.5">{e}</button>
                                                    ))}
                                                </motion.div>
                                            ) : (
                                                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                    onClick={() => setShowEmojiFor(msgIdx)}
                                                    className="p-1.5 rounded-full shadow-sm"
                                                    style={{ background: darkMode ? '#182229' : '#fff', border: `1px solid ${WA.sidebarBorder}`, color: WA.timeText }}>
                                                    <Smile className="w-3.5 h-3.5" />
                                                </motion.button>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} className="h-2" />
                </div>

                {/* File preview above input */}
                <AnimatePresence>
                    {selectedFile && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                            className="relative z-10 mx-3 mb-1 p-3 rounded-xl flex items-center justify-between shadow-sm"
                            style={{ background: WA.inputBg, border: `1px solid ${WA.sidebarBorder}` }}>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#2563eb' }}>
                                    {selectedFile.type?.startsWith('image/') ? <ImageIcon className="w-4 h-4 text-white" /> : <FileText className="w-4 h-4 text-white" />}
                                </div>
                                <div>
                                    <p className="text-[13px] font-medium truncate max-w-[200px]" style={{ color: WA.inputText }}>{selectedFile.name}</p>
                                    <p className="text-[11px]" style={{ color: WA.timeText }}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedFile(null)} className="p-1.5 rounded-full hover:bg-black/5">
                                <X className="w-4 h-4" style={{ color: WA.timeText }} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Input bar — WhatsApp style ── */}
                <div className="relative z-10 flex items-end gap-2 px-3 py-3" style={{ background: WA.footerBg }}>
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />

                    {/* Attach button */}
                    <button onClick={() => fileInputRef.current?.click()}
                        className="p-2.5 rounded-full flex-shrink-0 transition-colors"
                        style={{ color: WA.timeText }} title="Attach file">
                        <Paperclip className="w-5 h-5" />
                    </button>

                    {/* Text input pill */}
                    <div className="flex-1 flex items-end rounded-3xl px-4 py-2.5 min-h-[44px]" style={{ background: WA.inputBg }}>
                        <textarea
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }
                            }}
                            placeholder="Type a message"
                            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-[14px] resize-none max-h-28"
                            style={{ color: WA.inputText, lineHeight: '1.4' }}
                            rows={1}
                        />
                    </div>

                    {/* Send button — dashboard blue circle */}
                    <button
                        onClick={handleSendMessage}
                        disabled={loading || (!newMessage.trim() && !selectedFile)}
                        className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                        style={{
                            background: (!newMessage.trim() && !selectedFile) ? (darkMode ? '#1f2937' : '#e5e7eb') : '#2563eb',
                            color: (!newMessage.trim() && !selectedFile) ? WA.timeText : '#fff',
                        }}>
                        {loading
                            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            : <Send className="w-5 h-5 ml-0.5" />
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}
