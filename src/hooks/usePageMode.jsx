import { useLocation } from 'react-router-dom';

/**
 * usePageMode - Determine what mode/view we're in based on URL
 * 
 * Replaces verbose logic like:
 *   const isAddMode = location.pathname === '/products/new';
 *   const isEditMode = location.pathname.startsWith('/products/edit/');
 *   const isDetailMode = ...complex boolean logic...
 * 
 * @param {string} basePath - Base path like '/products' or '/customers'
 * @returns {Object} { list, add, edit, detail, current, isModify }
 * 
 * @example
 * const mode = usePageMode('/products');
 * // mode.list = true when on /products
 * // mode.add = true when on /products/new
 * // mode.edit = true when on /products/edit/123
 * // mode.detail = true when on /products/123
 */
export function usePageMode(basePath) {
  const location = useLocation();
  const path = location.pathname;
  
  // Normalize base path (remove leading/trailing slashes)
  const normalizedBase = basePath.replace(/^\/|\/$/g, '');
  
  // Extract ID from edit or detail routes
  const editMatch = path.match(new RegExp(`^/${normalizedBase}/edit/(\\d+)$`));
  const detailMatch = path.match(new RegExp(`^/${normalizedBase}/(\\d+)$`));
  
  const id = editMatch?.[1] || detailMatch?.[1];
  
  // Determine mode
  const modeList = path === `/${normalizedBase}`;
  const modeAdd = path === `/${normalizedBase}/new`;
  const modeEdit = !!editMatch;
  const modeDetail = !!detailMatch && !modeEdit;  // Detail must not be edit
  
  // Alias for "modify" (add or edit)
  const isModify = modeAdd || modeEdit;
  
  // Current mode as string
  let current = 'list';
  if (modeAdd) current = 'add';
  if (modeEdit) current = 'edit';
  if (modeDetail) current = 'detail';
  
  return {
    list: modeList,
    add: modeAdd,
    edit: modeEdit,
    detail: modeDetail,
    isModify,  // Convenience: modeAdd || modeEdit
    current,   // String: 'list' | 'add' | 'edit' | 'detail'
    id,        // ID from URL (if in edit or detail mode)
  };
}

/**
 * Example usage in ProductsPage:
 * 
 * export default function ProductsPage() {
 *   const mode = usePageMode('/products');
 *   
 *   if (mode.list) {
 *     return <ProductsTable />;
 *   }
 *   
 *   if (mode.add) {
 *     return <ProductForm isNew={true} />;
 *   }
 *   
 *   if (mode.edit) {
 *     return <ProductForm productId={mode.id} />;
 *   }
 *   
 *   if (mode.detail) {
 *     return <ProductDetailPage productId={mode.id} />;
 *   }
 *   
 *   // Or use current as switch
 *   switch (mode.current) {
 *     case 'list':
 *       return <ProductsTable />;
 *     case 'add':
 *       return <ProductForm isNew={true} />;
 *     case 'edit':
 *       return <ProductForm productId={mode.id} />;
 *     case 'detail':
 *       return <ProductDetailPage productId={mode.id} />;
 *     default:
 *       return null;
 *   }
 * }
 */

export default usePageMode;
