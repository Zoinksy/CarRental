# config.py
import os

# config.py (example)
class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:1234@localhost:5432/carsharing_db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get("SECRET_KEY", "development-secret")
    print("Config.SECRET_KEY =", SECRET_KEY)
