import { useState, useCallback } from 'react';
import profileService from '../api/profileService';
import toast from '../../../utils/toast';

export default function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfile(userId);
      setProfile(data);
    } catch (err) {
      setError(err.message || 'Không thể tải thông tin cá nhân');
      toast.error('Lỗi khi tải thông tin cá nhân');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateProfile = useCallback(async (userId, updateData) => {
    setLoading(true);
    try {
      const updatedUser = await profileService.updateProfile(userId, updateData);
      setProfile(updatedUser);
      toast.success('Cập nhật thông tin thành công!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi cập nhật thông tin');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChangePassword = useCallback(async (userName, currentPassword, newPassword, confirmPassword) => {
    setLoading(true);
    try {
      await profileService.changePassword(userName, currentPassword, newPassword, confirmPassword);
      toast.success('Đổi mật khẩu thành công!');
      return true;
    } catch (err) {
      const errorData = err.response?.data;
      let errorMessage = 'Lỗi khi đổi mật khẩu';
      
      if (errorData) {
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.errors && typeof errorData.errors === 'object') {
          const firstErrorField = Object.values(errorData.errors)[0];
          if (Array.isArray(firstErrorField)) errorMessage = firstErrorField[0];
        } else {
          errorMessage = errorData.message || errorData.Message || errorData.error || errorMessage;
        }
      }
      
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    handleUpdateProfile,
    handleChangePassword,
  };
}
