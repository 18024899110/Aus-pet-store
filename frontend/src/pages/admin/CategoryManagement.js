import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Badge,
  Alert
} from 'react-bootstrap';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave,
  FaTimes
} from 'react-icons/fa';
import apiService from '../../services/api';
import { Toast } from '../../components/Toast';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    is_active: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/categories/');
      setCategories(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
      Toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedValue = type === 'checkbox' ? checked : value;
    
    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value.toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .trim();
      
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: slug
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: updatedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await apiService.put(`/categories/${editingCategory.id}`, formData);
        Toast.success('Category updated successfully');
      } else {
        await apiService.post('/categories/', formData);
        Toast.success('Category created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      if (error.response?.data?.detail?.includes('slug')) {
        Toast.error('Category slug already exists. Please choose a different name.');
      } else {
        Toast.error('Failed to save category');
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      is_active: category.is_active
    });
    setShowModal(true);
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await apiService.delete(`/categories/${categoryToDelete.id}`);
      Toast.success('Category deleted successfully');
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      if (error.response?.data?.detail?.includes('products')) {
        Toast.error('Cannot delete category with existing products');
      } else {
        Toast.error('Failed to delete category');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      is_active: true
    });
    setEditingCategory(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="category-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Category Management</h1>
        <Button
          variant="light"
          size="sm"
          onClick={() => setShowModal(true)}
          className="d-flex align-items-center"
        >
          <FaPlus className="me-2" />
          Add Category
        </Button>
      </div>

      {/* Categories Table */}
      <Card className="admin-card admin-table">
        <Card.Body className="p-0">
          <Table responsive className="mb-0">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Status</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <div className="text-muted">No categories found</div>
                  </td>
                </tr>
              ) : (
                categories.map(category => (
                  <tr key={category.id}>
                    <td>
                      <div className="fw-bold">{category.name}</div>
                    </td>
                    <td>
                      <code className="bg-light px-2 py-1 rounded">{category.slug}</code>
                    </td>
                    <td>
                      <div className="text-muted small">
                        {category.description ? 
                          (category.description.length > 50 ? 
                            category.description.substring(0, 50) + '...' : 
                            category.description
                          ) : 
                          'No description'
                        }
                      </div>
                    </td>
                    <td>
                      <Badge bg={category.is_active ? 'success' : 'secondary'}>
                        {category.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg="info" pill>
                        {category.products ? category.products.length : 0}
                      </Badge>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => handleEdit(category)}
                          title="Edit Category"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => handleDelete(category)}
                          title="Delete Category"
                          disabled={category.products && category.products.length > 0}
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
      </Card>

      {/* Add/Edit Category Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Category Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter category name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Slug *</Form.Label>
              <Form.Control
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                placeholder="category-slug"
              />
              <Form.Text className="text-muted">
                URL-friendly version of the name. Generated automatically from the name.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter category description (optional)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                label="Category is active and visible to customers"
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
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </Modal.Footer>
        </Form>
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
          <p>
            Are you sure you want to delete the category <strong>{categoryToDelete?.name}</strong>?
          </p>
          {categoryToDelete?.products && categoryToDelete.products.length > 0 && (
            <Alert variant="danger">
              This category has {categoryToDelete.products.length} products and cannot be deleted.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" size="sm" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="light"
            size="sm"
            onClick={confirmDelete}
            disabled={categoryToDelete?.products && categoryToDelete.products.length > 0}
          >
            Delete Category
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CategoryManagement;