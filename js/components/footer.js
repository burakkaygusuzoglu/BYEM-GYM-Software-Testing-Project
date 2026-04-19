export function injectFooter() {
  const footerHtml = `
    <footer class="footer">
      <div class="container">
        <div class="footer__grid">
          <div class="footer__brand">
            <a href="/index.html" class="footer__logo">BYEM<span>.</span></a>
            <p class="footer__desc text-secondary">Redefining health and performance. We build machines, not memberships.</p>
          </div>
          <div>
            <h4 class="footer__title">Menu</h4>
            <ul class="footer__list" role="list">
              <li><a href="/pages/about.html" class="footer__link">About Us</a></li>
              <li><a href="/pages/classes.html" class="footer__link">Classes</a></li>
              <li><a href="/pages/memberships.html" class="footer__link">Memberships</a></li>
            </ul>
          </div>
          <div>
            <h4 class="footer__title">Support</h4>
            <ul class="footer__list" role="list">
              <li><a href="/pages/contact.html" class="footer__link">Contact</a></li>
              <li><a href="#" class="footer__link">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 class="footer__title">Socials</h4>
            <ul class="footer__list" role="list">
              <li><a href="#" class="footer__link">Instagram</a></li>
              <li><a href="#" class="footer__link">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div class="footer__bottom">
          <p>&copy; ${new Date().getFullYear()} BYEM GYM. All rights reserved.</p>
          <div>
            <a href="#" class="footer__link">Privacy Policy</a> | 
            <a href="#" class="footer__link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `;

  const placeholder = document.getElementById('footer-placeholder');
  if (placeholder) {
    placeholder.innerHTML = footerHtml;
  }
}
