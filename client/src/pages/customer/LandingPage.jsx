import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdvertisementBanner from '../../components/AdvertisementBanner';
import api from '../../api/axios';

export default function LandingPage() {
  const [stats, setStats] = useState({ tables: 0, menu: 0 });

  useEffect(() => {
    Promise.all([api.get('/tables'), api.get('/menu')])
      .then(([t, m]) => setStats({ tables: t.data.length, menu: m.data.length }))
      .catch(() => {});
  }, []);

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg" />
        <div className="container hero-content fade-in-up">
          <div className="hero-badge">🌟 Award-Winning Fine Dining</div>
          <h1 className="hero-title">
            Experience the Art of<br />
            <span className="gradient-text">Exquisite Dining</span>
          </h1>
          <p className="hero-subtitle">
            From farm-fresh ingredients to expertly curated dishes, La Maison offers an unforgettable culinary journey for every occasion.
          </p>
          <div className="hero-actions">
            <Link to="/book" className="btn btn-primary btn-lg">Reserve a Table</Link>
            <Link to="/menu" className="btn btn-secondary btn-lg">Explore Menu</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><span>{stats.tables || '20'}+</span><p>Tables</p></div>
            <div className="stat"><span>{stats.menu || '50'}+</span><p>Dishes</p></div>
            <div className="stat"><span>10+</span><p>Years</p></div>
            <div className="stat"><span>4.9★</span><p>Rating</p></div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="section section-info">
        <div className="container">
          <h2 className="section-title">Why Dine with Us?</h2>
          <div className="grid-3">
            {[
              { icon: '🍷', title: 'Premium Ambience', desc: 'An elegant atmosphere designed for intimate dinners, celebrations, and business gatherings.' },
              { icon: '👨‍🍳', title: 'Expert Chefs', desc: 'Our team of internationally trained chefs craft each dish with precision and passion.' },
              { icon: '🌿', title: 'Fresh Ingredients', desc: 'Locally sourced, seasonal ingredients ensuring the freshest and most flavorful meals.' },
            ].map((item) => (
              <div key={item.title} className="info-card card fade-in-up">
                <div className="info-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Banner */}
      <section className="section-sm">
        <div className="container">
          <h2 className="section-title">Current Offers</h2>
          <AdvertisementBanner />
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to Book Your Table?</h2>
            <p>Join hundreds of happy guests who make La Maison their go-to dining destination.</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/book" className="btn btn-primary btn-lg">Book Now</Link>
              <Link to="/menu" className="btn btn-secondary btn-lg">View Menu</Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 80% at 50% -10%, rgba(230,126,34,0.25) 0%, transparent 60%),
                      radial-gradient(ellipse 60% 60% at 80% 90%, rgba(211,84,0,0.15) 0%, transparent 60%);
          pointer-events: none;
        }
        .hero-content { position: relative; text-align: center; padding: 100px 0 60px; }
        .hero-badge {
          display: inline-block;
          background: rgba(230,126,34,0.15);
          border: 1px solid rgba(230,126,34,0.35);
          color: var(--primary);
          padding: 6px 18px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 24px;
        }
        .hero-title {
          font-size: clamp(2.2rem, 5vw, 4rem);
          margin-bottom: 20px;
          line-height: 1.1;
        }
        .gradient-text {
          background: linear-gradient(135deg, var(--primary-light), var(--primary), #c0392b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
          max-width: 580px;
          margin: 0 auto 36px;
          line-height: 1.8;
        }
        .hero-actions { display: flex; gap: 16px; justify-content: center; margin-bottom: 60px; flex-wrap: wrap; }
        .hero-stats {
          display: flex;
          gap: 48px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .stat span { display: block; font-size: 2rem; font-weight: 800; color: var(--primary); }
        .stat p { color: var(--text-secondary); font-size: 0.88rem; }
        .section-title { font-size: 1.8rem; text-align: center; margin-bottom: 40px; }
        .section-title::after {
          content: '';
          display: block;
          width: 50px;
          height: 3px;
          background: var(--primary);
          border-radius: 2px;
          margin: 12px auto 0;
        }
        .section-info { background: var(--bg-card); }
        .info-card { text-align: center; }
        .info-icon { font-size: 2.5rem; margin-bottom: 16px; }
        .info-card h3 { font-size: 1.1rem; margin-bottom: 10px; }
        .info-card p { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.7; }
        .cta-section { background: var(--bg-card); }
        .cta-card {
          background: linear-gradient(135deg, rgba(230,126,34,0.12), rgba(211,84,0,0.08));
          border: 1px solid rgba(230,126,34,0.3);
          border-radius: var(--radius-lg);
          padding: 60px 40px;
          text-align: center;
        }
        .cta-card h2 { font-size: 2rem; margin-bottom: 12px; }
        .cta-card p { color: var(--text-secondary); margin-bottom: 30px; font-size: 1rem; }
      `}</style>
    </div>
  );
}
