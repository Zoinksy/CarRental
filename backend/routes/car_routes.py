from flask import Blueprint, request, jsonify
from ..services.token_decorator import token_required
from ..services.car_service import CarService

car_bp = Blueprint('car_bp', __name__)

@car_bp.route('/', methods=['GET'])
@token_required
def query_available_cars(current_user):
    """
    Query the cars available for rental.
    JWT token is validated by @token_required.
    """
    try:
        available_cars = CarService.get_available_cars()
        return jsonify({"success": True, "cars": available_cars}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@car_bp.route('/start_rental', methods=['POST'])
@token_required
def start_rental(current_user):
    """
    Start rental for a given car.
    """
    data = request.get_json()
    car_id = data.get('car_id')
    # You might also want to validate 'car_id' is present, etc.
    if not car_id:
        return jsonify({"success": False, "message": "Missing car_id"}), 400

    result = CarService.start_rental(current_user, car_id)
    if result["success"]:
        return jsonify(result), 200
    else:
        return jsonify(result), 400

@car_bp.route('/end_rental', methods=['POST'])
@token_required
def end_rental(current_user):
    """
    End rental for a given car.
    """
    data = request.get_json()
    car_id = data.get('car_id')
    if not car_id:
        return jsonify({"success": False, "message": "Missing car_id"}), 400

    result = CarService.end_rental(current_user, car_id)

    if result["success"]:
        return jsonify(result), 200
    else:
        return jsonify(result), 400
