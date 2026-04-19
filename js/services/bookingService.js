import { Store } from '../data/store.js';

export const BookingService = {
  getClasses() {
    return Store.get(Store.KEYS.CLASSES) || [];
  },

  getAllBookings() {
    return Store.get(Store.KEYS.BOOKINGS) || [];
  },

  getUserBookings(userId) {
    const bookings = this.getAllBookings();
    return bookings.filter(b => b.userId === userId);
  },

  isBookedByUser(userId, classId) {
    const bookings = this.getAllBookings();
    return bookings.some(b => b.userId === userId && b.classId === classId);
  },

  bookClass(userId, classId) {
    // 1. Verify User and Membership
    const users = Store.get(Store.KEYS.USERS) || [];
    const user = users.find(u => u.id === userId);

    if (!user) {
      return { success: false, message: 'User not found. Please log in again.' };
    }

    if (!user.membership || user.membership.status !== 'active') {
      return { success: false, message: 'Active membership required to book classes. Please upgrade your plan.' };
    }

    // 2. Verify Class capacity
    const classes = this.getClasses();
    const classIndex = classes.findIndex(c => c.id === classId);
    
    if (classIndex === -1) {
      return { success: false, message: 'Class not found.' };
    }

    const targetClass = classes[classIndex];

    if (targetClass.booked >= targetClass.capacity) {
      return { success: false, message: 'This class is currently at full capacity.' };
    }

    // 3. Check for Duplicate Booking
    if (this.isBookedByUser(userId, classId)) {
      return { success: false, message: 'You have already reserved a spot in this class.' };
    }

    // 4. Process Booking
    const bookings = this.getAllBookings();
    const newBooking = {
      id: 'b_' + Date.now(),
      userId: userId,
      classId: classId,
      status: 'reserved',
      timestamp: new Date().toISOString()
    };

    bookings.push(newBooking);
    
    // Update class inventory
    targetClass.booked += 1;
    classes[classIndex] = targetClass;

    // Save to Store
    Store.set(Store.KEYS.BOOKINGS, bookings);
    Store.set(Store.KEYS.CLASSES, classes);

    return { success: true, message: `Successfully reserved a spot in ${targetClass.name}.` };
  },

  cancelBooking(bookingId) {
    let bookings = this.getAllBookings();
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex === -1) {
      return { success: false, message: 'Booking not found.' };
    }

    const targetBooking = bookings[bookingIndex];

    // Remove booking
    bookings.splice(bookingIndex, 1);
    Store.set(Store.KEYS.BOOKINGS, bookings);

    // Free up inventory
    const classes = this.getClasses();
    const classIndex = classes.findIndex(c => c.id === targetBooking.classId);
    
    if (classIndex !== -1 && classes[classIndex].booked > 0) {
      classes[classIndex].booked -= 1;
      Store.set(Store.KEYS.CLASSES, classes);
    }

    return { success: true, message: 'Reservation cancelled successfully.' };
  }
};
