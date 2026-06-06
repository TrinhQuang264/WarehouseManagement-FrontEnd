import { useRef } from "react";
import { CalendarDays } from "lucide-react";

const DATE_RANGE_OPTIONS = [
  { value: "all", label: "Toàn bộ" },
  { value: "last7", label: "7 ngày qua" },
  { value: "last14", label: "14 ngày qua" },
  { value: "month", label: "Tháng này" },
];

export default function ReceiptFilters({
  entities,
  entityLabel,
  entityValue,
  onEntityChange,
  entityOptionLabel,
  statusOptions,
  selectedStatus,
  setSelectedStatus,
  selectedDateRange,
  setSelectedDateRange,
}) {
  const dateInputRef = useRef(null);

  return (
    <div className="imports-filters-bar">
      <div className="imports-range-group">
        <div className="imports-range-pills">
          {DATE_RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedDateRange(option.value)}
              className={`imports-range-pill ${selectedDateRange === option.value ? "imports-range-pill-active" : ""}`}
            >
              {option.label}
            </button>
          ))}

          <div className="imports-custom-date-picker">
            <input
              ref={dateInputRef}
              type="date"
              id="import-date"
              name="importDate"
              aria-label="Chọn ngày nhập"
              value={
                selectedDateRange.startsWith("date:")
                  ? selectedDateRange.replace("date:", "")
                  : ""
              }
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDateRange(`date:${e.target.value}`);
                } else {
                  setSelectedDateRange("all");
                }
              }}
              style={{
                position: "absolute",
                opacity: 0,
                width: 0,
                height: 0,
                pointerEvents: "none",
              }}
            />

            {selectedDateRange.startsWith("date:") ? (
              <div
                className="imports-range-pill imports-range-pill-active"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  cursor: "pointer",
                }}
                onClick={() => dateInputRef.current?.showPicker()}
              >
                <CalendarDays size={14} />
                <span>{selectedDateRange.replace("date:", "")}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDateRange("all");
                  }}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontWeight: "bold",
                    lineHeight: 1,
                    padding: 0,
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="imports-range-pill imports-datepicker-button"
                onClick={() => dateInputRef.current?.showPicker()}
              >
                <CalendarDays size={14} />
                <span>Chọn ngày</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="imports-select-group">
        <select
          className="imports-select"
          value={entityValue}
          onChange={(event) => onEntityChange(event.target.value)}
        >
          <option value="all">{entityLabel}</option>
          {entities.map((entity) => (
            <option key={entity.id} value={entity.id}>
              {entityOptionLabel(entity)}
            </option>
          ))}
        </select>

        <select
          className="imports-select"
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value)}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
