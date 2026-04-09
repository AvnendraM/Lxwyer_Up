"""
Legal Chat API — v0.1 Engine
- Auto-detects specialization from query
- Asks for location and preferences (fees, mode) in follow-up
- All card content delivered as concise bullet points
- Cards have expandable 'detail' for full info
- No ratings—only experience mentioned
- 700-question training KB (500 general + 200 Indian legal)
"""

import json
import sqlite3
import os
import random
import logging
import httpx
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Any

router = APIRouter(prefix="/chat", tags=["Legal Chat"])
logger = logging.getLogger(__name__)

# ── MODELS ────────────────────────────────────────────────────────────────────

class LegalChatRequest(BaseModel):
    query: str
    history: Optional[List[dict]] = []

class LegalCard(BaseModel):
    id: str
    icon: str
    title: str
    summary: str   # bullet-point preview shown on card
    detail: str    # full expandable markdown

class LegalChatResponse(BaseModel):
    intro: str
    intent: str
    sentiment: str
    sources: List[str] = []
    cards: List[Any] = []
    is_greeting: bool = False
    greeting_text: str = ""
    needs_location: bool = False      # flag for UI to show location prompt
    detected_spec: str = ""           # auto-detected specialization

# ── FILE PATHS ────────────────────────────────────────────────────────────────

KB_PATH = "data/training_kb.json"
DB_PATH = "data/app.db"
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")

# ── LOAD TRAINING KNOWLEDGE BASE ──────────────────────────────────────────────

training_kb = []
if os.path.exists(KB_PATH):
    try:
        with open(KB_PATH, "r") as f:
            training_kb = json.load(f)
        logger.info(f"Loaded {len(training_kb)} pre-trained Q&A instances.")
    except Exception as e:
        logger.error(f"Failed to load training KB: {e}")

# ── CLASSIFIERS ───────────────────────────────────────────────────────────────

SPECIALIZATION_MAP = {
    "criminal": ["murder", "theft", "fir", "bail", "arrest", "police", "ipc", "bns", "robbery", "fraud",
                 "kidnap", "assault", "prison", "jail", "crime", "criminal", "warrant", "accused", "offence",
                 "cheating", "section 302", "section 420", "forgery", "extortion"],
    "family": ["divorce", "marriage", "custody", "alimony", "maintenance", "dowry", "husband", "wife",
               "domestic violence", "adoption", "child", "matrimonial", "separation", "annulment"],
    "property": ["property", "land", "plot", "ancestral", "inheritance", "will", "registry", "title deed",
                 "encroachment", "boundary", "landlord", "tenant", "rent", "eviction", "sale deed", "lease"],
    "corporate": ["company", "startup", "gst", "tax", "incorporation", "contract", "agreement", "employment",
                  "cheque bounce", "trademark", "patent", "copyright", "shares", "director", "mca"],
    "consumer": ["consumer", "product defect", "refund", "service", "consumer court", "complaint", "e-commerce",
                 "amazon", "flipkart", "insurance claim", "hospital negligence"],
    "cyber": ["cyber", "hacking", "online fraud", "social media", "fake profile", "sextortion", "phishing",
              "data breach", "it act", "digital"],
    "labour": ["salary", "fired", "termination", "employee", "employer", "pf", "epf", "gratuity", "maternity",
               "harassment at work", "office", "labour court", "industrial dispute"],
    "constitutional": ["fundamental rights", "article 21", "right to education", "pil", "high court", "supreme court",
                       "writ petition", "habeas corpus", "mandamus"],
}

URGENT_KW = ['urgent', 'emergency', 'help', 'danger', 'threat', 'attack', 'killed', 'beaten', 'harass',
             'abuse', 'immediately', 'right now', 'tonight', 'please help', 'scared', 'life at risk']

GREETING_KW = {'hi', 'hello', 'hey', 'hii', 'helo', 'hola', 'namaste', 'good morning', 'good evening', 'good afternoon', 'howdy'}
FAREWELL_KW = {'bye', 'goodbye', 'see you', 'take care', 'cya', 'later'}
THANKS_KW = {'thanks', 'thank you', 'thx', 'thank u', 'appreciated', 'helpful'}
ABOUT_KW = {'who are you', 'what can you do', 'what are you', 'your name', 'are you ai', 'are you a bot', 'about you', 'what is lxwyer'}

