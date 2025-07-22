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
        <h1 className="error-title">页面未找到</h1>
        <p className="error-message">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <div className="error-actions">
          <Link to="/">
            <Button variant="primary" className="me-3">
              <FaHome className="me-2" />
              返回首页
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline-primary">
              <FaSearch className="me-2" />
              浏览商品
            </Button>
          </Link>
        </div>
        <div className="error-image">
          <img src="/images/404-pet.png" alt="迷路的宠物" />
        </div>
      </Container>
    </div>
  );
};

export default NotFound; 