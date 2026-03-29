"""
Full database seed: wipe everything and create 50 realistic records
for every collection: users, lawyers, law_firms, firm_lawyers,
firm_clients, bookings, messages, cases, sos_sessions, lawyer_applications,
lawfirm_applications, firm_lawyer_applications, firm_client_applications.
"""

import asyncio
import uuid
import bcrypt
import random
from datetime import datetime, timezone, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME   = os.getenv("DB_NAME", "lxwyerup")

client  = AsyncIOMotorClient(MONGO_URL)
db      = client[DB_NAME]

# ─── helpers ──────────────────────────────────────────────────────────────────
def uid(): return str(uuid.uuid4())
def hpwd(p): return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()
def ago(days=0, hours=0): return (datetime.now(timezone.utc) - timedelta(days=days, hours=hours)).isoformat()
def rand_date(start_days=0, end_days=365): return (datetime.now(timezone.utc) - timedelta(days=random.randint(start_days, end_days))).isoformat()
def pick(*args): return random.choice(args)
def picks(lst, k=2): return random.sample(lst, min(k, len(lst)))

STATES   = ["Delhi","Maharashtra","Karnataka","Tamil Nadu","Uttar Pradesh","Gujarat","Rajasthan","West Bengal","Telangana","Madhya Pradesh","Punjab","Bihar"]
CITIES   = {"Delhi":["New Delhi","Dwarka","Rohini"],"Maharashtra":["Mumbai","Pune","Nagpur"],"Karnataka":["Bengaluru","Mysuru","Hubli"],"Tamil Nadu":["Chennai","Coimbatore","Madurai"],"Uttar Pradesh":["Lucknow","Agra","Kanpur"],"Gujarat":["Ahmedabad","Surat","Vadodara"],"Rajasthan":["Jaipur","Jodhpur","Udaipur"],"West Bengal":["Kolkata","Durgapur","Siliguri"],"Telangana":["Hyderabad","Warangal","Karimnagar"],"Madhya Pradesh":["Bhopal","Indore","Jabalpur"],"Punjab":["Chandigarh","Ludhiana","Amritsar"],"Bihar":["Patna","Gaya","Muzaffarpur"]}
SPECS    = ["Criminal Law","Family Law","Civil Law","Corporate Law","Property Law","Labour Law","Tax Law","Cyber Law","Constitutional Law","Immigration Law","Intellectual Property","Banking Law","Environmental Law","Medical Law","Real Estate Law"]
LANGS    = ["Hindi","English","Tamil","Telugu","Kannada","Marathi","Bengali","Gujarati","Punjabi","Malayalam","Odia","Urdu"]
COURTS   = ["Supreme Court of India","Delhi High Court","Bombay High Court","Madras High Court","Calcutta High Court","Karnataka High Court","Allahabad High Court","District Court","Sessions Court","Family Court"]
FIRST_M  = ["Raj","Amit","Vikram","Anil","Suresh","Ramesh","Mahesh","Dinesh","Sanjay","Vijay","Pradeep","Manoj","Deepak","Naveen","Rohit","Arjun","Kiran","Harish","Girish","Mohan","Arun","Sunil","Rakesh","Ashok","Ravi"]
FIRST_F  = ["Priya","Anita","Sunita","Kavita","Geeta","Neha","Pooja","Rekha","Suman","Asha","Meena","Usha","Lata","Mala","Seema","Nisha","Divya","Swati","Ankita","Shreya","Pallavi","Ritu","Alka","Mamta","Reena"]
LAST     = ["Sharma","Verma","Gupta","Singh","Kumar","Patel","Shah","Mehta","Joshi","Rao","Nair","Iyer","Reddy","Pillai","Choudhary","Malhotra","Khanna","Bose","Das","Chatterjee","Mishra","Dubey","Tiwari","Pandey","Srivastava"]
FIRM_NAMES = ["Sharma & Associates","Lex Counsel LLP","Justice Partners","Advocate Alliance","Legal Shield India","Prime Law Group","Veritas Legal","Apex Advocates","Crown Law Chambers","Legal Eagles India","Surana & Co","Bharat Law Firm","IndoJuris LLP","Capitol Legal","Dhruv Law Associates","Heritage Advocates","Paramount Legal","Synergy Law Office","Trimurti Legal","Precision Law Partners","National Law House","Sagar & Sagar","Kapila Legal LLP","Meridian Advocates","Jubilee Law Chambers","Pacific Legal India","Zenith Law Group","Nova Legal Partners","Cedar Law Office","Monarch Advocates","Nexus Legal India","Pragati Law Associates","Vanguard Legal","Citywide Counselors","Lotus Law Chamber","Empire Legal LLP","Genesis Advocates","Horizon Law Firm","Summit Legal Partners","Legacy Law India","Unity Legal Associates","Stellar Advocates","Alliance Law Group","Delta Legal Chamber","Cornerstone Legal","Noble Law Firm","Imperial Advocates","Frontier Legal LLP","Accord Law Partners","Pinnacle Legal India"]
CASE_TYPES = ["Property Dispute","Divorce","Criminal Defence","Corporate Dispute","Labour Dispute","Consumer Case","Tax Matter","Cyber Crime","Immigration","Cheque Bounce","Contract Dispute","Medical Negligence","Land Acquisition","Maintenance Case","Bail Application"]
MATTERS   = ["Bail Application","Divorce Filing","Property Dispute","Cheque Bounce","Cybercrime","Domestic Violence","Child Custody","Contract Breach","Labour Dispute","Rent Dispute"]
EDUS     = ["LLB – Delhi University","LLM – National Law School","BA LLB – NLSIU Bengaluru","BBA LLB – Symbiosis Law School","LLB – Bombay High Court Enrolled","LLM (Corporate Law) – ILS Pune","LLB – Punjab University","LLM (Criminal) – Amity Law School"]

