from app.models.consent import Consent


class ConsentService:

    @staticmethod
    def save(db, data):

        consent = Consent(
            customer_id=data.customer_id,
            digital_data_consent=data.digital_data_consent,
            transaction_data_consent=data.transaction_data_consent,
            behavioral_data_consent=data.behavioral_data_consent,
            employment_signals_consent=getattr(
                data, "employment_signals_consent", None
            ),
            professional_presence_consent=getattr(
                data, "professional_presence_consent", None
            ),
            digital_signals_consent=getattr(
                data, "digital_signals_consent", None
            ),
            public_data_consent=getattr(
                data, "public_data_consent", None
            ),
            version=data.version
        )

        db.add(consent)
        db.commit()
        db.refresh(consent)

        return consent

    @staticmethod
    def has_digital_consent(db, customer_id):

        consent = db.query(Consent).filter(
            Consent.customer_id == customer_id
        ).order_by(
            Consent.id.desc()
        ).first()

        return (
            consent is not None
            and consent.digital_data_consent
        )