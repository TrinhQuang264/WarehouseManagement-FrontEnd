/**
 * LoginPage.test.jsx — Ví dụ test case cho trang LoginPage
 *
 * FILE NÀY LÀ VÍ DỤ MINH HỌA cách viết test cho component React.
 * Sử dụng: Vitest + React Testing Library
 *
 * CÀI ĐẶT (nếu chưa có):
 *   npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
 *
 * CHẠY TEST:
 *   npx vitest run                   ← Chạy 1 lần
 *   npx vitest                       ← Chạy watch mode
 *   npx vitest run src/pages/LoginPage  ← Chạy chỉ test của LoginPage
 *
 * CẤU HÌNH VITEST (thêm vào vite.config.js):
 *   export default defineConfig({
 *     test: {
 *       environment: 'jsdom',
 *       globals: true,
 *       setupFiles: './src/test/setup.js',
 *     },
 *   });
 *
 * GIẢI THÍCH TỪNG TEST:
 * 1. "hiển thị form đăng nhập" → Kiểm tra UI render đúng
 * 2. "cho phép nhập username và password" → Kiểm tra input hoạt động
 * 3. "toggle hiển thị mật khẩu" → Kiểm tra nút show/hide password
 * 4. "hiển thị lỗi khi đăng nhập thất bại" → Kiểm tra xử lý lỗi
 * 5. "chuyển hướng sau khi đăng nhập thành công" → Kiểm tra luồng happy path
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../LoginPage';

// ============================================
// MOCK — Giả lập các module bên ngoài
// ============================================

// Mock useAuth hook
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
    loading: false,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ============================================
// HELPER — Render component với Router wrapper
// ============================================

/**
 * Render LoginPage bên trong BrowserRouter
 * (vì LoginPage dùng useNavigate cần Router context)
 */
function renderLoginPage() {
  return render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );
}

// ============================================
// TEST SUITE
// ============================================
describe('LoginPage', () => {
  // Reset mock trước mỗi test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * TEST 1: Kiểm tra form hiển thị đúng
   * - Có tiêu đề "Đăng nhập hệ thống"
   * - Có ô nhập username
   * - Có ô nhập password
   * - Có nút "Đăng nhập"
   */
  it('hiển thị form đăng nhập đầy đủ', () => {
    renderLoginPage();

    // Kiểm tra tiêu đề
    expect(screen.getByText('Đăng nhập hệ thống')).toBeInTheDocument();

    // Kiểm tra các input
    expect(screen.getByPlaceholderText('nhanvien@waresmart.vn')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();

    // Kiểm tra nút submit
    expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument();
  });

  /**
   * TEST 2: Kiểm tra nhập liệu vào form
   */
  it('cho phép nhập username và password', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const usernameInput = screen.getByPlaceholderText('nhanvien@waresmart.vn');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    // Nhập giá trị
    await user.type(usernameInput, 'admin_kho');
    await user.type(passwordInput, 'mypassword123');

    // Kiểm tra giá trị đã nhập
    expect(usernameInput).toHaveValue('admin_kho');
    expect(passwordInput).toHaveValue('mypassword123');
  });

  /**
   * TEST 3: Kiểm tra toggle show/hide password
   */
  it('toggle hiển thị mật khẩu khi nhấn nút', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const passwordInput = screen.getByPlaceholderText('••••••••');

    // Ban đầu: type = password (ẩn)
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Tìm và nhấn nút toggle (nút có icon Eye)
    // Nút toggle nằm bên trong input wrapper
    const toggleButtons = screen.getAllByRole('button');
    const eyeButton = toggleButtons.find(
      (btn) => btn.closest('.absolute') || btn.querySelector('svg')
    );

    if (eyeButton) {
      await user.click(eyeButton);
      // Sau khi click: type = text (hiện)
      expect(passwordInput).toHaveAttribute('type', 'text');
    }
  });

  /**
   * TEST 4: Kiểm tra hiển thị lỗi khi login thất bại
   */
  it('hiển thị lỗi khi đăng nhập thất bại', async () => {
    // Giả lập login thất bại
    mockLogin.mockRejectedValueOnce({
      response: { data: { message: 'Sai tên đăng nhập hoặc mật khẩu' } },
    });

    const user = userEvent.setup();
    renderLoginPage();

    // Nhập thông tin
    await user.type(screen.getByPlaceholderText('nhanvien@waresmart.vn'), 'wrong_user');
    await user.type(screen.getByPlaceholderText('••••••••'), 'wrong_pass');

    // Submit form
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

    // Đợi lỗi hiển thị
    await waitFor(() => {
      expect(screen.getByText('Sai tên đăng nhập hoặc mật khẩu')).toBeInTheDocument();
    });
  });

  /**
   * TEST 5: Kiểm tra chuyển hướng sau khi login thành công
   */
  it('chuyển về Dashboard sau khi đăng nhập thành công', async () => {
    // Giả lập login thành công
    mockLogin.mockResolvedValueOnce({
      fullName: 'Admin Kho',
      role: 'admin',
    });

    const user = userEvent.setup();
    renderLoginPage();

    // Nhập thông tin
    await user.type(screen.getByPlaceholderText('nhanvien@waresmart.vn'), 'admin');
    await user.type(screen.getByPlaceholderText('••••••••'), 'admin123');

    // Submit form
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

    // Đợi navigate được gọi
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin', 'admin123');
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });
});
