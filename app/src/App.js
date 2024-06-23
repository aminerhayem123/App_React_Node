import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login.component';
import Dashboard from './components/dashboard.component';
import Items from './components/items.component';
import Packs from './components/packs.component';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Start with null to indicate loading state

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

  if (isLoggedIn === null) {
    return <div>Loading...</div>; // Show a loading state until isLoggedIn is determined
  }

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
          <Route
            path="/items"
            element={isLoggedIn ? <Items handleLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/packs"
            element={isLoggedIn ? <Packs handleLogout={handleLogout} /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
