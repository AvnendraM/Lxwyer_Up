import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { NavbarWave } from '../components/NavbarWave';
import { GradientOrbs } from '../components/GradientOrbs';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';

const AIChat = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI legal assistant. I can help you find the right lawyer or answer initial questions about your case. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = {
        id: messages.length + 2,
        text: "Thank you for providing those details. Based on your situation, I recommend consulting with a specialist. You can stick around here to chat more, or browse our verified lawyers.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden font-['Outfit'] flex flex-col">
      <GradientOrbs />
      <NavbarWave />

      <main className="flex-grow pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-center">
        <div className="max-w-4xl mx-auto w-full">
          {/* Header Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-4 shadow-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">Free AI Legal Assistant</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Your Personal Legal Guide
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Get instant answers and find the perfect lawyer for your needs with our advanced AI assistant.
            </p>
          </motion.div>

          {/* Chat Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] animate-float"
          >
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${msg.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-blue-600 text-white'
                    }`}>
                    {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-sm'
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
                    }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-tl-sm p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your legal question..."
                  className="w-full pl-6 pr-14 py-4 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm placeholder:text-slate-400"
                />
                <Button
                  onClick={handleSend}
                  className="absolute right-2 top-2 bottom-2 aspect-square rounded-full bg-blue-600 hover:bg-blue-700 text-white p-0 flex items-center justify-center shadow-md transition-transform active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AIChat;