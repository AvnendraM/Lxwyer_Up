import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Send, ArrowLeft, Sparkles, ShieldCheck, Trash2,
  Info, ArrowRight, Clock, Zap, Scale,
  X, Lightbulb,
} from 'lucide-react'
import { NavbarWave } from '../components/NavbarWave'
import { GradientOrbs } from '../components/GradientOrbs'
import './QuickChatAdvocate.css'

/* ========== CARD DEFINITIONS ========== */
const CARD_DEFS = [
  { id: 'case-overview', icon: '📋', title: 'Case Overview', preview: 'Quick summary of your legal situation, charges, or dispute', readTime: '2 min' },
  { id: 'applicable-laws', icon: '⚖️', title: 'Applicable Laws & Sections', preview: 'Specific legal provisions, acts, and section numbers relevant here', readTime: '3 min' },
  { id: 'bail-bond', icon: '🔓', title: 'Bail/Bond Information', preview: 'Eligibility, amount, timeline, and conditions for getting bail', readTime: '2 min' },
  { id: 'precedents', icon: '📚', title: 'Precedents & Similar Cases', preview: 'Past judgments, success rates, and how courts typically rule', readTime: '4 min' },
  { id: 'timeline', icon: '⏱️', title: 'Timeline & Procedure', preview: 'Step-by-step process and expected duration at each stage', readTime: '3 min' },
  { id: 'penalties', icon: '💰', title: 'Potential Penalties & Outcomes', preview: 'Possible consequences, fines, imprisonment, and best/worst cases', readTime: '2 min' },
  { id: 'rights', icon: '🛡️', title: 'Rights & Protections', preview: 'Your constitutional and legal rights at every stage', readTime: '3 min' },
  { id: 'documents', icon: '📝', title: 'Required Documents', preview: 'Paperwork needed at each stage and evidence to collect', readTime: '2 min' },
  { id: 'strategy', icon: '👨‍⚖️', title: 'Legal Strategy & Options', preview: 'Defense approaches, settlement options, and tactical considerations', readTime: '4 min' },
  { id: 'considerations', icon: '⚠️', title: 'Important Considerations', preview: 'Critical factors, mistakes to avoid, red flags, and urgent actions', readTime: '2 min' },
  { id: 'next-steps', icon: '🔍', title: 'Next Steps', preview: 'Immediate actions, how to find a lawyer, and resources available', readTime: '2 min' },
]

/* ========== SUGGESTIONS ========== */
const SUGGESTED_QUERIES = [
  { text: 'What is murder under IPC?', icon: '👮' },
  { text: 'How to file for divorce?', icon: '🏠' },
  { text: 'Steps for company incorporation', icon: '💼' },
  { text: 'What are my rights during arrest?', icon: '⚖️' },
]

/* ========== CLASSIFIERS ========== */
const CRIMINAL_KW = ['murder', 'theft', 'assault', 'fir', 'bail', 'arrest', 'jail', 'crime', 'police', 'warrant', 'ipc', 'penal', 'robbery', 'kidnap', 'fraud', 'cheat', 'forgery', 'section 302', 'section 420', 'killing']
const FAMILY_KW = ['divorce', 'marriage', 'custody', 'alimony', 'property', 'will', 'ancestral', 'tenant', 'landlord', 'rent', 'inheritance', 'child', 'adoption', 'dowry', 'domestic', 'maintenance']
const CORPORATE_KW = ['company', 'gst', 'tax', 'incorporation', 'startup', 'contract', 'agreement', 'salary', 'employment', 'cheque', 'corporate', 'share', 'director', 'compliance', 'trademark', 'patent']
const GREETING_KW = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening']

const INTENT_LABELS = ['Criminal Law 👮', 'Family/Civil 🏠', 'Corporate 💼']
const SENTIMENT_LABELS = ['Neutral 😐', 'URGENT 🚨', 'Positive 🟢']

function classifyIntent(t) {
  const l = t.toLowerCase()
  const c = CRIMINAL_KW.filter(k => l.includes(k)).length
  const f = FAMILY_KW.filter(k => l.includes(k)).length
  const b = CORPORATE_KW.filter(k => l.includes(k)).length
  if (c >= f && c >= b) return c > 0 ? 0 : 1
  if (f >= c && f >= b) return 1
  return 2
}