def fname(gender="M"):
    fn = random.choice(FIRST_M) if gender=="M" else random.choice(FIRST_F)
    return f"{fn} {random.choice(LAST)}"

def email(name, suf=""):
    return f"{name.lower().replace(' ','.')+suf}@example.com"

def phone():
    return f"+91{random.randint(7000000000,9999999999)}"

def bar_num():
    state_code = random.choice(["DL","MH","KA","TN","UP","GJ","RJ","WB"])
    return f"BAR/{state_code}/{random.randint(1000,9999)}/{random.randint(2005,2022)}"

def state_city():
    s = random.choice(STATES)
    c = random.choice(CITIES[s])
    return s, c

# ─── COLLECTIONS TO WIPE ─────────────────────────────────────────────────────
COLLECTIONS = [
    "users","bookings","cases","messages","sos_sessions",
    "lawyer_applications","lawfirm_applications",
    "firm_lawyers","firm_clients","firm_client_applications",
    "firm_lawyer_applications","case_updates","firm_lawyer_tasks",
    "notifications","otp_records","waitlist","billing",
]

async def wipe():
    print("🗑  Wiping all collections...")
    for col in COLLECTIONS:
        result = await db[col].delete_many({})
        print(f"   {col}: deleted {result.deleted_count}")

# ─── 1. USERS (Clients) ──────────────────────────────────────────────────────
async def seed_users():
    print("\n👤 Seeding 50 users...")
    docs = []
    for i in range(50):
        gender = pick("M","F")
        name   = fname(gender)
        s, c   = state_city()
        uid_   = uid()
        docs.append({
            "id": uid_, "unique_id": f"USR{1001+i}",
            "full_name": name, "email": email(name, str(i)),
            "password": hpwd("user@1234"), "phone": phone(),
            "user_type": "client", "gender": gender,
            "state": s, "city": c,
            "profile_complete": True,
            "address": f"{random.randint(1,200)}, {c} Colony, {s}",
            "date_of_birth": f"{random.randint(1970,2000)}-{random.randint(1,12):02d}-{random.randint(1,28):02d}",
            "occupation": pick("Business Owner","Government Employee","Teacher","Engineer","Doctor","Farmer","Homemaker","Student","Retired","Self-Employed"),
            "preferred_language": pick(*LANGS[:6]),
            "is_verified": True,
            "created_at": rand_date(30, 365),
            "last_login": rand_date(0, 30),
        })
    await db.users.insert_many(docs)
    print(f"   ✅ {len(docs)} users inserted")
    return [d["id"] for d in docs]

