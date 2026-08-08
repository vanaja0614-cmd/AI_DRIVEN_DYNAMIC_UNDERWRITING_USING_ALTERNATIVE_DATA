from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.consent import (
    ConsentRequest,
    ConsentResponse
)
from app.services.consent_service import (
    ConsentService
)


router = APIRouter(
    prefix="/consent",
    tags=["Consent"]
)


@router.post(
    "/",
    response_model=ConsentResponse
)
def save_consent(
    data: ConsentRequest,
    db: Session = Depends(get_db)
):

    return ConsentService.save(
        db,
        data
    )