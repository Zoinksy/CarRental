// src/RegisterForm.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function RegisterForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage(null);
        setIsLoading(true);

        try {
            const res = await fetch("http://127.0.0.1:5000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setMessage("Registration successful! Redirecting to login...");
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setMessage(data.message || "Registration failed.");
            }
        } catch (err) {
            setMessage("Network error: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card p-4 animated-card">
            <h4 className="card-title">Create Account</h4>
            {message && (
                <div className={`alert ${message.includes('successful') ? 'alert-info' : 'alert-danger'}`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleRegister}>
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
                            placeholder="Choose a username"
                            minLength="3"
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
                            placeholder="Create a strong password"
                            minLength="6"
                        />
                    </div>
                    <small className="text-muted mt-1">Password must be at least 6 characters long</small>
                </div>
                <button 
                    className="btn btn-primary w-100" 
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Creating account...
                        </span>
                    ) : (
                        'Create Account'
                    )}
                </button>
            </form>

            <p className="auth-footer">
                Already have an account?{" "}
                <Link to="/login" className="auth-link">
                    Login
                </Link>
            </p>
        </div>
    );
}

export default RegisterForm;
