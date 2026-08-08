from pydantic import BaseModel, Field


class ApplicationCreate(BaseModel):

    customer_id: int

    loan_amount: float = Field(gt=0)

    loan_term: int = Field(gt=0)

    employment_years: float = Field(ge=0)


class ApplicationResponse(ApplicationCreate):

    id: int

    status: str

    class Config:
        from_attributes = True