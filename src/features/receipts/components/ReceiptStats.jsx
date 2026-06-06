export default function ReceiptStats({ stats, config }) {
  return (
    <div className="imports-stats-grid">
      {config.map(({ key, label, icon: Icon, iconClassName, formatter }) => (
        <div key={key} className="imports-stat-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              {Icon && (
                <div className={`imports-stat-icon ${iconClassName || ""}`}>
                  <Icon size={14} />
                </div>
              )}
              <p className="imports-stat-label">{label}</p>
            </div>
            <p
              className="imports-stat-value"
              title={
                stats?.[key] !== undefined
                  ? key === "totalValue"
                    ? Number(stats[key]).toLocaleString("vi-VN") + "đ"
                    : Number(stats[key]).toLocaleString("vi-VN")
                  : ""
              }
            >
              {stats?.[key] !== undefined ? formatter(stats[key]) : "—"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
