import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AccessDenied() {
  const { user } = useAuth();

  // Role-appropriate "go back" link
  const homeLink =
    user?.role === 'admin' ? '/admin' :
    user?.role === 'kitchen' ? '/kitchen' :
    '/';

  const homeLinkLabel =
    user?.role === 'admin' ? 'Go to Admin Dashboard' :
    user?.role === 'kitchen' ? 'Go to Kitchen Dashboard' :
    'Go to Home';

  return (
    <div className="access-denied-page">
      <div className="ad-glow" />
      <div className="ad-content card fade-in-up">
        <div className="ad-icon">🚫</div>
        <h1>Access Denied</h1>
        <p className="ad-message">
          You don't have permission to view this page.
          {user
            ? ` Your current role is "${user.role}".`
            : ' You are not logged in.'}
        </p>

        <div className="ad-role-badge">
          <span className={`badge badge-role-${user?.role || 'guest'}`}>
            {user ? `Role: ${user.role}` : 'Not Authenticated'}
          </span>
        </div>

        <div className="ad-actions">
          <Link to={homeLink} className="btn btn-primary">
            {homeLinkLabel}
          </Link>
          {!user && (
            <Link to="/login" className="btn btn-secondary">
              Sign In
            </Link>
          )}
        </div>
      </div>

      <style>{`
        .access-denied-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
          position: relative;
          padding: 20px;
        }
        .ad-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 50% at 50% 30%, rgba(231,76,60,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .ad-content {
          max-width: 460px;
          width: 100%;
          text-align: center;
          padding: 56px 40px;
          position: relative;
          z-index: 1;
        }
        .ad-icon {
          font-size: 4rem;
          margin-bottom: 16px;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .ad-content h1 {
          font-size: 2rem;
          margin-bottom: 12px;
          color: #e74c3c;
        }
        .ad-message {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .ad-role-badge { margin-bottom: 32px; }
        .badge-role-admin { background: rgba(52,152,219,0.15); color: #3498db; border: 1px solid rgba(52,152,219,0.3); padding: 4px 14px; border-radius: 20px; font-size: 0.82rem; }
        .badge-role-kitchen { background: rgba(230,126,34,0.15); color: var(--primary); border: 1px solid rgba(230,126,34,0.3); padding: 4px 14px; border-radius: 20px; font-size: 0.82rem; }
        .badge-role-customer { background: rgba(39,174,96,0.15); color: #27ae60; border: 1px solid rgba(39,174,96,0.3); padding: 4px 14px; border-radius: 20px; font-size: 0.82rem; }
        .badge-role-guest { background: rgba(127,140,141,0.15); color: #7f8c8d; border: 1px solid rgba(127,140,141,0.3); padding: 4px 14px; border-radius: 20px; font-size: 0.82rem; }
        .ad-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
      `}</style>
    </div>
  );
}
