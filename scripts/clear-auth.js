// Quick script to clear auth from browser console
// Run this in browser DevTools console

console.log('Clearing authentication...');
localStorage.removeItem('auth-storage');
console.log('Auth cleared! Refreshing page...');
location.reload();
