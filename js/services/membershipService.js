import { Store } from '../data/store.js';

export const MembershipService = {
  activateMembership(userId, planId) {
    const users = Store.get(Store.KEYS.USERS) || [];
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return { success: false, message: 'Critical error: User session not matched to database.' };
    }
    
    // Simulate a 1-month membership activation
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    
    users[userIndex].membership = {
      status: 'active',
      planId: planId,
      expiresAt: expiryDate.toISOString()
    };
    
    // Save back to LocalStorage
    Store.set(Store.KEYS.USERS, users);
    
    return { success: true, message: 'Payment successful. Membership activated.' };
  },

  getPlanDetails(planId) {
    const plans = {
      essential: { name: 'Essential', price: 49.00 },
      elite: { name: 'Elite (Pro)', price: 99.00 },
      black: { name: 'Black Card', price: 189.00 }
    };
    return plans[planId] || plans['essential'];
  }
};
