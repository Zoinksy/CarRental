import os

class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:1234@localhost:5432/carsharing_db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "daDoamnesatrecem"
