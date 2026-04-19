import { BookingService } from '../services/bookingService.js';
import { AuthService } from '../services/authService.js';
import { ToastService } from '../services/toastService.js';

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('classes-grid');
  if (!grid) return;

  const currentUser = AuthService.getCurrentUser();

  const renderClasses = () => {
    grid.innerHTML = '';
    const classes = BookingService.getClasses();

    classes.forEach(cls => {
      const isFull = cls.booked >= cls.capacity;
      const isBookedAlready = currentUser ? BookingService.isBookedByUser(currentUser.id, cls.id) : false;
      
      let actionHtml = '';

      if (!currentUser) {
        actionHtml = `<a href="/pages/auth/login.html" class="btn btn-outline btn-block">Log in to Reserve</a>`;
      } else if (isBookedAlready) {
        actionHtml = `<button class="btn btn-block" disabled style="background-color: var(--surface-elevated); color: var(--accent-success); cursor: not-allowed; border: 1px solid var(--accent-success);">Spot Reserved ✓</button>`;
      } else if (isFull) {
        actionHtml = `<button class="btn btn-ghost btn-block" disabled style="opacity: 0.5; cursor: not-allowed; border: 1px solid var(--glass-border);">Class Full</button>`;
      } else {
        actionHtml = `<button class="btn btn-primary btn-block reserve-btn" data-id="${cls.id}">Reserve Spot</button>`;
      }

      // Dynamic color indication for seats
      let seatColor = 'var(--text-secondary)';
      if (isFull) seatColor = 'var(--accent-danger)';
      else if ((cls.capacity - cls.booked) <= 5) seatColor = 'var(--accent-gold)';
      else seatColor = 'var(--accent-success)';

      const cardHtml = `
        <div class="card" style="border: 1px solid var(--glass-border); border-top: 4px solid var(--accent-gold); transition: transform 0.3s ease; display:flex; flex-direction:column; justify-content:space-between; box-shadow: var(--shadow-md);">
          <div>
            <div style="font-size: 1.5rem; font-family: var(--font-display); font-weight: 700; margin-bottom: var(--space-2); text-transform: uppercase;">${cls.name}</div>
            <p class="text-secondary" style="margin-bottom: var(--space-4);">Trainer: <strong style="color: var(--text-primary);">${cls.trainer}</strong></p>
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); border-top: 1px solid var(--glass-border); padding-top: var(--space-4);">
              <span class="text-sm" style="font-weight: 500;">${cls.schedule}</span>
              <span class="text-sm" style="color: ${seatColor}; font-weight:600;">${cls.booked} / ${cls.capacity} Seats</span>
            </div>
            ${actionHtml}
          </div>
        </div>
      `;

      grid.insertAdjacentHTML('beforeend', cardHtml);
    });
  };

  // Initial Render
  renderClasses();

  // Event Delegation for Reservation Buttons
  grid.addEventListener('click', async (e) => {
    if (e.target.classList.contains('reserve-btn')) {
      const btn = e.target;
      const classId = btn.getAttribute('data-id');
      
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Processing...';

      // Simulate a realistic network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const response = BookingService.bookClass(currentUser.id, classId);

      if (response.success) {
        ToastService.show(response.message, 'success');
        
        // Re-render to update capacity and button state
        renderClasses();
      } else {
        ToastService.show(response.message, 'error');
        btn.disabled = false;
        btn.textContent = originalText;
      }
    }
  });

});
