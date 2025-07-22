import React from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPaw, FaShippingFast, FaHeadset, FaRegCreditCard } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  // 轮播图数据
  const banners = [
    {
      id: 1,
      image: '/images/banner1.jpg',
      title: '优质宠物食品',
      description: '为您的爱宠提供最优质的营养',
      link: '/products/food'
    },
    {
      id: 2,
      image: '/images/banner2.jpg',
      title: '宠物玩具特惠',
      description: '让您的宠物玩得开心，全场8折',
      link: '/products/toys'
    },
    {
      id: 3,
      image: '/images/banner3.jpg',
      title: '宠物健康保障',
      description: '专业宠物保健品，呵护爱宠健康',
      link: '/products/health'
    }
  ];

  // 特色分类
  const categories = [
    {
      id: 1,
      name: '狗狗用品',
      image: '/images/category-dog.jpg',
      link: '/products/dog'
    },
    {
      id: 2,
      name: '猫咪用品',
      image: '/images/category-cat.jpg',
      link: '/products/cat'
    },
    {
      id: 3,
      name: '小宠用品',
      image: '/images/category-small-pet.jpg',
      link: '/products/small-pet'
    }
  ];

  // 热门商品
  const featuredProducts = [
    {
      id: 1,
      name: '优质狗粮 10kg',
      image: '/images/product1.jpg',
      price: 89.99,
      rating: 4.8,
      category: 'dog',
      link: '/product/1'
    },
    {
      id: 2,
      name: '猫咪磨爪玩具',
      image: '/images/product2.jpg',
      price: 29.99,
      rating: 4.5,
      category: 'cat',
      link: '/product/2'
    },
    {
      id: 3,
      name: '宠物自动喂食器',
      image: '/images/product3.jpg',
      price: 129.99,
      rating: 4.7,
      category: 'accessories',
      link: '/product/3'
    },
    {
      id: 4,
      name: '猫咪营养膏',
      image: '/images/product4.jpg',
      price: 19.99,
      rating: 4.6,
      category: 'health',
      link: '/product/4'
    }
  ];

  return (
    <div className="home-page">
      {/* 轮播图部分 */}
      <Carousel className="home-carousel">
        {banners.map(banner => (
          <Carousel.Item key={banner.id}>
            <div 
              className="carousel-image"
              style={{ backgroundImage: `url(${banner.image})` }}
            ></div>
            <Carousel.Caption>
              <h2>{banner.title}</h2>
              <p>{banner.description}</p>
              <Link to={banner.link}>
                <Button variant="primary">立即查看</Button>
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* 服务特点部分 */}
      <section className="services-section">
        <Container>
          <Row>
            <Col md={3} sm={6} className="service-item">
              <div className="service-icon">
                <FaPaw />
              </div>
              <h5>优质产品</h5>
              <p>精选全球高品质宠物用品</p>
            </Col>
            <Col md={3} sm={6} className="service-item">
              <div className="service-icon">
                <FaShippingFast />
              </div>
              <h5>全国配送</h5>
              <p>订单满$50免费配送</p>
            </Col>
            <Col md={3} sm={6} className="service-item">
              <div className="service-icon">
                <FaHeadset />
              </div>
              <h5>专业客服</h5>
              <p>7x24小时在线客服支持</p>
            </Col>
            <Col md={3} sm={6} className="service-item">
              <div className="service-icon">
                <FaRegCreditCard />
              </div>
              <h5>安全支付</h5>
              <p>多种安全支付方式</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 分类部分 */}
      <section className="categories-section">
        <Container>
          <h2 className="section-title">宠物用品分类</h2>
          <Row>
            {categories.map(category => (
              <Col md={4} key={category.id} className="mb-4">
                <Link to={category.link} className="category-card">
                  <div className="category-image" style={{ backgroundImage: `url(${category.image})` }}>
                    <h3>{category.name}</h3>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 热门商品部分 */}
      <section className="featured-products-section">
        <Container>
          <h2 className="section-title">热门商品</h2>
          <Row>
            {featuredProducts.map(product => (
              <Col md={3} sm={6} key={product.id} className="mb-4">
                <Card className="product-card">
                  <div className="product-image-wrapper">
                    <Card.Img variant="top" src={product.image} className="product-image" />
                  </div>
                  <Card.Body>
                    <div className="product-category">{product.category}</div>
                    <Card.Title>{product.name}</Card.Title>
                    <div className="product-rating">
                      {'★'.repeat(Math.floor(product.rating))}
                      {'☆'.repeat(5 - Math.floor(product.rating))}
                      <span className="rating-number">{product.rating}</span>
                    </div>
                    <div className="product-price">${product.price.toFixed(2)}</div>
                    <div className="product-buttons">
                      <Link to={product.link}>
                        <Button variant="outline-primary" size="sm">查看详情</Button>
                      </Link>
                      <Button variant="primary" size="sm">加入购物车</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Link to="/products">
              <Button variant="outline-primary" size="lg">查看全部商品</Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 促销广告部分 */}
      <section className="promo-section">
        <Container>
          <Row>
            <Col md={6} className="mb-4">
              <div className="promo-card" style={{ backgroundImage: 'url(/images/promo1.jpg)' }}>
                <div className="promo-content">
                  <h3>新客户专享</h3>
                  <p>首单立减$10</p>
                  <Link to="/register">
                    <Button variant="light">立即注册</Button>
                  </Link>
                </div>
              </div>
            </Col>
            <Col md={6} className="mb-4">
              <div className="promo-card" style={{ backgroundImage: 'url(/images/promo2.jpg)' }}>
                <div className="promo-content">
                  <h3>限时特惠</h3>
                  <p>精选宠物玩具8折起</p>
                  <Link to="/products/toys">
                    <Button variant="light">立即购买</Button>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home; 