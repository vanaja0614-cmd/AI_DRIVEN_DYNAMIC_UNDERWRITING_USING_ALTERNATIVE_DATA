from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.customer import CustomerCreate, CustomerResponse
from app.services.customer_service import CustomerService


router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
)


@router.post("/", response_model=CustomerResponse)
def create_customer(
    data: CustomerCreate,
    db: Session = Depends(get_db),
):
    try:
        return CustomerService.create(db, data)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail=(
                "An account already exists for this email. "
                "Please use a different email address."
            ),
        )


@router.get("/{customer_id}")
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
):

    customer = CustomerService.get(db, customer_id)

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    return customer
