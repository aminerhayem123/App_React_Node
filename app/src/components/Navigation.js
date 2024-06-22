import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Sidebar.css'; // Import custom CSS file for styling

const Sidebar = ({ handleLogout }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Admin Dashboard</h3>
      </div>
      <Nav className="flex-column">
        <Nav.Item>
          <Nav.Link as={Link} to="/items">Items</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/packs">Packs</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default Sidebar;
