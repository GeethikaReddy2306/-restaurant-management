const STATUS_MAP = {
  Available: { color: 'var(--status-available)', bg: 'rgba(39,174,96,0.12)', label: 'Available' },
  Reserved:  { color: 'var(--status-reserved)',  bg: 'rgba(241,196,15,0.12)', label: 'Reserved' },
  Occupied:  { color: 'var(--status-occupied)',  bg: 'rgba(231,76,60,0.12)',  label: 'Occupied' },
  Cleaning:  { color: 'var(--status-cleaning)',  bg: 'rgba(52,152,219,0.12)', label: 'Cleaning' },
};

export default function TableLayoutGrid({ tables, onSelect, selectedId }) {
  return (
    <div className="table-grid-wrap">
      <div className="table-legend">
        {Object.entries(STATUS_MAP).map(([status, { color, label }]) => (
          <div key={status} className="legend-item">
            <span className="legend-dot" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>
      <div className="table-floor-grid">
        {tables.map((table) => {
          const s = STATUS_MAP[table.status] || STATUS_MAP.Available;
          const isSelected = selectedId === table._id;
          const isAvailable = table.status === 'Available';
          return (
            <button
              key={table._id}
              className={`table-card-floor ${isSelected ? 'selected' : ''} ${!isAvailable ? 'unavailable' : ''}`}
              style={{ '--t-color': s.color, '--t-bg': s.bg }}
              onClick={() => isAvailable && onSelect && onSelect(table)}
              title={`Table ${table.tableNumber} — ${table.status}`}
            >
              <div className="table-icon">🪑</div>
              <div className="table-num">T{table.tableNumber}</div>
              <div className="table-seats">{table.capacity} seats</div>
              <div className="table-status-dot" style={{ background: s.color }} />
            </button>
          );
        })}
      </div>
      {tables.length === 0 && (
        <div className="empty-state"><p>No tables found. Admin can add tables.</p></div>
      )}
      <style>{`
        .table-grid-wrap { }
        .table-legend {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 20px;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .legend-item { display: flex; align-items: center; gap: 6px; }
        .legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }

        .table-floor-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 14px;
        }
        .table-card-floor {
          background: var(--t-bg, var(--bg-card-2));
          border: 2px solid var(--t-color, var(--border));
          border-radius: var(--radius);
          padding: 16px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          transition: var(--transition);
          position: relative;
          font-family: inherit;
        }
        .table-card-floor:hover:not(.unavailable) {
          transform: translateY(-3px);
          box-shadow: 0 0 0 3px var(--t-color), var(--shadow-md);
        }
        .table-card-floor.selected {
          box-shadow: 0 0 0 3px var(--t-color), var(--shadow-lg);
          transform: translateY(-3px);
        }
        .table-card-floor.unavailable { cursor: not-allowed; opacity: 0.7; }
        .table-icon { font-size: 1.6rem; }
        .table-num { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); }
        .table-seats { font-size: 0.75rem; color: var(--text-secondary); }
        .table-status-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}
