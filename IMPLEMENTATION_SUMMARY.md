# Header Refactor - Implementation Summary

## What Was Changed

### Overview
Moved "Add" buttons and search functionality from individual pages to a dynamic header that adapts to each page.

### Architecture Changes

#### 1. **Created HeaderContext** (`src/contexts/HeaderContext.jsx`)
- Manages global header state
- Provides `useHeader()` hook for easy access from any page
- Exports: `HeaderProvider` and `useHeader`

#### 2. **Updated MainLayout**
- Wrapped entire app with `HeaderProvider`
- Ensures all pages have access to header context

#### 3. **Updated Header Component**
- Now displays dynamic search bar (left) and action button (right)
- Renders based on `actionButton` config from context
- Calls `onSearch` callback when user types

#### 4. **Updated CSS** (global.css)
Added flexbox layout for header:
```css
.header-content { display: flex; justify-content: space-between; }
.header-search { flex: 1; max-width: 400px; }
.header-action { flex-shrink: 0; }
```

### Pages Updated (6 Total)

#### ✅ CustomersPage
- Search filters by: fullName, code, email, phone
- Action button: "Thêm khách hàng" → opens CustomerModal
- Uses: `useCustomers()` with search functionality

#### ✅ SuppliersPage
- Search filters by: supplierName, code, email, phone, address
- Action button: "Thêm nhà cung cấp" → opens SupplierModal
- Uses: `useSuppliers()` with search functionality

#### ✅ ProductsPage
- Search filters products from API (existing functionality)
- Action button: "Thêm sản phẩm" (placeholder)
- Price filter remains on page for advanced filtering

#### ✅ UsersPage
- Search filters by: fullName, username, email, phoneNumber
- Action button: "Thêm người dùng" (placeholder)
- Uses: `useUsers()` with search functionality

#### ✅ CategoriesPage
- Search filters categories by name
- Action button: "Thêm danh mục" (placeholder)
- Search bar moved from page to header

#### ✅ InventoryPage
- Search filters products by keyword
- Action button: "Nhập hàng mới" (placeholder)
- "Xuất báo cáo" button remains in page header

### Hooks Updated

#### useCustomers
- Added: `filteredCustomers` - array filtered by search
- Added: `searchCustomers(query)` - callback to set search

#### useSuppliers
- Added: `filteredSuppliers` - array filtered by search
- Added: `searchSuppliers(query)` - callback to set search

#### useProducts
- Already had search functionality via API
- Integrated with header context

#### useUsers
- Already had search filtering
- Integrated with header context

## Implementation Pattern

Every page follows this pattern:

```jsx
import { useEffect } from 'react';
import { useHeader } from '../../../contexts/HeaderContext';

export default function MyPage() {
  const { set​ActionButton, setOnSearch, resetHeader } = useHeader();

  useEffect(() => {
    // Configure the header when page mounts
    setActionButton({
      label: 'Action Label',
      icon: <Icon size={18} />,
      onClick: handleClick,
      searchPlaceholder: 'Search...',
      className: 'optional-styling'
    });

    // Set callback for search
    setOnSearch(mySearchFunction);

    // Cleanup on unmount
    return () => resetHeader();
  }, [dependencies]);

  // Rest of component...
}
```

## Key Features

1. **Consistent UI** - All pages have the same header layout
2. **Dynamic Behavior** - Header updates automatically when navigating between pages
3. **Flexible Configuration** - Each page controls its own search and action behavior
4. **Clean Code** - No duplicate buttons or search bars across pages
5. **Easy to Extend** - New pages can follow the same pattern

## Files Modified

```
src/
  contexts/
    HeaderContext.jsx ................. NEW
  components/layout/
    Header.jsx ....................... Updated
    MainLayout.jsx ................... Updated
  styles/
    global.css ....................... Updated
  features/
    customers/
      components/CustomersPage.jsx ... Updated
      hooks/useCustomers.jsx ......... Updated
    suppliers/
      components/SuppliersPage.jsx ... Updated
      hooks/useSuppliers.jsx ......... Updated
    products/
      components/ProductsPage.jsx .... Updated
    users/
      components/UsersPage.jsx ....... Updated
    categories/
      components/CategoriesPage.jsx .. Updated
    inventory/
      components/InventoryPage.jsx ... Updated
```

## Testing Checklist

- [ ] Navigate to CustomersPage - see search + "Add Customer" button in header
- [ ] Type in search - filters customer list
- [ ] Click "Add Customer" - opens modal
- [ ] Navigate to SuppliersPage - header updates with new search and button
- [ ] Verify same for ProductsPage, UsersPage, CategoriesPage, InventoryPage
- [ ] Test that header resets when returning to Dashboard

## Next Steps (Optional)

1. Implement "Add Product" and "Add User" handlers
2. Add more pages (Dashboard, Profile, Settings) if needed
3. Add unit tests for HeaderContext and hooks
4. Consider adding advanced filter button to header for complex pages
