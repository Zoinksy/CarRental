// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";

function App() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    const handleLoginSuccess = (newToken) => {
        setToken(newToken);
        localStorage.setItem("token", newToken);
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem("token");
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={<LandingPage token={token} onLogout={handleLogout} />}
                />
                <Route
                    path="/register"
                    element={<RegisterPage />}
                />
                <Route
                    path="/login"
                    element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
                />
            </Routes>
        </Router>
    );
}

export default App;
