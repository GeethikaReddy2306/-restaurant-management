import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/admin', label: '📊 Dashboard', end: true },
  { to: '/admin/tables', label: '🪑 Tables' },
  { to: '/admin/reservations', label: '📅 Reservations' },
  { to: '/admin/orders', label: '🛒 Orders' },
  { to: '/admin/advertisements', label: '📣 Advertisements' },
];


export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">🍽️ La Maison<span>Admin</span></div>
      <nav className="sidebar-nav">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user?.name?.[0]?.toUpperCase() || 'A'}</div>
          <div>
            <div className="sidebar-name">{user?.name}</div>
            <div className="sidebar-role">Admin</div>
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout} style={{ width: '100%' }}>Logout</button>
      </div>
      <style>{`
        .admin-sidebar {
          width: 240px;
          min-height: 100vh;
          background: var(--bg-card);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 100;
        }
        .sidebar-brand {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 36px;
          padding-left: 8px;
        }
        .sidebar-brand span {
          display: block;
          font-size: 0.7rem;
          color: var(--text-muted);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .sidebar-link {
          display: block;
          padding: 11px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: var(--transition);
        }
        .sidebar-link:hover { background: rgba(230,126,34,0.1); color: var(--primary); }
        .sidebar-link.active { background: rgba(230,126,34,0.15); color: var(--primary); font-weight: 600; }
        .sidebar-footer { border-top: 1px solid var(--border); padding-top: 20px; display: flex; flex-direction: column; gap: 14px; }
        .sidebar-user { display: flex; align-items: center; gap: 10px; }
        .sidebar-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 1rem; color: white; flex-shrink: 0;
        }
        .sidebar-name { font-size: 0.88rem; font-weight: 600; }
        .sidebar-role { font-size: 0.75rem; color: var(--primary); }
      `}</style>
    </aside>
  );
}
