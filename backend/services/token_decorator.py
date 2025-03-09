import os
import jwt
from functools import wraps
from flask import request, jsonify
from ..config import Config
from sqlalchemy.exc import SQLAlchemyError
from ..models import User

JWT_SECRET = Config.SECRET_KEY
if not JWT_SECRET:
    raise Exception("SECRET_KEY environment variable is not set")

JWT_ALGORITHM = "HS256"

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", None)
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"success": False, "message": "Missing or invalid token"}), 401

        token = auth_header.split(" ")[1]

        try:
            decoded = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            return jsonify({"success": False, "message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"success": False, "message": "Invalid token"}), 401

        user_id = decoded.get("sub")
        if not user_id:
            return jsonify({"success": False, "message": "No user subject in token"}), 401

        try:
            user = User.query.get(user_id)
            if not user:
                return jsonify({"success": False, "message": "User does not exist"}), 401
        except SQLAlchemyError as e:
            return jsonify({"success": False, "message": f"DB error: {str(e)}"}), 500

        return f(user, *args, **kwargs)
    return decorated
