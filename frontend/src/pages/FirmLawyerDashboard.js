import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../components/ui/input';
import {
  Briefcase, LogOut, LayoutDashboard, Users, FileText, TrendingUp,
  MessageSquare, Settings, User, Scale, Clock, CheckCircle, AlertCircle,
  Star, Phone, Mail, Menu, X, RefreshCw, Send, Plus, Edit,
  CheckSquare, Square, Timer, Award, BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '../App';

const cardBase = 'bg-slate-900 border border-slate-800 rounded-2xl p-6';
const labelCls = 'block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider';
const inputCls = 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-teal-500 rounded-xl';

const priorityColors = {
  urgent: 'bg-rose-900/40 text-rose-300 border-rose-700',
  high: 'bg-amber-900/40 text-amber-300 border-amber-700',
  medium: 'bg-blue-900/40 text-blue-300 border-blue-700',
  low: 'bg-teal-900/40 text-teal-300 border-teal-700',
};

const statusColors = {
  pending: 'bg-amber-900/40 text-amber-300 border-amber-700',
  in_progress: 'bg-blue-900/40 text-blue-300 border-blue-700',
  completed: 'bg-teal-900/40 text-teal-300 border-teal-700',
};

function Badge({ label, color }) {
  return <span className={`px-2.5 py-0.5 text-xs font-semibold border rounded-full capitalize ${color}`}>{label}</span>;
}

function TaskCard({ task, onStatusChange }) {
  const next = { pending: 'in_progress', in_progress: 'completed', completed: 'pending' };
  const nextLabel = { pending: 'Start', in_progress: 'Complete', completed: 'Reopen' };
  return (
    <div className={`p-4 bg-slate-800/50 rounded-xl border transition-all ${task.status === 'completed' ? 'border-teal-800/40 opacity-70' : 'border-slate-700/50 hover:border-teal-700/30'}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className={`font-semibold text-sm ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-white'}`}>{task.title}</p>
        <Badge label={task.priority} color={priorityColors[task.priority] || priorityColors.medium} />
      </div>
      {task.description && <p className="text-xs text-slate-400 mb-3 line-clamp-2">{task.description}</p>}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex gap-2 items-center">
          <Badge label={task.status?.replace('_', ' ')} color={statusColors[task.status] || statusColors.pending} />
          {task.due_date && <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(task.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
        </div>
        <button onClick={() => onStatusChange(task.id, next[task.status] || 'pending')}
          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${task.status === 'completed' ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-teal-600 hover:bg-teal-500 text-white'}`}>
          {nextLabel[task.status] || 'Update'}
        </button>
      </div>
    </div>
  );
}

export default function FirmLawyerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskFilter, setTaskFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [caseUpdateForm, setCaseUpdateForm] = useState({ title: '', description: '', update_type: 'progress_update' });

  const nav = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'tasks', icon: CheckSquare, label: 'My Tasks' },
    { id: 'clients', icon: Users, label: 'My Clients' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'performance', icon: TrendingUp, label: 'Performance' },
    { id: 'profile', icon: User, label: 'My Profile' },
  ];

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const stored = sessionStorage.getItem('user');
    if (!token || !stored) { navigate('/firm-lawyer-login'); return; }
    const u = JSON.parse(stored);
    setUser(u);
    fetchAll(u.id, u.firm_id, token);
  }, [navigate]);

  const fetchAll = async (lawyerId, firmId, token) => {
    setLoading(true);
    const headers = { Authorization: `Bearer ${token}` };
    const [tRes, cRes] = await Promise.allSettled([
      axios.get(`${API}/firm-lawyers/tasks/by-lawyer/${lawyerId}`, { headers }),
      axios.get(`${API}/firm-clients/firm/${firmId}/list`, { headers })
    ]);
    if (tRes.status === 'fulfilled') setTasks(tRes.value.data || []);
    if (cRes.status === 'fulfilled') {
      const myClients = (cRes.value.data || []).filter(c => c.assigned_lawyer_id === lawyerId);
      setClients(myClients);
    }
    setLoading(false);
  };

  const refetch = () => {
    const u = user;
    const token = sessionStorage.getItem('token');
    if (u) fetchAll(u.id, u.firm_id, token);
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`${API}/firm-lawyers/tasks/${taskId}/status?status=${status}`);
      toast.success(`Task marked as ${status.replace('_', ' ')}`);
      refetch();
    } catch (e) { toast.error('Failed to update task'); }
  };

  const submitCaseUpdate = async () => {
    if (!caseUpdateForm.title || !selectedClient) return;
    try {
      await axios.post(`${API}/firm-clients/case-updates`, {
        client_id: selectedClient.id,
        law_firm_id: user.firm_id,
        update_type: caseUpdateForm.update_type,
        title: caseUpdateForm.title,
        description: caseUpdateForm.description,
        created_by: user.email,
      });
      toast.success('Case update posted!');
      setCaseUpdateForm({ title: '', description: '', update_type: 'progress_update' });
    } catch (e) { toast.error('Failed to post update'); }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    toast.success('Logged out');
    navigate('/');
  };

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const filteredTasks = taskFilter === 'all' ? tasks : tasks.filter(t => t.status === taskFilter);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white flex overflow-x-hidden" style={{ height: '100dvh' }}>
      {sidebarOpen && <div className="fixed inset-0 bg-black/70 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0 md:z-auto shrink-0`}>
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block">LxwyerUp</span>
            <span className="text-xs text-indigo-400 font-semibold">LAWYER PORTAL</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto md:hidden text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {nav.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${activeTab === item.id ? 'bg-gradient-to-r from-indigo-600/30 to-violet-500/10 text-indigo-300 border border-indigo-700/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <item.icon className="w-4 h-4 shrink-0" /><span>{item.label}</span>
              {item.id === 'tasks' && pendingTasks > 0 && <span className="ml-auto bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">{pendingTasks}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">{user.full_name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user.full_name}</p>
            <p className="text-xs text-indigo-400">{user.firm_name || 'Law Firm'}</p>
          </div>
          <button onClick={handleLogout} className="text-slate-500 hover:text-rose-400 transition-colors"><LogOut className="w-4 h-4" /></button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center px-4 sm:px-6 gap-4 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-400 hover:text-white p-2 -ml-2"><Menu className="w-5 h-5" /></button>
          <h1 className="text-base font-bold text-white">{nav.find(n => n.id === activeTab)?.label}</h1>
          <div className="ml-auto flex items-center gap-3">
            <button onClick={refetch} className="p-2 text-slate-400 hover:text-indigo-400 transition-colors"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
            <div className="w-8 h-8 bg-indigo-600/20 border border-indigo-700 rounded-lg flex items-center justify-center">
              <Scale className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait">

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Good day, <span className="text-indigo-400">{user.full_name?.split(' ')[0]}</span></h2>
                  <p className="text-slate-400 text-sm mt-1">{user.specialization || 'Lawyer'} at {user.firm_name}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Tasks', value: tasks.length, icon: FileText, color: 'from-indigo-600/20 to-indigo-500/10 border-indigo-800 text-indigo-400' },
                    { label: 'My Clients', value: clients.length, icon: Users, color: 'from-teal-600/20 to-teal-500/10 border-teal-800 text-teal-400' },
                    { label: 'Pending', value: pendingTasks, icon: Clock, color: 'from-amber-600/20 to-amber-500/10 border-amber-800 text-amber-400' },
                    { label: 'Completion Rate', value: `${completionRate}%`, icon: TrendingUp, color: 'from-blue-600/20 to-blue-500/10 border-blue-800 text-blue-400' },
                  ].map((s, i) => (
                    <div key={i} className={`bg-gradient-to-br ${s.color} border rounded-2xl p-5`}>
                      <s.icon className="w-6 h-6 mb-3" />
                      <p className="text-3xl font-bold text-white mb-1">{s.value}</p>
                      <p className="text-sm text-slate-400">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Pending Tasks Quick View */}
                {pendingTasks > 0 && (
                  <div className={cardBase}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-white flex items-center gap-2"><AlertCircle className="w-5 h-5 text-amber-400" />Urgent / Pending Tasks</h3>
                      <button onClick={() => setActiveTab('tasks')} className="text-xs text-indigo-400 hover:text-indigo-300">View all →</button>
                    </div>
                    <div className="space-y-3">
                      {tasks.filter(t => t.status !== 'completed').slice(0, 3).map(task => (
                        <TaskCard key={task.id} task={task} onStatusChange={updateTaskStatus} />
                      ))}
                    </div>
                  </div>
                )}

                {/* My Clients Quick View */}
                {clients.length > 0 && (
                  <div className={cardBase}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-white flex items-center gap-2"><Users className="w-5 h-5 text-teal-400" />My Clients</h3>
                      <button onClick={() => setActiveTab('clients')} className="text-xs text-indigo-400 hover:text-indigo-300">View all →</button>
                    </div>
                    <div className="space-y-3">
                      {clients.slice(0, 3).map(c => (
                        <div key={c.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                          <div className="w-9 h-9 bg-teal-600/20 border border-teal-700/50 rounded-lg flex items-center justify-center text-teal-300 font-bold text-sm">{c.full_name?.[0]}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{c.full_name}</p>
                            <p className="text-xs text-slate-400">{c.case_type}</p>
                          </div>
                          <span className={`px-2 py-0.5 text-xs font-semibold border rounded-full capitalize ${c.status === 'active' ? 'bg-teal-900/50 text-teal-300 border-teal-700' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>{c.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!loading && tasks.length === 0 && clients.length === 0 && (
                  <div className="text-center py-16">
                    <Scale className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-400 mb-2">No work assigned yet</h3>
                    <p className="text-slate-500">Your firm manager will assign tasks and clients to you soon.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* TASKS */}
            {activeTab === 'tasks' && (
              <motion.div key="tasks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">My Tasks <span className="text-slate-500 text-sm font-normal">({tasks.length})</span></h2>
                  <div className="flex gap-1">
                    {['all', 'pending', 'in_progress', 'completed'].map(f => (
                      <button key={f} onClick={() => setTaskFilter(f)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize ${taskFilter === f ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{f.replace('_', ' ')}</button>
                    ))}
                  </div>
                </div>
                {/* Task stats bars */}
                <div className="grid grid-cols-3 gap-3">
                  {[['Pending', pendingTasks, 'amber'], ['In Progress', inProgressTasks, 'blue'], ['Completed', completedTasks, 'teal']].map(([label, count, c]) => (
                    <div key={label} className={`bg-${c}-900/20 border border-${c}-800/40 rounded-xl p-4 text-center`}>
                      <p className="text-2xl font-bold text-white">{count}</p>
                      <p className="text-xs text-slate-400 mt-1">{label}</p>
                    </div>
                  ))}
                </div>
                {loading ? <div className="text-center py-8 text-slate-500">Loading tasks...</div>
                : filteredTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckSquare className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-400">No {taskFilter !== 'all' ? taskFilter.replace('_', ' ') : ''} tasks</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTasks.map(task => <TaskCard key={task.id} task={task} onStatusChange={updateTaskStatus} />)}
                  </div>
                )}
              </motion.div>
            )}

            {/* MY CLIENTS */}
            {activeTab === 'clients' && (
              <motion.div key="clients" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <h2 className="text-xl font-bold text-white">My Clients <span className="text-slate-500 text-sm font-normal">({clients.length})</span></h2>
                {loading ? <div className="text-center py-8 text-slate-500">Loading...</div>
                : clients.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-400">No clients assigned to you yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {clients.map(c => (
                      <div key={c.id} className="bg-slate-900 border border-slate-800 hover:border-indigo-700/50 rounded-2xl p-5 transition-all">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-teal-600/30 to-teal-400/10 border border-teal-700/40 rounded-xl flex items-center justify-center text-lg font-bold text-teal-300 shrink-0">{c.full_name?.[0]}</div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-white">{c.full_name}</p>
                            <p className="text-sm text-slate-400">{c.email}</p>
                            <p className="text-xs text-slate-500 mt-1">{c.case_type}</p>
                          </div>
                          <span className={`px-2.5 py-0.5 text-xs font-semibold border rounded-full capitalize shrink-0 ${c.status === 'active' ? 'bg-teal-900/50 text-teal-300 border-teal-700' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>{c.status}</span>
                        </div>
                        {c.case_description && <p className="text-sm text-slate-400 line-clamp-2 mb-4 bg-slate-800/50 rounded-lg p-3">{c.case_description}</p>}
                        {/* Post Case Update */}
                        {selectedClient?.id === c.id ? (
                          <div className="space-y-3 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Post Case Update</p>
                            <select value={caseUpdateForm.update_type} onChange={e => setCaseUpdateForm(p => ({ ...p, update_type: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500">
                              {[['progress_update','Progress Update'],['meeting_scheduled','Meeting Scheduled'],['document_submitted','Document Submitted'],['hearing_date','Hearing Date']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                            </select>
                            <input value={caseUpdateForm.title} onChange={e => setCaseUpdateForm(p => ({ ...p, title: e.target.value }))} placeholder="Update title *" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500" />
                            <textarea value={caseUpdateForm.description} onChange={e => setCaseUpdateForm(p => ({ ...p, description: e.target.value }))} placeholder="Details..." rows={2} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 resize-none" />
                            <div className="flex gap-2">
                              <button onClick={() => setSelectedClient(null)} className="flex-1 py-1.5 text-xs font-semibold bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-all">Cancel</button>
                              <button onClick={submitCaseUpdate} className="flex-1 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all">Post Update</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setSelectedClient(c)} className="w-full py-2 text-xs font-semibold bg-indigo-600/20 text-indigo-300 border border-indigo-700/40 rounded-xl hover:bg-indigo-600/40 transition-all flex items-center gap-2 justify-center">
                            <Plus className="w-3.5 h-3.5" />Post Case Update
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* MESSAGES */}
            {activeTab === 'messages' && (
              <motion.div key="messages" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <h2 className="text-xl font-bold text-white">Messages</h2>
                <div className={`${cardBase} flex flex-col`} style={{ minHeight: '420px' }}>
                  <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800">
                    <div className="w-9 h-9 bg-indigo-600/20 border border-indigo-700/50 rounded-lg flex items-center justify-center"><Users className="w-4 h-4 text-indigo-400" /></div>
                    <div><p className="font-bold text-white text-sm">{user.firm_name}</p><p className="text-xs text-slate-400">Firm Manager Channel</p></div>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center"><MessageSquare className="w-10 h-10 text-slate-700 mx-auto mb-3" /><p className="text-slate-500 text-sm">No messages yet</p></div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-800">
                    <input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && message.trim()) { toast.success('Message sent!'); setMessage(''); } }} placeholder="Message your firm manager..." className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500" />
                    <button onClick={() => { if (message.trim()) { toast.success('Message sent!'); setMessage(''); } }} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all"><Send className="w-4 h-4" /></button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PERFORMANCE */}
            {activeTab === 'performance' && (
              <motion.div key="performance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <h2 className="text-xl font-bold text-white">My Performance</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[['Tasks Total', tasks.length],['Completed', completedTasks],['In Progress', inProgressTasks],['Clients', clients.length]].map(([label, val]) => (
                    <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
                      <p className="text-3xl font-bold text-white mb-1">{val}</p>
                      <p className="text-sm text-slate-400">{label}</p>
                    </div>
                  ))}
                </div>
                <div className={cardBase}>
                  <h3 className="font-bold text-white mb-5 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-indigo-400" />Task Completion Overview</h3>
                  <div className="space-y-4">
                    {[['Completed', completedTasks, tasks.length, 'teal'], ['In Progress', inProgressTasks, tasks.length, 'blue'], ['Pending', pendingTasks, tasks.length, 'amber']].map(([label, val, total, color]) => (
                      <div key={label}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-300 font-medium">{label}</span>
                          <span className="text-slate-400">{val} / {total}</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2.5">
                          <div className={`bg-${color}-500 h-2.5 rounded-full transition-all duration-700`} style={{ width: `${total ? (val / total) * 100 : 0}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-between bg-slate-800/60 rounded-xl p-4">
                    <div><p className="text-xs text-slate-500">Overall Completion Rate</p><p className="text-2xl font-bold text-white mt-1">{completionRate}%</p></div>
                    <div className="text-right"><p className="text-xs text-slate-500">Firm Rating</p><div className="flex items-center gap-1 justify-end mt-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /><span className="text-lg font-bold text-white">{user.rating || '4.5'}</span></div></div>
                  </div>
                </div>
                <div className={cardBase}>
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-amber-400" />Credentials</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[['Specialization', user.specialization],['Experience', user.experience_years ? `${user.experience_years} years` : '—'],['Bar Council No.', user.bar_council_number || '—'],['Languages', user.languages?.join(', ') || '—']].map(([label, val]) => (
                      <div key={label} className="bg-slate-800/60 rounded-xl p-3">
                        <p className="text-xs text-slate-500 mb-1">{label}</p>
                        <p className="text-sm font-semibold text-white">{val || '—'}</p>
                      </div>
                    ))}
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
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white">{user.full_name?.[0]?.toUpperCase()}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{user.full_name}</h3>
                      <p className="text-indigo-400 text-sm">{user.specialization} · {user.firm_name}</p>
                      <div className="flex items-center gap-1 mt-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /><span className="text-sm text-amber-400 font-semibold">{user.rating || 4.5}</span><span className="text-xs text-slate-500 ml-1">APEX Verified</span></div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[['Email', user.email],['Phone', user.phone],['Firm', user.firm_name],['Specialization', user.specialization],['Experience', user.experience_years ? `${user.experience_years} years` : '—'],['Bar Council No.', user.bar_council_number || '—'],['Education', user.education || '—'],['Tasks Done', completedTasks]].map(([label, val]) => (
                      <div key={label} className="bg-slate-800/60 rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1">{label}</p>
                        <p className="text-sm font-semibold text-white">{val ?? '—'}</p>
                      </div>
                    ))}
                  </div>
                  {user.languages?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-slate-500 mb-2">Languages</p>
                      <div className="flex flex-wrap gap-2">{user.languages.map(l => <span key={l} className="px-2.5 py-1 bg-indigo-600/20 text-indigo-300 border border-indigo-700/40 text-xs rounded-lg">{l}</span>)}</div>
                    </div>
                  )}
                  {user.bio && <div className="mt-4 bg-slate-800/50 rounded-xl p-4"><p className="text-xs text-slate-500 mb-2">Bio</p><p className="text-sm text-slate-300 leading-relaxed">{user.bio}</p></div>}
                </div>
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
