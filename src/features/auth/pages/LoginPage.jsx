import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Box, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import PasswordValidator from '../components/PasswordValidator.jsx';
import '../styles/Login.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [hasLoginAttempted, setHasLoginAttempted] = useState(false);
  const validatePassword = (pass) => {
    const requirements = [
      { regex: /.{8,}/ },
      { regex: /[A-Z]/ },
      { regex: /[a-z]/ },
      { regex: /[0-9]/ },
      { regex: /[^A-Za-z0-9]/ }
    ];

    for (let req of requirements) {
      if (!req.regex.test(pass)) {
        return 'Mật khẩu chưa đúng yêu cầu, Hãy kiểm tra lại.';
      }
    }
    return null;
  };
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    const passError = validatePassword(password);
    if (passError) {
      setValidationError(passError);
      setHasLoginAttempted(true);
      return;
    }

    const result = await login(username, password);
    if (result.success) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="login-container">
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

      <div className="login-card-wrapper">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo-box">
              <Box size={32} />
            </div>
            <h1 className="login-title">Đăng nhập hệ thống</h1>
            <p className="login-subtitle">Hệ thống quản lý kho hàng</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Tên đăng nhập"
              type="text"
              value={username}
              onChange={(e) => { clearError(); setUsername(e.target.value); }}
              placeholder="Nhập tên đăng nhập"
              required
            />

            <div className="relative">
              <Input
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { clearError(); setValidationError(''); setPassword(e.target.value); }}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                placeholder="Nhập mật khẩu"
                required
                rightElement={
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
              />

              {isPasswordFocused && hasLoginAttempted && (
                <div className="absolute top-1/2 left-full ml-4 w-64 z-10 -translate-y-1/2 md:w-max opacity-100 transition-opacity">
                  <PasswordValidator password={password} />
                </div>
              )}
            </div>

            {(error || validationError) && (
              <div className="login-error-box">
                <AlertCircle size={16} />
                <span>{error || validationError}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                />
                <span className="ml-2 text-sm text-slate-600">Ghi nhớ đăng nhập</span>
              </label>
            </div>

            <Button type="submit" loading={isLoading} className="w-full py-3" size="lg">
              Đăng nhập
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}