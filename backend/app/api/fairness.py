from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.services.fairness_service import (
    FairnessService
)


router = APIRouter(
    prefix="/fairness",
    tags=["Fairness"]
)


service = FairnessService()


@router.post("/analyze")
def analyze_fairness(
    predictions: list[int],
    groups: list[str]
):

    return service.analyze(
        predictions,
        groups
    )


@router.get("/cohort-summary")
def cohort_summary(
    db: Session = Depends(get_db)
):

    return service.cohort_summary(db)