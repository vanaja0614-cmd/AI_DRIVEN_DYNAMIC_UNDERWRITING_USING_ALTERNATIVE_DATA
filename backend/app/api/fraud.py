from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.fraud import (
    FraudRequest,
    FraudResponse
)
from app.services.fraud_service import (
    FraudService
)
from app.ai.fraud_model import FraudModel
from app.ai.model_loader import load_model
from app.core.config import settings


router = APIRouter(
    prefix="/fraud",
    tags=["Fraud"]
)


model = load_model(
    settings.FRAUD_MODEL_PATH
)

fraud_model = FraudModel(model)

service = FraudService(
    fraud_model
)


@router.post(
    "/check",
    response_model=FraudResponse
)
def check_fraud(
    request: FraudRequest,
    db: Session = Depends(get_db)
):

    return service.evaluate(
        db,
        request
    )