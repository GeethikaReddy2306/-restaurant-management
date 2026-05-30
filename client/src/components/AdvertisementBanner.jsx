import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdvertisementBanner() {
  const [ads, setAds] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    api.get('/advertisements').then((res) => setAds(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (ads.length <= 1) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % ads.length), 5000);
    return () => clearInterval(timer);
  }, [ads.length]);

  if (!ads.length) return null;

  const ad = ads[current];

  return (
    <div className="ad-banner">
      <div className="ad-content">
        {ad.imageUrl && <img src={ad.imageUrl} alt={ad.title} className="ad-img" />}
        <div className="ad-text">
          <h3>{ad.title}</h3>
          <p>{ad.description}</p>
          {ad.linkUrl && <a href={ad.linkUrl} className="btn btn-primary btn-sm">Learn More</a>}
        </div>
      </div>
      {ads.length > 1 && (
        <div className="ad-dots">
          {ads.map((_, i) => (
            <button key={i} className={`dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} />
          ))}
        </div>
      )}
      <style>{`
        .ad-banner {
          background: linear-gradient(135deg, var(--bg-card-2), var(--bg-card));
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          position: relative;
        }
        .ad-content {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 28px 32px;
          min-height: 140px;
        }
        .ad-img {
          width: 120px;
          height: 100px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          flex-shrink: 0;
        }
        .ad-text h3 { font-size: 1.2rem; margin-bottom: 8px; }
        .ad-text p { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 14px; }
        .ad-dots {
          display: flex;
          gap: 8px;
          justify-content: center;
          padding: 12px;
          border-top: 1px solid var(--border);
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--border);
          cursor: pointer;
          transition: var(--transition);
        }
        .dot.active { background: var(--primary); transform: scale(1.3); }
        @media (max-width: 600px) {
          .ad-content { flex-direction: column; text-align: center; }
          .ad-img { width: 100%; height: 140px; }
        }
      `}</style>
    </div>
  );
}