GREETING_RESPONSES = [
    "Hello! 👋 I'm **Lxwyer AI v0.1** — your Indian legal intelligence assistant.\n\n• Tell me your legal problem and I'll auto-detect the area of law\n• I'll ask for your city to match verified lawyers near you\n• No generic advice — only India-specific laws (BNS, IPC, CRPC, CPC)\n\n**What is your legal issue today?**",
    "Hi there! 🙏 I'm **Lxwyer AI v0.1**.\n\n• Describe your problem in plain language\n• I'll detect the legal domain automatically\n• I'll then ask for your location and preferences\n\nGo ahead — what happened?",
]
FAREWELL_RESPONSES = ["Goodbye! 👋 Come back anytime you need legal help.", "See you! Don't hesitate to return. 😊"]
THANKS_RESPONSES = ["You're welcome! 😊 Ask if you need anything else.", "Happy to help! Feel free to ask more. 🙏"]
ABOUT_RESPONSES = [
    "I'm **Lxwyer AI v0.1** ⚖️ — an Indian legal intelligence engine.\n\n• 🔍 Auto-detects specialization from your query\n• 📍 Asks for location to find nearby verified lawyers\n• 💡 Covers: Criminal, Family, Property, Corporate, Consumer, Cyber, Labour law\n• 📚 Trained on 700+ Indian legal Q&As + offline statute database\n• ⚠️ No ratings shown — only verified experience counts\n\nJust describe your issue in plain language!",
]


def detect_specialization(text: str) -> str:
    """Auto-detect specialization from query. Returns best match or empty string."""
    t = text.lower()
    scores = {}
    for spec, keywords in SPECIALIZATION_MAP.items():
        score = sum(1 for kw in keywords if kw in t)
        if score > 0:
            scores[spec] = score
    if not scores:
        return ""
    return max(scores, key=scores.get)


def detect_sentiment(text: str) -> str:
    t = text.lower()
    urgent_hits = sum(1 for kw in URGENT_KW if kw in t)
    pos_hits = sum(1 for kw in ['thanks', 'great', 'good', 'appreciate', 'helpful', 'happy'] if kw in t)
    if urgent_hits > pos_hits:
        return "URGENT 🚨"
    if pos_hits > 0 and urgent_hits == 0:
        return "Positive 🟢"
    return "Neutral 😐"


def is_casual(text: str) -> Optional[str]:
    """Returns casual response if it's a greeting/farewell/thanks/about. Else None."""
    t = text.lower().strip()
    for kw in FAREWELL_KW:
        if kw in t:
            return random.choice(FAREWELL_RESPONSES)
    for kw in THANKS_KW:
        if kw in t:
            return random.choice(THANKS_RESPONSES)
    for phrase in ABOUT_KW:
        if phrase in t:
            return random.choice(ABOUT_RESPONSES)
    # Greeting: very short or matches exact greeting words
    words = set(t.replace("?", "").replace("!", "").split())
    if words.intersection(GREETING_KW) and len(words) <= 4:
        return random.choice(GREETING_RESPONSES)
    return None


def get_tokens(text: str) -> set:
    stop = {"what", "is", "the", "a", "an", "to", "for", "in", "of", "and", "or",
            "how", "do", "i", "can", "tell", "me", "about", "my", "want", "need"}
    words = text.lower().replace("?", "").replace(".", "").replace(",", "").split()
    return {w for w in words if w not in stop and len(w) > 1}


def find_kb_match(query: str):
    """Check 700-question training KB using Jaccard similarity."""
    q_tokens = get_tokens(query)
    if not q_tokens:
        return None
    best_score, best_match = 0.0, None
    for item in training_kb:
        kb_tokens = get_tokens(item["query"])
        if not kb_tokens:
            continue
        intersection = len(q_tokens & kb_tokens)
        union = len(q_tokens | kb_tokens)
        score = intersection / union if union > 0 else 0
        if score > best_score:
            best_score = score
            best_match = item["response"]
    return best_match if best_score > 0.45 else None