# ─── 2. INDEPENDENT LAWYERS ──────────────────────────────────────────────────
async def seed_lawyers():
    print("\n⚖  Seeding 50 lawyers...")
    docs = []
    for i in range(50):
        gender  = pick("M","F")
        name    = fname(gender)
        s, c    = state_city()
        uid_    = uid()
        exp     = random.randint(2, 30)
        app_type = pick(["normal"],["sos"],["normal","sos"])
        sos = "sos" in app_type
        docs.append({
            "id": uid_, "unique_id": f"LAW{2001+i}",
            "full_name": name, "email": email(name, str(i)),
            "password": hpwd("lawyer@1234"), "phone": phone(),
            "user_type": "lawyer",
            "specialization": pick(*SPECS),
            "experience_years": exp,
            "cases_won": random.randint(exp*5, exp*20),
            "bar_council_number": bar_num(),
            "education": pick(*EDUS),
            "state": s, "city": c,
            "court": pick(*COURTS),
            "primary_court": pick(*COURTS),
            "languages": picks(LANGS, random.randint(2,4)),
            "fee_range": pick("₹500-₹1,000","₹1,000-₹3,000","₹3,000-₹5,000","₹5,000-₹10,000","₹10,000+"),
            "charge_30min": str(random.randint(3,15)*100),
            "charge_60min": str(random.randint(5,25)*100),
            "bio": f"{name} is a seasoned {pick(*SPECS)} attorney with {exp} years of practice in {c}. Known for client-first approach and strong courtroom advocacy.",
            "office_address": f"Chamber {random.randint(1,50)}, {c} Bar Association, {s}",
            "rating": round(random.uniform(3.5, 5.0), 1),
            "total_ratings": random.randint(10, 500),
            "application_type": app_type,
            "sos_locations": [c, s] if sos else [],
            "sos_matters": picks(MATTERS, 3) if sos else [],
            "sos_terms_accepted": sos,
            "is_approved": True, "is_verified": True,
            "account_status": "active",
            "practice_start_date": f"{2024-exp}-01-01",
            "achievements": f"Won {random.randint(5,50)} landmark {pick(*SPECS)} cases. {random.choice(['Published 2 legal articles.','Member of Bar Council committee.','Received District Best Lawyer Award.','Featured in Legal500 India.',''])}",
            "created_at": rand_date(60, 730),
            "last_login": rand_date(0, 15),
        })
    await db.users.insert_many(docs)
    print(f"   ✅ {len(docs)} lawyers inserted")
    return [d["id"] for d in docs]

