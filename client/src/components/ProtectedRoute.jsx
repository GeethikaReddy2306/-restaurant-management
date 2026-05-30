import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - Legacy wrapper still used in old App.jsx style routes.
 * Now role-aware: admin/kitchen unauthenticated → /admin/login
 *                 customer unauthenticated → /login
 *                 wrong role → /access-denied
 */
export default function ProtectedRoute({ children, role }) {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    // Staff roles go to staff portal; customers go to customer login
    const staffRoles = ['admin', 'kitchen'];
    const loginPath = staffRoles.includes(role) ? '/admin/login' : '/login';
    return <Navigate to={loginPath} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}

