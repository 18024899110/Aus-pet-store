import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaCreditCard, FaPaypal, FaAlipay, FaArrowLeft } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
    country: 'Australia',
    paymentMethod: 'credit-card',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    saveInfo: false
  });
  
  const [validated, setValidated] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // 计算订单总额
  const calculateOrderTotal = () => {
    const subtotal = totalPrice;
    const shipping = subtotal >= 100 ? 0 : 10; // 订单满$100免运费
    const tax = subtotal * 0.1; // 10% 税
    const orderTotal = subtotal + shipping + tax;
    
    return {
      subtotal,
      shipping,
      tax,
      orderTotal
    };
  };
  
  const { subtotal, shipping, tax, orderTotal } = calculateOrderTotal();
  
  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    // 模拟订单提交
    setOrderPlaced(true);
    
    // 生成随机订单ID
    const randomOrderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setOrderId(randomOrderId);
    
    // 清空购物车
    clearCart();
    
    // 3秒后跳转到订单确认页面
    setTimeout(() => {
      navigate('/order-confirmation', { 
        state: { 
          orderId: randomOrderId,
          orderTotal: orderTotal,
          shippingInfo: {
            name: `${formData.firstName} ${formData.lastName}`,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postcode: formData.postcode,
            country: formData.country
          }
        } 
      });
    }, 3000);
  };
  
  // 如果购物车为空，重定向到购物车页面
  if (cart.length === 0 && !orderPlaced) {
    return (
      <Container className="py-5 text-center">
        <h2>您的购物车是空的</h2>
        <p>请先添加商品到购物车再进行结账</p>
        <Link to="/products">
          <Button variant="primary">浏览商品</Button>
        </Link>
      </Container>
    );
  }
  
  // 订单已提交显示
  if (orderPlaced) {
    return (
      <div className="order-processing">
        <Container className="text-center py-5">
          <div className="spinner"></div>
          <h2>正在处理您的订单...</h2>
          <p>订单号: {orderId}</p>
          <p>请不要关闭此页面，我们正在处理您的订单。</p>
        </Container>
      </div>
    );
  }
  
  return (
    <div className="checkout-page">
      <Container>
        <h1 className="page-title">结账</h1>
        
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            {/* 结账表单 */}
            <Col lg={8}>
              <div className="checkout-section">
                <h3 className="section-title">配送信息</h3>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>名字</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        请输入您的名字
                      </Form.Control.Feedback>
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
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        请输入您的姓氏
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>电子邮箱</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        请输入有效的电子邮箱地址
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>电话号码</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        请输入您的电话号码
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>地址</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    请输入您的地址
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>城市</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        请输入您所在的城市
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>州/省</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        请输入您所在的州/省
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>邮编</Form.Label>
                      <Form.Control
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        请输入您的邮编
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>国家</Form.Label>
                      <Form.Select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Australia">澳大利亚</option>
                        <option value="New Zealand">新西兰</option>
                        <option value="China">中国</option>
                        <option value="United States">美国</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
              
              <div className="checkout-section">
                <h3 className="section-title">支付方式</h3>
                <Form.Group className="mb-3">
                  <div className="payment-methods">
                    <Form.Check
                      type="radio"
                      id="credit-card"
                      name="paymentMethod"
                      value="credit-card"
                      label={
                        <div className="payment-method-label">
                          <FaCreditCard className="payment-icon" />
                          <span>信用卡/借记卡</span>
                        </div>
                      }
                      checked={formData.paymentMethod === 'credit-card'}
                      onChange={handleInputChange}
                    />
                    
                    <Form.Check
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      label={
                        <div className="payment-method-label">
                          <FaPaypal className="payment-icon" />
                          <span>PayPal</span>
                        </div>
                      }
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleInputChange}
                    />
                    
                    <Form.Check
                      type="radio"
                      id="alipay"
                      name="paymentMethod"
                      value="alipay"
                      label={
                        <div className="payment-method-label">
                          <FaAlipay className="payment-icon" />
                          <span>支付宝</span>
                        </div>
                      }
                      checked={formData.paymentMethod === 'alipay'}
                      onChange={handleInputChange}
                    />
                  </div>
                </Form.Group>
                
                {formData.paymentMethod === 'credit-card' && (
                  <div className="credit-card-form">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>持卡人姓名</Form.Label>
                          <Form.Control
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            请输入持卡人姓名
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>卡号</Form.Label>
                          <Form.Control
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="XXXX XXXX XXXX XXXX"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            请输入有效的卡号
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>有效期</Form.Label>
                          <Form.Control
                            type="text"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            请输入有效期
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>安全码 (CVC)</Form.Label>
                          <Form.Control
                            type="text"
                            name="cardCVC"
                            value={formData.cardCVC}
                            onChange={handleInputChange}
                            placeholder="CVC"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            请输入安全码
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}
                
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="saveInfo"
                    id="save-info"
                    label="保存我的信息以便下次结账"
                    checked={formData.saveInfo}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              
              <div className="checkout-actions">
                <Link to="/cart">
                  <Button variant="outline-secondary" className="me-2">
                    <FaArrowLeft className="me-2" />
                    返回购物车
                  </Button>
                </Link>
                <Button variant="primary" type="submit">
                  <FaLock className="me-2" />
                  确认支付
                </Button>
              </div>
            </Col>
            
            {/* 订单摘要 */}
            <Col lg={4}>
              <Card className="order-summary">
                <Card.Header>
                  <h4>订单摘要</h4>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush" className="order-items">
                    {cart.map(item => (
                      <ListGroup.Item key={item.id} className="order-item">
                        <div className="item-image">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="item-details">
                          <div className="item-name">{item.name}</div>
                          <div className="item-quantity">数量: {item.quantity}</div>
                          <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  
                  <div className="summary-divider"></div>
                  
                  <div className="summary-item">
                    <span>小计:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-item">
                    <span>运费:</span>
                    <span>
                      {shipping === 0 ? '免费' : `$${shipping.toFixed(2)}`}
                      {shipping === 0 && <small className="free-shipping-note">（订单满$100免运费）</small>}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span>税费:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-divider"></div>
                  
                  <div className="summary-item total">
                    <span>总计:</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="secure-checkout-note">
                    <FaLock className="me-2" />
                    安全支付保障
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default Checkout; 