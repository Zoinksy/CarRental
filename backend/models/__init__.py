from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User
from .car import Car
from .rental import Rental
