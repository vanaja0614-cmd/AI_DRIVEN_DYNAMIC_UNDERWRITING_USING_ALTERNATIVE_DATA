from app.models.application import Application


class ApplicationService:

    @staticmethod
    def create(db, data):

        application = Application(
            customer_id=data.customer_id,
            loan_amount=data.loan_amount,
            loan_term=data.loan_term,
            employment_years=data.employment_years
        )

        db.add(application)
        db.commit()
        db.refresh(application)

        return application

    @staticmethod
    def get(db, application_id):

        return db.query(Application).filter(
            Application.id == application_id
        ).first()