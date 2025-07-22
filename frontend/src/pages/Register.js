import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebook, FaLock } from 'react-icons/fa';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
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
  
  // 处理注册表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 基本表单验证
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('请填写所有必填字段');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    if (!formData.agreeTerms) {
      setError('请同意服务条款和隐私政策');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // 这里应该是实际的API调用
      // 例如: const response = await fetch('/api/auth/register', {...})
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟注册成功
      // 注册成功，重定向到登录页面
      navigate('/login', { state: { message: '注册成功，请登录' } });
    } catch (err) {
      setError('注册时发生错误，请稍后再试');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // 处理社交媒体注册
  const handleSocialRegister = (provider) => {
    // 这里应该是实际的社交媒体注册逻辑
    console.log(`Register with ${provider}`);
  };
  
  return (
    <div className="register-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="register-card">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="register-title">创建账户</h2>
                  <p className="register-subtitle">加入我们，开始您的宠物购物之旅</p>
                </div>
                
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>名字</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="请输入您的名字"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>姓氏</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="请输入您的姓氏"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
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
                      placeholder="请设置您的密码"
                      required
                    />
                    <Form.Text className="text-muted">
                      密码长度至少为8个字符，包含字母和数字
                    </Form.Text>
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>确认密码</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="请再次输入您的密码"
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      id="agree-terms"
                      name="agreeTerms"
                      label={
                        <span>
                          我同意 <Link to="/terms">服务条款</Link> 和 <Link to="/privacy">隐私政策</Link>
                        </span>
                      }
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="register-btn"
                    disabled={loading}
                  >
                    {loading ? '注册中...' : '注册'}
                  </Button>
                </Form>
                
                <div className="social-register-divider">
                  <span>或通过以下方式注册</span>
                </div>
                
                <div className="social-register-buttons">
                  <Button 
                    variant="outline-primary" 
                    className="google-btn"
                    onClick={() => handleSocialRegister('Google')}
                  >
                    <FaGoogle className="me-2" />
                    Google
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    className="facebook-btn"
                    onClick={() => handleSocialRegister('Facebook')}
                  >
                    <FaFacebook className="me-2" />
                    Facebook
                  </Button>
                </div>
                
                <div className="secure-register-note">
                  <FaLock className="me-2" />
                  <span>安全注册保障</span>
                </div>
                
                <div className="login-link">
                  已有账户? <Link to="/login">立即登录</Link>
                </div>
              </Card.Body>
            </Card>
            
            <div className="register-help">
              <p>需要帮助? <Link to="/contact">联系我们</Link></p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register; 