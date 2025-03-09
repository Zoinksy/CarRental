# rental.py
from . import db
from sqlalchemy import func

class Rental(db.Model):
    __tablename__ = 'rentals'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    car_id = db.Column(db.Integer, db.ForeignKey("cars.id"), nullable=False)
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)
    status = db.Column(db.String(20), default="active")
    created_at = db.Column(db.DateTime, server_default=func.now())

    # relationships
    # user = db.relationship("User", back_populates="rentals")
    # car = db.relationship("Car", back_populates="rentals")
