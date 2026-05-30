import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Shared layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Route wrappers (role-based access control)
import CustomerRoutes from './routes/CustomerRoutes';
import AdminRoutes from './routes/AdminRoutes';
import KitchenRoutes from './routes/KitchenRoutes';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AccessDenied from './pages/AccessDenied';

// Customer Pages
import LandingPage from './pages/customer/LandingPage';
import MenuPage from './pages/customer/MenuPage';
import TableBookingPage from './pages/customer/TableBookingPage';
import CartPage from './pages/customer/CartPage';
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import TableManagementPage from './pages/admin/TableManagementPage';
import ReservationsPage from './pages/admin/ReservationsPage';
import OrdersPage from './pages/admin/OrdersPage';
import AdvertisementPage from './pages/admin/AdvertisementPage';

// Kitchen Pages
import KitchenDashboard from './pages/kitchen/KitchenDashboard';

/**
 * App routing structure:
 *
 * /                   → Public Landing (Customer UI with Navbar/Footer)
 * /login              → Customer login/register page
 * /admin/login        → Staff portal login (admin + kitchen)
 * /access-denied      → Shown when role doesn't match route
 *
 * CustomerRoutes (guest browsable):
 *   /menu             → Menu Page
 *   /book             → Table Booking (requires customer login)
 *   /cart             → Cart (requires customer login)
 *   /order-confirmation → Order confirmation (requires customer login)
 *
 * AdminRoutes (admin role only):
 *   /admin            → Admin Dashboard
 *   /admin/tables     → Table Management
 *   /admin/reservations → Reservations List
 *   /admin/orders     → Orders Monitoring
 *   /admin/advertisements → Ad Management
 *   /admin/ads        → Alias for /admin/advertisements
 *
 * KitchenRoutes (kitchen role only):
 *   /kitchen          → Kitchen Dashboard (full-screen order board)
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#1a2535', color: '#f0f4f8', border: '1px solid #2a3a52' },
              success: { iconTheme: { primary: '#27ae60', secondary: '#fff' } },
              error: { iconTheme: { primary: '#e74c3c', secondary: '#fff' } },
            }}
          />
          <Routes>
            {/* ── Public Routes ── */}
            <Route path="/" element={<><Navbar /><LandingPage /><Footer /></>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/access-denied" element={<AccessDenied />} />

            {/* ── Customer Routes (browsable without login) ── */}
            <Route element={<CustomerRoutes />}>
              <Route path="/menu" element={<><Navbar /><MenuPage /><Footer /></>} />
            </Route>

            {/* ── Customer Routes (require login) ── */}
            <Route element={<CustomerRoutes requireLogin />}>
              <Route path="/book" element={<><Navbar /><TableBookingPage /><Footer /></>} />
              <Route path="/cart" element={<><Navbar /><CartPage /><Footer /></>} />
              <Route path="/order-confirmation" element={<><Navbar /><OrderConfirmationPage /><Footer /></>} />
            </Route>

            {/* ── Admin Routes (require admin role) ── */}
            <Route element={<AdminRoutes />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/tables" element={<TableManagementPage />} />
              <Route path="/admin/reservations" element={<ReservationsPage />} />
              <Route path="/admin/orders" element={<OrdersPage />} />
              <Route path="/admin/advertisements" element={<AdvertisementPage />} />
              <Route path="/admin/ads" element={<Navigate to="/admin/advertisements" replace />} />
            </Route>

            {/* ── Kitchen Routes (require kitchen role) ── */}
            <Route element={<KitchenRoutes />}>
              <Route path="/kitchen" element={<KitchenDashboard />} />
            </Route>

            {/* ── Fallback ── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