# ─── 3. LAW FIRMS ────────────────────────────────────────────────────────────
async def seed_law_firms():
    print("\n🏛  Seeding 50 law firms...")
    docs = []
    firm_ids = []
    for i in range(50):
        s, c   = state_city()
        uid_   = uid()
        firm_name = FIRM_NAMES[i % len(FIRM_NAMES)]
        contact_name = fname()
        est_year = random.randint(1985, 2020)
        docs.append({
            "id": uid_, "unique_id": f"LF{3001+i}",
            "email": f"contact@{firm_name.lower().replace(' ','').replace('&','and')[:15]}{i}.com",
            "contact_email": f"contact@{firm_name.lower().replace(' ','').replace('&','and')[:15]}{i}.com",
            "password": hpwd("firm@1234"), "password_hash": hpwd("firm@1234"),
            "full_name": contact_name,
            "contact_name": contact_name,
            "contact_phone": phone(),
            "firm_name": firm_name,
            "user_type": "law_firm",
            "registration_number": f"LLP{random.randint(10000,99999)}/{est_year}",
            "gst_number": f"27AAA{random.randint(1000,9999)}{'ABCDE'[i%5]}{'12345'[i%5]}Z{random.randint(1,9)}",
            "established_year": est_year,
            "total_lawyers": random.randint(3, 50),
            "total_staff": random.randint(5, 80),
            "firm_type": pick("LLP","Partnership","Proprietorship","Corporation"),
            "practice_areas": picks(SPECS, random.randint(3, 6)),
            "city": c, "state": s,
            "address": f"{random.randint(1,100)}, Law Chambers Road, {c}, {s}",
            "pincode": str(random.randint(100000, 999999)),
            "website": f"https://www.{firm_name.lower().replace(' ','').replace('&','')[:12]}{i}.com",
            "linkedin_url": f"https://linkedin.com/company/{firm_name.lower().replace(' ','-')[:20]}",
            "description": f"{firm_name} is a premier legal firm established in {est_year}, headquartered in {c}. We specialize in " + ", ".join(picks(SPECS, 3)) + " with a team of dedicated professionals committed to delivering justice.",
            "achievements": f"Handled over {random.randint(500,5000)} cases since inception. {pick('Ranked Top 10 in State Bar.','ISO 9001 Certified.','Empanelled with major PSUs.','Recognized by Legal500.','FICCI Law Firm Award Winner.')}",
            "memberships": picks(["Bar Council of India","FICCI","CII","ASSOCHAM","NASSCOM Legal","ICC International Court"], random.randint(2,4)),
            "senior_partners": [fname() for _ in range(random.randint(1,4))],
            "languages": picks(LANGS, random.randint(2,5)),
            "contact_designation": pick("Managing Partner","Senior Partner","Director","Founding Partner"),
            "is_verified": True, "is_approved": True,
            "created_at": rand_date(30, 730),
        })
        firm_ids.append({"id": uid_, "unique_id": f"LF{3001+i}", "name": firm_name, "city": c, "state": s})
    await db.users.insert_many(docs)
    print(f"   ✅ {len(docs)} law firms inserted")
    return firm_ids

# ─── 4. FIRM LAWYERS ─────────────────────────────────────────────────────────
async def seed_firm_lawyers(firms):
    print("\n👔 Seeding 50 firm lawyers...")
    docs = []
    for i in range(50):
        firm = random.choice(firms)
        gender = pick("M","F")
        name   = fname(gender)
        s, c   = firm["state"], firm["city"]
        exp    = random.randint(1, 20)
        uid_   = uid()
        docs.append({
            "id": uid_, "unique_id": f"FL{4001+i}",
            "full_name": name, "email": email(name, f"fl{i}"),
            "phone": phone(), "password_hash": hpwd("firmlawyer@1234"),
            "firm_id": firm["unique_id"],
            "firm_name": firm["name"],
            "specialization": pick(*SPECS),
            "experience_years": exp,
            "bar_council_number": bar_num(),
            "education": pick(*EDUS),
            "languages": picks(LANGS, random.randint(2,3)),
            "state": s, "city": c,
            "designation": pick("Associate Advocate","Senior Associate","Junior Partner","Legal Consultant","Paralegal Supervisor"),
            "is_active": random.random() > 0.1,
            "tasks_completed": random.randint(0, 100),
            "tasks_pending": random.randint(0, 20),
            "joining_date": rand_date(30, 1000),
            "salary_range": pick("₹25,000-₹40,000","₹40,000-₹75,000","₹75,000-₹1,50,000","₹1,50,000+"),
            "bio": f"{name} joined {firm['name']} with {exp} year(s) of experience in {pick(*SPECS)}.",
            "created_at": rand_date(10, 365),
        })
    await db.firm_lawyers.insert_many(docs)
    print(f"   ✅ {len(docs)} firm lawyers inserted")
    return [d["id"] for d in docs]

