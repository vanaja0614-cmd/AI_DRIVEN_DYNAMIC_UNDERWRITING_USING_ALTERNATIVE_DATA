from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.risk import (
    RiskRequest,
    RiskResponse
)
from app.services.underwriting_service import (
    UnderwritingService
)
from app.ai.risk_model import RiskModel
from app.ai.model_loader import load_model
from app.core.config import settings


router = APIRouter(
    prefix="/risk",
    tags=["AI Risk"]
)


model = load_model(
    settings.RISK_MODEL_PATH
)

risk_model = RiskModel(model)

service = UnderwritingService(
    risk_model
)


@router.post(
    "/score",
    response_model=RiskResponse
)
def calculate_risk(
    request: RiskRequest,
    db: Session = Depends(get_db)
):

    return service.evaluate(
        db,
        request
    )