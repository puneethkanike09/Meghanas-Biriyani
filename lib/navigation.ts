/**
 * Navigation utility for client-side routing
 * Uses Next.js router when available, falls back to window.location
 */

let routerInstance: any = null;

/**
 * Set the router instance (should be called from a client component)
 */
export function setRouter(router: any) {
  routerInstance = router;
}

/**
 * Navigate to a path using Next.js router if available, otherwise use window.location
 */
export function navigate(path: string) {
  if (typeof window === 'undefined') {
    return; // Server-side, do nothing
  }

  const currentPath = window.location.pathname;
  
  // Don't navigate if already on the target path
  if (currentPath === path || currentPath.startsWith(path)) {
    return;
  }

  // Use Next.js router if available (client-side navigation, no page reload)
  if (routerInstance && typeof routerInstance.push === 'function') {
    routerInstance.push(path);
    return;
  }

  // Fallback to window.location for non-React contexts (full page reload)
  window.location.href = path;
}

