export const categories = [
  {
    "id": 1,
    "name": "Linh kiện phần cứng",
    "seoAlias": "linh-kien-phan-cung",
    "seoDescription": "Các linh kiện phần cứng máy tính",
    "sortOrder": 1,
    "parentId": null,
    "isDeleted": false
  },
  {
    "id": 2,
    "name": "Màn hình",
    "seoAlias": "man-hinh",
    "seoDescription": "Các loại màn hình máy tính",
    "sortOrder": 2,
    "parentId": null,
    "isDeleted": false
  },
  {
    "id": 3,
    "name": "Bàn phím & Chuột",
    "seoAlias": "ban-phim-chuot",
    "seoDescription": "Các loại bàn phím và chuột",
    "sortOrder": 3,
    "parentId": null,
    "isDeleted": false
  },
  {
    "id": 4,
    "name": "Phụ kiện",
    "seoAlias": "phu-kien",
    "seoDescription": "Phụ kiện đi kèm máy tính",
    "sortOrder": 4,
    "parentId": null,
    "isDeleted": false
  },
  {
    "id": 5,
    "name": "Mạng & Viễn thông",
    "seoAlias": "mang-vien-thong",
    "seoDescription": "Thiết bị mạng routers, switches",
    "sortOrder": 5,
    "parentId": null,
    "isDeleted": false
  }
];

export const customers = [
  {
    "id": 1,
    "fullName": "Quản trị 1",
    "phoneNumber": "0123456789",
    "address": "Hà Nội"
  },
  {
    "id": 2,
    "fullName": "Nguyễn Văn A",
    "phoneNumber": "0987654321",
    "address": "Hồ Chí Minh"
  },
  {
    "id": 3,
    "fullName": "Trần Thị B",
    "phoneNumber": "0912345678",
    "address": "Đà Nẵng"
  },
  {
    "id": 4,
    "fullName": "Lê Văn C",
    "phoneNumber": "0909090909",
    "address": "Cần Thơ"
  },
  {
    "id": 5,
    "fullName": "Phạm Văn D",
    "phoneNumber": "0888888888",
    "address": "Hải Phòng"
  }
];

export const products = [
  {
    "id": 1,
    "isDefault": true,
    "price": 1500000,
    "importPrice": 1200000,
    "quantity": 110,
    "imageUrl": "/images/products/man-hinh-001.jpg",
    "name": "Màn hình Dell 24 inch",
    "description": "Sản phẩm màn hình Dell độ phân giải FHD",
    "categoryId": 2,
    "code": "MAN-HINH-001",
    "isActive": true,
  },
  {
    "id": 2,
    "isDefault": false,
    "price": 3500000,
    "importPrice": 2800000,
    "quantity": 50,
    "imageUrl": "/images/products/man-hinh-002.jpg",
    "name": "Màn hình LG 27 inch 4K",
    "description": "Sản phẩm màn hình LG độ phân giải 4K",
    "categoryId": 2,
    "code": "MAN-HINH-002",
    "isActive": true,
  },
  {
    "id": 3,
    "isDefault": true,
    "price": 500000,
    "importPrice": 350000,
    "quantity": 200,
    "imageUrl": "/images/products/ban-phim-001.jpg",
    "name": "Bàn phím cơ Logitech",
    "description": "Bàn phím cơ gaming Logitech",
    "categoryId": 3,
    "code": "BAN-PHIM-001",
    "isActive": true,
  },
  {
    "id": 4,
    "isDefault": false,
    "price": 250000,
    "importPrice": 180000,
    "quantity": 150,
    "imageUrl": "/images/products/chuot-001.jpg",
    "name": "Chuột không dây Razer",
    "description": "Chuột không dây gaming tốc độ cao",
    "categoryId": 3,
    "code": "CHUOT-001",
    "isActive": true,
  },
  {
    "id": 5,
    "isDefault": true,
    "price": 1200000,
    "importPrice": 900000,
    "quantity": 80,
    "imageUrl": "/images/products/linh-kien-001.jpg",
    "name": "Ổ cứng SSD 512GB",
    "description": "Ổ cứng SSD tốc độ cao 512GB",
    "categoryId": 1,
    "code": "LINH-KIEN-001",
    "isActive": true,
  },
  {
    "id": 6,
    "isDefault": true,
    "price": 850000,
    "importPrice": 600000,
    "quantity": 300,
    "imageUrl": "/images/products/phu-kien-001.jpg",
    "name": "Tai nghe Over-ear Sony",
    "description": "Tai nghe chống ồn chủ động",
    "categoryId": 4,
    "code": "PHU-KIEN-001",
    "isActive": true,
  }
];

