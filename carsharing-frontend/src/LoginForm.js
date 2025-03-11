// src/LoginForm.js
import React, { useState } from "react";
import { Link } from 'react-router-dom';

function LoginForm({ onLoginSuccess, setAuthMode }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await fetch("http://127.0.0.1:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                onLoginSuccess(data.token);
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            setError("Network error: " + err.message);
        }
    };

    return (
        <div className="card p-4 animated-card">
            <h4 className="card-title">Login</h4>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-2 position-relative">
                    <label>Username</label>
                    <div className="input-group">
                        <span className="input-group-text">
                            👤
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter your username"
                        />
                    </div>
                </div>
                <div className="form-group mb-3 position-relative">
                    <label>Password</label>
                    <div className="input-group">
                        <span className="input-group-text">
                            🔒
                        </span>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                </div>
                <button className="btn btn-success w-100">Login</button>
            </form>

            <p className="auth-footer">
                Don't have an account?{" "}
                <Link to="/register" className="auth-link">
                    Register
                </Link>
            </p>
        </div>
    );
}

export default LoginForm;
