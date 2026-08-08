from sqlalchemy import Column, Integer, Float, String, ForeignKey

from app.database.base import Base


class FraudEvent(Base):
    __tablename__ = "fraud_events"

    id = Column(Integer, primary_key=True, index=True)

    application_id = Column(
        Integer,
        ForeignKey("applications.id"),
        nullable=False
    )

    fraud_probability = Column(Float, nullable=False)

    risk_level = Column(String(30), nullable=False)

    reason = Column(String(500))