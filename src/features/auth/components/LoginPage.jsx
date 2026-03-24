import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Box, AlertCircle, Headphones } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import '../styles/Login.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[LoginPage] Người dùng nhấn Đăng nhập. Username:', username);
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/', { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Decorative Background */}
      <div className="login-bg-dots">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(#137fec 0.5px, transparent 0.5px)',
            backgroundSize: '20px 20px',
          }}
        ></div>
      </div>
      <div className="login-bg-blur-1"></div>
      <div className="login-bg-blur-2"></div>

      {/* Login Card */}
      <div className="login-card-wrapper">
        <div className="login-card">          {/* Header */}
          <div className="login-header">
            <div className="login-logo-box">
              <Box size={32} />
            </div>
            <h1 className="login-title">
              Đăng nhập hệ thống
            </h1>
            <p className="login-subtitle">
              Hệ thống quản lý kho hàng
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tên đăng nhập */}
            <Input
              label="Tên đăng nhập"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="nhanvien@waresmart.vn"
              required
            />

            {/* Mật khẩu */}
            <Input
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={20} />}
              placeholder="••••••••"
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />

            {/* Thông báo lỗi */}
            {error && (
              <div className="login-error-box">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Ghi nhớ mật khẩu */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                />
                <span className="ml-2 text-sm text-slate-600">
                  Ghi nhớ đăng nhập
                </span>
              </label>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full py-3"
              size="lg"
            >
              Đăng nhập
            </Button>
          </form>

          <div className="login-divider">
            <div className="login-divider-line">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="login-divider-text-wrapper">
              <span className="login-divider-text">Hoặc</span>
            </div>
          </div>
          <div className="text-center">
            <button className="login-support-btn">
              <Headphones size={18} className="mr-2" />
              Liên hệ hỗ trợ kỹ thuật
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
