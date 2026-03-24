export default function ReceiptStats({ stats, config }) {
  return (
    <div className="imports-stats-grid">
      {config.map(({ key, label, icon: Icon, iconClassName, formatter }) => (
        <div key={key} className="imports-stat-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="imports-stat-label">{label}</p>
              <p className="imports-stat-value">{formatter(stats[key])}</p>
            </div>
            <div className={`imports-stat-icon ${iconClassName}`}>
              <Icon size={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
