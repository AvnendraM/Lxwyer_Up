import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
from datetime import datetime, timedelta, timezone
import random

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client.lxwyerup

# Simple bcrypt fallback if passlib isn't available
import bcrypt

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

# Mock data
LAWYERS_DATA = [
    {
        "full_name": "Arjun Kapoor",
        "email": "arjun.normal@example.com",
        "specialization": "Corporate Law",
        "city": "Mumbai",
        "state": "Maharashtra",
        "experience_years": 12,
        "is_signature": False,
        "signature_status": None,
        "is_sos": False,
        "sos_status": None,
        "bio": "Expert in corporate structuring.",
        "photo": "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop"
    },
    {
        "full_name": "Priya Sharma",
        "email": "priya.signature@example.com",
        "specialization": "Intellectual Property",
        "city": "Delhi",
        "state": "Delhi",
        "experience_years": 15,
        "is_signature": True,
        "signature_status": "approved",
        "signature_tier": True,
        "is_sos": False,
        "sos_status": None,
        "bio": "Top-tier IP lawyer with international experience.",
        "photo": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
    },
    {
        "full_name": "Vikram Singh",
        "email": "vikram.sos@example.com",
        "specialization": "Criminal Law",
        "city": "Bangalore",
        "state": "Karnataka",
        "experience_years": 8,
        "is_signature": False,
        "signature_status": None,
        "is_sos": True,
        "sos_status": "active",
        "bio": "Aggressive defense attorney available 24/7.",
        "photo": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop"
    },
    {
        "full_name": "Anita Verma",
        "email": "anita.normalsos@example.com",
        "specialization": "Family Law",
        "city": "Pune",
        "state": "Maharashtra",
        "experience_years": 10,
        "is_signature": False,
        "signature_status": None,
        "is_sos": True,
        "sos_status": "active",
        "bio": "Compassionate family lawyer handling emergency custody.",
        "photo": "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop"
    },
    {
        "full_name": "Sanjay Mehta",
        "email": "sanjay.sigsos@example.com",
        "specialization": "Civil Rights",
        "city": "Hyderabad",
        "state": "Telangana",
        "experience_years": 20,
        "is_signature": True,
        "signature_status": "approved",
        "signature_tier": True,
        "is_sos": True,
        "sos_status": "active",
        "bio": "Renowned civil rights advocate handling high-profile emergencies.",
        "photo": "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=200&auto=format&fit=crop"
    }
]

CLIENTS_DATA = [
    {"full_name": f"Client User {i}", "email": f"client{i}@example.com"} for i in range(1, 11)
]

async def seed_data():
    pwd = hash_password("password123")
    
    # 1. Clear old seeded data
    await db.users.delete_many({"email": {"$regex": "@example.com"}})
    await db.bookings.delete_many({"description": {"$regex": "Seeded booking"}})
    
    print("Clearing old dummy DB records...")

    lawyer_docs = []
    # 2. Insert Lawyers
    for l in LAWYERS_DATA:
        doc = {
            "id": str(uuid.uuid4()),
            "email": l["email"],
            "password": pwd,
            "full_name": l["full_name"],
            "user_type": "lawyer",
            "specialization": l["specialization"],
            "city": l["city"],
            "state": l["state"],
            "experience_years": l["experience_years"],
            "is_signature": l["is_signature"],
            "signature_status": l["signature_status"],
            "signature_tier": l.get("signature_tier", False),
            "is_sos": l["is_sos"],
            "sos_status": l["sos_status"],
            "bio": l["bio"],
            "photo": l["photo"],
            "status": "active",
            "created_at": datetime.now(timezone.utc)
        }
        await db.users.insert_one(doc)
        lawyer_docs.append(doc)
        print(f"Created Lawyer: {l['full_name']} ({l['email']})")

    # 3. Insert Clients
    client_docs = []
    for c in CLIENTS_DATA:
        doc = {
            "id": str(uuid.uuid4()),
            "email": c["email"],
            "password": pwd,
            "full_name": c["full_name"],
            "user_type": "client",
            "created_at": datetime.now(timezone.utc)
        }
        await db.users.insert_one(doc)
        client_docs.append(doc)
        print(f"Created Client: {c['full_name']} ({c['email']})")

    # 4. Insert Bookings for next 30 days
    now = datetime.now(timezone.utc)
    statuses = ["pending", "confirmed", "completed"]
    
    booking_count = 0
    for lawyer in lawyer_docs:
        # 15-20 bookings per lawyer
        num_bookings = random.randint(15, 20)
        for _ in range(num_bookings):
            client = random.choice(client_docs)
            # Random day between -5 to +30 days
            days_offset = random.randint(-5, 30)
            booking_date = now + timedelta(days=days_offset)
            hour = random.randint(9, 17)
            minute = random.choice([0, 30])
            
            # Formatting
            date_str = booking_date.strftime("%Y-%m-%d")
            time_str = f"{hour:02d}:{minute:02d}"
            
            # Past bookings should be completed, future ones pending/confirmed
            if days_offset < 0:
                status = "completed"
            else:
                status = random.choice(["pending", "confirmed"])
            
            b_doc = {
                "id": str(uuid.uuid4()),
                "client_id": client["id"],
                "lawyer_id": lawyer["id"],
                "lawyer_name": lawyer["full_name"],
                "lawyer_photo": lawyer.get("photo", ""),
                "consultation_fee": 2500.0,
                "date": date_str,
                "time": time_str,
                "description": f"Seeded booking for {lawyer['specialization']} consultation.",
                "price": 2500.0,
                "meet_link": f"https://meet.google.com/abc-defg-{random.randint(100,999)}",
                "duration_minutes": 30,
                "is_free_trial": False,
                "consultation_type": "video",
                "status": status,
                "created_at": now
            }
            await db.bookings.insert_one(b_doc)
            booking_count += 1
            
    print(f"Inserted {booking_count} bookings.")
    print("Done! All passwords are: password123")

if __name__ == "__main__":
    asyncio.run(seed_data())
