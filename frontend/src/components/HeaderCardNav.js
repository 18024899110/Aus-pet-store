import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Badge } from 'react-bootstrap';
import { Card, CardNav } from 'react-bits';
import { FaShoppingCart, FaUser, FaSearch, FaPaw, FaHome, FaBox, FaDog, FaCat } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import './HeaderCardNav.css';

const HeaderCardNav = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useContext(CartContext);
  const navigate = useNavigate();

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="header-card-nav">
      <Container>
        <Card className="nav-card">
          <Card.Header className="nav-header">
            <div className="nav-brand">
              <Link to="/" className="brand-link">
                <FaPaw className="brand-icon" />
                <span className="brand-text">CY Pet Store</span>
              </Link>
            </div>

            <Form className="search-form-inline" onSubmit={handleSearchSubmit}>
              <Form.Control
                type="search"
                placeholder="Search products..."
                className="search-input-inline"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="primary" type="submit" className="search-btn-inline">
                <FaSearch />
              </Button>
            </Form>

            <div className="nav-actions">
              <Link to="/cart" className="action-link cart-action">
                <FaShoppingCart />
                {totalItems > 0 && (
                  <Badge pill bg="danger" className="cart-badge">
                    {totalItems}
                  </Badge>
                )}
              </Link>
              <Link to="/login" className="action-link">
                <FaUser />
              </Link>
            </div>
          </Card.Header>

          <Card.Body className="nav-body">
            <CardNav variant="tabs">
              <CardNav.Item>
                <CardNav.Link as={Link} to="/" className="nav-card-link">
                  <FaHome className="nav-icon" />
                  Home
                </CardNav.Link>
              </CardNav.Item>

              <CardNav.Item>
                <CardNav.Link as={Link} to="/products" className="nav-card-link">
                  <FaBox className="nav-icon" />
                  All Products
                </CardNav.Link>
              </CardNav.Item>

              <CardNav.Item>
                <CardNav.Link as={Link} to="/products/dog" className="nav-card-link">
                  <FaDog className="nav-icon" />
                  Dog Supplies
                </CardNav.Link>
              </CardNav.Item>

              <CardNav.Item>
                <CardNav.Link as={Link} to="/products/cat" className="nav-card-link">
                  <FaCat className="nav-icon" />
                  Cat Supplies
                </CardNav.Link>
              </CardNav.Item>

              <CardNav.Item>
                <CardNav.Link as={Link} to="/products/small-pet" className="nav-card-link">
                  <FaPaw className="nav-icon" />
                  Small Pet Supplies
                </CardNav.Link>
              </CardNav.Item>
            </CardNav>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default HeaderCardNav;
