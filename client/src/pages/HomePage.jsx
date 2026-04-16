import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../api';
import ProductCard from '../components/ProductCard';

const bannerSlides = [
  {
    title: 'Big Billion Days Sale',
    subtitle: 'Up to 80% off on Electronics, Fashion & More!',
    gradient: 'linear-gradient(135deg, #2874f0 0%, #6c5ce7 50%, #e17055 100%)',
  },
  {
    title: 'Latest Smartphones',
    subtitle: 'Top brands at unbeatable prices. Exchange offers available!',
    gradient: 'linear-gradient(135deg, #0984e3 0%, #6c5ce7 50%, #fd79a8 100%)',
  },
  {
    title: 'Fashion Essentials',
    subtitle: 'Trending styles from ₹199. Free delivery on orders above ₹500',
    gradient: 'linear-gradient(135deg, #00b894 0%, #00cec9 50%, #0984e3 100%)',
  },
  {
    title: 'Home Makeover Sale',
    subtitle: 'Transform your space with premium furniture & decor',
    gradient: 'linear-gradient(135deg, #e17055 0%, #fdcb6e 50%, #00b894 100%)',
  },
];

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [dealsProducts, setDealsProducts] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 4000);
    return () => clearInterval(slideInterval);
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, featuredRes, trendingRes, dealsRes] = await Promise.all([
        getCategories(),
        getProducts({ sort: 'rating', limit: 10 }),
        getProducts({ sort: 'popular', limit: 10 }),
        getProducts({ sort: 'price_low', limit: 10 }),
      ]);
      setCategories(catRes.data);
      setFeaturedProducts(featuredRes.data.products);
      setTrendingProducts(trendingRes.data.products);
      setDealsProducts(dealsRes.data.products);
    } catch (err) {
      console.error('Failed to fetch homepage data:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % bannerSlides.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);

  if (loading) {
    return (
      <div className="container">
        <div className="loader">
          <div className="loader__spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" id="home-page">
      {/* Hero Banner */}
      <div className="home-banner">
        <div className="home-banner__carousel">
          {bannerSlides.map((slide, index) => (
            <div
              key={index}
              className={`home-banner__slide ${index === activeSlide ? 'active' : ''}`}
              style={{ background: slide.gradient }}
            >
              <div className="home-banner__slide-content">
                <h2>{slide.title}</h2>
                <p>{slide.subtitle}</p>
              </div>
            </div>
          ))}
          <button className="home-banner__nav home-banner__nav--prev" onClick={prevSlide}>
            ‹
          </button>
          <button className="home-banner__nav home-banner__nav--next" onClick={nextSlide}>
            ›
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="home-section">
        <div className="home-section__header">
          <h2 className="home-section__title">Shop by Category</h2>
        </div>
        <div className="home-section__grid">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="home-category-card"
            >
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="home-category-card__image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/140x140?text=' + cat.name;
                }}
              />
              <span className="home-category-card__name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Rated Products */}
      {featuredProducts.length > 0 && (
        <div className="home-section">
          <div className="home-section__header">
            <h2 className="home-section__title">Top Rated Products</h2>
            <Link to="/products?sort=rating" className="home-section__viewall">
              VIEW ALL
            </Link>
          </div>
          <div className="home-products-row">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="grid" />
            ))}
          </div>
        </div>
      )}

      {/* Trending Now */}
      {trendingProducts.length > 0 && (
        <div className="home-section">
          <div className="home-section__header">
            <h2 className="home-section__title">Trending Now</h2>
            <Link to="/products?sort=popular" className="home-section__viewall">
              VIEW ALL
            </Link>
          </div>
          <div className="home-products-row">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="grid" />
            ))}
          </div>
        </div>
      )}

      {/* Best Deals */}
      {dealsProducts.length > 0 && (
        <div className="home-section">
          <div className="home-section__header">
            <h2 className="home-section__title">Best Deals on Budget</h2>
            <Link to="/products?sort=price_low" className="home-section__viewall">
              VIEW ALL
            </Link>
          </div>
          <div className="home-products-row">
            {dealsProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="grid" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
