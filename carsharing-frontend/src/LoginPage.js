// src/LoginPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";

function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ marginTop: "2rem" }}>
      <h2>Login</h2>
      <LoginForm
        onLoginSuccess={(token) => {
          onLoginSuccess(token);
          navigate('/'); // redirect to dashboard after login
        }}
      />
    </div>
  );
}

export default LoginPage;
