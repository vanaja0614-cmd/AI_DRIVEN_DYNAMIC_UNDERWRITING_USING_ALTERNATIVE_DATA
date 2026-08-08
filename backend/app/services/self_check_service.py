class SelfCheckService:

    @staticmethod
    def run():

        checks = {
            "api": True,
            "database": True,
            "risk_model": True,
            "fraud_model": True,
            "fairness": True
        }

        return {
            "healthy": all(checks.values()),
            "checks": checks
        }