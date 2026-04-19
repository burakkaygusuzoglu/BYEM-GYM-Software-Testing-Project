# Software Testing Documentation - BYEM GYM

## 1. Introduction
This document outlines the testing strategy, test scenarios, and results for the BYEM GYM Management System. The application relies heavily on Vanilla JS and `localStorage`, so testing focuses on data persistence, DOM rendering accurately reading state, and stringent route protection.

## 2. Test Approach
*   **Manual UI/UX Testing:** Verifying responsive layouts, CSS interactions (hover states), and consistent aesthetics.
*   **Functional Testing:** Testing CRUD operations, authentication processes, and specific gym logic (e.g., booking capacities).
*   **Security Testing:** Exploiting the URL bar to bypass authentication checks.

---

## 3. Test Cases (Functional & Security)

### **Module 1: Authentication & Authorization (`authService.js`, `guard.js`)**

| Test ID | Scenario | Steps to Execute | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | User Registration | 1. Go to Register.<br>2. Fill unique email.<br>3. Submit. | Account created, redirected to Login. | ✅ PASS |
| **TC-02** | Duplicate Email | 1. Go to Register.<br>2. Use existing email. | Error prompt: "Email already exists." | ✅ PASS |
| **TC-03** | Login Success | 1. Go to Login.<br>2. Enter valid credentials. | Redirected to `/dashboard/member.html`. | ✅ PASS |
| **TC-04** | Route Protection | 1. Log out.<br>2. Manually type `.../dashboard/member.html`. | Immediate redirect to `/auth/login.html`. | ✅ PASS |
| **TC-05** | Admin Authorization | 1. Log in as Member.<br>2. Type `.../dashboard/admin.html`. | Redirect back to Member Dashboard. | ✅ PASS |

### **Module 2: Membership & Payments (`membershipService.js`)**

| Test ID | Scenario | Steps to Execute | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-06** | Access without Sub | 1. Log in as new Member.<br>2. Try booking a class. | Alert denying access, redirect to upgrade. | ✅ PASS |
| **TC-07** | Payment Simulation | 1. Go to `/payment.html`.<br>2. Submit dummy card data. | Simulated loading time, updates `Store`, redirect to dashboard. | ✅ PASS |
| **TC-08** | Access with Sub | 1. As active member, view Dashboard. | Dashboard shows "ACTIVE" with expiration date. | ✅ PASS |

### **Module 3: Class Bookings (`bookingService.js`)**

| Test ID | Scenario | Steps to Execute | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-09** | Valid Booking | 1. Click 'Reserve' on a class. | Enrolled count increases, button changes state. | ✅ PASS |
| **TC-10** | Duplicate Booking | 1. Click 'Reserve' again on same class. | Alert denying duplicate action. | ✅ PASS |
| **TC-11** | Class Full | 1. Set class capacity to `enrolled`.<br>2. Attempt booking. | Button disabled, visually marked as "FULL". | ✅ PASS |
| **TC-12** | Cancellation | 1. Go to Dashboard.<br>2. Click 'Cancel Booking'. | Class removed from list, enrollment decreases by 1. | ✅ PASS |

### **Module 4: Admin Dashboard (`admin.js`)**

| Test ID | Scenario | Steps to Execute | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-13** | Delete User | 1. Admin logs in.<br>2. Clicks 'Delete' on user. | User removed from `Store`, UI updates natively. | ✅ PASS |
| **TC-14** | Create Class | 1. Fill 'Create Class' form.<br>2. Submit. | Class saves to `Store`, spawns visually on page. | ✅ PASS |
| **TC-15** | Cascade Deletion | 1. Admin deletes a Class.<br>2. Check Member dashboard. | Class is wiped; any member who booked it loses the booking dynamically. | ✅ PASS |

---

## 4. Known Limitations & Future Roadmap
*   **Database Volatility:** Because `localStorage` is tied to the specific browser loop, clearing cache will wipe all seeded gym data. Future updates should include an Express.js/Node API backend.
*   **Password Security:** Passwords use a mock `btoa()` base64 hashing technique. Production should rely on `bcrypt` on a secured server.
*   **Email Validation:** Currently limits domain-level string checks. Does not send real confirmation emails.