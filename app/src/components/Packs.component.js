import React, { useState } from 'react';
import { Container, Card, Form, Button, Table } from 'react-bootstrap';
import Navigation from './Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

const Packs = ({ handleLogout }) => {
  const [showForm, setShowForm] = useState(false);
  const [packs, setPacks] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    items: '',
    itemIds: '',
    brand: ''
  });

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const generateId = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPack = {
      id: generateId(),
      name: formData.name,
      items: formData.items,
      itemIds: formData.itemIds,
      brand: formData.brand
    };
    setPacks((prevPacks) => [...prevPacks, newPack]);
    setShowForm(false);
    setFormData({
      name: '',
      items: '',
      itemIds: '',
      brand: ''
    });
  };

  return (
    <div className="dashboard">
      <Navigation handleLogout={handleLogout} />
      <Container>
        {showForm ? (
          <Card>
            <Card.Body>
              <Card.Title>Add Pack</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="items">
                  <Form.Label>Items</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter number of items"
                    value={formData.items}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="itemIds">
                  <Form.Label>Item IDs</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter item IDs"
                    value={formData.itemIds}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="brand">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
                <Button variant="secondary" onClick={toggleForm} className="ml-2">
                  Cancel
                </Button>
              </Form>
            </Card.Body>
          </Card>
        ) : (
          <div>
            <h2>Packs Page</h2>
            <Button onClick={toggleForm} className="mb-3">Add Pack</Button>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Items</th>
                  <th>Item IDs</th>
                  <th>Brand</th>
                </tr>
              </thead>
              <tbody>
                {packs.map((pack) => (
                  <tr key={pack.id}>
                    <td>{pack.id}</td>
                    <td>{pack.name}</td>
                    <td>{pack.items}</td>
                    <td>{pack.itemIds}</td>
                    <td>{pack.brand}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Packs;