export const productDetails = [
  {
    "id": 1,
    "userId": "95b507cd-e58b-42d2-997e-a1d06ff9baf9",
    "content": "Chất lượng ổn trong tầm giá. Màu sắc trung thực, phù hợp cho dân văn phòng.",
    "rating": 5,
    "parentId": null,
    "isApproved": true,
    "isDefault": true,
    "price": 1500000,
    "quantity": 110,
    "imageUrl": "/images/products/man-hinh-001.jpg",
    "name": "Màn hình Dell 24 inch",
    "description": "Sản phẩm màn hình Dell độ phân giải FHD",
    "categoryId": 2,
    "code": "MAN-HINH-001",
    "isActive": true
  },
  {
    "id": 2,
    "userId": "u-002",
    "content": "Hình ảnh rất sắc nét. Tuy nhiên chân đế hơi chiếm diện tích.",
    "rating": 4,
    "parentId": null,
    "isApproved": true,
    "isDefault": false,
    "price": 3500000,
    "quantity": 50,
    "imageUrl": "/images/products/man-hinh-002.jpg",
    "name": "Màn hình LG 27 inch 4K",
    "description": "Sản phẩm màn hình LG độ phân giải 4K",
    "categoryId": 2,
    "code": "MAN-HINH-002",
    "isActive": true
  },
  {
    "id": 3,
    "userId": "u-003",
    "content": "Gõ êm, phản hồi cực tốt. Led sáng mượt mà.",
    "rating": 5,
    "parentId": null,
    "isApproved": true,
    "isDefault": true,
    "price": 500000,
    "quantity": 200,
    "imageUrl": "/images/products/ban-phim-001.jpg",
    "name": "Bàn phím cơ Logitech",
    "description": "Bàn phím cơ gaming Logitech",
    "categoryId": 3,
    "code": "BAN-PHIM-001",
    "isActive": true
  }
];

export const suppliers = [
  {
    "id": 1,
    "supplierName": "Công ty TNHH Công nghệ Phong Vũ",
    "contactPerson": "Nguyễn Văn Đạt",
    "address": "Số 1, Lê Thanh Nghị, Hai Bà Trưng, Hà Nội"
  },
  {
    "id": 2,
    "supplierName": "Công ty Cổ phần HanoiComputer",
    "contactPerson": "Trần Thanh Bình",
    "address": "Số 43 Thái Hà, Đống Đa, Hà Nội"
  },
  {
    "id": 3,
    "supplierName": "Nhà phân phối An Phát PC",
    "contactPerson": "Lê Mai Khôi",
    "address": "49 Thái Hà, Đống Đa, Hà Nội"
  },
  {
    "id": 4,
    "supplierName": "Công ty Điện máy xanh",
    "contactPerson": "Phạm Công Danh",
    "address": "Nguyễn Văn Cừ, Long Biên, Hà Nội"
  },
  {
    "id": 5,
    "supplierName": "GearVN",
    "contactPerson": "Đào Tuấn Anh",
    "address": "Thái Hà, Đống Đa, Hà Nội"
  }
];

export const users = [
  {
    "id": "95b507cd-e58b-42d2-997e-a1d06ff9baf9",
    "email": "admin@gmail.com",
    "phoneNumber": "0123456789",
    "firstName": "Quản trị",
    "lastName": "Hệ thống",
    "userName": "admin"
  },
  {
    "id": "a1b2c3d4-e58b-42d2-997e-x9y8z7w6v5u4",
    "email": "manager@gmail.com",
    "phoneNumber": "0988888888",
    "firstName": "Quản lý",
    "lastName": "Kho",
    "userName": "manager"
  },
  {
    "id": "z9y8x7w6-e58b-42d2-997e-a1b2c3d4e5f6",
    "email": "staff1@gmail.com",
    "phoneNumber": "0911111111",
    "firstName": "Nhân viên",
    "lastName": "Kinh doanh 1",
    "userName": "staff1"
  },
  {
    "id": "v5u4t3s2-e58b-42d2-997e-f6e5d4c3b2a1",
    "email": "staff2@gmail.com",
    "phoneNumber": "0922222222",
    "firstName": "Nhân viên",
    "lastName": "Kho 1",
    "userName": "staff2"
  }
];
