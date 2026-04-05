# Hướng dẫn Cập nhật Profile và Đồng bộ Trạng thái Real-time

Tài liệu này giải thích các bước đã thực hiện để đảm bảo thông tin người dùng được cập nhật ngay lập tức trên toàn bộ giao diện ứng dụng (như Sidebar) và cách tích hợp bộ kiểm tra mật khẩu.

## 1. Đồng bộ trạng thái Real-time (Không cần Refresh)

### Vấn đề:
Trước đây, khi cập nhật thông tin ở trang Profile, chúng ta chỉ lưu vào `localStorage`. Các thành phần khác như **Sidebar** lấy dữ liệu từ `AuthContext` lúc khởi tạo trang, nên chúng không biết dữ liệu đã thay đổi trừ khi người dùng F5 (refresh) lại trang.

### Giải pháp:
Chúng tôi đã chỉnh sửa `useAuth.jsx` (Context Provider của ứng dụng) để thêm hàm `updateUser`.

**Các bước thực hiện:**
1.  **Mở rộng AuthContext:** Thêm hàm `updateUser` vào `AuthContext` trong file `src/features/auth/components/hooks/useAuth.jsx`.
2.  **Cập nhật State Global:** Hàm này khi được gọi sẽ chạy `setUser(newUser)`, điều này kích hoạt React re-render lại toàn bộ các component đang sử dụng `useAuth` (bao gồm cả Sidebar).
3.  **Đồng bộ LocalStorage:** Đồng thời cập nhật luôn `localStorage` để dữ liệu được duy trì khi người dùng quay lại sau này.

**Cách sử dụng trong ProfilePage:**
```javascript
const { updateUser } = useAuth();

// Sau khi API update thành công:
updateUser(updatedUser); 
```

## 2. Tích hợp Password Validator

Chúng tôi đã mang thành phần `PasswordValidator` (vốn dùng ở trang Login) vào phần "Đổi mật khẩu" của trang Profile.

**Cách hoạt động:**
- Sử dụng state `isPasswordFocused` để theo dõi khi nào người dùng nhấn vào ô "Mật khẩu mới".
- Khi ô này được focus, một tooltip chứa `PasswordValidator` sẽ hiện ra bên cạnh.
- `PasswordValidator` sẽ nhận giá trị mật khẩu đang nhập và kiểm tra các điều kiện (8 ký tự, chữ hoa, chữ thường, số, ký tự đặc biệt) theo thời gian thực.

## 3. Quy trình lưu dữ liệu Họ và Tên

Mặc dù giao diện hiển thị tách biệt "Họ" và "Tên" khi chỉnh sửa để người dùng dễ nhập, nhưng hệ thống vẫn đảm bảo:
- Hợp nhất thành `fullName` để hiển thị ở Sidebar.
- Gửi đúng các trường `firstName`, `lastName` về API của server.
