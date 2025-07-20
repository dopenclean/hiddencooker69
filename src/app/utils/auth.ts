// Authentication utility functions

export function checkAuthSession(): boolean {
  if (typeof window === 'undefined') return false;
  
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => 
    cookie.trim().startsWith('auth_session=')
  );
  
  return authCookie?.includes('authenticated') || false;
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;
  
  // Clear the cookie by setting expiration to past date
  document.cookie = 'auth_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

export function getSessionTimeRemaining(): number {
  if (typeof window === 'undefined') return 0;
  
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => 
    cookie.trim().startsWith('auth_session=')
  );
  
  if (!authCookie?.includes('authenticated')) return 0;
  
  // Extract expiration from cookie (this is a simplified approach)
  // In a real app, you might store expiration separately or use JWT
  const cookieString = document.cookie;
  const match = cookieString.match(/auth_session=authenticated/);
  
  if (!match) return 0;
  
  // Return remaining time in milliseconds (simplified - assumes 24h from now)
  return 24 * 60 * 60 * 1000; // 24 hours
} 