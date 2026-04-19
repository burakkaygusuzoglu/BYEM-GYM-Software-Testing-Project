import { AuthService } from '../services/authService.js';
import { ToastService } from '../services/toastService.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const emailInput = document.getElementById('email');
  const passInput = document.getElementById('password');
  const btnSubmit = form.querySelector('button[type="submit"]');

  // Regex validation check
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const showError = (input, msgId, show) => {
    const errorSpan = document.getElementById(msgId);
    if (show) {
      input.classList.add('form-error');
      if (errorSpan) errorSpan.style.display = 'block';
    } else {
      input.classList.remove('form-error');
      if (errorSpan) errorSpan.style.display = 'none';
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emailVal = emailInput.value.trim();
    const passVal = passInput.value.trim();

    let isValid = true;

    // Email check
    if (!validateEmail(emailVal)) {
      showError(emailInput, 'err-email', true);
      isValid = false;
    } else {
      showError(emailInput, 'err-email', false);
    }

    // Password check
    if (!passVal) {
      showError(passInput, 'err-password', true);
      isValid = false;
    } else {
      showError(passInput, 'err-password', false);
    }

    if (!isValid) return;

    // UX: Loading state
    const defaultBtnText = btnSubmit.textContent;
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Authenticating...';

    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 600));

    // Process Authentication Request
    const response = AuthService.login(emailVal, passVal);

    if (response.success) {
      ToastService.show('Authentication successful. Redirecting...', 'success');

      setTimeout(() => {
        window.location.href = response.user.role === 'admin' 
          ? '/pages/dashboard/admin.html' 
          : '/pages/dashboard/member.html';
      }, 800);
      
    } else {
      ToastService.show(response.message, 'error');
      passInput.value = ''; // clear password on fail
      btnSubmit.disabled = false;
      btnSubmit.textContent = defaultBtnText;
    }
  });
});
