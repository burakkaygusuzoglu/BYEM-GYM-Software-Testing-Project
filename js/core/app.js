import { Store } from '../data/store.js';
import './guard.js'; // Runs routing logic immediately
import { injectNavbar } from '../components/navbar.js';
import { injectFooter } from '../components/footer.js';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initialize mock data if not present
  Store.init();

  // Inject common UI elements
  injectNavbar();
  injectFooter();

  // Scroll effect on navbar
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar--scrolled');
      } else {
        navbar.classList.remove('navbar--scrolled');
      }
    });
  }

  console.log('BYEM GYM App Initialized.');
});
