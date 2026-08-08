from app.ai.agents.base import BaseAgent


class DataSourceAgent(BaseAgent):

    name = "Data Source Agent"
    description = (
        "Lists the data sources and consent signals used in the analysis."
    )
    keywords = [
        "data", "source", "sources", "consent", "consented", "used",
        "signal", "signals", "privacy", "information", "alternative",
        "bureau", "employment", "professional", "digital", "public"
    ]

    def respond(self, context: dict) -> str:

        consent = context.get("consent") or {}
        customer_id = context.get("customer_id")

        enabled = [
            label
            for key, label in [
                ("employmentSignals", "Employment & Education signals"),
                ("professionalPresence", "Professional Presence"),
                ("digitalSignals", "Digital Engagement"),
                ("publicData", "Publicly Available Information"),
            ]
            if consent.get(key)
        ]

        base_lines = [
            "This analysis used the following data sources:",
            "  - Traditional Bureau baseline (required)",
        ]

        if enabled:
            base_lines += [f"  - {label}" for label in enabled]
        else:
            base_lines.append("  - No optional alternative-data sources were consented.")

        declined = [
            label
            for key, label in [
                ("employmentSignals", "Employment & Education signals"),
                ("professionalPresence", "Professional Presence"),
                ("digitalSignals", "Digital Engagement"),
                ("publicData", "Publicly Available Information"),
            ]
            if not consent.get(key)
        ]

        if declined:
            base_lines.append(
                "Declined sources that were NOT used: "
                + ", ".join(declined) + "."
            )

        if customer_id is not None:
            base_lines.append(
                f"Consent profile belongs to customer #{customer_id}."
            )

        return "\n".join(base_lines)
