from fastapi import APIRouter

from app.services.monitoring_service import (
    MonitoringService
)

from app.services.self_check_service import (
    SelfCheckService
)


router = APIRouter(
    prefix="/monitoring",
    tags=["Monitoring"]
)


@router.get("/status")
def status():

    return MonitoringService.system_status()


@router.get("/self-check")
def self_check():

    return SelfCheckService.run()