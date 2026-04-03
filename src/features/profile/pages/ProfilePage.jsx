import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../auth/api/authService';
import { useAuth } from '../../auth/hooks/useAuth';
import useProfile from '../hooks/useProfile';
import ProfileInfo from '../components/ProfileInfo';
import ChangePassword from '../components/ChangePassword';
import '../styles/Profile.css';

export default function ProfilePage() {
  const { user: authUser, updateUser } = useAuth();
  const userId = authService.getUserId();
  const { profile, loading, error, fetchProfile, handleUpdateProfile } = useProfile();

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    } else {
      console.warn('[ProfilePage] KHÔNG TÌM THẤY userId!');
    }
  }, [userId, fetchProfile]);

  if (loading && !profile && !authUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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

      {error && !profile && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          <p>{error}</p>
          <button
            onClick={() => userId && fetchProfile(userId)}
            className="mt-2 text-xs underline hover:text-red-800"
          >
            Thử lại
          </button>
        </div>
      )}

      <div className="space-y-6">
        <ProfileInfo 
          profile={profile} 
          authUser={authUser} 
          userId={userId} 
          updateUser={updateUser} 
          handleUpdateProfile={handleUpdateProfile}
          loading={loading}
        />
        <ChangePassword authUser={authUser} />
      </div>
    </div>
  );
}
