"""
Re-seed only lawyers - with ALL fields that the LawyerProfile and FindLawyerManual
front-end pages expect:
  achievements (array of objects with title + description)
  location (City, State)
  feeMin / feeMax (numbers)
  barCouncilNumber (camelCase)
  consultationModes (array of strings)
  secondarySpecializations (array)
  practice_areas (array)
  availability (array of day strings)
  featured (bool)
  consultation_types / consultation_preferences
  gender, aadhar_card_number (masked), pan_card_number (masked)
  pincode, linkedin_url, website
  cases_won, total_ratings, rating
  about (longer bio)
  notice_period_days, joining_availability
"""
import asyncio, uuid, bcrypt, random
from datetime import datetime, timezone, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
db = AsyncIOMotorClient(os.getenv("MONGO_URL","mongodb://localhost:27017"))[os.getenv("DB_NAME","lxwyerup")]

def uid(): return str(uuid.uuid4())
def hpwd(p): return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()
def ago(days=0): return (datetime.now(timezone.utc)-timedelta(days=days)).isoformat()
def pick(*args): return random.choice(args)
def picks(lst, k): return random.sample(lst, min(k, len(lst)))

FIRST_M = ["Raj","Amit","Vikram","Anil","Suresh","Ramesh","Mahesh","Dinesh","Sanjay","Vijay","Pradeep","Manoj","Deepak","Naveen","Rohit","Arjun","Kiran","Harish","Girish","Mohan","Arun","Sunil","Rakesh","Ashok","Ravi"]
FIRST_F = ["Priya","Anita","Sunita","Kavita","Geeta","Neha","Pooja","Rekha","Suman","Asha","Meena","Usha","Lata","Mala","Seema","Nisha","Divya","Swati","Ankita","Shreya","Pallavi","Ritu","Alka","Mamta","Reena"]
LAST = ["Sharma","Verma","Gupta","Singh","Kumar","Patel","Shah","Mehta","Joshi","Rao","Nair","Iyer","Reddy","Pillai","Choudhary","Malhotra","Khanna","Bose","Das","Chatterjee","Mishra","Dubey","Tiwari","Pandey","Srivastava"]
SPECS = ["Criminal Law","Family Law","Civil Law","Corporate Law","Property Law","Labour Law","Tax Law","Cyber Law","Constitutional Law","Immigration Law","Intellectual Property","Banking Law","Environmental Law","Medical Law","Real Estate Law"]
ALL_SPECS = SPECS + ["Consumer Law","Arbitration & Mediation","Company Law","Insurance Law","Entertainment & Media Law"]
LANGS = ["Hindi","English","Tamil","Telugu","Kannada","Marathi","Bengali","Gujarati","Punjabi","Malayalam","Odia","Urdu"]
COURTS = ["Supreme Court of India","Delhi High Court","Bombay High Court","Madras High Court","Calcutta High Court","Karnataka High Court","Allahabad High Court","District Court","Sessions Court","Family Court","Magistrate Court","Civil Court","Consumer Forum"]
EDUS = ["LLB – Delhi University","LLM – National Law School","BA LLB – NLSIU Bengaluru","BBA LLB – Symbiosis Law School","LLB – Bombay High Court","LLM (Corporate Law) – ILS Pune","LLB – Punjab University","LLM (Criminal) – Amity Law School","BA LLB – Gujarat National Law University","LLM – Rajiv Gandhi School of Intellectual Property Law"]

