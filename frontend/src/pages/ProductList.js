import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Breadcrumb } from 'react-bootstrap';
import { Link, useParams, useLocation } from 'react-router-dom';
import { FaFilter, FaTimes, FaSort } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import './ProductList.css';

const ProductList = () => {
  const { category } = useParams();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);
  
  // 获取URL参数中的搜索关键词
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  
  // 品牌列表（实际应用中应从API获取）
  const brands = [
    { id: 1, name: 'PetLife' },
    { id: 2, name: 'Royal Canin' },
    { id: 3, name: 'Whiskas' },
    { id: 4, name: 'Pedigree' },
    { id: 5, name: 'Kong' },
  ];
  
  // 模拟从API获取产品数据
  useEffect(() => {
    setLoading(true);
    
    // 模拟API请求延迟
    setTimeout(() => {
      // 这里应该是实际的API调用
      // 例如: fetch(`/api/products?category=${category}&search=${searchQuery}`)
      
      // 模拟产品数据
      const mockProducts = [
        {
          id: 1,
          name: '优质狗粮 10kg',
          image: '/images/product1.jpg',
          price: 89.99,
          rating: 4.8,
          category: 'dog',
          brand: 'Royal Canin',
          description: '高品质狗粮，适合所有成年犬。'
        },
        {
          id: 2,
          name: '猫咪磨爪玩具',
          image: '/images/product2.jpg',
          price: 29.99,
          rating: 4.5,
          category: 'cat',
          brand: 'PetLife',
          description: '耐用猫咪磨爪玩具，保护您的家具。'
        },
        {
          id: 3,
          name: '宠物自动喂食器',
          image: '/images/product3.jpg',
          price: 129.99,
          rating: 4.7,
          category: 'accessories',
          brand: 'PetLife',
          description: '智能宠物喂食器，可定时定量。'
        },
        {
          id: 4,
          name: '猫咪营养膏',
          image: '/images/product4.jpg',
          price: 19.99,
          rating: 4.6,
          category: 'cat',
          brand: 'Whiskas',
          description: '提供猫咪所需的全面营养。'
        },
        {
          id: 5,
          name: '狗狗训练零食',
          image: '/images/product5.jpg',
          price: 15.99,
          rating: 4.4,
          category: 'dog',
          brand: 'Pedigree',
          description: '适合训练的美味零食，狗狗喜爱。'
        },
        {
          id: 6,
          name: '猫咪舒适窝',
          image: '/images/product6.jpg',
          price: 45.99,
          rating: 4.3,
          category: 'cat',
          brand: 'PetLife',
          description: '柔软舒适的猫窝，让猫咪有自己的空间。'
        },
        {
          id: 7,
          name: '狗狗玩具球',
          image: '/images/product7.jpg',
          price: 12.99,
          rating: 4.2,
          category: 'dog',
          brand: 'Kong',
          description: '耐咬耐用的狗狗玩具球。'
        },
        {
          id: 8,
          name: '小宠饲料',
          image: '/images/product8.jpg',
          price: 9.99,
          rating: 4.0,
          category: 'small-pet',
          brand: 'PetLife',
          description: '适合仓鼠、兔子等小宠物的营养饲料。'
        }
      ];
      
      // 根据类别和搜索关键词过滤产品
      let filteredProducts = mockProducts;
      
      if (category) {
        filteredProducts = filteredProducts.filter(product => product.category === category);
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query)
        );
      }
      
      setProducts(filteredProducts);
      setLoading(false);
    }, 1000);
  }, [category, searchQuery]);
  
  // 处理排序
  const handleSort = (value) => {
    setSortBy(value);
    let sortedProducts = [...products];
    
    switch (value) {
      case 'price-low':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // 默认按特色排序，不做任何改变
        break;
    }
    
    setProducts(sortedProducts);
  };
  
  // 处理品牌筛选
  const handleBrandChange = (brandId) => {
    if (selectedBrands.includes(brandId)) {
      setSelectedBrands(selectedBrands.filter(id => id !== brandId));
    } else {
      setSelectedBrands([...selectedBrands, brandId]);
    }
  };
  
  // 应用筛选
  const applyFilters = () => {
    setLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      // 这里应该是实际的API调用
      // 例如: fetch(`/api/products?category=${category}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&brands=${selectedBrands.join(',')}`)
      
      // 为演示目的，我们只是重新过滤现有的产品
      let filteredProducts = products.filter(product => 
        product.price >= priceRange[0] && 
        product.price <= priceRange[1]
      );
      
      if (selectedBrands.length > 0) {
        const selectedBrandNames = brands
          .filter(brand => selectedBrands.includes(brand.id))
          .map(brand => brand.name);
        
        filteredProducts = filteredProducts.filter(product => 
          selectedBrandNames.includes(product.brand)
        );
      }
      
      setProducts(filteredProducts);
      setLoading(false);
      setShowFilters(false); // 在移动设备上应用筛选后关闭筛选面板
    }, 500);
  };
  
  // 重置筛选
  const resetFilters = () => {
    setPriceRange([0, 500]);
    setSelectedBrands([]);
    // 重新加载产品
    // 实际应用中应重新调用API
  };
  
  // 获取页面标题
  const getPageTitle = () => {
    if (searchQuery) {
      return `搜索结果: "${searchQuery}"`;
    }
    
    switch (category) {
      case 'dog':
        return '狗狗用品';
      case 'cat':
        return '猫咪用品';
      case 'small-pet':
        return '小宠用品';
      default:
        return '全部商品';
    }
  };
  
  return (
    <div className="product-list-page">
      <Container>
        {/* 面包屑导航 */}
        <Breadcrumb className="product-breadcrumb">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>首页</Breadcrumb.Item>
          {category ? (
            <>
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/products' }}>
                全部商品
              </Breadcrumb.Item>
              <Breadcrumb.Item active>{getPageTitle()}</Breadcrumb.Item>
            </>
          ) : (
            <Breadcrumb.Item active>全部商品</Breadcrumb.Item>
          )}
        </Breadcrumb>
        
        <h1 className="page-title">{getPageTitle()}</h1>
        
        {/* 移动设备上的筛选按钮 */}
        <div className="filter-toggle d-lg-none mb-3">
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowFilters(!showFilters)}
            className="w-100"
          >
            {showFilters ? (
              <>
                <FaTimes className="me-2" /> 关闭筛选
              </>
            ) : (
              <>
                <FaFilter className="me-2" /> 显示筛选选项
              </>
            )}
          </Button>
        </div>
        
        <Row>
          {/* 筛选侧边栏 */}
          <Col lg={3} className={`filter-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filter-header d-flex justify-content-between align-items-center">
              <h4>筛选</h4>
              <Button 
                variant="link" 
                className="p-0 d-lg-none" 
                onClick={() => setShowFilters(false)}
              >
                <FaTimes />
              </Button>
            </div>
            
            <div className="filter-section">
              <h5>价格范围</h5>
              <div className="price-inputs d-flex align-items-center">
                <Form.Control 
                  type="number" 
                  min="0" 
                  value={priceRange[0]} 
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                />
                <span className="mx-2">至</span>
                <Form.Control 
                  type="number" 
                  min="0" 
                  value={priceRange[1]} 
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                />
              </div>
            </div>
            
            <div className="filter-section">
              <h5>品牌</h5>
              {brands.map(brand => (
                <Form.Check 
                  key={brand.id}
                  type="checkbox"
                  id={`brand-${brand.id}`}
                  label={brand.name}
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() => handleBrandChange(brand.id)}
                  className="mb-2"
                />
              ))}
            </div>
            
            <div className="filter-actions">
              <Button variant="primary" onClick={applyFilters} className="me-2">
                应用筛选
              </Button>
              <Button variant="outline-secondary" onClick={resetFilters}>
                重置
              </Button>
            </div>
          </Col>
          
          {/* 产品列表 */}
          <Col lg={9}>
            {/* 排序和结果计数 */}
            <div className="product-list-header d-flex justify-content-between align-items-center mb-4">
              <div className="results-count">
                {loading ? '加载中...' : `${products.length} 个商品`}
              </div>
              <div className="sort-options d-flex align-items-center">
                <FaSort className="me-2" />
                <Form.Select 
                  value={sortBy} 
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="featured">推荐商品</option>
                  <option value="price-low">价格: 从低到高</option>
                  <option value="price-high">价格: 从高到低</option>
                  <option value="rating">评分最高</option>
                </Form.Select>
              </div>
            </div>
            
            {/* 加载状态 */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner"></div>
                <p className="mt-3">正在加载商品...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-5">
                <h4>没有找到符合条件的商品</h4>
                <p>请尝试调整筛选条件或搜索其他关键词</p>
              </div>
            ) : (
              <Row>
                {products.map(product => (
                  <Col md={4} sm={6} key={product.id} className="mb-4">
                    <Card className="product-card">
                      <Link to={`/product/${product.id}`} className="product-link">
                        <div className="product-image-wrapper">
                          <Card.Img variant="top" src={product.image} className="product-image" />
                        </div>
                      </Link>
                      <Card.Body>
                        <div className="product-category">{product.category}</div>
                        <Link to={`/product/${product.id}`} className="product-link">
                          <Card.Title>{product.name}</Card.Title>
                        </Link>
                        <div className="product-rating">
                          {'★'.repeat(Math.floor(product.rating))}
                          {'☆'.repeat(5 - Math.floor(product.rating))}
                          <span className="rating-number">{product.rating}</span>
                        </div>
                        <div className="product-price">${product.price.toFixed(2)}</div>
                        <div className="product-buttons">
                          <Link to={`/product/${product.id}`}>
                            <Button variant="outline-primary" size="sm">查看详情</Button>
                          </Link>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => addToCart(product)}
                          >
                            加入购物车
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductList; 