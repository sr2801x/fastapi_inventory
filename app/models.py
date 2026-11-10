from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from .database import Base


class Product(Base):
    __tablename__ = "products"
#each calss attribute becomes the column in the table. The mapped_column function is used to define the column type and constraints.
    id: Mapped[int] = mapped_column(primary_key=True)
    sku: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    #sku-stock keeping unit is the products unique code.unique=true database itself refuses duplicates
    #index=true makes searching sku fast.
    name: Mapped[str] = mapped_column(String(100))
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    price: Mapped[float] = mapped_column(Float)
    quantity: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(#refreshes automatically wheneever the row changes
        DateTime, server_default=func.now(), onupdate=func.now()
    )