STATE_CITY = [
    ("Delhi","New Delhi"),("Delhi","Dwarka"),("Delhi","Rohini"),
    ("Maharashtra","Mumbai"),("Maharashtra","Pune"),("Maharashtra","Nagpur"),
    ("Karnataka","Bengaluru"),("Karnataka","Mysuru"),("Karnataka","Hubli"),
    ("Tamil Nadu","Chennai"),("Tamil Nadu","Coimbatore"),("Tamil Nadu","Madurai"),
    ("Uttar Pradesh","Lucknow"),("Uttar Pradesh","Agra"),("Uttar Pradesh","Kanpur"),
    ("Gujarat","Ahmedabad"),("Gujarat","Surat"),("Gujarat","Vadodara"),
    ("Rajasthan","Jaipur"),("Rajasthan","Jodhpur"),("Rajasthan","Udaipur"),
    ("West Bengal","Kolkata"),("West Bengal","Durgapur"),("West Bengal","Siliguri"),
    ("Telangana","Hyderabad"),("Telangana","Warangal"),
    ("Madhya Pradesh","Bhopal"),("Madhya Pradesh","Indore"),
    ("Punjab","Chandigarh"),("Punjab","Ludhiana"),("Punjab","Amritsar"),
    ("Bihar","Patna"),("Bihar","Gaya"),
    ("Kerala","Kochi"),("Kerala","Thiruvananthapuram"),
    ("Andhra Pradesh","Visakhapatnam"),("Andhra Pradesh","Vijayawada"),
]

DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
MODES = ["In-Person","Video Call","Phone Call","WhatsApp Consultation","Email Consultation"]

ACHIEVEMENT_TEMPLATES = [
    {"title": "Supreme Court Victory", "desc": "Successfully represented client in a landmark {spec} case at the Supreme Court of India, setting a precedent for future cases."},
    {"title": "High Court Acquittal", "desc": "Secured full acquittal for the client in a complex {spec} matter at the High Court after 3 years of litigation."},
    {"title": "Legal500 India Recognition", "desc": "Recognized in Legal500 India's list of Leading Lawyers in {spec} for outstanding client outcomes."},
    {"title": "Record Settlement", "desc": "Negotiated a record ₹{amt} crore settlement in a high-stakes {spec} dispute, saving years of litigation."},
    {"title": "Government Empanelment", "desc": "Empanelled as panel advocate for Government of India in {spec} matters, handling 50+ state cases annually."},
    {"title": "Pro Bono Award", "desc": "Received the State Bar Council Pro Bono Award for providing free legal aid in 100+ {spec} cases for underprivileged clients."},
    {"title": "Bar Council Committee Member", "desc": "Elected as a committee member of the State Bar Council's {spec} subcommittee, contributing to policy reform."},
    {"title": "District Court Record", "desc": "Achieved a 95% success rate in {spec} matters across {dist} district courts spanning 5 years."},
    {"title": "Published Legal Author", "desc": "Co-authored a widely cited research paper on {spec} reforms published in the Indian Law Review."},
    {"title": "International Arbitration Win", "desc": "Won a complex cross-border {spec} arbitration case worth USD 2 million before the ICC tribunal."},
    {"title": "PSU Empanelment", "desc": "Empanelled as standing counsel for a Public Sector Undertaking in {spec} matters, handling 200+ cases annually."},
    {"title": "Consumer Forum Champion", "desc": "Filed and won 300+ consumer rights cases in {spec} matters, recovering over ₹5 crore for aggrieved consumers."},
    {"title": "Landmark Bail Win", "desc": "Secured bail for a high-profile client in a sensational {spec} case within 48 hours of arrest."},
    {"title": "NALSA Panel Advocate", "desc": "Designated NALSA panel advocate providing free legal services in {spec} and related matters across the state."},
    {"title": "Corporate Counsel Experience", "desc": "Served as in-house legal counsel for a Fortune 500 company handling {spec} compliance, M&A, and dispute resolution."},
    {"title": "Mediation Excellence", "desc": "Certified Mediator (IIAM) with 98% settlement rate in {spec} disputes through pre-litigation mediation."},
    {"title": "Property Recovery Specialist", "desc": "Successfully recovered disputed property worth ₹{amt} crore in a {spec} matter through innovative legal strategy."},
    {"title": "Contempt Proceedings Won", "desc": "Won contempt of court proceedings ensuring compliance with court orders in critical {spec} cases."},
    {"title": "Division Bench Victory", "desc": "Argued and won a landmark appeal before a Division Bench on a constitutional question in {spec} law."},
    {"title": "Legal Aid Camp Organiser", "desc": "Organised 20+ legal aid camps in rural districts, providing free consultation in {spec} matters to 5,000+ people."},
]

