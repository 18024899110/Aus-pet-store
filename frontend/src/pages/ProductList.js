import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Breadcrumb, Alert } from 'react-bootstrap';
import { Link, useParams, useLocation } from 'react-router-dom';
import { FaFilter, FaTimes, FaSort } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { productService, categoryService } from '../services';
import ProductImage from '../components/ProductImage';
import './ProductList.css';

const ProductList = () => {
  const { category } = useParams();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);

  // Get search keywords from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [categories, setCategories] = useState([]);  // 存储从API获取的分类列表

  const [brands] = useState([
    { id: 1, name: 'PetLife' },
    { id: 2, name: 'Royal Canin' },
    { id: 3, name: 'Whiskas' },
    { id: 4, name: 'Pedigree' },
    { id: 5, name: 'Kong' },
  ]);

  // Load categories from API on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load product data from API
  useEffect(() => {
    if (categories.length > 0 || !category) {
      loadProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, searchQuery, categories]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const getCategoryIdBySlug = (slug) => {
    const categoryItem = categories.find(cat => cat.slug === slug);
    return categoryItem ? categoryItem.id : null;
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};

      if (category) {
        // 动态查找分类ID
        const categoryId = getCategoryIdBySlug(category);
        if (categoryId) {
          params.category_id = categoryId;
        }
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const data = await productService.getProducts(params);
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
      setError('Failed to load products, please try again later');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle sorting
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
        sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Default sort by featured, no changes
        break;
    }
    
    setProducts(sortedProducts);
  };
  
  // Handle brand filtering
  const handleBrandChange = (brandId) => {
    if (selectedBrands.includes(brandId)) {
      setSelectedBrands(selectedBrands.filter(id => id !== brandId));
    } else {
      setSelectedBrands([...selectedBrands, brandId]);
    }
  };
  
  // Apply filters
  const applyFilters = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        min_price: priceRange[0],
        max_price: priceRange[1]
      };

      if (category) {
        // 动态查找分类ID
        const categoryId = getCategoryIdBySlug(category);
        if (categoryId) {
          params.category_id = categoryId;
        }
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const data = await productService.getProducts(params);
      
      let filteredProducts = data;
      
      // Frontend brand filtering (if backend doesn't support brand filtering)
      if (selectedBrands.length > 0) {
        const selectedBrandNames = brands
          .filter(brand => selectedBrands.includes(brand.id))
          .map(brand => brand.name);
        
        filteredProducts = filteredProducts.filter(product => 
          selectedBrandNames.includes(product.brand)
        );
      }
      
      setProducts(filteredProducts);
      setShowFilters(false);
    } catch (error) {
      console.error('Failed to apply filters:', error);
      setError('Failed to apply filters, please try again later');
    } finally {
      setLoading(false);
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setPriceRange([0, 500]);
    setSelectedBrands([]);
    loadProducts();
  };
  
  // Get page title
  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results: "${searchQuery}"`;
    }
    
    switch (category) {
      case 'dog':
        return 'Dog Supplies';
      case 'cat':
        return 'Cat Supplies';
      case 'small-pet':
        return 'Small Pet Supplies';
      default:
        return 'All Products';
    }
  };
  
  return (
    <div className="product-list-page">
      <Container>
        {/* Breadcrumb navigation */}
        <Breadcrumb className="product-breadcrumb">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Home</Breadcrumb.Item>
          {category ? (
            <>
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/products' }}>
                All Products
              </Breadcrumb.Item>
              <Breadcrumb.Item active>{getPageTitle()}</Breadcrumb.Item>
            </>
          ) : (
            <Breadcrumb.Item active>All Products</Breadcrumb.Item>
          )}
        </Breadcrumb>
        
        <h1 className="page-title">{getPageTitle()}</h1>
        
        {/* Error message */}
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        
        {/* Filter button on mobile devices */}
        <div className="filter-toggle d-lg-none mb-3">
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowFilters(!showFilters)}
            className="w-100"
          >
            {showFilters ? (
              <>
                <FaTimes className="me-2" /> Close Filters
              </>
            ) : (
              <>
                <FaFilter className="me-2" /> Show Filter Options
              </>
            )}
          </Button>
        </div>
        
        <Row>
          {/* Filter sidebar */}
          <Col lg={3} className={`filter-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filter-header d-flex justify-content-between align-items-center">
              <h4>Filters</h4>
              <Button 
                variant="link" 
                className="p-0 d-lg-none" 
                onClick={() => setShowFilters(false)}
              >
                <FaTimes />
              </Button>
            </div>
            
            <div className="filter-section">
              <h5>Price Range</h5>
              <div className="price-inputs d-flex align-items-center">
                <Form.Control 
                  type="number" 
                  min="0" 
                  value={priceRange[0]} 
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                />
                <span className="mx-2">to</span>
                <Form.Control 
                  type="number" 
                  min="0" 
                  value={priceRange[1]} 
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                />
              </div>
            </div>
            
            <div className="filter-section">
              <h5>Brand</h5>
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
                Apply Filters
              </Button>
              <Button variant="outline-secondary" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </Col>
          
          {/* Product list */}
          <Col lg={9}>
            {/* Sorting and result count */}
            <div className="product-list-header d-flex justify-content-between align-items-center mb-4">
              <div className="results-count">
                {loading ? 'Loading...' : `${products.length} products`}
              </div>
              <div className="sort-options d-flex align-items-center">
                <FaSort className="me-2" />
                <Form.Select 
                  value={sortBy} 
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="featured">Featured Products</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </Form.Select>
              </div>
            </div>
            
            {/* Loading state */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner"></div>
                <p className="mt-3">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-5">
                <h4>No products found matching your criteria</h4>
                <p>Please try adjusting your filters or search for other keywords</p>
              </div>
            ) : (
              <Row>
                {products.map(product => (
                  <Col md={4} sm={6} key={product.id} className="mb-4">
                    <Card className="product-card">
                      <Link to={`/product/${product.id}`} className="product-link">
                        <ProductImage 
                          src={product.image_url || product.image} 
                          alt={product.name}
                          className="product-image"
                          containerClass="product-image-wrapper"
                        />
                      </Link>
                      <Card.Body>
                        <div className="product-category">{product.category?.name || product.category}</div>
                        <Link to={`/product/${product.id}`} className="product-link">
                          <Card.Title>{product.name}</Card.Title>
                        </Link>
                        {product.rating && (
                          <div className="product-rating">
                            {'★'.repeat(Math.floor(product.rating))}
                            {'☆'.repeat(5 - Math.floor(product.rating))}
                            <span className="rating-number">{product.rating}</span>
                          </div>
                        )}
                        <div className="product-price">${product.price ? product.price.toFixed(2) : '0.00'}</div>
                        <div className="product-buttons">
                          <Link to={`/product/${product.id}`}>
                            <Button variant="outline-primary" size="sm">View Details</Button>
                          </Link>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => addToCart(product)}
                          >
                            Add to Cart
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