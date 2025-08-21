import React, { useState } from 'react';
import { Button, Collapse, Card, Badge } from 'react-bootstrap';
import { config } from '../config/config';

const DevTools = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // 仅在开发环境显示
  if (!config.IS_DEVELOPMENT) {
    return null;
  }

  const handleClearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  const handleClearCart = () => {
    localStorage.removeItem('cart');
    window.location.reload();
  };

  const handleClearAuth = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    window.location.reload();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 9998,
      }}
    >
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="mb-2"
      >
        🛠️ 开发工具
      </Button>
      
      <Collapse in={isOpen}>
        <Card style={{ width: '280px', fontSize: '14px' }}>
          <Card.Header className="py-2">
            <strong>开发工具面板</strong>
            <Badge bg="warning" className="ms-2">DEV</Badge>
          </Card.Header>
          <Card.Body className="py-2">
            <div className="mb-3">
              <strong>环境信息</strong>
              <div>API URL: <code>{config.API_BASE_URL}</code></div>
              <div>版本: {config.APP_VERSION}</div>
            </div>
            
            <div className="mb-3">
              <strong>存储信息</strong>
              <div>
                localStorage: {Object.keys(localStorage).length} 项
              </div>
              <div>
                sessionStorage: {Object.keys(sessionStorage).length} 项
              </div>
            </div>
            
            <div className="d-grid gap-2">
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={handleClearStorage}
              >
                清空所有存储
              </Button>
              <Button 
                variant="outline-warning" 
                size="sm"
                onClick={handleClearCart}
              >
                清空购物车
              </Button>
              <Button 
                variant="outline-info" 
                size="sm"
                onClick={handleClearAuth}
              >
                清空登录状态
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Collapse>
    </div>
  );
};

export default DevTools;