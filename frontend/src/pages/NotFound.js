import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <Container className="text-center">
        <div className="error-code">404</div>
        <h1 className="error-title">Page Not Found</h1>
        <p className="error-message">
          Sorry, the page you're looking for doesn't exist or has been removed.
        </p>
        <div className="error-actions">
          <Link to="/">
            <Button variant="primary" className="me-3">
              <FaHome className="me-2" />
              Go Home
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline-primary">
              <FaSearch className="me-2" />
              Browse Products
            </Button>
          </Link>
        </div>
        <div className="error-image">
          <img src="/images/404-pet.png" alt="Lost Pet" />
        </div>
      </Container>
    </div>
  );
};

export default NotFound; 