# ─── 5. FIRM CLIENTS ─────────────────────────────────────────────────────────
async def seed_firm_clients(firms):
    print("\n🤝 Seeding 50 firm clients...")
    docs = []
    for i in range(50):
        firm = random.choice(firms)
        gender = pick("M","F")
        name   = fname(gender)
        s, c   = state_city()
        uid_   = uid()
        case_t = pick(*CASE_TYPES)
        docs.append({
            "id": uid_, "unique_id": f"FC{5001+i}",
            "full_name": name, "email": email(name, f"fc{i}"),
            "phone": phone(), "password_hash": hpwd("firmclient@1234"),
            "law_firm_id": firm["unique_id"],
            "law_firm_name": firm["name"],
            "case_type": case_t,
            "case_description": f"Client requires legal assistance regarding {case_t.lower()} matter. Details: " + pick(
                "Disputed property in residential colony.",
                "Seeking divorce on grounds of cruelty.",
                "FIR filed, requiring criminal defence.",
                "Commercial contract breach by counterparty.",
                "Pending labour dispute with employer.",
                "Consumer fraud by e-commerce company.",
                "Income tax assessment dispute.",
                "Online fraud and cybercrime complaint.",
                "Visa rejection appeal.",
                "Cheque dishonour by business partner.",
            ),
            "state": s, "city": c,
            "address": f"{random.randint(1,200)}, {c} Nagar, {s}",
            "occupation": pick("Business Owner","Government Employee","Teacher","Engineer","Doctor","Farmer","Homemaker","Student","Retired"),
            "assigned_lawyer_id": None,
            "assigned_lawyer_name": None,
            "status": pick("active","active","active","pending","closed"),
            "case_stage": pick("Initial Consultation","Document Collection","Filing","Hearing","Awaiting Judgment","Closed"),
            "next_hearing_date": (datetime.now(timezone.utc) + timedelta(days=random.randint(5, 120))).isoformat(),
            "retainer_fee": str(random.randint(5, 50) * 1000),
            "documents_submitted": picks(["Aadhaar Card","PAN Card","Property Papers","FIR Copy","Contract Copy","Bank Statement","Birth Certificate"], random.randint(2,5)),
            "notes": f"Client contacted via {pick('website','referral','walk-in','phone')} on {rand_date(10,60)[:10]}.",
            "created_at": rand_date(5, 365),
        })
    await db.firm_clients.insert_many(docs)
    print(f"   ✅ {len(docs)} firm clients inserted")
    return [d["id"] for d in docs]

# ─── 6. BOOKINGS ─────────────────────────────────────────────────────────────
async def seed_bookings(user_ids, lawyer_ids):
    print("\n📅 Seeding 50 bookings...")
    docs = []
    statuses = ["confirmed","confirmed","confirmed","pending","completed","completed","cancelled"]
    for i in range(50):
        uid_    = random.choice(user_ids)
        lid_    = random.choice(lawyer_ids)
        status  = pick(*statuses)
        btype   = pick("consultation","sos","document_review","court_representation")
        mins    = pick(30, 60)
        charge  = random.randint(3,25)*100
        bdate   = rand_date(-7, 60)
        docs.append({
            "id": uid(), "booking_id": f"BK{6001+i}",
            "user_id": uid_, "lawyer_id": lid_,
            "booking_type": btype,
            "status": status,
            "booking_date": bdate,
            "scheduled_date": bdate,
            "time_slot": f"{random.randint(9,17):02d}:{pick('00','30')} IST",
            "duration_minutes": mins,
            "amount": charge,
            "payment_status": pick("paid","pending","refunded") if status != "pending" else "pending",
            "meeting_mode": pick("video","in-person","phone"),
            "meeting_link": f"https://meet.lxwyerup.com/{uid()[:8]}" if status == "confirmed" else None,
            "case_description": f"Client seeking advice on {pick(*CASE_TYPES).lower()}.",
            "notes": pick("Urgent matter.","Follow-up session.","First consultation.","Document review required.",""),
            "created_at": rand_date(1, 90),
            "updated_at": rand_date(0, 1),
        })
    await db.bookings.insert_many(docs)
    print(f"   ✅ {len(docs)} bookings inserted")

