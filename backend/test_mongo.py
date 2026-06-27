import asyncio
from app.database import db_adapter

async def main():
    await db_adapter.connect_db()
    print('✅ Connected to:', db_adapter.db)
    # List collections to prove we can read
    try:
        cols = await db_adapter.db.list_collection_names()
        print('Collections:', cols)
    except Exception as e:
        print('Error listing collections:', e)

if __name__ == '__main__':
    asyncio.run(main())
