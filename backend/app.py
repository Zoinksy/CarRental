from flask import Flask
from .models import db          # Relative import within backend
from .config import Config      # Relative import for config
from .routes.auth_routes import auth_bp  # Relative import for routes
from .routes.car_routes import car_bp # import pt rutele la masini


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize DB
    db.init_app(app)

    #with app.app_context():
      #  db.create_all()

    @app.route("/")
    def home():
        return "Hello, this is the CarRental backend."
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(car_bp, url_prefix="/cars")
    return app

# This part actually starts the Flask dev server when you run python -m backend.app
if __name__ == "__main__":
    application = create_app()
    application.run(debug=True)
