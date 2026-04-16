import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCategories } from '../api';

const fallbackCategories = [
  { id: 1, slug: 'electronics', name: 'Electronics', imageUrl: 'https://cdn-icons-png.flaticon.com/128/3659/3659899.png' },
  { id: 2, slug: 'mobiles', name: 'Mobiles', imageUrl: 'https://cdn-icons-png.flaticon.com/128/0/191.png' },
  { id: 3, slug: 'fashion', name: 'Fashion', imageUrl: 'https://cdn-icons-png.flaticon.com/128/863/863684.png' },
  { id: 4, slug: 'home-furniture', name: 'Home', imageUrl: 'https://cdn-icons-png.flaticon.com/128/1046/1046869.png' },
  { id: 5, slug: 'appliances', name: 'Appliances', imageUrl: 'https://cdn-icons-png.flaticon.com/128/2933/2933245.png' },
  { id: 6, slug: 'beauty', name: 'Beauty', imageUrl: 'https://cdn-icons-png.flaticon.com/128/1940/1940922.png' },
  { id: 7, slug: 'sports', name: 'Sports', imageUrl: 'https://cdn-icons-png.flaticon.com/128/857/857455.png' },
  { id: 8, slug: 'books', name: 'Books', imageUrl: 'https://cdn-icons-png.flaticon.com/128/3389/3389081.png' },
];

function CategoryBar() {
  const [categories, setCategories] = useState(fallbackCategories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        if (res.data && res.data.length > 0) {
          setCategories(res.data);
        }
      } catch {
        // Use fallback categories
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="category-bar" id="category-bar">
      <div className="category-bar__list">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/products?category=${cat.slug}`}
            className="category-bar__item"
          >
            <img
              src={cat.imageUrl}
              alt={cat.name}
              className="category-bar__icon"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="category-bar__name">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryBar;
