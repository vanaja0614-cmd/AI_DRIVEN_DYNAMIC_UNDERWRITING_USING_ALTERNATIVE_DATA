from pydantic import BaseModel


class RiskRequest(BaseModel):

    application_id: int

    income: float

    credit_score: int

    loan_amount: float

    loan_term: int

    employment_years: float

    digital_activity_score: float = 0.0

    transaction_consistency: float = 0.0


class RiskResponse(BaseModel):

    application_id: int

    risk_score: float

    risk_level: str

    decision: str