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

