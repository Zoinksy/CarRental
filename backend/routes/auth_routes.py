from flask import Blueprint, request, jsonify
from ..services.auth_service import AuthService

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json(force=True)
    except:
        return jsonify({"success": False, "message": "Invalid or missing JSON"}), 400

    username = data.get("username")
    password = data.get("password")

    # Basic input validation
    if not username or not password:
        return jsonify({"success": False, "message": "Missing username or password"}), 400

    result = AuthService.register_user(username, password)

    if result["success"]:
        return jsonify(result), 201
    else:
        return jsonify(result), 400

@auth_bp.route("/login", methods=["POST"])
def login():

    try:
        data = request.get_json(force=True)
    except:
        return jsonify({"success": False, "message": "Invalid or missing JSON"}), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"success": False, "message": "Missing username or password"}), 400

    result = AuthService.login_user(username, password)

    if result["success"]:
        return jsonify(result), 200
    else:
        return jsonify(result), 401

@auth_bp.route("/users", methods=["GET"])
def get_users():

    from ..models.user import User  # or wherever your User model is
    users = User.query.all()

    # Convert each User object to a dict
    user_list = []
    for u in users:
        user_list.append({
            "id": u.id,
            "username": u.username,
            "created_at": u.created_at.isoformat() if u.created_at else None
        })

    return jsonify({"success": True, "users": user_list}), 200

@auth_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    from ..models.user import User
    user = User.query.get(user_id)
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    user_data = {
        "id": user.id,
        "username": user.username,
        "created_at": user.created_at.isoformat() if user.created_at else None
    }
    return jsonify({"success": True, "user": user_data}), 200

