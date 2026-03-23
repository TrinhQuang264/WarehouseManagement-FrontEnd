import { Filter, FileDown } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function ProductsSearchFilter({
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onResetFilters
}) {
  return (
    <div className="search-filter-bar">
      <div className="flex flex-col lg:flex-row items-center gap-5">
        {/* Lọc theo giá tiền */}
        <div className="price-filter-group">
          <div className="price-input-wrapper">
            <span className="price-input-label">Min</span>
            <input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="price-input"
            />
          </div>
          <div className="w-2 h-[1px] bg-slate-300 dark:bg-slate-600"></div>
          <div className="price-input-wrapper">
            <span className="price-input-label">Max</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="price-input !w-32"
            />
          </div>
        </div>

        {/* Nút lọc mở rộng & Xuất file */}
        <div className="flex items-center gap-3 w-full lg:w-auto lg:ml-auto">
          <Button variant="secondary" icon={<Filter size={18} className="text-slate-500" />}>
            Bộ lọc nâng cao
          </Button>
          <Button 
            variant="secondary" 
            onClick={onResetFilters}
            title="Làm mới bộ lọc"
          >
            Đặt lại
          </Button>
          <Button variant="secondary" icon={<FileDown size={18} className="text-slate-500" />}>
            Xuất Excel
          </Button>
        </div>
      </div>
    </div>
  );
}
