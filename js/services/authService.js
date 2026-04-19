import { Store } from '../data/store.js';

export const AuthService = {
  // Simple mock hasher for frontend demo to avoid raw password text
  _hash(str) {
    return btoa(str).substring(0, 20); 
  },

  register(fullName, email, password) {
    const users = Store.get(Store.KEYS.USERS) || [];
    
    // Check if email uniquely exists
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: 'u_' + Date.now(),
      fullName,
      email,
      password: this._hash(password),
      role: 'member', // Default user role
      membership: {
        status: 'inactive', // defaults to inactive until simulated checkout
        planId: null,
      }
    };

    users.push(newUser);
    Store.set(Store.KEYS.USERS, users);
    
    return { success: true, message: 'Registration successful. You can now login.' };
  },

  login(email, password) {
    const users = Store.get(Store.KEYS.USERS) || [];
    const hashedPassword = this._hash(password);
    
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === hashedPassword);
    
    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }

    // Create session payload
    const session = {
      userId: user.id,
      token: 'mock_jwt_' + Math.random().toString(36).substring(2),
      role: user.role
    };

    Store.set(Store.KEYS.SESSION, session);
    return { success: true, user };
  },

  logout() {
    Store.remove(Store.KEYS.SESSION);
  },

  getSession() {
    return Store.get(Store.KEYS.SESSION);
  },

  getCurrentUser() {
    const session = this.getSession();
    if (!session) return null;
    const users = Store.get(Store.KEYS.USERS) || [];
    return users.find(u => u.id === session.userId) || null;
  }
};
