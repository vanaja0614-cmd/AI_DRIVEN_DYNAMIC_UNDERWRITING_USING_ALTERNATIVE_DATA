from app.ai.agents import AgentOrchestrator
from app.models.application import Application
from app.models.consent import Consent
from app.models.fraud_event import FraudEvent
from app.models.risk_score import RiskScore


class AssistantService:

    def __init__(self):

        self.orchestrator = AgentOrchestrator()

    def _build_context(self, db, application_id):

        application = db.query(Application).filter(
            Application.id == application_id
        ).first()

        if application is None:
            return None

        risk = db.query(RiskScore).filter(
            RiskScore.application_id == application_id
        ).order_by(RiskScore.id.desc()).first()

        fraud = db.query(FraudEvent).filter(
            FraudEvent.application_id == application_id
        ).order_by(FraudEvent.id.desc()).first()

        consent = db.query(Consent).filter(
            Consent.customer_id == application.customer_id
        ).order_by(Consent.id.desc()).first()

        risk_data = None

        if risk is not None:
            risk_data = {
                "score": risk.score,
                "level": risk.risk_level,
                "decision": risk.decision,
            }

        fraud_data = None

        if fraud is not None:
            fraud_data = {
                "probability": fraud.fraud_probability,
                "level": fraud.risk_level,
            }

        consent_data = {
            "employmentSignals": bool(
                consent and consent.employment_signals_consent
            ),
            "professionalPresence": bool(
                consent and consent.professional_presence_consent
            ),
            "digitalSignals": bool(
                consent and consent.digital_signals_consent
            ),
            "publicData": bool(
                consent and consent.public_data_consent
            ),
        }

        return {
            "application_id": application.id,
            "customer_id": application.customer_id,
            "application": {
                "loan_amount": application.loan_amount,
                "loan_term": application.loan_term,
                "employment_years": application.employment_years,
            },
            "risk": risk_data,
            "fraud": fraud_data,
            "consent": consent_data,
            "explanation": [
                {
                    "feature": "credit_score",
                    "impact": 0.35,
                    "direction": "positive",
                },
                {
                    "feature": "income",
                    "impact": 0.25,
                    "direction": "positive",
                },
                {
                    "feature": "loan_amount",
                    "impact": -0.20,
                    "direction": "negative",
                },
            ],
        }

    def chat(self, db, application_id, message):

        if application_id is None:
            return {
                "intent": "help",
                "agent": "Orchestrator",
                "reply": self.orchestrator.help_text(),
            }

        context = self._build_context(db, application_id)

        if context is None:
            return {
                "intent": "not_found",
                "agent": "Orchestrator",
                "reply": (
                    f"I couldn't find application #{application_id}. "
                    "Please check the application ID and try again."
                ),
            }

        return self.orchestrator.handle(message, context)

    def agents(self):

        return self.orchestrator.describe()
