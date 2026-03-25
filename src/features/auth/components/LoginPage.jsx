import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Box, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import '../styles/Login.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      {/* Background */}
      <div className="login-bg-blur-1" />
      <div className="login-bg-blur-2" />
      <div className="login-bg-dots">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(#137fec 0.5px, transparent 0.5px)',
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* Login Card */}
      <div className="login-card-wrapper">
        <div className="login-card">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Tên đăng nhập"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              required
            />

            <Input
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}       
              placeholder="Nhập mật khẩu"
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

            {error && (
              <div className="login-error-box">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

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
        </div>
      </div>
    </div>
  );
}
