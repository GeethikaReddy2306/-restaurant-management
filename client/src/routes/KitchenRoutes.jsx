import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * KitchenRoutes — wraps all /kitchen/* pages.
 * - Not logged in → redirect to /admin/login (staff login)
 * - Logged in but not kitchen → redirect to /access-denied
 * - Kitchen → render the route (Outlet)
 */
export default function KitchenRoutes() {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user?.role !== 'kitchen') {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
}
