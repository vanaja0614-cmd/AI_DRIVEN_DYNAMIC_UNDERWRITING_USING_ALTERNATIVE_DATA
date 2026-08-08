from fastapi import APIRouter

from app.services.explanation_service import (
    ExplanationService
)


router = APIRouter(
    prefix="/explanations",
    tags=["Explainability"]
)


service = ExplanationService()


@router.post("/")
def explain(features: dict):

    import pandas as pd

    dataframe = pd.DataFrame([features])

    explanation = service.explain(
        dataframe
    )

    return {
        "explanation": explanation
    }