# Header & API Search Implementation Guide

This guide explains how to implement context-aware search using the shared Header component. This pattern is currently implemented in the **Categories** module and can be replicated for Products, Users, etc.

## 1. How it works (The Architecture)

1.  **Shared Header Component**: Contains the search input and manages a **1000ms debounce** internally.
2.  **Header Context**: Acts as the communication bridge.
3.  **Feature Page**: Provides a search handler (e.g., `setSearch`) to the Header via context.
4.  **Feature Hook**: Receives the search keyword, resets pagination, and triggers the API call.

---

## 2. Step-by-Step Implementation

### Step A: API Service (e.g., `productsService.js`)
Ensure your service has a `filter` method that accepts `filter`, `pageIndex`, and `pageSize`.

```javascript
// GET /api/Products/filter?filter={keyword}&pageIndex=1&pageSize=10
async filter(params = {}) {
  const { filter, pageIndex = 1, pageSize = 10 } = params;
  const response = await api.get('/Products/filter', { 
    params: { filter, pageIndex, pageSize } 
  });
  return response.data;
}
```

### Step B: Feature Hook (e.g., `useProducts.jsx`)
The hook should manage `search` state and react to it.

```javascript
export function useProducts() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // React to the keyword from Header
  useEffect(() => {
    setDebouncedSearch(search);
    setCurrentPage(1); // ALWAYS reset to page 1 on search
  }, [search]);

  // Fetch logic
  const fetchProducts = useCallback(async () => {
    const data = await productService.filter({
      filter: debouncedSearch,
      pageIndex: currentPage,
      pageSize: 10
    });
    setProducts(data.items);
  }, [debouncedSearch, currentPage]);

  return { search, setSearch, ... };
}
```

### Step C: Feature Page (e.g., `ProductsPage.jsx`)
Connect the hook's `setSearch` to the Header.

```javascript
const { search, setSearch } = useProducts();
const { setOnSearch, setActionButton, resetHeader } = useHeader();

useEffect(() => {
  // 1. Set the search handler
  setOnSearch(setSearch);

  // 2. Configure action button (optional)
  setActionButton({
    label: "Add Product",
    searchPlaceholder: "Search by name...",
    onClick: () => ...
  });

  // 3. Cleanup on unmount
  return () => resetHeader();
}, [setOnSearch, setSearch]);
```

---

## 3. Important Rules

1.  **Debounce**: The **Header** component already handles 1000ms debounce. Do NOT add extra debounce in your hook unless you want a longer delay.
2.  **Pagination Reset**: You MUST set `currentPage = 1` whenever the search keyword changes.
3.  **Empty Search**: If the user clears the search input, the Header will call `onSearch("")`. Your hook should handle this by fetching the original data (empty filter).
4.  **Shared State**: The Header's search input visibility depends on the presence of the `onSearch` handler. If `setOnSearch(null)` is called, the search bar disappears.

---

## 4. API Reference Example (Categories)

- **Method**: `GET`
- **Endpoint**: `/api/Categories/filter`
- **Query Params**:
  - `filter`: string (keyword)
  - `pageIndex`: integer (default 1)
  - `pageSize`: integer (default 10)
