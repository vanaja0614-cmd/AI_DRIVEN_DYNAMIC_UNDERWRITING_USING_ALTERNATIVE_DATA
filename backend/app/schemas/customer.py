from pydantic import BaseModel, Field


class CustomerCreate(BaseModel):

    name: str = Field(min_length=1)

    email: str = Field(min_length=1)

    income: float = Field(ge=0)

    credit_score: int = Field(ge=300, le=900)


class CustomerResponse(CustomerCreate):

    id: int

    class Config:
        from_attributes = True

