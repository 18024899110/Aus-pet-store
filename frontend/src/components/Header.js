import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Form, Button, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaSearch, FaBars } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useContext(CartContext);
  const navigate = useNavigate();

  // 监听滚动事件以改变导航栏样式
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

  // 处理搜索提交
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
          <img src="/logo.png" alt="AuPets Logo" className="logo-img" />
          <span>AuPets</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <FaBars />
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto main-nav">
            <Nav.Link as={Link} to="/">首页</Nav.Link>
            <Nav.Link as={Link} to="/products">全部商品</Nav.Link>
            <Nav.Link as={Link} to="/products/dog">狗狗用品</Nav.Link>
            <Nav.Link as={Link} to="/products/cat">猫咪用品</Nav.Link>
            <Nav.Link as={Link} to="/products/small-pet">小宠用品</Nav.Link>
          </Nav>
          
          <Form className="d-flex search-form" onSubmit={handleSearchSubmit}>
            <Form.Control
              type="search"
              placeholder="搜索商品..."
              className="me-2 search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline-light" type="submit" className="search-btn">
              <FaSearch />
            </Button>
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