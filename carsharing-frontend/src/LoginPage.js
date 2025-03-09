// src/LoginPage.js
import React from "react";
import LoginForm from "./LoginForm";

function LoginPage({ onLoginSuccess }) {
    return (
        <div className="container" style={{ marginTop: "2rem" }}>
            <h2>Login</h2>
            <LoginForm onLoginSuccess={onLoginSuccess} />
        </div>
    );
}

export default LoginPage;
