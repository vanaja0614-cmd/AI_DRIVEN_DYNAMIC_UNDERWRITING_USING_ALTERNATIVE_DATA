from pydantic import BaseModel

from typing import Optional


class ConsentCreate(BaseModel):

    customer_id: int

    digital_data_consent: bool

    transaction_data_consent: bool

    behavioral_data_consent: bool

    version: str = "1.0"


class ConsentRequest(ConsentCreate):

    # The four toggles collected on the Consent Manager screen, kept
    # optional for backward compatibility with older clients.
    employment_signals_consent: Optional[bool] = None

    professional_presence_consent: Optional[bool] = None

    digital_signals_consent: Optional[bool] = None

    public_data_consent: Optional[bool] = None


class ConsentResponse(ConsentCreate):

    id: int

    employment_signals_consent: Optional[bool] = None

    professional_presence_consent: Optional[bool] = None

    digital_signals_consent: Optional[bool] = None

    public_data_consent: Optional[bool] = None

    class Config:
        from_attributes = True