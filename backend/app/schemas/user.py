from typing import List, Optional

from pydantic import BaseModel


class UserCreate(BaseModel):

    name: str

    email: str

    income: Optional[float] = None

    credit_score: Optional[int] = None


class UserUpdate(BaseModel):

    name: Optional[str] = None

    email: Optional[str] = None

    income: Optional[float] = None

    credit_score: Optional[int] = None


class UserResponse(UserCreate):

    id: str

    key: str


class AnalysisSync(BaseModel):

    application_id: int

    risk_score: Optional[float] = None

    risk_level: Optional[str] = None

    decision: Optional[str] = None

    fraud_probability: Optional[float] = None

    fraud_level: Optional[str] = None

    explanation: Optional[List[dict]] = None

    synced_at: Optional[str] = None
