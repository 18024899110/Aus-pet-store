import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Form, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaSearch, FaBars } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import IconButton from './IconButton';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useContext(CartContext);
  const navigate = useNavigate();

  // Listen for scroll events to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <Navbar 
      expand="lg" 
      fixed="top" 
      className={`header ${isScrolled ? 'scrolled' : ''}`}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="logo">
          <img src="/images/logo.png" alt="CY Pet Store Logo" className="logo-img" />
          <span className="text-center text-2xl font-bold">CY Pet Store</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <FaBars />
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto main-nav">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/products">All Products</Nav.Link>
            <Nav.Link as={Link} to="/products/dog">Dog Supplies</Nav.Link>
            <Nav.Link as={Link} to="/products/cat">Cat Supplies</Nav.Link>
            <Nav.Link as={Link} to="/products/small-pet">Small Pet Supplies</Nav.Link>
          </Nav>
          
          <Form className="d-flex search-form" onSubmit={handleSearchSubmit}>
            <Form.Control
              type="search"
              placeholder="Search products..."
              className="me-2 search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton
              icon={FaSearch}
              variant="gradient"
              type="submit"
              className="search-btn"
            />
          </Form>
          
          <Nav className="ms-auto user-nav">
            <Nav.Link as={Link} to="/cart" className="cart-link">
              <FaShoppingCart />
              {totalItems > 0 && (
                <Badge pill bg="danger" className="cart-badge">
                  {totalItems}
                </Badge>
              )}
            </Nav.Link>
            <Nav.Link as={Link} to="/login">
              <FaUser />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header; 