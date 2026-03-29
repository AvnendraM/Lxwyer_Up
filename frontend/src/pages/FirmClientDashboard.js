import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Shield, LogOut, LayoutDashboard, FileText, MessageSquare, Settings,
  User, Building2, Clock, CheckCircle, AlertCircle, ChevronRight,
  Scale, Briefcase, Phone, Mail, Calendar, Menu, X, Star,
  Upload, Download, RefreshCw, Bell, Send
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '../App';

const cardBase = 'bg-slate-900 border border-slate-800 rounded-2xl p-6';
const labelCls = 'block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider';
const inputCls = 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-teal-500 rounded-xl';

function Badge({ status }) {
  const map = {
    active: 'bg-teal-900/60 text-teal-300 border-teal-700',
    pending: 'bg-amber-900/60 text-amber-300 border-amber-700',
    completed: 'bg-blue-900/60 text-blue-300 border-blue-700',
    inactive: 'bg-slate-800 text-slate-400 border-slate-700',
  };
  return <span className={`px-2.5 py-0.5 text-xs font-semibold border rounded-full capitalize ${map[status] || map.pending}`}>{status}</span>;
}

function TimelineItem({ update, last }) {
  const iconMap = {
    meeting_scheduled: { icon: Calendar, color: 'text-blue-400 bg-blue-900/30 border-blue-700' },
    document_submitted: { icon: FileText, color: 'text-teal-400 bg-teal-900/30 border-teal-700' },
    hearing_date: { icon: Scale, color: 'text-amber-400 bg-amber-900/30 border-amber-700' },
    progress_update: { icon: ChevronRight, color: 'text-indigo-400 bg-indigo-900/30 border-indigo-700' },
  };
  const { icon: Icon, color } = iconMap[update.update_type] || iconMap.progress_update;
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-9 h-9 border rounded-xl flex items-center justify-center shrink-0 ${color}`}><Icon className="w-4 h-4" /></div>
        {!last && <div className="w-0.5 flex-1 bg-slate-800 mt-2" />}
      </div>
      <div className="pb-6 flex-1">
        <p className="font-semibold text-white text-sm">{update.title}</p>
        <p className="text-xs text-slate-400 mt-1">{update.description}</p>
        <p className="text-xs text-slate-600 mt-1">{update.created_by} · {new Date(update.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      </div>
    </div>
  );
}

export default function FirmClientDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [caseUpdates, setCaseUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const nav = [
    { id: 'overview', icon: LayoutDashboard, label: 'My Case' },
    { id: 'updates', icon: Clock, label: 'Case Timeline' },
    { id: 'documents', icon: FileText, label: 'Documents' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'profile', icon: User, label: 'My Profile' },
  ];

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const stored = sessionStorage.getItem('user');
    if (!token || !stored) { navigate('/firm-client-login'); return; }
    const u = JSON.parse(stored);
    setUser(u);
    const clientId = u.id || u.client_id;
    if (clientId) {
      axios.get(`${API}/firm-clients/${clientId}/case-updates`)
        .then(r => setCaseUpdates(r.data || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else { setLoading(false); }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    toast.success('Logged out');
    navigate('/');
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    toast.success('Message sent to your assigned lawyer!');
    setMessage('');
  };

  if (!user) return null;

  const caseProgress = caseUpdates.length > 0
    ? Math.min(100, Math.round((caseUpdates.length / 8) * 100))
    : 10;

  return (
    <div className="min-h-screen bg-black text-white flex overflow-x-hidden" style={{ height: '100dvh' }}>
      {sidebarOpen && <div className="fixed inset-0 bg-black/70 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0 md:z-auto shrink-0`}>
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block">LxwyerUp</span>
            <span className="text-xs text-blue-400 font-semibold">CLIENT PORTAL</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto md:hidden text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {nav.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${activeTab === item.id ? 'bg-gradient-to-r from-blue-600/30 to-blue-500/10 text-blue-300 border border-blue-700/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <item.icon className="w-4 h-4 shrink-0" /><span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user.full_name}</p>
            <p className="text-xs text-blue-400">{user.law_firm_name || 'Firm Client'}</p>
          </div>
          <button onClick={handleLogout} className="text-slate-500 hover:text-rose-400 transition-colors"><LogOut className="w-4 h-4" /></button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center px-4 sm:px-6 gap-4 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-400 hover:text-white p-2 -ml-2"><Menu className="w-5 h-5" /></button>
          <h1 className="text-base font-bold text-white capitalize">{nav.find(n => n.id === activeTab)?.label || 'Dashboard'}</h1>
          <div className="ml-auto flex items-center gap-3">
            <Badge status={user.status || 'active'} />
            <div className="w-8 h-8 bg-blue-600/20 border border-blue-700 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-blue-400" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait">

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Welcome, <span className="text-blue-400">{user.full_name?.split(' ')[0]}</span></h2>
                  <p className="text-slate-400 text-sm mt-1">Track your case progress and stay updated with your legal team.</p>
                </div>

                {/* Case Card */}
                <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/20 border border-blue-800/50 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">Active Case</p>
                      <h3 className="text-xl font-bold text-white">{user.case_type}</h3>
                      <p className="text-slate-400 text-sm mt-1 line-clamp-2">{user.case_description}</p>
                    </div>
                    <Badge status={user.status || 'active'} />
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                      <span>Case Progress</span><span>{caseProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-700" style={{ width: `${caseProgress}%` }} />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{caseUpdates.length} update{caseUpdates.length !== 1 ? 's' : ''} recorded</p>
                  </div>
                </div>

                {/* Assigned Lawyer */}
                <div className={cardBase}>
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Scale className="w-5 h-5 text-blue-400" />Your Assigned Lawyer</h3>
                  {user.assigned_lawyer_name ? (
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-teal-600/30 to-teal-400/10 border border-teal-700/50 rounded-2xl flex items-center justify-center text-xl font-bold text-teal-300">
                        {user.assigned_lawyer_name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-white text-lg">{user.assigned_lawyer_name}</p>
                        <p className="text-sm text-slate-400">{user.law_firm_name}</p>
                        <div className="flex items-center gap-1 mt-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /><span className="text-xs text-amber-400">Verified APEX Lawyer</span></div>
                      </div>
                      <button onClick={() => setActiveTab('messages')} className="px-4 py-2 bg-blue-600/20 text-blue-300 border border-blue-700/50 text-sm font-semibold rounded-xl hover:bg-blue-600/40 transition-all flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />Message
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <User className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                      <p className="text-slate-400">No lawyer assigned yet.</p>
                      <p className="text-slate-500 text-sm">Your firm is reviewing your case and will assign a lawyer soon.</p>
                    </div>
                  )}
                </div>

                {/* Firm Info */}
                <div className={cardBase}>
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-blue-400" />Your Law Firm</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[['Firm Name', user.law_firm_name],['Case Type', user.case_type],['Status', user.status || 'active'],['Member Since', user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN') : '—']].map(([label, val]) => (
                      <div key={label} className="bg-slate-800/60 rounded-xl p-3">
                        <p className="text-xs text-slate-500 mb-1">{label}</p>
                        <p className="text-sm font-semibold text-white capitalize">{val || '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TIMELINE */}
            {activeTab === 'updates' && (
              <motion.div key="updates" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <h2 className="text-xl font-bold text-white">Case Timeline</h2>
                <div className={cardBase}>
                  {loading ? <p className="text-slate-500 text-center py-8">Loading...</p>
                  : caseUpdates.length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                      <p className="text-slate-400 font-semibold">No updates yet</p>
                      <p className="text-slate-500 text-sm mt-1">Your lawyer will post updates here as your case progresses.</p>
                    </div>
                  ) : (
                    <div className="pt-2">
                      {caseUpdates.map((u, i) => <TimelineItem key={u.id} update={u} last={i === caseUpdates.length - 1} />)}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* DOCUMENTS */}
            {activeTab === 'documents' && (
              <motion.div key="documents" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <h2 className="text-xl font-bold text-white">Case Documents</h2>
                <div className={cardBase}>
                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-10 text-center hover:border-blue-600 transition-all cursor-pointer group">
                    <Upload className="w-10 h-10 text-slate-600 group-hover:text-blue-400 mx-auto mb-3 transition-colors" />
                    <p className="text-slate-400 font-semibold">Upload Document</p>
                    <p className="text-slate-500 text-sm mt-1">PDF, JPG, PNG — Max 10 MB</p>
                    <p className="text-slate-600 text-xs mt-3">Documents shared with your lawyer and firm</p>
                  </div>
                </div>
                <div className={cardBase}>
                  <h3 className="font-bold text-white mb-4">Documents from Your Application</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Case Application', type: 'PDF', size: '—', date: user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN') : '—' },
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <div className="w-10 h-10 bg-blue-900/30 border border-blue-700/40 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5 text-blue-400" /></div>
                        <div className="flex-1"><p className="text-sm font-semibold text-white">{doc.name}</p><p className="text-xs text-slate-400">{doc.type} · {doc.date}</p></div>
                        <button className="p-2 text-slate-400 hover:text-blue-400 transition-colors"><Download className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* MESSAGES */}
            {activeTab === 'messages' && (
              <motion.div key="messages" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <h2 className="text-xl font-bold text-white">Messages</h2>
                <div className={`${cardBase} flex flex-col`} style={{ minHeight: '420px' }}>
                  <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-800">
                    {user.assigned_lawyer_name ? (
                      <>
                        <div className="w-9 h-9 bg-teal-600/20 border border-teal-700/50 rounded-lg flex items-center justify-center font-bold text-teal-300 text-sm">{user.assigned_lawyer_name?.[0]}</div>
                        <div><p className="font-bold text-white text-sm">{user.assigned_lawyer_name}</p><p className="text-xs text-teal-400">Your Lawyer</p></div>
                      </>
                    ) : <p className="text-slate-400 text-sm">No lawyer assigned yet</p>}
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm">No messages yet</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-800">
                    <input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Type a message to your lawyer..." className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                    <button onClick={sendMessage} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PROFILE */}
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <h2 className="text-xl font-bold text-white">My Profile</h2>
                <div className={cardBase}>
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white">{user.full_name?.[0]?.toUpperCase()}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{user.full_name}</h3>
                      <p className="text-blue-400 text-sm">{user.law_firm_name}</p>
                      <Badge status={user.status || 'active'} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[['Email', user.email],['Phone', user.phone],['Company/Org', user.company_name || '—'],['Case Type', user.case_type],['Law Firm', user.law_firm_name],['Assigned Lawyer', user.assigned_lawyer_name || 'Pending'],['Joined', user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN') : '—'],['Status', user.status || 'active']].map(([label, val]) => (
                      <div key={label} className="bg-slate-800/60 rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1">{label}</p>
                        <p className="text-sm font-semibold text-white capitalize">{val || '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {user.case_description && (
                  <div className={cardBase}>
                    <h3 className="font-bold text-white mb-3">Case Description</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{user.case_description}</p>
                  </div>
                )}
                <div className={cardBase}>
                  <h3 className="font-bold text-white mb-4">Account Actions</h3>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 bg-rose-900/30 hover:bg-rose-900/60 text-rose-400 border border-rose-800 rounded-xl text-sm font-semibold transition-all">
                    <LogOut className="w-4 h-4" />Sign Out
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
