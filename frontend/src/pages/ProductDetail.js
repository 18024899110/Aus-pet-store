import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Breadcrumb, Button, Tabs, Tab, Form } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { FaStar, FaRegStar, FaShoppingCart, FaHeart, FaShare, FaCheck } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // 模拟从API获取产品数据
  useEffect(() => {
    setLoading(true);
    
    // 模拟API请求延迟
    setTimeout(() => {
      // 这里应该是实际的API调用
      // 例如: fetch(`/api/products/${id}`)
      
      // 模拟产品数据
      const mockProduct = {
        id: parseInt(id),
        name: '优质狗粮 10kg',
        brand: 'Royal Canin',
        price: 89.99,
        oldPrice: 99.99,
        rating: 4.8,
        reviewCount: 124,
        category: 'dog',
        stock: 15,
        description: '高品质狗粮，适合所有成年犬。富含优质蛋白质和必要的维生素，确保您的爱犬健康成长。',
        features: [
          '100%天然成分，无人工添加剂',
          '富含Omega-3脂肪酸，促进皮肤和毛发健康',
          '添加益生菌，改善消化系统健康',
          '适合所有品种的成年犬',
          '澳洲制造，品质保证'
        ],
        specifications: {
          '重量': '10kg',
          '适用年龄': '成年犬（1岁以上）',
          '主要成分': '鸡肉、糙米、蔬菜',
          '产地': '澳大利亚',
          '保质期': '18个月'
        },
        images: [
          '/images/product1.jpg',
          '/images/product1-2.jpg',
          '/images/product1-3.jpg',
          '/images/product1-4.jpg'
        ],
        relatedProducts: [
          {
            id: 5,
            name: '狗狗训练零食',
            image: '/images/product5.jpg',
            price: 15.99,
            rating: 4.4
          },
          {
            id: 7,
            name: '狗狗玩具球',
            image: '/images/product7.jpg',
            price: 12.99,
            rating: 4.2
          },
          {
            id: 3,
            name: '宠物自动喂食器',
            image: '/images/product3.jpg',
            price: 129.99,
            rating: 4.7
          }
        ],
        reviews: [
          {
            id: 1,
            user: '张先生',
            rating: 5,
            date: '2023-05-15',
            comment: '我家的金毛非常喜欢这款狗粮，毛发也变得更加光亮了！'
          },
          {
            id: 2,
            user: '李女士',
            rating: 4,
            date: '2023-05-10',
            comment: '质量很好，但价格稍贵。不过看到狗狗吃得开心，还是值得的。'
          },
          {
            id: 3,
            user: '王先生',
            rating: 5,
            date: '2023-05-01',
            comment: '包装完好，送货速度快，狗狗很喜欢吃。'
          }
        ]
      };
      
      setProduct(mockProduct);
      setLoading(false);
    }, 1000);
  }, [id]);
  
  // 处理数量变化
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };
  
  // 增加数量
  const increaseQuantity = () => {
    if (quantity < (product?.stock || 1)) {
      setQuantity(quantity + 1);
    }
  };
  
  // 减少数量
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  // 添加到购物车
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      
      // 3秒后重置添加到购物车状态
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    }
  };
  
  // 渲染评分星星
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
      <div className="loading-container">
        <div className="spinner"></div>
        <p>正在加载商品信息...</p>
      </div>
    );
  }
  
  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h2>商品未找到</h2>
        <p>抱歉，您查找的商品不存在或已被移除。</p>
        <Link to="/products">
          <Button variant="primary">返回商品列表</Button>
        </Link>
      </Container>
    );
  }
  
  return (
    <div className="product-detail-page">
      <Container>
        {/* 面包屑导航 */}
        <Breadcrumb className="product-breadcrumb">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>首页</Breadcrumb.Item>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/products' }}>全部商品</Breadcrumb.Item>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/products/${product.category}` }}>
            {product.category === 'dog' ? '狗狗用品' : 
             product.category === 'cat' ? '猫咪用品' : 
             product.category === 'small-pet' ? '小宠用品' : '其他用品'}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
        </Breadcrumb>
        
        {/* 产品信息部分 */}
        <div className="product-main">
          <Row>
            {/* 产品图片 */}
            <Col lg={6} className="product-images">
              <div className="main-image-container">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name} 
                  className="main-image"
                />
              </div>
              <div className="thumbnail-container">
                {product.images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.name} - 图片 ${index + 1}`} />
                  </div>
                ))}
              </div>
            </Col>
            
            {/* 产品信息 */}
            <Col lg={6} className="product-info">
              <div className="product-brand">{product.brand}</div>
              <h1 className="product-title">{product.name}</h1>
              
              <div className="product-rating">
                <div className="stars">
                  {renderStars(product.rating)}
                  <span className="rating-value">{product.rating}</span>
                </div>
                <div className="review-count">
                  {product.reviewCount} 条评价
                </div>
              </div>
              
              <div className="product-price-container">
                <div className="current-price">${product.price.toFixed(2)}</div>
                {product.oldPrice && (
                  <div className="old-price">${product.oldPrice.toFixed(2)}</div>
                )}
              </div>
              
              <div className="product-description">
                {product.description}
              </div>
              
              <div className="product-features">
                <h5>产品特点：</h5>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div className="product-actions">
                <div className="quantity-selector">
                  <Button 
                    variant="outline-secondary" 
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <Form.Control 
                    type="number" 
                    min="1" 
                    max={product.stock} 
                    value={quantity} 
                    onChange={handleQuantityChange}
                  />
                  <Button 
                    variant="outline-secondary" 
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
                
                <div className="stock-info">
                  库存: <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                    {product.stock > 0 ? `${product.stock} 件` : '缺货'}
                  </span>
                </div>
                
                <div className="action-buttons">
                  <Button 
                    variant="primary" 
                    className="add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={addedToCart || product.stock <= 0}
                  >
                    {addedToCart ? (
                      <>
                        <FaCheck className="me-2" />
                        已添加到购物车
                      </>
                    ) : (
                      <>
                        <FaShoppingCart className="me-2" />
                        添加到购物车
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline-secondary" className="wishlist-btn">
                    <FaHeart />
                  </Button>
                  
                  <Button variant="outline-secondary" className="share-btn">
                    <FaShare />
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        
        {/* 产品详情选项卡 */}
        <div className="product-details-tabs">
          <Tabs defaultActiveKey="specifications" className="mb-4">
            <Tab eventKey="specifications" title="规格参数">
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
            <Tab eventKey="reviews" title={`评价 (${product.reviewCount})`}>
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
        
        {/* 相关商品 */}
        <div className="related-products">
          <h3 className="section-title">相关商品</h3>
          <Row>
            {product.relatedProducts.map(relatedProduct => (
              <Col md={4} key={relatedProduct.id} className="mb-4">
                <div className="related-product-card">
                  <Link to={`/product/${relatedProduct.id}`} className="product-link">
                    <div className="related-product-image">
                      <img src={relatedProduct.image} alt={relatedProduct.name} />
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