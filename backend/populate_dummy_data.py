#!/usr/bin/env python3
"""
Populate Database with Dummy Data for Nyaay Sathi
Creates demo accounts and standard dummy data.
"""

import asyncio
import os
import sys
from pathlib import Path
from datetime import datetime, timezone, timedelta
import uuid
import random
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Add backend to path
ROOT_DIR = Path(__file__).parent
sys.path.insert(0, str(ROOT_DIR))

load_dotenv(ROOT_DIR / '.env')

from services.auth import hash_password

# Database connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'test_database')
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Specific Demo Accounts
DEMO_ACCOUNTS = {
    "user": {
        "id": "dummy_user_1",
        "email": "demo@user.com",
        "password": "demo123",
        "full_name": "Demo User",
        "user_type": "client",
        "phone": "+91 9000000001"
    },
    "lawyer": {
        "id": "dummy_lawyer_1",
        "email": "demo@lawyer.com",
        "password": "demo123",
        "full_name": "Demo Lawyer",
        "user_type": "lawyer",
        "phone": "+91 9000000002",
        "specialization": "Criminal Law",
        "experience_years": 10,
        "city": "Delhi",
        "state": "Delhi",
        "office_address": "Chamber 405, Delhi High Court, Sher Shah Road, New Delhi, 110003",
        "is_approved": True
    },
    "law_firm": {
        "id": "dummy_firm_1",
        "email": "demo@firm.com",
        "password": "demo123",
        "firm_name": "Demo Law Firm",
        "full_name": "Demo Law Firm",
        "user_type": "law_firm",
        "phone": "+91 9000000003",
        "city": "Mumbai",
        "state": "Maharashtra",
        "is_approved": True,
        "specialization": ["Corporate Law", "Civil Law"]
    },
    "firm_lawyer": {
        "id": "dummy_firm_lawyer_1",
        "email": "demo@employee.com",
        "password": "demo123",
        "full_name": "Demo Firm Lawyer",
        "user_type": "firm_lawyer",
        "phone": "+91 9000000004",
        "firm_id": "dummy_firm_1",
        "firm_name": "Demo Law Firm",
        "is_active": True,
        "is_approved": True
    },
    "firm_client": {
        "id": "dummy_firm_client_1",
        "email": "demo@client.com",
        "password": "demo123",
        "full_name": "Demo Firm Client",
        "user_type": "firm_client", # This usually maps to 'client' but managed by firm
        "phone": "+91 9000000005"
        # Note: firm_client logic might differ, usually they are users with a firm relationship
    }
}


async def clear_existing_data():
    """Clear existing dummy data"""
    print("🗑️  Clearing existing data...")
    # Delete users with demo emails or dummy IDs
    await db.users.delete_many({
        "$or": [
            {"email": {"$regex": "^demo@"}},
            {"id": {"$regex": "^dummy_"}}
        ]
    })
    await db.lawyer_applications.delete_many({"id": {"$regex": "^dummy_"}})
    await db.lawfirm_applications.delete_many({"id": {"$regex": "^dummy_"}})
    await db.firm_lawyer_applications.delete_many({"id": {"$regex": "^dummy_"}})
    await db.firm_clients.delete_many({"id": {"$regex": "^dummy_"}})
    await db.cases.delete_many({"id": {"$regex": "^dummy_"}})
    await db.users.delete_many({"email": {"$regex": ".*@generated律师.com"}}) # Clean up old diverse lawyers
    print("✅ Existing demo data cleared")


