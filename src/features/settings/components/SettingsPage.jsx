import React, { useState, useEffect } from 'react';
import { Link, useBlocker } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import '../styles/Settings.css';
import Breadcrumbs from '../../../components/ui/Breadcrumbs';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [localTheme, setLocalTheme] = useState('system');
  const [localLang, setLocalLang] = useState('vi');
  const [shake, setShake] = useState(false);

  const hasChanges = localTheme !== theme || localLang !== 'vi';

  let blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasChanges && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
  if (blocker.state === 'blocked') {
    setShake(true);
    setTimeout(() => {
      setShake(false); // ✅ reset để lần sau vẫn animate được
      blocker.reset();
    }, 500);
  }
  }, [blocker.state]);

  const handleSave = () => {
    setTheme(localTheme);
  };

  const handleCancel = () => {
    setLocalTheme(theme);
    setLocalLang('vi');
  };

  return (
    <div className="settings-page">
      <div className="space-y-6">
        <Breadcrumbs />
        <div className="settings-section">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
              <span className="material-icons text-primary">palette</span>
              Giao diện
            </h3>
            <p className="text-sm text-slate-500 mt-1">Chọn chế độ màu sắc phù hợp với môi trường làm việc của bạn.</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                className={`settings-card ${localTheme === 'light' ? 'settings-card-active' : 'settings-card-inactive'}`} 
                onClick={() => setLocalTheme('light')}
              >
                <div className="theme-preview theme-preview-light">
                  <div className="theme-icon-circle bg-white">
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
                className={`settings-card ${localTheme === 'dark' ? 'settings-card-active' : 'settings-card-inactive'}`} 
                onClick={() => setLocalTheme('dark')}
              >
                <div className="theme-preview theme-preview-dark">
                  <div className="theme-icon-circle bg-slate-800">
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
                className={`settings-card ${localTheme === 'system' ? 'settings-card-active' : 'settings-card-inactive'}`}
                onClick={() => setLocalTheme('system')}
              >
                <div className="theme-preview theme-preview-system">
                  <div className="theme-icon-circle bg-white dark:bg-slate-800">
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

        <div className="settings-section">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
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
              className="px-6 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold"
            >
                Hủy bỏ
            </button>
            <button 
              onClick={handleSave}
              className={`px-6 py-2.5 rounded-lg text-white text-sm font-semibold shadow-lg transition-all font-bold ${ shake 
                          ? 'bg-red-500 shadow-indigo-500/50 animate-shake' 
                          : 'bg-primary shadow-blue-500/20 hover:bg-blue-600'
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
