from pydantic import BaseModel


class FraudRequest(BaseModel):

    application_id: int

    transaction_count: int

    unusual_transaction_ratio: float

    account_age_days: int

    login_frequency: float


class FraudResponse(BaseModel):

    application_id: int

    fraud_probability: float

    risk_level: str