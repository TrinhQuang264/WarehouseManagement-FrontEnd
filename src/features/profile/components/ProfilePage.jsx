import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { users } from '../../../utils/mockData';
import '../styles/Profile.css';

export default function ProfilePage() {
  // Lấy data user đầu tiên làm mockup
  const currentUser = users.find(u => u.userName === 'admin') || users[0];
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="profile-page">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-slate-500 dark:text-slate-400 mb-2">
        <ol className="flex items-center space-x-2">
          <li><Link to="/" className="cursor-pointer hover:text-primary transition-colors">Trang chủ</Link></li>
          <li><span className="material-icons text-xs">chevron_right</span></li>
          <li className="font-medium text-slate-900 dark:text-white">Thông tin cá nhân</li>
        </ol>
      </nav>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Cài đặt Hồ sơ Cá nhân</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Quản lý thông tin cá nhân và bảo mật tài khoản của bạn.
        </p>
      </div>

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
                  {/* TODO: Thay bằng URL ảnh đại diện từ API */}
                  <img 
                    alt="Large Avatar" 
                    className="profile-avatar-img" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw2aqesUY60aEk721ehQYmqYVqVDEJjW3hjZPjorwqulh-dGnDlhyx4Pe5XuIpr4W-QkQ0G6cTTQTWv-78XEm99L_vcr2TSVUxgxSV1DycA-EsSEtmCkQFN3sjtUZ2SAkWM-dTRxr--CnS1KlI3ZWtn1M5SNxtXhL-EwpNiyF_N18ChDS6OLbnzysGtPinpUhT0ony22hA3A3lDb6ZAmPZ6u1XREyG8tHCrUxY-xxbAaNaSzA_T7KsUVs33raV5BVc8UuTibvNmXU"
                  />
                  <button className="profile-avatar-btn">
                    <span className="material-icons text-[18px]">camera_alt</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">Ảnh đại diện</p>
              </div>
              
              <div className="profile-input-grid">
                {/* TODO: Load dữ liệu từ state/form data khi tích hợp API */}
                <div className="profile-input-group">
                  <label className="profile-label">Họ và tên</label>
                  <input 
                    className={`profile-input ${isEditing ? 'profile-input-editable' : 'profile-input-readonly'}`}
                    type="text" 
                    readOnly={!isEditing}
                    defaultValue={`${currentUser?.firstName} ${currentUser?.lastName}`} 
                  />
                </div>
                <div className="profile-input-group">
                  <label className="profile-label">Email</label>
                  <input 
                    className={`profile-input ${isEditing ? 'profile-input-editable' : 'profile-input-readonly'}`}
                    type="email" 
                    readOnly={!isEditing}
                    defaultValue={currentUser?.email} 
                  />
                </div>
                <div className="profile-input-group">
                  <label className="profile-label">Số điện thoại</label>
                  <input 
                    className={`profile-input ${isEditing ? 'profile-input-editable' : 'profile-input-readonly'}`}
                    type="tel" 
                    readOnly={!isEditing}
                    defaultValue={currentUser?.phoneNumber} 
                  />
                </div>
                <div className="profile-input-group">
                  <label className="profile-label">Tên đăng nhập</label>
                  <input 
                    className="w-full py-2.5 bg-transparent border-transparent text-slate-500 cursor-text text-sm font-medium" 
                    readOnly={true}
                    disabled={true} 
                    type="text" 
                    defaultValue={currentUser?.userName} 
                  />
                </div>
              </div>
            </div>
            {/* Chỉ hiển thị nút Cập nhật khi ở chế độ Chỉnh sửa */}
            {isEditing && (
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                {/* TODO: Thêm hàm xử lý onClick submit data lên API */}
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-primary text-white rounded-lg shadow-sm shadow-primary/20 hover:bg-blue-600 transition-colors font-semibold text-sm"
                >
                  Cập nhật thông tin
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
            {/* TODO: Wrap bằng form onChange handling khi có API */}
            <div className="password-input-grid">
              <div className="profile-input-group">
                <label className="profile-label">Mật khẩu hiện tại</label>
                <div className="relative">
                  <input 
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
                    className="profile-input profile-input-editable" 
                    placeholder="Nhập mật khẩu mới" 
                    type="password"
                  />
                </div>
              </div>
              <div className="profile-input-group">
                <label className="profile-label">Xác nhận mật khẩu</label>
                <div className="relative">
                  <input 
                    className="profile-input profile-input-editable" 
                    placeholder="Xác nhận mật khẩu mới" 
                    type="password"
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                Mật khẩu của bạn phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt để đảm bảo an toàn.
              </p>
              <button className="px-6 py-2 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all text-sm">
                Lưu mật khẩu mới
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
