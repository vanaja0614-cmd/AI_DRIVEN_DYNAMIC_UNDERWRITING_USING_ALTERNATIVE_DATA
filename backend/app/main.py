from fastapi import FastAPI

from app.core.config import settings
from app.core.logging_config import configure_logging

from app.database.base import Base
from app.database.connection import engine

from app.api import (
    applications,
    consent,
    risk,
    fraud,
    fairness,
    explanations,
    monitoring,
    health,
    firebase,
    assistant,
    users,
    customers
)


configure_logging()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "TrustFlow AI - AI-powered "
        "digital underwriting and fraud detection platform"
    )
)


# Dev-only lightweight migration: create_all doesn't alter existing tables,
# so add the new consent columns idempotently.
from sqlalchemy import inspect, text  # noqa: E402


def _apply_dev_migrations():
    inspector = inspect(engine)
    if "consents" in inspector.get_table_names():
        columns = {c["name"] for c in inspector.get_columns("consents")}
        additions = {
            "employment_signals_consent": "BOOLEAN DEFAULT 0",
            "professional_presence_consent": "BOOLEAN DEFAULT 0",
            "digital_signals_consent": "BOOLEAN DEFAULT 0",
            "public_data_consent": "BOOLEAN DEFAULT 0",
        }
        with engine.begin() as conn:
            for name, ddl in additions.items():
                if name not in columns:
                    conn.execute(text(
                        f"ALTER TABLE consents ADD COLUMN {name} {ddl}"
                    ))


Base.metadata.create_all(
    bind=engine
)

_apply_dev_migrations()


app.include_router(
    applications.router
)

app.include_router(
    consent.router
)

app.include_router(
    risk.router
)

app.include_router(
    fraud.router
)

app.include_router(
    fairness.router
)

app.include_router(
    explanations.router
)

app.include_router(
    monitoring.router
)

app.include_router(
    health.router
)

app.include_router(
    firebase.router
)

app.include_router(
    assistant.router
)

app.include_router(
    users.router
)

app.include_router(
    customers.router
)


@app.get("/")
def root():

    return {
        "application": "TrustFlow AI",
        "version": settings.APP_VERSION,
        "status": "running"
    }