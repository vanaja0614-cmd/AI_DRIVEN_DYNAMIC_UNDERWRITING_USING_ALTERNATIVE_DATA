from app.ai.agents.base import BaseAgent


class UnderwritingAgent(BaseAgent):

    name = "Underwriting Agent"
    description = (
        "Answers questions about the risk score, risk level and the "
        "final approval decision."
    )
    keywords = [
        "score", "risk", "approve", "approved", "reject", "rejected",
        "decline", "decision", "eligible", "eligibility", "loan",
        "underwrite", "underwriting", "chance", "accept", "accepted",
        "recommend", "recommendation", "outcome"
    ]

    def respond(self, context: dict) -> str:

        risk = context.get("risk") or {}

        score = risk.get("score")
        level = risk.get("level")
        decision = risk.get("decision")

        if score is None:
            return (
                "I don't have a risk score for this application yet. "
                "Run the analysis first, then ask me again."
            )

        score_pct = round(score * 100)

        app = context.get("application") or {}
        loan_amount = app.get("loan_amount")
        income = app.get("income")

        loan_text = (
            f" for a loan of ${loan_amount:,.0f}"
            if loan_amount is not None
            else ""
        )

        income_text = (
            f" against an income of ${income:,.0f}"
            if income is not None
            else ""
        )

        return (
            f"Your application {loan_text} was scored at "
            f"{score_pct}/100, which is {level} risk "
            f"{income_text}. "
            f"The underwriting recommendation is {decision}. "
            "This blends your traditional bureau baseline with the "
            "alternative data you consented to."
        )
