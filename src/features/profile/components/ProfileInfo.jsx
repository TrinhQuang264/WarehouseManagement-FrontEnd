import React, { useState, useEffect } from 'react';
import toast from '../../../utils/toast';
import useProfile from '../hooks/useProfile';

export default function ProfileInfo({ profile, authUser, userId, updateUser, handleUpdateProfile, loading }) {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    phoneNumber: '',
  });

  const resetForm = () => {
    if (profile) {
      const lastName = profile.lastName || '';
      const firstName = profile.firstName || '';
      setFormData({
        firstName,
        lastName,
        fullName: `${lastName} ${firstName}`.trim(),
        email: profile.email || '',
        phoneNumber: profile.phoneNumber || '',
      });
    } else if (authUser) {
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
  };

  useEffect(() => {
    resetForm();
  }, [profile, authUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const onUpdateProfile = async () => {
    if (!userId) {
      toast.error('Không tìm thấy ID người dùng. Hãy đăng nhập lại.');
      return;
    }

    let formErrors = {};
    let hasError = false;

    if (!formData.email) {
      formErrors.email = 'Email không được bỏ trống';
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      formErrors.email = 'Email không hợp lệ';
      hasError = true;
    }

    if (!formData.phoneNumber) {
      formErrors.phoneNumber = 'Số điện thoại không được bỏ trống';
      hasError = true;
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      formErrors.phoneNumber = 'Số điện thoại phải gồm 10 chữ số';
      hasError = true;
    }

    if (hasError) {
      setErrors(formErrors);
      toast.error('Vui lòng kiểm tra lại thông tin không hợp lệ.');
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
      
      const currentStoredStr = localStorage.getItem('user');
      let currentStored = {};
      if (currentStoredStr) {
          try { currentStored = JSON.parse(currentStoredStr); } catch (e) {}
      }

      const updatedUser = {
        ...currentStored,
        ...apiData,
        fullName: `${formData.lastName} ${formData.firstName}`.trim() || currentStored?.userName,
      };
      updateUser(updatedUser);
    }
  };

  const displayUserName = profile?.userName || authUser?.userName || '';
  const avatarUrl =
    profile?.avatar || profile?.Avatar ||
    authUser?.avatar || authUser?.Avatar ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBw2aqesUY60aEk721ehQYmqYVqVDEJjW3hjZPjorwqulh-dGnDlhyx4Pe5XuIpr4W-QkQ0G6cTTQTWv-78XEm99L_vcr2TSVUxgxSV1DycA-EsSEtmCkQFN3sjtUZ2SAkWM-dTRxr--CnS1KlI3ZWtn1M5SNxtXhL-EwpNiyF_N18ChDS6OLbnzysGtPinpUhT0ony22hA3A3lDb6ZAmPZ6u1XREyG8tHCrUxY-xxbAaNaSzA_T7KsUVs33raV5BVc8UuTibvNmXU';

  return (
    <section className="profile-section mb-6">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-icons text-primary">person_outline</span>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Thông tin cá nhân</h3>
        </div>
        <button
          onClick={() => {
            if (isEditing) {
              resetForm();
            }
            setIsEditing(!isEditing);
            setErrors({});
          }}
          className="text-sm font-medium text-primary hover:underline hover:text-blue-600 transition-colors px-2 py-1 rounded"
        >
          {isEditing ? 'Hủy' : 'Chỉnh sửa'}
        </button>
      </div>

      <div className="p-8">
        <div className="flex flex-col md:flex-row items-start gap-12">
          {/*<div className="profile-avatar-box">
            <div className="relative">
              <img
                alt="Avatar"
                className="profile-avatar-img"
                src={avatarUrl}
              />
              <button className="profile-avatar-btn">
                <span className="material-icons text-[18px]">camera_alt</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
              Ảnh đại diện
            </p>
          </div>*/}

          <div className="profile-input-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
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
              {isEditing && errors.email && (
                <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>
              )}
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
              {isEditing && errors.phoneNumber && (
                <span className="text-red-500 text-xs mt-1 block">{errors.phoneNumber}</span>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              onClick={() => {
                resetForm();
                setIsEditing(false);
                setErrors({});
              }}
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
  );
}
