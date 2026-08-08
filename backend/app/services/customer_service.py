from app.models.customer import Customer
from app.services.firebase_service import firebase_service


class CustomerService:

    @staticmethod
    def create(db, data):
        """Create a customer locally and mirror it to Firebase 'users'."""
        customer = Customer(
            name=data.name,
            email=data.email,
            income=data.income,
            credit_score=data.credit_score,
        )

        db.add(customer)
        db.commit()
        db.refresh(customer)

        # Best-effort sync to Firebase; non-blocking on failure.
        try:
            firebase_service.sync_customer(customer)
        except Exception:
            pass

        return customer

    @staticmethod
    def get(db, customer_id):
        return db.query(Customer).filter(
            Customer.id == customer_id
        ).first()

