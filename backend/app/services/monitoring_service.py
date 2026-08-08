from datetime import datetime, timezone

from sqlalchemy import text

from app.database.connection import engine
from app.services.firebase_service import firebase_service


class MonitoringService:

    @staticmethod
    def system_status():

        return {
            "status": "healthy",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "services": {
                "api": "up",
                "database": "up",
                "risk_model": "loaded",
                "fraud_model": "loaded"
            },
            "firebase": {
                "database_url": firebase_service.database_url,
                "sdk_enabled": firebase_service.is_sdk_enabled
            }
        }

    @staticmethod
    def readiness():

        # Real dependency check: can the API reach its database?
        database_up = True
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
        except Exception:
            database_up = False

        return {
            "status": "ready" if database_up else "degraded",
            "database": "up" if database_up else "down",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
