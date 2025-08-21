import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Modal, 
  Badge,
  Form,
  Alert,
  InputGroup,
  Collapse
} from 'react-bootstrap';
import { 
  FaEye, 
  FaEdit, 
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
  FaBox
} from 'react-icons/fa';
import apiService from '../../services/api';
import { Toast } from '../../components/Toast';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  const itemsPerPage = 10;
  
  const statusOptions = [
    { value: 'pending', label: 'Pending', variant: 'warning' },
    { value: 'processing', label: 'Processing', variant: 'info' },
    { value: 'shipped', label: 'Shipped', variant: 'primary' },
    { value: 'delivered', label: 'Delivered', variant: 'success' },
    { value: 'cancelled', label: 'Cancelled', variant: 'danger' }
  ];

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage
      });
      
      const response = await apiService.get(`/orders/?${params}`);
      setOrders(response);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleStatusChange = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    try {
      await apiService.put(`/orders/${selectedOrder.id}/status`, { status: newStatus });
      Toast.success('Order status updated successfully');
      setShowStatusModal(false);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      Toast.error('Failed to update order status');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status) || statusOptions[0];
    return (
      <Badge bg={statusConfig.variant}>
        {statusConfig.label}
      </Badge>
    );
  };

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
    <div className="order-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Order Management</h1>
        <Button variant="outline-primary" onClick={fetchOrders}>
          Refresh Orders
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
                  placeholder="Search by order number or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4} className="mb-3 mb-md-0">
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button 
                variant="outline-secondary" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                }}
              >
                Clear
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Orders Table */}
      <Card className="admin-card admin-table">
        <Card.Body className="p-0">
          <Table responsive className="mb-0">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <div className="text-muted">No orders found</div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <React.Fragment key={order.id}>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 me-2"
                            onClick={() => toggleOrderExpansion(order.id)}
                          >
                            {expandedOrder === order.id ? <FaChevronUp /> : <FaChevronDown />}
                          </Button>
                          <div>
                            <div className="fw-bold">#{order.order_number}</div>
                            <div className="text-muted small">ID: {order.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-bold">{order.user?.full_name || 'N/A'}</div>
                          <div className="text-muted small">{order.user?.email || 'N/A'}</div>
                        </div>
                      </td>
                      <td>
                        <div className="small">{formatDate(order.created_at)}</div>
                      </td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td className="fw-bold">{formatCurrency(order.total_amount)}</td>
                      <td>
                        <div className="action-buttons">
                          <Button 
                            variant="outline-info" 
                            size="sm"
                            onClick={() => handleViewDetails(order)}
                            title="View Details"
                          >
                            <FaEye />
                          </Button>
                          <Button 
                            variant="outline-warning" 
                            size="sm"
                            onClick={() => handleStatusChange(order)}
                            title="Update Status"
                          >
                            <FaEdit />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expandable Order Details */}
                    <tr>
                      <td colSpan="6" className="p-0">
                        <Collapse in={expandedOrder === order.id}>
                          <div className="order-details-collapse">
                            <div className="p-3 bg-light">
                              <Row>
                                <Col md={6}>
                                  <h6><FaMapMarkerAlt className="me-2" />Shipping Address</h6>
                                  <p className="mb-2">
                                    {order.shipping_address}<br />
                                    {order.shipping_city}, {order.shipping_state} {order.shipping_postcode}<br />
                                    {order.shipping_country}
                                  </p>
                                </Col>
                                <Col md={6}>
                                  <h6><FaCreditCard className="me-2" />Payment Info</h6>
                                  <p className="mb-2">
                                    Method: {order.payment_method}<br />
                                    Shipping Fee: {formatCurrency(order.shipping_fee || 0)}<br />
                                    Tax: {formatCurrency(order.tax || 0)}
                                  </p>
                                </Col>
                              </Row>
                              
                              {order.notes && (
                                <div className="mt-3">
                                  <h6>Notes</h6>
                                  <p className="mb-0">{order.notes}</p>
                                </div>
                              )}
                              
                              {order.items && order.items.length > 0 && (
                                <div className="mt-3">
                                  <h6><FaBox className="me-2" />Order Items</h6>
                                  <Table size="sm" className="mb-0">
                                    <thead>
                                      <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Unit Price</th>
                                        <th>Total</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {order.items.map(item => (
                                        <tr key={item.id}>
                                          <td>{item.product?.name || `Product ID: ${item.product_id}`}</td>
                                          <td>{item.quantity}</td>
                                          <td>{formatCurrency(item.unit_price)}</td>
                                          <td>{formatCurrency(item.total_price)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </Table>
                                </div>
                              )}
                            </div>
                          </div>
                        </Collapse>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Order Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details - #{selectedOrder?.order_number}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="border-0">
                    <Card.Header className="bg-transparent">
                      <h6><FaUser className="me-2" />Customer Information</h6>
                    </Card.Header>
                    <Card.Body>
                      <p className="mb-1"><strong>Name:</strong> {selectedOrder.user?.full_name}</p>
                      <p className="mb-1"><strong>Email:</strong> {selectedOrder.user?.email}</p>
                      <p className="mb-0"><strong>Order Date:</strong> {formatDate(selectedOrder.created_at)}</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0">
                    <Card.Header className="bg-transparent">
                      <h6><FaMapMarkerAlt className="me-2" />Shipping Address</h6>
                    </Card.Header>
                    <Card.Body>
                      <p className="mb-0">
                        {selectedOrder.shipping_address}<br />
                        {selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_postcode}<br />
                        {selectedOrder.shipping_country}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className="border-0 mb-4">
                <Card.Header className="bg-transparent">
                  <h6><FaBox className="me-2" />Order Items</h6>
                </Card.Header>
                <Card.Body>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map(item => (
                          <tr key={item.id}>
                            <td>{item.product?.name || `Product ID: ${item.product_id}`}</td>
                            <td>{item.quantity}</td>
                            <td>{formatCurrency(item.unit_price)}</td>
                            <td>{formatCurrency(item.total_price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-muted">No items found for this order</p>
                  )}
                </Card.Body>
              </Card>

              <Card className="border-0">
                <Card.Header className="bg-transparent">
                  <h6><FaCreditCard className="me-2" />Payment Summary</h6>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>{formatCurrency((selectedOrder.total_amount || 0) - (selectedOrder.shipping_fee || 0) - (selectedOrder.tax || 0))}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping Fee:</span>
                    <span>{formatCurrency(selectedOrder.shipping_fee || 0)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax:</span>
                    <span>{formatCurrency(selectedOrder.tax || 0)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedOrder.total_amount)}</span>
                  </div>
                  <div className="mt-3">
                    <small className="text-muted">Payment Method: {selectedOrder.payment_method}</small>
                  </div>
                  <div className="mt-2">
                    Status: {getStatusBadge(selectedOrder.status)}
                  </div>
                </Card.Body>
              </Card>

              {selectedOrder.notes && (
                <Card className="border-0 mt-4">
                  <Card.Header className="bg-transparent">
                    <h6>Order Notes</h6>
                  </Card.Header>
                  <Card.Body>
                    <p className="mb-0">{selectedOrder.notes}</p>
                  </Card.Body>
                </Card>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Status Update Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Order: #{selectedOrder?.order_number}</Form.Label>
              <Form.Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
          
          {newStatus === 'cancelled' && (
            <Alert variant="warning" className="mt-3">
              <strong>Warning:</strong> Cancelling an order will restore product inventory.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateStatus}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderManagement;