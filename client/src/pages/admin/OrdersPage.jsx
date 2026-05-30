import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const query = filter ? `?status=${filter}` : '';
    api.get(`/orders${query}`).then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');
    socket.on('order:statusUpdated', ({ orderId, status }) => {
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o));
    });
    socket.on('order:new', (order) => {
      setOrders((prev) => [order, ...prev]);
      toast('📦 New order received!', { icon: '🛒' });
    });
    return () => socket.disconnect();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
    } catch { toast.error('Update failed'); }
  };

  const badgeMap = { Pending: 'badge-pending', Preparing: 'badge-preparing', Ready: 'badge-ready', Served: 'badge-served', Cancelled: 'badge-occupied' };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Orders</h1>
            <p>Live order management with real-time updates</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['', ...STATUSES].map((s) => (
              <button key={s} className={`cat-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}
                style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border)', background: filter === s ? 'var(--primary)' : 'var(--bg-card)', color: filter === s ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, transition: 'var(--transition)' }}>
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>

        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <div className="card">
            <table className="admin-table">
              <thead><tr><th>Table</th><th>Guest</th><th>Items</th><th>Total</th><th>Time</th><th>Status</th><th>Update</th></tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td style={{ fontWeight: 700 }}>{o.tableNumber || '—'}</td>
                    <td>{o.guestName}</td>
                    <td>
                      {o.items.map((item) => (
                        <div key={item.menuItem} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {item.name} × {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{o.totalAmount.toFixed(2)}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleTimeString()}</td>
                    <td><span className={`badge ${badgeMap[o.status]}`}>{o.status}</span></td>
                    <td>
                      <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}
                        style={{ padding: '5px 8px', fontSize: '0.82rem', width: 'auto' }}>
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <div className="empty-state"><h3>No orders</h3></div>}
          </div>
        )}
      </main>
      <AdminTableStyle />
    </div>
  );
}

function AdminTableStyle() {
  return <style>{`.admin-layout{display:flex;min-height:100vh}.admin-main{margin-left:240px;flex:1;padding:40px 32px}.admin-header{margin-bottom:32px;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px}.admin-header h1{font-size:2rem}.admin-header p{color:var(--text-secondary);margin-top:4px}.admin-table{width:100%;border-collapse:collapse;font-size:.9rem}.admin-table th{text-align:left;padding:10px 12px;color:var(--text-muted);font-size:.8rem;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--border)}.admin-table td{padding:12px;border-bottom:1px solid var(--border);vertical-align:top}.admin-table tbody tr:hover{background:var(--bg-card-2)}@media(max-width:900px){.admin-main{margin-left:0;padding:20px 16px}}`}</style>;
}
