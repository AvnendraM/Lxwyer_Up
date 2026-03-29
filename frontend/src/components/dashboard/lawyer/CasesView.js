import React, { useState } from 'react';
import { useHorizontalScroll } from '../../../hooks/useHorizontalScroll';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, MoreVertical, Calendar, User, ChevronDown, ChevronUp, Send, Plus, CheckCircle } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import axios from 'axios';
import { toast } from 'sonner';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const CasesView = ({ cases = [], darkMode, onNewCase }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [expandedCaseId, setExpandedCaseId] = useState(null);
    const [updateForm, setUpdateForm] = useState({ title: '', description: '' });
    const [submitting, setSubmitting] = useState(false);
    const [localUpdates, setLocalUpdates] = useState({}); // caseId -> updates[] optimistic state
    const filterScrollRef = useHorizontalScroll();

    const token = sessionStorage.getItem('token');

    const filteredCases = cases.filter(c => {
        const matchesSearch =
            (c.client_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (c.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (c.case_number?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        if (filterStatus === 'all') return matchesSearch;
        return matchesSearch && (c.status?.toLowerCase() === filterStatus);
    });

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return darkMode ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-green-700 bg-green-100 border-green-200';
            case 'pending': return darkMode ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' : 'text-amber-700 bg-amber-100 border-amber-200';
            case 'closed': return darkMode ? 'text-gray-400 bg-gray-400/10 border-gray-400/20' : 'text-gray-700 bg-gray-100 border-gray-200';
            default: return darkMode ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-blue-700 bg-blue-100 border-blue-200';
        }
    };

    const handlePostUpdate = async (caseId) => {
        if (!updateForm.title.trim() || !updateForm.description.trim()) {
            toast.error('Please fill in both title and description.');
            return;
        }
        setSubmitting(true);
        try {
            const res = await axios.patch(
                `${API}/cases/${caseId}/updates`,
                { title: updateForm.title, description: updateForm.description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Optimistic local update
            setLocalUpdates(prev => ({
                ...prev,
                [caseId]: [...(prev[caseId] || []), res.data.update]
            }));
            setUpdateForm({ title: '', description: '' });
            toast.success('Update posted to client timeline!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to post update. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const getCaseUpdates = (c) => {
        const local = localUpdates[c.id] || [];
        return [...(c.updates || []), ...local];
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-8 h-full flex flex-col"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-[#0F2944]'}`}>Case Management</h1>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage and send updates to your clients</p>
                </div>
                {onNewCase && (
                    <button
                        onClick={onNewCase}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        New Case
                    </button>
                )}
            </div>

            {/* Filters & Search */}
            <div className={`p-4 rounded-2xl border mb-6 flex flex-col md:flex-row gap-4 items-center ${darkMode ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-gray-200'}`}>
                <div className="relative flex-1 w-full">
                    <Search className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <Input
                        placeholder="Search by client, case no, or title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-10 rounded-xl ${darkMode ? 'bg-white/5 border-white/5 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-[#0F2944]'}`}
                    />
                </div>
                <div ref={filterScrollRef} className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {['all', 'active', 'pending', 'closed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize whitespace-nowrap ${filterStatus === status
                                ? (darkMode ? 'bg-blue-600 text-white' : 'bg-[#0F2944] text-white')
                                : (darkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-50 text-gray-600 hover:bg-gray-100')
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cases List */}
            {filteredCases.length > 0 ? (
                <div className="space-y-4 pb-20 overflow-y-auto">
                    {filteredCases.map((c, idx) => {
                        const isExpanded = expandedCaseId === (c.id || idx);
                        const updates = getCaseUpdates(c);
                        return (
                            <motion.div
                                key={c.id || idx}
                                variants={itemVariants}
                                className={`rounded-2xl border ${darkMode ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-gray-200'} overflow-hidden`}
                            >
                                {/* Case Row */}
                                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs font-mono px-2 py-0.5 rounded ${darkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                                                    #{c.case_number || (c.id && c.id.substring(0, 8)) || idx}
                                                </span>
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded border ${getStatusColor(c.status || 'active')}`}>
                                                    {c.status || 'Active'}
                                                </span>
                                            </div>
                                            <h3 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-[#0F2944]'}`}>
                                                {c.title || c.case_type || 'Untitled Case'}
                                            </h3>
                                            <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Client: {c.client_name || 'Unknown'} {c.court ? `• ${c.court}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`text-xs font-medium ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {updates.length} update{updates.length !== 1 ? 's' : ''}
                                        </div>
                                        <button
                                            onClick={() => {
                                                setExpandedCaseId(isExpanded ? null : (c.id || idx));
                                                setUpdateForm({ title: '', description: '' });
                                            }}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${darkMode ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            Post Update
                                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded: Timeline + Post Update Form */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className={`px-5 pb-5 border-t ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
                                                {/* Post Update Form */}
                                                <div className={`mt-4 p-4 rounded-xl ${darkMode ? 'bg-white/5 border-white/5' : 'bg-blue-50 border-blue-100'} border`}>
                                                    <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>Post a New Update to Client</p>
                                                    <input
                                                        type="text"
                                                        placeholder="Update title (e.g. Court Date Rescheduled)"
                                                        value={updateForm.title}
                                                        onChange={e => setUpdateForm(f => ({ ...f, title: e.target.value }))}
                                                        className={`w-full rounded-lg px-3 py-2 text-sm mb-2 border outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-white/10 border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900'}`}
                                                    />
                                                    <textarea
                                                        placeholder="Describe the update for your client..."
                                                        value={updateForm.description}
                                                        onChange={e => setUpdateForm(f => ({ ...f, description: e.target.value }))}
                                                        rows={3}
                                                        className={`w-full rounded-lg px-3 py-2 text-sm mb-3 border outline-none focus:ring-2 focus:ring-blue-500 resize-none ${darkMode ? 'bg-white/10 border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900'}`}
                                                    />
                                                    <button
                                                        onClick={() => handlePostUpdate(c.id)}
                                                        disabled={submitting}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
                                                    >
                                                        <Send className="w-4 h-4" />
                                                        {submitting ? 'Sending...' : 'Send to Client'}
                                                    </button>
                                                </div>

                                                {/* Timeline */}
                                                {updates.length > 0 && (
                                                    <div className="mt-5">
                                                        <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Update History</p>
                                                        <div className="space-y-3 pl-4 border-l-2 border-blue-200 dark:border-blue-900">
                                                            {[...updates].reverse().map((u, uIdx) => (
                                                                <div key={uIdx} className="relative">
                                                                    <div className="absolute -left-[1.15rem] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-[#1c1c1c]" />
                                                                    <div className={`ml-2 p-3 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                                                        <div className="flex justify-between items-start mb-1">
                                                                            <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{u.title}</p>
                                                                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                                                {u.date ? new Date(u.date).toLocaleDateString() : 'Today'}
                                                                            </span>
                                                                        </div>
                                                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{u.description}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className={`flex-1 flex flex-col items-center justify-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                        <FileText className="w-10 h-10 opacity-20" />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>No cases found</h3>
                    <p className="max-w-xs text-center text-sm">
                        {searchTerm || filterStatus !== 'all' ? "Try adjusting your search or filters" : "You have no assigned cases yet."}
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default CasesView;
