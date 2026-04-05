import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, RotateCcw, Trash2, Package, Search, Check } from 'lucide-react';
import Button from './Button';
import Loading from './Loading';
import BulkActionBar from './BulkActionBar';
import ConfirmModal from './ConfirmModal';
import toast from '../../utils/toast';

export default function TrashBinDrawer({
  isOpen,
  onClose,
  title,
  service,
  columns = [],
  onDataChange, // Callback when data is restored or deleted
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null); // null means bulk delete

  const fetchTrash = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    try {
      // Sử dụng API chuyên dụng cho thùng rác theo yêu cầu
      const response = await service.getTrash();
      
      let trashItems = response.items || response.data || (Array.isArray(response) ? response : []);

      // Vẫn áp dụng tìm kiếm trong thùng rác (Client-side)
      if (search) {
        const searchLower = search.toLowerCase();
        trashItems = trashItems.filter(item => 
          (item.name && item.name.toLowerCase().includes(searchLower)) || 
          (item.code && item.code.toLowerCase().includes(searchLower))
        );
      }
      
      setItems(trashItems);
    } catch (error) {
      console.error('[TrashBinDrawer] Error fetching trash:', error);
      toast.error('Không thể tải danh sách thùng rác');
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
      toast.success('Đã khôi phục thành công');
      fetchTrash();
      onDataChange?.();
    } catch (error) {
      toast.error('Lỗi khi khôi phục');
    }
  };

  const handleBulkRestore = async () => {
    if (selectedIds.length === 0) return;
    try {
      await service.bulkRestore(selectedIds);
      toast.success(`Đã khôi phục ${selectedIds.length} mục`);
      setSelectedIds([]);
      fetchTrash();
      onDataChange?.();
    } catch (error) {
      toast.error('Lỗi khi khôi phục hàng loạt');
    }
  };

  const handlePermanentDelete = async () => {
    try {
      if (deleteTargetId) {
        await service.permanentDelete(deleteTargetId);
        toast.success('Đã xóa vĩnh viễn');
      } else {
        await service.bulkPermanentDelete(selectedIds);
        toast.success(`Đã xóa vĩnh viễn ${selectedIds.length} mục`);
        setSelectedIds([]);
      }
      setIsConfirmDeleteOpen(false);
      fetchTrash();
      onDataChange?.();
    } catch (error) {
      toast.error('Lỗi khi xóa vĩnh viễn');
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map(item => item.id));
    }
  };

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
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
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 shadow-2xl h-full flex flex-col animate-slideInRight">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-slate-900 z-10">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trash2 className="text-red-500" size={24} />
              {title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Tìm kiếm trong thùng rác..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                    checked={items.length > 0 && selectedIds.length === items.length}
                    onChange={toggleSelectAll}
                  />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Chọn tất cả</span>
                </div>
                <span className="text-sm text-slate-500">{items.length} mục</span>
              </div>

              {items.map((item) => (
                <div 
                  key={item.id}
                  className={`group p-4 bg-white dark:bg-slate-800 border ${selectedIds.includes(item.id) ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800'} rounded-2xl hover:border-primary/30 transition-all flex items-center justify-between gap-4`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <input 
                      type="checkbox"
                      className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 dark:text-white truncate">
                          {item.name || item.code}
                        </span>
                        {item.code && item.name && (
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                            {item.code}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        {columns.map((col, idx) => (
                          <span key={idx} className="flex items-center gap-1">
                            {col.label}: <strong className="text-slate-700 dark:text-slate-300">{item[col.key]}</strong>
                          </span>
                        ))}
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
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-full">
                <Package size={64} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-600 dark:text-slate-300">Thùng rác trống</p>
                <p className="text-sm">Mọi thứ bạn xóa sẽ xuất hiện ở đây</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions for bulk */}
        <BulkActionBar
          selectedCount={selectedIds.length}
          isVisible={selectedIds.length > 0}
          onClearSelection={() => setSelectedIds([])}
          actions={[
            {
              label: "Khôi phục",
              icon: <RotateCcw size={16} />,
              onClick: handleBulkRestore,
            },
            {
              label: "Xóa vĩnh viễn",
              icon: <Trash2 size={16} />,
              onClick: () => {
                setDeleteTargetId(null);
                setIsConfirmDeleteOpen(true);
              },
              variant: "danger",
            },
          ]}
        />
      </div>

      <ConfirmModal 
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handlePermanentDelete}
        title="Xóa vĩnh viễn"
        message={deleteTargetId 
          ? "Bạn có chắc chắn muốn xóa vĩnh viễn mục này? Hành động này không thể hoàn tác." 
          : `Bạn có chắc chắn muốn xóa vĩnh viễn ${selectedIds.length} mục đã chọn? Hành động này không thể hoàn tác.`
        }
        variant="danger"
        confirmText="Xóa vĩnh viễn"
      />
    </div>
  );

  return createPortal(drawerContent, document.body);
}
