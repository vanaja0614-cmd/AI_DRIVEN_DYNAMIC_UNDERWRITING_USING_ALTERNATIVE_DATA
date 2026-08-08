import httpx

from app.core.config import settings


class FirebaseService:

    def __init__(self, base_url: str = None):

        self.base_url = (
            base_url or settings.FIREBASE_DB_URL
        ).rstrip("/")

        self.database_url = self.base_url

        self.timeout = 15.0

        # The Firebase connection is enabled via the Realtime Database
        # REST API (no admin SDK / service-account key required for this
        # public-rules database).
        self.is_sdk_enabled = True

    def _url(self, path: str) -> str:
        return f"{self.base_url}/{path.strip('/')}.json"

    # ------------------------------------------------------------------
    # Sync REST helpers (used by API routers and the assistant flow)
    # ------------------------------------------------------------------

    def get(self, path: str):
        with httpx.Client(timeout=self.timeout) as client:
            response = client.get(self._url(path))
            response.raise_for_status()
            return response.json()

    def post(self, path: str, data: dict):
        with httpx.Client(timeout=self.timeout) as client:
            response = client.post(self._url(path), json=data)
            response.raise_for_status()
            return response.json()

    def put(self, path: str, data: dict):
        with httpx.Client(timeout=self.timeout) as client:
            response = client.put(self._url(path), json=data)
            response.raise_for_status()
            return response.json()

    def patch(self, path: str, data: dict):
        with httpx.Client(timeout=self.timeout) as client:
            response = client.patch(self._url(path), json=data)
            response.raise_for_status()
            return response.json()

    def delete(self, path: str):
        with httpx.Client(timeout=self.timeout) as client:
            response = client.delete(self._url(path))
            response.raise_for_status()
            return response.json()

    # ------------------------------------------------------------------
    # Async REST helpers (used by the async /users router)
    # ------------------------------------------------------------------

    async def _request(self, method: str, path: str, data: dict = None):
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.request(
                method,
                self._url(path),
                json=data,
            )
            response.raise_for_status()
            return response.json()

    # ------------------------------------------------------------------
    # Users
    # ------------------------------------------------------------------

    async def get_users(self) -> list:
        data = await self._request("GET", "users")
        if not isinstance(data, dict):
            return []
        return [
            {"id": uid, **record}
            for uid, record in data.items()
            if isinstance(record, dict)
        ]

    async def add_user(self, data: dict) -> dict:
        ref = await self._request("POST", "users", data)
        uid = (ref or {}).get("name")
        return {"id": uid, **data}

    async def update_user(self, uid: str, data: dict) -> dict:
        existing = self.get(f"users/{uid}") or {}
        merged = {**existing, **data}
        await self._request("PUT", f"users/{uid}", merged)
        return {"id": uid, **merged}

    async def delete_user(self, uid: str) -> dict:
        await self._request("DELETE", f"users/{uid}")
        return {"deleted": uid}

    def sync_customer(self, customer) -> dict:
        """Push a locally-created customer to the Firebase 'users' node."""
        payload = {
            "name": customer.name,
            "email": customer.email,
            "income": customer.income,
            "credit_score": customer.credit_score,
            "customer_id": customer.id,
        }
        return self.put(f"users/c{customer.id}", payload)

    def list_users_sync(self) -> list:
        data = self.get("users")
        if not isinstance(data, dict):
            return []
        return [
            {"id": uid, **record}
            for uid, record in data.items()
            if isinstance(record, dict)
        ]

    # ------------------------------------------------------------------
    # Analyses
    # ------------------------------------------------------------------

    def save_analysis(self, application_id, data: dict) -> dict:
        return self.put(f"analyses/{application_id}", data)

    def list_analyses(self) -> dict:
        data = self.get("analyses")
        return data or {}

    def get_analysis(self, application_id) -> dict:
        return self.get(f"analyses/{application_id}")


firebase_service = FirebaseService()
