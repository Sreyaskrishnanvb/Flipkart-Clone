import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeCartItem } from '../api';

function CartPage({ showToast, updateCartCount }) {
  const [cart, setCart] = useState({ items: [], summary: {} });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await getCart();
      setCart(res.data);
      updateCartCount(res.data.summary.itemCount);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      await updateCartItem(itemId, newQuantity);
      await fetchCart();
    } catch (err) {
      showToast('Failed to update quantity', 'error');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeCartItem(itemId);
      showToast('Item removed from cart', 'success');
      await fetchCart();
    } catch (err) {
      showToast('Failed to remove item', 'error');
    }
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="loader__spinner"></div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container">
        <div className="cart-page">
          <div className="cart-page__items">
            <div className="cart-empty">
              <div className="cart-empty__icon">🛒</div>
              <h2 className="cart-empty__title">Your cart is empty!</h2>
              <p className="cart-empty__text">
                Add items to it now.
              </p>
              <Link to="/products" className="cart-empty__btn">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { summary } = cart;

  return (
    <div className="cart-page" id="cart-page">
      {/* Cart Items */}
      <div className="cart-page__items">
        <div className="cart-page__header">
          <h1 className="cart-page__title">
            My Cart ({summary.itemCount})
          </h1>
        </div>

        {cart.items.map((item) => {
          const image = item.product.images?.[0]?.imageUrl || 'https://via.placeholder.com/112x112?text=No+Image';
          const sellingPrice = Number(item.product.sellingPrice).toLocaleString('en-IN');
          const originalPrice = Number(item.product.originalPrice).toLocaleString('en-IN');

          return (
            <div key={item.id} className="cart-item" id={`cart-item-${item.id}`}>
              <div className="cart-item__image">
                <img src={image} alt={item.product.name} />
                <div className="cart-item__quantity">
                  <button
                    className="cart-item__qty-btn"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="cart-item__qty-value">{item.quantity}</span>
                  <button
                    className="cart-item__qty-btn"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="cart-item__details">
                <Link to={`/product/${item.product.id}`}>
                  <h3 className="cart-item__name">{item.product.name}</h3>
                </Link>
                <span className="cart-item__brand">{item.product.brand}</span>
                <span className="cart-item__delivery-info">
                  Delivery by Tomorrow | <span style={{ color: '#388e3c', fontWeight: 600 }}>Free</span>
                </span>
                <div className="cart-item__pricing">
                  <span className="cart-item__selling-price">₹{sellingPrice}</span>
                  {item.product.discountPercent > 0 && (
                    <>
                      <span className="cart-item__original-price">₹{originalPrice}</span>
                      <span className="cart-item__discount">{item.product.discountPercent}% off</span>
                    </>
                  )}
                </div>
                <div className="cart-item__actions">
                  <button
                    className="cart-item__action-btn"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <div className="cart-summary__place-order" style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '16px 24px',
          borderTop: '1px solid #f0f0f0',
        }}>
          <button
            className="btn-place-order"
            style={{ width: 'auto', padding: '16px 48px' }}
            onClick={() => navigate('/checkout')}
          >
            PLACE ORDER
          </button>
        </div>
      </div>

      {/* Price Summary */}
      <div className="cart-summary" id="cart-summary">
        <div className="cart-summary__box">
          <div className="cart-summary__title">PRICE DETAILS</div>
          <div className="cart-summary__row">
            <span>Price ({summary.itemCount} items)</span>
            <span>₹{summary.subtotal?.toLocaleString('en-IN')}</span>
          </div>
          <div className="cart-summary__row cart-summary__row--discount">
            <span>Discount</span>
            <span>− ₹{summary.discount?.toLocaleString('en-IN')}</span>
          </div>
          <div className="cart-summary__row cart-summary__row--delivery">
            <span>Delivery Charges</span>
            <span className={summary.deliveryFee === 0 ? 'free-delivery' : ''}>
              {summary.deliveryFee === 0 ? 'FREE' : `₹${summary.deliveryFee}`}
            </span>
          </div>
          <div className="cart-summary__total">
            <span>Total Amount</span>
            <span>₹{summary.total?.toLocaleString('en-IN')}</span>
          </div>
          {summary.discount > 0 && (
            <div className="cart-summary__savings">
              You will save ₹{summary.discount?.toLocaleString('en-IN')} on this order
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartPage;
