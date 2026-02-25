# WareSmart — Quản lý Kho Linh Kiện Điện Thoại

Hệ thống quản lý kho linh kiện điện thoại (Warehouse Management System) — Frontend xây dựng bằng **React 19 + Vite + Tailwind CSS v4**.

---

## 📦 Cài đặt & Chạy

```bash
# 1. Clone project
git clone <repository-url>
cd WarehouseManagement_Frontend

# 2. Cài đặt dependencies
npm install

# 3. Chạy dev server
npm run dev

# 4. Mở trình duyệt
# → http://localhost:5173
```

> **Lưu ý:** Khi chưa có backend ASP.NET Core, ứng dụng sẽ tự động sử dụng **mock data** (dữ liệu mẫu) để hiển thị giao diện demo.

---

## 🏗️ Cấu trúc thư mục

```
src/
├── assets/                     # Ảnh, SVG, tài nguyên tĩnh
│
├── components/                 # Components tái sử dụng
│   ├── ui/                     # Components UI nguyên tử (nhỏ nhất)
│   │   ├── Button.jsx          #   → Nút bấm (primary/secondary/danger/ghost)
│   │   ├── Input.jsx           #   → Ô nhập liệu (có icon, error state)
│   │   ├── SearchBar.jsx       #   → Thanh tìm kiếm
│   │   ├── Loading.jsx         #   → Spinner loading
│   │   ├── Badge.jsx           #   → Nhãn trạng thái (green/red/orange...)
│   │   ├── Avatar.jsx          #   → Ảnh đại diện (ảnh hoặc chữ viết tắt)
│   │   └── StatCard.jsx        #   → Thẻ thống kê trên Dashboard
│   │
│   └── layout/                 # Components bố cục
│       ├── Sidebar.jsx         #   → Menu điều hướng bên trái
│       ├── Header.jsx          #   → Thanh tiêu đề phía trên
│       └── MainLayout.jsx      #   → Kết hợp Sidebar + Header + nội dung
│
├── pages/                      # Các trang (Page-level components)
│   ├── LoginPage.jsx           #   → Trang đăng nhập
│   ├── DashboardPage.jsx       #   → Trang tổng quan
│   └── UsersPage.jsx           #   → Trang quản lý người dùng
│
├── hooks/                      # Custom React Hooks
│   └── useAuth.js              #   → Hook quản lý xác thực (login/logout/user)
│
├── utils/                      # Tiện ích & API layer
│   ├── api.js                  #   → Axios instance (base URL, interceptors)
│   └── authService.js          #   → Các hàm gọi API xác thực
│
├── helpers/                    # Hàm trợ giúp thuần túy
│   └── formatNumber.js         #   → Định dạng số, tiền tệ Việt Nam
│
├── styles/                     # CSS global
│   └── index.css               #   → Tailwind imports + custom theme
│
├── App.jsx                     # Component gốc — Router + Routes
└── main.jsx                    # Entry point — Render vào DOM
```

---

## 🔄 Luồng code chạy (Code Flow)

Khi người dùng mở trình duyệt, code chạy theo thứ tự sau:

### Bước 1: Entry Point (`main.jsx`)

```
index.html
  └── <script src="main.jsx">
        └── import styles/index.css      ← Load Tailwind + custom CSS
        └── import AuthProvider           ← Context quản lý đăng nhập
        └── import App                    ← Component gốc
        └── render(
              <AuthProvider>              ← Bọc toàn app trong auth context
                <App />
              </AuthProvider>
            )
```

### Bước 2: AuthProvider (`hooks/useAuth.js`)

```
AuthProvider khởi động:
  1. Kiểm tra localStorage → có token + user không?
  2. Nếu CÓ → set state: { user: {...}, isAuthenticated: true }
  3. Nếu KHÔNG → set state: { user: null, isAuthenticated: false }
  4. Cung cấp context: { user, login(), logout(), isAuthenticated }
```

### Bước 3: Router (`App.jsx`)

```
<BrowserRouter>
  <Routes>
    /login  →  PublicRoute → LoginPage
                (nếu đã đăng nhập → redirect về /)

    /       →  ProtectedRoute → MainLayout
                (nếu chưa đăng nhập → redirect về /login)
                ├── /          → DashboardPage
                ├── /users     → UsersPage
                ├── /products  → PlaceholderPage (chưa phát triển)
                └── ...
  </Routes>
</BrowserRouter>
```

### Bước 4: MainLayout (`components/layout/MainLayout.jsx`)

