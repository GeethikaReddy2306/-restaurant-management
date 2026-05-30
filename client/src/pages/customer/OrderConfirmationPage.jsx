import { Link } from 'react-router-dom';

export default function OrderConfirmationPage() {
  return (
    <div className="page">
      <div className="container page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <div className="confirm-card card fade-in-up">
          <div className="confirm-icon">✅</div>
          <h1>Order Placed!</h1>
          <p>Your order has been sent to the kitchen. You'll receive a confirmation email shortly.</p>
          <div className="confirm-steps">
            <div className="step active">🧾 Order Received</div>
            <div className="step-arrow">→</div>
            <div className="step">👨‍🍳 Preparing</div>
            <div className="step-arrow">→</div>
            <div className="step">✅ Ready</div>
          </div>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px' }}>
            <Link to="/menu" className="btn btn-secondary">Order More</Link>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
          </div>
        </div>
      </div>
      <style>{`
        .confirm-card { text-align: center; max-width: 500px; padding: 48px 40px; }
        .confirm-icon { font-size: 4rem; margin-bottom: 20px; }
        .confirm-card h1 { font-size: 2rem; margin-bottom: 12px; }
        .confirm-card p { color: var(--text-secondary); line-height: 1.7; margin-bottom: 32px; }
        .confirm-steps {
          display: flex; align-items: center; justify-content: center;
          gap: 10px; flex-wrap: wrap; font-size: 0.85rem;
        }
        .step {
          padding: 8px 14px; border-radius: 20px;
          background: var(--bg-card-2); border: 1px solid var(--border);
          color: var(--text-muted);
        }
        .step.active {
          background: rgba(39,174,96,0.12);
          border-color: var(--status-available);
          color: var(--status-available); font-weight: 600;
        }
        .step-arrow { color: var(--text-muted); }
      `}</style>
    </div>
  );
}