# ─── 7. MESSAGES ─────────────────────────────────────────────────────────────
async def seed_messages(user_ids, lawyer_ids):
    print("\n✉  Seeding 50+ messages (conversations)...")
    msgs = []
    TEMPLATES = [
        "Hello, I need legal advice regarding my property dispute.",
        "Good morning, I have scheduled a consultation for tomorrow.",
        "Please send me the documents I asked about.",
        "Thank you for your help with my case.",
        "When is the next hearing date?",
        "I have received the court notice. Please advise.",
        "What documents do I need to submit?",
        "My case has been postponed to next month.",
        "Can we schedule an urgent call today?",
        "Please review the attached contract.",
        "The other party has agreed to settle.",
        "I will be present at the court tomorrow.",
        "Please prepare the affidavit by Friday.",
        "The judge has asked for additional evidence.",
        "My bail application was approved. Thank you!",
        "Can you explain the next steps in the process?",
        "I have transferred the consultation fee.",
        "The divorce papers need to be filed this week.",
        "Please update me on the status of my case.",
        "I need a character certificate for the court.",
    ]
    for i in range(50):
        uid_ = random.choice(user_ids)
        lid_ = random.choice(lawyer_ids)
        n_msgs = random.randint(2, 8)
        for j in range(n_msgs):
            sender = uid_ if j % 2 == 0 else lid_
            recv   = lid_ if j % 2 == 0 else uid_
            msgs.append({
                "id": uid(),
                "sender_id": sender, "receiver_id": recv,
                "content": random.choice(TEMPLATES),
                "message_type": "text",
                "is_read": random.random() > 0.3,
                "created_at": rand_date(0, 60),
            })
    await db.messages.insert_many(msgs)
    print(f"   ✅ {len(msgs)} messages inserted")

# ─── 8. CASES ────────────────────────────────────────────────────────────────
async def seed_cases(user_ids, lawyer_ids):
    print("\n⚖  Seeding 50 cases...")
    docs = []
    for i in range(50):
        s_status = pick("open","open","open","in_progress","closed","on_hold")
        case_t   = pick(*CASE_TYPES)
        docs.append({
            "id": uid(), "case_number": f"CS{7001+i}",
            "user_id": random.choice(user_ids),
            "lawyer_id": random.choice(lawyer_ids),
            "title": f"{case_t} — Matter #{7001+i}",
            "case_type": case_t,
            "description": f"Legal matter regarding {case_t.lower()}. Filed in {pick(*COURTS)}.",
            "court": pick(*COURTS),
            "status": s_status,
            "case_stage": pick("Filing","Hearing","Evidence","Arguments","Judgment","Appeal","Settled"),
            "filing_date": rand_date(30, 730),
            "next_hearing_date": (datetime.now(timezone.utc) + timedelta(days=random.randint(1,180))).isoformat() if s_status != "closed" else None,
            "total_hearings": random.randint(1, 15),
            "fee_agreed": random.randint(10, 200) * 1000,
            "documents": picks(["Plaint","Written Statement","Affidavit","Evidence List","FIR Copy","Property Papers"], random.randint(1,4)),
            "notes": pick("Mediation suggested.","Strong case.","Evidence needed.","Settlement possible.","Awaiting police report.",""),
            "created_at": rand_date(30, 730),
            "updated_at": rand_date(0, 30),
        })
    await db.cases.insert_many(docs)
    print(f"   ✅ {len(docs)} cases inserted")

# ─── 9. SOS SESSIONS ─────────────────────────────────────────────────────────
async def seed_sos(user_ids, lawyer_ids):
    print("\n🆘 Seeding 50 SOS sessions...")
    docs = []
    for i in range(50):
        status = pick("completed","completed","completed","active","searching","cancelled")
        docs.append({
            "id": uid(), "session_id": f"SOS{8001+i}",
            "user_id": random.choice(user_ids),
            "matched_lawyer_id": random.choice(lawyer_ids) if status not in ("searching","cancelled") else None,
            "sos_matter": pick(*MATTERS),
            "matter_type": pick(*["Criminal","Civil","Family","Property","Labour","Consumer"]),
            "location": pick(*[c for cities in CITIES.values() for c in cities]),
            "status": status,
            "response_time_seconds": random.randint(30, 300) if status == "completed" else None,
            "duration_minutes": random.randint(15, 90) if status == "completed" else None,
            "fee_charged": random.randint(5, 50) * 100 if status == "completed" else 0,
            "rating_given": round(random.uniform(3.5, 5.0), 1) if status == "completed" else None,
            "notes": pick("Resolved successfully.","Referred to family court.","Client satisfied.","Matter escalated.",""),
            "created_at": rand_date(0, 180),
            "ended_at": rand_date(0, 180) if status == "completed" else None,
        })
    await db.sos_sessions.insert_many(docs)
    print(f"   ✅ {len(docs)} SOS sessions inserted")

