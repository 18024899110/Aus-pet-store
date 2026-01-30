import React, { useState, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import StartPage from './components/StartPage';
import Hyperspeed from './components/Hyperspeed';


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
import AnimatedContent from './components/AnimatedContent';

// Context
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [showStartPage, setShowStartPage] = useState(true); // 启用 StartPage
  const [isPressed, setIsPressed] = useState(false); // 控制 Hyperspeed 加速

  const handleStart = () => {
    setShowStartPage(false);
  };

  // 稳定 Hyperspeed 配置
  const hyperspeedOptions = useMemo(() => ({
    onSpeedUp: () => { },
    onSlowDown: () => { },
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 4,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [400 * 0.03, 400 * 0.2],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.8, 0.8],
    carFloorSeparation: [0, 5],
    disableInteraction: true,
    colors: {
      roadColor: 0xffffff,
      islandColor: 0xffffff,
      background: 0xffffff,
      shoulderLines: 0xFFFFFF,
      brokenLines: 0xFFFFFF,
      leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
      rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
      sticks: 0x03B3C3,
    }
  }), []);

  return (
    <AuthProvider>
      <CartProvider>
        {/* Hyperspeed 背景层 - 始终存在 */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1
        }}>
          <Hyperspeed isSpeedUp={isPressed} effectOptions={hyperspeedOptions} />
        </div>

        {showStartPage && <StartPage onStart={handleStart} onPressChange={setIsPressed} />}
        {!showStartPage && <AnimatedContent 
        distance={150}
        direction="vertical"
        reverse={false}
        duration={1.2}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        scale={1}
        threshold={0.2}
        delay={0}>

        
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
        </AnimatedContent>}
      </CartProvider>
    </AuthProvider>
  );
}

export default App; 