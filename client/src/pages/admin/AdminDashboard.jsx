import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ tables: 0, reservations: 0, orders: 0, pendingOrders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  const fetchData = () => {
    Promise.all([
      api.get('/tables'),
      api.get('/reservations'),
      api.get('/orders'),
    ]).then(([t, r, o]) => {
      const orders = o.data;
      const pending = orders.filter((x) => x.status === 'Pending');
      setStats({ tables: t.data.length, reservations: r.data.length, orders: orders.length, pendingOrders: pending.length });
      setRecentOrders(orders.slice(0, 5));
    }).catch(() => {});
  };

  useEffect(() => {
    fetchData();

    // Socket.IO — live order updates for admin
    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');

    socket.on('order:new', (order) => {
      toast('🆕 New order received!', { icon: '🔔', duration: 4000 });
      setStats((prev) => ({ ...prev, orders: prev.orders + 1, pendingOrders: prev.pendingOrders + 1 }));
      setRecentOrders((prev) => [order, ...prev].slice(0, 5));
    });

    socket.on('order:statusUpdated', ({ orderId, status }) => {
      setRecentOrders((prev) => {
        const updated = prev.map((o) => (o._id === orderId ? { ...o, status } : o));
        const pendingCount = updated.filter((o) => o.status === 'Pending').length;
        setStats((s) => ({ ...s, pendingOrders: pendingCount }));
        return updated;
      });
    });

    return () => socket.disconnect();
  }, []);

  const statCards = [
    { icon: '🪑', label: 'Total Tables', value: stats.tables, color: '#3498db' },
    { icon: '📅', label: 'Reservations', value: stats.reservations, color: '#27ae60' },
    { icon: '🛒', label: 'Total Orders', value: stats.orders, color: '#e67e22' },
    { icon: '⏳', label: 'Pending Orders', value: stats.pendingOrders, color: '#e74c3c' },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening today.</p>
        </div>

        <div className="stats-grid">
          {statCards.map((s) => (
            <div key={s.label} className="stat-card card">
              <div className="stat-icon" style={{ background: `${s.color}22`, color: s.color }}>{s.icon}</div>
              <div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: '24px' }}>
          <h3 style={{ marginBottom: '20px' }}>
            Recent Orders <span className="live-dot">🟢 Live</span>
          </h3>
          {recentOrders.length === 0 ? (
            <div className="empty-state"><p>No orders yet</p></div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Table</th><th>Guest</th><th>Items</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.tableNumber || '—'}</td>
                    <td>{order.guestName}</td>
                    <td>{order.items.length} items</td>
                    <td>₹{order.totalAmount.toFixed(2)}</td>
                    <td><span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      <AdminStyles />
    </div>
  );
}

function AdminStyles() {
  return (
    <style>{`
      .admin-layout { display: flex; min-height: 100vh; }
      .admin-main { margin-left: 240px; flex: 1; padding: 40px 32px; }
      .admin-header { margin-bottom: 32px; }
      .admin-header h1 { font-size: 2rem; }
      .admin-header p { color: var(--text-secondary); margin-top: 4px; }
      .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
      .stat-card { display: flex; align-items: center; gap: 16px; }
      .stat-icon { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; }
      .stat-value { font-size: 1.8rem; font-weight: 800; }
      .stat-label { color: var(--text-secondary); font-size: 0.85rem; }
      .admin-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
      .admin-table th { text-align: left; padding: 10px 12px; color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--border); }
      .admin-table td { padding: 12px 12px; border-bottom: 1px solid var(--border); color: var(--text-primary); }
      .admin-table tbody tr:hover { background: var(--bg-card-2); }
      .live-dot { font-size: 0.78rem; font-weight: 500; color: #27ae60; margin-left: 8px; vertical-align: middle; animation: blink 1.5s ease-in-out infinite; }
      @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      @media (max-width: 900px) {
        .admin-main { margin-left: 0; padding: 20px 16px; }
        .stats-grid { grid-template-columns: repeat(2, 1fr); }
      }
    `}</style>
  );
}
