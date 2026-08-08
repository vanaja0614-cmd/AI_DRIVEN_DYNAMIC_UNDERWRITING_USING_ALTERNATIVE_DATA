from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "TrustFlow AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    DATABASE_URL: str = (
        "postgresql://trustflow:trustflow_password@localhost:5432/trustflow"
    )

    SECRET_KEY: str = "change-this-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    RISK_MODEL_PATH: str = "ml/models/risk_model.pkl"
    FRAUD_MODEL_PATH: str = "ml/models/fraud_model.pkl"

    FIREBASE_DB_URL: str = (
        "https://trustflow-5f98e-default-rtdb.firebaseio.com"
    )

    # Firebase Realtime Database
    FIREBASE_DATABASE_URL: str = (
        "https://trustflow-5f98e-default-rtdb.firebaseio.com/"
    )
    # Path to the Firebase service account JSON (optional; if absent the
    # app falls back to querying the public REST endpoint).
    FIREBASE_CREDENTIALS_PATH: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()