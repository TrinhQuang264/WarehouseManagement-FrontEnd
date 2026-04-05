# **Checklist for API Integration**

## Detailed Steps for Integrating a Single API Endpoint

For every API endpoint to be integrated, you should follow this detailed checklist:

- [ ] **1. API Endpoint Constant:** Define the endpoint URL in your constants or config file.
- [ ] **2. Service Layer Function:** Create an asynchronous API calling function (using Axios/fetch) inside the `services` folder. Handle the HTTP request method and payload.
- [ ] **3. State Management (Redux/Context):** If the data needs to be accessed globally, create corresponding Redux Thunks, Actions, and update the Reducers (in `slices/` folder).
- [ ] **4. Custom React Hook (Optional):** Create a hook (e.g., `useFetchData`, React Query, or SWR) to encapsulate logic, loading, and error states.
- [ ] **5. UI Component Integration:** Import the service/action into your React component and hook it up to user events (e.g., `onSubmit`, `onClick`, or `useEffect`).
- [ ] **6. Loading State UI:** Add loading indicators (spinners, skeletons, or disabled buttons) when the API request is pending.
- [ ] **7. Error Handling & Feedback:** Catch errors and show appropriate messages to the user (e.g., Toast notifications, inline form errors).
- [ ] **8. Success Handling & Feedback:** Handle the success flow (e.g., showing a success Toast, clearing form inputs, closing modals, or redirecting to another page).

---

## 1. Authentication APIs

### `POST /api/Authentication/Login`

- [x] **Service:** Create `login(credentials)` function in `authService.js`.
- [x] **State:** Save user info and JWT token into Redux store / Context and persist to `localStorage` or cookies.
- [x] **UI:** Connect to the `LoginPage` form submit action.
- [x] **Feedback:** Show Login Loading, Error Toast on failure, and Redirect to Dashboard upon success.

### `POST /api/Authentication/refresh-token`

- [ ] **Service:** Create `refreshToken(data)` function.
- [ ] **Integration:** Hook this up inside an Axios Response Interceptor to run automatically when a `401 Unauthorized` token expiry error is intercepted.
- [ ] **State:** Update the renewed token in `localStorage` and Redux store seamlessly.

### `POST /api/Authentication/change-password`

- [ ] **Service:** Create `changePassword(data)` function.
- [ ] **UI:** Connect to the Change Password form inside User Profile settings.
- [ ] **Feedback:** Show Success Toast, clear form fields. Optionally, force the user to re-login.

### `POST /api/Authentication/logout`

- [ ] **Service:** Create `logout()` function (if the backend requires invalidating the token).
- [ ] **State:** Clear JWT token, user details from Redux store/Context and remove from `localStorage`/cookies.
- [ ] **UI:** Connect to the Logout buttons (Sidebar, Header).
- [ ] **Feedback:** Redirect user back to the `LoginPage`.

---

## Upcoming API Modules (To Be Integrated)

- [ ] **Categories**
- [ ] **Customers**
- [ ] **Functions**
- [ ] **Permissions**
- [ ] **Products**
- [ ] **Purchases**
- [ ] **RolePermissions**
- [ ] **Roles**
- [ ] **StockTransactions**
- [ ] **Suppliers**
- [ ] **Test**
- [ ] **Users**

---

## Mẫu Chuẩn: Phân trang (Pagination Guide)

Để các module khác (như _Products, Customers, v.v._) có chức năng phân trang hoạt động đồng bộ và mượt mà giống hệt module `Categories` hiện tại, bạn cần áp dụng các bước chuẩn hóa sau:

### 1. Hằng số `PAGE_SIZE` (Khởi tạo ở đầu Custom Hook)
Lưu hằng số số dòng cần xuất ra ở đầu file (ví dụ `useFeature.js`), giúp Dev dể dàng tìm thấy và tinh chỉnh khi cần.
```javascript
const PAGE_SIZE = 7; 
```

### 2. Khởi tạo State & Reset Filter
Phải có state cho `currentPage`, `pageSize` (fix mặc định), `totalCount`, `debouncedSearch`.
```javascript
const [currentPage, setCurrentPage] = useState(1);
const [pageSize] = useState(PAGE_SIZE);
const [totalCount, setTotalCount] = useState(0);

// Bắt buộc: Khi gõ Tìm kiếm -> Phải reset currentPage về 1
useEffect(() => {
    setCurrentPage(1);
}, [debouncedSearch]);
```

### 3. Hàm `parseResponse` Dùng chung
Do API từ backend thỉnh thoảng có cấu trúc trả về khác nhau (ví dụ: bọc trong `data.items`, hoặc `results`, hoặc mảng thẳng), nên cần mang hàm `parseResponse` (từ `useCategories.jsx`) sang dùng để bóc tách an toàn thông tin: `items`, `total`, `isServerPaginated`.

### 4. Logic Fetch & Phân Trang Client-side Fallback
Khi gọi API, hãy truyền `pageIndex` và `pageSize` đi. Nếu API không phân trang từ server (`!isServerPaginated`), lúc này bạn phải dùng `Array.prototype.slice()` để tự cắt mảng phía client. Cuối cùng mới lưu vào state:

```javascript
const fetchItems = async () => {
    const response = await apiService.filter({
        filter: debouncedSearch,
        pageIndex: currentPage,
        pageSize: pageSize, // Truyền đúng số lượng cần thiết
    });
    
    let { items, total, isServerPaginated } = parseResponse(response);

    // Fallback phân trang (Chỉ tự cắt mảng nếu Backend đẩy cả cụm)
    if (!isServerPaginated && items.length > 0) {
        total = items.length;
        const start = (currentPage - 1) * pageSize;
        items = items.slice(start, start + pageSize);
    }
    
    setItems(items);
    setTotalCount(total);
};

// Luôn gọi lại data nếu trang bị chuyển, hoặc từ khoá tìm kiếm trễ được update
useEffect(() => {
    fetchItems();
}, [debouncedSearch, currentPage, pageSize]);
```

### 5. Fetch lại sau khi Thêm / Sửa / Xóa
Hãy tuyệt đối loại bỏ các đoạn logic kiểu như `setItems(prev => prev.filter(...))` hoặc `setItems(prev => [data, ...prev])` trong các hàm CRUD.
Thay vào đó, để làm mới danh sách, bạn chỉ việc gọi duy nhất hàm refresh lại danh sách (`fetchItems();`) ngay sau khi API Thêm/Sửa/Xóa trả về HTTP-200.

### 6. Component `<PaginationBar />` (Bên mảng UI)
Sử dụng chung UI của PaginationBar bằng cách gọi Prop rõ ràng:

```javascript
<PaginationBar
  currentPage={currentPage}
  pageSize={pageSize}
  totalCount={totalCount}
  onPageChange={setCurrentPage} // Nhận lại State Set chức năng nhảy trang
  resourceName="khách hàng" // <-- Tên danh xưng được in ở góc dưới
/>
```
Giao diện `PaginationBar` đã sở hữu sẵn công thức tự tính số lượng trang `Math.ceil(totalCount / pageSize)`, cũng như logic tự động render các thẻ lửng "..." rồi. Bạn chỉ cần nạp dữ liệu vào là xong!
