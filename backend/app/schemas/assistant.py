from typing import Optional

from pydantic import BaseModel


class ChatRequest(BaseModel):

    message: str

    application_id: Optional[int] = None


class ChatResponse(BaseModel):

    reply: str

    intent: str

    agent: str


class AgentInfo(BaseModel):

    name: str

    description: str
