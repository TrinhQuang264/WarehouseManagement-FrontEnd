# 📘 Cấu Trúc Chuẩn: CRUD, Phân trang & Tìm kiếm (Mô hình Categories)

Tài liệu này giải phẫu toàn bộ kiến trúc đang được sử dụng ở Module Categories. Bạn có thể sử dụng biểu mẫu này làm kim chỉ nam để code các chức năng khác (Products, Customers, Suppliers,...) một cách nhất quán, sạch sẽ và tái sử dụng code tốt nhất.

---

## 1. 🏗️ Kiến trúc tổng thể (Architecture)

Mô hình này chia rẽ rõ ràng giữa **UI (Giao diện)** và **Logic (Xử lý dữ liệu)**:
- **`api/[name]Service.js`**: Chuyên làm việc với Axios gọi Backend. KHÔNG chứa logic UI.
- **`hooks/use[Name].jsx`**: Chứa toán bộ State (dữ liệu, loading, trang hiện tại...) và thao tác (handleDelete, handleAdd...). UI chỉ cần gọi xuất đồ ra dùng, không phải tự viết logic.
- **`components/[Name]Table.jsx`**: Cấu trúc bảng HTML/Tailwind thân thuần túy nhận props.
- **`components/[Name]Modal.jsx`**: Form nhập liệu thuần túy nhận props.
- **`pages/[Name]Page.jsx`**: Nơi Lắp Ráp tất cả lại với nhau. Gọi Hook và rải dữ liệu xuống các Components.

---

## 2. 🧩 Giải phẫu `use[Name].jsx` (Trái tim của hệ thống)

Đây là nơi chứa 90% chất xám. Cấu trúc chuẩn của một Hook gồm 6 phần:

### Phần 1: Khởi tạo biến State
```javascript
const PAGE_SIZE = 7; // Khai báo cứng số lượng để dễ sửa
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(false);
```

### Phần 2: Quản lý URL và Tìm kiếm
Sử dụng `useSearchParams` để lấy thông tin `search` và `page` từ URL, giúp F5 không bị mất trang.
```javascript
const [searchParams, setSearchParams] = useSearchParams();
const [search, setSearch] = useState(searchParams.get("search") || "");
const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);

// Sync lên URL mỗi khi page hoặc search đổi
useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);
    if (search) params.set("search", search);
    setSearchParams(params, { replace: true });
}, [currentPage, search, setSearchParams]);
```

### Phần 3: Hàm `parseResponse`
Khử các dị bản cấu trúc JSON từ backend trả về (`response.items`, `response.data`, mảng thẳng,...). Rất quan trọng để Client không bị crash.

### Phần 4: Lấy dữ liệu (Fetch Data)
1. Thảy tham số phân trang xuống API: `pageIndex: currentPage, pageSize: PAGE_SIZE`.
2. Kiểm tra nếu backend ném về nguyên 1 list tổng (không xẻ sẵn), thì tự động xẻ bằng `.slice()` chạy bằng Client:
```javascript
if (!isServerPaginated && items.length > 0) {
  total = items.length;
  const start = (currentPage - 1) * pageSize;
  items = items.slice(start, start + pageSize);
}
```

### Phần 5: CRUD với nguyên tắc "Xóa Xong Gọi Lại" (Refetching)
Tuyệt đối KHÔNG ĐƯỢC dùng lệnh gỡ data bằng tay kiểu `setItems(prev => prev.filter(i => i.id !== id))`. 
**Cách đúng đắn:** 
Gọi API Xóa/Sửa -> Nếu Thành công -> Gọi hàm `fetchData()` để backend lo liệu phần trích xuất lại danh sách.

### Phần 6: Validate Logic Nghiệp vụ
Khi Add/Edit, gọi kiểm tra ví dụ trùng tên `checkName()` từ service trước khi submit thực sự.

---

## 3. 📝 Hướng dẫn từng bước làm một Module mới (ví dụ: `Customers`)

### Bước 1: Tạo file API (`api/customersService.js`)
Tạo các hàm kết nối POST, PUT, DELETE, GET tương tự `categoriesService.js`.

### Bước 2: Tạo Hook (`hooks/useCustomers.jsx`)
Sao chép `useCategories.jsx` sang, đổi các chữ `Category` thành `Customer`. Lưu ý kiểm tra lại các key backend trả về (ví dụ không phải `data.name` mà là `data.fullName`).

### Bước 3: Tạo Modal Thêm/Sửa (`components/CustomerModal.jsx`)
- Dùng `<Modal>` chung của hệ thống.
- Thiết kế một Form nhập liệu chứa các trường cần thiết. Có hàm `validate()` riêng check rỗng, check định dạng email,...
- Nhận Props: `editingCustomer` để phân biệt là chế độ Thêm hay Sửa nhằm bind data vào form.

### Bước 4: Tạo Component Table (`components/CustomersTable.jsx`)
Table HTML thuần túy lặp data khách hàng ra màng hình. Gắn sắn Nút Sửa & Xóa để gọi Prop Function nảy ngược lên trên.

### Bước 5: Lắp Ráp Toàn Tập ở `pages/CustomersPage.jsx`
Cái Page này chỉ việc khai báo Hook `useCustomers` rồi phát "đồ nghề" cho giao diện:
```javascript
export default function CustomersPage() {
    const {
        customers, loading, currentPage, setCurrentPage, pageSize, totalCount, ... // hook values
    } = useCustomers();

    return (
        <div>
           {/* Bảng Dữ Liệu */}
           <CustomersTable data={customers} onEdit={...} onDelete={...} />
           
           {/* Thanh Phân Trang tự động hóa */}
           <PaginationBar 
              currentPage={currentPage}
              pageSize={pageSize}
              totalCount={totalCount}
              onPageChange={setCurrentPage} 
           />
        </div>
    )
}
```

---
> 💡 **Mẹo:** Giao diện Pagination bị nhảy khi sang trang cuối ít data? Hãy bọc Table trong component `<DataTableCard>` kèm `className="min-h-[540px] flex flex-col"` (Chiều cao fix tương ứng số lượng PAGE_SIZE) để khoá chặt chiều cao không bị co giãn.
