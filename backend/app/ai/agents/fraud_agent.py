from app.ai.agents.base import BaseAgent


class FraudAgent(BaseAgent):

    name = "Fraud Agent"
    description = (
        "Explains the fraud screening result and the behavioural "
        "signals behind it."
    )
    keywords = [
        "fraud", "scam", "suspicious", "security", "behaviour",
        "behavior", "probability", "unusual", "pattern", "screen",
        "check", "verified"
    ]

    def respond(self, context: dict) -> str:

        fraud = context.get("fraud") or {}

        probability = fraud.get("probability")
        level = fraud.get("level")

        if probability is None:
            return (
                "No fraud screening has run for this application yet. "
                "Run the analysis first, then ask me again."
            )

        probability_pct = round(probability * 100)

        guidance = {
            "LOW": "No unusual behavioural patterns were detected.",
            "MEDIUM": "Some signals warrant a closer manual review.",
            "HIGH": "The behavioural signals look suspicious and need "
                    "careful investigation."
        }.get(level, "")

        return (
            f"The fraud screening returned a probability of "
            f"{probability_pct}% — classified as {level} risk. "
            f"{guidance}"
        )
