import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Badge,
  Alert,
  Pagination,
  InputGroup,
} from 'react-bootstrap';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaSearch,
  FaSave,
  FaTimes
} from 'react-icons/fa';
import apiService from '../../services/api';
import { Toast } from '../../components/Toast';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image: '',
    is_active: true
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category_id', selectedCategory);
      
      const response = await apiService.get(`/products/?${params}`);
      setProducts(response);
      
      // Calculate total pages (simplified - in real app, backend should return total count)
      const totalItems = response.length < itemsPerPage ? 
        (currentPage - 1) * itemsPerPage + response.length : 
        currentPage * itemsPerPage + 1;
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
      
    } catch (error) {
      console.error('Error fetching products:', error);
      Toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiService.get('/categories/');
      setCategories(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 验证文件类型
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        Toast.error('Please select a valid image file (JPG, PNG, GIF, WebP)');
        return;
      }

      // 验证文件大小 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        Toast.error('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // 创建图片预览
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;

    try {
      setUploading(true);
      console.log('Starting image upload...', selectedFile.name);
      
      // 检查token
      const token = localStorage.getItem('auth_token');
      console.log('Current token:', token ? token.substring(0, 20) + '...' : 'No token');
      
      const response = await apiService.uploadFile('/products/upload-image', selectedFile);
      console.log('Upload successful:', response);
      return response.filename;
    } catch (error) {
      console.error('Error uploading image:', error);
      console.error('Error details:', error.response?.data || error.message);
      Toast.error('Failed to upload image: ' + (error.response?.data?.detail || error.message));
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let imageFilename = formData.image;
      
      // 如果选择了新文件，先上传图片
      if (selectedFile) {
        imageFilename = await uploadImage();
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category_id: parseInt(formData.category_id),
        image: imageFilename
      };

      if (editingProduct) {
        await apiService.put(`/products/${editingProduct.id}`, productData);
        Toast.success('Product updated successfully');
      } else {
        await apiService.post('/products/', productData);
        Toast.success('Product created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      Toast.error('Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category_id: product.category_id.toString(),
      image: product.image || '',
      is_active: product.is_active
    });
    setShowModal(true);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleViewDetails = (product) => {
    setProductDetails(product);
    setShowDetailsModal(true);
  };

  const confirmDelete = async () => {
    try {
      await apiService.delete(`/products/${productToDelete.id}`);
      Toast.success('Product deleted successfully');
      setShowDeleteModal(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      Toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category_id: '',
      image: '',
      is_active: true
    });
    setEditingProduct(null);
    setSelectedFile(null);
    setImagePreview(null);
    setUploading(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return <Badge bg="danger">Out of Stock</Badge>;
    if (stock < 10) return <Badge bg="warning">Low Stock</Badge>;
    return <Badge bg="success">In Stock</Badge>;
  };

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && currentPage === 1) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="product-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Product Management</h1>
        <Button
          variant="light"
          size="sm"
          onClick={() => setShowModal(true)}
          className="d-flex align-items-center"
        >
          <FaPlus className="me-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card className="admin-card mb-4">
        <Card.Body>
          <Row>
            <Col md={6} className="mb-3 mb-md-0">
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4} className="mb-3 mb-md-0">
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button
                variant="light"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setCurrentPage(1);
                }}
              >
                Clear
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Products Table */}
      <Card className="admin-card admin-table">
        <Card.Body className="p-0">
          <Table responsive className="mb-0">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <div className="text-muted">No products found</div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img 
                          src={product.image_url || (product.image ? `/images/${product.image}` : '/images/placeholder.svg')}
                          alt={product.name}
                          className="product-thumbnail me-3"
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <div>
                          <div className="fw-bold">{product.name}</div>
                          <div className="text-muted small">
                            {product.description?.substring(0, 50)}
                            {product.description?.length > 50 ? '...' : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{getCategoryName(product.category_id)}</td>
                    <td className="fw-bold">{formatCurrency(product.price)}</td>
                    <td>
                      <div>{product.stock}</div>
                      {getStockBadge(product.stock)}
                    </td>
                    <td>
                      <Badge bg={product.is_active ? 'success' : 'secondary'}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => handleViewDetails(product)}
                          title="View Details"
                        >
                          <FaEye />
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          title="Edit Product"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => handleDelete(product)}
                          title="Delete Product"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Card.Footer>
            <Pagination className="justify-content-center mb-0">
              <Pagination.Prev 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              />
            </Pagination>
          </Card.Footer>
        )}
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter product name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      placeholder="0.00"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity *</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    placeholder="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Row>
                <Col md={8}>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="mb-2"
                  />
                  <Form.Text className="text-muted">
                    Select an image file (JPG, PNG, GIF, WebP). Maximum size: 5MB
                  </Form.Text>
                  {(editingProduct && formData.image && !imagePreview) && (
                    <div className="mt-2">
                      <small className="text-info">Current image: {formData.image}</small>
                    </div>
                  )}
                </Col>
                <Col md={4}>
                  {imagePreview && (
                    <div className="text-center">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
                        className="border rounded"
                      />
                      <div className="mt-1">
                        <small className="text-muted">Preview</small>
                      </div>
                    </div>
                  )}
                  {uploading && (
                    <div className="text-center">
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Uploading...</span>
                      </div>
                      <div className="mt-1">
                        <small className="text-muted">Uploading...</small>
                      </div>
                    </div>
                  )}
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                label="Product is active and visible to customers"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" size="sm" onClick={handleModalClose}>
              <FaTimes className="me-2" />
              Cancel
            </Button>
            <Button variant="light" size="sm" type="submit">
              <FaSave className="me-2" />
              {editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Product Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productDetails && (
            <Row>
              <Col md={6}>
                <div className="product-detail-image">
                  <img 
                    src={productDetails.image_url || productDetails.image || '/images/placeholder.svg'}
                    alt={productDetails.name}
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="product-detail-info">
                  <h5>{productDetails.name}</h5>
                  <p className="text-muted mb-3">{productDetails.description}</p>
                  
                  <div className="detail-row mb-2">
                    <strong>价格: </strong>
                    <span className="text-success fs-5">{formatCurrency(productDetails.price)}</span>
                  </div>
                  
                  <div className="detail-row mb-2">
                    <strong>库存: </strong>
                    {getStockBadge(productDetails.stock)} 
                    <span className="ms-2">({productDetails.stock} 件)</span>
                  </div>
                  
                  <div className="detail-row mb-2">
                    <strong>分类: </strong>
                    <Badge bg="info">{getCategoryName(productDetails.category_id)}</Badge>
                  </div>
                  
                  <div className="detail-row mb-2">
                    <strong>状态: </strong>
                    <Badge bg={productDetails.is_active ? 'success' : 'secondary'}>
                      {productDetails.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="detail-row mb-2">
                    <strong>创建时间: </strong>
                    <span>{new Date(productDetails.created_at).toLocaleDateString('zh-CN')}</span>
                  </div>
                  
                  {productDetails.updated_at && (
                    <div className="detail-row mb-2">
                      <strong>更新时间: </strong>
                      <span>{new Date(productDetails.updated_at).toLocaleDateString('zh-CN')}</span>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" size="sm" onClick={() => setShowDetailsModal(false)}>
            关闭
          </Button>
          <Button variant="light" size="sm" onClick={() => {
            setShowDetailsModal(false);
            handleEdit(productDetails);
          }}>
            <FaEdit className="me-2" />
            编辑产品
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <strong>Warning!</strong> This action cannot be undone.
          </Alert>
          <p>Are you sure you want to delete <strong>{productToDelete?.name}</strong>?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" size="sm" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="light" size="sm" onClick={confirmDelete}>
            Delete Product
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductManagement;