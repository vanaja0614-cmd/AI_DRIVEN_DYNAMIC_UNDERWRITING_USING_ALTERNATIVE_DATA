from app.models.risk_score import RiskScore
from app.ai.feature_engineering import build_risk_features


class UnderwritingService:

    def __init__(self, risk_model):
        self.risk_model = risk_model

    def evaluate(self, db, request):

        data = request.model_dump()

        features = build_risk_features(data)

        score = self.risk_model.predict_score(
            data
        )

        if score >= 0.75:
            risk_level = "LOW"
            decision = "APPROVE"

        elif score >= 0.50:
            risk_level = "MEDIUM"
            decision = "REVIEW"

        else:
            risk_level = "HIGH"
            decision = "REJECT"

        result = RiskScore(
            application_id=request.application_id,
            score=score,
            risk_level=risk_level,
            decision=decision
        )

        db.add(result)
        db.commit()

        return {
            "application_id": request.application_id,
            "risk_score": round(score, 4),
            "risk_level": risk_level,
            "decision": decision
        }