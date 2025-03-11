// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import AvailableCars from './AvailableCars';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage token={token} onLogout={handleLogout} />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/cars"
          element={token ? <AvailableCars /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
