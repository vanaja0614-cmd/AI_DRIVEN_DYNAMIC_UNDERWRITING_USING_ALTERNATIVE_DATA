from app.database.connection import SessionLocal
from app.models.customer import Customer


def seed_database():
    db = SessionLocal()

    try:
        existing = db.query(Customer).first()

        if existing:
            return

        customer = Customer(
            name="Demo Customer",
            email="demo@example.com",
            income=60000,
            credit_score=720
        )

        db.add(customer)
        db.commit()

    finally:
        db.close()