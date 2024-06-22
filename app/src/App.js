// App.js

import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/login.component';
import Dashboard from './components/dashboard.component';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(loggedIn === 'true');
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        return data.message; // Return the error message
      }

      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
    } catch (error) {
      console.error('Login error:', error);
      return 'Server error'; // Return a generic error message
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
  };

  return (
    <Router>
      <div className="App">
        {isLoggedIn && (
          <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <div className="container">
              <Link className="navbar-brand" to="/">
                positronX
              </Link>
              <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <button className="nav-link btn btn-link" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        )}
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route
                exact
                path="/"
                element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={isLoggedIn ? <Navigate to="/" /> : <Login handleLogin={handleLogin} />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
