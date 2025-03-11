from ..models import db
from ..models.car import Car
from ..models.rental import Rental
from .telematic_service import TelematicsService
from ..models.user import User

class CarService:
    @staticmethod
    def get_cars_by_category(current_user):
        all_cars = Car.query.all()
        active_rentals = []
        available_cars = []
        unavailable_cars = []
        for car in all_cars:
            # Caută o închiriere activă pentru utilizatorul curent pentru această mașină
            if current_user:
                active_rental = Rental.query.filter_by(user_id=current_user.id, car_id=car.id, status="ongoing").first()
            else:
                active_rental = None

            if active_rental:
                active_rentals.append(car.to_dict())
            elif car.available:
                available_cars.append(car.to_dict())
            else:
                unavailable_cars.append(car.to_dict())

        return {
            "active_rentals": active_rentals,
            "available_cars": available_cars,
            "unavailable_cars": unavailable_cars
        }

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

        try:
            # Marcheză mașina ca indisponibilă
            car.available = False
            db.session.add(car)

            # Creează o înregistrare pentru închiriere
            rental = Rental(user_id=current_user.id, car_id=car.id, status="ongoing")
            db.session.add(rental)
            db.session.commit()

            # Apelează serviciul de telematică pentru deblocare
            unlock_result = TelematicsService.unlock_car(car.vin)
            if not unlock_result.get("success"):
                db.session.rollback()
                return {"success": False, "message": "Nu s-a putut debloca mașina."}

            return {"success": True, "message": "Închiriere începută cu succes.", "rental_id": rental.id,
                    "car_id": car.id}
        except Exception as e:
            db.session.rollback()
            return {"success": False, "message": f"Eroare la începerea închirierii: {str(e)}"}

    @staticmethod
    def end_rental(current_user, car_id):
        """
        1. Verifică dacă utilizatorul are o închiriere activă pentru mașina cu ID-ul dat.
        2. Apelează serviciul de telematică pentru a bloca mașina.
        3. Actualizează înregistrarea de închiriere (status = "ended") și marchează mașina ca disponibilă.
        4. Returnează un mesaj de succes sau eroare.
        """
        rental = Rental.query.filter_by(user_id=current_user.id, car_id=car_id, status="ongoing").first()
        if not rental:
            return {"success": False, "message": "Nu există o închiriere activă pentru această mașină și utilizator."}

        car = Car.query.get(car_id)
        if not car:
            return {"success": False, "message": "Mașina nu a fost găsită."}

        try:
            # Apelăm serviciul de telematică pentru a bloca mașina.
            lock_result = TelematicsService.lock_car(car.vin)
            if not lock_result.get("success"):
                return {"success": False, "message": "Nu s-a putut bloca mașina."}

            # Actualizăm înregistrarea de închiriere și starea mașinii.
            rental.status = "ended"
            car.available = True
            db.session.commit()

            return {"success": True, "message": "Închirierea a fost încheiată cu succes.", "car_id": car.id}
        except Exception as e:
            db.session.rollback()
            return {"success": False, "message": f"Eroare la încheierea închirierii: {str(e)}"}
