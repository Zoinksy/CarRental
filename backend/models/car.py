# car.py
from . import db
from sqlalchemy import func

class Car(db.Model):
    __tablename__ = 'cars'

    id = db.Column(db.Integer, primary_key=True)
    vin = db.Column(db.String(50), unique=True, nullable=False)
    location = db.Column(db.String(100))
    locked = db.Column(db.Boolean, default=True)
    available = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, server_default=func.now())

    @property
    def is_available(self):
        return self.available

    def to_dict(self):
        return {
            "id": self.id,
            "vin": self.vin,
            "location": self.location,
            "locked": self.locked,
            "available": self.available,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
