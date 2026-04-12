import asyncio
import os
import sys

# Add backend to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))

from services.database import db
from services.id_generator import generate_unique_id

async def run_migration():
    users = await db.users.find({'unique_id': {'$exists': False}}).to_list(1000)
    print(f"Found {len(users)} users lacking a unique_id.")
    
    count = 0
    for user in users:
        u_type = user.get('user_type', 'client')
        new_id = await generate_unique_id(u_type)
        
        await db.users.update_one({'id': user['id']}, {'$set': {'unique_id': new_id}})
        print(f"Assigned {new_id} to user {user.get('email', user['id'])}")
        count += 1
        
    print(f"Migration completed. Processed {count} users.")

if __name__ == '__main__':
    asyncio.run(run_migration())
