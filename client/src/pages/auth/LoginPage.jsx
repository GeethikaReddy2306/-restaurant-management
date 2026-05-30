import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to appropriate dashboard
  if (isLoggedIn) {
    const roleRedirects = { admin: '/admin', kitchen: '/kitchen', customer: '/' };
    navigate(roleRedirects[user.role] || '/', { replace: true });
    return null;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email: form.email, password: form.password });
      const { user: userData, token } = res.data;
      login(userData, token);
      toast.success(`Welcome back, ${userData.name}!`);
      // Role-based redirect
      if (userData.role === 'admin') navigate('/admin');
      else if (userData.role === 'kitchen') navigate('/kitchen');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      return toast.error('All fields are required');
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'customer', // Always register as customer from public form
      });
      login(res.data.user, res.data.token);
      toast.success(`Welcome to La Maison, ${res.data.user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-page">
      <div className="lp-bg" />
      <div className="lp-card card fade-in-up">
        <div className="lp-logo">🍽️</div>
        <h1 className="lp-brand">La Maison</h1>
        <p className="lp-sub">Your table awaits</p>

        <div className="lp-tabs">
          <button
            className={`lp-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
          >
            Sign In
          </button>
          <button
            className={`lp-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => setTab('register')}
          >
            Register
          </button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg lp-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg lp-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        <div className="lp-divider">
          <span>Staff?</span>
        </div>
        <Link to="/admin/login" className="lp-staff-link">
          Go to Staff Portal →
        </Link>
      </div>

      <style>{`
        .lp-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
          position: relative;
          padding: 20px;
        }
        .lp-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(230,126,34,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .lp-card {
          width: 100%;
          max-width: 420px;
          text-align: center;
          padding: 48px 36px;
          position: relative;
          z-index: 1;
        }
        .lp-logo { font-size: 3rem; margin-bottom: 8px; }
        .lp-brand { font-size: 1.8rem; color: var(--primary); margin-bottom: 4px; }
        .lp-sub { color: var(--text-muted); font-size: 0.88rem; margin-bottom: 28px; }
        .lp-tabs {
          display: flex;
          background: var(--bg-card-2);
          border-radius: var(--radius-sm);
          padding: 4px;
          margin-bottom: 24px;
          gap: 4px;
        }
        .lp-tab {
          flex: 1;
          padding: 9px 0;
          border: none;
          border-radius: calc(var(--radius-sm) - 2px);
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
        }
        .lp-tab.active {
          background: var(--primary);
          color: white;
          font-weight: 600;
        }
        .lp-card form { text-align: left; }
        .lp-btn { width: 100%; margin-top: 4px; }
        .lp-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0 12px;
          color: var(--text-muted);
          font-size: 0.78rem;
        }
        .lp-divider::before, .lp-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }
        .lp-staff-link {
          display: block;
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.85rem;
          transition: var(--transition);
        }
        .lp-staff-link:hover { color: var(--primary); }
      `}</style>
    </div>
  );
}
