import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.lxwyerup
    
    # Update notifications that missed the refund info
    result = await db.notifications.update_many(
        {"type": "booking_cancelled", "message": {"$not": {"$regex": "refunded"}}},
        [{"$set": {"message": {"$concat": ["$message", " (when it is cancelled money will be refunded in 24 hrs)"]}}}]
    )
    print(f"Updated {result.modified_count} notifications")

if __name__ == "__main__":
    asyncio.run(main())