async def create_demo_accounts():
    """Create specific demo accounts"""
    print("\n👤 Creating Demo Accounts...")
    
    # 1. Demo User
    user = DEMO_ACCOUNTS["user"]
    await db.users.insert_one({
        "id": user["id"],
        "email": user["email"],
        "password": hash_password(user["password"]),
        "full_name": user["full_name"],
        "user_type": user["user_type"],
        "phone": user["phone"],
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    print(f"   ✅ Created User: {user['email']} / {user['password']}")

    # 2. Demo Lawyer
    lawyer = DEMO_ACCOUNTS["lawyer"]
    await db.users.insert_one({
        "id": lawyer["id"],
        "email": lawyer["email"],
        "password": hash_password(lawyer["password"]),
        "full_name": lawyer["full_name"],
        "user_type": lawyer["user_type"],
        "phone": lawyer["phone"],
        "specialization": lawyer["specialization"],
        "experience_years": lawyer["experience_years"],
        "city": lawyer["city"],
        "state": lawyer["state"],
        "is_approved": lawyer["is_approved"],
        "consultation_preferences": random.choice(["video", "both"]),
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    print(f"   ✅ Created Lawyer: {lawyer['email']} / {lawyer['password']}")

    # 3. Demo Law Firm
    firm = DEMO_ACCOUNTS["law_firm"]
    await db.users.insert_one({
        "id": firm["id"],
        "email": firm["email"],
        "password": hash_password(firm["password"]),
        "full_name": firm["firm_name"], # For consistency
        "firm_name": firm["firm_name"],
        "user_type": firm["user_type"],
        "phone": firm["phone"],
        "city": firm["city"],
        "state": firm["state"],
        "specialization": firm["specialization"],
        "is_approved": firm["is_approved"],
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    print(f"   ✅ Created Law Firm: {firm['email']} / {firm['password']}")

    # 4. Demo Firm Lawyer
    firm_lawyer = DEMO_ACCOUNTS["firm_lawyer"]
    await db.users.insert_one({
        "id": firm_lawyer["id"],
        "email": firm_lawyer["email"],
        "password": hash_password(firm_lawyer["password"]),
        "full_name": firm_lawyer["full_name"],
        "user_type": firm_lawyer["user_type"],
        "phone": firm_lawyer["phone"],
        "firm_id": firm_lawyer["firm_id"],
        "firm_name": firm_lawyer["firm_name"],
        "is_active": firm_lawyer["is_active"],
        "is_approved": firm_lawyer["is_approved"],
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    print(f"   ✅ Created Firm Lawyer: {firm_lawyer['email']} / {firm_lawyer['password']}")

    # 5. Demo Firm Client (User + Firm Client Relationship)
    # First create the user account for the client
    client_defs = DEMO_ACCOUNTS["firm_client"]
    client_user_id = "dummy_user_client_1" # distinct from the main dummy user
    await db.users.insert_one({
        "id": client_user_id,
        "email": client_defs["email"],
        "password": hash_password(client_defs["password"]),
        "full_name": client_defs["full_name"],
        "user_type": "client",
        "phone": client_defs["phone"],
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Then create the relationship
    await db.firm_clients.insert_one({
        "id": client_defs["id"],
        "client_id": client_user_id,
        "full_name": client_defs["full_name"],
        "email": client_defs["email"],
        "phone": client_defs["phone"],
        "law_firm_id": firm["id"],
        "law_firm_name": firm["firm_name"],
        "case_type": "Corporate Law",
        "assigned_lawyer_id": firm_lawyer["id"],
        "assigned_lawyer_name": firm_lawyer["full_name"],
        "status": "active",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "approved_at": datetime.now(timezone.utc).isoformat()
    })
    print(f"   ✅ Created Firm Client: {client_defs['email']} / {client_defs['password']}")


async def create_dummy_data_for_dashboards():
    """Create cases and other data associated with dummy accounts"""
    print("\n📊 Creating Dummy Dashboard Data...")
    
    # Dummy Case for User
    await db.cases.insert_one({
        "id": "dummy_case_1",
        "client_id": "dummy_user_1",
        "client_name": "Demo User",
        "lawyer_id": "dummy_lawyer_1",
        "lawyer_name": "Demo Lawyer",
        "case_type": "Criminal Law",
        "title": "Dummy Case - State vs Demo",
        "description": "This is a dummy case for demonstration.",
        "status": "active",
        "next_hearing": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    })

    # Dummy Bookings
    bookings = [
        # Video Consultation
        {
            "id": "dummy_booking_video",
            "client_id": "dummy_user_1",
            "lawyer_id": "dummy_lawyer_1",
            "date": (datetime.now(timezone.utc) + timedelta(days=1)).strftime("%Y-%m-%d"),
            "time": "10:00 AM",
            "description": "Initial Consultation (Video)",
            "consultation_type": random.choice(["video", "in_person"]),
            "meet_link": "https://meet.google.com/abc-defg-hij",
            "location": "Google Meet",
            "status": "confirmed",
            "amount": 1000,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # Audio Consultation
        {
            "id": "dummy_booking_audio",
            "client_id": "dummy_user_1",
            "lawyer_id": "dummy_lawyer_1",
            "date": (datetime.now(timezone.utc) + timedelta(days=2)).strftime("%Y-%m-%d"),
            "time": "02:00 PM",
            "description": "Follow-up Call (Audio)",
            "consultation_type": "video",
            "location": "831216968",
            "status": "confirmed",
            "amount": 500,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # In-Person Consultation
        {
            "id": "dummy_booking_inperson",
            "client_id": "dummy_user_1",
            "lawyer_id": "dummy_lawyer_1",
            "date": (datetime.now(timezone.utc) + timedelta(days=3)).strftime("%Y-%m-%d"),
            "time": "11:00 AM",
            "description": "Office Meeting (In-Person)",
            "consultation_type": "video",
            "location": "Chamber 405, Delhi High Court, Sher Shah Road, New Delhi, 110003",
            "status": "confirmed",
            "amount": 2000,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.bookings.insert_many(bookings)
    print("   ✅ Created dummy bookings (Video, Audio, In-Person)")
    print("   ✅ Created dummy cases")


async def create_diverse_dummy_lawyers(count=100):
    """Generate and insert N diverse dummy lawyers."""
    print(f"\n👩‍⚖️👨‍⚖️ Generating {count} diverse dummy lawyers...")
    
    cities_states = [
        ("Delhi", "Delhi"), ("Gurugram", "Haryana"), ("Noida", "Uttar Pradesh"),
        ("Mumbai", "Maharashtra"), ("Pune", "Maharashtra"), ("Bangalore", "Karnataka"),
        ("Hyderabad", "Telangana"), ("Chennai", "Tamil Nadu"), ("Kolkata", "West Bengal"),
        ("Ahmedabad", "Gujarat"), ("Jaipur", "Rajasthan"), ("Lucknow", "Uttar Pradesh")
    ]
    
    specializations = [
        "Criminal Law", "Civil Law", "Family Law", "Corporate Law", "Immigration Law",
        "Intellectual Property", "Real Estate", "Tax Law", "Labor & Employment", "Personal Injury"
    ]
    
    urgent_matters_list = ["Bail", "Police Station Visit", "Medical Emergency", "Domestic Violence", "Accident/FIR"]
    
    first_names = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Riyaan", "Ayaan", "Krishna", "Ishaan",
                   "Diya", "Sanya", "Kashvi", "Avni", "Manya", "Aadhya", "Ananya", "Myra", "Kiara", "Prisha"]
    last_names = ["Sharma", "Verma", "Gupta", "Singh", "Yadav", "Patel", "Reddy", "Nair", "Iyer", "Rao", "Das", "Bose", "Jain"]

    lawyers = []
    
    locations_by_state = {
        "Delhi": ["South Delhi", "North Delhi", "Connaught Place", "Rohini", "Dwarka", "Mayur Vihar"],
        "Maharashtra": ["Andheri", "Bandra", "Colaba", "Dadar", "Juhu", "Koregaon Park", "Viman Nagar"],
        "Karnataka": ["Indiranagar", "Koramangala", "Whitefield", "Jayanagar", "Malleswaram"],
        "Haryana": ["Cyber City", "Sohna Road", "MG Road"],
        "Uttar Pradesh": ["Sector 18", "Indirapuram", "Gomti Nagar", "Hazratganj"]
    }

    for i in range(1, count + 1):
        first = random.choice(first_names)
        last = random.choice(last_names)
        full_name = f"{first} {last}"
        city, state = random.choice(cities_states)
        app_type = random.choice([["normal"], ["sos"], ["normal", "sos"]])
        
        sos_locations = []
        sos_matters = []
        sos_terms = False
        
        if "sos" in app_type:
            state_locs = locations_by_state.get(state, [f"{city} Central", f"{city} North", f"{city} South"])
            sos_locations = random.sample(state_locs, min(len(state_locs), random.randint(1, 4)))
            sos_matters = random.sample(urgent_matters_list, random.randint(1, 3))
            sos_terms = True
            
        lawyer_doc = {
            "id": f"dummy_gen_{uuid.uuid4().hex[:8]}",
            "email": f"{first.lower()}.{last.lower()}{i}@generatedlawyer.com",
            "password": hash_password("demo123"),
            "full_name": full_name,
            "user_type": "lawyer",
            "phone": f"+91 91{str(random.randint(10000000, 99999999))}",
            "specialization": random.sample(specializations, random.randint(1, 3)),
            "experience_years": random.randint(1, 25),
            "fee_range": f"{random.randint(1, 10) * 500}-{random.randint(2, 20) * 1000}",
            "city": city,
            "state": state,
            "office_address": f"Chamber {random.randint(100, 999)}, District Court {city}",
            "is_approved": True,
            "consultation_preferences": random.choice(["video", "both"]),
            "application_type": app_type,
            "sos_locations": sos_locations,
            "sos_matters": sos_matters,
            "sos_terms_accepted": sos_terms,
            "created_at": (datetime.now(timezone.utc) - timedelta(days=random.randint(0, 365))).isoformat()
        }
        lawyers.append(lawyer_doc)

    if lawyers:
        await db.users.insert_many(lawyers)
        print(f"   ✅ Successfully inserted {len(lawyers)} generated lawyers.")


async def main():
    """Main function to populate all data"""
    print("=" * 60)
    print("🚀 NYAAY SATHI - DEMO DATA POPULATION")
    print("=" * 60)
    
    try:
        await clear_existing_data()
        await create_demo_accounts()
        await create_dummy_data_for_dashboards()
        await create_diverse_dummy_lawyers(100)
        
        print("\n" + "=" * 60)
        print("✅ POPULATION COMPLETE!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(main())
