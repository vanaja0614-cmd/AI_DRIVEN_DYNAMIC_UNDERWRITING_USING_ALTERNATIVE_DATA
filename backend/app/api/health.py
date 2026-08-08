from fastapi import APIRouter

from app.services.monitoring_service import MonitoringService


router = APIRouter(
    prefix="/health",
    tags=["Health"]
)


@router.get("/")
def health():

    return MonitoringService.system_status()


@router.get("/ready")
def readiness():

    return MonitoringService.readiness()
