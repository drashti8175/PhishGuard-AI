import os
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

db_adapter = MongoDB()

async def connect_db():
    """Initialize the MongoDB connection."""
    mongodb_url = os.getenv("MONGODB_URL")
    db_adapter.client = AsyncIOMotorClient(mongodb_url)
    db_adapter.db = db_adapter.client.get_default_database()
    print("Successfully connected to MongoDB Atlas")

async def close_db():
    """Close the MongoDB connection."""
    db_adapter.client.close()
