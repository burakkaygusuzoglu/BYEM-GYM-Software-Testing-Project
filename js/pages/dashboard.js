import { AuthService } from '../services/authService.js';
import { MembershipService } from '../services/membershipService.js';
import { BookingService } from '../services/bookingService.js';
import { ToastService } from '../services/toastService.js';

document.addEventListener('DOMContentLoaded', () => {
  const user = AuthService.getCurrentUser();
  if (!user) return; // Handled by guard.js anyway

  // 1. Setup Profile Data
  document.getElementById('dash-name').textContent = user.fullName;
  document.getElementById('dash-email').textContent = user.email;
  document.getElementById('dash-avatar').textContent = user.fullName.charAt(0).toUpperCase();

  // 2. Setup Membership Status
  const isMemberActive = user.membership && user.membership.status === 'active';
  const statusBadge = document.getElementById('dash-status');
  const actionContainer = document.getElementById('dash-action');
  
  if (isMemberActive) {
    const plan = MembershipService.getPlanDetails(user.membership.planId);
    statusBadge.textContent = 'Active Member';
    statusBadge.className = 'status-badge status-active';
    document.getElementById('dash-plan-name').textContent = plan.name;
    
    document.getElementById('dash-expiry-row').style.display = 'flex';
    const d = new Date(user.membership.expiresAt);
    document.getElementById('dash-plan-expiry').textContent = d.toLocaleDateString();

    actionContainer.innerHTML = '';
  } else {
    statusBadge.textContent = 'Inactive Account';
    statusBadge.className = 'status-badge status-inactive';
    document.getElementById('dash-plan-name').textContent = 'None Selected';
    
    actionContainer.innerHTML = `
      <a href="/pages/memberships.html" class="btn btn-primary btn-block">Purchase Plan</a>
    `;
  }

  // 3. Setup Bookings
  const renderBookings = () => {
    const container = document.getElementById('dash-bookings-container');
    const myBookings = BookingService.getUserBookings(user.id);
    const classesData = BookingService.getClasses();
    
    if (myBookings.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="text-align: center; padding: var(--space-8) 0; color: var(--text-secondary);">
          <div style="font-size: 3rem; margin-bottom: var(--space-4); opacity: 0.5;">🗓️</div>
          <h4 style="margin-bottom: var(--space-2); color: var(--text-primary);">No Upcoming Classes</h4>
          <p style="margin-bottom: var(--space-6);">Your itinerary is currently empty. Explore our classes and start sweating!</p>
          <a href="/pages/classes.html" class="btn btn-outline" style="border-color: var(--accent-gold); color: var(--accent-gold);">View Schedule</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display: flex; gap: var(--space-4); flex-direction: column;">
        ${myBookings.map(booking => {
          const cls = classesData.find(c => c.id === booking.classId);
          if (!cls) return '';

          return `
            <div class="booking-item" style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-4); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: rgba(255,255,255,0.02); transition: transform var(--transition-fast);">
              <div class="booking-info">
                <h4 class="text-gold" style="font-family: var(--font-display); font-size: 1.25rem; margin-bottom: var(--space-1);">${cls.name}</h4>
                <p class="text-secondary" style="font-size: 0.9rem; display: flex; gap: var(--space-3);    align-items: center;">
                  <span>👤 ${cls.trainer}</span>
                  <span style="color: var(--glass-border);">|</span>
                  <span>⏰ ${new Date(cls.date).toLocaleDateString()} at ${cls.time}</span>
                </p>
              </div>
              <div>
                <button class="btn btn-outline cancel-btn" data-id="${booking.id}" style="border-color: var(--accent-danger); color: var(--accent-danger); padding: 0.5rem 1rem;">Cancel Spot</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  };

  renderBookings();

  // 4. Handle Cancellations
  document.getElementById('dash-bookings-container').addEventListener('click', async (e) => {
    if (e.target.classList.contains('cancel-btn')) {
      const btn = e.target;
      const bId = btn.getAttribute('data-id');
      
      // UX Confirmation
      if(!confirm("Are you sure you want to cancel this booking?")) return;

      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Canceling...';

      // Simulate slight delay
      await new Promise(resolve => setTimeout(resolve, 400));

      const res = BookingService.cancelBooking(bId);

      if (res.success) {
        ToastService.show(res.message, 'success');
        renderBookings();
      } else {
        ToastService.show(res.message, 'error');
        btn.disabled = false;
        btn.textContent = originalText;
      }
    }
  });

});
