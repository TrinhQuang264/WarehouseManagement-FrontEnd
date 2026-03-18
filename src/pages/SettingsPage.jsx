import React, { useState, useEffect } from 'react';
import { Link, useBlocker } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  
  // Local state for settings preview
  const [localTheme, setLocalTheme] = useState(theme);
  const [localLang, setLocalLang] = useState('vi');
  
  // To highlight save button
  const [shake, setShake] = useState(false);

  // Check if there are unsaved changes
  const hasChanges = localTheme !== theme || localLang !== 'vi';

  // Navigation Blocker
  let blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasChanges && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      setShake(true);
      setTimeout(() => setShake(false), 1000);
      blocker.reset();
    }
  }, [blocker]);

  const handleSave = () => {
    setTheme(localTheme);
    // if there was a global lang context, set it here
  };

  const handleCancel = () => {
    setLocalTheme(theme);
    setLocalLang('vi');
  };

  return (
    <div className="p-5 pt-0 space-y-5">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-slate-500 dark:text-slate-400 mb-2">
        <ol className="flex items-center space-x-2">
          <li><Link to="/" className="cursor-pointer hover:text-primary transition-colors">Trang chủ</Link></li>
          <li><span className="material-icons text-xs">chevron_right</span></li>
          <li className="font-medium text-slate-900 dark:text-white">Cài đặt</li>
        </ol>
      </nav>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Cài đặt hệ thống</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Quản lý các tùy chỉnh giao diện và ngôn ngữ của bạn.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="material-icons text-primary">palette</span>
              Giao diện
            </h3>
            <p className="text-sm text-slate-500 mt-1">Chọn chế độ màu sắc phù hợp với môi trường làm việc của bạn.</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                className={`group relative border-2 bg-white dark:bg-slate-800 rounded-xl p-4 flex flex-col items-center gap-3 transition-all outline-none focus:outline-none ring-offset-2 ring-primary ${localTheme === 'light' ? 'border-primary' : 'border-transparent'}`} 
                onClick={() => setLocalTheme('light')}
              >
                <div className="w-full h-24 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200">
                  <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <span className="material-icons text-orange-400 text-3xl">light_mode</span>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">Sáng (Light)</span>
                  <span className={`material-icons text-lg ${localTheme === 'light' ? 'text-primary' : 'text-transparent group-hover:text-slate-300 dark:group-hover:text-slate-600'}`}>
                    {localTheme === 'light' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
              </button>

              <button 
                className={`group relative border-2 bg-white dark:bg-slate-800 rounded-xl p-4 flex flex-col items-center gap-3 transition-all outline-none focus:outline-none ring-offset-2 ring-primary ${localTheme === 'dark' ? 'border-primary' : 'border-transparent'}`} 
                onClick={() => setLocalTheme('dark')}
              >
                <div className="w-full h-24 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700">
                  <div className="w-12 h-12 bg-slate-800 rounded-full shadow-lg flex items-center justify-center">
                    <span className="material-icons text-indigo-400 text-3xl">dark_mode</span>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">Tối (Dark)</span>
                  <span className={`material-icons text-lg ${localTheme === 'dark' ? 'text-primary' : 'text-transparent group-hover:text-slate-300 dark:group-hover:text-slate-600'}`}>
                    {localTheme === 'dark' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
              </button>

              <button 
                className={`group relative border-2 bg-white dark:bg-slate-800 rounded-xl p-4 flex flex-col items-center gap-3 transition-all outline-none focus:outline-none ring-offset-2 ring-primary ${localTheme === 'system' ? 'border-primary' : 'border-transparent'}`}
                onClick={() => setLocalTheme('system')}
              >
                <div className="w-full h-24 bg-gradient-to-r from-slate-50 to-slate-900 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center">
                    <span className="material-icons text-slate-500 text-3xl">settings_brightness</span>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">Theo hệ thống</span>
                  <span className={`material-icons text-lg ${localTheme === 'system' ? 'text-primary' : 'text-transparent group-hover:text-slate-300 dark:group-hover:text-slate-600'}`}>
                    {localTheme === 'system' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="material-icons text-primary">translate</span>
              Ngôn ngữ
            </h3>
            <p className="text-sm text-slate-500 mt-1">Thay đổi ngôn ngữ hiển thị trên toàn hệ thống.</p>
          </div>
          <div className="p-6">
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Chọn ngôn ngữ</label>
              <div className="relative">
                <select 
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg appearance-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm font-medium text-slate-900 dark:text-white"
                  value={localLang}
                  onChange={(e) => setLocalLang(e.target.value)}
                >
                  <option value="vi">Tiếng Việt (Mặc định)</option>
                  <option value="en">English (US)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <span className="material-icons">unfold_more</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hiển thị nút Lưu / Hủy nếu có thay đổi */}
        {hasChanges && (
          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
                Hủy bỏ
            </button>
            <button 
              onClick={handleSave}
              className={`px-6 py-2.5 rounded-lg text-white text-sm font-semibold shadow-lg transition-all ${
                shake ? 'bg-indigo-500 shadow-indigo-500/50 animate-[shake_0.4s_ease-in-out_2]' : 'bg-primary shadow-blue-500/20 hover:bg-blue-600'
              }`}
            >
                Lưu thay đổi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
