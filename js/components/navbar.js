import { Store } from '../data/store.js';

export function injectNavbar() {
  const session = Store.get(Store.KEYS.SESSION);
  const isAuth = !!session;

  const navbarHtml = `
    <nav class="navbar">
      <div class="container navbar__container">
        <a href="/index.html" class="navbar__logo">BYEM<span>.</span></a>
        
        <button class="hamburger" id="navbar-toggle" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul class="navbar__menu" id="navbar-menu">
          <li><a href="/index.html" class="navbar__link">Home</a></li>
          <li><a href="/pages/about.html" class="navbar__link">About</a></li>
          <li><a href="/pages/classes.html" class="navbar__link">Classes</a></li>
          <li><a href="/pages/memberships.html" class="navbar__link">Memberships</a></li>
          <li><a href="/pages/contact.html" class="navbar__link">Contact</a></li>
        </ul>

        <div class="navbar__actions" id="navbar-actions">
          ${isAuth 
            ? `
              <a href="/pages/dashboard/member.html" class="navbar__link">Dashboard</a>
              <button class="btn btn-outline" id="logout-btn">Logout</button>
            ` 
            : `
              <a href="/pages/auth/login.html" class="navbar__link">Login</a>
              <a href="/pages/auth/register.html" class="btn btn-primary">Join Now</a>
            `
          }
        </div>
      </div>
    </nav>
  `;

  const placeholder = document.getElementById('navbar-placeholder');
  if (placeholder) {
    placeholder.innerHTML = navbarHtml;
    
    // Add logout listener
    if (isAuth) {
      document.getElementById('logout-btn')?.addEventListener('click', () => {
        Store.remove(Store.KEYS.SESSION);
        window.location.href = '/pages/auth/login.html';
      });
    }

    // Toggle menu
    const menuBtn = document.getElementById('navbar-toggle');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        const menu = document.getElementById('navbar-menu');
        const actions = document.getElementById('navbar-actions');
        if(menu) menu.classList.toggle('open');
        if(actions) actions.classList.toggle('open');
      });
    }
  }
}
