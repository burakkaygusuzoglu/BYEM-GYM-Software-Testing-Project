import { AuthService } from '../services/authService.js';
import { BookingService } from '../services/bookingService.js';
import { ToastService } from '../services/toastService.js';
import { Store } from '../data/store.js';

class AdminDashboard {
  constructor() {
    this.session = Store.get(Store.KEYS.SESSION);
    
    // UI Elements
    this.nameEl = document.getElementById('adminName');
    this.logoutBtn = document.getElementById('logoutBtn');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.panels = document.querySelectorAll('.admin-panel');
    
    // Users UI
    this.usersTableBody = document.getElementById('usersTableBody');
    
    // Classes UI
    this.classesGrid = document.getElementById('adminClassesGrid');
    this.btnCreateClass = document.getElementById('btnCreateClass');
    this.classFormContainer = document.getElementById('classFormContainer');
    this.btnCancelClass = document.getElementById('btnCancelClass');
    this.createClassForm = document.getElementById('createClassForm');

    this.init();
  }

  init() {
    if (!this.session || this.session.role !== 'admin') {
      window.location.replace('/pages/auth/login.html');
      return;
    }

    this.nameEl.textContent = this.session.fullName;
    this.setupListeners();
    this.renderUsers();
    this.renderClasses();
  }

  setupListeners() {
    // Logout
    this.logoutBtn.addEventListener('click', () => {
      AuthService.logout();
      window.location.replace('/');
    });

    // Sub-navigation
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active states
        this.navLinks.forEach(l => l.classList.remove('active'));
        this.panels.forEach(p => p.classList.add('hidden'));

        // Add active states
        e.target.classList.add('active');
        const targetId = e.target.getAttribute('data-target');
        document.getElementById(targetId).classList.remove('hidden');
      });
    });

    // Toggle Class Form
    this.btnCreateClass.addEventListener('click', () => {
      this.classFormContainer.classList.remove('hidden');
      this.btnCreateClass.classList.add('hidden');
    });

    this.btnCancelClass.addEventListener('click', () => {
      this.classFormContainer.classList.add('hidden');
      this.btnCreateClass.classList.remove('hidden');
      this.createClassForm.reset();
    });

    // Create Class Form Submit
    this.createClassForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleCreateClass();
    });

    // Delete Class Listener (Event Delegation)
    this.classesGrid.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) {
        const id = e.target.getAttribute('data-id');
        this.deleteClass(id);
      }
    });

    // Delete User Listener
    this.usersTableBody.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-user-btn')) {
        const id = e.target.getAttribute('data-id');
        this.deleteUser(id);
      }
    });
  }

  renderUsers() {
    const users = Store.get(Store.KEYS.USERS) || [];
    this.usersTableBody.innerHTML = users.map(user => `
      <tr>
        <td style="color: #888;">#${user.id.substring(0, 8)}</td>
        <td>
          <strong>${user.fullName}</strong><br>
          <small style="color: #aaa;">${user.email}</small>
        </td>
        <td><span class="badge ${user.role === 'admin' ? 'gold' : ''}">${user.role.toUpperCase()}</span></td>
        <td>
          ${user.role === 'admin' ? 'N/A' : `
            <span style="color: ${user.membership?.status === 'active' ? '#4ade80' : '#ff4d4d'}">
              ${(user.membership?.status || 'none').toUpperCase()}
            </span>
          `}
        </td>
        <td>
          ${user.role !== 'admin' ? `<button class="btn btn-outline delete-user-btn" style="padding: 0.25rem 0.5rem;" data-id="${user.id}">Delete</button>` : ''}
        </td>
      </tr>
    `).join('');
  }

  renderClasses() {
    const classes = BookingService.getAllClasses();
    this.classesGrid.innerHTML = classes.map(cls => `
      <div class="admin-class-card">
        <button class="delete-btn" data-id="${cls.id}">Delete</button>
        <h4 style="margin-bottom: 0.5rem; color: var(--gold);">${cls.name}</h4>
        <p style="margin-bottom: 0.5rem; color: #ccc;">Instructor: ${cls.trainer}</p>
        <div style="font-size: 0.85rem; color: #888; display: flex; flex-direction: column; gap: 0.25rem;">
          <span>🗓️ ${new Date(cls.date).toLocaleDateString()}</span>
          <span>⏰ ${cls.time}</span>
          <span>👥 Capacity: ${cls.enrolled}/${cls.capacity}</span>
        </div>
      </div>
    `).join('');
  }

  handleCreateClass() {
    const classes = BookingService.getAllClasses();
    
    const newClass = {
      id: 'cls_' + Date.now(),
      name: document.getElementById('className').value,
      trainer: document.getElementById('classTrainer').value,
      date: document.getElementById('classDate').value,
      time: document.getElementById('classTime').value,
      capacity: parseInt(document.getElementById('classCapacity').value, 10),
      enrolled: 0,
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // default fallback
    };

    classes.push(newClass);
    Store.set(Store.KEYS.CLASSES, classes);
    
    // Reset UI
    this.createClassForm.reset();
    this.classFormContainer.classList.add('hidden');
    this.btnCreateClass.classList.remove('hidden');
    
    // Re-render
    this.renderClasses();
    ToastService.show('Class created successfully!', 'success');
  }

  deleteClass(id) {
    if (confirm('Are you sure you want to delete this class? This will also remove any user bookings to it.')) {
      let classes = BookingService.getAllClasses();
      classes = classes.filter(c => c.id !== id);
      Store.set(Store.KEYS.CLASSES, classes);

      // Clean up bookings table for this class
      let bookings = Store.get(Store.KEYS.BOOKINGS) || [];
      bookings = bookings.filter(b => b.classId !== id);
      Store.set(Store.KEYS.BOOKINGS, bookings);

      this.renderClasses();
    }
  }

  deleteUser(id) {
    if (confirm('Are you sure you want to delete this member account?')) {
      let users = Store.get(Store.KEYS.USERS) || [];
      users = users.filter(u => u.id !== id);
      Store.set(Store.KEYS.USERS, users);

      // Clean up their bookings
      let bookings = Store.get(Store.KEYS.BOOKINGS) || [];
      
      // Decrease class enrollment count for each booking
      const userBookings = bookings.filter(b => b.userId === id);
      let classes = Store.get(Store.KEYS.CLASSES) || [];
      
      userBookings.forEach(ub => {
        const cls = classes.find(c => c.id === ub.classId);
        if (cls) cls.enrolled--;
      });
      Store.set(Store.KEYS.CLASSES, classes);

      // Remove their bookings
      bookings = bookings.filter(b => b.userId !== id);
      Store.set(Store.KEYS.BOOKINGS, bookings);

      this.renderUsers();
      this.renderClasses(); // update enrollment counts visually
    }
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new AdminDashboard();
});