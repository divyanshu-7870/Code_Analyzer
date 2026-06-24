from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.db.database import Base


class Review (Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(Text, nullable=False)
    language = Column(String, nullable=False)
    issues = Column(Text, nullable=False)
    score = Column(Integer, nullable=False)
    summary = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())