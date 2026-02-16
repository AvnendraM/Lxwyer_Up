import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Send, Bot, Briefcase, MapPin, ArrowRight, X, AlertCircle, CheckCircle, MessageSquare, Sparkles, User, Loader2 } from 'lucide-react';
import { WaveLayout } from '../components/WaveLayout';
import { Button } from '../components/ui/button';
import { dummyLawyers } from '../data/lawyersData';

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

export default function FindLawyerAI() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI legal assistant. I can help you find the perfect lawyer for your case.",
      cards: [
        {
          type: 'info',
          icon: 'message',
          title: 'How can I help?',
          content: 'Please describe your legal issue. For example: "I have a property dispute in Delhi" or "Need help with divorce case"'
        }
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedLawyers, setRecommendedLawyers] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [conversationState, setConversationState] = useState({
    caseType: null,
    state: null,
    hasRecommended: false
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const detectCaseType = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes('property') || msg.includes('land') || msg.includes('real estate')) return 'Property Law';
    if (msg.includes('divorce') || msg.includes('custody') || msg.includes('family') || msg.includes('marriage')) return 'Family Law';
    if (msg.includes('criminal') || msg.includes('fir') || msg.includes('police') || msg.includes('arrest')) return 'Criminal Law';
    if (msg.includes('business') || msg.includes('company') || msg.includes('corporate')) return 'Corporate Law';
    if (msg.includes('civil') || msg.includes('dispute') || msg.includes('compensation')) return 'Civil Law';
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

  const recommendLawyers = (caseType, state) => {
    let filtered = [...dummyLawyers];
    if (caseType) filtered = filtered.filter(l => l.specialization === caseType);
    if (state) filtered = filtered.filter(l => l.state === state);
    filtered.sort((a, b) => b.experience - a.experience);
    return filtered.slice(0, 3);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const detectedCase = detectCaseType(userMessage);
      const detectedState = detectState(userMessage);

      const newState = {
        caseType: detectedCase || conversationState.caseType,
        state: detectedState || conversationState.state,
        hasRecommended: false
      };
      setConversationState(newState);

      let responseContent = '';
      let responseCards = [];

      if (newState.caseType && newState.state && !conversationState.hasRecommended) {
        const lawyers = recommendLawyers(newState.caseType, newState.state);

        if (lawyers.length > 0) {
          responseContent = `I found some excellent ${newState.caseType} lawyers in ${newState.state} for you.`;
          setRecommendedLawyers(lawyers);
          setShowRecommendations(true);
          setConversationState(prev => ({ ...prev, hasRecommended: true }));
        } else {
          responseContent = `I understand you need a ${newState.caseType} lawyer in ${newState.state}, but I couldn't find exact matches right now. Try expanding your search area?`;
        }
      } else if (newState.caseType && !newState.state) {
        responseContent = `I can help with ${newState.caseType}. Which state are you located in?`;
        responseCards.push({
          type: 'info',
          icon: 'message',
          title: 'Location Needed',
          content: 'Please specify your state (e.g., Delhi, Maharashtra) to find local experts.'
        });
      } else if (!newState.caseType && newState.state) {
        responseContent = `I see you are in ${newState.state}. What kind of legal assistance do you need?`;
      } else {
        responseContent = "Could you provide more details? I need to know the type of legal issue and your location.";
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: responseContent,
        cards: responseCards.length > 0 ? responseCards : undefined
      }]);
      setIsLoading(false);
    }, 1500);
  };

  const handleBookConsultation = (lawyer) => {
    navigate('/book-consultation-signup', { state: { lawyer } });
  };

  return (
    <WaveLayout activePage="find-lawyer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-600">AI-Powered Legal match</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Legal Guide</span>
          </motion.h1>

        </div>

        <div className="grid lg:grid-cols-12 gap-8 h-[600px]">
          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl shadow-blue-900/5 rounded-3xl flex flex-col overflow-hidden transition-all duration-500 ${showRecommendations ? 'lg:col-span-7' : 'lg:col-span-8 lg:col-start-3'
              }`}
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
                  placeholder="Type your legal question..."
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
                    <Sparkles className="w-5 h-5 text-amber-500" /> Unlocked Matches
                  </h3>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                    {recommendedLawyers.length} Found
                  </span>
                </div>

                {recommendedLawyers.map((lawyer, index) => (
                  <motion.div
                    key={lawyer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg shadow-blue-900/5 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={lawyer.photo}
                        alt={lawyer.name}
                        className="w-16 h-16 rounded-xl object-cover shadow-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 truncate">{lawyer.name}</h4>
                        <p className="text-blue-600 text-sm font-medium mb-1">{lawyer.specialization}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {lawyer.experience}y</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {lawyer.city}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLawyer(lawyer)}
                        className="text-xs w-full"
                      >
                        Profile
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleBookConsultation(lawyer)}
                        className="text-xs w-full bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"
                      >
                        Book <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Lawyer Profile Modal - Reusing the same design from Manual Search */}
      <AnimatePresence>
        {selectedLawyer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLawyer(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header Image/Gradient */}
              <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                <button
                  onClick={() => setSelectedLawyer(null)}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-8 pb-8">
                <div className="relative -mt-16 mb-6 flex justify-between items-end">
                  <div className="flex items-end gap-6">
                    <img
                      src={selectedLawyer.photo}
                      alt={selectedLawyer.name}
                      className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl object-cover bg-white"
                    />
                    <div className="pb-1">
                      <h2 className="text-2xl font-bold text-slate-900">{selectedLawyer.name}</h2>
                      <p className="text-blue-600 font-medium">{selectedLawyer.specialization}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">About</h3>
                    <p className="text-slate-600 leading-relaxed">{selectedLawyer.bio}</p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex gap-4">
                    <Button
                      onClick={() => handleBookConsultation(selectedLawyer)}
                      className="flex-1 h-12 text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25"
                    >
                      Book Consultation <ArrowRight className="w-5 h-5 ml-2" />
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
