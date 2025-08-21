import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Breadcrumb, Button, Tabs, Tab, Form, Alert } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { FaStar, FaRegStar, FaShoppingCart, FaHeart, FaShare, FaCheck } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { productService } from '../services';
import ProductImage from '../components/ProductImage';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Fetch product data from API
  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  
  const loadProduct = async () => {
    try {
      setLoading(true);
      setError('');
      
      const productData = await productService.getProduct(id);
      
      // Use default values if backend doesn't return some fields
      const product = {
        ...productData,
        images: productData.images || [productData.image_url || productData.image || '/images/default-product.jpg'],
        features: productData.features || [],
        specifications: productData.specifications || {},
        reviews: productData.reviews || [],
        relatedProducts: [] // TODO: Implement related products recommendation
      };
      
      setProduct(product);
    } catch (error) {
      console.error('Failed to load product details:', error);
      setError('Failed to load product details, please try again later');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };
  
  // Increase quantity
  const increaseQuantity = () => {
    if (quantity < (product?.stock || 1)) {
      setQuantity(quantity + 1);
    }
  };
  
  // Decrease quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  // Add to cart
  const handleAddToCart = async () => {
    if (product) {
      try {
        await addToCart(product, quantity);
        setAddedToCart(true);
        
        // Reset add to cart status after 3 seconds
        setTimeout(() => {
          setAddedToCart(false);
        }, 3000);
      } catch (error) {
        console.error('Failed to add to cart:', error);
        setError('Failed to add to cart, please try again later');
      }
    }
  };
  
  // Render rating stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<FaStar key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };
  
  if (loading) {
    return (
      <Container className="product-detail-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading product information...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="product-detail-page">
        <div className="error-container py-5 text-center">
          <Alert variant="danger">{error}</Alert>
          <Link to="/products">
            <Button variant="primary">Back to Product List</Button>
          </Link>
        </div>
      </Container>
    );
  }
  
  if (!product) {
    return (
      <Container className="product-detail-page">
        <div className="py-5 text-center">
          <h2>Product Not Found</h2>
          <p>Sorry, the product you are looking for does not exist or has been removed.</p>
          <Link to="/products">
            <Button variant="primary">Back to Product List</Button>
          </Link>
        </div>
      </Container>
    );
  }
  
  return (
    <div className="product-detail-page">
      <Container>
        {/* 面包屑导航 */}
        <Breadcrumb className="product-breadcrumb">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Home</Breadcrumb.Item>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/products' }}>All Products</Breadcrumb.Item>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/products/${product.category.slug}` }}>
            {product.category.name}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
        </Breadcrumb>
        
        {/* Product Information Section */}
        <div className="product-main">
          <Row className="g-4">
            {/* Product Images */}
            <Col lg={7} xl={6} className="product-images">
              <div className="image-gallery">
                <div className="main-image-wrapper">
                  <ProductImage 
                    src={product.images[selectedImage]} 
                    alt={product.name} 
                    className="main-image"
                    containerClass="main-image-container"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="thumbnail-container">
                    {product.images.map((image, index) => (
                      <div 
                        key={index} 
                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                        onClick={() => setSelectedImage(index)}
                      >
                        <ProductImage 
                          src={image} 
                          alt={`${product.name} - Image ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Col>
            
            {/* Product Information */}
            <Col lg={5} xl={6} className="product-info">
              <div className="product-info-content">
                {product.brand && <div className="product-brand">{product.brand}</div>}
                <h1 className="product-title">{product.name}</h1>
                
                {(product.rating || product.reviewCount) && (
                  <div className="product-rating-section">
                    <div className="rating-wrapper">
                      <div className="stars">
                        {renderStars(product.rating || 5)}
                        <span className="rating-value">{(product.rating || 5).toFixed(1)}</span>
                      </div>
                      <div className="review-count">
                        ({product.reviewCount || 0} reviews)
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="price-section">
                  <div className="current-price">¥{product.price.toFixed(2)}</div>
                  {product.oldPrice && (
                    <div className="old-price">¥{product.oldPrice.toFixed(2)}</div>
                  )}
                </div>
                
                <div className="product-description">
                  <p>{product.description}</p>
                </div>
                
                {product.features && product.features.length > 0 && (
                  <div className="product-highlights">
                    <h6>Product Features</h6>
                    <ul className="features-list">
                      {product.features.map((feature, index) => (
                        <li key={index}>
                          <FaCheck className="check-icon" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="purchase-section">
                  <div className="stock-quantity-row">
                    <div className="stock-info">
                      <span className="stock-label">Stock:</span>
                      <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                        {product.stock > 0 ? `${product.stock} units` : 'Out of stock'}
                      </span>
                    </div>
                    
                    <div className="quantity-selector">
                      <span className="quantity-label">Quantity:</span>
                      <div className="quantity-controls">
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={decreaseQuantity}
                          disabled={quantity <= 1}
                          className="qty-btn"
                        >
                          -
                        </Button>
                        <Form.Control 
                          type="number" 
                          min="1" 
                          max={product.stock} 
                          value={quantity} 
                          onChange={handleQuantityChange}
                          className="qty-input"
                        />
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={increaseQuantity}
                          disabled={quantity >= product.stock}
                          className="qty-btn"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="action-buttons">
                    <Button 
                      variant="primary" 
                      size="lg"
                      className="add-to-cart-btn"
                      onClick={handleAddToCart}
                      disabled={addedToCart || product.stock <= 0}
                    >
                      {addedToCart ? (
                        <>
                          <FaCheck className="me-2" />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <FaShoppingCart className="me-2" />
                          Buy Now
                        </>
                      )}
                    </Button>
                    
                    <div className="secondary-actions">
                      <Button variant="outline-primary" className="action-btn">
                        <FaHeart className="me-1" />
                        Favorite
                      </Button>
                      
                      <Button variant="outline-secondary" className="action-btn">
                        <FaShare className="me-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        
        {/* Product Details Tabs */}
        <div className="product-details-tabs">
          <Tabs defaultActiveKey="specifications" className="mb-4">
            <Tab eventKey="specifications" title="Specifications">
              <div className="specifications-table">
                <table>
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Tab>
            <Tab eventKey="reviews" title={`Reviews (${product.reviewCount})`}>
              <div className="reviews-container">
                {product.reviews.map(review => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-name">{review.user}</div>
                      <div className="review-date">{review.date}</div>
                    </div>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                    <div className="review-comment">
                      {review.comment}
                    </div>
                  </div>
                ))}
              </div>
            </Tab>
          </Tabs>
        </div>
        
        {/* Related Products */}
        <div className="related-products">
          <h3 className="section-title">Related Products</h3>
          <Row>
            {product.relatedProducts.map(relatedProduct => (
              <Col md={4} key={relatedProduct.id} className="mb-4">
                <div className="related-product-card">
                  <Link to={`/product/${relatedProduct.id}`} className="product-link">
                    <div className="related-product-image">
                      <img src={relatedProduct.image_url || relatedProduct.image} alt={relatedProduct.name} />
                    </div>
                    <div className="related-product-info">
                      <h5>{relatedProduct.name}</h5>
                      <div className="related-product-rating">
                        {renderStars(relatedProduct.rating)}
                      </div>
                      <div className="related-product-price">
                        ${relatedProduct.price.toFixed(2)}
                      </div>
                    </div>
                  </Link>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetail; 