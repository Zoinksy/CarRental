// src/RegisterForm.js
import React, { useState } from "react";

function RegisterForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            const res = await fetch("http://127.0.0.1:5000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setMessage("Registration successful! You can now log in.");
            } else {
                setMessage(data.message || "Registration failed.");
            }
        } catch (err) {
            setMessage("Network error: " + err.message);
        }
    };

    return (
        <div className="card p-4 animated-card">
            <h4 className="card-title">Register</h4>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleRegister}>
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
                <button className="btn btn-primary w-100">Register</button>
            </form>

            <p className="mt-3 text-center">
                Already have an account?{" "}
                <a href="/login">Login</a>
            </p>
        </div>
    );
}

export default RegisterForm;
