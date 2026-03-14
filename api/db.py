import os
from typing import Optional

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase


_client: Optional[AsyncIOMotorClient] = None


def get_database() -> AsyncIOMotorDatabase:
    global _client

    uri = os.getenv("MONGODB_URI")
    if not uri:
        raise RuntimeError("MONGODB_URI environment variable is not set")

    db_name = os.getenv("PIXELMIND_DB_NAME", "pixelmind")

    if _client is None:
        _client = AsyncIOMotorClient(uri)

    return _client[db_name]

