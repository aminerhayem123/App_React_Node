// Items.js
import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import Navigation from './Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

function Items({ handleLogout }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/items');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  return (
    <div className="dashboard">
      <Navigation handleLogout={handleLogout} />
      <Container>
        <div className="content">
          <h2>Items Page</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Pack ID</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.pack_id}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
}

export default Items;
