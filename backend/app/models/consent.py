from sqlalchemy import Column, Integer, Boolean, String

from app.database.base import Base


class Consent(Base):
    __tablename__ = "consents"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(Integer, nullable=False)

    digital_data_consent = Column(Boolean, default=False)

    transaction_data_consent = Column(Boolean, default=False)

    behavioral_data_consent = Column(Boolean, default=False)

    employment_signals_consent = Column(Boolean, default=False)

    professional_presence_consent = Column(Boolean, default=False)

    digital_signals_consent = Column(Boolean, default=False)

    public_data_consent = Column(Boolean, default=False)

    version = Column(String(20), default="1.0")