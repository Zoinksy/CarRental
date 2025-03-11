// src/RegisterPage.js
import React from "react";
import RegisterForm from "./RegisterForm";
import './styles/index.css';
import './styles/Register.css';

function RegisterPage() {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Join our community today</p>
                </div>
                <RegisterForm />
            </div>
        </div>
    );
}

export default RegisterPage;
