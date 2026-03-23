# Visual Header Examples

## Header Layout (All Pages)

```
────────────────────────────────────────────────────────────────
│ [Search Bar] ............................ [Action Button] |
────────────────────────────────────────────────────────────────
```

### CustomersPage
```
────────────────────────────────────────────────────────────────
│ [🔍 Tìm kiếm khách hàng...] ......... [➕ Thêm khách hàng] |
────────────────────────────────────────────────────────────────
```

### SuppliersPage
```
────────────────────────────────────────────────────────────────
│ [🔍 Tìm kiếm nhà cung cấp...] ... [➕ Thêm nhà cung cấp] |
────────────────────────────────────────────────────────────────
```

### ProductsPage
```
────────────────────────────────────────────────────────────────
│ [🔍 Tìm kiếm mã, tên sản phẩm...] .... [➕ Thêm sản phẩm] |
────────────────────────────────────────────────────────────────
```

### UsersPage
```
────────────────────────────────────────────────────────────────
│ [🔍 Tìm kiếm theo tên hoặc vai trò...] [➕ Thêm người dùng] |
────────────────────────────────────────────────────────────────
```

### CategoriesPage
```
────────────────────────────────────────────────────────────────
│ [🔍 Tìm kiếm tên danh mục...] ....... [➕ Thêm danh mục] |
────────────────────────────────────────────────────────────────
```

### InventoryPage
```
────────────────────────────────────────────────────────────────
│ [🔍 Tìm kiếm sản phẩm...] ........ [➕ Nhập hàng mới] |
│                                                [📥 Xuất báo cáo] |
────────────────────────────────────────────────────────────────
```

## How It Works

### User Flow

1. **Page Loads**
   - Page calls `useHeader()` in `useEffect`
   - Sets `actionButton` config
   - Sets `onSearch` callback
   - Header automatically displays search + button

2. **User Types in Search**
   - Header calls `onSearch` callback
   - Page's search function filters data
   - Table instantly updates with results

3. **User Clicks Action Button**
   - Button's `onClick` handler executes
   - Usually opens a modal (Add/Edit form)
   - User can create/edit item

4. **User Navigates Away**
   - Current page's `useEffect` cleanup runs
   - Calls `resetHeader()`
   - Header clears previous config
   - New page sets its own config
   - Header updates automatically

### Code Flow Diagram

```
Page Mount
    ↓
useEffect Hook
    ↓
setActionButton({...})
setOnSearch(searchFunction)
    ↓
Header Updates
    ├─ Displays search bar ← setSearchValue
    └─ Displays action button ← onClick
    ↓
User Interaction
    ├─ Types → onSearch → searchFunction → filteredData
    └─ Clicks → onClick → handleOpenAdd → Modal
    ↓
Page Unmount
    ↓
resetHeader()
    ↓
Header Clears (waiting for next page)
```

## State Management

### HeaderContext State Flow

```
Page Component
    │
    ├─→ useHeader()
    │
    └─→ Sets via:
        ├─ setActionButton(config)
        ├─ setOnSearch(callback)
        └─ resetHeader()
               ↓
        HeaderContext
        ├─ searchValue
        ├─ actionButton
        ├─ onSearch
        └─ resetHeader
               ↓
        Header Component reads:
        ├─ searchValue → SearchBar
        ├─ actionButton → Button display
        └─ onSearch → Search callback
```

## Search Filtering Examples

### CustomersPage Search
Input: "Nguyen"
Results: Filters by fullName, code, email, phone
Example: "Nguyễn Văn Khải" → FOUND ✓

### SuppliersPage Search
Input: "NCC"
Results: Filters by supplierName, code, email, phone, address
Example: "NCC001" → FOUND ✓

### ProductsPage Search
Input: "iPhone"
Results: API filters by code, name, SKU
Example: "iPhone 15 Pro" → FOUND ✓

## CSS Styling

### Responsive Design
```
Desktop (md and up):
[Search: 400px] ................ [Action Button]

Mobile (below md):
[Search: full width]
[Action Button: full width]
```

### Color Scheme
- Header: White background (light), Dark bg (dark mode)
- Search bar: Primary color focus
- Action button: Primary color with shadow
- Text: Slate-900 (light) / White (dark)

## Performance Considerations

1. **Context Updates** - Only affected components re-render
2. **Search Debouncing** - ProductsPage has 500ms debounce on API calls
3. **Cleanup** - resetHeader() prevents memory leaks
4. **Memoization** - Search functions wrapped in useCallback
