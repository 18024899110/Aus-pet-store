import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="footer-top">
          <Col md={4} className="footer-about">
            <h5>关于我们</h5>
            <p>
              AuPets是澳洲领先的宠物用品在线零售商，提供高品质的宠物食品、玩具、保健品和配件。
              我们致力于为您的宠物提供最好的产品和服务。
            </p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </a>
            </div>
          </Col>
          
          <Col md={2} className="footer-links">
            <h5>快速链接</h5>
            <ul>
              <li><Link to="/">首页</Link></li>
              <li><Link to="/products">全部商品</Link></li>
              <li><Link to="/products/dog">狗狗用品</Link></li>
              <li><Link to="/products/cat">猫咪用品</Link></li>
              <li><Link to="/products/small-pet">小宠用品</Link></li>
            </ul>
          </Col>
          
          <Col md={2} className="footer-links">
            <h5>客户服务</h5>
            <ul>
              <li><Link to="/contact">联系我们</Link></li>
              <li><Link to="/faq">常见问题</Link></li>
              <li><Link to="/shipping">配送信息</Link></li>
              <li><Link to="/returns">退换政策</Link></li>
              <li><Link to="/privacy">隐私政策</Link></li>
            </ul>
          </Col>
          
          <Col md={4} className="footer-newsletter">
            <h5>订阅我们的通讯</h5>
            <p>获取最新产品信息、优惠活动和宠物护理小贴士。</p>
            <Form className="newsletter-form">
              <Form.Group className="d-flex">
                <Form.Control
                  type="email"
                  placeholder="您的电子邮箱"
                  className="me-2"
                />
                <Button variant="primary" type="submit">
                  <FaEnvelope />
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        
        <hr className="footer-divider" />
        
        <Row className="footer-bottom">
          <Col md={6} className="copyright">
            <p>&copy; {new Date().getFullYear()} AuPets. 保留所有权利。</p>
          </Col>
          <Col md={6} className="payment-methods text-md-end">
            <img src="/payment-methods.png" alt="支付方式" />
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 