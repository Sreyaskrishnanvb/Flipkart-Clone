import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, placeOrder } from '../api';

function CheckoutPage({ showToast, updateCartCount }) {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], summary: {} });
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    pincode: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    landmark: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      if (res.data.items.length === 0) {
        navigate('/cart');
        return;
      }
      setCart(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!address.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!address.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(address.phone.trim())) newErrors.phone = 'Enter valid 10-digit number';
    if (!address.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(address.pincode.trim())) newErrors.pincode = 'Enter valid 6-digit pincode';
    if (!address.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.state.trim()) newErrors.state = 'State is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;

    setPlacing(true);
    try {
      const res = await placeOrder(address);
      updateCartCount(0);
      showToast('Order placed successfully!', 'success');
      navigate(`/order-confirmation/${res.data.id}`);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to place order', 'error');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="loader__spinner"></div>
      </div>
    );
  }

  const { summary } = cart;

  return (
    <div className="checkout-page" id="checkout-page">
      {/* Shipping Address */}
      <div className="checkout-section">
        <div className="checkout-section__header">
          <span className="checkout-section__step">1</span>
          <span className="checkout-section__title">Delivery Address</span>
        </div>
        <div className="checkout-section__body">
          <div className="address-form">
            <div className="address-form__field">
              <label className="address-form__label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={address.fullName}
                onChange={handleChange}
                className={`address-form__input ${errors.fullName ? 'error' : ''}`}
                placeholder="Enter your full name"
                id="input-fullname"
              />
              {errors.fullName && <span style={{ color: '#ff6161', fontSize: 12 }}>{errors.fullName}</span>}
            </div>
            <div className="address-form__field">
              <label className="address-form__label">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={address.phone}
                onChange={handleChange}
                className={`address-form__input ${errors.phone ? 'error' : ''}`}
                placeholder="10-digit mobile number"
                id="input-phone"
              />
              {errors.phone && <span style={{ color: '#ff6161', fontSize: 12 }}>{errors.phone}</span>}
            </div>
            <div className="address-form__field">
              <label className="address-form__label">Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={address.pincode}
                onChange={handleChange}
                className={`address-form__input ${errors.pincode ? 'error' : ''}`}
                placeholder="6-digit pincode"
                id="input-pincode"
              />
              {errors.pincode && <span style={{ color: '#ff6161', fontSize: 12 }}>{errors.pincode}</span>}
            </div>
            <div className="address-form__field">
              <label className="address-form__label">City *</label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleChange}
                className={`address-form__input ${errors.city ? 'error' : ''}`}
                placeholder="City/District/Town"
                id="input-city"
              />
              {errors.city && <span style={{ color: '#ff6161', fontSize: 12 }}>{errors.city}</span>}
            </div>
            <div className="address-form__field address-form__field--full">
              <label className="address-form__label">Address (House No, Building, Street, Area) *</label>
              <input
                type="text"
                name="addressLine1"
                value={address.addressLine1}
                onChange={handleChange}
                className={`address-form__input ${errors.addressLine1 ? 'error' : ''}`}
                placeholder="Complete address"
                id="input-address1"
              />
              {errors.addressLine1 && <span style={{ color: '#ff6161', fontSize: 12 }}>{errors.addressLine1}</span>}
            </div>
            <div className="address-form__field address-form__field--full">
              <label className="address-form__label">Address Line 2 (Optional)</label>
              <input
                type="text"
                name="addressLine2"
                value={address.addressLine2}
                onChange={handleChange}
                className="address-form__input"
                placeholder="Landmark, Colony, etc."
              />
            </div>
            <div className="address-form__field">
              <label className="address-form__label">State *</label>
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleChange}
                className={`address-form__input ${errors.state ? 'error' : ''}`}
                placeholder="State"
                id="input-state"
              />
              {errors.state && <span style={{ color: '#ff6161', fontSize: 12 }}>{errors.state}</span>}
            </div>
            <div className="address-form__field">
              <label className="address-form__label">Landmark (Optional)</label>
              <input
                type="text"
                name="landmark"
                value={address.landmark}
                onChange={handleChange}
                className="address-form__input"
                placeholder="Near temple, school, etc."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="checkout-section">
        <div className="checkout-section__header">
          <span className="checkout-section__step">2</span>
          <span className="checkout-section__title">Order Summary</span>
        </div>
        <div className="checkout-section__body">
          <div className="checkout-order-summary">
            {cart.items.map((item) => {
              const img = item.product.images?.[0]?.imageUrl || 'https://via.placeholder.com/56';
              return (
                <div key={item.id} className="checkout-order-item">
                  <img src={img} alt={item.product.name} className="checkout-order-item__img" />
                  <div className="checkout-order-item__info">
                    <div className="checkout-order-item__name">{item.product.name}</div>
                    <div className="checkout-order-item__qty">Qty: {item.quantity}</div>
                  </div>
                  <div className="checkout-order-item__price">
                    ₹{(Number(item.product.sellingPrice) * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              );
            })}
            <div className="checkout-total-row">
              <span>Subtotal</span>
              <span>₹{(summary.subtotal - summary.discount)?.toLocaleString('en-IN')}</span>
            </div>
            <div className="checkout-total-row" style={{ borderTop: 'none', paddingTop: 4 }}>
              <span>Delivery Charges</span>
              <span style={{ color: summary.deliveryFee === 0 ? '#388e3c' : 'inherit' }}>
                {summary.deliveryFee === 0 ? 'FREE' : `₹${summary.deliveryFee}`}
              </span>
            </div>
            <div className="checkout-total-row" style={{ borderTop: '2px solid #e0e0e0', paddingTop: 12 }}>
              <strong>Total Amount</strong>
              <strong>₹{summary.total?.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <button
            className="btn-confirm-order"
            onClick={handlePlaceOrder}
            disabled={placing}
            id="confirm-order-btn"
          >
            {placing ? 'PLACING ORDER...' : 'CONFIRM ORDER'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
