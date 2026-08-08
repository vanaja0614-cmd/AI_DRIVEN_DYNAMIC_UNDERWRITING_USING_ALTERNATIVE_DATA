from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.assistant import (
    AgentInfo,
    ChatRequest,
    ChatResponse
)
from app.services.assistant_service import AssistantService


router = APIRouter(
    prefix="/assistant",
    tags=["AI Assistant"]
)


service = AssistantService()


@router.post(
    "/chat",
    response_model=ChatResponse
)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):

    return service.chat(
        db,
        request.application_id,
        request.message
    )


@router.get(
    "/agents",
    response_model=list[AgentInfo]
)
def agents():

    return service.agents()
