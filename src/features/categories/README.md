# Feature: Categories

This folder contains the Categories CRUD feature, separated as:

- `hooks/useCategories.jsx`: Business logic (fetch, search, pagination, add/edit/delete, modal state).
- `components/CategoryTable.jsx`: Render categories table rows + actions.
- `components/CategoryModal.jsx`: Reusable add/edit modal form.
- `components/CategoriesPage.jsx`: alias to `pages/CategoriesPage` for backward compat.
- `pages/CategoriesPage.jsx`: Top-level page with layout, header setup, and hook connection.
- `pages/CategoriesPageLayout.jsx`: Pure presentation of table+pagination+modals.
- `pages/CategoriesTableSection.jsx`: Table section wrapper.
- `pages/CategoriesPagination.jsx`: Pagination section wrapper.
- `pages/CategoriesModals.jsx`: Modals section wrapper.

## Cách thức hoạt động

1. `CategoriesPage` dùng `useCategories()` để lấy state và action.
2. `useHeader()` để set action button + search input ở header chung.
3. Nếu loading lần đầu, hiển thị spinner.
4. Render `CategoriesPageLayout` với props kết nối.
5. `CategoriesPageLayout` tổ chức UI thông qua các component nhỏ, giúp dễ test và tái sử dụng.

## Để tái dùng cho CRUD module khác (ví dụ: products, suppliers, customers)

1. Tạo hook tương tự `useXXX` với CRUD + pagination + search + modal state.
2. Tạo component table (ví dụ: `ProductTable`) chỉ chịu render dữ liệu và callback `onEdit`, `onDelete`.
3. Tạo modal form (ví dụ: `ProductModal`) chịu validate + onSave.
4. Tạo `pages/XXXPageLayout.jsx`: chỉ nhận props và render table, pagination, modal.
5. Tạo `pages/XXXPage.jsx`: kết nối hook + header + gọi layout.
6. Cập nhật route từ `routes/index.jsx`.

## Kiểm tra / bảo trì

- Với cấu trúc này, logic của UI và business được tách rõ:
  - thay đổi API chỉ vào hook (`useCategories`).
  - thay đổi giao diện chỉ vào `pages/*` và `components/*`.
- Khi thêm tính năng mới, copy y hệt folder `categories` và đổi tên `categories` thành resource mới, sau đó cập nhật service API.
