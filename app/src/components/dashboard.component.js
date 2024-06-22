import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Navigation from './Navigation';

function Dashboard({ handleLogout }) {
  return (
    <div className="dashboard">
      <Navigation handleLogout={handleLogout} />
      <Container fluid>
        <Row>
          <Col xs={12} md={3}>
            <div className="card">Card 1</div>
          </Col>
          <Col xs={12} md={3}>
            <div className="card">Card 2</div>
          </Col>
          <Col xs={12} md={3}>
            <div className="card">Card 3</div>
          </Col>
          <Col xs={12} md={3}>
            <div className="card">Card 4</div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="auth-wrapper">
              <div className="auth-inner">
                <h2>Welcome to the Dashboard!</h2>
                <p>This is the protected area of your application.</p>
                <p>Here you can display user-specific information or actions.</p>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 20"><path fill="#81D8D0" fill-opacity="1" d="M0,64L48,90.7C96,117,192,171,288,181.3C384,192,480,160,576,144C672,128,768,128,864,154.7C960,181,1056,235,1152,250.7C1248,267,1344,245,1392,234.7L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
