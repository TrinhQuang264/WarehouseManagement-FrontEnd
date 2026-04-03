/**
 * @param {string} token - The JWT token to decode
 * @returns {object|null} - The decoded payload or null if invalid
 */
export function decodeJWT(token) {
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('[JWT] Error decoding token:', error.message);
    return null;
  }
}

// getUsernameFromToken - Helper to extract username from token claims.
export function getUsernameFromToken(token) {
  const payload = decodeJWT(token);
  if (!payload) return null;
  
  return payload.name || payload.unique_name || payload.sub || null;
}

// getUserIdFromToken - Helper to extract userId from token claims.
export function getUserIdFromToken(token) {
  const payload = decodeJWT(token);
  if (!payload) return null;
  
  return (
    payload.nameid ||
    payload.sub ||
    payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
    payload.id ||
    payload.Id ||
    null
  );
}
