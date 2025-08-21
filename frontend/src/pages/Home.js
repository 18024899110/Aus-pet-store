import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPaw, FaShippingFast, FaHeadset, FaRegCreditCard } from 'react-icons/fa';
import { productService } from '../services';
import ProductImage from '../components/ProductImage';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load featured products from API
  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      const products = await productService.getProducts({ limit: 4 });
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Failed to load featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Banner carousel data
  const banners = [
    {
      id: 1,
      image: '/images/food.png',
      title: 'Premium Pet Food',
      description: 'Providing the highest quality nutrition for your beloved pets',
      link: '/products/food'
    },
    {
      id: 2,
      image: '/images/tool.png',
      title: 'Pet Toys Sale',
      description: 'Make your pets happy, 20% off storewide',
      link: '/products/toys'
    },
    {
      id: 3,
      image: '/images/vitamin.png',
      title: 'Pet Health Protection',
      description: 'Professional pet supplements for your pet\'s health',
      link: '/products/health'
    }
  ];

  // Featured categories
  const categories = [
    {
      id: 1,
      name: 'Dog Supplies',
      image: '/images/category-dog.jpg',
      link: '/products/dog'
    },
    {
      id: 2,
      name: 'Cat Supplies',
      image: '/images/category-cat.jpg',
      link: '/products/cat'
    },
    {
      id: 3,
      name: 'Small Pet Supplies',
      image: '/images/category-small-pet.jpg',
      link: '/products/small-pet'
    }
  ];

  return (
    <div className="home-page">
      {/* Carousel section - full width display */}
      <div className="home-carousel-wrapper">
        <Carousel className="home-carousel">
          {banners.map(banner => (
            <Carousel.Item key={banner.id}>
              <div 
                className="carousel-image"
                style={{ backgroundImage: `url(${banner.image})` }}
              ></div>
              <Carousel.Caption>
                <Container>
                  <h2>{banner.title}</h2>
                  <p>{banner.description}</p>
                  <Link to={banner.link}>
                    <Button variant="primary">View Now</Button>
                  </Link>
                </Container>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* Service features section */}
      <section className="services-section">
        <Container>
          <Row className="g-0">
          <Col md={3} sm={6} className="service-item">
            <div className="service-icon">
              <FaPaw />
            </div>
            <h5>Quality Products</h5>
            <p>Carefully selected high-quality pet supplies from around the world</p>
          </Col>
          <Col md={3} sm={6} className="service-item">
            <div className="service-icon">
              <FaShippingFast />
            </div>
            <h5>Nationwide Delivery</h5>
            <p>Free shipping on orders over $50</p>
          </Col>
          <Col md={3} sm={6} className="service-item">
            <div className="service-icon">
              <FaHeadset />
            </div>
            <h5>Professional Support</h5>
            <p>24/7 online customer service support</p>
          </Col>
          <Col md={3} sm={6} className="service-item">
            <div className="service-icon">
              <FaRegCreditCard />
            </div>
            <h5>Secure Payment</h5>
            <p>Multiple secure payment methods</p>
          </Col>
        </Row>
        </Container>
      </section>

      {/* Categories section */}
      <section className="categories-section">
        <Container>
          <h2 className="section-title">Pet Supply Categories</h2>
          <Row className="g-4">
          {categories.map(category => (
            <Col md={4} key={category.id}>
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

      {/* Featured products section */}
      <section className="featured-products-section">
        <Container>
          <h2 className="section-title">Featured Products</h2>
          <Row className="g-4">
          {loading ? (
            <div className="text-center">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : (
            featuredProducts.map(product => (
              <Col md={3} sm={6} key={product.id}>
                <Card className="product-card">
                  <div className="product-image-wrapper">
                    <ProductImage 
                      src={product.image_url || product.image}
                      alt={product.name}
                      className="product-image"
                      containerClass="product-image-wrapper"
                    />
                  </div>
                  <Card.Body>
                    <div className="product-category">{product.category.name}</div>
                    <Card.Title>{product.name}</Card.Title>
                    <div className="product-rating">
                      {'★'.repeat(Math.floor(product.rating || 5))}
                      {'☆'.repeat(5 - Math.floor(product.rating || 5))}
                      <span className="rating-number">{product.rating || 5}</span>
                    </div>
                    <div className="product-price">${product.price.toFixed(2)}</div>
                    <div className="product-buttons">
                      <Link to={`/product/${product.id}`}>
                        <Button className="btn-white-gray" size="sm">View Details</Button>
                      </Link>
                      <Button variant="primary" size="sm">Add to Cart</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
        <div className="text-center mt-4">
          <Link to="/products">
            <Button className="btn-white-gray" size="lg">View All Products</Button>
          </Link>
        </div>
        </Container>
      </section>

      {/* Promotional ads section */}
      <section className="promo-section">
        <Container>
          <Row className="g-4">
          <Col md={6}>
            <div className="promo-card" style={{ backgroundImage: 'url(/images/new_customer_discount.png)' }}>
              <div className="promo-content">
                <h3>New Customer Special</h3>
                <p>$10 off your first order</p>
                <Link to="/register">
                  <Button variant="light">Register Now</Button>
                </Link>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="promo-card" style={{ backgroundImage: 'url(/images/pomo2.png)' }}>
              <div className="promo-content">
                <h3>Limited Time Offer</h3>
                <p>Selected pet toys from 20% off</p>
                <Link to="/products/toys">
                  <Button variant="light">Shop Now</Button>
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