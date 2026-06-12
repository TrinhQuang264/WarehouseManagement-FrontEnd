export const normalizeProduct = (item = {}) => {
  const normalizedPrice = item.sellingPrice ?? 0;
  const normalizedOriginalPrice = item.originalPrice ?? 0;

  return {
    ...item,
    originalPrice: normalizedOriginalPrice,
    sellingPrice: normalizedPrice,
  };
};

export const filterProducts = (
  allItems,
  { debouncedSearch, selectedCategoryId, minPrice, maxPrice },
) => {
  let filteredItems = [...allItems];

  // 1. Search
  if (debouncedSearch) {
    const lowerSearch = debouncedSearch.toLowerCase();
    filteredItems = filteredItems.filter(
      (item) =>
        item.name?.toLowerCase().includes(lowerSearch) ||
        item.code?.toLowerCase().includes(lowerSearch) ||
        item.description?.toLowerCase().includes(lowerSearch),
    );
  }

  // 2. Category Filter
  if (selectedCategoryId) {
    filteredItems = filteredItems.filter(
      (item) => item.categoryId === Number(selectedCategoryId),
    );
  }

  // 3. Price Filter
  if (minPrice !== "") {
    filteredItems = filteredItems.filter(
      (item) => item.price >= Number(minPrice),
    );
  }
  if (maxPrice !== "") {
    filteredItems = filteredItems.filter(
      (item) => item.price <= Number(maxPrice),
    );
  }

  return filteredItems;
};