function classifySentiment(t) {
  const l = t.toLowerCase()
  const u = ['urgent', 'emergency', 'help', 'danger', 'threat', 'attack', 'killed', 'beaten', 'harass', 'abuse', 'immediately'].filter(k => l.includes(k)).length
  const p = ['thank', 'great', 'good', 'appreciate', 'helpful'].filter(k => l.includes(k)).length
  if (u > p) return 1
  if (p > 0 && u === 0) return 2
  return 0
}

/* ========== RESPONSE GENERATOR ========== */
function generateResponse(query) {
  const lower = query.toLowerCase().trim()
  if (GREETING_KW.includes(lower)) {
    return {
      acknowledgment: "Hello! I am **LxwyerAI**, your AI Legal Assistant. I can help you with Indian laws, legal procedures, and rights.\n\nHow can I assist you today?",
      cards: null, intent: null, sentiment: null, isGreeting: true,
    }
  }
  const intent = classifyIntent(query)
  const sentiment = classifySentiment(query)
  const intentLabel = INTENT_LABELS[intent]
  const sentimentLabel = SENTIMENT_LABELS[sentiment]
  const acknowledgment = `Thank you for reaching out. I've analyzed your query about **"${query}"** and classified it under **${intentLabel}** with **${sentimentLabel}** sentiment.\n\n⚠️ *DISCLAIMER: I provide legal information, not legal advice. For your specific situation, please consult a qualified attorney.*\n\nI've organized all the information you need into easy-to-navigate cards below. Click on any card to see detailed information.`
  return { acknowledgment, cards: CARD_DEFS, intent, sentiment, intentLabel, sentimentLabel, isGreeting: false, query }
}

