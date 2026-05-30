import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Starters', 'Main Course', 'Desserts', 'Beverages', 'Specials'];

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { addToCart, cartCount } = useCart();

  useEffect(() => {
    setLoading(true);
    const query = category !== 'All' ? `?category=${category}` : '';
    api.get(`/menu${query}`)
      .then((res) => setItems(res.data))
      .catch(() => toast.error('Failed to load menu'))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="page">
      <div className="container page-content">
        <div className="menu-header">
          <div>
            <h1>Our Menu</h1>
            <p className="subtitle">Crafted with passion, served with love</p>
          </div>
          {cartCount > 0 && (
            <Link to="/cart" className="btn btn-primary">View Cart ({cartCount})</Link>
          )}
        </div>

        {/* Category Filter */}
        <div className="cat-filter">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /><span>Loading menu...</span></div>
        ) : items.length === 0 ? (
          <div className="empty-state"><h3>No items found</h3><p>Try a different category</p></div>
        ) : (
          <div className="grid-auto">
            {items.map((item) => (
              <div key={item._id} className="menu-card card fade-in-up">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="menu-img" />
                ) : (
                  <div className="menu-img-placeholder">🍽️</div>
                )}
                <div className="menu-body">
                  <div className="menu-top">
                    <span className="cat-tag">{item.category}</span>
                    {item.isVeg && <span className="veg-tag">🟢 Veg</span>}
                  </div>
                  <h3 className="menu-name">{item.name}</h3>
                  <p className="menu-desc">{item.description}</p>
                  <div className="menu-footer">
                    <span className="menu-price">₹{item.price}</span>
                    <button
                      className="btn btn-primary btn-sm"
                      disabled={!item.available}
                      onClick={() => { addToCart(item); toast.success(`${item.name} added to cart!`); }}
                    >
                      {item.available ? 'Add to Cart' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .menu-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .menu-header h1 { font-size: 2.2rem; }
        .subtitle { color: var(--text-secondary); margin-top: 6px; }
        .cat-filter { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 32px; }
        .cat-btn {
          padding: 8px 18px;
          border-radius: 20px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--text-secondary);
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
        }
        .cat-btn:hover { border-color: var(--primary); color: var(--primary); }
        .cat-btn.active { background: var(--primary); border-color: var(--primary); color: white; }
        .menu-card { padding: 0; overflow: hidden; }
        .menu-img { width: 100%; height: 180px; object-fit: cover; }
        .menu-img-placeholder {
          width: 100%; height: 140px;
          background: var(--bg-card-2);
          display: flex; align-items: center; justify-content: center;
          font-size: 3rem;
        }
        .menu-body { padding: 16px; }
        .menu-top { display: flex; gap: 8px; margin-bottom: 10px; }
        .cat-tag {
          font-size: 0.72rem; font-weight: 600;
          background: rgba(230,126,34,0.15); color: var(--primary);
          padding: 2px 8px; border-radius: 10px;
        }
        .veg-tag { font-size: 0.72rem; color: var(--status-available); }
        .menu-name { font-size: 1rem; font-weight: 700; margin-bottom: 6px; }
        .menu-desc { color: var(--text-secondary); font-size: 0.84rem; line-height: 1.5; margin-bottom: 14px; min-height: 40px; }
        .menu-footer { display: flex; align-items: center; justify-content: space-between; }
        .menu-price { font-size: 1.1rem; font-weight: 800; color: var(--primary); }
      `}</style>
    </div>
  );
}
