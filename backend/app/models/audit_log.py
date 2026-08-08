from sqlalchemy import Column, Integer, String, ForeignKey

from app.database.base import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    application_id = Column(
        Integer,
        ForeignKey("applications.id"),
        nullable=False
    )

    action = Column(String(100), nullable=False)

    details = Column(String(500))
