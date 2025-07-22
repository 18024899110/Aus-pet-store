import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebook, FaLock } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // 处理登录表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 基本表单验证
    if (!formData.email || !formData.password) {
      setError('请填写所有必填字段');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // 这里应该是实际的API调用
      // 例如: const response = await fetch('/api/auth/login', {...})
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟登录成功
      if (formData.email === 'test@example.com' && formData.password === 'password') {
        // 登录成功，重定向到首页
        navigate('/');
      } else {
        // 登录失败
        setError('邮箱或密码不正确');
      }
    } catch (err) {
      setError('登录时发生错误，请稍后再试');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // 处理社交媒体登录
  const handleSocialLogin = (provider) => {
    // 这里应该是实际的社交媒体登录逻辑
    console.log(`Login with ${provider}`);
  };
  
  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="login-card">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="login-title">登录</h2>
                  <p className="login-subtitle">登录您的账户以继续</p>
                </div>
                
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>电子邮箱</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="请输入您的电子邮箱"
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>密码</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="请输入您的密码"
                      required
                    />
                  </Form.Group>
                  
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      id="remember-me"
                      name="rememberMe"
                      label="记住我"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                    />
                    <Link to="/forgot-password" className="forgot-password-link">
                      忘记密码?
                    </Link>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="login-btn"
                    disabled={loading}
                  >
                    {loading ? '登录中...' : '登录'}
                  </Button>
                </Form>
                
                <div className="social-login-divider">
                  <span>或通过以下方式登录</span>
                </div>
                
                <div className="social-login-buttons">
                  <Button 
                    variant="outline-primary" 
                    className="google-btn"
                    onClick={() => handleSocialLogin('Google')}
                  >
                    <FaGoogle className="me-2" />
                    Google
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    className="facebook-btn"
                    onClick={() => handleSocialLogin('Facebook')}
                  >
                    <FaFacebook className="me-2" />
                    Facebook
                  </Button>
                </div>
                
                <div className="secure-login-note">
                  <FaLock className="me-2" />
                  <span>安全登录保障</span>
                </div>
                
                <div className="register-link">
                  还没有账户? <Link to="/register">立即注册</Link>
                </div>
              </Card.Body>
            </Card>
            
            <div className="login-help">
              <p>需要帮助? <Link to="/contact">联系我们</Link></p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login; 