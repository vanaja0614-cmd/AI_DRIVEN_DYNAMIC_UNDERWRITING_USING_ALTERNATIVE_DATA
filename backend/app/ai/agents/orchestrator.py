import re

from app.ai.agents.base import BaseAgent
from app.ai.agents.data_source_agent import DataSourceAgent
from app.ai.agents.explainability_agent import ExplainabilityAgent
from app.ai.agents.fraud_agent import FraudAgent
from app.ai.agents.underwriting_agent import UnderwritingAgent

GREETINGS = {"hi", "hello", "hey", "namaste", "goodmorning", "goodafternoon"}

HELP_WORDS = {"help", "menu", "options", "commands"}


def tokens(message: str) -> set:
    return set(re.findall(r"[a-z']+", message.lower()))


class AgentOrchestrator:

    def __init__(self, agents=None):

        self.agents = agents or [
            FraudAgent(),
            ExplainabilityAgent(),
            DataSourceAgent(),
            UnderwritingAgent(),
        ]

    def route(self, message: str) -> BaseAgent:

        words = tokens(message)

        best = None
        best_score = 0

        for agent in self.agents:
            score = len(words & set(agent.keywords))

            if score > best_score:
                best_score = score
                best = agent

        return best if best_score > 0 else None

    def handle(self, message: str, context: dict) -> dict:

        lowered = message.lower().strip()
        words = tokens(lowered)

        if not lowered:
            return {
                "intent": "help",
                "agent": "Orchestrator",
                "reply": self.help_text(),
            }

        if words & GREETINGS:
            return {
                "intent": "greeting",
                "agent": "Orchestrator",
                "reply": (
                    "Hi! I'm the TrustFlow AI underwriting assistant. "
                    "Ask me about your risk score, the approval decision, "
                    "fraud screening, why the score was given, or which "
                    "data sources were used."
                ),
            }

        if (words & HELP_WORDS) or any(
            phrase in lowered
            for phrase in ["what can you", "what do you", "how do you"]
        ):
            return {
                "intent": "help",
                "agent": "Orchestrator",
                "reply": self.help_text(),
            }

        agent = self.route(lowered)

        if agent is None:
            return {
                "intent": "unknown",
                "agent": "Orchestrator",
                "reply": (
                    "I'm not sure how to answer that. I can help with:\n"
                    "- Risk score & approval decision\n"
                    "- Fraud screening results\n"
                    "- Why a score was given\n"
                    "- Which data sources were used"
                ),
            }

        return {
            "intent": agent.name.lower().replace(" ", "_"),
            "agent": agent.name,
            "reply": agent.respond(context),
        }

    def help_text(self) -> str:

        lines = [
            "I'm the TrustFlow AI underwriting assistant. Ask me about:"
        ]

        for agent in self.agents:
            lines.append(f"- {agent.description}")

        lines.append("- The overall recommendation, or just say hi!")

        return "\n".join(lines)

    def describe(self) -> list:

        return [
            {
                "name": agent.name,
                "description": agent.description,
            }
            for agent in self.agents
        ]
