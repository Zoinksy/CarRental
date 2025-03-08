from flask import Flask
from models import db
from config import Config
from routes.auth_routes import auth_bp
# from routes.car_routes import car_bp
# from routes.rental_routes import rental_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)         # initialize DB
   # with app.app_context():
       # db.create_all()

    # Register your blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    # app.register_blueprint(car_bp, url_prefix="/cars")
    # app.register_blueprint(rental_bp, url_prefix="/rental")

    return app
