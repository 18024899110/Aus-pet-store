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
  InputGroup
} from 'react-bootstrap';
import { 
  FaEye, 
  FaSearch,
  FaBan,
  FaCheck
} from 'react-icons/fa';
import apiService from '../../services/api';
import { Toast } from '../../components/Toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage] = useState(1);
  const [showStatusModal, setShowStatusModal] = useState(false);
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage
      });
      
      const response = await apiService.get(`/users/?${params}`);
      setUsers(response);
    } catch (error) {
      console.error('Error fetching users:', error);
      Toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleToggleUserStatus = (user) => {
    setSelectedUser(user);
    setShowStatusModal(true);
  };

  const confirmToggleStatus = async () => {
    try {
      const updatedUser = {
        ...selectedUser,
        is_active: !selectedUser.is_active
      };
      
      await apiService.put(`/users/${selectedUser.id}`, updatedUser);
      
      Toast.success(`User ${selectedUser.is_active ? 'deactivated' : 'activated'} successfully`);
      setShowStatusModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      Toast.error('Failed to update user status');
    }
  };

  const getUserStatusBadge = (user) => {
    if (!user.is_active) {
      return <Badge bg="danger">Inactive</Badge>;
    }
    return <Badge bg="success">Active</Badge>;
  };

  const getUserRoleBadge = (user) => {
    return user.is_admin ? 
      <Badge bg="primary">Admin</Badge> : 
      <Badge bg="secondary">User</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredUsers = users.filter(user => 
    !searchTerm || 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="user-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>User Management</h1>
        <Button variant="outline-primary" onClick={fetchUsers}>
          Refresh Users
        </Button>
      </div>

      {/* Search */}
      <Card className="admin-card mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6} className="text-end">
              <Button 
                variant="outline-secondary" 
                onClick={() => setSearchTerm('')}
              >
                Clear
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card className="admin-card admin-table">
        <Card.Body className="p-0">
          <Table responsive className="mb-0">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <div className="text-muted">No users found</div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="user-avatar me-3">
                          <div className="avatar-circle">
                            {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        </div>
                        <div>
                          <div className="fw-bold">{user.full_name || 'N/A'}</div>
                          <div className="text-muted small">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{getUserRoleBadge(user)}</td>
                    <td>{getUserStatusBadge(user)}</td>
                    <td>
                      <div className="small">{formatDate(user.created_at || new Date())}</div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          onClick={() => handleViewDetails(user)}
                          title="View Details"
                        >
                          <FaEye />
                        </Button>
                        <Button 
                          variant={user.is_active ? "outline-warning" : "outline-success"}
                          size="sm"
                          onClick={() => handleToggleUserStatus(user)}
                          title={user.is_active ? "Deactivate User" : "Activate User"}
                        >
                          {user.is_active ? <FaBan /> : <FaCheck />}
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

      {/* User Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <Row className="mb-4">
                <Col md={8}>
                  <Card className="border-0">
                    <Card.Header className="bg-transparent">
                      <h6>Basic Information</h6>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <p className="mb-2"><strong>Full Name:</strong> {selectedUser.full_name || 'Not provided'}</p>
                          <p className="mb-2"><strong>Email:</strong> {selectedUser.email}</p>
                          <p className="mb-2"><strong>User ID:</strong> {selectedUser.id}</p>
                        </Col>
                        <Col md={6}>
                          <p className="mb-2"><strong>Role:</strong> {getUserRoleBadge(selectedUser)}</p>
                          <p className="mb-2"><strong>Status:</strong> {getUserStatusBadge(selectedUser)}</p>
                          <p className="mb-2"><strong>Joined:</strong> {formatDate(selectedUser.created_at || new Date())}</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <div className="user-avatar-large mb-3">
                      <div className="avatar-circle-large">
                        {selectedUser.full_name ? selectedUser.full_name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    </div>
                    <h5>{selectedUser.full_name || 'User'}</h5>
                    <p className="text-muted">{selectedUser.email}</p>
                  </div>
                </Col>
              </Row>

              {/* Account Activity - This would require additional API endpoints */}
              <Card className="border-0 mb-4">
                <Card.Header className="bg-transparent">
                  <h6>Account Activity</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4} className="text-center">
                      <div className="activity-stat">
                        <div className="stat-number">-</div>
                        <div className="stat-label">Total Orders</div>
                      </div>
                    </Col>
                    <Col md={4} className="text-center">
                      <div className="activity-stat">
                        <div className="stat-number">-</div>
                        <div className="stat-label">Total Spent</div>
                      </div>
                    </Col>
                    <Col md={4} className="text-center">
                      <div className="activity-stat">
                        <div className="stat-number">-</div>
                        <div className="stat-label">Last Login</div>
                      </div>
                    </Col>
                  </Row>
                  <div className="mt-3">
                    <small className="text-muted">
                      Note: Detailed activity tracking would require additional API endpoints and user activity logging.
                    </small>
                  </div>
                </Card.Body>
              </Card>

              {/* Account Settings */}
              <Card className="border-0">
                <Card.Header className="bg-transparent">
                  <h6>Account Settings</h6>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <strong>Email Notifications</strong>
                      <br />
                      <small className="text-muted">Receive order updates and promotions</small>
                    </div>
                    <Badge bg="success">Enabled</Badge>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <strong>Account Status</strong>
                      <br />
                      <small className="text-muted">User can login and place orders</small>
                    </div>
                    {getUserStatusBadge(selectedUser)}
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Two-Factor Authentication</strong>
                      <br />
                      <small className="text-muted">Additional security for account</small>
                    </div>
                    <Badge bg="secondary">Not Configured</Badge>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Status Change Confirmation Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Status Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <Alert variant={selectedUser.is_active ? "warning" : "info"}>
                <strong>
                  {selectedUser.is_active ? "Deactivate" : "Activate"} User Account
                </strong>
              </Alert>
              <p>
                Are you sure you want to {selectedUser.is_active ? "deactivate" : "activate"} 
                <strong> {selectedUser.full_name || selectedUser.email}</strong>?
              </p>
              {selectedUser.is_active && (
                <div className="mt-3">
                  <small className="text-muted">
                    Deactivating this user will prevent them from logging in and placing orders.
                  </small>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button 
            variant={selectedUser?.is_active ? "warning" : "success"} 
            onClick={confirmToggleStatus}
          >
            {selectedUser?.is_active ? "Deactivate" : "Activate"} User
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .user-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .avatar-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3498db, #2980b9);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.1rem;
        }
        
        .user-avatar-large {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .avatar-circle-large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3498db, #2980b9);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 2rem;
        }
        
        .activity-stat {
          padding: 1rem;
        }
        
        .activity-stat .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: #2c3e50;
        }
        
        .activity-stat .stat-label {
          color: #7f8c8d;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default UserManagement;