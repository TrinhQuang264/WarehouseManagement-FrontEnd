import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../auth/api/authService';
import { useAuth } from '../../auth/hooks/useAuth';
import useProfile from '../hooks/useProfile';
import toast from '../../../utils/toast';
import PasswordValidator from '../../auth/components/PasswordValidator';
import '../styles/Profile.css';

export default function ProfilePage() {
  const { user: authUser, updateUser } = useAuth();
  const userId = authService.getUserId();

  const {
    profile,
    loading,
    error,
    fetchProfile,
    handleUpdateProfile,
    handleChangePassword,
  } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    phoneNumber: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [confirmError, setConfirmError] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Console.log thông tin user khi mở trang Profile
  useEffect(() => {
    console.log('===== PROFILE PAGE =====');
    console.log('userId:', userId);
    console.log('authUser:', authUser);
    console.log('storedUser:', authService.getStoredUser());
    console.log('========================');
  }, [userId, authUser]);

  // Fetch profile từ API khi có userId
  useEffect(() => {
    if (userId) {
      console.log('[ProfilePage] Gọi fetchProfile với userId:', userId);
      fetchProfile(userId);
    } else {
      console.warn('[ProfilePage] KHÔNG TÌM THẤY userId!');
    }
  }, [userId, fetchProfile]);

  // Cập nhật formData khi profile từ API trả về
  useEffect(() => {
    if (profile) {
      console.log('[ProfilePage] Profile từ API:', profile);
      const lastName = profile.lastName || profile.LastName || '';
      const firstName = profile.firstName || profile.FirstName || '';
      setFormData({
        firstName,
        lastName,
        fullName: `${lastName} ${firstName}`.trim(),
        email: profile.email || profile.Email || '',
        phoneNumber: profile.phoneNumber || profile.PhoneNumber || '',
      });
    }
  }, [profile]);

  // Fallback: nếu chưa có profile từ API, dùng storedUser
  useEffect(() => {
    if (!profile && authUser) {
      const lastName = authUser.lastName || '';
      const firstName = authUser.firstName || '';
      setFormData({
        firstName,
        lastName,
        fullName: authUser.fullName || `${lastName} ${firstName}`.trim(),
        email: authUser.email || '',
        phoneNumber: authUser.phoneNumber || '',
      });
    }
  }, [authUser, profile]);

  // LIVE VALIDATION: Kiểm tra mật khẩu trùng khớp với 1s delay
  useEffect(() => {
    // Nếu chưa nhập confirm password thì không báo lỗi
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // === Cập nhật thông tin cá nhân ===
  const onUpdateProfile = async () => {
    if (!userId) {
      toast.error('Không tìm thấy ID người dùng. Hãy đăng nhập lại.');
      return;
    }

    const apiData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
    };

    const success = await handleUpdateProfile(userId, apiData);
    if (success) {
      setIsEditing(false);
      // Cập nhật lại localStorage và context với thông tin mới
      const currentStored = authService.getStoredUser();
      const updatedUser = {
        ...currentStored,
        ...apiData,
        fullName: `${formData.lastName} ${formData.firstName}`.trim() || currentStored?.userName,
      };
      
      // Đồng bộ state global để UI (Sidebar, v.v.) cập nhật ngay lập tức
      updateUser(updatedUser);

      console.log('[ProfilePage] Đã cập nhật user trong localStorage và context:', updatedUser);
    }
  };

  // === Đổi mật khẩu ===
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

  // Loading state
  if (loading && !profile && !authUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Lấy tên hiển thị
  const displayUserName =
    profile?.userName || profile?.UserName ||
    authUser?.userName || authUser?.UserName || '';

  const displayFullName =
    profile?.fullName ||
    authUser?.fullName ||
    `${formData.lastName} ${formData.firstName}`.trim() ||
    displayUserName;

  return (
    <div className="profile-page">
      <div className="page-header">
        <div>
          <nav className="flex text-sm text-slate-500 mb-2">
            <Link to="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-900 dark:text-white font-medium">
              Thông tin cá nhân
            </span>
          </nav>
        </div>
      </div>

      {/* Error message */}
      {error && !profile && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          <p>⚠️ {error}</p>
          <button
            onClick={() => userId && fetchProfile(userId)}
            className="mt-2 text-xs underline hover:text-red-800"
          >
            Thử lại
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Info Section */}
        <section className="profile-section">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-icons text-primary">person_outline</span>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Thông tin cá nhân</h3>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-sm font-medium text-primary hover:underline hover:text-blue-600 transition-colors px-2 py-1 rounded"
            >
              {isEditing ? 'Hủy' : 'Chỉnh sửa'}
            </button>
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-12">
              <div className="profile-avatar-box">
                <div className="relative">
                  <img
                    alt="Avatar"
                    className="profile-avatar-img"
                    src={
                      profile?.avatar || profile?.Avatar ||
                      authUser?.avatar || authUser?.Avatar ||
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuBw2aqesUY60aEk721ehQYmqYVqVDEJjW3hjZPjorwqulh-dGnDlhyx4Pe5XuIpr4W-QkQ0G6cTTQTWv-78XEm99L_vcr2TSVUxgxSV1DycA-EsSEtmCkQFN3sjtUZ2SAkWM-dTRxr--CnS1KlI3ZWtn1M5SNxtXhL-EwpNiyF_N18ChDS6OLbnzysGtPinpUhT0ony22hA3A3lDb6ZAmPZ6u1XREyG8tHCrUxY-xxbAaNaSzA_T7KsUVs33raV5BVc8UuTibvNmXU'
                    }
                  />
                  <button className="profile-avatar-btn">
                    <span className="material-icons text-[18px]">camera_alt</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
                  Ảnh đại diện
                </p>
              </div>

              <div className="profile-input-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {/* Hàng 1: Họ và tên (tách khi edit) | Tên đăng nhập */}
                <div className="profile-input-group">
                  {!isEditing ? (
                    <>
                      <label className="profile-label">Họ và tên</label>
                      <input
                        className="profile-input profile-input-readonly"
                        type="text"
                        readOnly
                        value={formData.fullName}
                      />
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="profile-input-group mb-0">
                        <label className="profile-label">Họ</label>
                        <input
                          name="lastName"
                          className="profile-input profile-input-editable"
                          type="text"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Họ"
                        />
                      </div>
                      <div className="profile-input-group mb-0">
                        <label className="profile-label">Tên</label>
                        <input
                          name="firstName"
                          className="profile-input profile-input-editable"
                          type="text"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Tên"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="profile-input-group">
                  <label className="profile-label">Tên đăng nhập</label>
                  <input
                    className="profile-input profile-input-readonly"
                    readOnly={true}
                    disabled={true}
                    type="text"
                    value={displayUserName}
                  />
                </div>

                {/* Hàng 2: Email | Số điện thoại */}
                <div className="profile-input-group">
                  <label className="profile-label">Email</label>
                  <input
                    name="email"
                    className={`profile-input ${isEditing ? 'profile-input-editable' : 'profile-input-readonly'}`}
                    type="email"
                    readOnly={!isEditing}
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={isEditing ? 'Nhập email' : ''}
                  />
                </div>
                <div className="profile-input-group">
                  <label className="profile-label">Số điện thoại</label>
                  <input
                    name="phoneNumber"
                    className={`profile-input ${isEditing ? 'profile-input-editable' : 'profile-input-readonly'}`}
                    type="tel"
                    readOnly={!isEditing}
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder={isEditing ? 'Nhập số điện thoại' : ''}
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-sm"
                >
                  Hủy
                </button>
                <button
                  disabled={loading}
                  onClick={onUpdateProfile}
                  className="px-6 py-2 bg-primary text-white rounded-lg shadow-sm shadow-primary/20 hover:bg-blue-600 transition-colors font-semibold text-sm disabled:opacity-50"
                >
                  {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Change Password Section */}
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
      </div>
    </div>
  );
}