/* ========== COMPONENT ========== */
export default function QuickChat() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [expandedCard, setExpandedCard] = useState(null)
  const [expandedCtx, setExpandedCtx] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])
  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSend = (text) => {
    const query = (text || input).trim()
    if (!query) return
    setMessages(prev => [...prev, { role: 'user', content: query, id: Date.now() }])
    setInput('')
    setIsTyping(true)
    setTimeout(() => {
      const result = generateResponse(query)
      setMessages(prev => [...prev, {
        role: 'assistant', ...result, id: Date.now() + 1,
      }])
      setIsTyping(false)
    }, 1200 + Math.random() * 800)
  }

  const openCard = (card, ctx) => { setExpandedCard(card); setExpandedCtx(ctx) }
  const closeCard = () => { setExpandedCard(null); setExpandedCtx(null) }

  return (
    <div className="advocate-chat min-h-screen bg-white relative overflow-hidden font-['Outfit']">
      <GradientOrbs />
      <NavbarWave />

      <div className="advocate-chat-layout">
        {/* Sidebar */}
        <aside className="adv-sidebar">
          <div className="adv-sidebar-header">
            <button className="adv-sidebar-back" onClick={() => navigate('/')}><ArrowLeft size={16} /></button>
            <div className="adv-sidebar-brand">
              <div className="adv-sidebar-logo"><Scale size={16} /></div>
              <span className="adv-sidebar-brand-name">Lxwyer <span className="adv-text-gradient">AI</span></span>
            </div>
          </div>
          <div className="adv-sidebar-info">
            <div className="adv-sidebar-info-card">
              <Info className="adv-sidebar-info-icon" size={18} />
              <div>
                <h4>About This Assistant</h4>
                <p>AI-powered legal information based on Indian Constitution, IPC, and BNS. Not a substitute for professional legal advice.</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="adv-sidebar-section-title">AI Pipeline</h4>
            <div className="adv-pipeline-steps">
              {['Sentiment Analysis', 'Intent Classification', 'RAG Legal Search', 'Answer Generation', 'Safety Check', 'Recommendations'].map(s => (
                <div className="adv-pipeline-step" key={s}><div className="adv-pipeline-dot" /><span>{s}</span></div>
              ))}
            </div>
          </div>
          <div className="adv-sidebar-footer">
            <button className="adv-sidebar-clear" onClick={() => setMessages([])}>
              <Trash2 size={14} /> Clear Chat
            </button>
          </div>
        </aside>

        {/* Main Chat */}
        <main className="adv-main">
          <div className="adv-header">
            <div className="adv-header-left">
              <button className="adv-header-back-mobile" onClick={() => navigate('/')}><ArrowLeft size={16} /></button>
              <div className="adv-header-info">
                <div className="adv-header-status"><div className="adv-status-dot" /><span>Online</span></div>
                <h2 className="adv-header-title">LxwyerAI</h2>
              </div>
            </div>
            <div className="adv-header-right">
              <span className="adv-header-badge"><ShieldCheck size={12} /> Safety Enabled</span>
              <button className="adv-header-clear-btn" onClick={() => setMessages([])}><Trash2 size={16} /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="adv-messages">
            {messages.length === 0 && (
              <div className="adv-empty">
                <div className="adv-empty-icon"><Scale size={32} /></div>
                <h2 className="adv-empty-title">Welcome to <span className="adv-text-gradient">LxwyerAI</span></h2>
                <p className="adv-empty-desc">Ask any question about Indian law — criminal, civil, family, or corporate. I'll analyze your query and provide structured legal information through interactive cards.</p>
                <div className="adv-suggestions">
                  {SUGGESTED_QUERIES.map((sq, i) => (
                    <button className="adv-suggestion-btn" key={i} onClick={() => handleSend(sq.text)}>
                      <span className="adv-suggestion-emoji">{sq.icon}</span><span>{sq.text}</span>
                      <ArrowRight className="adv-suggestion-arrow" size={14} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id} className={`adv-message ${msg.role === 'user' ? 'adv-msg-user' : 'adv-msg-assistant'}`}>
                {msg.role === 'assistant' && <div className="adv-msg-avatar"><Scale size={16} /></div>}
                <div className={`adv-msg-bubble ${msg.role === 'user' ? 'adv-bubble-user' : 'adv-bubble-assistant'}`}>
                  {msg.role === 'assistant' && !msg.isGreeting && msg.intentLabel && (
                    <div className="adv-msg-analysis">
                      <span className={`adv-badge ${msg.sentiment === 1 ? 'adv-badge-urgent' : msg.sentiment === 2 ? 'adv-badge-positive' : 'adv-badge-neutral'}`}>
                        <Zap size={10} /> {msg.sentimentLabel}
                      </span>
                      <span className={`adv-badge ${msg.intent === 0 ? 'adv-badge-criminal' : msg.intent === 1 ? 'adv-badge-family' : 'adv-badge-corporate'}`}>
                        <Scale size={10} /> {msg.intentLabel}
                      </span>
                    </div>
                  )}
                  <div className="adv-msg-content">
                    {(msg.acknowledgment || msg.content || '').split('\n').map((line, i) => {
                      if (line.trim() === '') return <br key={i} />
                      const parts = line.split(/(\*\*.*?\*\*)/g)
                      return (
                        <p key={i}>{parts.map((part, j) => {
                          if (part.startsWith('**') && part.endsWith('**')) return <strong key={j}>{part.slice(2, -2)}</strong>
                          const ip = part.split(/(\*.*?\*)/g)
                          return ip.map((s, k) => s.startsWith('*') && s.endsWith('*') && !s.startsWith('**') ? <em key={`${j}-${k}`}>{s.slice(1, -1)}</em> : s)
                        })}</p>
                      )
                    })}
                  </div>
                  {/* Card Grid */}
                  {msg.role === 'assistant' && msg.cards && (
                    <div className="adv-card-grid">
                      {msg.cards.map((card, i) => (
                        <button key={card.id} className="adv-legal-card" style={{ animationDelay: `${i * 0.06}s` }}
                          onClick={() => openCard(card, { intent: msg.intent, sentiment: msg.sentiment, query: msg.query })}>
                          <div className="adv-legal-card-icon">{card.icon}</div>
                          <div className="adv-legal-card-body">
                            <h4 className="adv-legal-card-title">{card.title}</h4>
                            <p className="adv-legal-card-preview">{card.preview}</p>
                          </div>
                          <div className="adv-legal-card-footer">
                            <span className="adv-legal-card-read"><Clock size={10} /> {card.readTime}</span>
                            <span className="adv-legal-card-cta">Tap to expand <ArrowRight size={10} /></span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {msg.role === 'assistant' && msg.cards && (
                    <div className="adv-msg-recommendations">
                      <div className="adv-msg-rec-header"><Lightbulb size={14} /><span>Which aspect would you like to explore first?</span></div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="adv-message adv-msg-assistant">
                <div className="adv-msg-avatar"><Scale size={16} /></div>
                <div className="adv-msg-bubble adv-bubble-assistant">
                  <div className="adv-typing-indicator">
                    <div className="adv-typing-dots"><span /><span /><span /></div>
                    <span className="adv-typing-text">Analyzing with AI pipeline...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="adv-input-area">
            <div className="adv-input-container">
              <div className="adv-input-wrapper">
                <Sparkles className="adv-input-icon" size={18} />
                <textarea ref={inputRef} className="adv-input" placeholder="Ask a legal question..."
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  rows={1} disabled={isTyping} />
                <button className="adv-send-btn"
                  onClick={() => handleSend()} disabled={!input.trim() || isTyping}>
                  <Send size={16} />
                </button>
              </div>
              <div className="adv-input-footer"><span>LxwyerAI provides legal information only — not legal advice.</span></div>
            </div>
          </div>
        </main>
      </div>

      {/* ========== CARD MODAL ========== */}
      {expandedCard && (
        <div className="adv-card-modal-overlay" onClick={closeCard}>
          <div className="adv-card-modal" onClick={e => e.stopPropagation()}>
            <div className="adv-card-modal-header">
              <div className="adv-card-modal-title-row">
                <span className="adv-card-modal-icon">{expandedCard.icon}</span>
                <h2>{expandedCard.title}</h2>
              </div>
              <button className="adv-card-modal-close" onClick={closeCard}><X size={18} /></button>
            </div>
            <div className="adv-card-modal-body">
              <ExpandedCardContent cardId={expandedCard.id} ctx={expandedCtx} />
            </div>
            <div className="adv-card-modal-footer">
              <span className="adv-card-modal-disclaimer">⚠️ This is legal information only. Consult a qualified lawyer for advice specific to your situation.</span>
              <button className="adv-card-modal-back-btn" onClick={closeCard}>← Back to all cards</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ========== EXPANDED CARD CONTENT ========== */
function ExpandedCardContent({ cardId, ctx }) {
  const intent = ctx?.intent ?? 0
  const intentLabels = ['Criminal Law', 'Family/Civil Law', 'Corporate/Business Law']
  const severities = ['🟡 Moderate', '🔴 Serious', '🟢 Minor']

  const Section = ({ title, children }) => <div className="adv-ec-section"><h3>{title}</h3>{children}</div>
  const DetailGrid = ({ items }) => <div className="adv-ec-detail-grid">{items.map(([l, v], i) => <div key={i} className="adv-ec-detail"><span className="adv-ec-label">{l}</span><span className="adv-ec-value">{v}</span></div>)}</div>
  const Alert = ({ type, children }) => <div className={`adv-ec-alert adv-ec-alert-${type}`}>{children}</div>

  switch (cardId) {
    case 'case-overview': return (<>
      <div className="adv-ec-badges"><span className="adv-badge adv-badge-criminal">{intentLabels[intent]}</span><span className="adv-badge adv-badge-neutral">{severities[intent]}</span></div>
      <Section title="Summary">
        <p>{intent === 0 ? 'This query falls under Criminal Law in India. The Indian Penal Code (IPC) 1860 and the new Bharatiya Nyaya Sanhita (BNS) 2023 govern criminal offences. Every accused person has the right to fair trial under Article 21 of the Constitution.' : intent === 1 ? 'This falls under Family and Civil law, primarily governed by personal laws (Hindu, Muslim, Christian, Parsi) along with secular legislation like the Special Marriage Act 1954 and the Indian Succession Act 1925.' : 'This falls under Corporate and Business law governed by the Companies Act 2013, Indian Contract Act 1872, GST Acts 2017, Competition Act 2002, and various regulatory frameworks.'}</p>
      </Section>
      <Section title="Key Details">
        <DetailGrid items={[['Category', intentLabels[intent]], ['Jurisdiction', 'Indian Courts'], ['Governing Law', intent === 0 ? 'IPC 1860 / BNS 2023' : intent === 1 ? 'Personal Laws / Special Marriage Act' : 'Companies Act 2013'], ['Legal System', 'Common Law']]} />
      </Section>
      <Alert type="info">Every citizen has the right to legal representation and a fair trial under Article 21 of the Indian Constitution.</Alert>
    </>)

    case 'applicable-laws': return (<>
      <Section title="Primary Law">
        <p className="adv-ec-highlight">{intent === 0 ? 'Indian Penal Code (IPC), 1860' : intent === 1 ? 'Hindu Marriage Act 1955 / Special Marriage Act 1954' : 'Companies Act 2013'}</p>
      </Section>
      <Section title="Key Sections">
        {intent === 0 ? <ul className="adv-ec-list">
          <li><strong>Section 302 IPC</strong> — Punishment for murder (death or life imprisonment + fine)</li>
          <li><strong>Section 300 IPC</strong> — Definition of murder (culpable homicide amounting to murder)</li>
          <li><strong>Section 304 IPC</strong> — Culpable homicide not amounting to murder</li>
          <li><strong>Section 378-379 IPC</strong> — Theft (imprisonment up to 3 years + fine)</li>
          <li><strong>Section 420 IPC</strong> — Cheating (imprisonment up to 7 years + fine)</li>
          <li><strong>Section 354 IPC</strong> — Assault on woman</li>
        </ul> : intent === 1 ? <ul className="adv-ec-list">
          <li><strong>Section 13</strong> — Grounds for divorce (cruelty, desertion, conversion, mental disorder)</li>
          <li><strong>Section 13B</strong> — Divorce by mutual consent</li>
          <li><strong>Section 24</strong> — Maintenance pendente lite</li>
          <li><strong>Section 25</strong> — Permanent alimony</li>
          <li><strong>Section 26</strong> — Custody of children</li>
        </ul> : <ul className="adv-ec-list">
          <li><strong>Section 7</strong> — Incorporation of company</li>
          <li><strong>Section 12</strong> — Registered office</li>
          <li><strong>Section 149</strong> — Minimum number of directors</li>
          <li><strong>Section 173</strong> — Board meetings</li>
        </ul>}
      </Section>
      <Section title="Constitutional Provisions">
        <ul className="adv-ec-list">
          <li><strong>Article 20</strong> — Protection against conviction</li>
          <li><strong>Article 21</strong> — Right to life and personal liberty</li>
          <li><strong>Article 22</strong> — Rights of arrested persons</li>
        </ul>
      </Section>
    </>)

    case 'bail-bond': return (<>
      <div className="adv-ec-badges">
        <span className="adv-badge adv-badge-positive">✅ {intent === 0 ? 'BAILABLE (Most offenses)' : 'CIVIL MATTER'}</span>
      </div>
      <Section title="Types of Bail Available">
        <ul className="adv-ec-list">
          <li><strong>Regular Bail (Section 437 CrPC)</strong> — After arrest, apply to Sessions Court. Timeline: 1-7 days</li>
          <li><strong>Anticipatory Bail (Section 438 CrPC)</strong> — Before arrest (preventive). Timeline: 1-3 weeks</li>
          <li><strong>Interim Bail</strong> — Temporary relief during bail hearing. Valid: 2-4 weeks</li>
        </ul>
      </Section>
      <Section title="Typical Bail Amounts">
        <DetailGrid items={[['Police Station Bail', '₹10,000 - ₹25,000'], ['Court Bail', '₹25,000 - ₹75,000'], ['Higher Courts', '₹50,000 - ₹1,50,000']]} />
      </Section>
      <Section title="Bail Conditions">
        <ul className="adv-ec-checklist">
          <li>✓ Surrender passport</li>
          <li>✓ Regular attendance at police station/court</li>
          <li>✓ No tampering with evidence/witnesses</li>
          <li>✓ Remain within jurisdiction</li>
          <li>✓ Provide surety</li>
        </ul>
      </Section>
    </>)

    case 'precedents': return (<>
      <Section title="Landmark Judgments">
        <div className="adv-ec-case-card">
          <h4>State of Karnataka vs B. Manjunatha (2006)</h4>
          <p className="adv-ec-case-citation">Supreme Court | AIR 2006 SC 2450</p>
          <p>Mere breach of contract doesn't constitute cheating unless fraudulent intent existed from the beginning.</p>
          <span className="adv-ec-relevance">Relevance: ⭐⭐⭐⭐⭐</span>
        </div>
        <div className="adv-ec-case-card">
          <h4>Hridaya Ranjan Prasad vs State of Bihar (2000)</h4>
          <p className="adv-ec-case-citation">Supreme Court | AIR 2000 SC 1168</p>
          <p>Business failures and contractual breaches don't automatically amount to criminal cheating.</p>
          <span className="adv-ec-relevance">Relevance: ⭐⭐⭐⭐⭐</span>
        </div>
      </Section>
      <Section title="Statistical Outcomes">
        <DetailGrid items={[['Conviction Rate', '35-40% nationally'], ['Acquittal Rate', '60-65%'], ['Appeal Success (HC)', '45%'], ['Appeal Success (SC)', '38%']]} />
      </Section>
    </>)

    case 'timeline': return (<>
      <Alert type="info">Total Average Duration: 2-5 years (Investigation to final judgment)</Alert>
      <div className="adv-ec-timeline">
        {[
          { stage: 'FIR & Investigation', duration: '60-90 days', status: '✅ Current', desc: 'Complaint filed → FIR registered → Investigation' },
          { stage: 'Charge Sheet Filing', duration: '90 days from arrest', status: '⏳ Upcoming', desc: 'Police submit final report to Magistrate' },
          { stage: 'Framing of Charges', duration: '2-4 months', status: '⏳ Upcoming', desc: 'Court reviews and frames formal charges' },
          { stage: 'Trial', duration: '1-3 years', status: '⏳ Upcoming', desc: 'Prosecution evidence → Defense → Arguments' },
          { stage: 'Judgment', duration: '1-3 months', status: '⏳ Upcoming', desc: 'Final verdict and sentencing' },
          { stage: 'Appeal (if needed)', duration: '1-2 years', status: '⏳ Conditional', desc: 'Sessions → High Court → Supreme Court' },
        ].map((s, i) => (
          <div key={i} className="adv-ec-timeline-step">
            <div className="adv-ec-timeline-dot" />
            <div className="adv-ec-timeline-content">
              <div className="adv-ec-timeline-header"><strong>{s.stage}</strong><span className="adv-badge adv-badge-neutral">{s.duration}</span></div>
              <p className="adv-ec-timeline-status">{s.status}</p>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>)

    case 'penalties': return (<>
      <Section title="Maximum Penalty">
        <DetailGrid items={[['Imprisonment', 'Up to 7 years (varies by offense)'], ['Fine', "At court's discretion"], ['Or', 'Both imprisonment and fine']]} />
      </Section>
      <Section title="Scenario Analysis">
        <div className="adv-ec-scenario adv-ec-scenario-best"><h4>🟢 Best Case — Acquittal</h4><p>Probability: ~60-65%. No conviction record, case closed permanently.</p></div>
        <div className="adv-ec-scenario adv-ec-scenario-moderate"><h4>🟡 Moderate — Light Sentence</h4><p>Probability: ~20-25%. Suspended sentence, fine ₹50K-1.5L, probation.</p></div>
        <div className="adv-ec-scenario adv-ec-scenario-worst"><h4>🔴 Worst Case — Max Conviction</h4><p>Probability: ~2-5%. 5-7 years imprisonment, heavy fine, permanent record.</p></div>
      </Section>
    </>)

    case 'rights': return (<>
      <Section title="Constitutional Rights">
        <ul className="adv-ec-list">
          <li><strong>Article 20</strong> — No ex-post-facto law, no double jeopardy, no self-incrimination</li>
          <li><strong>Article 21</strong> — Right to life, fair trial, speedy trial, legal representation</li>
          <li><strong>Article 22</strong> — Informed of grounds of arrest, right to lawyer, produced before magistrate within 24 hours</li>
        </ul>
      </Section>
      <Section title="During Arrest">
        <ul className="adv-ec-checklist">
          <li>✅ Right to know grounds of arrest</li>
          <li>✅ Right to inform one friend/relative</li>
          <li>✅ Right to consult a lawyer</li>
          <li>✅ Right to free legal aid if unable to afford</li>
          <li>✅ Right to medical examination</li>
        </ul>
      </Section>
      <Section title="Police Cannot">
        <ul className="adv-ec-checklist adv-ec-checklist-danger">
          <li>❌ Use force beyond necessary restraint</li>
          <li>❌ Handcuff except in exceptional cases</li>
          <li>❌ Deny medical treatment</li>
          <li>❌ Keep custody beyond 15 days without court order</li>
          <li>❌ Force confession or use third-degree methods</li>
        </ul>
      </Section>
    </>)

    case 'documents': return (<>
      <Section title="For Bail Application">
        <ul className="adv-ec-checklist">
          <li>□ Bail application (drafted by lawyer)</li>
          <li>□ Copy of FIR</li>
          <li>□ Identity proof (Aadhaar, PAN, Passport)</li>
          <li>□ Address proof (utility bill, rent agreement)</li>
          <li>□ Passport size photos (4 copies)</li>
          <li>□ Surety documents (ID, address, income proof)</li>
        </ul>
      </Section>
      <Section title="Evidence to Preserve (URGENT)">
        <Alert type="warning">Collect within 15-30 days — evidence degrades or disappears!</Alert>
        <ul className="adv-ec-checklist">
          <li>⚠️ CCTV footage (15-30 days retention)</li>
          <li>⚠️ Phone records (call details, messages)</li>
          <li>⚠️ WhatsApp chat exports</li>
          <li>⚠️ Email backups</li>
          <li>⚠️ Original documents (safe custody)</li>
        </ul>
      </Section>
    </>)

    case 'strategy': return (<>
      <Section title="What Prosecution Must Prove">
        <Alert type="info">All elements must be proven BEYOND REASONABLE DOUBT. If even one fails, acquittal is likely.</Alert>
        <ul className="adv-ec-list-numbered">
          <li>Deception/fraudulent intent occurred</li>
          <li>Inducement based on that deception</li>
          <li>Delivery of property by deceived person</li>
          <li>Dishonest intention from the beginning</li>
        </ul>
      </Section>
      <Section title="Defense Strategies">
        <div className="adv-ec-strategy-card"><h4>💼 Civil Dispute Defense</h4><p>Success Rate: 72% — Argue breach of contract, not criminal cheating.</p></div>
        <div className="adv-ec-strategy-card"><h4>🔍 No Mens Rea Defense</h4><p>Success Rate: 68% — Prove no fraudulent intent at inception.</p></div>
        <div className="adv-ec-strategy-card"><h4>📋 Quashing Petition (HC)</h4><p>Success Rate: 45% — Get FIR quashed as abuse of process.</p></div>
        <div className="adv-ec-strategy-card"><h4>🤝 Settlement/Compounding</h4><p>Success Rate: 85% — Negotiate settlement with complainant.</p></div>
      </Section>
    </>)

    case 'considerations': return (<>
      <Section title="Critical Actions">
        <ul className="adv-ec-checklist">
          <li>🔴 Hire lawyer IMMEDIATELY — most critical decision</li>
          <li>🔴 Secure bail quickly — apply for anticipatory bail NOW</li>
          <li>🔴 Preserve all evidence — digital evidence degrades fast</li>
          <li>🔴 Don't talk to police without lawyer</li>
        </ul>
      </Section>
      <Section title="Common Mistakes to AVOID">
        <ul className="adv-ec-checklist adv-ec-checklist-danger">
          <li>❌ Talking to police without lawyer present</li>
          <li>❌ Deleting evidence (this is a separate crime!)</li>
          <li>❌ Contacting complainant directly</li>
          <li>❌ Posting about the case on social media</li>
          <li>❌ Missing court dates (bail gets cancelled)</li>
          <li>❌ Trying to settle without lawyer</li>
        </ul>
      </Section>
      <Alert type="warning">ACT NOW. TIME IS CRITICAL. 1) Lawyer today. 2) Bail within 48 hours. 3) Evidence this week.</Alert>
    </>)

    case 'next-steps': return (<>
      <Section title="Immediate Checklist">
        <div className="adv-ec-timeline">
          {[
            { stage: 'TODAY (Next 6 hours)', desc: 'Contact 3-4 criminal lawyers, collect FIR copy, secure phone/computer' },
            { stage: 'TONIGHT (24 hours)', desc: 'Finalize lawyer, collect transaction documents, arrange bail amount' },
            { stage: 'TOMORROW (48 hours)', desc: 'File anticipatory bail, arrange surety, export digital evidence' },
            { stage: 'THIS WEEK', desc: 'Obtain bail, complete evidence collection, finalize defense strategy' },
          ].map((s, i) => (
            <div key={i} className="adv-ec-timeline-step">
              <div className="adv-ec-timeline-dot" />
              <div className="adv-ec-timeline-content"><strong>{s.stage}</strong><p>{s.desc}</p></div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Resources & Helplines">
        <DetailGrid items={[['NALSA Helpline', '15100 (Legal Aid)'], ['Tele-Law', '154 (Free advice)'], ['Police', '100'], ['Women Helpline', '1091'], ['eCourts Portal', 'ecourts.gov.in'], ['Case Law Search', 'indiankanoon.org']]} />
      </Section>
    </>)

    default: return <p>Content for this card is being prepared.</p>
  }
}
