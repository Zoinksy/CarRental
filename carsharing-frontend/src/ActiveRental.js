// src/components/ActiveRental.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ActiveRental = () => {
  const [carId, setCarId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleEndRental = () => {
    if (!carId) {
      setMessage('Te rog să introduci ID-ul mașinii pentru închiriere.');
      return;
    }
    setLoading(true);
    axios.post('http://localhost:5000/cars/end_rental', { car_id: carId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.data.success) {
          setMessage(`Închirierea pentru mașina cu ID ${carId} a fost încheiată.`);
        } else {
          setMessage(response.data.message || 'Nu s-a putut încheia închirierea.');
        }
      })
      .catch(error => {
        console.error('Eroare la încheierea închirierii:', error.response || error);
        setMessage('Eroare la încheierea închirierii.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Încheie Închirierea</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Înapoi
        </button>
      </div>
      <div className="mb-3">
        <label>Introdu ID-ul mașinii închiriate:</label>
        <input
          type="number"
          className="form-control"
          value={carId}
          onChange={(e) => setCarId(e.target.value)}
          placeholder="ID Mașină"
        />
      </div>
      <button className="btn btn-danger" onClick={handleEndRental}>
        Încheie Închirierea
      </button>
      {loading && <p className="text-info mt-3">Se procesează...</p>}
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default ActiveRental;
