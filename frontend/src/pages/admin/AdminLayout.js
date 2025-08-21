import React, { useState, useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Navbar, Button, Offcanvas } from 'react-bootstrap';
import { 
  FaTachometerAlt, 
  FaBoxes, 
  FaShoppingCart, 
  FaUsers, 
  FaChartBar, 
  FaTags,
  FaSignOutAlt,
  FaBars,
  FaHome
} from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', icon: FaTachometerAlt, label: 'Dashboard', exact: true },
    { path: '/admin/products', icon: FaBoxes, label: 'Products' },
    { path: '/admin/orders', icon: FaShoppingCart, label: 'Orders' },
    { path: '/admin/users', icon: FaUsers, label: 'Users' },
    { path: '/admin/categories', icon: FaTags, label: 'Categories' },
    { path: '/admin/analytics', icon: FaChartBar, label: 'Analytics' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h4>Admin Panel</h4>
        <div className="admin-info">
          <small>Welcome, {user?.full_name}</small>
        </div>
      </div>
      
      <Nav className="flex-column sidebar-nav">
        {/* 返回主站链接 */}
        <Nav.Link
          as={Link}
          to="/"
          className="sidebar-nav-link back-to-home"
          onClick={() => setShowSidebar(false)}
        >
          <FaHome className="nav-icon" />
          <span>返回主站</span>
        </Nav.Link>
        
        <hr className="sidebar-divider" />
        
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <Nav.Link
              key={item.path}
              as={Link}
              to={item.path}
              className={`sidebar-nav-link ${isActive(item.path, item.exact) ? 'active' : ''}`}
              onClick={() => setShowSidebar(false)}
            >
              <Icon className="nav-icon" />
              <span>{item.label}</span>
            </Nav.Link>
          );
        })}
      </Nav>
      
      <div className="sidebar-footer">
        <Button 
          variant="outline-light" 
          size="sm" 
          onClick={handleLogout}
          className="logout-btn"
        >
          <FaSignOutAlt className="me-2" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="admin-layout">
      {/* Mobile Header */}
      <Navbar bg="dark" variant="dark" className="d-lg-none mobile-navbar">
        <Container fluid>
          <Button
            variant="outline-light"
            className="sidebar-toggle"
            onClick={() => setShowSidebar(true)}
          >
            <FaBars />
          </Button>
          <Navbar.Brand>Admin Panel</Navbar.Brand>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-light" 
              size="sm" 
              as={Link}
              to="/"
              title="返回主站"
            >
              <FaHome />
            </Button>
            <Button 
              variant="outline-light" 
              size="sm" 
              onClick={handleLogout}
              title="退出登录"
            >
              <FaSignOutAlt />
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Mobile Sidebar */}
      <Offcanvas 
        show={showSidebar} 
        onHide={() => setShowSidebar(false)} 
        className="d-lg-none"
      >
        <Offcanvas.Body className="p-0">
          <SidebarContent />
        </Offcanvas.Body>
      </Offcanvas>

      <Row className="g-0 admin-main">
        {/* Desktop Sidebar */}
        <Col lg={3} xl={2} className="d-none d-lg-block sidebar-col">
          <SidebarContent />
        </Col>
        
        {/* Main Content */}
        <Col lg={9} xl={10} className="main-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AdminLayout;