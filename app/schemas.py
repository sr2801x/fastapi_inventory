from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator


class ProductBase(BaseModel):
    sku: str = Field(min_length=3, max_length=50)
    name: str = Field(min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    price: float = Field(gt=0)
    quantity: int = Field(default=0, ge=0)

    @field_validator("sku")
    @classmethod
    def clean_sku(cls, v: str) -> str:
        return v.strip().upper()

    @field_validator("name")
    @classmethod
    def clean_name(cls, v: str) -> str:
        return v.strip()


class ProductCreate(ProductBase):
    """Data accepted when creating a product."""


class ProductUpdate(BaseModel):
    """All fields optional: the client sends only what it wants to change."""
    name: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    price: float | None = Field(default=None, gt=0)
    quantity: int | None = Field(default=None, ge=0)


class ProductOut(ProductBase):
    """Data returned to the client."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime