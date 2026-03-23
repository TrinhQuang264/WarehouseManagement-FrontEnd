import { Bell, HelpCircle, Search } from 'lucide-react';
import { useHeader } from '../../contexts/HeaderContext';
import SearchBar from '../ui/SearchBar';
import Button from '../ui/Button';

export default function Header() {
  const { searchValue, setSearchValue, actionButton, onSearch, title, subtitle } = useHeader();

  const handleSearchChange = (value) => {
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        {title && (
          <div className="header-title-block">
            <h1 className="header-title">{title}</h1>
          </div>
        )}

        {!title && actionButton && (
          <div className="header-search">
            <SearchBar
              value={searchValue}
              onChange={handleSearchChange}
              placeholder={actionButton.searchPlaceholder || "Tìm kiếm..."}
              className="w-full md:w-80"
            />
          </div>
        )}

        {actionButton && (
          <div className="header-action">
            {actionButton.render ? (
              actionButton.render()
            ) : (
              <Button
                onClick={actionButton.onClick}
                icon={actionButton.icon}
                className={actionButton.className || "shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"}
              >
                {actionButton.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
