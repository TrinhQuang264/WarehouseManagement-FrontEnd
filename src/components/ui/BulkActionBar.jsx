import React from "react";
import { Trash2, RotateCcw, X } from "lucide-react";

export default function BulkActionBar({
  selectedCount,
  onClearSelection,
  actions = [],
  isVisible,
}) {
  if (!isVisible || selectedCount === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 min-w-[400px] border border-slate-700/50 backdrop-blur-xl bg-opacity-90">
        <div className="flex items-center gap-3 border-r border-slate-700 pr-6">
          <div className="bg-primary h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/20">
            {selectedCount}
          </div>
          <span className="text-sm font-medium text-slate-300">Đã chọn</span>
        </div>

        <div className="flex items-center gap-2 flex-1">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                action.variant === "danger"
                  ? "bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>

        <button
          onClick={onClearSelection}
          className="text-slate-500 hover:text-white transition-colors p-1"
          title="Bỏ chọn tất cả"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
