# BYEM GYM - Premium Gym Management System

## Overview
BYEM GYM is a premium, web-based gym management system built entirely with **Vanilla HTML, CSS, and ES6 JavaScript**. It features a custom glassmorphism design system and relies on HTML5 `localStorage` as a mock database. The project was designed from the ground up without any external libraries or frameworks (No React, Vue, Bootstrap, or Tailwind).

This application handles user authentication, membership subscriptions, class scheduling capabilities, and features a fully functional Administrative CRUD interface.

## Core Features
1. **Public Marketing Pages**: High-end landing, memberships, classes, and contact pages.
2. **Secure Authentication**: End-to-end user registration and login with mock hashed passwords.
3. **Role-Based Access Control**: `guard.js` route interceptor protecting member and admin dashboards.
4. **Subscription System**: Payment simulator that activates member profiles algorithmically.
5. **Booking Engine**: Dynamic class scheduling, capacity limits, and duplicate-booking prevention.
6. **Member Dashboard**: Personalized hub for users to view active memberships and cancel their booked classes.
7. **Admin Portal**: A dedicated CRUD interface for administrators to manage the class schedule and delete member accounts.

## Tech Stack
*   **Structure:** HTML5 (Multi-Page Architecture)
*   **Styling:** CSS3 (Custom Properties, Grid/Flexbox, Glassmorphism UI)
*   **Logic:** Vanilla ES6 JavaScript (Native Modules)
*   **Persistence:** LocalStorage API

## How to Run the Project
1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Install the **Live Server** extension (by Ritwick Dey).
4. Right-click on `index.html` and select **"Open with Live Server"**.
5. The application will safely launch and route securely.

## Default Accounts
Upon launching the application for the first time, the `Store.js` engine automatically seeds the following Admin credentials in your browser's LocalStorage:
*   **Admin Email:** `admin@byemgym.com`
*   **Admin Password:** `admin123`

You can freely register standard user accounts dynamically via the `/pages/auth/register.html` UI.

## Architecture
```text
├── assets/         # Images, icons, and static media
├── css/            # Custom CSS System (Variables, Layouts, Pages)
├── docs/           # Software Testing and Project Documentation
├── js/
│   ├── components/ # Dynamic DOM Injectors (Navbar, Footer)
│   ├── core/       # Global utilities (Guard route protection)
│   ├── data/       # LocalStorage wrapper (Store.js)
│   ├── pages/      # Page-specific controllers
│   └── services/   # Business logic (Auth, Booking, Membership)
├── pages/          # HTML Views (Dashboards, Auth, Member, Admin)
└── index.html      # Main Entry Point
```