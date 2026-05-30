import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * AdminRoutes — wraps all /admin/* pages.
 * - Not logged in → redirect to /admin/login
 * - Logged in but not admin → redirect to /access-denied
 * - Admin → render the route (Outlet)
 */
export default function AdminRoutes() {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
}
