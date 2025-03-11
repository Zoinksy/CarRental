// src/components/AvailableCars.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './index.css';

const AvailableCars = () => {
  const [carsData, setCarsData] = useState({
    active_rentals: [],
    available_cars: [],
    unavailable_cars: []
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  
  // Decodificăm token-ul pentru a obține ID-ul utilizatorului
  const currentUserId = token ? jwtDecode(token).sub : null;

  // Obține mașinile de la backend
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/cars/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.data.success) {
          setCarsData({
            active_rentals: response.data.active_rentals || [],
            available_cars: response.data.available_cars || [],
            unavailable_cars: response.data.unavailable_cars || []
          });
          setMessage('');
        } else {
          setMessage(response.data.message || 'Failed to fetch cars');
        }
      })
      .catch(error => {
        console.error('Error fetching cars:', error.response || error);
        setMessage('Error fetching cars');
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Funcția pentru începerea închirierii
  const startRental = (carId) => {
    setLoading(true);
    axios.post('http://localhost:5000/cars/start_rental', { car_id: carId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.data.success) {
          setMessage(`Închiriere începută pentru mașina cu id ${carId}`);
          // Actualizează state-ul: mută mașina din available_cars în active_rentals
          setCarsData(prevData => {
            const carToRent = prevData.available_cars.find(car => car.id === carId);
            return {
              ...prevData,
              available_cars: prevData.available_cars.filter(car => car.id !== carId),
              active_rentals: [...prevData.active_rentals, { ...carToRent, rental: { user_id: currentUserId } }]
            };
          });
        } else {
          setMessage(response.data.message || 'Failed to start rental');
        }
      })
      .catch(error => {
        console.error('Error starting rental:', error.response || error);
        setMessage('Error starting rental');
      })
      .finally(() => setLoading(false));
  };

  // Funcția pentru încheierea închirierii
  const endRental = (carId) => {
    setLoading(true);
    axios.post('http://localhost:5000/cars/end_rental', { car_id: carId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.data.success) {
          setMessage(`Închirierea pentru mașina cu id ${carId} a fost încheiată.`);
          // Actualizează state-ul: elimină mașina din active_rentals și adaug-o în available_cars
          setCarsData(prevData => {
            const endedCar = prevData.active_rentals.find(car => car.id === carId);
            return {
              ...prevData,
              active_rentals: prevData.active_rentals.filter(car => car.id !== carId),
              available_cars: [...prevData.available_cars, { ...endedCar, available: true, rental: null }]
            };
          });
        } else {
          setMessage(response.data.message || 'Failed to end rental');
        }
      })
      .catch(error => {
        console.error('Error ending rental:', error.response || error);
        setMessage('Error ending rental');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Mașini</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Înapoi
        </button>
      </div>
      {loading && <p className="text-info">Se încarcă...</p>}
      {message && <div className="alert alert-info">{message}</div>}

      {/* Secțiunea 1: Închirieri active */}
      <section className="mb-4">
        <h2>Închirieri active</h2>
        {carsData.active_rentals.length > 0 ? (
          <div className="row">
            {carsData.active_rentals.map(car => (
              <div key={car.id} className="col-md-4 mb-3">
                <div className="card car-card">
                  <div className="card-body">
                    <h5 className="card-title">{car.vin}</h5>
                    <p className="card-text">{car.location}</p>
                    <button className="btn btn-danger" onClick={() => endRental(car.id)}>
                      Încheie Închirierea
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">Nu ai închirieri active.</p>
        )}
      </section>

      {/* Secțiunea 2: Mașini disponibile */}
      <section className="mb-4">
        <h2>Mașini disponibile pentru închiriere</h2>
        {carsData.available_cars.length > 0 ? (
          <div className="row">
            {carsData.available_cars.map(car => (
              <div key={car.id} className="col-md-4 mb-3">
                <div className="card car-card">
                  <div className="card-body">
                    <h5 className="card-title">{car.vin}</h5>
                    <p className="card-text">{car.location}</p>
                    <button className="btn btn-success" onClick={() => startRental(car.id)}>
                      Începe Închirierea
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">Nu există mașini disponibile pentru închiriere.</p>
        )}
      </section>

      {/* Secțiunea 3: Mașini indisponibile */}
      <section className="mb-4">
        <h2>Mașini indisponibile</h2>
        {carsData.unavailable_cars.length > 0 ? (
          <div className="row">
            {carsData.unavailable_cars.map(car => (
              <div key={car.id} className="col-md-4 mb-3">
                <div className="card car-card">
                  <div className="card-body">
                    <h5 className="card-title">{car.vin}</h5>
                    <p className="card-text">{car.location}</p>
                    <button className="btn btn-secondary" disabled>
                      Not available for now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">Toate mașinile sunt fie disponibile, fie închiriate de tine.</p>
        )}
      </section>
    </div>
  );
};

export default AvailableCars;
