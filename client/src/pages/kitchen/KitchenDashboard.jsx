import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

// Status flow: Pending → Preparing → Ready → Served
const NEXT_STATUS = { Pending: 'Preparing', Preparing: 'Ready', Ready: 'Served' };
const BTN_LABEL = { Pending: '🍳 Start Cooking', Preparing: '✅ Mark as Ready', Ready: '🍽️ Mark as Served' };
const BADGE_CLASS = {
  Pending: 'badge-pending',
  Preparing: 'badge-preparing',
  Ready: 'badge-ready',
  Served: 'badge-served',
  Cancelled: 'badge-occupied',
};

const STATUS_ORDER = ['Pending', 'Preparing', 'Ready'];

export default function KitchenDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // orderId being updated

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      // Show only active orders (not Served or Cancelled)
      setOrders(res.data.filter((o) => o.status !== 'Served' && o.status !== 'Cancelled'));
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Socket.IO real-time updates
    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');

    socket.on('order:new', (order) => {
      toast('🆕 New order!', { icon: '🔔', duration: 5000 });
      setOrders((prev) => {
        // Avoid duplicates
        if (prev.find((o) => o._id === order._id)) return prev;
        return [order, ...prev];
      });
    });

    socket.on('order:statusUpdated', ({ orderId, status }) => {
      if (status === 'Served' || status === 'Cancelled') {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
      } else {
        setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o));
      }
    });

    return () => socket.disconnect();
  }, []);

  const updateStatus = async (order) => {
    const nextStatus = NEXT_STATUS[order.status];
    if (!nextStatus) return;
    setUpdating(order._id);
    try {
      await api.put(`/orders/${order._id}/status`, { status: nextStatus });
      // Local update (socket will also fire, but local is instant)
      if (nextStatus === 'Served') {
        setOrders((prev) => prev.filter((o) => o._id !== order._id));
      } else {
        setOrders((prev) => prev.map((o) => o._id === order._id ? { ...o, status: nextStatus } : o));
      }
      toast.success(`Table ${order.tableNumber} → ${nextStatus}`);
    } catch {
      toast.error('Update failed. Try again.');
    } finally {
      setUpdating(null);
    }
  };

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  // Group orders by status
  const grouped = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s);
    return acc;
  }, {});

  const pendingCount = grouped['Pending'].length;
  const preparingCount = grouped['Preparing'].length;
  const readyCount = grouped['Ready'].length;

  return (
    <div className="kitchen-page">
      {/* Header */}
      <header className="kitchen-header">
        <div className="kitchen-brand">🍳 Kitchen Dashboard</div>
        <div className="kitchen-counts">
          <span className="kc pending">🟥 {pendingCount} Pending</span>
          <span className="kc preparing">🟡 {preparingCount} Preparing</span>
          <span className="kc ready">🟢 {readyCount} Ready</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            👨‍🍳 {user?.name || 'Kitchen Staff'}
          </span>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="kitchen-content">
        {loading ? (
          <div className="loading"><div className="spinner" /><span>Loading orders...</span></div>
        ) : orders.length === 0 ? (
          <div className="empty-state" style={{ paddingTop: '80px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>✅</div>
            <h3>All caught up!</h3>
            <p>No active orders at the moment. New orders will appear here in real time.</p>
          </div>
        ) : (
          /* Render columns: Pending | Preparing | Ready */
          <div className="kitchen-columns">
            {STATUS_ORDER.map((statusGroup) => (
              <div key={statusGroup} className="kitchen-column">
                <div className={`column-header ch-${statusGroup.toLowerCase()}`}>
                  <span className="col-title">{statusGroup}</span>
                  <span className="col-count">{grouped[statusGroup].length}</span>
                </div>

                <div className="column-cards">
                  {grouped[statusGroup].length === 0 ? (
                    <div className="col-empty">No {statusGroup.toLowerCase()} orders</div>
                  ) : (
                    grouped[statusGroup].map((order) => (
                      <div key={order._id} className={`kitchen-card card k-${order.status.toLowerCase()}`}>
                        <div className="kcard-header">
                          <div className="kcard-table">Table {order.tableNumber}</div>
                          <span className={`badge ${BADGE_CLASS[order.status]}`}>{order.status}</span>
                        </div>

                        <div className="kcard-time">
                          🕐 {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>

                        {order.guestName && (
                          <div className="kcard-guest">👤 {order.guestName}</div>
                        )}

                        <div className="kcard-items">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="kitem">
                              <span className="kitem-qty">{item.quantity}×</span>
                              <span className="kitem-name">{item.name}</span>
                            </div>
                          ))}
                        </div>

                        {order.notes && (
                          <div className="kcard-notes">📝 {order.notes}</div>
                        )}

                        <div className="kcard-total">₹{order.totalAmount?.toFixed(2)}</div>

                        {NEXT_STATUS[order.status] && (
                          <button
                            className={`btn btn-primary kcard-btn ${order.status === 'Preparing' ? 'btn-ready' : ''}`}
                            onClick={() => updateStatus(order)}
                            disabled={updating === order._id}
                          >
                            {updating === order._id ? 'Updating...' : BTN_LABEL[order.status]}
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .kitchen-page { min-height: 100vh; background: var(--bg); display: flex; flex-direction: column; }
        .kitchen-header {
          background: var(--bg-card);
          border-bottom: 1px solid var(--border);
          padding: 16px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          position: sticky;
          top: 0;
          z-index: 100;
          flex-wrap: wrap;
        }
        .kitchen-brand { font-size: 1.3rem; font-weight: 800; color: var(--primary); }
        .kitchen-counts { display: flex; gap: 12px; flex-wrap: wrap; }
        .kc {
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.3px;
        }
        .kc.pending { background: rgba(231,76,60,0.15); color: #e74c3c; }
        .kc.preparing { background: rgba(243,156,18,0.15); color: #f39c12; }
        .kc.ready { background: rgba(39,174,96,0.15); color: #27ae60; }

        .kitchen-content { flex: 1; padding: 24px; }

        /* Column layout */
        .kitchen-columns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .kitchen-column { display: flex; flex-direction: column; gap: 12px; }
        .column-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          border-radius: var(--radius);
          font-weight: 700;
          font-size: 0.9rem;
        }
        .ch-pending { background: rgba(231,76,60,0.15); border: 1px solid rgba(231,76,60,0.3); color: #e74c3c; }
        .ch-preparing { background: rgba(243,156,18,0.15); border: 1px solid rgba(243,156,18,0.3); color: #f39c12; }
        .ch-ready { background: rgba(39,174,96,0.15); border: 1px solid rgba(39,174,96,0.3); color: #27ae60; }
        .col-title { font-size: 0.95rem; }
        .col-count { font-size: 1.1rem; font-weight: 900; }
        .col-empty { color: var(--text-muted); text-align: center; padding: 40px 0; font-size: 0.85rem; }

        .column-cards { display: flex; flex-direction: column; gap: 14px; }

        /* Order Card */
        .kitchen-card { border-left: 4px solid var(--border); transition: var(--transition); }
        .kitchen-card.k-pending { border-left-color: #e74c3c; }
        .kitchen-card.k-preparing { border-left-color: #f39c12; }
        .kitchen-card.k-ready { border-left-color: #27ae60; }

        .kcard-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
        .kcard-table { font-size: 1.4rem; font-weight: 900; color: var(--text-primary); letter-spacing: 1px; }
        .kcard-time { font-size: 0.78rem; color: var(--text-muted); margin-bottom: 4px; }
        .kcard-guest { font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 12px; }

        .kcard-items { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
        .kitem {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: var(--bg-card-2);
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
        }
        .kitem-qty { font-size: 0.9rem; font-weight: 900; color: var(--primary); min-width: 28px; }
        .kitem-name { flex: 1; }

        .kcard-notes {
          font-size: 0.82rem;
          color: var(--text-secondary);
          background: rgba(230,126,34,0.08);
          border: 1px solid rgba(230,126,34,0.2);
          border-radius: var(--radius-sm);
          padding: 8px 12px;
          margin-bottom: 8px;
        }
        .kcard-total {
          font-size: 1rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 14px;
        }
        .kcard-btn {
          width: 100%;
          font-size: 0.9rem;
          padding: 12px;
        }
        .btn-ready {
          background: #27ae60 !important;
        }
        .btn-ready:hover { background: #229954 !important; }

        @media (max-width: 900px) {
          .kitchen-columns { grid-template-columns: 1fr; }
          .kitchen-header { padding: 14px 16px; }
          .kitchen-content { padding: 16px; }
        }
      `}</style>
    </div>
  );
}
