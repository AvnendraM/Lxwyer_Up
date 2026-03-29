import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_db():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.lxwyerup
    
    # Check explicitly for avn1@gmail.com
    user = await db.users.find_one({'email': 'avn1@gmail.com'})
    if user:
        print('avn1@gmail.com achievements:', user.get('achievements'))
    else:
        print('User avn1@gmail.com not found')

if __name__ == '__main__':
    asyncio.run(check_db())
