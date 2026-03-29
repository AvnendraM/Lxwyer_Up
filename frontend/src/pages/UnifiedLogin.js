import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Scale, Building2, UserCircle, Briefcase, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '../App';
import { Navbar } from '../components/Navbar';
import { useLang } from '../context/LanguageContext';

const UnifiedLogin = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const roles = [
    { id: 'user', icon: User, titleKey: 'login_role_user', descKey: 'login_role_user_desc', redirectPath: '/user-dashboard', userType: 'client', endpoint: 'auth' },
    { id: 'lawyer', icon: Scale, titleKey: 'login_role_lawyer', descKey: 'login_role_lawyer_desc', redirectPath: '/lawyer-dashboard', userType: 'lawyer', endpoint: 'auth' },
    { id: 'lawfirm', icon: Building2, titleKey: 'login_role_lawfirm', descKey: 'login_role_lawfirm_desc', redirectPath: '/lawfirm-dashboard', userType: 'law_firm', endpoint: 'auth' },
    { id: 'firmclient', icon: UserCircle, titleKey: 'login_role_firmclient', descKey: 'login_role_firmclient_desc', redirectPath: '/firm-client-dashboard', userType: 'firm_client', endpoint: 'firm-clients' },
    { id: 'firmlawyer', icon: Briefcase, titleKey: 'login_role_firmlawyer', descKey: 'login_role_firmlawyer_desc', redirectPath: '/firm-lawyer-dashboard', userType: 'firm_lawyer', endpoint: 'firm-lawyers' },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!selectedRole) { toast.error('Please select your role'); return; }
    if (!loginData.email || !loginData.password) { toast.error('Please enter email and password'); return; }
    setLoading(true);
    try {
      const role = roles.find(r => r.id === selectedRole);
      let response;
      if (role.endpoint === 'firm-clients') {
        response = await axios.post(`${API}/firm-clients/login`, { email: loginData.email, password: loginData.password });
      } else if (role.endpoint === 'firm-lawyers') {
        response = await axios.post(`${API}/firm-lawyers/login`, { email: loginData.email, password: loginData.password, user_type: 'firm_lawyer' });
      } else {
        response = await axios.post(`${API}/auth/login`, { email: loginData.email, password: loginData.password, user_type: role.userType });
      }
      if (response.data.token) {
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('user', JSON.stringify({ ...response.data.user, user_type: role.userType }));
        sessionStorage.setItem('userRole', role.userType);
        toast.success('Login successful!');
        navigate(role.redirectPath);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white transition-colors duration-300" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <Navbar minimal />

      {/* Clean Typography Hero */}
      <div className="relative pt-24 pb-12 overflow-hidden">
        {/* Soft Background Accent */}
        <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-blue-50/50 via-transparent to-transparent dark:from-blue-950/20 dark:via-transparent dark:to-transparent -z-10" />

        {/* Back to home */}

        {/* Back to home — top left of image */}
        <div className="max-w-5xl mx-auto px-6 mb-8">
          <button onClick={() => navigate('/')} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            {t('login_home')}
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold text-blue-700 dark:text-blue-300 tracking-wider uppercase">
                {t('login_badge')}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              {t('login_welcome')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-light leading-relaxed max-w-xl">
              {t('login_sub')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Page content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-24 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]"
        >
          {/* LEFT COLUMN: Role Selection (Acts like tabs) */}
          <div className="md:w-5/12 bg-slate-50/50 dark:bg-[#080d1a]/50 p-6 sm:p-8 lg:p-10 border-b md:border-b-0 md:border-r border-slate-200/50 dark:border-white/[0.04]">
            <p className="text-[10px] tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400 font-bold mb-6">{t('login_select_role')}</p>
            <div className="flex flex-col gap-2.5">
              {roles.map((role, index) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => setSelectedRole(role.id)}
                    className={`cursor-pointer flex items-center gap-4 p-4 rounded-xl transition-all duration-300 border hover:-translate-y-px ${isSelected
                      ? 'bg-blue-600 border-blue-500 shadow-md shadow-blue-500/20'
                      : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-white/[0.06] hover:border-blue-400/50 dark:hover:border-blue-500/40'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate transition-colors ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{t(role.titleKey)}</p>
                      <p className={`text-[10px] leading-snug truncate transition-colors ${isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>{t(role.descKey)}</p>
                    </div>
                    {isSelected && <ArrowRight className="w-4 h-4 text-white shrink-0" />}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Login Form */}
          <div className="md:w-7/12 p-6 sm:p-8 lg:p-12 flex flex-col justify-center relative">
            {!selectedRole ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 opacity-50">
                <ArrowLeft className="w-8 h-8 text-slate-400 mb-4 hidden md:block" />
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('login_select_prompt')}</p>
              </div>
            ) : (
              <motion.div key={selectedRole} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm mx-auto">
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                    {t('login_sign_in_as')} {t(roles.find(r => r.id === selectedRole)?.titleKey)}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-light">
                    {t('login_credentials_sub')}
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">{t('login_email_label')}</label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-white/[0.08] rounded-xl bg-slate-50 dark:bg-[#0a0f1c]/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">{t('login_password_label')}</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-12 py-3 border border-slate-200 dark:border-white/[0.08] rounded-xl bg-slate-50 dark:bg-[#0a0f1c]/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium font-mono"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex justify-end mt-2">
                      <button type="button" className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">{t('login_forgot')}</button>
                    </div>
                  </div>

                  {/* Submit */}
                  <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/25 group mt-2">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                        {t('login_authenticating')}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {t('login_verify_btn')} <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-white/[0.06]" /></div>
                    <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-wider"><span className="px-3 bg-white dark:bg-transparent text-slate-400">{t('login_or_use')}</span></div>
                  </div>

                  {/* Google */}
                  <div className="flex w-full justify-center overflow-hidden rounded-xl">
                    <GoogleLogin
                      theme="filled_black"
                      shape="pill"
                      width="350"
                      onSuccess={async (credentialResponse) => {
                        try {
                          setLoading(true);
                          const role = roles.find(r => r.id === selectedRole);
                          const response = await axios.post(`${API}/auth/google`, { token: credentialResponse.credential, user_type: role.userType });
                          if (response.data.token) {
                            sessionStorage.setItem('token', response.data.token);
                            sessionStorage.setItem('user', JSON.stringify({ ...response.data.user, user_type: role.userType }));
                            sessionStorage.setItem('userRole', role.userType);
                            toast.success('Login successful!');
                            navigate(role.redirectPath);
                          }
                        } catch { toast.error('Google Login Failed'); }
                        finally { setLoading(false); }
                      }}
                      onError={() => toast.error('Google Login Failed')}
                      useOneTap
                    />
                  </div>
                </form>

                <div className="mt-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 border border-slate-100 dark:border-white/[0.04]">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{t('login_new_here')}</p>
                  <button
                    onClick={() => {
                      if (selectedRole === 'user') {
                        navigate('/user-get-started');
                      } else {
                        navigate('/register');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors uppercase tracking-wider"
                  >
                    {selectedRole === 'user' ? t('login_find_pro') : t('login_create_account')} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UnifiedLogin;
