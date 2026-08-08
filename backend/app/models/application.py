from sqlalchemy import Column, Integer, Float, String, ForeignKey

from app.database.base import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=False
    )

    loan_amount = Column(Float, nullable=False)

    loan_term = Column(Integer, nullable=False)

    employment_years = Column(Float, nullable=False)

    status = Column(
        String(50),
        default="PENDING"
    )