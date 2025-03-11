// src/LoginPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import './styles/index.css';
import './styles/Login.css';

function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();

  const handleLoginSuccess = (token) => {
    onLoginSuccess(token);
    navigate('/'); // redirect to dashboard after login
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to your account</p>
        </div>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}

export default LoginPage;
