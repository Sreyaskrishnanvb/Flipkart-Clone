import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../api';

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
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

  if (orders.length === 0) {
    return (
      <div className="orders-page" id="orders-page">
        <h1 className="orders-page__title">My Orders</h1>
        <div className="cart-empty" style={{ background: 'white', borderRadius: 4 }}>
          <div className="cart-empty__icon">📦</div>
          <h2 className="cart-empty__title">No orders yet</h2>
          <p className="cart-empty__text">Place your first order and it will appear here.</p>
          <Link to="/products" className="cart-empty__btn">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page" id="orders-page">
      <h1 className="orders-page__title">My Orders</h1>

      {orders.map((order) => {
        const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });

        return (
          <Link
            key={order.id}
            to={`/order-confirmation/${order.id}`}
            className="order-history-card"
            style={{ textDecoration: 'none' }}
          >
            <div className="order-history-card__header">
              <div className="order-history-card__info">
                <div>
                  <span className="order-history-card__label">Order ID</span>
                  <span className="order-history-card__value">{order.orderNumber}</span>
                </div>
                <div>
                  <span className="order-history-card__label">Date</span>
                  <span className="order-history-card__value">{date}</span>
                </div>
                <div>
                  <span className="order-history-card__label">Total</span>
                  <span className="order-history-card__value">
                    ₹{Number(order.total).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <span className={`order-history-card__status order-history-card__status--${order.status}`}>
                {order.status}
              </span>
            </div>

            {order.items?.map((item) => {
              const img = item.product?.images?.[0]?.imageUrl || 'https://via.placeholder.com/60';
              return (
                <div key={item.id} className="order-history-item">
                  <img src={img} alt={item.product?.name} className="order-history-item__img" />
                  <span className="order-history-item__name">{item.product?.name}</span>
                  <span className="order-history-item__qty">Qty: {item.quantity}</span>
                  <span className="order-history-item__price">
                    ₹{Number(item.priceAtPurchase).toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </Link>
        );
      })}
    </div>
  );
}

export default OrderHistoryPage;
