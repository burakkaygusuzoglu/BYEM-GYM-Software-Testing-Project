import { Store } from '../data/store.js';

export function guardRoute() {
  const session = Store.get(Store.KEYS.SESSION);
  const path = window.location.pathname.toLowerCase();
  
  // Define protected areas
  const isProtected = path.includes('/dashboard/') || path.includes('payment.html');
  const isAuthRoute = path.includes('/auth/');
  const isAdminRoute = path.includes('/dashboard/admin');

  if (isProtected && !session) {
    // If trying to access Dashboard as Guest
    window.location.replace('/pages/auth/login.html');
    return;
  }

  // Route protection by role
  if (session && session.role !== 'admin' && isAdminRoute) {
    // Member trying to access Admin panel
    window.location.replace('/pages/dashboard/member.html');
    return;
  }

  if (session && session.role === 'admin' && path.includes('/dashboard/member.html')) {
    // Admin trying to access Member dashboard (redirect to admin)
    window.location.replace('/pages/dashboard/admin.html');
    return;
  }

  if (isAuthRoute && session) {
    // If already logged in, no need to see login/register
    const redirectPath = session.role === 'admin' ? '/pages/dashboard/admin.html' : '/pages/dashboard/member.html';
    window.location.replace(redirectPath);
  }
}

// Run immediately before DOM rendering finishes
guardRoute();