from ..models import db
from ..models.car import Car
from ..models.rental import Rental
from ..models.user import User

class CarService:

    @staticmethod
    def get_available_cars():
        """
        Business logic to fetch cars that are not currently rented.
        Possibly filter on 'is_available = True' or 'rental_state = idle', etc.
        """
        cars = Car.query.filter_by(available=True).all()
        results = []
        for car in cars:
            results.append({
                "id": car.id,
                "vin": car.vin,
                "location": car.location,
                "locked": car.locked,
                "available": car.available
                # etc.
            })
        return results

    @staticmethod
    def start_rental(current_user, car_id):
        """
        1. Check if car is available in DB.
        2. If available, update DB (mark car as rented).
        3. Send unlock command to telematics (if needed).
        4. Return success or error.
        """
        car = Car.query.get(car_id)
        if not car or not car.is_available:
            return {"success": False, "message": "Car not available"}

        # Mark car as rented
        car.is_available = False
        db.session.add(car)
        # Create a Rental record
        new_rental = Rental(user_id=current_user.id, car_id=car.id, status="ongoing")
        db.session.add(new_rental)
        db.session.commit()

        # Call telematics service or external API to unlock the car if needed
        # telematics.unlock_car(car.vin)

        return {"success": True, "message": "Rental started", "car_id": car.id}

    @staticmethod
    def end_rental(current_user, car_id):
        """
        1. Validate that the user currently has a rental with this car.
        2. Query telematics to confirm car is in correct state.
        3. Mark car as available, update rental record to 'ended'.
        4. Return success or error.
        """
        rental = Rental.query.filter_by(user_id=current_user.id, car_id=car_id, status="ongoing").first()
        if not rental:
            return {"success": False, "message": "No active rental for this user/car"}

        # Check car state from telematics if needed
        # telematics_state = telematics.get_state(rental.car.vin)
        # if not telematics_state["doors_closed"]:
        #     return {"success": False, "message": "Doors are not closed!"}

        # Mark car as available
        car = Car.query.get(car_id)
        car.is_available = True
        db.session.add(car)

        # Update rental
        rental.status = "ended"
        db.session.add(rental)
        db.session.commit()

        return {"success": True, "message": "Rental ended", "car_id": car.id}
