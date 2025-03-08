from flask import Flask
from .models import db          # Relative import within backend
from .config import Config      # Relative import for config
from .routes.auth_routes import auth_bp  # Relative import for routes

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize DB
    db.init_app(app)

    @app.route("/")
    def home():
        return "Hello, this is the CarRental backend."
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    # app.register_blueprint(car_bp, url_prefix="/cars")
    # app.register_blueprint(rental_bp, url_prefix="/rental")

    return app

# This part actually starts the Flask dev server when you run python -m backend.app
if __name__ == "__main__":
    application = create_app()
    application.run(debug=True)
