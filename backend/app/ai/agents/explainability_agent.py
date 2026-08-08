from app.ai.agents.base import BaseAgent


class ExplainabilityAgent(BaseAgent):

    name = "Explainability Agent"
    description = (
        "Breaks down which factors moved the score and why the "
        "decision was made."
    )
    keywords = [
        "why", "explain", "explanation", "reason", "because",
        "factor", "factors", "affect", "impact", "influenc",
        "detail", "more about"
    ]

    def respond(self, context: dict) -> str:

        explanation = context.get("explanation") or []
        risk = context.get("risk") or {}

        if not explanation:
            return (
                "I don't have feature-level explanations for this "
                "application yet. Run the analysis first."
            )

        lines = []

        for item in explanation[:5]:
            feature = item.get("feature", "unknown")
            impact = item.get("impact", 0)
            direction = item.get("direction", "positive")

            lines.append(
                f"{feature}: {'+' if impact > 0 else ''}{impact} "
                f"({direction} impact)"
            )

        return (
            "The score was driven by these factors, most influential "
            "first:\n"
            + "\n".join(lines)
            + (
                f"\nOverall recommendation: "
                f"{risk.get('decision', 'N/A')} "
                f"({risk.get('level', 'N/A')} risk)."
                if risk.get("decision")
                else ""
            )
        )
