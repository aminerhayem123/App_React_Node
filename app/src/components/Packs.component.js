import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Table } from 'react-bootstrap';
import Navigation from './Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

const Packs = ({ handleLogout }) => {
  const [showForm, setShowForm] = useState(false);
  const [packs, setPacks] = useState([]);
  const [formData, setFormData] = useState({
    brand: '',
    numberOfItems: 1,
    items: ['']
  });

  useEffect(() => {
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    try {
      const response = await fetch('http://localhost:5000/packs');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPacks(data);
    } catch (error) {
      console.error('Error fetching packs:', error);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleInputChange = (e, index) => {
    const { id, value } = e.target;
    if (id === 'brand') {
      setFormData((prevData) => ({
        ...prevData,
        brand: value
      }));
    } else {
      const newItems = [...formData.items];
      newItems[index] = value;
      setFormData((prevData) => ({
        ...prevData,
        items: newItems
      }));
    }
  };

  const handleNumberOfItemsChange = (e) => {
    const numberOfItems = parseInt(e.target.value);
    const newItems = Array.from({ length: numberOfItems }, (_, index) => formData.items[index] || '');

    setFormData((prevData) => ({
      ...prevData,
      numberOfItems,
      items: newItems
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/packs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brand: formData.brand,
          items: formData.items,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log(result);
  
      const newPack = {
        id: result.packId,
        brand: formData.brand,
        items: formData.items.map(name => ({ name }))
      };
      setPacks((prevPacks) => [...prevPacks, newPack]);
      setShowForm(false);
      setFormData({
        brand: '',
        numberOfItems: 1,
        items: [''],
      });
    } catch (error) {
      console.error('Error adding pack:', error);
    }
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
                <Form.Group className="mb-3" controlId="brand">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange(e)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="numberOfItems">
                  <Form.Label>Number of Items</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter number of items"
                    value={formData.numberOfItems}
                    onChange={handleNumberOfItemsChange}
                  />
                </Form.Group>
                {formData.items.map((item, index) => (
                  <Form.Group className="mb-3" controlId={`item-${index}`} key={index}>
                    <Form.Label>Item {index + 1}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter item name"
                      value={item}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </Form.Group>
                ))}
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
                  <th>Brand</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
              {packs.map((pack) => (
                <tr key={pack.id}>
                  <td>{pack.id}</td>
                  <td>{pack.brand}</td>
                  <td>
                    {pack.items && pack.items.map((item, index) => (
                      <div key={index}>{item.name}</div>
                    ))}
                  </td>
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