
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Scale, Building2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { WaveLayout } from '../components/WaveLayout';

const RoleCard = ({ role, index, navigate }) => {
  const Icon = role.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative p-8 rounded-3xl transition-all duration-300"
      style={{
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(255, 255, 255, 0.5)',
      }}
    >
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `0 0 40px ${role.glowColor}`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center h-full">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${role.color}15, ${role.color}30)`,
            border: `1px solid ${role.color}30`
          }}
        >
          <Icon className="w-10 h-10" style={{ color: role.color }} />
        </div>

        <h3 className="text-2xl font-bold text-slate-800 mb-4 font-outfit">
          {role.title}
        </h3>

        <p className="text-slate-600 mb-8 leading-relaxed flex-grow">
          {role.description}
        </p>

        <Button
          onClick={() => navigate(role.path)}
          className="w-full py-6 rounded-xl font-semibold transition-all duration-300 group-hover:shadow-lg"
          style={{
            background: role.gradient,
            color: 'white',
            border: 'none'
          }}
        >
          <span className="mr-2">Get Started</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
};

const RoleSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get('mode'); // 'login' or null for signup

  const roles = [
    {
      icon: User,
      title: 'I am a Client',
      description: 'Seeking legal advice? Connect with top-tier professionals seamlessly.',
      path: mode === 'login' ? '/user-login' : '/user-get-started',
      color: '#3b82f6', // Blue
      gradient: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      glowColor: 'rgba(59, 130, 246, 0.2)'
    },
    {
      icon: Scale,
      title: 'I am a Lawyer',
      description: 'Join our network. Build your practice and reach clients effectively.',
      path: mode === 'login' ? '/lawyer-login' : '/lawyer-application',
      color: '#0f172a', // Slate/Dark
      gradient: 'linear-gradient(135deg, #0f172a, #334155)',
      glowColor: 'rgba(15, 23, 42, 0.15)'
    },
    {
      icon: Building2,
      title: 'I am a Law Firm',
      description: 'Manage your firm, onboard lawyers, and scale your legal operations.',
      path: mode === 'login' ? '/lawfirm-login' : '/lawfirm-application',
      color: '#0f766e', // Deep Teal
      gradient: 'linear-gradient(135deg, #0f766e, #115e59)',
      glowColor: 'rgba(15, 118, 110, 0.2)'
    }
  ];

  return (
    <WaveLayout>
      <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 mb-6 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Choose Your Journey
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Select your role to access LxwyerUp's comprehensive legal ecosystem
            </p>
          </motion.div>

          {/* Role Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {roles.map((role, index) => (
              <RoleCard key={index} role={role} index={index} navigate={navigate} />
            ))}
          </div>

          {/* Login/Signup Switch Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16 relative z-10"
          >
            <div className="inline-block p-1 rounded-full bg-white/50 backdrop-blur-sm border border-white/60">
              <p className="px-6 py-2 text-slate-600 font-medium">
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  onClick={() => navigate(mode === 'login' ? '/role-selection' : '/role-selection?mode=login')}
                  className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors ml-1"
                >
                  {mode === 'login' ? "Sign up" : "Login"}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </WaveLayout>
  );
};

export default RoleSelection;