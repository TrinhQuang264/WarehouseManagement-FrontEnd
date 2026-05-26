export const PRODUCT_URLS = {
  list: '/products',
  new: '/products/create',
  edit: (id) => `/products/update/${id}`,
  detail: (id) => `/products/${id}`,
};

export const IMPORT_URLS = {
  list: '/import',
  new: '/import/create',
  edit: (id) => `/import/update/${id}`,
  detail: (id) => `/import/${id}`,
};

export const EXPORT_URLS = {
  list: '/export',
  new: '/export/create',
  edit: (id) => `/export/update/${id}`,
  detail: (id) => `/export/${id}`,
};

export const CUSTOMER_URLS = {
  list: '/customers',
  new: '/customers/create',
  edit: (id) => `/customers/update/${id}`,
  detail: (id) => `/customers/${id}`,
};

export const SUPPLIER_URLS = {
  list: '/suppliers',
  new: '/suppliers/create',
  edit: (id) => `/suppliers/update/${id}`,
  detail: (id) => `/suppliers/${id}`,
};

export const CATEGORY_URLS = {
  list: '/categories',
  new: '/categories/create',
  edit: (id) => `/categories/update/${id}`,
  detail: (id) => `/categories/${id}`,
};

export const USER_URLS = {
  list: '/users',
  new: '/users/create',
  edit: (id) => `/users/update/${id}`,
  detail: (id) => `/users/${id}`,
};

export const COMMON_URLS = {
  dashboard: '/',
  login: '/login',
  profile: '/profile',
  inventory: '/inventory',
  import: '/import',
  export: '/export',
};
