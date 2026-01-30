import React, { useState, useEffect, useContext, useRef } from 'react';
import { Container, Row, Col, Carousel, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPaw, FaShippingFast, FaHeadset, FaRegCreditCard, FaSearch } from 'react-icons/fa';
import { gsap } from 'gsap';
import { productService } from '../services';
import { CartContext } from '../context/CartContext';
import FlipCard from '../components/FlipCard';
import IconButton from '../components/IconButton';
import Hyperspeed from '../components/Hyperspeed';
import './Home.css';

const Home = () => {
  const { addToCart } = useContext(CartContext);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState({});
  const [error, setError] = useState('');

  // 组件引用
  const carouselRef = useRef(null);
  const servicesRef = useRef(null);
  const categoriesRef = useRef(null);
  const productsRef = useRef(null);
  const promoRef = useRef(null);

  // 页面加载动画
  useEffect(() => {
    // 初始化所有组件为隐藏状态
    gsap.set([carouselRef.current, servicesRef.current, categoriesRef.current, productsRef.current, promoRef.current], {
      opacity: 0,
      y: 50
    });

    // 依次弹出动画
    const tl = gsap.timeline();

    tl.to(carouselRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
    .to(servicesRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4')
    .to(categoriesRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4')
    .to(productsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4')
    .to(promoRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4');
  }, []);

  // Load featured products from API
  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      const products = await productService.getProducts({ limit: 10 });
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Failed to load featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle add to cart with feedback
  const handleAddToCart = async (product) => {
    console.log('添加到购物车:', product);
    try {
      await addToCart(product);

      // 触发翻转动画
      setFlippedCards(prev => ({ ...prev, [product.id]: true }));

      // 2秒后翻转回来
      setTimeout(() => {
        setFlippedCards(prev => ({ ...prev, [product.id]: false }));
      }, 2000);

    } catch (error) {
      console.error('添加到购物车失败:', error);
      setError('添加到购物车失败，请重试');
      setTimeout(() => setError(''), 3000);
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
      <Hyperspeed effectOptions={{
        onSpeedUp: () => { },
        onSlowDown: () => { },
        distortion: 'turbulentDistortion',
        length: 400,
        roadWidth: 10,
        islandWidth: 2,
        lanesPerRoad: 4,
        fov: 90,
        fovSpeedUp: 150,
        speedUp: 2,
        carLightsFade: 0.4,
        totalSideLightSticks: 20,
        lightPairsPerRoadWay: 40,
        shoulderLinesWidthPercentage: 0.05,
        brokenLinesWidthPercentage: 0.1,
        brokenLinesLengthPercentage: 0.5,
        lightStickWidth: [0.12, 0.5],
        lightStickHeight: [1.3, 1.7],
        movingAwaySpeed: [60, 80],
        movingCloserSpeed: [-120, -160],
        carLightsLength: [400 * 0.03, 400 * 0.2],
        carLightsRadius: [0.05, 0.14],
        carWidthPercentage: [0.3, 0.5],
        carShiftX: [-0.8, 0.8],
        carFloorSeparation: [0, 5],
        colors: {
          roadColor: 0xffffff,
          islandColor: 0xffffff,
          background: 0xffffff,
          shoulderLines: 0xFFFFFF,
          brokenLines: 0xFFFFFF,
          leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
          rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
          sticks: 0x03B3C3,
        }
      }}/>
      {/* Carousel section - full width display */}
      <div className="home-carousel-wrapper" ref={carouselRef}>
        <Carousel className="home-carousel">
          {banners.map(banner => (
            <Carousel.Item key={banner.id}>
              <Link to={banner.link}>
                <div
                  className="carousel-image"
                  style={{ backgroundImage: `url(${banner.image})` }}
                ></div>
              </Link>
              <Carousel.Caption>
                <Container>
                  <h2>{banner.title}</h2>
                  <p>{banner.description}</p>
                </Container>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* Service features section */}
      <section className="services-section" ref={servicesRef}>
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
      <section className="categories-section" ref={categoriesRef}>
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
      <section className="featured-products-section" ref={productsRef}>
        <Container>
          <h2 className="section-title">Featured Products</h2>

          {/* Error message */}
          {error && (
            <Alert variant="danger" className="mb-3" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          <Row className="g-4">
          {loading ? (
            <div className="text-center">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : (
            featuredProducts.map(product => (
              <Col md={3} sm={6} key={product.id}>
                <FlipCard
                  product={product}
                  isFlipped={flippedCards[product.id]}
                  onAddToCart={handleAddToCart}
                />
              </Col>
            ))
          )}
        </Row>
        <div className="text-center mt-4">
          <Link to="/products">
            <IconButton
              icon={FaSearch}
              text="View All Products"
              variant="gradient"
              size="lg"
            />
          </Link>
        </div>
        </Container>
      </section>

      {/* Promotional ads section */}
      <section className="promo-section" ref={promoRef}>
        <Container>
          <Row className="g-4">
          <Col md={6}>
            <div className="promo-card" style={{ backgroundImage: 'url(/images/new_customer_discount.png)' }}>
              <div className="promo-content">
                <h3>New Customer Special</h3>
                <p>$10 off your first order</p>
                <Link to="/register">
                  <IconButton text="Register Now" variant="light" size="sm" />
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
                  <IconButton text="Shop Now" variant="light" size="sm" />
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