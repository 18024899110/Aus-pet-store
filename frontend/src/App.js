import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import UserManagement from './pages/admin/UserManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import Analytics from './pages/admin/Analytics';

// Context
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading process
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Customer Routes */}
            <Route path="/" element={
              <div>
                <Header />
                <main className="main-content">
                  <Home />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/products" element={
              <div>
                <Header />
                <main className="main-content">
                  <Container>
                    <ProductList />
                  </Container>
                </main>
                <Footer />
              </div>
            } />
            <Route path="/products/:category" element={
              <div>
                <Header />
                <main className="main-content">
                  <Container>
                    <ProductList />
                  </Container>
                </main>
                <Footer />
              </div>
            } />
            <Route path="/product/:id" element={
              <div>
                <Header />
                <main className="main-content">
                  <Container>
                    <ProductDetail />
                  </Container>
                </main>
                <Footer />
              </div>
            } />
            <Route path="/cart" element={
              <div>
                <Header />
                <main className="main-content">
                  <Container>
                    <Cart />
                  </Container>
                </main>
                <Footer />
              </div>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <div>
                  <Header />
                  <main className="main-content">
                    <Container>
                      <Checkout />
                    </Container>
                  </main>
                  <Footer />
                </div>
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App; 