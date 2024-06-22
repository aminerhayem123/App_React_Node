import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap'; // Import Container, Card, Form, and Button from react-bootstrap
import Navigation from './Navigation';

const Packs = ({ handleLogout }) => {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="dashboard">
      <Navigation handleLogout={handleLogout} />
      <Container>
        {showForm ? (
          <Card>
            <Card.Body>
              <Card.Title>Add Pack</Card.Title>
              <Form>
                <Form.Group className="mb-3" controlId="formId">
                  <Form.Label>ID</Form.Label>
                  <Form.Control type="text" placeholder="Enter ID" />
                </Form.Group>
                {/* Add other form fields for pack details */}
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
            <p>Here is a list of packs.</p>
            <Button onClick={toggleForm}>Add Pack</Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Packs;
