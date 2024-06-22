// Dashboard.js
import React from 'react';
import { Container } from 'react-bootstrap';
import Navigation from './Navigation';

function Dashboard({ handleLogout }) {
  return (
    <div className="dashboard">
      <Navigation handleLogout={handleLogout} />
      <Container>
        <div className="content">
          <div className="auth-wrapper">
            <div className="auth-inner">
              <h2>Welcome to the Dashboard!</h2>
              <p>This is the protected area of your application.</p>
              <p>Here you can display user-specific information or actions.</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Dashboard;
