// src/LandingPage.js
import React from "react";
import { Link } from "react-router-dom";
import carImage from "./assets/car-illustration.png";
import "./index.css";

function LandingPage({ token, onLogout }) {
    return (
        <>
            <div className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1>Go Green and Share the Ride</h1>
                        <p>Enjoy a safe trip with our CarSharing service, saving the planet one ride at a time.</p>
                        {!token ? (
                            <div className="hero-buttons">
                                <Link to="/login" className="btn btn-success">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary">
                                    Register
                                </Link>
                            </div>
                        ) : (
                            <div className="hero-buttons">
                                <button className="btn btn-danger" onClick={onLogout}>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="hero-illustration">
                        <img src={carImage} alt="Car" />
                    </div>
                </div>
            </div>
            <div className="features-section">
                <h2>Why Choose Us?</h2>
                <div className="features">
                    <div className="feature">
                        <h3>Eco-Friendly</h3>
                        <p>Reduce your carbon footprint by sharing rides with others.</p>
                    </div>
                    <div className="feature">
                        <h3>Cost-Effective</h3>
                        <p>Save money on fuel and maintenance by sharing the cost with others.</p>
                    </div>
                    <div className="feature">
                        <h3>Convenient</h3>
                        <p>Book a ride anytime, anywhere with our easy-to-use app.</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LandingPage;
