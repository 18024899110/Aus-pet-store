import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="footer-top">
          <Col md={4} className="footer-about">
            <h5>About Us</h5>
            <p>
              CY Pet Store is a leading online pet supply retailer, offering high-quality pet food, toys, health products and accessories.
              We are committed to providing the best products and services for your pets.
            </p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </a>
            </div>
          </Col>
          
          <Col md={2} className="footer-links">
            <h5>Quick Links</h5>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products/dog">Dog Supplies</Link></li>
              <li><Link to="/products/cat">Cat Supplies</Link></li>
              <li><Link to="/products/small-pet">Small Pet Supplies</Link></li>
            </ul>
          </Col>
          
          <Col md={2} className="footer-links">
            <h5>Customer Service</h5>
            <ul>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/returns">Return Policy</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </Col>
          
          <Col md={4} className="footer-newsletter">
            <h5>Subscribe to Our Newsletter</h5>
            <p>Get the latest product information, promotions and pet care tips.</p>
            <Form className="newsletter-form">
              <Form.Group className="d-flex">
                <Form.Control
                  type="email"
                  placeholder="Your email address"
                  className="me-2"
                />
                <Button variant="primary" type="submit">
                  <FaEnvelope />
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        
        <hr className="footer-divider" />
        
        <Row className="footer-bottom">
          <Col md={6} className="copyright">
            <p>&copy; {new Date().getFullYear()} CY Pet Store. All rights reserved.</p>
          </Col>
          <Col md={6} className="payment-methods text-md-end">
            <img src="/payment-methods.png" alt="Payment Methods" />
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 