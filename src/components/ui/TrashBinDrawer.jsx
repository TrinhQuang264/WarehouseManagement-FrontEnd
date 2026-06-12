import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, RotateCcw, Trash2, Package, Search, Check } from "lucide-react";
import Button from "./Button";
import Loading from "./Loading";
import ConfirmModal from "./ConfirmModal";
import toast from "../../utils/toast";

export default function TrashBinDrawer({
  isOpen,
  onClose,
  title,
  service,
  columns = [],
  onDataChange, // Callback when data is restored or deleted
  filterItems, // Callback to filter items on client side
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchTrash = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    try {
      // Sử dụng API chuyên dụng cho thùng rác theo yêu cầu
      const response = await service.getTrash();

      let trashItems =
        response.items ||
        response.data ||
        (Array.isArray(response) ? response : []);

      // Filter items if filterItems is provided
      if (filterItems) {
        trashItems = trashItems.filter(filterItems);
      }

      // Vẫn áp dụng tìm kiếm trong thùng rác (Client-side)
      if (search) {
        const searchLower = search.toLowerCase();
        trashItems = trashItems.filter((item) => {
          const itemName =
            item.name || item.fullName || item.supplierName || item.customerName || "";
          return (
            itemName.toLowerCase().includes(searchLower) ||
            (item.code && item.code.toLowerCase().includes(searchLower)) ||
            (item.receiptCode && item.receiptCode.toLowerCase().includes(searchLower))
          );
        });
      }

      setItems(trashItems);
    } catch (error) {
      console.error("[TrashBinDrawer] Error fetching trash:", error);
      toast.error("Không thể tải danh sách thùng rác");
    } finally {
      setLoading(false);
    }
  }, [isOpen, search, service]);

  useEffect(() => {
    fetchTrash();
  }, [fetchTrash]);

  const handleRestore = async (id) => {
    try {
      await service.restore(id);
      toast.success("Đã khôi phục thành công");
      fetchTrash();
      onDataChange?.();
    } catch (error) {
      toast.error("Lỗi khi khôi phục");
    }
  };

  const handlePermanentDelete = async () => {
    try {
      if (deleteTargetId) {
        await service.permanentDelete(deleteTargetId);
        toast.success("Đã xóa vĩnh viễn");
      }
      setIsConfirmDeleteOpen(false);
      fetchTrash();
      onDataChange?.();
    } catch (error) {
      const serverMsg = error?.response?.data?.message || error?.response?.data?.Message || error?.response?.data?.error;
      toast.error(serverMsg || "Không thể xóa do dữ liệu đang được sử dụng (ràng buộc)");
    }
  };

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const drawerContent = (
    <div className="fixed inset-0 z-[1000] flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col animate-slideInRight">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white z-10">
          <div className="flex">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Trash2 className="text-red-500" size={24} />
              {title}
            </h3>
            <span className="flex items-center justify-end ml-4 pl-4 border-l border-slate-200 text-xs">
              <span className="text-sm text-slate-500">{items.length} mục</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm trong thùng rác..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-24">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <Loading />
              <p className="text-sm text-slate-500">Đang tải dữ liệu...</p>
            </div>
          ) : items.length > 0 ? (
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="group p-4 bg-white border border-slate-100 rounded-2xl hover:border-primary/30 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 truncate">
                          {idx + 1}.{" "}
                          {item.receiptCode ||
                            item.name ||
                            item.fullName ||
                            item.supplierName ||
                            item.customerName ||
                            item.code}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRestore(item.id)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Khôi phục"
                    >
                      <RotateCcw size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteTargetId(item.id);
                        setIsConfirmDeleteOpen(true);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa vĩnh viễn"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400 p-12 text-center">
              <div className="bg-slate-50 p-6 rounded-full">
                <Package size={64} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-600">
                  Thùng rác trống
                </p>
                <p className="text-sm">Mọi thứ bạn xóa sẽ xuất hiện ở đây</p>
              </div>
            </div>
          )}
        </div>

        <ConfirmModal
          isOpen={isConfirmDeleteOpen}
          onClose={() => setIsConfirmDeleteOpen(false)}
          onConfirm={handlePermanentDelete}
          title="Xóa vĩnh viễn"
          message="Bạn có chắc chắn muốn xóa vĩnh viễn mục này? Hành động này không thể hoàn tác."
          variant="danger"
          confirmText="Xóa vĩnh viễn"
        />
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}
