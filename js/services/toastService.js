export const ToastService = {
  createToastContainer() {
    let container = document.getElementById('byem-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'byem-toast-container';
      document.body.appendChild(container);
    }
    return container;
  },

  show(message, type = 'success', duration = 3500) {
    const container = this.createToastContainer();
    const toast = document.createElement('div');
    
    // Assign classes for styling and animation
    toast.className = `byem-toast toast-${type}`;
    
    // Icon logic based on type
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-message">${message}</div>
      <button class="toast-close">&times;</button>
    `;

    container.appendChild(toast);

    // Trigger animation (next frame to ensure transition plays)
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Close button listener
    toast.querySelector('.toast-close').addEventListener('click', () => {
      this.dismiss(toast);
    });

    // Auto dismiss
    setTimeout(() => {
      if (toast.parentElement) {
        this.dismiss(toast);
      }
    }, duration);
  },

  dismiss(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 300); // Wait for fade-out animation
  }
};