# ─── 10. LAWYER APPLICATIONS ─────────────────────────────────────────────────
async def seed_lawyer_apps():
    print("\n📋 Seeding 50 lawyer applications (independent)...")
    docs = []
    for i in range(50):
        gender = pick("M","F")
        name   = fname(gender)
        s, c   = state_city()
        st     = pick("pending","approved","approved","rejected")
        exp    = random.randint(1, 25)
        app_t  = pick(["normal"],["sos"],["normal","sos"])
        docs.append({
            "id": uid(), "application_id": f"LA{9001+i}",
            "full_name": name, "name": name,
            "email": email(name, f"app{i}"), "phone": phone(),
            "password_hash": hpwd("apply@1234"),
            "specialization": pick(*SPECS),
            "experience_years": exp, "experience": str(exp),
            "bar_council_number": bar_num(),
            "education": pick(*EDUS),
            "state": s, "city": c,
            "court": pick(*COURTS),
            "languages": picks(LANGS, random.randint(2,4)),
            "fee_range": pick("₹500-₹1,000","₹1,000-₹3,000","₹3,000-₹5,000","₹5,000+"),
            "charge_30min": str(random.randint(3,15)*100),
            "charge_60min": str(random.randint(5,25)*100),
            "bio": f"Experienced lawyer specializing in {pick(*SPECS)} with {exp} years of practice.",
            "application_type": app_t,
            "sos_terms_accepted": "sos" in app_t,
            "status": st,
            "reviewed_at": rand_date(0, 30) if st != "pending" else None,
            "created_at": rand_date(0, 180),
        })
    await db.lawyer_applications.insert_many(docs)
    print(f"   ✅ {len(docs)} lawyer applications inserted")

# ─── 11. LAW FIRM APPLICATIONS ───────────────────────────────────────────────
async def seed_lawfirm_apps():
    print("\n🏢 Seeding 50 law firm applications...")
    docs = []
    for i in range(50):
        s, c = state_city()
        fn   = FIRM_NAMES[(i+10) % len(FIRM_NAMES)] + f" {i}"
        cn   = fname()
        est  = random.randint(1990, 2023)
        st   = pick("pending","pending","approved","rejected")
        docs.append({
            "id": uid(), "application_id": f"LFA{10001+i}",
            "firm_name": fn, "contact_name": cn,
            "contact_email": f"apply@{fn.lower().replace(' ','')[:10]}{i}.com",
            "contact_phone": phone(), "contact_designation": pick("Managing Partner","Director","Founder"),
            "password_hash": hpwd("firmapply@1234"),
            "registration_number": f"LLP{random.randint(10000,99999)}/{est}",
            "gst_number": f"27{random.randint(1000,9999)}AAA{'ABCDE'[i%5]}Z{random.randint(1,9)}",
            "established_year": est,
            "firm_type": pick("LLP","Partnership","Proprietorship"),
            "total_lawyers": random.randint(2, 40),
            "total_staff": random.randint(3, 60),
            "practice_areas": picks(SPECS, random.randint(2,5)),
            "state": s, "city": c,
            "address": f"{random.randint(1,100)}, Legal Hub, {c}",
            "pincode": str(random.randint(100000,999999)),
            "website": f"https://www.{fn.lower().replace(' ','')[:12]}.com",
            "description": f"{fn} is a growing law firm in {c} with expertise in " + ", ".join(picks(SPECS, 3)) + ".",
            "achievements": pick("Multiple landmark cases won.","ISO certified firm.","Empanelled with government.",""),
            "languages": picks(LANGS, random.randint(2,4)),
            "status": st,
            "created_at": rand_date(0, 365),
        })
    await db.lawfirm_applications.insert_many(docs)
    print(f"   ✅ {len(docs)} law firm applications inserted")

