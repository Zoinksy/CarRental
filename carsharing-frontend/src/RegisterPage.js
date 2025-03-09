// src/RegisterPage.js
import React from "react";
import RegisterForm from "./RegisterForm";

function RegisterPage() {
    return (
        <div className="container" style={{ marginTop: "2rem" }}>
            <h2>Register</h2>
            <RegisterForm />
        </div>
    );
}

export default RegisterPage;
