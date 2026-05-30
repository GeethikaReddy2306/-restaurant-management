import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reservations').then((res) => setReservations(res.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/reservations/${id}`, { status });
      setReservations((prev) => prev.map((r) => r._id === id ? { ...r, status } : r));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  const statusBadge = { Confirmed: 'badge-available', Cancelled: 'badge-occupied', Completed: 'badge-cleaning', 'No-Show': 'badge-reserved' };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header"><h1>Reservations</h1><p>All table reservations</p></div>
        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <div className="card">
            <table className="admin-table">
              <thead><tr><th>Guest</th><th>Table</th><th>Arrival</th><th>Party</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.guestName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.guestEmail}</div>
                    </td>
                    <td>Table {r.table?.tableNumber || '—'}</td>
                    <td style={{ fontSize: '0.85rem' }}>{new Date(r.arrivalTime).toLocaleString()}</td>
                    <td>{r.partySize} guests</td>
                    <td><span className={`badge ${statusBadge[r.status] || 'badge-reserved'}`}>{r.status}</span></td>
                    <td>
                      <select
                        value={r.status}
                        onChange={(e) => updateStatus(r._id, e.target.value)}
                        style={{ padding: '5px 8px', fontSize: '0.82rem', width: 'auto' }}
                      >
                        {['Confirmed','Cancelled','Completed','No-Show'].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reservations.length === 0 && <div className="empty-state"><h3>No reservations</h3></div>}
          </div>
        )}
      </main>
      <AdminTableStyle />
    </div>
  );
}

function AdminTableStyle() {
  return <style>{`.admin-layout{display:flex;min-height:100vh}.admin-main{margin-left:240px;flex:1;padding:40px 32px}.admin-header{margin-bottom:32px}.admin-header h1{font-size:2rem}.admin-header p{color:var(--text-secondary);margin-top:4px}.admin-table{width:100%;border-collapse:collapse;font-size:.9rem}.admin-table th{text-align:left;padding:10px 12px;color:var(--text-muted);font-size:.8rem;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--border)}.admin-table td{padding:12px;border-bottom:1px solid var(--border)}.admin-table tbody tr:hover{background:var(--bg-card-2)}@media(max-width:900px){.admin-main{margin-left:0;padding:20px 16px}}`}</style>;
}
