import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaBoxes, 
  FaShoppingCart, 
  FaUsers, 
  FaDollarSign,
  FaArrowUp,
  FaClock,
  FaEye
} from 'react-icons/fa';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import apiService from '../../services/api';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch basic stats in parallel
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        apiService.get('/products/'),
        apiService.get('/orders/'),
        apiService.get('/users/')
      ]);

      const products = productsRes;
      const orders = ordersRes;
      const users = usersRes;

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const lowStockProducts = products.filter(product => product.stock < 10).length;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue,
        pendingOrders,
        lowStockProducts
      });

      // Set recent orders (last 5)
      const sortedOrders = orders
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setRecentOrders(sortedOrders);

      // Set top products (simplified - by stock level)
      const topProductsList = products
        .sort((a, b) => b.stock - a.stock)
        .slice(0, 5);
      setTopProducts(topProductsList);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status.toUpperCase()}</Badge>;
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Chart data
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const categoryData = {
    labels: ['Dog Supplies', 'Cat Supplies', 'Small Pet Supplies'],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Overview',
      },
    },
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
    <div className="dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="dashboard-title">Dashboard</h1>
        <Button variant="light" size="sm" onClick={fetchDashboardData}>
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="admin-card stat-card">
            <Card.Body className="d-flex align-items-center">
              <div className="stat-icon bg-primary">
                <FaBoxes />
              </div>
              <div className="stat-details">
                <div className="stat-number">{stats.totalProducts}</div>
                <div className="stat-label">Total Products</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-3">
          <Card className="admin-card stat-card">
            <Card.Body className="d-flex align-items-center">
              <div className="stat-icon bg-success">
                <FaShoppingCart />
              </div>
              <div className="stat-details">
                <div className="stat-number">{stats.totalOrders}</div>
                <div className="stat-label">Total Orders</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-3">
          <Card className="admin-card stat-card">
            <Card.Body className="d-flex align-items-center">
              <div className="stat-icon bg-info">
                <FaUsers />
              </div>
              <div className="stat-details">
                <div className="stat-number">{stats.totalUsers}</div>
                <div className="stat-label">Total Users</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-3">
          <Card className="admin-card stat-card">
            <Card.Body className="d-flex align-items-center">
              <div className="stat-icon bg-warning">
                <FaDollarSign />
              </div>
              <div className="stat-details">
                <div className="stat-number">{formatCurrency(stats.totalRevenue)}</div>
                <div className="stat-label">Total Revenue</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Alert Cards */}
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Card className="admin-card alert-card border-warning">
            <Card.Body className="d-flex align-items-center">
              <FaClock className="text-warning me-3" size="2em" />
              <div>
                <h5 className="mb-1">{stats.pendingOrders} Pending Orders</h5>
                <p className="text-muted mb-0">Orders waiting to be processed</p>
                <Link to="/admin/orders">
                  <Button variant="light" size="sm" className="mt-2">
                    View Orders
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-3">
          <Card className="admin-card alert-card border-danger">
            <Card.Body className="d-flex align-items-center">
              <FaArrowUp className="text-danger me-3" size="2em" />
              <div>
                <h5 className="mb-1">{stats.lowStockProducts} Low Stock Items</h5>
                <p className="text-muted mb-0">Products with less than 10 items in stock</p>
                <Link to="/admin/products">
                  <Button variant="light" size="sm" className="mt-2">
                    View Products
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col lg={8} className="mb-3">
          <Card className="admin-card">
            <Card.Header className="card-header-custom">
              <h5 className="mb-0">Sales Trend</h5>
            </Card.Header>
            <Card.Body>
              <Line data={salesData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4} className="mb-3">
          <Card className="admin-card">
            <Card.Header className="card-header-custom">
              <h5 className="mb-0">Category Distribution</h5>
            </Card.Header>
            <Card.Body>
              <Doughnut data={categoryData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders & Top Products */}
      <Row>
        <Col lg={8} className="mb-3">
          <Card className="admin-card admin-table">
            <Card.Header className="card-header-custom d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Orders</h5>
              <Link to="/admin/orders">
                <Button variant="light" size="sm">
                  View All
                </Button>
              </Link>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="mb-0">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.order_number}</td>
                      <td>{order.user?.full_name || 'N/A'}</td>
                      <td>{formatDate(order.created_at)}</td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>{formatCurrency(order.total_amount)}</td>
                      <td>
                        <Link to={`/admin/orders/${order.id}`}>
                          <Button variant="light" size="sm">
                            <FaEye />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4} className="mb-3">
          <Card className="admin-card">
            <Card.Header className="card-header-custom d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Top Products</h5>
              <Link to="/admin/products">
                <Button variant="light" size="sm">
                  View All
                </Button>
              </Link>
            </Card.Header>
            <Card.Body>
              {topProducts.map(product => (
                <div key={product.id} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                  <div>
                    <h6 className="mb-1">{product.name}</h6>
                    <small className="text-muted">Stock: {product.stock}</small>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold">{formatCurrency(product.price)}</div>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;