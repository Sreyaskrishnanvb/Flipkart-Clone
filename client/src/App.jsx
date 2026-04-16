import { Routes, Route } from 'react-router-dom';
import { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import CategoryBar from './components/CategoryBar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  }, []);

  const updateCartCount = useCallback((count) => {
    setCartCount(count);
  }, []);

  return (
    <div className="app-wrapper">
      <Navbar cartCount={cartCount} />
      <CategoryBar />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/products"
            element={<ProductListPage />}
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetailPage
                showToast={showToast}
                updateCartCount={updateCartCount}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                showToast={showToast}
                updateCartCount={updateCartCount}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                showToast={showToast}
                updateCartCount={updateCartCount}
              />
            }
          />
          <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
        </Routes>
      </div>
      <Footer />
      <Toast message={toast.message} type={toast.type} show={toast.show} />
    </div>
  );
}

export default App;
