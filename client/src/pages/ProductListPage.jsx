import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../api';
import ProductCard from '../components/ProductCard';

function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const minRating = searchParams.get('minRating') || '';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, category, sort, minRating, page]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (category) params.category = category;
      if (sort) params.sort = sort;
      if (minRating) params.minRating = minRating;

      const res = await getProducts(params);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const setSort = (sortValue) => {
    updateFilter('sort', sortValue);
  };

  const activeCategoryName = categories.find((c) => c.slug === category)?.name;

  return (
    <div className="product-list-page" id="product-list-page">
      {/* Filters Sidebar */}
      <aside className="filters-sidebar" id="filters-sidebar">
        <h2 className="filters-sidebar__title">Filters</h2>

        {/* Category Filter */}
        <div className="filter-section">
          <h3 className="filter-section__title">Category</h3>
          <div className="filter-section__options">
            <label className="filter-option">
              <input
                type="radio"
                name="category"
                checked={!category}
                onChange={() => updateFilter('category', '')}
              />
              <span className="filter-option__label">All Categories</span>
            </label>
            {categories.map((cat) => (
              <label key={cat.id} className="filter-option">
                <input
                  type="radio"
                  name="category"
                  checked={category === cat.slug}
                  onChange={() => updateFilter('category', cat.slug)}
                />
                <span className="filter-option__label">{cat.name}</span>
                <span className="filter-option__count">({cat._count?.products || 0})</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating Filter */}
        <div className="filter-section">
          <h3 className="filter-section__title">Customer Ratings</h3>
          <div className="filter-section__options">
            {[4, 3, 2, 1].map((r) => (
              <label key={r} className="filter-option">
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === String(r)}
                  onChange={() => updateFilter('minRating', String(r))}
                />
                <span className="filter-option__label">{r}★ & above</span>
              </label>
            ))}
            <label className="filter-option">
              <input
                type="radio"
                name="rating"
                checked={!minRating}
                onChange={() => updateFilter('minRating', '')}
              />
              <span className="filter-option__label">All Ratings</span>
            </label>
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="product-grid-wrapper">
        <div className="product-grid-header">
          <div className="product-grid-header__count">
            {search && (
              <span>
                Showing results for "<span>{search}</span>"
                {' · '}
              </span>
            )}
            {activeCategoryName && (
              <span>{activeCategoryName} · </span>
            )}
            <span>{pagination.total}</span> products found
          </div>
          <div className="product-grid-header__sort">
            <span className="sort-label">Sort By</span>
            <span
              className={`sort-option ${sort === 'popular' || !sort ? 'active' : ''}`}
              onClick={() => setSort('popular')}
            >
              Popularity
            </span>
            <span
              className={`sort-option ${sort === 'price_low' ? 'active' : ''}`}
              onClick={() => setSort('price_low')}
            >
              Price — Low to High
            </span>
            <span
              className={`sort-option ${sort === 'price_high' ? 'active' : ''}`}
              onClick={() => setSort('price_high')}
            >
              Price — High to Low
            </span>
            <span
              className={`sort-option ${sort === 'rating' ? 'active' : ''}`}
              onClick={() => setSort('rating')}
            >
              Rating
            </span>
          </div>
        </div>

        {loading ? (
          <div className="loader">
            <div className="loader__spinner"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="cart-empty" style={{ background: 'white', borderRadius: 4 }}>
            <div className="cart-empty__icon">🔍</div>
            <h2 className="cart-empty__title">No products found</h2>
            <p className="cart-empty__text">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} variant="list" />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 8,
                padding: 20,
                background: 'white',
                borderRadius: '0 0 4px 4px',
              }}>
                <button
                  onClick={() => updateFilter('page', String(page - 1))}
                  disabled={page <= 1}
                  style={{
                    padding: '8px 16px',
                    background: page <= 1 ? '#f0f0f0' : '#2874f0',
                    color: page <= 1 ? '#999' : 'white',
                    border: 'none',
                    borderRadius: 3,
                    cursor: page <= 1 ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Previous
                </button>
                <span style={{ padding: '8px 16px', fontSize: 14, color: '#212121' }}>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => updateFilter('page', String(page + 1))}
                  disabled={page >= pagination.totalPages}
                  style={{
                    padding: '8px 16px',
                    background: page >= pagination.totalPages ? '#f0f0f0' : '#2874f0',
                    color: page >= pagination.totalPages ? '#999' : 'white',
                    border: 'none',
                    borderRadius: 3,
                    cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductListPage;
