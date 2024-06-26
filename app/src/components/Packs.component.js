import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Table, Modal } from 'react-bootstrap';
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
  const [selectedPack, setSelectedPack] = useState(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshPage, setRefreshPage] = useState(false); // State to control page refresh

  useEffect(() => {
    fetchPacks();
  }, [refreshPage]); // Trigger fetchPacks when refreshPage changes

  const fetchPacks = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/packs');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPacks(data);
    } catch (error) {
      console.error('Error fetching packs:', error);
      setError('Failed to fetch packs.');
    } finally {
      setLoading(false);
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
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/packs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add pack.');
      }

      const result = await response.json();
      setPacks((prevPacks) => [...prevPacks, result]);
      setFormData({
        brand: '',
        numberOfItems: 1,
        items: ['']
      });
      setShowForm(false);
      setRefreshPage(prev => !prev); // Toggle refreshPage to trigger page refresh
    } catch (error) {
      console.error('Error adding pack:', error);
      setError('Failed to add pack.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/items/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item.');
      }

      setPacks((prevPacks) =>
        prevPacks.map((pack) => ({
          ...pack,
          items: pack.items.filter((item) => item.id !== id),
        }))
      );
      setRefreshPage(prev => !prev); // Toggle refreshPage to trigger page refresh
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Failed to delete item.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (pack) => {
    setSelectedPack(pack);
    setShowAddItemModal(true);
  };

  const handleAddNewItem = async () => {
    if (!newItem.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/packs/${selectedPack.id}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newItem }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item.');
      }

      const newItemData = await response.json();
      setPacks((prevPacks) =>
        prevPacks.map((pack) => {
          if (pack.id === selectedPack.id) {
            return { ...pack, items: [...pack.items, newItemData] };
          }
          return pack;
        })
      );
      setShowAddItemModal(false);
      setNewItem('');
      setRefreshPage(prev => !prev); // Toggle refreshPage to trigger page refresh
    } catch (error) {
      console.error('Error adding new item:', error);
      setError('Failed to add new item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Navigation handleLogout={handleLogout} />
      <Container>
        <div className="content">
          <Card>
            <Card.Body>
              <Card.Title>Packs Management</Card.Title>
              {loading && <p>Loading...</p>}
              {error && <p className="text-danger">{error}</p>}
              <Button onClick={toggleForm}>
                {showForm ? 'Hide Form' : 'Add New Pack'}
              </Button>
              {showForm && (
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="brand">
                    <Form.Label>Brand</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.brand}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="numberOfItems">
                    <Form.Label>Number of Items</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.numberOfItems}
                      onChange={handleNumberOfItemsChange}
                      min="1"
                    />
                  </Form.Group>
                  {formData.items.map((item, index) => (
                    <Form.Group controlId={`item-${index}`} key={index}>
                      <Form.Label>Item {index + 1}</Form.Label>
                      <Form.Control
                        type="text"
                        value={item}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </Form.Group>
                  ))}
                  <Button type="submit" disabled={loading}>
                    Submit
                  </Button>
                </Form>
              )}
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Brand</th>
                    <th>Items</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packs.map((pack) => (
                    <tr key={pack.id}>
                      <td>{pack.id}</td>
                      <td>{pack.brand}</td>
                      <td>
                        <ul>
                          {(pack.items || []).map((item) => (
                            <li key={item.id}>
                              {item.name}{' '}
                              <Button
                                variant="danger"
                                onClick={() => handleDelete(item.id)}
                              >
                                Delete
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => handleAddItem(pack)}
                        >
                          Add Item
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      </Container>

      <Modal show={showAddItemModal} onHide={() => setShowAddItemModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="newItem">
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddItemModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddNewItem} disabled={loading}>
            Add Item
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Packs;
