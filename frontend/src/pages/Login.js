import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebook, FaLock } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);
  const { refreshCartFromServer } = useContext(CartContext) || {};
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Redirect logged-in users to appropriate page
  useEffect(() => {
    if (user) {
      if (user.is_admin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Call AuthContext login method
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Refresh cart data after successful login
        if (refreshCartFromServer) {
          await refreshCartFromServer();
        }
        
        // Redirect based on user role
        if (user?.is_admin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed, please check your email and password');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle social media login
  const handleSocialLogin = (provider) => {
    // TODO: Implement social media login logic
    setError(`${provider} login is not available yet`);
  };
  
  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="login-card">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="login-title">Login</h2>
                  <p className="login-subtitle">Sign in to your account to continue</p>
                </div>
                
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      required
                    />
                  </Form.Group>
                  
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      id="remember-me"
                      name="rememberMe"
                      label="Remember me"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                    />
                    <Link to="/forgot-password" className="forgot-password-link">
                      Forgot Password?
                    </Link>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="login-btn"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </Form>
                
                <div className="social-login-divider">
                  <span>Or sign in with</span>
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
                  <span>Secure login protected</span>
                </div>
                
                <div className="register-link">
                  Don't have an account? <Link to="/register">Sign up now</Link>
                </div>
              </Card.Body>
            </Card>
            
            <div className="login-help">
              <p>Need help? <Link to="/contact">Contact us</Link></p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login; 