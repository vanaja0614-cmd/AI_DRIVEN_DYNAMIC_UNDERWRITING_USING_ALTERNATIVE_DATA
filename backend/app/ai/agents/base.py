class BaseAgent:

    name = "base"
    description = "Base agent"
    keywords = []

    def can_handle(self, message: str) -> bool:
        lowered = message.lower()
        return any(keyword in lowered for keyword in self.keywords)

    def respond(self, context: dict) -> str:
        raise NotImplementedError
