import os
import datetime
import jwt
from sqlalchemy.exc import SQLAlchemyError
from ..models import db
from ..models.user import User
from werkzeug.security import generate_password_hash, check_password_hash

# Load SECRET_KEY from env or config
JWT_SECRET = os.getenv("SECRET_KEY", "development-secret")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 1

class AuthService:

    @staticmethod
    def register_user(username: str, password: str):

        if not username or not password:
            return {"success": False, "message": "Missing username or password"}

        if len(password) < 6:
            return {"success": False, "message": "Password must be at least 6 characters"}

        try:
            existing = User.query.filter_by(username=username).first()
            if existing:
                return {"success": False, "message": "Username already taken"}

            new_user = User(username=username)
            new_user.set_password(password)

            db.session.add(new_user)
            db.session.commit()

            return {
                "success": True,
                "message": "Registered successfully",
                "user_id": new_user.id
            }
        except SQLAlchemyError as e:
            db.session.rollback()
            return {
                "success": False,
                "message": f"Database error: {str(e)}"
            }

    @staticmethod
    def login_user(username: str, password: str):

        if not username or not password:
            return {"success": False, "message": "Missing username or password"}

        try:
            user = User.query.filter_by(username=username).first()
            if not user:
                return {"success": False, "message": "User not found"}

            if user.check_password(password):
                expiry = datetime.datetime.utcnow() + datetime.timedelta(hours=JWT_EXPIRE_HOURS)
                payload = {
                    "sub": user.id,        # subject: the user's ID
                    "exp": expiry,         # expiration time
                    "username": user.username
                }
                token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

                return {
                    "success": True,
                    "message": "Login successful",
                    "token": token,
                    "user_id": user.id
                }
            else:
                return {"success": False, "message": "Invalid credentials"}

        except SQLAlchemyError as e:
            return {
                "success": False,
                "message": f"Database error: {str(e)}"
            }
