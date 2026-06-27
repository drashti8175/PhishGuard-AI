import logging
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from app.config import settings

load_dotenv()

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    async def connect_db(self):
        """Initialize the MongoDB connection."""
        try:
            # Using settings.MONGO_URI defined in config.py for consistency
            self.client = AsyncIOMotorClient(settings.MONGO_URI)
            self.db = self.client.get_default_database()
            print("Successfully connected to MongoDB")
        except Exception as e:
            logging.error(f"Could not connect to MongoDB: {e}")
            raise e

    async def close_db(self):
        """Close the MongoDB connection."""
        if self.client:
            self.client.close()

db_adapter = MongoDB()

def get_users_collection():
    return db_adapter.db.users

def get_scans_collection():
    return db_adapter.db.scans
