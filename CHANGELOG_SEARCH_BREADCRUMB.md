# Báo cáo thay đổi: Search Header + Breadcrumb

## 1) Thêm search header cho trang Users với `GET /api/Users/filter`

- File: `src/features/users/api/usersService.js`
  - Thêm hàm `search(params = {})` gọi `api.get('/Users/filter', { params })`.

- File: `src/features/users/hooks/useUsers.jsx`
  - Bỏ lọc local bằng `useMemo`.
  - Thêm hàm `mapUsers(...)` để chuẩn hóa dữ liệu từ API (dùng lại cho danh sách thường + kết quả search).
  - Cập nhật `handleSearch(query)`:
    - Khi có keyword: gọi `userService.search({ keyword })`.
    - Khi rỗng: gọi `userService.getAll()`.
    - Reset trang về `currentPage = 1` khi tìm kiếm.
  - `totalUsers` đổi từ hard-code `24` sang `users.length` để pagination khớp dữ liệu thực.

## 2) Search header trang Customers

- File: `src/features/customers/components/CustomersPage.jsx`
  - Giữ pattern header search đã có (`setOnSearch(searchCustomers)` + placeholder).
  - API dùng `GET /api/Customers/filter` đã có sẵn qua `customersService.search(...)` trong hook hiện tại.

- File tham chiếu: `src/features/customers/hooks/useCustomers.jsx`
  - Đang gọi `customersService.search({ keyword: query })` khi nhập search.

## 3) Chuẩn hóa breadcrumb: mục đầu tiên là `Tổng quan`

Đã thay toàn bộ text breadcrumb `Trang chủ` -> `Tổng quan` ở các file sau:

- `src/components/ui/Breadcrumbs.jsx`
  - Cập nhật ví dụ trong comment để thống nhất naming.

- `src/features/users/components/UsersPageLayout.jsx`
- `src/features/customers/components/CustomersPage.jsx`
- `src/features/customers/components/CustomerDetailPage.jsx`
- `src/features/imports/pages/ImportsPage.jsx`
- `src/features/exports/pages/ExportsPage.jsx`
- `src/features/products/pages/ProductsPage.jsx`
- `src/features/products/pages/ProductDetailPage.jsx`
- `src/features/suppliers/pages/SuppliersPage.jsx`
- `src/features/suppliers/components/SupplierDetailPage.jsx`
- `src/features/profile/pages/ProfilePage.jsx`

## Ghi chú kiểm tra nhanh

1. Vào `/users`, nhập ô search trên header: kiểm tra request lên `GET /api/Users/filter`.
2. Vào `/customers`, nhập ô search trên header: kiểm tra request lên `GET /api/Customers/filter`.
3. Đi qua các trang có breadcrumb ở danh sách file phía trên: phần tử đầu tiên phải là `Tổng quan`.
