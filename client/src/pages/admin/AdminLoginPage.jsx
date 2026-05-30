import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ROLE_REDIRECTS = { customer: '/', admin: '/admin', kitchen: '/kitchen' };

export default function AdminLoginPage() {
  const { login, user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to their dashboard
  if (isLoggedIn && user) {
    navigate(ROLE_REDIRECTS[user.role] || '/', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      const { user: userData, token } = res.data;
      login(userData, token);
      toast.success(`Welcome, ${userData.name}!`);
      navigate(ROLE_REDIRECTS[userData.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-card card fade-in-up">
        <div className="login-logo">🍽️</div>
        <h1>La Maison</h1>
        <p className="login-sub">Staff Portal</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@lamaison.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/login" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            ← Customer Login
          </Link>
        </div>
      </div>
      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: var(--bg);
        }
        .login-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 80% at 50% 0%, rgba(230,126,34,0.2) 0%, transparent 70%);
          pointer-events: none;
        }
        .login-card { width: 100%; max-width: 400px; text-align: center; padding: 48px 36px; position: relative; }
        .login-logo { font-size: 3rem; margin-bottom: 10px; }
        .login-card h1 { font-size: 1.8rem; margin-bottom: 4px; color: var(--primary); }
        .login-sub { color: var(--text-muted); font-size: 0.88rem; margin-bottom: 32px; }
        .login-card form { text-align: left; }
      `}</style>
    </div>
  );
}
