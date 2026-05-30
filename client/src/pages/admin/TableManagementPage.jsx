import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const STATUSES = ['Available', 'Reserved', 'Occupied', 'Cleaning'];

export default function TableManagementPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ tableNumber: '', capacity: '', location: 'Main Floor' });
  const [submitting, setSubmitting] = useState(false);

  const fetchTables = () => {
    api.get('/tables').then((res) => setTables(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchTables(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/tables', form);
      toast.success('Table added!');
      setForm({ tableNumber: '', capacity: '', location: 'Main Floor' });
      fetchTables();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add table');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/tables/${id}`, { status });
      setTables((prev) => prev.map((t) => t._id === id ? { ...t, status } : t));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this table?')) return;
    try {
      await api.delete(`/tables/${id}`);
      setTables((prev) => prev.filter((t) => t._id !== id));
      toast.success('Table deleted');
    } catch { toast.error('Delete failed'); }
  };

  const statusColors = { Available: 'badge-available', Reserved: 'badge-reserved', Occupied: 'badge-occupied', Cleaning: 'badge-cleaning' };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header"><h1>Table Management</h1><p>Add, remove, and update table statuses</p></div>

        {/* Add Table Form */}
        <div className="card" style={{ marginBottom: '28px' }}>
          <h3 style={{ marginBottom: '20px' }}>➕ Add New Table</h3>
          <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Table Number *</label>
              <input type="number" placeholder="e.g. 1" value={form.tableNumber} onChange={(e) => setForm({ ...form, tableNumber: e.target.value })} required />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Capacity *</label>
              <input type="number" placeholder="e.g. 4" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Location</label>
              <input placeholder="Main Floor" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Adding...' : 'Add Table'}</button>
          </form>
        </div>

        {/* Tables Grid */}
        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : (
          <div className="grid-auto">
            {tables.map((table) => (
              <div key={table._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem' }}>Table {table.tableNumber}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{table.capacity} seats · {table.location}</p>
                  </div>
                  <span className={`badge ${statusColors[table.status]}`}>{table.status}</span>
                </div>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label>Change Status</label>
                  <select value={table.status} onChange={(e) => handleStatusChange(table._id, e.target.value)}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <button className="btn btn-danger btn-sm" style={{ width: '100%' }} onClick={() => handleDelete(table._id)}>Delete Table</button>
              </div>
            ))}
            {tables.length === 0 && <div className="empty-state"><h3>No tables yet</h3><p>Add your first table above</p></div>}
          </div>
        )}
      </main>
      <AdminLayoutStyle />
    </div>
  );
}

function AdminLayoutStyle() {
  return <style>{`
    .admin-layout { display: flex; min-height: 100vh; }
    .admin-main { margin-left: 240px; flex: 1; padding: 40px 32px; }
    .admin-header { margin-bottom: 32px; }
    .admin-header h1 { font-size: 2rem; }
    .admin-header p { color: var(--text-secondary); margin-top: 4px; }
    @media (max-width: 900px) { .admin-main { margin-left: 0; padding: 20px 16px; } }
  `}</style>;
}
