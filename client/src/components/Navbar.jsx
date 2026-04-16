import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCart } from '../api';

function Navbar({ cartCount }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [internalCartCount, setInternalCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartCount();
  }, [cartCount]);

  const fetchCartCount = async () => {
    try {
      const res = await getCart();
      setInternalCartCount(res.data.summary.itemCount);
    } catch {
      setInternalCartCount(0);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-text">Flipkart</span>
          <span className="navbar__logo-tagline">
            Explore <span style={{ color: '#ffe500', marginLeft: 2 }}>Plus</span>
            <span style={{ fontSize: 8, color: '#ffe500', marginLeft: 2 }}>✦</span>
          </span>
        </Link>

        <form className="navbar__search" onSubmit={handleSearch}>
          <span className="navbar__search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search for Products, Brands and More"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search-input"
          />
        </form>

        <div className="navbar__actions">
          <button className="navbar__login-btn">Login</button>
          <span className="navbar__link">Become a Seller</span>
          <span className="navbar__link">More ▾</span>
          <Link to="/cart" className="navbar__cart" id="cart-link">
            <span style={{ fontSize: 20 }}>🛒</span>
            <span>Cart</span>
            {internalCartCount > 0 && (
              <span className="navbar__cart-badge">{internalCartCount}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
