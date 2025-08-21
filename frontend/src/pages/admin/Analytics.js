import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { 
  FaDollarSign, 
  FaShoppingCart, 
  FaUsers, 
  FaBoxes,
  FaArrowUp,
  FaArrowDown,
  FaChartLine
} from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import apiService from '../../services/api';
import './Analytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    monthlyRevenue: [],
    categoryBreakdown: [],
    topProducts: [],
    recentActivity: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from multiple endpoints
      const [productsRes, ordersRes, usersRes, categoriesRes] = await Promise.all([
        apiService.get('/products/'),
        apiService.get('/orders/'),
        apiService.get('/users/'),
        apiService.get('/categories/')
      ]);

      const products = productsRes;
      const orders = ordersRes;
      const users = usersRes;
      const categories = categoriesRes;

      // Calculate analytics
      const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
      
      // Generate monthly revenue data (simplified - using random data for demo)
      const monthlyRevenue = generateMonthlyData(orders);
      
      // Category breakdown
      const categoryBreakdown = generateCategoryBreakdown(products, categories);
      
      // Top products (by stock level as a proxy)
      const topProducts = products
        .sort((a, b) => (b.stock * b.price) - (a.stock * a.price))
        .slice(0, 5);

      // Recent activity (simplified)
      const recentActivity = orders
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10);

      setAnalyticsData({
        totalRevenue,
        totalOrders: orders.length,
        totalCustomers: users.length,
        totalProducts: products.length,
        monthlyRevenue,
        categoryBreakdown,
        topProducts,
        recentActivity
      });

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyData = (orders) => {
    // Generate sample monthly data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      revenue: Math.floor(Math.random() * 5000) + 2000,
      orders: Math.floor(Math.random() * 100) + 20
    }));
  };

  const generateCategoryBreakdown = (products, categories) => {
    return categories.map(category => {
      const categoryProducts = products.filter(p => p.category_id === category.id);
      const revenue = categoryProducts.reduce((sum, p) => sum + (p.price * p.stock * 0.1), 0);
      return {
        name: category.name,
        products: categoryProducts.length,
        revenue: revenue
      };
    });
  };

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

  // Chart configurations
  const revenueChartData = {
    labels: analyticsData.monthlyRevenue.map(data => data.month),
    datasets: [
      {
        label: 'Revenue',
        data: analyticsData.monthlyRevenue.map(data => data.revenue),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const ordersChartData = {
    labels: analyticsData.monthlyRevenue.map(data => data.month),
    datasets: [
      {
        label: 'Orders',
        data: analyticsData.monthlyRevenue.map(data => data.orders),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const categoryChartData = {
    labels: analyticsData.categoryBreakdown.map(cat => cat.name),
    datasets: [
      {
        data: analyticsData.categoryBreakdown.map(cat => cat.revenue),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
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
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
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
    <div className="analytics">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Analytics Dashboard</h1>
        <Badge bg="info" className="fs-6">Last updated: {new Date().toLocaleString()}</Badge>
      </div>

      {/* Key Metrics */}
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="admin-card metric-card">
            <Card.Body className="d-flex align-items-center">
              <div className="metric-icon bg-success">
                <FaDollarSign />
              </div>
              <div className="metric-details">
                <div className="metric-number">{formatCurrency(analyticsData.totalRevenue)}</div>
                <div className="metric-label">Total Revenue</div>
                <div className="metric-change positive">
                  <FaArrowUp /> +12.5%
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-3">
          <Card className="admin-card metric-card">
            <Card.Body className="d-flex align-items-center">
              <div className="metric-icon bg-info">
                <FaShoppingCart />
              </div>
              <div className="metric-details">
                <div className="metric-number">{analyticsData.totalOrders}</div>
                <div className="metric-label">Total Orders</div>
                <div className="metric-change positive">
                  <FaArrowUp /> +8.3%
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-3">
          <Card className="admin-card metric-card">
            <Card.Body className="d-flex align-items-center">
              <div className="metric-icon bg-warning">
                <FaUsers />
              </div>
              <div className="metric-details">
                <div className="metric-number">{analyticsData.totalCustomers}</div>
                <div className="metric-label">Total Customers</div>
                <div className="metric-change negative">
                  <FaArrowDown /> -2.1%
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-3">
          <Card className="admin-card metric-card">
            <Card.Body className="d-flex align-items-center">
              <div className="metric-icon bg-primary">
                <FaBoxes />
              </div>
              <div className="metric-details">
                <div className="metric-number">{analyticsData.totalProducts}</div>
                <div className="metric-label">Total Products</div>
                <div className="metric-change positive">
                  <FaArrowUp /> +15.7%
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row className="mb-4">
        <Col lg={8} className="mb-3">
          <Card className="admin-card">
            <Card.Header className="card-header-custom">
              <h5 className="mb-0"><FaChartLine className="me-2" />Revenue Trend</h5>
            </Card.Header>
            <Card.Body>
              <Line data={revenueChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4} className="mb-3">
          <Card className="admin-card">
            <Card.Header className="card-header-custom">
              <h5 className="mb-0">Category Revenue</h5>
            </Card.Header>
            <Card.Body>
              <Doughnut data={categoryChartData} options={pieChartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row className="mb-4">
        <Col lg={6} className="mb-3">
          <Card className="admin-card">
            <Card.Header className="card-header-custom">
              <h5 className="mb-0">Monthly Orders</h5>
            </Card.Header>
            <Card.Body>
              <Bar data={ordersChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} className="mb-3">
          <Card className="admin-card">
            <Card.Header className="card-header-custom d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Top Performing Products</h5>
              <Badge bg="primary" pill>{analyticsData.topProducts.length}</Badge>
            </Card.Header>
            <Card.Body>
              {analyticsData.topProducts.map((product, index) => (
                <div key={product.id} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                  <div className="d-flex align-items-center">
                    <Badge bg="secondary" className="me-3">#{index + 1}</Badge>
                    <div>
                      <h6 className="mb-1">{product.name}</h6>
                      <small className="text-muted">Stock: {product.stock}</small>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold">{formatCurrency(product.price)}</div>
                    <small className="text-muted">Value: {formatCurrency(product.price * product.stock)}</small>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Data Tables */}
      <Row>
        <Col lg={6} className="mb-3">
          <Card className="admin-card admin-table">
            <Card.Header className="card-header-custom">
              <h5 className="mb-0">Category Performance</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="mb-0">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Products</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.categoryBreakdown.map(category => (
                    <tr key={category.name}>
                      <td className="fw-bold">{category.name}</td>
                      <td>
                        <Badge bg="info" pill>{category.products}</Badge>
                      </td>
                      <td className="fw-bold">{formatCurrency(category.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} className="mb-3">
          <Card className="admin-card admin-table">
            <Card.Header className="card-header-custom">
              <h5 className="mb-0">Recent Activity</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="mb-0">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.recentActivity.map(order => (
                    <tr key={order.id}>
                      <td>
                        <small>#{order.order_number}</small>
                      </td>
                      <td>
                        <small>{order.user?.full_name || 'N/A'}</small>
                      </td>
                      <td className="fw-bold">
                        <small>{formatCurrency(order.total_amount)}</small>
                      </td>
                      <td>
                        <Badge 
                          bg={
                            order.status === 'delivered' ? 'success' :
                            order.status === 'pending' ? 'warning' :
                            order.status === 'cancelled' ? 'danger' : 'info'
                          }
                          className="small"
                        >
                          {order.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;