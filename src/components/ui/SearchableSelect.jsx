import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Package, Search, X } from "lucide-react";
import { getProductImageUrl } from "../../utils/util.js";

export default function SearchableSelect({
  options = [],
  value = "",
  onChange,
  placeholder = "Chọn...",
  searchPlaceholder = "Tìm kiếm...",
  icon = null,
  className = "",
  maxVisible = 7,
  renderOption = null,
  renderTriggerLabel = null,
  filterFn = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value),
  );

  const filteredOptions = filterFn
    ? options.filter((opt) => filterFn(opt, search))
    : options.filter((opt) =>
        String(opt.label ?? "")
          .toLowerCase()
          .includes(search.toLowerCase().trim()),
      );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => {
      if (prev) setSearch("");
      return !prev;
    });
  };

  const handleSelect = (optValue) => {
    onChange?.(optValue);
    setIsOpen(false);
    setSearch("");
  };

  const handleClearSearch = (e) => {
    e.stopPropagation();
    setSearch("");
    searchInputRef.current?.focus();
  };

  const ITEM_HEIGHT = renderOption ? 72 : 44;
  const maxHeight = maxVisible * ITEM_HEIGHT;

  return (
    <div
      ref={containerRef}
      className={`searchable-select-wrapper ${className}`}
      style={{ position: "relative" }}
    >
      <button
        type="button"
        className="searchable-select-trigger"
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {icon && <span className="searchable-select-icon">{icon}</span>}
        <span
          className={`searchable-select-value ${!selectedOption ? "searchable-select-placeholder" : ""}`}
        >
          {selectedOption
            ? renderTriggerLabel
              ? renderTriggerLabel(selectedOption)
              : selectedOption.label
            : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`searchable-select-chevron ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="searchable-select-dropdown" role="listbox">
          <div className="searchable-select-search-wrap">
            <Search size={14} className="searchable-select-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="searchable-select-search-input"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsOpen(false);
                  setSearch("");
                }
              }}
            />
            {search && (
              <button
                type="button"
                className="searchable-select-search-clear"
                onClick={handleClearSearch}
                tabIndex={-1}
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div
            className="searchable-select-list"
            style={{ maxHeight: `${maxHeight}px`, overflowY: "auto" }}
          >
            {!search && !renderOption && (
              <button
                type="button"
                role="option"
                className={`searchable-select-option searchable-select-option-empty ${!value ? "selected" : ""}`}
                onClick={() => handleSelect("")}
              >
                <span>{placeholder}</span>
                {!value && (
                  <Check size={14} className="searchable-select-check" />
                )}
              </button>
            )}

            {filteredOptions.length === 0 ? (
              <div className="searchable-select-empty">
                Không tìm thấy kết quả
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return renderOption ? (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-out-of-stock={opt.isOutOfStock ? "true" : undefined}
                    disabled={opt.isOutOfStock}
                    className={`searchable-select-option searchable-select-option-custom ${isSelected ? "selected" : ""} ${opt.isOutOfStock ? "ss-option-disabled" : ""}`}
                    onClick={() => !opt.isOutOfStock && handleSelect(opt.value)}
                  >
                    {renderOption(opt, isSelected)}
                    {isSelected && (
                      <Check
                        size={14}
                        className="searchable-select-check searchable-select-check-overlay"
                      />
                    )}
                  </button>
                ) : (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`searchable-select-option ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelect(opt.value)}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <Check size={14} className="searchable-select-check" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ProductOption({ opt, showStock = true }) {
  return (
    <div className="ss-product-option">
      <div className="ss-product-thumb">
        {opt.imageUrl ? (
          <img
            src={getProductImageUrl(opt.imageUrl)}
            alt={opt.label}
            className="ss-product-thumb-img"
          />
        ) : (
          <Package size={16} className="ss-product-thumb-fallback" />
        )}
      </div>
      <div className="ss-product-info">
        <p className="ss-product-name">{opt.label}</p>
        <span className="ss-product-meta">
          {opt.code && <span className="ss-product-sku">{opt.code}</span>}
          {opt.categoryName && (
            <span className="ss-product-category">{opt.categoryName}</span>
          )}
          {showStock && opt.stock != null && (
            <span className={`ss-product-stock ${opt.stock <= 0 ? "out" : ""}`}>
              SL: {opt.stock}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
