from sqlalchemy import Column, Integer, Float, String, ForeignKey

from app.database.base import Base


class RiskScore(Base):
    __tablename__ = "risk_scores"

    id = Column(Integer, primary_key=True, index=True)

    application_id = Column(
        Integer,
        ForeignKey("applications.id"),
        nullable=False
    )

    score = Column(Float, nullable=False)

    risk_level = Column(String(30), nullable=False)

    decision = Column(String(30), nullable=False)

    model_version = Column(String(50), default="1.0")