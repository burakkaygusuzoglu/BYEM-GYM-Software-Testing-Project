import { AuthService } from '../services/authService.js';
import { ToastService } from '../services/toastService.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');

  if (!form) return;

  const fnInput = document.getElementById('fullname');
  const emailInput = document.getElementById('email');
  const passInput = document.getElementById('password');
  const cmPassInput = document.getElementById('confirmPassword');
  const btnSubmit = form.querySelector('button[type="submit"]');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const showError = (input, msgId, show) => {
    const errorSpan = document.getElementById(msgId);
    if (!errorSpan) return;
    if (show) {
      input.classList.add('form-error');
      errorSpan.style.display = 'block';
    } else {
      input.classList.remove('form-error');
      errorSpan.style.display = 'none';
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fnVal = fnInput.value.trim();
    const emVal = emailInput.value.trim();
    const passVal = passInput.value.trim();
    const cmdPassVal = cmPassInput.value.trim();

    let isValid = true;

    // Fullname check
    if (fnVal.length < 2) {
      showError(fnInput, 'err-fullname', true);
      isValid = false;
    } else {
      showError(fnInput, 'err-fullname', false);
    }

    // Email check
    if (!validateEmail(emVal)) {
      showError(emailInput, 'err-email', true);
      isValid = false;
    } else {
      showError(emailInput, 'err-email', false);
    }

    // Password criteria check (Length 6-12)
    if (passVal.length < 6 || passVal.length > 12) {
      showError(passInput, 'err-password', true);
      isValid = false;
    } else {
      showError(passInput, 'err-password', false);
    }

    // Password matching check
    if (passVal !== cmdPassVal || cmdPassVal === '') {
      showError(cmPassInput, 'err-confirm-password', true);
      isValid = false;
    } else {
      showError(cmPassInput, 'err-confirm-password', false);
    }

    if (!isValid) return;

    const originalText = btnSubmit.textContent;
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Processing...';

    await new Promise(resolve => setTimeout(resolve, 500));

    // Proceed to create user
    const response = AuthService.register(fnVal, emVal, passVal);

    if (response.success) {
      ToastService.show(response.message + ' Redirecting...', 'success');

      setTimeout(() => {
        window.location.href = '/pages/auth/login.html';
      }, 1500);

    } else {
      ToastService.show(response.message, 'error');
      btnSubmit.disabled = false;
      btnSubmit.textContent = originalText;
    }
  });

});
