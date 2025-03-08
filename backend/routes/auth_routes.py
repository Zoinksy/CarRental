from flask import Blueprint, request, jsonify
from services.auth_service import AuthService

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
