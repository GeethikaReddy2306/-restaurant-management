import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import TableLayoutGrid from '../../components/TableLayoutGrid';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

export default function TableBookingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    arrivalTime: '', partySize: 2, specialRequests: '',
    guestName: user?.name || '', guestEmail: user?.email || '', guestPhone: '',
  });

  useEffect(() => {
    api.get('/tables').then((res) => setTables(res.data)).finally(() => setLoading(false));

    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');
    socket.on('table:statusUpdated', (updated) => {
      setTables((prev) => prev.map((t) => t._id === updated._id ? updated : t));
    });
    socket.on('table:deleted', (id) => {
      setTables((prev) => prev.filter((t) => t._id !== id));
    });
    return () => socket.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTable) return toast.error('Please select a table first');
    if (!user) return navigate('/admin/login');
    if (!form.arrivalTime) return toast.error('Please select an arrival time');

    setSubmitting(true);
    try {
      await api.post('/reservations', { tableId: selectedTable._id, ...form });
      toast.success('Table reserved! Check your email for confirmation.');
      navigate('/menu');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="container page-content">
        <div className="book-header">
          <h1>Reserve a Table</h1>
          <p className="subtitle">Select your preferred table and arrival time</p>
        </div>

        <div className="book-grid">
          {/* Table Layout */}
          <div className="book-left">
            <div className="card">
              <h3 style={{ marginBottom: '20px' }}>🪑 Floor Layout</h3>
              {loading ? (
                <div className="loading"><div className="spinner" /></div>
              ) : (
                <TableLayoutGrid tables={tables} onSelect={setSelectedTable} selectedId={selectedTable?._id} />
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="book-right">
            <div className="card">
              <h3 style={{ marginBottom: '20px' }}>📋 Booking Details</h3>
              {selectedTable ? (
                <div className="selected-table-info">
                  <span>✅ Table {selectedTable.tableNumber} selected</span>
                  <span className="badge badge-available">{selectedTable.capacity} seats</span>
                </div>
              ) : (
                <p className="book-hint">👈 Click an available table on the floor plan</p>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Guest Name *</label>
                  <input value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" value={form.guestEmail} onChange={(e) => setForm({ ...form, guestEmail: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input value={form.guestPhone} onChange={(e) => setForm({ ...form, guestPhone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Arrival Date & Time *</label>
                  <input type="datetime-local" value={form.arrivalTime} onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Party Size *</label>
                  <input type="number" min="1" max={selectedTable?.capacity || 20} value={form.partySize} onChange={(e) => setForm({ ...form, partySize: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Special Requests</label>
                  <textarea rows="3" value={form.specialRequests} onChange={(e) => setForm({ ...form, specialRequests: e.target.value })} placeholder="Any dietary restrictions or special needs?" />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={submitting}>
                  {submitting ? 'Booking...' : 'Confirm Reservation'}
                </button>
                {!user && <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '12px', textAlign: 'center' }}>
                  <Link to="/admin/login">Login</Link> to complete your reservation
                </p>}
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .book-header { margin-bottom: 36px; }
        .book-header h1 { font-size: 2.2rem; }
        .book-grid { display: grid; grid-template-columns: 1fr 400px; gap: 28px; }
        .selected-table-info {
          display: flex; align-items: center; gap: 10px;
          background: rgba(39,174,96,0.1); border: 1px solid var(--status-available);
          border-radius: var(--radius-sm); padding: 10px 14px;
          margin-bottom: 20px; font-size: 0.9rem; font-weight: 600;
          color: var(--status-available);
        }
        .book-hint {
          color: var(--text-muted); font-size: 0.88rem;
          padding: 12px; background: var(--bg-card-2);
          border-radius: var(--radius-sm); margin-bottom: 20px;
          text-align: center;
        }
        @media (max-width: 900px) {
          .book-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
