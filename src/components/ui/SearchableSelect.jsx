import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

/**
 * SearchableSelect - Dropdown tùy chỉnh với ô tìm kiếm tích hợp
 *
 * Props:
 *  - options: [{ value, label }]
 *  - value: giá trị đang chọn (string | number)
 *  - onChange: (value) => void
 *  - placeholder: string – text hiển thị khi chưa chọn
 *  - searchPlaceholder: string – placeholder cho ô tìm kiếm
 *  - icon: ReactNode – icon hiển thị bên trái trigger
 *  - className: string – class bổ sung cho wrapper
 *  - maxVisible: number – số item hiển thị trước khi scroll (mặc định 7)
 */
export default function SearchableSelect({
  options = [],
  value = "",
  onChange,
  placeholder = "Chọn...",
  searchPlaceholder = "Tìm kiếm...",
  icon = null,
  className = "",
  maxVisible = 7,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Lấy label của item đang được chọn
  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value),
  );

  // Lọc danh sách theo từ khóa tìm kiếm
  const filteredOptions = options.filter((opt) =>
    String(opt.label ?? "")
      .toLowerCase()
      .includes(search.toLowerCase().trim()),
  );

  // Đóng dropdown khi click ra ngoài
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

  // Focus vào ô tìm kiếm khi mở dropdown
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

  // Chiều cao tối đa của list: 7 item × ~44px/item
  const ITEM_HEIGHT = 44;
  const maxHeight = maxVisible * ITEM_HEIGHT;

  return (
    <div
      ref={containerRef}
      className={`searchable-select-wrapper ${className}`}
      style={{ position: "relative" }}
    >
      {/* Trigger button */}
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
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`searchable-select-chevron ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="searchable-select-dropdown" role="listbox">
          {/* Ô tìm kiếm */}
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

          {/* Danh sách options */}
          <div
            className="searchable-select-list"
            style={{ maxHeight: `${maxHeight}px`, overflowY: "auto" }}
          >
            {/* Option "không chọn" */}
            {!search && (
              <button
                type="button"
                role="option"
                className={`searchable-select-option searchable-select-option-empty ${!value ? "selected" : ""}`}
                onClick={() => handleSelect("")}
              >
                <span>{placeholder}</span>
                {!value && <Check size={14} className="searchable-select-check" />}
              </button>
            )}

            {filteredOptions.length === 0 ? (
              <div className="searchable-select-empty">Không tìm thấy kết quả</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
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
