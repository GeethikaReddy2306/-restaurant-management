import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * CustomerRoutes — wraps all customer-facing pages.
 * - Guests (not logged in) can browse freely (/, /menu).
 * - Protected customer pages (cart, booking) require login with customer role.
 * - If logged-in user is admin or kitchen, they shouldn't be here — show access denied.
 */
export default function CustomerRoutes({ requireLogin = false }) {
  const { user, isLoggedIn } = useAuth();

  // If a route requires login and user is not logged in, redirect to /login
  if (requireLogin && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but as admin or kitchen, redirect them to their dashboard
  if (isLoggedIn && user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  if (isLoggedIn && user?.role === 'kitchen') {
    return <Navigate to="/kitchen" replace />;
  }

  return <Outlet />;
}