BIOS = [
    "{name} is a distinguished {spec} attorney based in {city} with {exp} years of extensive courtroom and advisory experience. Known for meticulous case preparation and strong advocacy skills, {pronoun} has represented clients ranging from individuals to multinational corporations. {name} combines deep legal knowledge with practical strategic thinking to deliver optimal results.",
    "With {exp} years of dedicated practice in {spec}, {name} has established a reputation as one of {city}'s most trusted legal advocates. {pronoun_cap} approach is client-first — every case receives personalised attention and a tailored legal strategy. Prior to independent practice, {name} clerked at the {court}.",
    "{name} brings {exp} years of specialised expertise in {spec} to every case. Operating out of {city}, {pronoun} has successfully handled hundreds of complex matters at the district, high court, and supreme court levels. {name}'s clients appreciate both the legal acumen and the clear, honest communication throughout the process.",
    "Founding practitioner at {name}'s Chambers in {city}, with a focus on {spec} and allied practice areas. {exp_plus} years of experience have equipped {name} with a comprehensive understanding of the evolving legal landscape. Regularly invited as a speaker at bar association seminars and law school events.",
    "{name} is a results-driven {spec} lawyer who combines deep jurisprudential knowledge with practical courtroom skills. Having argued before the {court} and district courts across {state}, {pronoun} brings a multi-jurisdictional perspective to every brief. Clients value the responsive, transparent service and track record of success.",
]

def fname(g):
    fn = random.choice(FIRST_M if g=="M" else FIRST_F)
    return f"{fn} {random.choice(LAST)}"

def bar_num(s):
    sc = {"Delhi":"DL","Maharashtra":"MH","Karnataka":"KA","Tamil Nadu":"TN","Uttar Pradesh":"UP","Gujarat":"GJ","Rajasthan":"RJ","West Bengal":"WB","Telangana":"TG","Madhya Pradesh":"MP","Punjab":"PB","Bihar":"BR","Kerala":"KL","Andhra Pradesh":"AP"}.get(s,"IN")
    return f"BAR/{sc}/{random.randint(1000,9999)}/{random.randint(2000,2022)}"

def make_achievements(spec, n=3):
    chosen = random.sample(ACHIEVEMENT_TEMPLATES, n)
    result = []
    for a in chosen:
        result.append({
            "id": uid(),
            "title": a["title"],
            "description": a["desc"].format(spec=spec, amt=random.randint(1,20), dist=pick("district","sessions","civil")),
            "year": str(random.randint(2010, 2025)),
            "photo": None,
        })
    return result

