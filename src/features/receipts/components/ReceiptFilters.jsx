import { CalendarDays, SlidersHorizontal } from 'lucide-react';

const DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'Toàn bộ' },
  { value: 'last7', label: '7 ngày qua' },
  { value: 'last14', label: '14 ngày qua' },
  { value: 'month', label: 'Tháng này' },
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
  return (
    <div className="imports-filters-bar">
      <div className="imports-range-group">
        <CalendarDays size={18} className="text-slate-400" />
        <div className="imports-range-pills">
          {DATE_RANGE_OPTIONS.map((option) => (
            <button key={option.value} type="button" onClick={() => setSelectedDateRange(option.value)} className={`imports-range-pill ${selectedDateRange === option.value ? 'imports-range-pill-active' : ''}`}>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="imports-select-group">
        <select className="imports-select" value={entityValue} onChange={(event) => onEntityChange(event.target.value)}>
          <option value="all">{entityLabel}</option>
          {entities.map((entity) => (
            <option key={entity.id} value={entity.id}>
              {entityOptionLabel(entity)}
            </option>
          ))}
        </select>

        <select className="imports-select" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button type="button" className="imports-advanced-filter">
        <SlidersHorizontal size={18} />
        Bộ lọc nâng cao
      </button>
    </div>
  );
}
