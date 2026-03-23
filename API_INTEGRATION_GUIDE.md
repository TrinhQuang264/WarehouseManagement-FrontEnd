# 📋 Hướng dẫn API Integration - Products

## 🎯 Format dữ liệu Specs cần lưu

### **Cấu trúc JSON:**
```json
{
  "id": 1,
  "code": "MAN-HINH-001",
  "name": "Màn hình Dell 24 inch",
  "description": "Mô tả chung về sản phẩm",
  "price": 1500000,
  "importPrice": 1200000,
  "categoryId": 2,
  "quantity": 110,
  "imageUrl": "...",
  "specs": [
    {
      "key": "Resolution",
      "value": "1920 x 1080 px"
    },
    {
      "key": "Panel Type",
      "value": "IPS"
    },
    {
      "key": "Refresh Rate", 
      "value": "60Hz"
    },
    {
      "key": "Response Time",
      "value": "5ms"
    }
  ]
}
```

---

## 🗄️ SQL Database Schema (Ví dụ)

### **Bảng Products:**
```sql
CREATE TABLE Products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(12, 2),
  importPrice DECIMAL(12, 2),
  categoryId INT,
  quantity INT DEFAULT 0,
  imageUrl VARCHAR(500),
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Bảng ProductSpecs (để lưu specs linh hoạt):**
```sql
CREATE TABLE ProductSpecs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  productId INT NOT NULL,
  `key` VARCHAR(100) NOT NULL,
  `value` VARCHAR(255) NOT NULL,
  FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE,
  INDEX idx_productId (productId)
);
```

---

## 📤 API Response Format

### **GET /api/products/1**
Backend cần trả về specs dưới dạng **mảng**:

```javascript
{
  "success": true,
  "data": {
    "id": 1,
    "code": "MAN-HINH-001",
    "name": "Màn hình Dell 24 inch",
    "price": 1500000,
    "importPrice": 1200000,
    "categoryId": 2,
    "quantity": 110,
    "specs": [
      { "key": "Resolution", "value": "1920 x 1080 px" },
      { "key": "Panel Type", "value": "IPS" },
      { "key": "Refresh Rate", "value": "60Hz" },
      { "key": "Response Time", "value": "5ms" }
    ]
  }
}
```

### **POST /api/products (Thêm mới)**
Frontend gửi:
```javascript
{
  "code": "MAN-HINH-003",
  "name": "Màn hình mới",
  "description": "...",
  "price": 2000000,
  "importPrice": 1500000,
  "categoryId": 2,
  "specs": [
    { "key": "Resolution", "value": "2560 x 1440 px" },
    { "key": "Panel Type", "value": "VA" }
  ]
}
```

### **PUT /api/products/1 (Sửa)**
Frontend gửi cấu trúc tương tự:
```javascript
{
  "code": "MAN-HINH-001",
  "name": "Màn hình Dell 24 inch (Updated)",
  "specs": [
    { "key": "Resolution", "value": "1920 x 1080 px" },
    { "key": "Panel Type", "value": "IPS" }
    // removed previous specs automatically
  ]
}
```

---

## 💾 Cách xữ lý Backend

### **Backend (Node.js/Express + SQL):**

```javascript
// Create product với specs
app.post('/api/products', async (req, res) => {
  const { code, name, specs, ...otherData } = req.body;
  
  // 1. Insert vào Products table
  const result = await db.query(
    'INSERT INTO Products SET ?', 
    { code, name, ...otherData }
  );
  
  const productId = result.insertId;
  
  // 2. Insert specs vào ProductSpecs table
  if (specs && specs.length > 0) {
    const specsData = specs.map(s => ({
      productId,
      key: s.key,
      value: s.value
    }));
    await db.query('INSERT INTO ProductSpecs SET ?', specsData);
  }
  
  res.json({ success: true, data: { id: productId, ...req.body } });
});

// Get product với specs
app.get('/api/products/:id', async (req, res) => {
  const product = await db.query(
    'SELECT * FROM Products WHERE id = ?', 
    [req.params.id]
  );
  
  const specs = await db.query(
    'SELECT `key`, `value` FROM ProductSpecs WHERE productId = ?',
    [req.params.id]
  );
  
  res.json({ 
    success: true, 
    data: { 
      ...product[0], 
      specs: specs 
    } 
  });
});

// Update product với specs
app.put('/api/products/:id', async (req, res) => {
  const { specs, ...updateData } = req.body;
  
  // 1. Update product
  await db.query(
    'UPDATE Products SET ? WHERE id = ?',
    [updateData, req.params.id]
  );
  
  // 2. Xóa specs cũ
  await db.query(
    'DELETE FROM ProductSpecs WHERE productId = ?',
    [req.params.id]
  );
  
  // 3. Insert specs mới
  if (specs && specs.length > 0) {
    const specsData = specs.map(s => ({
      productId: req.params.id,
      key: s.key,
      value: s.value
    }));
    await db.query('INSERT INTO ProductSpecs SET ?', specsData);
  }
  
  res.json({ success: true });
});
```

---

## ✅ Checklist khi implement API

- [ ] Backend trả về `specs` dạng **mảng** `[{key, value}]`
- [ ] `addProduct()` gửi specs cùng formData
- [ ] `updateProduct()` xoá specs cũ, thêm specs mới
- [ ] `getProduct()` JOIN table ProductSpecs
- [ ] Database query lọc out empty specs (`key` hoặc `value` trống)
- [ ] Test thêm, sửa, xoá specs

---

## 🔗 Frontend Code (sẵn)

ProductForm đã handle:
- ✅ Add spec row
- ✅ Edit spec row  
- ✅ Delete spec row
- ✅ Save specs vào formData.specs

ProductDetailPage hiển thị:
- ✅ Specs dạng grid 2 cột
- ✅ Support cả array và object format

