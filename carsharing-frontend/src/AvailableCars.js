// src/components/AvailableCars.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './styles/index.css';
import './styles/AvailableCars.css';

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
    const carToRent = carsData.available_cars.find(car => car.id === carId);
    
    // Update state optimistically before the API call
    setCarsData(prevData => ({
      ...prevData,
      available_cars: prevData.available_cars.filter(car => car.id !== carId),
      active_rentals: [...prevData.active_rentals, { ...carToRent, rental: { user_id: currentUserId } }]
    }));

    setMessage(`Închiriere începută pentru mașina ${carToRent.vin}`);

    axios.post('http://localhost:5000/cars/start_rental', { car_id: carId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.data.success) {
          // Revert changes if the API call fails
          setCarsData(prevData => ({
            ...prevData,
            available_cars: [...prevData.available_cars, carToRent],
            active_rentals: prevData.active_rentals.filter(car => car.id !== carId)
          }));
          setMessage(response.data.message || 'Failed to start rental');
        }
      })
      .catch(error => {
        // Revert changes on error
        setCarsData(prevData => ({
          ...prevData,
          available_cars: [...prevData.available_cars, carToRent],
          active_rentals: prevData.active_rentals.filter(car => car.id !== carId)
        }));
        console.error('Error starting rental:', error.response || error);
        setMessage('Error starting rental');
      })
      .finally(() => setLoading(false));
  };

  // Funcția pentru încheierea închirierii
  const endRental = (carId) => {
    setLoading(true);
    const carToEnd = carsData.active_rentals.find(car => car.id === carId);

    // Update state optimistically before the API call
    setCarsData(prevData => ({
      ...prevData,
      active_rentals: prevData.active_rentals.filter(car => car.id !== carId),
      available_cars: [...prevData.available_cars, { ...carToEnd, available: true, rental: null }]
    }));

    setMessage(`Închirierea pentru mașina ${carToEnd.vin} a fost încheiată.`);

    axios.post('http://localhost:5000/cars/end_rental', { car_id: carId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.data.success) {
          // Revert changes if the API call fails
          setCarsData(prevData => ({
            ...prevData,
            active_rentals: [...prevData.active_rentals, carToEnd],
            available_cars: prevData.available_cars.filter(car => car.id !== carId)
          }));
          setMessage(response.data.message || 'Failed to end rental');
        }
      })
      .catch(error => {
        // Revert changes on error
        setCarsData(prevData => ({
          ...prevData,
          active_rentals: [...prevData.active_rentals, carToEnd],
          available_cars: prevData.available_cars.filter(car => car.id !== carId)
        }));
        console.error('Error ending rental:', error.response || error);
        setMessage('Error ending rental');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="cars-container">
      <div className="section-header">
        <h1>Mașini</h1>
        <button className="btn-back" onClick={() => navigate('/')}>Înapoi</button>
      </div>
      
      {loading && <p className="loading-spinner">Se încarcă...</p>}
      {message && <div className="alert-custom">{message}</div>}

      {/* Secțiunea 1: Închirieri active */}
      <section className="cars-section">
        <h2>Închirieri active</h2>
        <div className="row">
          {carsData.active_rentals.map(car => (
            <div key={car.id} className="col-md-4 mb-4">
              <div className="car-card">
                <div className="card-body">
                  <h5 className="card-title">{car.vin}</h5>
                  <p className="card-text">{car.location}</p>
                  <button className="btn-end-rental" onClick={() => endRental(car.id)}>
                    Încheie Închirierea
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Secțiunea 2: Mașini disponibile */}
      <section className="cars-section">
        <h2>Mașini disponibile pentru închiriere</h2>
        {carsData.available_cars.length > 0 ? (
          <div className="row g-4">
            {carsData.available_cars.map(car => (
              <div key={car.id} className="col-12 col-md-4 mb-3">
                <div className="car-card">
                  <div className="card-body">
                    <h5 className="card-title">{car.vin}</h5>
                    <p className="card-text">{car.location}</p>
                    <button className="btn-start-rental" onClick={() => startRental(car.id)}>
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
      <section className="cars-section">
        <h2>Mașini indisponibile</h2>
        {carsData.unavailable_cars.length > 0 ? (
          <div className="row g-4">
            {carsData.unavailable_cars.map(car => (
              <div key={car.id} className="col-12 col-md-4 mb-3">
                <div className="car-card">
                  <div className="card-body">
                    <h5 className="card-title">{car.vin}</h5>
                    <p className="card-text">{car.location}</p>
                    <button className="btn-unavailable" disabled>
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
