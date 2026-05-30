import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const ROLE_LABELS = { admin: 'Admin', kitchen: 'Kitchen', customer: 'Customer' };
const ROLE_COLORS = { admin: '#3498db', kitchen: '#e67e22', customer: '#27ae60' };

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    const wasAdmin = user?.role === 'admin' || user?.role === 'kitchen';
    logout();
    navigate(wasAdmin ? '/admin/login' : '/');
  };

  const isActive = (path) => location.pathname === path;
  const close = () => setMenuOpen(false);

  // Determine what links to show based on role
  const isCustomerOrGuest = !user || user.role === 'customer';
  const isAdmin = user?.role === 'admin';
  const isKitchen = user?.role === 'kitchen';

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to={isAdmin ? '/admin' : isKitchen ? '/kitchen' : '/'} className="navbar-brand">
          <span className="brand-icon">🍽️</span>
          <span className="brand-name">La Maison</span>
        </Link>

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {/* Customer / Guest links */}
          {isCustomerOrGuest && (
            <>
              <li><Link to="/" className={isActive('/') ? 'active' : ''} onClick={close}>Home</Link></li>
              <li><Link to="/menu" className={isActive('/menu') ? 'active' : ''} onClick={close}>Menu</Link></li>
              <li><Link to="/book" className={isActive('/book') ? 'active' : ''} onClick={close}>Reserve</Link></li>
              <li>
                <Link to="/cart" className={`cart-link ${isActive('/cart') ? 'active' : ''}`} onClick={close}>
                  Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
              </li>
            </>
          )}

          {/* Admin links */}
          {isAdmin && (
            <li><Link to="/admin" className={location.pathname.startsWith('/admin') ? 'active' : ''} onClick={close}>Dashboard</Link></li>
          )}

          {/* Kitchen links */}
          {isKitchen && (
            <li><Link to="/kitchen" className={isActive('/kitchen') ? 'active' : ''} onClick={close}>Kitchen Board</Link></li>
          )}

          {/* Auth section */}
          {user ? (
            <li>
              <div className="navbar-user">
                <div className="navbar-user-info">
                  <span className="user-name">{user.name}</span>
                  <span
                    className="user-role-badge"
                    style={{ background: `${ROLE_COLORS[user.role]}22`, color: ROLE_COLORS[user.role] }}
                  >
                    {ROLE_LABELS[user.role] || user.role}
                  </span>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
              </div>
            </li>
          ) : (
            <li><Link to="/login" className="btn btn-primary btn-sm" onClick={close}>Login</Link></li>
          )}
        </ul>
      </div>
      <style>{`
        .navbar-user-info { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
        .user-role-badge { font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
      `}</style>
    </nav>
  );
}

