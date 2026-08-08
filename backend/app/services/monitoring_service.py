from datetime import datetime

from app.services.firebase_service import firebase_service


class MonitoringService:

    @staticmethod
    def system_status():

        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
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