async def main():
    print("🗑  Deleting existing lawyers...")
    r = await db.users.delete_many({"user_type":"lawyer"})
    print(f"   Deleted {r.deleted_count} lawyers")

    docs = []
    for i in range(50):
        g   = pick("M","F")
        name = fname(g)
        pron = "he" if g=="M" else "she"
        pron_cap = "He" if g=="M" else "She"
        s, c = random.choice(STATE_CITY)
        exp  = random.randint(2, 32)
        spec = pick(*SPECS)
        sec_specs = picks([x for x in ALL_SPECS if x != spec], random.randint(1,3))
        prac_areas = list(set([spec] + sec_specs + picks(ALL_SPECS, random.randint(0,2))))[:5]
        avail = picks(DAYS, random.randint(3,6))
        modes = picks(MODES, random.randint(2,4))
        fee_min = random.choice([500,1000,1500,2000,3000])
        fee_max = fee_min + random.choice([500,1000,2000,3000,5000])
        app_type = pick(["normal"],["sos"],["normal","sos"])
        sos = "sos" in app_type
        court_list = picks(COURTS, random.randint(1,3))
        bio_tmpl = random.choice(BIOS)
        bio = bio_tmpl.format(
            name=name, spec=spec, city=c, exp=exp, exp_plus=exp+2,
            pronoun=pron, pronoun_cap=pron_cap, court=pick(*COURTS), state=s
        )
        docs.append({
            # Identity
            "id": uid(), "unique_id": f"LAW{2001+i}",
            "full_name": name, "name": name,
            "email": f"{name.lower().replace(' ','.')}{i}@lxwyerup.com",
            "password": hpwd("lawyer@1234"),
            "phone": f"+91{random.randint(7000000000,9999999999)}",
            "gender": g,
            "user_type": "lawyer",
            # Profile display fields
            "photo": None,  # no photo — UI shows gradient avatar
            "bio": bio,
            "about": bio,
            "location": f"{c}, {s}",
            "city": c, "state": s,
            "pincode": str(random.randint(100000,999999)),
            "address": f"Chamber {random.randint(1,80)}, {c} Bar Association Building, {s}",
            "office_address": f"Chamber {random.randint(1,80)}, {c} Bar Association Building, {s}",
            # Legal credentials
            "specialization": spec,
            "secondarySpecializations": sec_specs,
            "practice_areas": prac_areas,
            "experience_years": exp, "experience": exp,
            "education": pick(*EDUS),
            "bar_council_number": bar_num(s),
            "barCouncilNumber": bar_num(s),
            "court": court_list,
            "primary_court": pick(*COURTS),
            "languages": picks(LANGS, random.randint(2,5)),
            # Fees
            "fee_range": f"₹{fee_min:,}–₹{fee_max:,}",
            "feeMin": fee_min, "feeMax": fee_max,
            "charge_30min": str(fee_min),
            "charge_60min": str(fee_max),
            "consultation_fee": f"₹{fee_min} (30 min)",
            # Consultation
            "consultationModes": modes,
            "consultation_types": modes,
            "consultation_preferences": pick("online","offline","both"),
            "availability": avail,
            "available_slots": [f"{d} 10:00-18:00" for d in avail],
            # Achievements - ARRAY OF OBJECTS (what the UI renders)
            "achievements": make_achievements(spec, random.randint(2,4)),
            # Stats
            "rating": round(random.uniform(3.6,5.0), 1),
            "total_ratings": random.randint(12, 600),
            "cases_won": random.randint(exp*4, exp*25),
            "total_cases": random.randint(exp*6, exp*30),
            "cases_lost": random.randint(0, exp*5),
            "clients_served": random.randint(exp*8, exp*40),
            # SOS
            "application_type": app_type,
            "sos_locations": [c, s] if sos else [],
            "sos_matters": picks(["Bail Application","Domestic Violence","Child Custody","Criminal Defence","Property Dispute","Cheque Bounce","Accident Claim"], random.randint(2,4)) if sos else [],
            "sos_terms_accepted": sos,
            # Status
            "is_approved": True, "is_verified": True, "account_status": "active",
            "featured": random.random() < 0.3,  # 30% are featured
            # Social / Contact
            "linkedin_url": f"https://linkedin.com/in/{name.lower().replace(' ','-')}-{random.randint(100,999)}",
            "website": f"https://www.{name.lower().replace(' ','')[:10]}{i}.com" if random.random() < 0.4 else None,
            # Timestamps
            "practice_start_date": f"{2024-exp}-{random.randint(1,12):02d}-01",
            "created_at": (datetime.now(timezone.utc)-timedelta(days=random.randint(60,730))).isoformat(),
            "last_login": (datetime.now(timezone.utc)-timedelta(days=random.randint(0,15))).isoformat(),
        })

    await db.users.insert_many(docs)
    print(f"✅ Inserted {len(docs)} fully enriched lawyers")
    print("\nSample achievements from first lawyer:")
    for a in docs[0]["achievements"]:
        print(f"  • {a['title']}: {a['description'][:80]}...")
    print(f"\nfeatured lawyers: {sum(1 for d in docs if d['featured'])}/50")
    print(f"SOS lawyers: {sum(1 for d in docs if 'sos' in d['application_type'])}/50")

if __name__ == "__main__":
    asyncio.run(main())
