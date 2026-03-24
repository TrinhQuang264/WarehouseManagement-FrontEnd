/**
 * specsHelper.js - Utility functions for handling product specs
 * Normalize, validate, and format specs data
 */

/**
 * Normalize specs to standard array format
 * Handles both array and object formats
 * 
 * @param {Array | Object | null} specs - Specs in any format
 * @returns {Array} Array of { key, value } objects
 * 
 * @example
 * normalizeSpecs([{ key: 'Resolution', value: '1920x1080' }])
 * // → [{ key: 'Resolution', value: '1920x1080' }]
 * 
 * normalizeSpecs({ Resolution: '1920x1080', 'Refresh Rate': '60Hz' })
 * // → [{ key: 'Resolution', value: '1920x1080' }, { key: 'Refresh Rate', value: '60Hz' }]
 * 
 * normalizeSpecs(null)
 * // → []
 */
export function normalizeSpecs(specs) {
  if (!specs) return [];
  
  // Already array format
  if (Array.isArray(specs)) {
    return specs.filter(spec => spec && spec.key && spec.value);
  }
  
  // Object format - convert to array
  if (typeof specs === 'object') {
    return Object.entries(specs)
      .map(([key, value]) => ({ key, value }))
      .filter(spec => spec.key && spec.value);
  }
  
  return [];
}

/**
 * Convert array format specs to object format (for API)
 * Useful when backend expects object instead of array
 * 
 * @param {Array} specs - Array of { key, value } objects
 * @returns {Object} Object with specs as key-value pairs
 * 
 * @example
 * specsArrayToObject([
 *   { key: 'Resolution', value: '1920x1080' },
 *   { key: 'Refresh Rate', value: '60Hz' }
 * ])
 * // → { Resolution: '1920x1080', 'Refresh Rate': '60Hz' }
 */
export function specsArrayToObject(specs) {
  if (!Array.isArray(specs)) return {};
  
  return specs.reduce((acc, spec) => {
    if (spec && spec.key) {
      acc[spec.key] = spec.value || '';
    }
    return acc;
  }, {});
}

/**
 * Validate specs format
 * Ensures all specs have key and value
 * 
 * @param {Array} specs - Array to validate
 * @returns {Object} { isValid: boolean, errors: string[] }
 * 
 * @example
 * validateSpecs([{ key: '', value: 'test' }])
 * // → { isValid: false, errors: ['Spec tại vị trí 0: Tên thông số không được trống'] }
 */
export function validateSpecs(specs) {
  const errors = [];
  
  if (!Array.isArray(specs)) {
    return { isValid: false, errors: ['Specs phải là mảng'] };
  }
  
  specs.forEach((spec, idx) => {
    if (!spec.key?.trim()) {
      errors.push(`Spec tại vị trí ${idx}: Tên thông số không được trống`);
    }
    if (!spec.value?.trim()) {
      errors.push(`Spec tại vị trí ${idx}: Giá trị không được trống`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Clean up specs - remove empty ones, trim whitespace
 * 
 * @param {Array} specs - Specs to clean
 * @returns {Array} Cleaned specs
 * 
 * @example
 * cleanSpecs([
 *   { key: '  Resolution  ', value: '  1920x1080  ' },
 *   { key: '', value: 'test' }  // removed
 * ])
 * // → [{ key: 'Resolution', value: '1920x1080' }]
 */
export function cleanSpecs(specs) {
  if (!Array.isArray(specs)) return [];
  
  return specs
    .map(spec => ({
      key: spec?.key?.trim() || '',
      value: spec?.value?.trim() || ''
    }))
    .filter(spec => spec.key && spec.value);
}

/**
 * Format specs for display
 * Useful for showing specs in UI
 * 
 * @param {Array | Object} specs - Specs to format
 * @returns {Array} Normalized and cleaned specs
 */
export function formatSpecs(specs) {
  return cleanSpecs(normalizeSpecs(specs));
}

/**
 * Deduplicate specs by key
 * If multiple specs have same key, keep only last one
 * 
 * @param {Array} specs - Specs to deduplicate
 * @returns {Array} Deduplicated specs
 * 
 * @example
 * deduplicateSpecs([
 *   { key: 'Resolution', value: '1080p' },
 *   { key: 'Resolution', value: '1920x1080' }  // keeps this
 * ])
 * // → [{ key: 'Resolution', value: '1920x1080' }]
 */
export function deduplicateSpecs(specs) {
  if (!Array.isArray(specs)) return [];
  
  const map = new Map();
  specs.forEach(spec => {
    if (spec?.key) {
      map.set(spec.key, spec);
    }
  });
  
  return Array.from(map.values());
}

/**
 * Group specs by category (if implemented)
 * For future use when specs have categories
 * 
 * @param {Array} specs - Specs to group
 * @param {Function} getCategoryFn - Function to get category from spec
 * @returns {Object} Specs grouped by category
 * 
 * @example
 * groupSpecsByCategory(specs, spec => spec.category)
 * // → { 'Display': [...], 'Performance': [...] }
 */
export function groupSpecsByCategory(specs, getCategoryFn = () => 'General') {
  if (!Array.isArray(specs)) return {};
  
  return specs.reduce((acc, spec) => {
    const category = getCategoryFn(spec) || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(spec);
    return acc;
  }, {});
}

/**
 * Compare two specs arrays
 * Useful for detecting changes in edit form
 * 
 * @param {Array} oldSpecs - Original specs
 * @param {Array} newSpecs - Modified specs
 * @returns {Object} Comparison result { changed: boolean, added: [], removed: [], modified: [] }
 */
export function compareSpecs(oldSpecs, newSpecs) {
  const oldNorm = normalizeSpecs(oldSpecs);
  const newNorm = normalizeSpecs(newSpecs);
  
  const oldMap = new Map(oldNorm.map(s => [s.key, s.value]));
  const newMap = new Map(newNorm.map(s => [s.key, s.value]));
  
  const added = [];
  const removed = [];
  const modified = [];
  
  // Find added and modified
  newMap.forEach((value, key) => {
    if (!oldMap.has(key)) {
      added.push({ key, value });
    } else if (oldMap.get(key) !== value) {
      modified.push({ key, oldValue: oldMap.get(key), newValue: value });
    }
  });
  
  // Find removed
  oldMap.forEach((value, key) => {
    if (!newMap.has(key)) {
      removed.push({ key, value });
    }
  });
  
  return {
    changed: added.length > 0 || removed.length > 0 || modified.length > 0,
    added,
    removed,
    modified
  };
}

export default {
  normalizeSpecs,
  specsArrayToObject,
  validateSpecs,
  cleanSpecs,
  formatSpecs,
  deduplicateSpecs,
  groupSpecsByCategory,
  compareSpecs,
};