def query_sqlite(query: str, spec: str) -> list:
    """Offline FTS lookup in app.db statutes."""
    if not os.path.exists(DB_PATH):
        return []
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        q_tokens = list(get_tokens(query))
        if not q_tokens:
            return []
        fts_query = " OR ".join(q_tokens)
        cursor.execute('''
            SELECT s.law_code, s.section_number, s.title, s.description
            FROM statutes_fts sf
            JOIN statutes s ON s.id = sf.rowid
            WHERE statutes_fts MATCH ?
            LIMIT 4
        ''', (fts_query,))
        results = [{"law_code": r[0], "section": r[1], "title": r[2], "desc": r[3]} for r in cursor.fetchall()]
        conn.close()
        return results
    except Exception as e:
        logger.error(f"SQLite error: {e}")
        return []


# ── BULLET-POINT CARD BUILDERS BY SPECIALIZATION ─────────────────────────────

def build_cards_for_spec(spec: str, query: str, db_results: list) -> tuple:
    """Returns (cards, sources) with concise bullet-point summaries + expandable detail."""

    q = query[:55] + "…" if len(query) > 55 else query

    # Pull source names from DB results
    sources = list({r['law_code'] for r in db_results}) if db_results else []
    db_detail = ""
    if db_results:
        db_detail = "**📚 Verified Sections from Our Legal Database:**\n\n"
        for r in db_results:
            db_detail += f"- **{r['law_code']} § {r['section']}** — {r['title']}: {r['desc'][:200]}…\n\n"

    # ── CRIMINAL ──────────────────────────────────────────────────────────────
    if spec == "criminal":
        sources = sources or ["BNS 2023", "IPC 1860", "BNSS 2023"]
        return [
            {
                "id": "overview", "icon": "📋", "title": "Case Overview",
                "summary": "• Criminal offence under BNS/IPC\n• Police complaint / FIR required\n• Bailable or non-bailable determines arrest risk",
                "detail": f"**Criminal Law — Case Summary**\n\n**Your query:** {q}\n\n"
                          "• Governed by **Bharatiya Nyaya Sanhita (BNS) 2023** (replaced IPC 1860)\n"
                          "• Procedure governed by **BNSS 2023** (replaced CrPC 1973)\n"
                          "• Cognizable offence = police can arrest without warrant\n"
                          "• Non-cognizable = police need magistrate's permission\n"
                          "• Every accused is **innocent until proven guilty** (Art. 21)\n\n"
                          + db_detail
            },
            {
                "id": "fir-bail", "icon": "🔓", "title": "FIR & Bail Guide",
                "summary": "• File FIR free at any police station\n• Anticipatory bail (§ 438) if arrest feared\n• Regular bail after arrest via court",
                "detail": "**FIR Filing Steps:**\n\n"
                          "1. Go to nearest police station\n"
                          "2. Give written/oral complaint\n"
                          "3. FIR is free — police **cannot** refuse cognizable offence\n"
                          "4. Get a signed copy immediately\n\n"
                          "**Bail Types:**\n\n"
                          "• **Anticipatory Bail** — Apply before arrest (§ 438 BNSS)\n"
                          "• **Regular Bail** — After arrest (§ 436/437 BNSS)\n"
                          "• **Interim Bail** — Short-term emergency relief\n"
                          "• Bailable offences — bail is a right, not discretion"
            },
            {
                "id": "rights", "icon": "🛡️", "title": "Your Rights",
                "summary": "• Right to informed arrest grounds\n• Right to lawyer before interrogation\n• Right to bail hearing within 24 hrs",
                "detail": "**Your Fundamental Rights during Criminal Proceedings:**\n\n"
                          "• **Art. 20** — Cannot be convicted for act not criminal at time\n"
                          "• **Art. 21** — Right to life and personal liberty\n"
                          "• **Art. 22** — Right to be informed of grounds of arrest\n"
                          "• Must be produced before magistrate within **24 hours**\n"
                          "• Right to consult advocate of your choice\n"
                          "• Cannot be forced to be a witness against yourself\n"
                          "• Free legal aid available under Legal Aid Act 1987"
            },
            {
                "id": "next-steps", "icon": "🔍", "title": "Immediate Next Steps",
                "summary": "• Hire a criminal advocate immediately\n• Preserve all evidence / documents\n• File FIR or anticipatory bail petition",
                "detail": "**Action Plan — Do These Right Now:**\n\n"
                          "1. **Hire a criminal advocate** — experience over ratings\n"
                          "2. **Preserve evidence** — screenshots, call logs, medical reports\n"
                          "3. **Do not sign anything** without lawyer's advice\n"
                          "4. **Note all dates** — arrest time, FIR date, court dates\n"
                          "5. If falsely accused — file anticipatory bail immediately\n"
                          "6. Check eCourts app for case status\n\n"
                          "*Let me know your city and I'll find verified criminal lawyers near you!*"
            },
        ], sources

    # ── FAMILY ────────────────────────────────────────────────────────────────
    elif spec == "family":
        sources = sources or ["Hindu Marriage Act 1955", "Special Marriage Act 1954", "CrPC § 125"]
        return [
            {
                "id": "overview", "icon": "📋", "title": "Case Overview",
                "summary": "• Family/matrimonial dispute under personal law\n• Governed by Hindu / Muslim / Christian Acts\n• Family Court has jurisdiction",
                "detail": f"**Family Law — Case Summary**\n\n**Your query:** {q}\n\n"
                          "• **Hindu Marriage Act 1955** — divorce, maintenance, custody (Hindus)\n"
                          "• **Muslim Personal Law** — triple talaq abolished; MWPRDA 2019 applies\n"
                          "• **Special Marriage Act 1954** — inter-religion marriages\n"
                          "• **Domestic Violence Act 2005** — protection orders, residence rights\n"
                          "• **Guardians and Wards Act 1890** — child custody framework\n\n"
                          + db_detail
            },
            {
                "id": "divorce-custody", "icon": "👨‍👩‍👧", "title": "Divorce & Custody",
                "summary": "• Mutual divorce — 6 to 18 months\n• Contested — 2 to 5 years\n• Custody always based on child's welfare",
                "detail": "**Divorce Process:**\n\n"
                          "• **Mutual Consent** (§ 13B HMA) — Both agree; 6-month cooling period (can be waived)\n"
                          "• **Contested** — Grounds: cruelty, adultery, desertion (2+ years), mental disorder\n\n"
                          "**Child Custody:**\n\n"
                          "• Courts apply **best interest of child** standard\n"
                          "• Physical custody vs. legal custody are separate\n"
                          "• Both parents have right to visitation\n"
                          "• Child's preference considered if above ~9 years"
            },
            {
                "id": "maintenance", "icon": "💰", "title": "Maintenance & Alimony",
                "summary": "• Sec 125 CrPC — interim maintenance\n• Permanent alimony based on income/lifestyle\n• Enforceable through court if not paid",
                "detail": "**Maintenance Rights:**\n\n"
                          "• **Interim Maintenance** — Can be applied immediately; payable during proceedings\n"
                          "• **Permanent Alimony** — Court decides based on:\n"
                          "  - Husband's income and assets\n"
                          "  - Wife's earning capacity\n"
                          "  - Standard of living during marriage\n"
                          "• Wives can also claim children's education/medical costs\n"
                          "• Non-payment = contempt of court (can lead to arrest)"
            },
            {
                "id": "next-steps", "icon": "🔍", "title": "Immediate Next Steps",
                "summary": "• Consult a family law advocate\n• Collect marriage certificate & documents\n• Apply for protection order if violence involved",
                "detail": "**Action Plan:**\n\n"
                          "1. **Gather documents** — marriage certificate, financial records, property papers\n"
                          "2. **Apply for interim maintenance** immediately if separated\n"
                          "3. If domestic violence — file for **Protection Order** under DV Act 2005 (free)\n"
                          "4. **Mediation first** — saves time and costs in most family disputes\n"
                          "5. Choose a **family law specialist** with 5+ years experience\n\n"
                          "*Tell me your city and I'll find experienced family lawyers near you!*"
            },
        ], sources

    # ── PROPERTY ──────────────────────────────────────────────────────────────
    elif spec == "property":
        sources = sources or ["Transfer of Property Act 1882", "Indian Registration Act 1908", "RERA 2016"]
        return [
            {
                "id": "overview", "icon": "🏠", "title": "Property Dispute Overview",
                "summary": "• Title / ownership / boundary disputes\n• Civil + criminal remedies available\n• RERA applies for builder disputes",
                "detail": f"**Property Law — Case Summary**\n\n**Your query:** {q}\n\n"
                          "• **Transfer of Property Act 1882** — governs sale, lease, mortgage\n"
                          "• **Indian Registration Act 1908** — mandatory registration for property\n"
                          "• **RERA 2016** — builder/developer accountability\n"
                          "• **Rent Control Acts** — state-specific, protect tenants\n\n"
                          + db_detail
            },
            {
                "id": "steps", "icon": "📋", "title": "Key Legal Remedies",
                "summary": "• Civil suit for declaration of title\n• Injunction to stop encroachment\n• Criminal trespass FIR if forcible",
                "detail": "**Available Legal Options:**\n\n"
                          "**Civil Remedies:**\n"
                          "• Suit for **declaration of title** — court declares you as true owner\n"
                          "• **Injunction** — stops the other party from interfering\n"
                          "• **Partition suit** — for division of joint/ancestral property\n"
                          "• **Specific Performance** — force completion of sale agreement\n\n"
                          "**Criminal Remedies:**\n"
                          "• **IPC/BNS § Criminal Trespass** — if someone forcibly occupies land\n"
                          "• **Forgery FIR** — if documents are tampered\n\n"
                          "**Revenue/Administrative:**\n"
                          "• Mutation (दाखिल खारिज) — update land records\n"
                          "• RTI for government land records"
            },
            {
                "id": "next-steps", "icon": "🔍", "title": "Immediate Next Steps",
                "summary": "• Collect original title documents\n• Check encumbrance certificate\n• Hire a property law specialist",
                "detail": "**Action Plan:**\n\n"
                          "1. **Collect documents** — title deed, sale deed, mutation, survey map\n"
                          "2. **Encumbrance Certificate** — from Sub-Registrar to check dues/loans\n"
                          "3. **Legal Notice** — send to opposite party first\n"
                          "4. **File civil suit** in civil court (District Court)\n"
                          "5. For builder delay — file complaint with **RERA** authority\n\n"
                          "*Let me know your city and I'll find experienced property lawyers!*"
            },
        ], sources

    # ── CORPORATE ─────────────────────────────────────────────────────────────
    elif spec == "corporate":
        sources = sources or ["Companies Act 2013", "GST Act 2017", "Indian Contract Act 1872"]
        return [
            {
                "id": "overview", "icon": "💼", "title": "Business Law Overview",
                "summary": "• Governed by Companies Act 2013 + GST\n• Contracts require offer, acceptance, consideration\n• Non-compliance = penalties/strike-off",
                "detail": f"**Corporate & Business Law — Summary**\n\n**Your query:** {q}\n\n"
                          "• **Companies Act 2013** — company formation, governance, compliance\n"
                          "• **GST Acts 2017** — mandatory for turnover > ₹20L\n"
                          "• **Indian Contract Act 1872** — all agreements, validity, breach\n"
                          "• **Intellectual Property** — Patents Act 1970, Trade Marks Act 1999\n\n"
                          + db_detail
            },
            {
                "id": "compliance", "icon": "📋", "title": "Compliance Checklist",
                "summary": "• Annual filings (AOC-4, MGT-7) within 60 days of AGM\n• GST returns monthly/quarterly\n• Director KYC by Sep 30 each year",
                "detail": "**Annual Compliance Calendar:**\n\n"
                          "• **AOC-4** — Financial statements: within 60 days of AGM\n"
                          "• **MGT-7** — Annual return: within 60 days of AGM\n"
                          "• **DIR-3 KYC** — Director KYC: by 30 September\n"
                          "• **Income Tax Return** — 31 July (non-audit) / 31 Oct (audit)\n"
                          "• **GST GSTR-1** — Monthly or quarterly\n"
                          "• **TDS** — Deposit 7th of next month, file quarterly\n\n"
                          "⚠️ Non-compliance penalties: ₹10,000/day to strike-off"
            },
            {
                "id": "next-steps", "icon": "🔍", "title": "Immediate Next Steps",
                "summary": "• Consult a CS or CA for compliance\n• Check MCA21 portal for company health\n• Startup India registration for benefits",
                "detail": "**Action Plan:**\n\n"
                          "1. **CA** — for tax, GST, financial compliance\n"
                          "2. **CS (Company Secretary)** — for MCA filings, corporate governance\n"
                          "3. **Corporate Lawyer** — for contracts, disputes, IP\n\n"
                          "**Key Portals:**\n"
                          "• MCA21: mca.gov.in\n"
                          "• GST: gst.gov.in\n"
                          "• Startup India: startupindia.gov.in\n"
                          "• IP India: ipindia.gov.in\n\n"
                          "*Tell me your city to find business lawyers near you!*"
            },
        ], sources

    # ── CONSUMER ──────────────────────────────────────────────────────────────
    elif spec == "consumer":
        sources = sources or ["Consumer Protection Act 2019"]
        return [
            {
                "id": "overview", "icon": "🛍️", "title": "Consumer Rights Overview",
                "summary": "• CPA 2019 protects all buyers\n• E-filing available on E-Daakhil\n• District Commission: up to ₹1 crore",
                "detail": "**Consumer Protection Act 2019 — Key Points:**\n\n"
                          "• Covers goods, services, e-commerce, and digital products\n"
                          "• **District Commission** — up to ₹1 crore\n"
                          "• **State Commission** — ₹1 crore to ₹10 crore\n"
                          "• **National Commission** — above ₹10 crore\n"
                          "• **E-filing** available on E-Daakhil portal (free to file)\n"
                          "• Complaints resolved in 90 days (extendable)\n\n"
                          + db_detail
            },
            {
                "id": "steps", "icon": "📋", "title": "How to File a Complaint",
                "summary": "• Step 1: Legal notice to company\n• Step 2: Register on E-Daakhil portal\n• Step 3: Pay nominal filing fee",
                "detail": "**Consumer Complaint Filing Steps:**\n\n"
                          "1. **Send legal notice** to company/seller (give 30 days to respond)\n"
                          "2. **Register** on edaakhil.nic.in\n"
                          "3. **File complaint** online with supporting documents\n"
                          "4. **Filing fee** — ₹200 to ₹5000 depending on claim value\n"
                          "5. **Hearing** — Commission issues notices to opposite party\n"
                          "6. **Relief** — Refund, replacement, compensation, or all three\n\n"
                          "• You can **appear yourself** — no lawyer mandatory below ₹5 lakh"
            },
            {
                "id": "next-steps", "icon": "🔍", "title": "Next Steps",
                "summary": "• Preserve all bills, chats, screenshots\n• Send notice to company first\n• File on E-Daakhil for quick resolution",
                "detail": "**Action Plan:**\n\n"
                          "1. **Collect evidence** — bill, invoice, warranty card, chat screenshots, emails\n"
                          "2. **Write complaint** — clearly state defect/deficiency\n"
                          "3. **Send notice** to company email/registered address\n"
                          "4. **File on E-Daakhil** if no response in 30 days\n\n"
                          "*Tell me your city for nearby consumer lawyers if needed!*"
            },
        ], sources

    # ── CYBER ─────────────────────────────────────────────────────────────────
    elif spec == "cyber":
        sources = sources or ["IT Act 2000", "IT Amendment Act 2008", "BNS 2023"]
        return [
            {
                "id": "overview", "icon": "💻", "title": "Cyber Crime Overview",
                "summary": "• Governed by IT Act 2000\n• Report at cybercrime.gov.in\n• Cyber cells in every district",
                "detail": "**Cyber Crime — Key Laws:**\n\n"
                          "• **IT Act 2000 / IT Amendment Act 2008** — hacking, data theft\n"
                          "• **BNS 2023** — cheating, fraud done digitally\n"
                          "• **DPDP Act 2023** — data protection and privacy\n\n"
                          "**Types of Cyber Crimes Covered:**\n"
                          "• Online fraud, phishing, UPI scams\n"
                          "• Hacking, unauthorized access\n"
                          "• Sextortion, morphed photos\n"
                          "• Fake social media profiles\n"
                          "• Cyberstalking, threats online\n\n"
                          + db_detail
            },
            {
                "id": "steps", "icon": "📋", "title": "How to Report",
                "summary": "• Online: cybercrime.gov.in (24/7)\n• Helpline: 1930 (National Cyber Helpline)\n• File FIR at local cyber cell",
                "detail": "**Reporting Cyber Crime:**\n\n"
                          "1. **Immediately call 1930** — National Cyber Crime helpline (blocks transactions)\n"
                          "2. **File online** at cybercrime.gov.in\n"
                          "3. **Visit local cyber cell** — available in every district police HQ\n"
                          "4. **Take screenshots** of all evidence before reporting\n"
                          "5. **Do not delete** any messages, emails, or transaction records\n\n"
                          "⚠️ For financial fraud — call 1930 within minutes to freeze fraudulent transactions!"
            },
            {
                "id": "next-steps", "icon": "🔍", "title": "Next Steps",
                "summary": "• Preserve digital evidence immediately\n• Call 1930 for financial frauds\n• Consult a cyber law specialist",
                "detail": "**Action Plan:**\n\n"
                          "1. **Preserve evidence** — screenshots, call recordings, transaction IDs\n"
                          "2. **Call 1930** immediately for UPI/bank fraud\n"
                          "3. **File at cybercrime.gov.in** — get acknowledgment number\n"
                          "4. **Change passwords** and enable 2FA on all accounts\n"
                          "5. Consult a **cyber law advocate** for complex cases\n\n"
                          "*Tell me your city to find verified cyber law experts near you!*"
            },
        ], sources

    # ── LABOUR ────────────────────────────────────────────────────────────────
    elif spec == "labour":
        sources = sources or ["Industrial Disputes Act 1947", "Shops and Establishments Acts", "EPF Act 1952"]
        return [
            {
                "id": "overview", "icon": "👷", "title": "Labour Law Overview",
                "summary": "• Industrial Disputes Act protects workers\n• Labour courts for wrongful termination\n• PF, ESIC mandatory above threshold",
                "detail": "**Labour & Employment Law — Key Points:**\n\n"
                          "• **Industrial Disputes Act 1947** — wrongful termination, lay-off, retrenchment\n"
                          "• **EPF Act 1952** — PF mandatory for 20+ employee firms\n"
                          "• **ESIC Act** — medical insurance mandatory for 10+ employee firms\n"
                          "• **Payment of Gratuity Act 1972** — payable after 5 years of service\n"
                          "• **Maternity Benefit Act 1961** — 26 weeks paid leave\n\n"
                          + db_detail
            },
            {
                "id": "rights", "icon": "🛡️", "title": "Employee Rights",
                "summary": "• Termination needs notice or pay in lieu\n• Gratuity after 5 years service\n• PF withdrawal rights on resignation",
                "detail": "**Key Employee Rights:**\n\n"
                          "• **Notice period** — must be given or pay in lieu (as per contract)\n"
                          "• **Gratuity** — 15 days × years of service (after 5 years)\n"
                          "• **PF withdrawal** — allowed after 2+ months of unemployment\n"
                          "• **Sexual harassment** — file with ICC (Internal Complaints Committee)\n"
                          "• **Wrongful termination** — file dispute with Labour Commissioner\n"
                          "• **Salary dues** — can file FIR + civil suit if salary unpaid"
            },
            {
                "id": "next-steps", "icon": "🔍", "title": "Next Steps",
                "summary": "• Send legal notice to employer\n• File at Labour Commissioner\n• Consult a labour law specialist",
                "detail": "**Action Plan:**\n\n"
                          "1. **Collect documents** — offer letter, pay slips, appointment letter, PF passbook\n"
                          "2. **Send legal notice** to employer\n"
                          "3. **File complaint** with Labour Commissioner (free)\n"
                          "4. **File conciliation application** under Industrial Disputes Act\n"
                          "5. If no resolution — file before Labour Court\n\n"
                          "*Tell me your city to find labour law specialists near you!*"
            },
        ], sources

    # ── GENERAL FALLBACK ──────────────────────────────────────────────────────
    else:
        db_sources = list({r['law_code'] for r in db_results}) if db_results else []
        cards = []
        if db_results:
            detail = "**📚 Verified Sections from Offline Database:**\n\n"
            for r in db_results:
                detail += f"- **{r['law_code']} § {r['section']}** ({r['title']}): {r['desc'][:200]}…\n\n"
            cards.append({
                "id": "laws", "icon": "⚖️", "title": "Applicable Laws",
                "summary": "\n".join([f"• {r['law_code']} § {r['section']} — {r['title'][:50]}" for r in db_results[:4]]),
                "detail": detail
            })
        cards.append({
            "id": "next-steps", "icon": "🔍", "title": "Immediate Next Steps",
            "summary": "• Preserve all documents and evidence\n• Consult a qualified Indian advocate\n• Do not sign anything without legal review",
            "detail": "**General Action Plan:**\n\n"
                      "1. **Preserve all evidence** — documents, messages, photos\n"
                      "2. **Consult a local advocate** — describe your issue precisely\n"
                      "3. **Do not sign** any documents without legal review\n"
                      "4. **Keep track of dates** — limitation periods apply in Indian law\n\n"
                      "*Tell me your city and I'll find experienced lawyers near you!*"
        })
        return cards, db_sources


