import os

from dotenv import load_dotenv

load_dotenv()

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi_clerk_auth import ClerkConfig, ClerkHTTPBearer
from db import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel
from typing import Optional, List
from bson import ObjectId
from pymongo import ReturnDocument


app = FastAPI(title="PixelMind API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

clerk_frontend_api = os.getenv("CLERK_FRONTEND_API", "").rstrip("/")
clerk_jwks_url = os.getenv(
    "CLERK_JWKS_URL",
    f"{clerk_frontend_api}/.well-known/jwks.json" if clerk_frontend_api else "",
)

clerk_config = ClerkConfig(jwks_url=clerk_jwks_url)
clerk_auth_guard = ClerkHTTPBearer(config=clerk_config)


def _clerk_sub(payload) -> Optional[str]:
    """Extract Clerk user id (sub) from auth guard result. Guard returns HTTPAuthorizationCredentials with .decoded."""
    decoded = getattr(payload, "decoded", None) or {}
    return decoded.get("sub")


class HabitCreate(BaseModel):
    name: str
    color: str
    icon: Optional[str] = None
    rhythm: Optional[dict] = None  # e.g. {"type": "daily"} or {"times_per_week": 3} or {"days": ["monday", "wednesday"]}


class HabitUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    rhythm: Optional[dict] = None
    archived: Optional[bool] = None


class OnboardingHabit(BaseModel):
    name: str
    color: str
    icon: Optional[str] = None


class OnboardingPayload(BaseModel):
    habits: List[OnboardingHabit]
    primary_feeling: Optional[str] = None


class DayRangeQuery(BaseModel):
    start_date: str  # ISO date string, e.g. "2025-01-01"
    end_date: str


class DayUpsertPayload(BaseModel):
    date: str
    completed_habit_ids: List[str]
    mood: Optional[str] = None


class JournalCreatePayload(BaseModel):
    date: str
    text: str


class JournalRangeQuery(BaseModel):
    start_date: str
    end_date: str


class InsightQuery(BaseModel):
    week_start_date: str


THEME_VALUES = {"light", "dark", "system"}
WEEK_STARTS_VALUES = {"monday", "sunday"}


class PreferencesUpdate(BaseModel):
    primary_feeling: Optional[str] = None
    theme: Optional[str] = None
    week_starts_on: Optional[str] = None


class MePatchPayload(BaseModel):
    preferences: Optional[dict] = None


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/auth-check")
async def auth_check(
    payload=Depends(clerk_auth_guard),
) -> dict:
    return {"user_id": _clerk_sub(payload)}


@app.get("/me")
async def get_or_create_me(
    payload=Depends(clerk_auth_guard),
) -> dict:
    """
    User bootstrap endpoint.
    Ensures a user document exists for the authenticated Clerk user.
    """
    clerk_user_id = _clerk_sub(payload)
    if not clerk_user_id:
        return {"error": "missing_sub"}

    db: AsyncIOMotorDatabase = get_database()
    users = db["users"]

    existing = await users.find_one({"clerk_user_id": clerk_user_id})
    if existing:
        out = serialize_mongo_document(existing)
        if "preferences" not in out or out["preferences"] is None:
            out["preferences"] = {}
        return out

    doc = {
        "clerk_user_id": clerk_user_id,
        "onboarding_completed": False,
        "preferences": {},
    }
    result = await users.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc


@app.patch("/me")
async def patch_me(
    payload_body: MePatchPayload,
    payload=Depends(clerk_auth_guard),
) -> dict:
    """
    Update current user document. Accepts optional preferences object;
    merges into existing preferences. Validates theme and week_starts_on.
    """
    clerk_user_id = _clerk_sub(payload)
    if not clerk_user_id:
        return {"error": "missing_sub"}

    if not payload_body.preferences:
        return {"error": "no_updates"}

    preferences = payload_body.preferences
    update_doc: dict = {}

    if "theme" in preferences and preferences["theme"] is not None:
        v = preferences["theme"].lower() if isinstance(preferences["theme"], str) else None
        if v not in THEME_VALUES:
            raise HTTPException(status_code=400, detail="invalid theme")
        update_doc["preferences.theme"] = v

    if "week_starts_on" in preferences and preferences["week_starts_on"] is not None:
        v = preferences["week_starts_on"].lower() if isinstance(preferences["week_starts_on"], str) else None
        if v not in WEEK_STARTS_VALUES:
            raise HTTPException(status_code=400, detail="invalid week_starts_on")
        update_doc["preferences.week_starts_on"] = v

    if "primary_feeling" in preferences:
        update_doc["preferences.primary_feeling"] = preferences["primary_feeling"] if preferences["primary_feeling"] else None

    if not update_doc:
        return {"error": "no_updates"}

    db: AsyncIOMotorDatabase = get_database()
    users = db["users"]

    result = await users.find_one_and_update(
        {"clerk_user_id": clerk_user_id},
        {"$set": update_doc},
        return_document=ReturnDocument.AFTER,
    )
    if not result:
        return {"error": "not_found"}

    out = serialize_mongo_document(result)
    if "preferences" not in out or out["preferences"] is None:
        out["preferences"] = {}
    return out


def serialize_mongo_document(doc: dict) -> dict:
    out = dict(doc)
    if "_id" in out:
        out["_id"] = str(out["_id"])
    return out


@app.get("/habits")
async def list_habits(payload=Depends(clerk_auth_guard)) -> List[dict]:
    clerk_user_id = _clerk_sub(payload)
    db: AsyncIOMotorDatabase = get_database()
    habits_coll = db["habits"]

    cursor = habits_coll.find({"clerk_user_id": clerk_user_id, "archived": False})
    habits: List[dict] = []
    async for doc in cursor:
        habits.append(serialize_mongo_document(doc))
    return habits


MAX_HABITS_PER_USER = 10


@app.post("/habits", status_code=201)
async def create_habit(
    habit: HabitCreate,
    payload=Depends(clerk_auth_guard),
) -> dict:
    clerk_user_id = _clerk_sub(payload)
    db: AsyncIOMotorDatabase = get_database()
    habits_coll = db["habits"]

    count = await habits_coll.count_documents(
        {"clerk_user_id": clerk_user_id, "archived": False}
    )
    if count >= MAX_HABITS_PER_USER:
        raise HTTPException(
            status_code=400,
            detail="habit_limit_reached",
        )

    doc = {
        "clerk_user_id": clerk_user_id,
        "name": habit.name,
        "color": habit.color,
        "archived": False,
    }
    if habit.icon is not None:
        doc["icon"] = habit.icon
    if habit.rhythm is not None:
        doc["rhythm"] = habit.rhythm
    result = await habits_coll.insert_one(doc)
    doc["_id"] = result.inserted_id
    return serialize_mongo_document(doc)


@app.patch("/habits/{habit_id}")
async def update_habit(
    habit_id: str,
    updates: HabitUpdate,
    payload=Depends(clerk_auth_guard),
) -> dict:
    clerk_user_id = _clerk_sub(payload)
    db: AsyncIOMotorDatabase = get_database()
    habits_coll = db["habits"]

    try:
        oid = ObjectId(habit_id)
    except Exception:
        return {"error": "invalid_id"}

    update_doc: dict = {}
    if updates.name is not None:
        update_doc["name"] = updates.name
    if updates.color is not None:
        update_doc["color"] = updates.color
    if updates.icon is not None:
        update_doc["icon"] = updates.icon
    if updates.rhythm is not None:
        update_doc["rhythm"] = updates.rhythm
    if updates.archived is not None:
        update_doc["archived"] = updates.archived

    if not update_doc:
        return {"error": "no_updates"}

    result = await habits_coll.find_one_and_update(
        {"_id": oid, "clerk_user_id": clerk_user_id},
        {"$set": update_doc},
        return_document=ReturnDocument.AFTER,
    )

    if not result:
        return {"error": "not_found"}

    return serialize_mongo_document(result)


@app.post("/onboarding", status_code=200)
async def complete_onboarding(
    payload: OnboardingPayload,
    auth_payload=Depends(clerk_auth_guard),
) -> dict:
    """
    Capture initial onboarding data and mark onboarding as complete
    for the authenticated user.
    """
    clerk_user_id = _clerk_sub(auth_payload)
    if not clerk_user_id:
        return {"error": "missing_sub"}

    db: AsyncIOMotorDatabase = get_database()

    # Ensure a user document exists
    users = db["users"]
    user_doc = await users.find_one({"clerk_user_id": clerk_user_id})
    if not user_doc:
        user_doc = {
            "clerk_user_id": clerk_user_id,
            "onboarding_completed": False,
            "preferences": {},
        }
        result = await users.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id

    # Create starter habits from structured payload (name + color + optional icon)
    valid_habits = [h for h in payload.habits if h.name.strip()]
    if valid_habits:
        habits_coll = db["habits"]
        docs = []
        for h in valid_habits:
            doc = {
                "clerk_user_id": clerk_user_id,
                "name": h.name.strip(),
                "color": h.color,
                "archived": False,
            }
            if h.icon:
                doc["icon"] = h.icon
            docs.append(doc)
        if docs:
            await habits_coll.insert_many(docs)

    # Update onboarding completion and store the primary feeling, if provided
    update_doc: dict = {"onboarding_completed": True}
    if payload.primary_feeling:
        update_doc.setdefault("preferences", {})
        update_doc["preferences"]["primary_feeling"] = payload.primary_feeling

    await users.update_one(
        {"clerk_user_id": clerk_user_id},
        {"$set": update_doc},
    )

    return {"ok": True}


@app.get("/days")
async def get_days(
    start_date: str,
    end_date: str,
    payload=Depends(clerk_auth_guard),
) -> List[dict]:
    """
    Get day documents for the authenticated user over a date range.
    """
    clerk_user_id = _clerk_sub(payload)
    db: AsyncIOMotorDatabase = get_database()
    days_coll = db["days"]

    cursor = days_coll.find(
        {
            "clerk_user_id": clerk_user_id,
            "date": {"$gte": start_date, "$lte": end_date},
        }
    )
    days: List[dict] = []
    async for doc in cursor:
        days.append(serialize_mongo_document(doc))
    return days


@app.post("/days", status_code=200)
async def upsert_day(
    payload: DayUpsertPayload,
    auth_payload=Depends(clerk_auth_guard),
) -> dict:
    """
    Upsert a day document for the authenticated user, recording
    completed habits and optional mood. For "toggle" one habit:
    client merges (add/remove habit id) into completed_habit_ids and POSTs.
    """
    clerk_user_id = _clerk_sub(auth_payload)
    db: AsyncIOMotorDatabase = get_database()
    days_coll = db["days"]

    update_doc: dict = {
        "clerk_user_id": clerk_user_id,
        "date": payload.date,
        "completed_habit_ids": payload.completed_habit_ids,
    }
    if payload.mood is not None:
        update_doc["mood"] = payload.mood

    result = await days_coll.find_one_and_update(
        {"clerk_user_id": clerk_user_id, "date": payload.date},
        {"$set": update_doc},
        upsert=True,
        return_document=True,
    )
    return serialize_mongo_document(result)


@app.post("/journal", status_code=201)
async def create_journal_entry(
    payload: JournalCreatePayload,
    auth_payload=Depends(clerk_auth_guard),
) -> dict:
    """
    Create a journal entry document for a specific date.
    """
    clerk_user_id = _clerk_sub(auth_payload)
    db: AsyncIOMotorDatabase = get_database()
    coll = db["journal_entries"]

    doc = {
        "clerk_user_id": clerk_user_id,
        "date": payload.date,
        "text": payload.text,
    }
    result = await coll.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc


@app.get("/journal")
async def list_journal_entries(
    start_date: str,
    end_date: str,
    payload=Depends(clerk_auth_guard),
) -> List[dict]:
    """
    List journal entries for the authenticated user over a date range.
    """
    clerk_user_id = _clerk_sub(payload)
    db: AsyncIOMotorDatabase = get_database()
    coll = db["journal_entries"]

    cursor = coll.find(
        {
            "clerk_user_id": clerk_user_id,
            "date": {"$gte": start_date, "$lte": end_date},
        }
    ).sort("date")

    entries: List[dict] = []
    async for doc in cursor:
        entries.append(serialize_mongo_document(doc))
    return entries


@app.get("/insights")
async def get_insight(
    week_start_date: str,
    payload=Depends(clerk_auth_guard),
) -> dict:
    """
    Get a weekly insight document for the authenticated user.

    This is intentionally simple for now and can later be extended
    to trigger AI generation when no insight exists yet.
    """
    clerk_user_id = _clerk_sub(payload)
    db: AsyncIOMotorDatabase = get_database()
    coll = db["insights"]

    doc = await coll.find_one(
        {"clerk_user_id": clerk_user_id, "week_start_date": week_start_date}
    )
    if not doc:
        return {"insight": None}
    return {"insight": serialize_mongo_document(doc)}


@app.on_event("startup")
async def ensure_indexes() -> None:
    db: AsyncIOMotorDatabase = get_database()

    await db["users"].create_index("clerk_user_id", unique=True)
    await db["habits"].create_index("clerk_user_id")
    await db["days"].create_index(
        [("clerk_user_id", 1), ("date", 1)],
        unique=True,
    )
    await db["journal_entries"].create_index(
        [("clerk_user_id", 1), ("date", 1)],
    )
    await db["insights"].create_index(
        [("clerk_user_id", 1), ("week_start_date", 1)],
        unique=True,
    )

