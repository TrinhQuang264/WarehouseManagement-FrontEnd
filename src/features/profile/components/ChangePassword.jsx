import React, { useState, useEffect } from 'react';
import toast from '../../../utils/toast';
import useProfile from '../hooks/useProfile';
import PasswordValidator from '../../auth/components/PasswordValidator';

export default function ChangePassword({ authUser }) {
  const { handleChangePassword, loading } = useProfile();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [confirmError, setConfirmError] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  useEffect(() => {
    if (!passwordData.confirmPassword) {
      setConfirmError('');
      return;
    }

    const timer = setTimeout(() => {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setConfirmError('Mật khẩu xác nhận không trùng khớp');
      } else {
        setConfirmError('');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [passwordData.newPassword, passwordData.confirmPassword]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const onPasswordSubmit = async () => {
    if (!passwordData.currentPassword) {
      toast.error('Vui lòng nhập mật khẩu hiện tại');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }

    const success = await handleChangePassword(
      authUser?.userName,
      passwordData.currentPassword,
      passwordData.newPassword,
      passwordData.confirmPassword
    );

    if (success) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  return (
    <section className="profile-section">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
        <span className="material-icons text-primary">lock_open</span>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Đổi mật khẩu</h3>
      </div>
      <div className="p-8">
        <div className="password-input-grid">
          <div className="profile-input-group">
            <label className="profile-label">Mật khẩu hiện tại</label>
            <div className="relative">
              <input
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="profile-input profile-input-editable"
                placeholder="Nhập mật khẩu hiện tại"
                type="password"
              />
            </div>
          </div>
          <div className="profile-input-group">
            <label className="profile-label">Mật khẩu mới</label>
            <div className="relative">
              <input
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                className="profile-input profile-input-editable"
                placeholder="Nhập mật khẩu mới"
                type="password"
              />
              {isPasswordFocused && (
                <div className="absolute top-1/2 left-full ml-4 w-64 z-10 -translate-y-1/2 md:w-max opacity-100 transition-opacity">
                  <PasswordValidator password={passwordData.newPassword} />
                </div>
              )}
            </div>
          </div>
          <div className="profile-input-group">
            <label className="profile-label">Xác nhận mật khẩu</label>
            <div className="relative">
              <input
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={`profile-input profile-input-editable ${confirmError ? 'border-red-500' : ''}`}
                placeholder="Xác nhận mật khẩu mới"
                type="password"
              />
              {confirmError && (
                <p className="text-[11px] text-red-500 mt-1 absolute left-0 top-full">
                  {confirmError}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
            Mật khẩu của bạn phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự
            đặc biệt để đảm bảo an toàn.
          </p>
          <button
            disabled={loading}
            onClick={onPasswordSubmit}
            className="px-6 py-2 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all text-sm disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : 'Lưu mật khẩu mới'}
          </button>
        </div>
      </div>
    </section>
  );
}
