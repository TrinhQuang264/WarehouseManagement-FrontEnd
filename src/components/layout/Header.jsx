import { useEffect, useState, useRef } from "react";
import { useHeader } from "../../contexts/HeaderContext";
import SearchBar from "../ui/SearchBar";
import Button from "../ui/Button";

export default function Header() {
  const {
    searchValue,
    setSearchValue,
    actionButton,
    extraActions = [],
    onSearch,
    title,
    subtitle,
  } = useHeader();

  // Local state for the input UI to handle debouncing
  const [localSearch, setLocalSearch] = useState(searchValue);
  const debounceTimerRef = useRef(null);

  // Sync local state when external searchValue changes (e.g. page reset)
  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  // Handle 1000ms debounce
  const handleSearchChange = (value) => {
    setLocalSearch(value);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for instant response
    debounceTimerRef.current = setTimeout(() => {
      setSearchValue(value);
      if (onSearch) {
        onSearch(value);
      }
    }, 50); // Almost instant
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          {title && (
            <div className="header-title-block">
              <h1 className="header-title">{title}</h1>
              {subtitle && <p className="header-subtitle">{subtitle}</p>}
            </div>
          )}

          {onSearch && (
            <div className="header-search">
              <SearchBar
                value={localSearch}
                onChange={handleSearchChange}
                placeholder={actionButton?.searchPlaceholder || "Tìm kiếm..."}
                className="w-full"
              />
            </div>
          )}
        </div>

        <div className="header-actions flex items-center gap-3">
          {extraActions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              icon={action.icon}
              className={action.className || "bg-slate-100 text-slate-600 hover:bg-slate-200"}
            >
              {action.label}
            </Button>
          ))}

          {actionButton && (
            <div className="header-action">
              {actionButton.render ? (
                actionButton.render()
              ) : (
                <Button
                  onClick={actionButton.onClick}
                  icon={actionButton.icon}
                  className={
                    actionButton.className ||
                    "shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                  }
                >
                  {actionButton.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
