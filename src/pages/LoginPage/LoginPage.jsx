/**
 * LoginPage/LoginPage.jsx — Trang đăng nhập hệ thống
 *
 * LUỒNG:
 * 1. User nhập username + password
 * 2. Submit form → gọi useAuth().login()
 * 3. Nếu thành công → redirect về Dashboard (/)
 * 4. Nếu thất bại → hiện thông báo lỗi
 *
 * GHI CHÚ:
 * - Khi chưa có backend, hệ thống sử dụng MOCK DATA để demo
 * - Tài khoản demo: admin / admin123
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, Box, AlertCircle, Headphones } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Xử lý submit form đăng nhập
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[LoginPage] Người dùng nhấn Đăng nhập. Username:', username);
    setError('');
    setLoading(true);

    try {
      console.log('[LoginPage] Gọi login(username, password)...');
      await login(username, password);
      // Đăng nhập thành công → chuyển về Dashboard
      console.log('[LoginPage] Đăng nhập xong, gọi navigate("/") để chuyển hướng...');
      navigate('/', { replace: true });
    } catch (err) {
      console.error('[LoginPage] Lỗi trong handleSubmit:', err);
      // Xử lý lỗi từ API hoặc lỗi mạng
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
    <div className="min-h-screen bg-bg-light flex items-center justify-center relative overflow-hidden">
      {/* ===== Decorative Background ===== */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(#137fec 0.5px, transparent 0.5px)',
            backgroundSize: '20px 20px',
          }}
        />
      </div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      {/* ===== Login Card ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-6 relative z-10"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-light text-primary mb-4">
              <Box size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Đăng nhập hệ thống
            </h1>
            <p className="text-slate-500 text-sm">
              Quản lý kho linh kiện điện thoại
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
              icon={<User size={20} />}
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
              <div className="flex items-center gap-2 text-accent-red text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Ghi nhớ + Quên mật khẩu */}
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
              <a
                href="#"
                className="text-sm font-medium text-primary hover:text-primary-dark"
              >
                Quên mật khẩu?
              </a>
            </div>

            {/* Nút đăng nhập */}
            <Button
              type="submit"
              loading={loading}
              className="w-full py-3"
              size="lg"
            >
              Đăng nhập
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Hoặc</span>
            </div>
          </div>

          {/* Liên hệ hỗ trợ */}
          <div className="text-center">
            <button className="inline-flex items-center text-sm text-slate-500 hover:text-primary transition-colors">
              <Headphones size={18} className="mr-2" />
              Liên hệ hỗ trợ kỹ thuật
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            © 2024 WareSmart — Warehouse Management System.
            <br />
            Được bảo mật và giám sát 24/7.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
