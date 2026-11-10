from sqlalchemy import select
from sqlalchemy.orm import Session
from . import models, schemas


def get_product(db: Session, product_id: int) -> models.Product | None:
    return db.get(models.Product, product_id)


def get_product_by_sku(db: Session, sku: str) -> models.Product | None:
    return db.scalar(select(models.Product).where(models.Product.sku == sku))


def list_products(db: Session, skip: int = 0, limit: int = 20, search: str | None = None):
    stmt = select(models.Product)
    if search:
        stmt = stmt.where(models.Product.name.ilike(f"%{search}%"))
    stmt = stmt.order_by(models.Product.id).offset(skip).limit(limit)
    return db.scalars(stmt).all()


def create_product(db: Session, data: schemas.ProductCreate) -> models.Product:
    product = models.Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)      # reload so we get id and timestamps
    return product


def update_product(db: Session, product: models.Product, data: schemas.ProductUpdate):
    changes = data.model_dump(exclude_unset=True)   # only fields the client sent
    for field, value in changes.items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product: models.Product) -> None:
    db.delete(product)
    db.commit()