from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from sqlalchemy.exc import SQLAlchemyError

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
    ),
    openapi_tags=[
        {"name": "health", "description": "Liveness and readiness probes"},
        {"name": "applications", "description": "Loan applications"},
        {"name": "customers", "description": "Customers"},
        {"name": "consent", "description": "Data consent management"},
        {"name": "risk", "description": "Risk scoring"},
        {"name": "fraud", "description": "Fraud detection"},
        {"name": "fairness", "description": "Fairness and cohort metrics"},
        {"name": "explanations", "description": "Model explanations"},
        {"name": "monitoring", "description": "System monitoring"},
        {"name": "assistant", "description": "AI assistant agents"},
        {"name": "firebase", "description": "Firebase sync"},
        {"name": "users", "description": "User management"},
    ],
)

# CORS: allow the configured dev/prod origins to call the API directly.
origins = [
    origin.strip()
    for origin in settings.CORS_ORIGINS.split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global error handling: turn unexpected failures and validation problems
# into consistent JSON responses instead of HTML stack traces.
@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_error_handler(request: Request, exc: SQLAlchemyError):
    return JSONResponse(
        status_code=500,
        content={"detail": "A database error occurred. Please try again."},
    )


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation failed", "errors": exc.errors()},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred."},
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


ROUTERS = [
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
    customers,
]

for module in ROUTERS:
    app.include_router(module.router)


@app.get("/")
def root():

    return {
        "application": "TrustFlow AI",
        "version": settings.APP_VERSION,
        "status": "running"
    }