# ─── 12. FIRM LAWYER APPLICATIONS ───────────────────────────────────────────
async def seed_firm_lawyer_apps(firms):
    print("\n📝 Seeding 50 firm lawyer applications...")
    docs = []
    for i in range(50):
        firm   = random.choice(firms)
        gender = pick("M","F")
        name   = fname(gender)
        s, c   = firm["state"], firm["city"]
        exp    = random.randint(1, 15)
        st     = pick("pending","pending","approved","rejected")
        docs.append({
            "id": uid(), "application_id": f"FLA{11001+i}",
            "full_name": name, "email": email(name, f"fla{i}"),
            "phone": phone(), "password_hash": hpwd("flaapply@1234"),
            "firm_id": firm["unique_id"],
            "firm_name": firm["name"],
            "specialization": pick(*SPECS),
            "experience_years": exp,
            "bar_council_number": bar_num(),
            "education": pick(*EDUS),
            "languages": picks(LANGS, random.randint(2,3)),
            "state": s, "city": c,
            "bio": f"{name} is applying to join {firm['name']} with {exp} years of experience in {pick(*SPECS)}.",
            "expected_salary": pick("₹25,000-₹40,000","₹40,000-₹75,000","₹75,000-₹1,50,000"),
            "notice_period_days": pick(0, 15, 30, 60, 90),
            "status": st,
            "created_at": rand_date(0, 120),
        })
    await db.firm_lawyer_applications.insert_many(docs)
    print(f"   ✅ {len(docs)} firm lawyer applications inserted")

# ─── 13. FIRM CLIENT APPLICATIONS ───────────────────────────────────────────
async def seed_firm_client_apps(firms):
    print("\n📩 Seeding 50 firm client applications...")
    docs = []
    for i in range(50):
        firm   = random.choice(firms)
        gender = pick("M","F")
        name   = fname(gender)
        s, c   = state_city()
        case_t = pick(*CASE_TYPES)
        st     = pick("pending","pending","approved","rejected")
        docs.append({
            "id": uid(), "application_id": f"FCA{12001+i}",
            "full_name": name, "email": email(name, f"fca{i}"),
            "phone": phone(), "password_hash": hpwd("fcaapply@1234"),
            "law_firm_id": firm["unique_id"],
            "law_firm_name": firm["name"],
            "case_type": case_t,
            "case_description": f"Seeking legal help for {case_t.lower()} matter in {c}, {s}.",
            "urgency": pick("normal","urgent","critical"),
            "state": s, "city": c,
            "occupation": pick("Business Owner","Government Employee","Teacher","Engineer","Doctor","Homemaker"),
            "budget": pick("₹5,000-₹20,000","₹20,000-₹50,000","₹50,000-₹1,00,000","₹1,00,000+"),
            "documents_available": picks(["Aadhaar Card","PAN Card","FIR Copy","Property Papers","Contract","Bank Statement"], random.randint(1,4)),
            "preferred_language": pick(*LANGS[:8]),
            "status": st,
            "created_at": rand_date(0, 90),
        })
    await db.firm_client_applications.insert_many(docs)
    print(f"   ✅ {len(docs)} firm client applications inserted")

# ─── MAIN ─────────────────────────────────────────────────────────────────────
async def main():
    print("=" * 60)
    print("   LXWYERUP — FULL DATABASE SEED")
    print("=" * 60)

    await wipe()

    user_ids   = await seed_users()
    lawyer_ids = await seed_lawyers()
    firms      = await seed_law_firms()

    await seed_firm_lawyers(firms)
    await seed_firm_clients(firms)
    await seed_bookings(user_ids, lawyer_ids)
    await seed_messages(user_ids, lawyer_ids)
    await seed_cases(user_ids, lawyer_ids)
    await seed_sos(user_ids, lawyer_ids)
    await seed_lawyer_apps()
    await seed_lawfirm_apps()
    await seed_firm_lawyer_apps(firms)
    await seed_firm_client_apps(firms)

    print("\n" + "=" * 60)
    print("   ✅ SEED COMPLETE — ALL 50 records per category loaded")
    print("=" * 60)
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
