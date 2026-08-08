from sqlalchemy import Column, Integer, String, Float

from app.database.base import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(150), nullable=False)

    email = Column(String(255), unique=True, nullable=False)

    income = Column(Float, nullable=False)

    credit_score = Column(Integer, nullable=False)