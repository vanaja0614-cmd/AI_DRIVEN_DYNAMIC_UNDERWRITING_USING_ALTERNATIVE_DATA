from datetime import datetime

from fastapi import APIRouter, HTTPException

from app.schemas.user import (
    AnalysisSync,
    UserCreate,
    UserUpdate
)
from app.services.firebase_service import firebase_service


router = APIRouter(
    prefix="/firebase",
    tags=["Firebase"]
)


@router.get("/users")
def list_users():

    return firebase_service.list_users_sync()


@router.post("/users")
def create_user(data: UserCreate):

    ref = firebase_service.post(
        "users",
        data.model_dump()
    )

    uid = (ref or {}).get("name")

    return {"id": uid, **data.model_dump()}


@router.get("/users/{uid}")
def get_user(uid: str):

    record = firebase_service.get(f"users/{uid}")

    if not record:
        raise HTTPException(
            status_code=404,
            detail="User not found in Firebase"
        )

    return {"id": uid, **record}


@router.put("/users/{uid}")
def update_user(uid: str, data: UserUpdate):

    existing = firebase_service.get(f"users/{uid}")

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="User not found in Firebase"
        )

    updates = {
        key: value
        for key, value in data.model_dump().items()
        if value is not None
    }

    merged = {**existing, **updates}

    firebase_service.put(f"users/{uid}", merged)

    return {"id": uid, **merged}


@router.delete("/users/{uid}")
def delete_user(uid: str):

    firebase_service.delete(f"users/{uid}")

    return {"deleted": uid}


@router.get("/analyses")
def list_analyses():

    data = firebase_service.list_analyses()

    if not isinstance(data, dict):
        return []

    return [
        {"application_id": key, **record}
        for key, record in data.items()
        if isinstance(record, dict)
    ]


@router.post("/analyses")
def save_analysis(data: AnalysisSync):

    payload = data.model_dump(exclude_none=True)

    payload.setdefault(
        "synced_at",
        datetime.utcnow().isoformat()
    )

    firebase_service.save_analysis(
        data.application_id,
        payload
    )

    return {
        "application_id": data.application_id,
        "synced": True
    }