```
┌──────────────────────────────────────┐
│  Sidebar        │     Header         │
│  ├── Logo       │     ├── SearchBar  │
│  ├── Nav Links  │     ├── Bell icon  │
│  └── User Info  │     └── "Nhập mới" │
│                 ├────────────────────┤
│                 │   <Outlet />       │
│                 │   (DashboardPage   │
│                 │    hoặc UsersPage) │
└──────────────────────────────────────┘
```

### Bước 5: API Call (ví dụ Dashboard)

```
DashboardPage mount → useEffect → api.get('/dashboard/stats')
                                      │
                                      ├── Axios interceptor gắn token
                                      │   Authorization: Bearer <token>
                                      │
                                      ├── Vite proxy chuyển tiếp
                                      │   /api/* → http://localhost:5000/api/*
                                      │
                                      ├── Nếu thành công → setStats(data)
                                      └── Nếu thất bại → dùng MOCK_DATA
```

---

## 🔌 Kết nối Backend ASP.NET Core

### Cấu hình proxy (đã được thiết lập sẵn)

File `vite.config.js` đã cấu hình proxy:

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',  // ← Địa chỉ backend
      changeOrigin: true,
      secure: false,
    },
  },
}
```

→ Mọi request từ frontend `/api/*` sẽ được chuyển sang `http://localhost:5000/api/*`

### API Endpoints cần có trên backend

| Method | Endpoint               | Mô tả               | Request Body             | Response                                                         |
| ------ | ---------------------- | ------------------- | ------------------------ | ---------------------------------------------------------------- |
| POST   | `/api/auth/login`      | Đăng nhập           | `{ username, password }` | `{ token, user: { fullName, role, avatar } }`                    |
| GET    | `/api/auth/me`         | Lấy user hiện tại   | —                        | `{ fullName, role, avatar }`                                     |
| GET    | `/api/dashboard/stats` | Thống kê dashboard  | —                        | `{ totalInventory, lowStockCount, todayImport, todayExport }`    |
| GET    | `/api/users`           | Danh sách user      | —                        | `[{ id, fullName, email, username, role, roleLabel, isActive }]` |
| GET    | `/api/parts`           | Danh sách linh kiện | —                        | `[{ id, name, category, quantity, price, sku }]`                 |

### Xác thực JWT

1. Frontend gửi `POST /api/auth/login` → nhận `token`
2. Token được lưu vào `localStorage`
3. Mọi request sau đó tự động gắn header: `Authorization: Bearer <token>`
4. Nếu backend trả 401 → frontend tự redirect về `/login`

---

## 🛠️ Công nghệ sử dụng

| Công nghệ     | Phiên bản | Vai trò                     |
| ------------- | --------- | --------------------------- |
| React         | 19        | UI framework                |
| Vite          | 7         | Build tool + Dev server     |
| Tailwind CSS  | 4         | Styling (utility-first CSS) |
| React Router  | 7         | Routing (điều hướng trang)  |
| Axios         | 1.x       | HTTP client (gọi API)       |
| Lucide React  | —         | Icon library                |
| Framer Motion | —         | Animation library           |

---

## 📂 Giải thích từng file quan trọng

### `src/utils/api.js` — Axios Instance

- Tạo instance chung với `baseURL: '/api'`
- **Request interceptor**: tự động gắn JWT token
- **Response interceptor**: xử lý 401 → redirect login

### `src/utils/authService.js` — Auth Service

- `login(username, password)`: Gọi API đăng nhập, lưu token
- `logout()`: Xóa token khỏi localStorage
- `getStoredUser()`: Đọc user từ localStorage (không gọi API)

### `src/hooks/useAuth.js` — Auth Hook

- Sử dụng React Context pattern
- `AuthProvider` bọc toàn app, cung cấp `{ user, login, logout, isAuthenticated }`
- Khi app load → tự kiểm tra localStorage để duy trì đăng nhập

### `src/components/ui/Button.jsx` — Nút bấm

- 4 variants: `primary`, `secondary`, `danger`, `ghost`
- 3 sizes: `sm`, `md`, `lg`
- Hỗ trợ `loading` state (hiện spinner), `icon`, `disabled`

### `src/components/layout/Sidebar.jsx` — Menu bên trái

- Dùng `NavLink` của react-router → tự highlight trang hiện tại
- Hiển thị avatar + tên user ở cuối
- Nút đăng xuất

---

## 🧪 Scripts

```bash
npm run dev       # Chạy dev server (http://localhost:5173)
npm run build     # Build production
npm run preview   # Preview bản build
npm run lint      # Kiểm tra lỗi code (ESLint)
```
