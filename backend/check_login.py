import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
import sys

# add parent dir so we can import services
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from services.auth import verify_password

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client.lxwyerup_db

async def check():
    email = "arjun.normal@example.com"
    password = "password123"
    user = await db.users.find_one({"email": email}, {"_id": 0})
    if not user:
        print("User not found!")
        return
        
    pw_field = user.get("password_hash") or user.get("password")
    if not pw_field:
        print("No password field found!")
        return
        
    is_valid = verify_password(password, pw_field)
    print(f"Password field: {pw_field}")
    print(f"Is valid: {is_valid}")
    
    app = await db.lawyer_applications.find_one({"email": email})
    print(f"App status: {app.get('status') if app else 'No app'}")

if __name__ == "__main__":
    asyncio.run(check())
