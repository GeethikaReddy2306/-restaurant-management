import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const emptyAd = { title: '', description: '', imageUrl: '', linkUrl: '', active: true, order: 0 };

export default function AdvertisementPage() {
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState(emptyAd);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchAds = () => {
    api.get('/advertisements?all=true').then((res) => setAds(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAds(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        await api.put(`/advertisements/${editId}`, form);
        toast.success('Advertisement updated!');
      } else {
        await api.post('/advertisements', form);
        toast.success('Advertisement created!');
      }
      setForm(emptyAd);
      setEditId(null);
      fetchAds();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (ad) => {
    setForm({ title: ad.title, description: ad.description, imageUrl: ad.imageUrl, linkUrl: ad.linkUrl, active: ad.active, order: ad.order });
    setEditId(ad._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this advertisement?')) return;
    try {
      await api.delete(`/advertisements/${id}`);
      setAds((prev) => prev.filter((a) => a._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  const handleToggle = async (ad) => {
    try {
      await api.put(`/advertisements/${ad._id}`, { active: !ad.active });
      setAds((prev) => prev.map((a) => a._id === ad._id ? { ...a, active: !a.active } : a));
    } catch { toast.error('Toggle failed'); }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header"><h1>Advertisements</h1><p>Manage promotional banners on the landing page</p></div>

        <div className="ad-layout">
          {/* Form */}
          <div className="card">
            <h3 style={{ marginBottom: '20px' }}>{editId ? '✏️ Edit' : '➕ New'} Advertisement</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="form-group"><label>Description</label><textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="form-group"><label>Image URL</label><input placeholder="https://..." value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></div>
              <div className="form-group"><label>Link URL</label><input placeholder="https://..." value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} /></div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} style={{ width: 'auto' }} />
                  Active
                </label>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : editId ? 'Update' : 'Create'}</button>
                {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setForm(emptyAd); }}>Cancel</button>}
              </div>
            </form>
          </div>

          {/* List */}
          <div>
            {loading ? <div className="loading"><div className="spinner" /></div> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {ads.map((ad) => (
                  <div key={ad._id} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    {ad.imageUrl && <img src={ad.imageUrl} alt={ad.title} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h4 style={{ fontSize: '0.95rem' }}>{ad.title}</h4>
                        <span className={`badge ${ad.active ? 'badge-available' : 'badge-occupied'}`}>{ad.active ? 'Active' : 'Inactive'}</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>{ad.description}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleToggle(ad)}>{ad.active ? 'Deactivate' : 'Activate'}</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(ad)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ad._id)}>Delete</button>
                    </div>
                  </div>
                ))}
                {ads.length === 0 && <div className="empty-state"><h3>No advertisements yet</h3></div>}
              </div>
            )}
          </div>
        </div>
      </main>
      <style>{`.admin-layout{display:flex;min-height:100vh}.admin-main{margin-left:240px;flex:1;padding:40px 32px}.admin-header{margin-bottom:32px}.admin-header h1{font-size:2rem}.admin-header p{color:var(--text-secondary);margin-top:4px}.ad-layout{display:grid;grid-template-columns:380px 1fr;gap:28px}@media(max-width:960px){.ad-layout{grid-template-columns:1fr}}@media(max-width:900px){.admin-main{margin-left:0;padding:20px 16px}}`}</style>
    </div>
  );
}
