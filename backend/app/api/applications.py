from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.application import (
    ApplicationCreate,
    ApplicationResponse
)
from app.services.application_service import (
    ApplicationService
)


router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)


@router.post(
    "/",
    response_model=ApplicationResponse
)
def create_application(
    data: ApplicationCreate,
    db: Session = Depends(get_db)
):

    return ApplicationService.create(
        db,
        data
    )


@router.get("/{application_id}")
def get_application(
    application_id: int,
    db: Session = Depends(get_db)
):

    application = ApplicationService.get(
        db,
        application_id
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    return application