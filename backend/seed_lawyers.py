#!/usr/bin/env python3
"""Seed 20 approved lawyers into local MongoDB for Lxwyer Up."""
import asyncio, os, sys, uuid
from pathlib import Path
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
sys.path.insert(0, str(ROOT_DIR))
from dotenv import load_dotenv
load_dotenv(ROOT_DIR / '.env')

from motor.motor_asyncio import AsyncIOMotorClient
from services.auth import hash_password

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'lxwyerup')
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

LAWYERS = [
    {"full_name": "Rajesh Sharma", "email": "rajesh.sharma@lxwyer.com", "specialization": ["Criminal Law"], "state": "Delhi", "city": "New Delhi", "court": ["Delhi High Court"], "experience_years": 15, "consultation_fee": 3000, "bio": "Senior criminal law expert with 15 years handling high-profile cases in Delhi courts.", "education": "LLB, LLM from Delhi University", "languages": ["Hindi", "English"], "bar_council_number": "DL/1234/2009", "photo": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400"},
    {"full_name": "Priya Verma", "email": "priya.verma@lxwyer.com", "specialization": ["Family Law"], "state": "Delhi", "city": "South Delhi", "court": ["Saket Courts Complex"], "experience_years": 10, "consultation_fee": 2500, "bio": "Compassionate family law specialist helping clients through divorce, custody and inheritance matters.", "education": "BA LLB from NALSAR", "languages": ["Hindi", "English", "Punjabi"], "bar_council_number": "DL/5678/2014", "photo": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"},
    {"full_name": "Amit Gupta", "email": "amit.gupta@lxwyer.com", "specialization": ["Corporate Law"], "state": "Haryana", "city": "Gurugram", "court": ["Punjab and Haryana High Court"], "experience_years": 12, "consultation_fee": 5000, "bio": "Top corporate lawyer advising startups, SMEs and Fortune 500 companies in Gurugram.", "education": "LLB, LLM from NLS Bangalore", "languages": ["English", "Hindi"], "bar_council_number": "HR/1001/2012", "photo": "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=400"},
    {"full_name": "Neha Singh", "email": "neha.singh@lxwyer.com", "specialization": ["Property Law"], "state": "Uttar Pradesh", "city": "Lucknow", "court": ["Allahabad High Court - Lucknow Bench"], "experience_years": 8, "consultation_fee": 2000, "bio": "Property law expert in UP, handling land disputes, RERA cases and documentation.", "education": "LLB from Lucknow University", "languages": ["Hindi", "English", "Urdu"], "bar_council_number": "UP/2002/2016", "photo": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400"},
    {"full_name": "Vikram Malhotra", "email": "vikram.malhotra@lxwyer.com", "specialization": ["Tax Law"], "state": "Delhi", "city": "Central Delhi", "court": ["Delhi High Court"], "experience_years": 20, "consultation_fee": 6000, "bio": "Twenty years of tax litigation experience. Expert in GST, income tax and corporate tax matters.", "education": "LLB, LLM from Delhi University", "languages": ["English", "Hindi"], "bar_council_number": "DL/3001/2004", "photo": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400"},
    {"full_name": "Sunita Kapoor", "email": "sunita.kapoor@lxwyer.com", "specialization": ["Consumer Law"], "state": "Haryana", "city": "Faridabad", "court": ["District Court Faridabad"], "experience_years": 7, "consultation_fee": 1800, "bio": "Consumer rights champion with strong track record against brands for defective goods and services.", "education": "BA LLB from Amity University", "languages": ["Hindi", "English"], "bar_council_number": "HR/3040/2017", "photo": "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=400"},
    {"full_name": "Arun Agarwal", "email": "arun.agarwal@lxwyer.com", "specialization": ["Labour Law"], "state": "Uttar Pradesh", "city": "Kanpur Nagar", "court": ["Allahabad High Court"], "experience_years": 14, "consultation_fee": 2200, "bio": "Experienced labour and employment attorney, handling wrongful termination and workplace disputes.", "education": "LLB from Kanpur University", "languages": ["Hindi", "English"], "bar_council_number": "UP/1050/2010", "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"},
    {"full_name": "Kavita Jain", "email": "kavita.jain@lxwyer.com", "specialization": ["Constitutional Law"], "state": "Delhi", "city": "North Delhi", "court": ["Delhi High Court", "Tis Hazari Courts Complex"], "experience_years": 18, "consultation_fee": 7000, "bio": "Constitutional and public interest litigator. Argued landmark cases in Delhi High Court and Supreme Court.", "education": "LLB, LLM from NLSIU", "languages": ["English", "Hindi", "Bengali"], "bar_council_number": "DL/2201/2006", "photo": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400"},
    {"full_name": "Sanjay Patel", "email": "sanjay.patel@lxwyer.com", "specialization": ["Intellectual Property"], "state": "Haryana", "city": "Gurugram", "court": ["Punjab and Haryana High Court"], "experience_years": 11, "consultation_fee": 4500, "bio": "IP attorney specialising in trademarks, patents, copyrights and technology law for startups.", "education": "LLB from Gujarat University", "languages": ["English", "Hindi", "Gujarati"], "bar_council_number": "HR/4120/2013", "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"},
    {"full_name": "Meera Shah", "email": "meera.shah@lxwyer.com", "specialization": ["Cyber Law"], "state": "Delhi", "city": "South East Delhi", "court": ["Patiala House Courts Complex"], "experience_years": 6, "consultation_fee": 3500, "bio": "Cyber law and data privacy expert. Handles IT Act cases, online fraud and cybersecurity compliance.", "education": "BA LLB, LLM from Symbiosis", "languages": ["English", "Hindi", "Marathi"], "bar_council_number": "DL/6010/2018", "photo": "https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&q=80&w=400"},
    {"full_name": "Rahul Pandey", "email": "rahul.pandey@lxwyer.com", "specialization": ["Criminal Law"], "state": "Uttar Pradesh", "city": "Varanasi", "court": ["District Court Varanasi", "Allahabad High Court"], "experience_years": 16, "consultation_fee": 2800, "bio": "Criminal defence attorney in Varanasi with extensive trial experience in sessions and high courts.", "education": "LLB from BHU Varanasi", "languages": ["Hindi", "Bhojpuri", "English"], "bar_council_number": "UP/5500/2008", "photo": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"},
    {"full_name": "Anjali Khanna", "email": "anjali.khanna@lxwyer.com", "specialization": ["Family Law", "Property Law"], "state": "Delhi", "city": "West Delhi", "court": ["Rohini Courts Complex", "Tis Hazari Courts Complex"], "experience_years": 9, "consultation_fee": 2000, "bio": "Holistic family and property lawyer. Expert in matrimonial disputes, will drafting and property transfers.", "education": "LLB from IP University", "languages": ["Hindi", "English", "Punjabi"], "bar_council_number": "DL/7823/2015", "photo": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"},
    {"full_name": "Deepak Reddy", "email": "deepak.reddy@lxwyer.com", "specialization": ["Banking Law"], "state": "Delhi", "city": "Connaught Place", "court": ["Delhi High Court"], "experience_years": 13, "consultation_fee": 5500, "bio": "Banking and financial sector lawyer. Expert in NPA resolution, loan recovery and RBI compliance.", "education": "LLB, LLM from NLIU", "languages": ["English", "Hindi", "Telugu"], "bar_council_number": "DL/8901/2011", "photo": "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400"},
    {"full_name": "Pooja Mishra", "email": "pooja.mishra@lxwyer.com", "specialization": ["Environmental Law"], "state": "Uttar Pradesh", "city": "Prayagraj", "court": ["Allahabad High Court"], "experience_years": 10, "consultation_fee": 2400, "bio": "Environment law advocate representing NGT matters, pollution control cases and forest rights.", "education": "LLB from Allahabad University", "languages": ["Hindi", "English"], "bar_council_number": "UP/9050/2014", "photo": "https://images.unsplash.com/photo-1548532928-b34e3be62fc6?auto=format&fit=crop&q=80&w=400"},
    {"full_name": "Suresh Bhatia", "email": "suresh.bhatia@lxwyer.com", "specialization": ["Civil Law"], "state": "Haryana", "city": "Rohtak", "court": ["Punjab and Haryana High Court", "District Court Rohtak"], "experience_years": 22, "consultation_fee": 3200, "bio": "Civil litigation veteran with over two decades resolving contract disputes, damages claims and injunctions.", "education": "LLB from Rohtak University", "languages": ["Hindi", "Haryanvi", "English"], "bar_council_number": "HR/1502/2002", "photo": "https://images.unsplash.com/photo-1554151228-14d9def656ec?auto=format&fit=crop&q=80&w=400"},
    {"full_name": "Rekha Chopra", "email": "rekha.chopra@lxwyer.com", "specialization": ["Medical Negligence"], "state": "Delhi", "city": "South Delhi", "court": ["Delhi High Court", "Saket Courts Complex"], "experience_years": 17, "consultation_fee": 6500, "bio": "Medical legal expert specialising in malpractice claims, insurance disputes and compensation cases.", "education": "LLB, LLM from Delhi University", "languages": ["Hindi", "English"], "bar_council_number": "DL/0234/2007", "photo": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400"},
    {"full_name": "Vivek Bansal", "email": "vivek.bansal@lxwyer.com", "specialization": ["Immigration Law"], "state": "Delhi", "city": "East Delhi", "court": ["Delhi High Court", "Karkardooma Courts Complex"], "experience_years": 12, "consultation_fee": 4000, "bio": "Immigration and visa specialist helping individuals and companies with overseas migration, PR and citizenship.", "education": "BA LLB from NLIU Bhopal", "languages": ["English", "Hindi"], "bar_council_number": "DL/4400/2012", "photo": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400"},
    {"full_name": "Anita Yadav", "email": "anita.yadav@lxwyer.com", "specialization": ["Labour Law", "Consumer Law"], "state": "Uttar Pradesh", "city": "Agra", "court": ["District Court Agra", "Allahabad High Court"], "experience_years": 8, "consultation_fee": 1600, "bio": "Labour rights and consumer protection lawyer in Agra. Strong advocate for employee welfare and consumer justice.", "education": "LLB from Agra University", "languages": ["Hindi", "Braj", "English"], "bar_council_number": "UP/3330/2016", "photo": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400"},
    {"full_name": "Manish Saxena", "email": "manish.saxena@lxwyer.com", "specialization": ["Corporate Law", "Tax Law"], "state": "Haryana", "city": "Panchkula", "court": ["Punjab and Haryana High Court", "District Court Panchkula"], "experience_years": 19, "consultation_fee": 7500, "bio": "Dual-qualified corporate and tax attorney. Advises MNCs on M&A, regulatory filings and transfer pricing.", "education": "LLB, LLM from NLS Bangalore", "languages": ["English", "Hindi"], "bar_council_number": "HR/2211/2005", "photo": "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=400"},
    {"full_name": "Seema Tiwari", "email": "seema.tiwari@lxwyer.com", "specialization": ["Property Law", "Civil Law"], "state": "Uttar Pradesh", "city": "Meerut", "court": ["District Court Meerut", "Allahabad High Court"], "experience_years": 11, "consultation_fee": 1900, "bio": "Property and civil litigation attorney in Meerut. Handles land acquisition, mutation and partition suits.", "education": "LLB from Meerut University", "languages": ["Hindi", "English"], "bar_council_number": "UP/7700/2013", "photo": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400"},
]

async def seed():
    print("🌱 Seeding 20 approved lawyers...")
    # Remove old seeded lawyers
    await db.users.delete_many({"email": {"$in": [l["email"] for l in LAWYERS]}})
    now = datetime.now(timezone.utc)
    count = 0
    for l in LAWYERS:
        doc = {
            "id": str(uuid.uuid4()),
            "user_type": "lawyer",
            "full_name": l["full_name"],
            "email": l["email"],
            "password": hash_password("demo123"),
            "phone": "+91 9876543210",
            "is_approved": True,
            "status": "approved",
            "is_verified": True,
            "specialization": l["specialization"],
            "state": l["state"],
            "city": l["city"],
            "court": l["court"],
            "experience_years": l["experience_years"],
            "consultation_fee": l["consultation_fee"],
            "fee_range": f"₹{l['consultation_fee']:,}",
            "bio": l["bio"],
            "education": l["education"],
            "languages": l["languages"],
            "bar_council_number": l["bar_council_number"],
            "photo": l["photo"],
            "consultation_types": ["Video Call", "In-Person"],
            "consultation_preferences": "both",
            "rating": round(4.5 + (count % 5) * 0.1, 1),
            "cases_won": 50 + count * 7,
            "created_at": now,
            "unique_id": f"LXW{1000 + count:04d}",
        }
        await db.users.insert_one(doc)
        count += 1
        print(f"  ✅ {l['full_name']}")
    print(f"\n✅ Done! {count} approved lawyers seeded.")
    client.close()

asyncio.run(seed())