# ── MAIN ENDPOINT ─────────────────────────────────────────────────────────────

@router.post("/legal")
async def legal_chat(req: LegalChatRequest):
    query = req.query.strip()

    if not query:
        return LegalChatResponse(
            intro="Please ask a legal question.",
            intent="Greeting/Casual 💬", sentiment="Neutral 😐",
            is_greeting=True, greeting_text="Please ask a legal question to get started."
        )

    # 1. Casual / greeting check
    casual = is_casual(query)
    if casual:
        return LegalChatResponse(
            intro="", intent="Greeting/Casual 💬", sentiment="Neutral 😐",
            is_greeting=True, greeting_text=casual
        )

    # 2. Training KB lightning match
    kb_match = find_kb_match(query)
    if kb_match:
        logger.info(f"KB match for: {query}")
        return LegalChatResponse(**kb_match)

    # 3. Auto-detect specialization
    detected_spec = detect_specialization(query)
    sentiment = detect_sentiment(query)

    # 4. SQLite offline lookup
    db_results = query_sqlite(query, detected_spec)

    # 5. Build bullet-point cards
    cards, sources = build_cards_for_spec(detected_spec, query, db_results)

    # 6. Build intro with specialization + location ask
    spec_label_map = {
        "criminal": "Criminal Law 👮",
        "family": "Family/Matrimonial Law 👨‍👩‍👧",
        "property": "Property Law 🏠",
        "corporate": "Corporate/Business Law 💼",
        "consumer": "Consumer Protection Law 🛍️",
        "cyber": "Cyber Law 💻",
        "labour": "Labour & Employment Law 👷",
        "constitutional": "Constitutional Law ⚖️",
    }
    intent_label = spec_label_map.get(detected_spec, "General Legal ⚖️")

    if sentiment == "URGENT 🚨":
        intro = "🚨 This sounds urgent — here is what you need to know immediately. Please consult a lawyer today."
    else:
        intro = f"I've detected this is a **{intent_label}** matter. Here's a legal breakdown:"

    # Ask for location to match lawyers (only for non-casual queries without location keyword)
    needs_location = not any(city in query.lower() for city in [
        'delhi', 'mumbai', 'bangalore', 'bengaluru', 'chennai', 'kolkata',
        'hyderabad', 'pune', 'jaipur', 'lucknow', 'noida', 'gurgaon',
        'ahmedabad', 'surat', 'faridabad', 'indore', 'bhopal', 'chandigarh',
        'nagpur', 'coimbatore', 'kochi', 'patna', 'srinagar', 'agra'
    ])

    return LegalChatResponse(
        intro=intro,
        intent=intent_label,
        sentiment=sentiment,
        sources=sources,
        cards=cards,
        is_greeting=False,
        needs_location=needs_location,
        detected_spec=detected_spec
    )
