from pydantic import BaseModel
from typing import List


class ExplanationItem(BaseModel):

    feature: str

    impact: float

    direction: str


class ExplanationResponse(BaseModel):

    application_id: int

    explanation: List[ExplanationItem]