import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../api';

function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await getOrder(id);
      setOrder(res.data);
    } catch (err) {
      console.error('Failed to fetch order:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="loader__spinner"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container">
        <div className="cart-empty" style={{ background: 'white', borderRadius: 4, marginTop: 20 }}>
          <div className="cart-empty__icon">😕</div>
          <h2 className="cart-empty__title">Order not found</h2>
          <Link to="/" className="cart-empty__btn">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation" id="order-confirmation-page">
      <div className="order-confirmation__card">
        <div className="order-confirmation__icon">✓</div>
        <h1 className="order-confirmation__title">Order Placed Successfully!</h1>
        <p className="order-confirmation__subtitle">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        <div className="order-confirmation__order-id">
          <span>Order ID:</span>
          <strong>{order.orderNumber}</strong>
        </div>

        <div className="order-confirmation__details">
          <div className="order-confirmation__detail-row">
            <span>Items ({order.items?.length})</span>
            <span>₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
          </div>
          {Number(order.discount) > 0 && (
            <div className="order-confirmation__detail-row" style={{ color: '#388e3c' }}>
              <span>Discount</span>
              <span>− ₹{Number(order.discount).toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="order-confirmation__detail-row">
            <span>Delivery Charges</span>
            <span style={{ color: Number(order.deliveryFee) === 0 ? '#388e3c' : 'inherit' }}>
              {Number(order.deliveryFee) === 0 ? 'FREE' : `₹${Number(order.deliveryFee)}`}
            </span>
          </div>
          <div className="order-confirmation__detail-row">
            <span>Total Amount</span>
            <span>₹{Number(order.total).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {order.shippingAddress && (
          <div style={{
            textAlign: 'left',
            marginTop: 20,
            padding: '16px 0',
            borderTop: '1px solid #f0f0f0',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Delivery Address</div>
            <div style={{ fontSize: 14, color: '#878787', lineHeight: 1.6 }}>
              <div style={{ fontWeight: 600, color: '#212121' }}>{order.shippingAddress.fullName}</div>
              <div>{order.shippingAddress.addressLine1}</div>
              {order.shippingAddress.addressLine2 && <div>{order.shippingAddress.addressLine2}</div>}
              <div>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</div>
              <div>Phone: {order.shippingAddress.phone}</div>
            </div>
          </div>
        )}

        <div className="order-confirmation__actions">
          <Link to="/orders" className="order-confirmation__btn order-confirmation__btn--secondary">
            View Orders
          </Link>
          <Link to="/products" className="order-confirmation__btn order-confirmation__btn--primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
