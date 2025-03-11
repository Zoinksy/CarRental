// src/components/AvailableCars.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import './index.css';

const AvailableCars = () => {
  const [cars, setCars] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Decode token to get current user id
  const currentUserId = token ? jwt_decode(token).sub : null;

  // Fetch all cars when component mounts.
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/cars/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.data.success) {
          setCars(response.data.cars);
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

  // Function to start rental for a given car.
  const startRental = (carId) => {
    setLoading(true);
    axios.post('http://localhost:5000/cars/start_rental', { car_id: carId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.data.success) {
          setMessage(`Rental started for car with id ${carId}`);
          // Remove the car from the available list (it may appear in active rentals)
          setCars(cars.map(car => {
            if (car.id === carId) {
              // Simulate that this car now has an active rental for the current user.
              return { ...car, available: false, rental: { user_id: currentUserId } };
            }
            return car;
          }));
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

  // Function to end rental for a given car.
  const endRental = (carId) => {
    setLoading(true);
    axios.post('http://localhost:5000/cars/end_rental', { car_id: carId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.data.success) {
          setMessage(`Rental ended for car with id ${carId}`);
          // Update the car to mark it as available and remove active rental info.
          setCars(cars.map(car => {
            if (car.id === carId) {
              return { ...car, available: true, rental: null };
            }
            return car;
          }));
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

  // Filter cars into three categories:
  const activeRentals = cars.filter(car => car.rental && car.rental.user_id === currentUserId);
  const availableCars = cars.filter(car => car.available === true);
  const unavailableCars = cars.filter(car => !car.available && !(car.rental && car.rental.user_id === currentUserId));

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

      {/* Section 1: Active Rentals */}
      <section className="mb-4">
        <h2>Închirieri active</h2>
        {activeRentals.length > 0 ? (
          <div className="row">
            {activeRentals.map(car => (
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

      {/* Section 2: Available Cars */}
      <section className="mb-4">
        <h2>Mașini disponibile pentru închiriere</h2>
        {availableCars.length > 0 ? (
          <div className="row">
            {availableCars.map(car => (
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

      {/* Section 3: Unavailable Cars */}
      <section className="mb-4">
        <h2>Mașini indisponibile</h2>
        {unavailableCars.length > 0 ? (
          <div className="row">
            {unavailableCars.map(car => (
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
