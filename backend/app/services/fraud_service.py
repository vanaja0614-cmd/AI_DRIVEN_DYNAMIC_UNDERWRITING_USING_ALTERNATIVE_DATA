from app.models.fraud_event import FraudEvent


class FraudService:

    def __init__(self, fraud_model):
        self.fraud_model = fraud_model

    def evaluate(self, db, request):

        data = request.model_dump()

        probability = self.fraud_model.predict_probability(
            data
        )

        if probability >= 0.75:
            level = "HIGH"

        elif probability >= 0.40:
            level = "MEDIUM"

        else:
            level = "LOW"

        event = FraudEvent(
            application_id=request.application_id,
            fraud_probability=probability,
            risk_level=level,
            reason="AI-based behavioral analysis"
        )

        db.add(event)
        db.commit()

        return {
            "application_id": request.application_id,
            "fraud_probability": round(
                probability,
                4
            ),
            "risk_level": level
        }