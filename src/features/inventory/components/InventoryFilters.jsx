import React from 'react';

export default function InventoryFilters({
  categories,
  selectedCategory,
  setSelectedCategory,
  lowStockOnly,
  setLowStockOnly
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-4 py-3">
      <div className="flex flex-col lg:flex-row items-center gap-3">
        {/* Lọc danh mục */}
        <select
          className="bg-slate-50 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg py-2 pl-3 pr-10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Theo nhóm: Tất cả</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Toggle sắt góc phải */}
        <div className="ml-auto flex bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
          <button
            onClick={() => setLowStockOnly(false)}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${!lowStockOnly ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setLowStockOnly(true)}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${lowStockOnly ? "bg-white text-red-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Tồn thấp
          </button>
        </div>
      </div>
    </div>
  );
}
