import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [tableId, setTableId] = useState('');
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [notes, setNotes] = useState('');

  const handleTableIdChange = (e) => {
    setTableId(e.target.value.toUpperCase());
  };

  const handlePlaceOrder = async () => {
    if (!user) return toast.error('Please login to place an order');
    if (!tableId.trim()) return toast.error('Enter your Table ID (e.g. T1, T3)');

    // Validate T1, T2, T3... format
    if (!/^T\d+$/i.test(tableId.trim())) {
      return toast.error('Invalid Table ID. Use format like T1, T2, T3');
    }

    setSubmitting(true);
    try {
      const items = cartItems.map(({ _id, name, price, quantity }) => ({
        menuItem: _id,
        name,
        price,
        quantity,
      }));

      await api.post('/orders', {
        tableId: tableId.trim().toUpperCase(),
        items,
        notes,
        guestName,
        guestEmail,
      });

      toast.success('Order placed successfully! 🎉');
      clearCart();
      navigate('/order-confirmation');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartCount === 0) {
    return (
      <div className="page">
        <div className="container page-content">
          <div className="empty-state" style={{ paddingTop: '100px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛒</div>
            <h3>Your cart is empty</h3>
            <p>Browse our menu and add delicious items to your cart</p>
            <Link to="/menu" className="btn btn-primary" style={{ marginTop: '20px' }}>Browse Menu</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container page-content">
        <h1 style={{ marginBottom: '32px' }}>Your Cart</h1>
        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item card">
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <span className="cat-tag" style={{ fontSize: '0.72rem', background: 'rgba(230,126,34,0.15)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                    {item.category}
                  </span>
                </div>
                <div className="cart-item-controls">
                  <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                  <span className="qty-num">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                </div>
                <div className="cart-item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
                <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item._id)}>✕</button>
              </div>
            ))}
            <button className="btn btn-secondary btn-sm" onClick={clearCart} style={{ marginTop: '8px' }}>Clear Cart</button>
          </div>

          {/* Summary + Order */}
          <div className="cart-summary card">
            <h3 style={{ marginBottom: '20px' }}>Order Summary</h3>
            {cartItems.map((item) => (
              <div key={item._id} className="summary-row">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr className="divider" />
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>

            <div style={{ marginTop: '24px' }}>
              <div className="form-group">
                <label>Table ID * <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.78rem' }}>(e.g. T1, T2, T3)</span></label>
                <input
                  placeholder="Enter T1, T2, T3..."
                  value={tableId}
                  onChange={handleTableIdChange}
                  maxLength={6}
                  style={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}
                />
              </div>
              <div className="form-group">
                <label>Your Name</label>
                <input value={guestName} onChange={(e) => setGuestName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Email (for receipt)</label>
                <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Notes for kitchen</label>
                <textarea rows="2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. no onions, extra spicy..." />
              </div>
              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                onClick={handlePlaceOrder}
                disabled={submitting}
              >
                {submitting ? 'Placing Order...' : `Place Order — ₹${cartTotal.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cart-layout { display: grid; grid-template-columns: 1fr 380px; gap: 28px; }
        .cart-items { display: flex; flex-direction: column; gap: 14px; }
        .cart-item { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .cart-item-info { flex: 1; }
        .cart-item-info h4 { font-size: 0.95rem; margin-bottom: 4px; }
        .cart-item-controls { display: flex; align-items: center; gap: 10px; }
        .qty-btn {
          width: 32px; height: 32px; border-radius: 8px;
          background: var(--bg-card-2); border: 1px solid var(--border);
          color: var(--text-primary); font-size: 1.1rem; cursor: pointer;
          transition: var(--transition);
        }
        .qty-btn:hover { border-color: var(--primary); color: var(--primary); }
        .qty-num { font-size: 1rem; font-weight: 700; min-width: 24px; text-align: center; }
        .cart-item-price { font-size: 1rem; font-weight: 700; color: var(--primary); min-width: 80px; text-align: right; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.9rem; color: var(--text-secondary); }
        .summary-row.total { font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-top: 4px; }
        @media (max-width: 900px) { .cart-layout { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
