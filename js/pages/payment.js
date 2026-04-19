import { AuthService } from '../services/authService.js';
import { MembershipService } from '../services/membershipService.js';
import { ToastService } from '../services/toastService.js';

document.addEventListener('DOMContentLoaded', () => {
  // Query param parsing to figure out what plan was clicked
  const params = new URLSearchParams(window.location.search);
  const planId = params.get('plan') || 'essential';

  const planDetails = MembershipService.getPlanDetails(planId);
  const user = AuthService.getCurrentUser();

  // If user somehow doesn't exist here, they were bypassed guard, double check
  if (!user) {
    window.location.replace('/pages/auth/login.html');
    return;
  }

  // Populate Summary
  document.getElementById('summary-plan-text').textContent = planDetails.name + ' Plan';
  document.getElementById('summary-plan-price').textContent = '$' + planDetails.price;
  document.getElementById('summary-total-price').textContent = '$' + planDetails.price;

  // Form handling
  const form = document.getElementById('paymentForm');
  const payButton = document.getElementById('payButton');
  const loader = document.getElementById('payment-loader');

  const cardName = document.getElementById('cardName');
  const cardNumber = document.getElementById('cardNumber');
  const cardExpiry = document.getElementById('cardExpiry');
  const cardCvv = document.getElementById('cardCvv');

  // Basic utility to format card number with spaces as user types
  cardNumber.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    e.target.value = val.replace(/(.{4})/g, '$1 ').trim();
  });

  // Basic utility for exp date
  cardExpiry.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    e.target.value = val;
  });

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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameVal = cardName.value.trim();
    const numVal = cardNumber.value.replace(/\s/g, '');
    const expVal = cardExpiry.value.trim();
    const cvvVal = cardCvv.value.trim();

    let isValid = true;

    if (nameVal.length < 3) {
      showError(cardName, 'err-name', true);
      isValid = false;
    } else {
      showError(cardName, 'err-name', false);
    }

    if (numVal.length !== 16 || isNaN(numVal)) {
      showError(cardNumber, 'err-num', true);
      isValid = false;
    } else {
      showError(cardNumber, 'err-num', false);
    }

    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expVal)) {
      showError(cardExpiry, 'err-exp', true);
      isValid = false;
    } else {
      showError(cardExpiry, 'err-exp', false);
    }

    if (cvvVal.length < 3 || isNaN(cvvVal)) {
      showError(cardCvv, 'err-cvv', true);
      isValid = false;
    } else {
      showError(cardCvv, 'err-cvv', false);
    }

    if (!isValid) return;

    // Simulate "Loading" state for realism
    form.style.display = 'none';
    loader.style.display = 'flex';

    setTimeout(() => {
      const response = MembershipService.activateMembership(user.id, planId);

      if (response.success) {
        ToastService.show('Payment Successful! Redirecting to Dashboard...', 'success');
        loader.innerHTML = `
          <div style="font-size: 3rem; color: var(--accent-success); margin-bottom: 1rem;">&#10003;</div>
          <h3 class="text-gold">Success</h3>
          <p class="text-secondary">Redirecting to Dashboard...</p>
        `;
        setTimeout(() => {
          window.location.replace('/pages/dashboard/member.html');
        }, 1500);
      } else {
        // Fallback on error
        form.style.display = 'block';
        loader.style.display = 'none';
        ToastService.show(response.message, 'error');
      }
    }, 1800); // 1.8 seconds fake network delay
  });
});
