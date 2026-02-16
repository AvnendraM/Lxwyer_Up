import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Send, Bot, Briefcase, MapPin, ArrowRight, X, AlertCircle, CheckCircle, MessageSquare, Sparkles, User, Loader2, Star, Globe } from 'lucide-react';
import { WaveLayout } from '../components/WaveLayout';
import { Button } from '../components/ui/button';
import { dummyLawFirms } from '../data/lawFirmsData';

const ChatMessage = ({ message, isBot }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
  >
    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${isBot ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-100'
      }`}>
      {isBot ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
    </div>
    <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${isBot
        ? 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
        : 'bg-blue-600 text-white rounded-tr-none shadow-blue-500/20'
      }`}>
      {message.content && <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>}

      {message.cards && (
        <div className="space-y-3 mt-3">
          {message.cards.map((card, idx) => (
            <div key={idx} className={`p-3 rounded-xl border ${card.type === 'success' ? 'bg-green-50 border-green-100' :
                card.type === 'alert' ? 'bg-amber-50 border-amber-100' :
                  'bg-slate-50 border-slate-100'
              }`}>
              <div className="flex items-start gap-3">
                {card.icon === 'check' && <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />}
                {card.icon === 'alert' && <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />}
                {card.icon === 'message' && <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />}
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1">{card.title}</h4>
                  <p className="text-slate-600 text-sm">{card.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </motion.div>
);

export default function FindLawFirmAI() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI consultant for connecting with top law firms. I can help find the right legal partners for your business or personal needs.",
      cards: [
        {
          type: 'info',
          icon: 'message',
          title: 'How can I assist?',
          content: 'Describe your requirements. For example: "Looking for a corporate law firm in Mumbai" or "Need help with intellectual property rights"'
        }
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedFirms, setRecommendedFirms] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [conversationState, setConversationState] = useState({
    practiceArea: null,
    state: null,
    hasRecommended: false
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const detectPracticeArea = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes('corporate') || msg.includes('business') || msg.includes('merger')) return 'Corporate Law';
    if (msg.includes('ip') || msg.includes('intellectual') || msg.includes('patent') || msg.includes('trademark')) return 'Intellectual Property';
    if (msg.includes('tax') || msg.includes('gst') || msg.includes('financial')) return 'Tax Law';
    if (msg.includes('real estate') || msg.includes('property') || msg.includes('land')) return 'Real Estate';
    if (msg.includes('criminal') || msg.includes('defense')) return 'Criminal Defense';
    if (msg.includes('family') || msg.includes('divorce')) return 'Family Law';
    return null;
  };

  const detectState = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes('delhi')) return 'Delhi';
    if (msg.includes('uttar pradesh') || msg.includes('up') || msg.includes('lucknow') || msg.includes('noida')) return 'Uttar Pradesh';
    if (msg.includes('haryana') || msg.includes('gurgaon') || msg.includes('faridabad')) return 'Haryana';
    if (msg.includes('maharashtra') || msg.includes('mumbai') || msg.includes('pune')) return 'Maharashtra';
    return null;
  };

  const recommendFirms = (practiceArea, state) => {
    let filtered = [...dummyLawFirms];
    if (practiceArea) filtered = filtered.filter(f => f.practiceAreas.includes(practiceArea));
    if (state) filtered = filtered.filter(f => f.state === state);
    filtered.sort((a, b) => b.lawyersCount - a.lawyersCount);
    return filtered.slice(0, 3);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const detectedArea = detectPracticeArea(userMessage);
      const detectedState = detectState(userMessage);

      const newState = {
        practiceArea: detectedArea || conversationState.practiceArea,
        state: detectedState || conversationState.state,
        hasRecommended: false
      };
      setConversationState(newState);

      let responseContent = '';
      let responseCards = [];

      if (newState.practiceArea && newState.state && !conversationState.hasRecommended) {
        const firms = recommendFirms(newState.practiceArea, newState.state);

        if (firms.length > 0) {
          responseContent = `I've identified some top-tier firms in ${newState.state} specialized in ${newState.practiceArea}.`;
          setRecommendedFirms(firms);
          setShowRecommendations(true);
          setConversationState(prev => ({ ...prev, hasRecommended: true }));
        } else {
          responseContent = `I understand you're looking for ${newState.practiceArea} expertise in ${newState.state}, but I couldn't find exact matches. Try expanding your search?`;
        }
      } else if (newState.practiceArea && !newState.state) {
        responseContent = `Excellent. For ${newState.practiceArea}, location is key. Which state should I look in?`;
        responseCards.push({
          type: 'info',
          icon: 'message',
          title: 'Location Required',
          content: 'Please confirm your preferred state (e.g., Maharashtra, Delhi) to identify local firms.'
        });
      } else if (!newState.practiceArea && newState.state) {
        responseContent = `Got it, ${newState.state}. What specific legal expertise does your organization require?`;
      } else {
        responseContent = "Could you elaborate on your requirements? I need to understand the practice area and desired location.";
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: responseContent,
        cards: responseCards.length > 0 ? responseCards : undefined
      }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <WaveLayout activePage="find-law-firm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-600">AI Firm Matching</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            Connect with  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Legal Excellence</span>
          </motion.h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 h-[600px]">
          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:col-span-${showRecommendations ? '7' : '8 lg:col-start-3'} bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl shadow-blue-900/5 rounded-3xl flex flex-col overflow-hidden transition-all duration-500`}
          >
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} message={msg} isBot={msg.role === 'assistant'} />
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white/50 border-t border-slate-100">
              <div className="flex gap-3 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Describe your legal requirements..."
                  className="flex-1 pl-6 pr-14 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="absolute right-2 top-2 h-10 w-10 p-0 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                >
                  <Send className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Recommendations Interface */}
          <AnimatePresence>
            {showRecommendations && (
              <motion.div
                initial={{ opacity: 0, x: 20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                exit={{ opacity: 0, x: 20, width: 0 }}
                className="lg:col-span-5 space-y-4 overflow-y-auto pr-1"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" /> Matches Found
                  </h3>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                    {recommendedFirms.length} Firms
                  </span>
                </div>

                {recommendedFirms.map((firm, index) => (
                  <motion.div
                    key={firm.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg shadow-blue-900/5 rounded-2xl p-0 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group"
                  >
                    <div className="h-32 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10" />
                      <img src={firm.image} alt={firm.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-3 left-4 z-20">
                        <h4 className="font-bold text-white shadow-sm">{firm.name}</h4>
                        <p className="text-slate-200 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> {firm.city}</p>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {firm.practiceAreas.slice(0, 2).map((area, i) => (
                          <span key={i} className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{area}</span>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFirm(firm)}
                          className="text-xs w-full"
                        >
                          Details
                        </Button>
                        <Button
                          size="sm"
                          className="text-xs w-full bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"
                        >
                          Contact <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Firm Detail Modal */}
      <AnimatePresence>
        {selectedFirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFirm(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="relative h-64">
                <img
                  src={selectedFirm.image}
                  alt={selectedFirm.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <button
                  onClick={() => setSelectedFirm(null)}
                  className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-6 left-8 right-8 text-white">
                  <h2 className="text-3xl font-bold mb-2">{selectedFirm.name}</h2>
                  <div className="flex items-center gap-4 text-slate-200">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {selectedFirm.city}, {selectedFirm.state}</span>
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {selectedFirm.lawyersCount} Lawyers</span>
                    <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 4.9 Rating</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8 p-8">
                <div className="md:col-span-2 space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">About the Firm</h3>
                    <p className="text-slate-600 leading-relaxed">{selectedFirm.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Practice Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFirm.practiceAreas.map((area, idx) => (
                        <div key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-100">
                          {area}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
                    <h3 className="font-bold text-slate-900">Contact Information</h3>
                    <div className="space-y-3">
                      {/* Contact details intentionally generic for this UI refactor */}
                      <div className="flex items-center gap-3 text-slate-600"><span className="text-sm">+91 98765 43210</span></div>
                      <div className="flex items-center gap-3 text-slate-600"><span className="text-sm">contact@firm.com</span></div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
                      Contact Firm
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </WaveLayout>
  );
}
