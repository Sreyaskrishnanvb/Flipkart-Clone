import { Link } from 'react-router-dom';

function ProductCard({ product, variant = 'list' }) {
  const image = product.images?.[0]?.imageUrl || 'https://via.placeholder.com/200x200?text=No+Image';
  const formattedPrice = Number(product.sellingPrice).toLocaleString('en-IN');
  const formattedOriginal = Number(product.originalPrice).toLocaleString('en-IN');
  const ratingCountFormatted =
    product.ratingCount >= 1000
      ? `${(product.ratingCount / 1000).toFixed(0)}K`
      : product.ratingCount;

  if (variant === 'grid') {
    return (
      <Link
        to={`/product/${product.id}`}
        className="product-card product-card--grid"
        id={`product-card-${product.id}`}
      >
        <div className="product-card__image-wrapper">
          <img src={image} alt={product.name} className="product-card__image" />
        </div>
        <div className="product-card__info">
          <span className="product-card__brand">{product.brand}</span>
          <h3 className="product-card__name">{product.name}</h3>
          <div className="product-card__rating">
            <span className="product-card__rating-badge">
              {Number(product.rating).toFixed(1)} <span className="star">★</span>
            </span>
            <span className="product-card__rating-count">
              ({ratingCountFormatted})
            </span>
          </div>
          <div className="product-card__pricing">
            <span className="product-card__price">₹{formattedPrice}</span>
            {product.discountPercent > 0 && (
              <>
                <span className="product-card__original-price">
                  ₹{formattedOriginal}
                </span>
                <span className="product-card__discount">
                  {product.discountPercent}% off
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card"
      id={`product-card-${product.id}`}
    >
      <div className="product-card__image-wrapper">
        <img src={image} alt={product.name} className="product-card__image" />
      </div>
      <div className="product-card__info">
        <span className="product-card__brand">{product.brand}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__rating">
          <span className="product-card__rating-badge">
            {Number(product.rating).toFixed(1)} <span className="star">★</span>
          </span>
          <span className="product-card__rating-count">
            ({ratingCountFormatted} Ratings)
          </span>
        </div>
        {product.isAssured && (
          <div className="product-card__assured">
            <span className="product-card__assured-badge">Flipkart Assured</span>
          </div>
        )}
        <div className="product-card__pricing">
          <span className="product-card__price">₹{formattedPrice}</span>
          {product.discountPercent > 0 && (
            <>
              <span className="product-card__original-price">
                ₹{formattedOriginal}
              </span>
              <span className="product-card__discount">
                {product.discountPercent}% off
              </span>
            </>
          )}
        </div>
        <div className="product-card__delivery">
          Free delivery by <span>Tomorrow</span>
        </div>
      </div>
      <div className="product-card__meta"></div>
    </Link>
  );
}

export default ProductCard;
