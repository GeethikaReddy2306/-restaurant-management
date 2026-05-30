import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">🍽️ La Maison</div>
            <p>Fine dining experience crafted with passion. Reserve your table and explore our carefully curated menu.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/book">Reservations</Link></li>
              <li><Link to="/cart">Cart</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Hours</h4>
            <ul>
              <li>Mon – Fri: 11am – 11pm</li>
              <li>Sat – Sun: 10am – 12am</li>
              <li>Holidays: 12pm – 10pm</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <li>📍 123 Restaurant Street</li>
              <li>📞 +91 98765 43210</li>
              <li>✉️ hello@lamaison.com</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 La Maison Restaurant. All rights reserved.</p>
          <p>Built with ❤️ for food lovers.</p>
        </div>
      </div>
      <style>{`
        .footer {
          background: var(--bg-card);
          border-top: 1px solid var(--border);
          padding: 60px 0 0;
          margin-top: auto;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          padding-bottom: 40px;
        }
        .footer-logo {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 12px;
        }
        .footer-brand p { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.7; }
        .footer-section h4 {
          font-size: 0.88rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--primary);
          margin-bottom: 16px;
        }
        .footer-section ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .footer-section ul li,
        .footer-section ul li a {
          color: var(--text-secondary);
          font-size: 0.9rem;
          transition: var(--transition);
        }
        .footer-section ul li a:hover { color: var(--primary); }
        .footer-bottom {
          border-top: 1px solid var(--border);
          padding: 20px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 30px; }
          .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  );
}
