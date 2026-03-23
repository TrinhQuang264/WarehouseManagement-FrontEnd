export const PRODUCT_URLS = {
  list: '/products',
  new: '/products/new',
  edit: (id) => `/products/edit/${id}`,
  detail: (id) => `/products/${id}`,
};

export const IMPORT_URLS = {
  list: '/import',
  new: '/import/new',
  edit: (id) => `/import/edit/${id}`,
  detail: (id) => `/import/${id}`,
};

export const EXPORT_URLS = {
  list: '/export',
  new: '/export/new',
  edit: (id) => `/export/edit/${id}`,
  detail: (id) => `/export/${id}`,
};

export const CUSTOMER_URLS = {
  list: '/customers',
  new: '/customers/new',
  edit: (id) => `/customers/edit/${id}`,
  detail: (id) => `/customers/${id}`,
};

export const SUPPLIER_URLS = {
  list: '/suppliers',
  new: '/suppliers/new',
  edit: (id) => `/suppliers/edit/${id}`,
  detail: (id) => `/suppliers/${id}`,
};

export const CATEGORY_URLS = {
  list: '/categories',
  new: '/categories/new',
  edit: (id) => `/categories/edit/${id}`,
  detail: (id) => `/categories/${id}`,
};

export const USER_URLS = {
  list: '/users',
  new: '/users/new',
  edit: (id) => `/users/edit/${id}`,
  detail: (id) => `/users/${id}`,
};

export const COMMON_URLS = {
  dashboard: '/',
  login: '/login',
  profile: '/profile',
  settings: '/settings',
  inventory: '/inventory',
  import: '/import',
  export: '/export',
};
