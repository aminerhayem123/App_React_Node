// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Login from './components/login.component';
import Dashboard from './components/dashboard.component';
import Items from './components/items.component';
import Packs from './components/packs.component';

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
        <Routes>
          <Route  
            exact
            path="/"
            element={isLoggedIn ? <Dashboard handleLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <Login handleLogin={handleLogin} />}
          />
          <Route path="/items" element={isLoggedIn ? <Items /> : <Navigate to="/login" />} />
          <Route path="/packs" element={isLoggedIn ? <Packs /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

