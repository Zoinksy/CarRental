class TelematicsService:
    @staticmethod
    def unlock_car(vin):
        """
        Sends an unlock command to the car's telematics module.
        In a real implementation, this would likely make an HTTP request or communicate
        via another protocol to the telematics system.
        """
        print(f"Unlocking car with VIN: {vin}")
        # Simulate success
        return {"success": True, "message": "Car unlocked"}

    @staticmethod
    def lock_car(vin):
        """
        Sends a lock command to the car's telematics module.
        """
        print(f"Locking car with VIN: {vin}")
        # Simulate success
        return {"success": True, "message": "Car locked"}
