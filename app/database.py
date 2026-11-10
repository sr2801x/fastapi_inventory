from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = "sqlite:///./inventory.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False)#creates session(session is a one conversation with the database.)


class Base(DeclarativeBase):#Base is the parent class for our class tables.
    pass


def get_db():#gives each request its own session and always closes it afterwards
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()