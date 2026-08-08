from fastapi import APIRouter, HTTPException

from app.schemas.user import UserCreate, UserResponse
from app.services.firebase_service import firebase_service


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get("/")
async def list_users():
    """Return all users stored in the Firebase Realtime Database."""
    users = await firebase_service.get_users()
    return users


@router.post("/", response_model=UserResponse)
async def create_user(data: UserCreate):
    """Create a new user in the Firebase Realtime Database."""
    result = await firebase_service.add_user(
        data.model_dump(exclude_none=True)
    )

    if not result or not result.get("id"):
        raise HTTPException(
            status_code=502,
            detail="Failed to write user to Firebase",
        )

    return {
        "id": result["id"],
        "key": result["id"],
        **data.model_dump(exclude_none=True),
    }


@router.get("/{user_id}")
async def get_user(user_id: str):
    """Return a single user by Firebase key."""
    users = await firebase_service.get_users()
    user = next(
        (u for u in users if u.get("id") == user_id),
        None,
    )
    if user is None:
        raise HTTPException(
            status_code=404,
            detail=f"User '{user_id}' not found",
        )
    return {"id": user_id, "key": user_id, **user}


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, data: UserCreate):
    """Update an existing user in the Firebase Realtime Database."""
    users = await firebase_service.get_users()
    if not any(u.get("id") == user_id for u in users):
        raise HTTPException(
            status_code=404,
            detail=f"User '{user_id}' not found",
        )

    await firebase_service.update_user(
        user_id,
        data.model_dump(exclude_none=True),
    )

    return {
        "id": user_id,
        "key": user_id,
        **data.model_dump(exclude_none=True),
    }


@router.delete("/{user_id}")
async def delete_user(user_id: str):
    """Delete a user from the Firebase Realtime Database."""
    users = await firebase_service.get_users()
    if not any(u.get("id") == user_id for u in users):
        raise HTTPException(
            status_code=404,
            detail=f"User '{user_id}' not found",
        )

    await firebase_service.delete_user(user_id)
    return {"id": user_id, "deleted": True}

