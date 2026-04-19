export const Store = {
  // KEYS
  KEYS: {
    USERS: 'byem_users',
    SESSION: 'byem_session',
    CLASSES: 'byem_classes',
    BOOKINGS: 'byem_bookings'
  },

  // GETTER
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error(`Error reading ${key} from LocalStorage`, e);
      return null;
    }
  },

  // SETTER
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing ${key} to LocalStorage`, e);
    }
  },

  // REMOVER
  remove(key) {
    localStorage.removeItem(key);
  },

  // SEED INITIAL DATA
  init() {
    let users = this.get(this.KEYS.USERS);
    if (!users) {
      users = [];
      this.set(this.KEYS.USERS, users);
    }

    // Ensure a default admin exists
    const adminExists = users.find(u => u.role === 'admin');
    if (!adminExists) {
      users.push({
        id: 'admin_1',
        fullName: 'System Administrator',
        email: 'admin@byemgym.com',
        // 'admin123' hashed with our mock hasher: btoa('admin123').substring(0,20) = YWRtaW4xMjM=
        password: btoa('admin123').substring(0, 20),
        role: 'admin',
        membership: { status: 'active', planId: 'black', expiresAt: '2099-12-31T23:59:59Z' }
      });
      this.set(this.KEYS.USERS, users);
    }

    if (!this.get(this.KEYS.CLASSES)) {
      this.set(this.KEYS.CLASSES, [
        { id: 'c_1', name: 'Elite HIIT', trainer: 'Marcus Vance', schedule: 'Mon/Wed 18:00', capacity: 20, booked: 0 },
        { id: 'c_2', name: 'Power Lifting', trainer: 'Sarah Jenkins', schedule: 'Tue/Thu 19:00', capacity: 15, booked: 0 },
        { id: 'c_3', name: 'Recovery Yoga', trainer: 'Emma Cole', schedule: 'Fri 07:00', capacity: 25, booked: 0 },
      ]);
    }
    if (!this.get(this.KEYS.BOOKINGS)) {
      this.set(this.KEYS.BOOKINGS, []);
    }
  }
};
