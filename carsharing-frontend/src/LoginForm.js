// src/LoginForm.js
import React, { useState } from "react";

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
                <div className="form-group mb-2">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="btn btn-success w-100">Login</button>
            </form>

            <p className="mt-3 text-center">
                Do not have an account?{" "}
                <a href="/register">Register</a>
            </p>
        </div>
    );
}

export default LoginForm;
