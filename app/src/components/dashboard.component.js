// Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

function Dashboard({ handleLogout }) {
  return (
    <div className="dashboard">
      <Navbar bg="light" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/">Admin Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="sidebar">
        <Nav className="flex-column">
          <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
          <Nav.Link as={Link} to="/items">Items</Nav.Link>
          <Nav.Link as={Link} to="/packs">Packs</Nav.Link>
        </Nav>
      </div>
      <div className="content">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <h2>Welcome to the Dashboard!</h2>
            <p>This is the protected area of your application.</p>
            <p>Here you can display user-specific information or actions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
