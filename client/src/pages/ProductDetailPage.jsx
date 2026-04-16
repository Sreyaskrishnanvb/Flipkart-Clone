import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProduct, addToCart, getCart } from '../api';
import ImageCarousel from '../components/ImageCarousel';

function ProductDetailPage({ showToast, updateCartCount }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await getProduct(id);
      setProduct(res.data);
    } catch (err) {
      console.error('Failed to fetch product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await addToCart(product.id);
      const cartRes = await getCart();
      updateCartCount(cartRes.data.summary.itemCount);
      showToast('Item added to cart!', 'success');
    } catch (err) {
      showToast('Failed to add to cart', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart(product.id);
      const cartRes = await getCart();
      updateCartCount(cartRes.data.summary.itemCount);
      navigate('/cart');
    } catch (err) {
      showToast('Failed to add to cart', 'error');
    }
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="loader__spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="cart-empty" style={{ background: 'white', borderRadius: 4, marginTop: 20 }}>
          <div className="cart-empty__icon">😕</div>
          <h2 className="cart-empty__title">Product not found</h2>
          <Link to="/products" className="cart-empty__btn">Browse Products</Link>
        </div>
      </div>
    );
  }

  const formattedPrice = Number(product.sellingPrice).toLocaleString('en-IN');
  const formattedOriginal = Number(product.originalPrice).toLocaleString('en-IN');
  const savings = (Number(product.originalPrice) - Number(product.sellingPrice)).toLocaleString('en-IN');
  const ratingCountFormatted =
    product.ratingCount >= 1000
      ? `${(product.ratingCount / 1000).toFixed(0)}K`
      : product.ratingCount;

  return (
    <div className="product-detail" id="product-detail-page">
      {/* Left - Image Carousel */}
      <div className="product-detail__left">
        <ImageCarousel images={product.images} />
        <div className="product-detail__actions">
          <button
            className="btn-add-cart"
            onClick={handleAddToCart}
            disabled={addingToCart || product.stock === 0}
            id="add-to-cart-btn"
          >
            <span>🛒</span>
            {addingToCart ? 'ADDING...' : 'ADD TO CART'}
          </button>
          <button
            className="btn-buy-now"
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            id="buy-now-btn"
          >
            <span>⚡</span>
            BUY NOW
          </button>
        </div>
      </div>

      {/* Right - Product Info */}
      <div className="product-detail__right">
        {/* Breadcrumbs */}
        <div className="product-detail__breadcrumbs">
          <Link to="/">Home</Link> ›{' '}
          <Link to={`/products?category=${product.category?.slug}`}>
            {product.category?.name}
          </Link>{' '}
          › {product.brand}
        </div>

        <div className="product-detail__brand">{product.brand}</div>
        <h1 className="product-detail__title">{product.name}</h1>

        {/* Rating */}
        <div className="product-detail__rating-row">
          <span className="product-detail__rating-badge">
            {Number(product.rating).toFixed(1)} ★
          </span>
          <span className="product-detail__rating-text">
            {ratingCountFormatted} Ratings & Reviews
          </span>
          {product.isAssured && (
            <span className="product-detail__extra-offer">✓ Flipkart Assured</span>
          )}
        </div>

        {/* Pricing */}
        <div className="product-detail__pricing">
          <span className="product-detail__selling-price">₹{formattedPrice}</span>
          {product.discountPercent > 0 && (
            <>
              <span className="product-detail__original-price">₹{formattedOriginal}</span>
              <span className="product-detail__discount-percent">
                {product.discountPercent}% off
              </span>
            </>
          )}
        </div>

        {/* Stock */}
        <div className={`product-detail__stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
          {product.stock > 0 ? (
            product.stock <= 10 ? `Only ${product.stock} left in stock - order soon!` : 'In Stock'
          ) : (
            'Currently Out of Stock'
          )}
        </div>

        {/* Offers */}
        <div className="product-detail__offers">
          <h3 className="product-detail__offers-title">Available Offers</h3>
          <div className="offer-item">
            <span className="offer-item__tag">Offer</span>
            <span>Bank Offer: 10% off on HDFC Bank Credit Cards, up to ₹1,250. T&C Apply.</span>
          </div>
          <div className="offer-item">
            <span className="offer-item__tag">Offer</span>
            <span>Special Price: Get extra ₹{savings} off (price inclusive of cashback/coupon)</span>
          </div>
          <div className="offer-item">
            <span className="offer-item__tag">Offer</span>
            <span>Partner Offer: Sign up for Flipkart Pay Later and get Gift Card worth ₹100</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Delivery</div>
          <div style={{ fontSize: 14, color: '#212121' }}>
            <span style={{ fontWeight: 600, color: '#388e3c' }}>Free Delivery</span> by Tomorrow
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="product-detail__specs">
            <h2 className="product-detail__specs-title">Specifications</h2>
            {product.specifications.map((spec) => (
              <div key={spec.id} className="spec-row">
                <span className="spec-row__key">{spec.specKey}</span>
                <span className="spec-row__value">{spec.specValue}</span>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <div className="product-detail__description">
          <h2 className="product-detail__desc-title">Description</h2>
          <p className="product-detail__desc-text">{product.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
