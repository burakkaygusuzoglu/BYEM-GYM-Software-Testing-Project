# 🏋️ BYEM GYM Software Testing & Quality Assurance Project

> Comprehensive QA project for the **BYEM GYM Web-Based Management System**, covering **manual testing, defect reporting, Selenium automation, and Apache JMeter performance testing**.

---

## 📌 Project Overview

This repository contains a complete **Software Quality Assurance & Testing Project** conducted for the BYEM GYM web application.

The goal of this project was to evaluate the system’s quality, reliability, functionality, and performance using industry-standard testing practices.

The project includes:

✅ Test Planning  
✅ Functional Test Cases  
✅ Bug Reporting  
✅ Selenium Automation Testing  
✅ Apache JMeter Performance Testing  
✅ Final QA Evaluation Report

---

## 🖥️ System Under Test

**BYEM GYM Web-Based Management System** is a fitness management platform designed for gym members and administrators.

Main features include:

- User Registration
- Secure Login System
- Membership Plan Selection
- Booking Classes
- Reservation Management
- Dashboard Access
- Role-Based Navigation

---

# 🧪 Testing Scope

The following software modules were tested:

| Module | Test Coverage |
|--------|---------------|
| Registration | Input validation, duplicate account checks |
| Login | Valid / invalid authentication |
| Membership | Plan selection workflow |
| Booking | Reservation process, duplicate booking |
| Dashboard | Access behavior and usability |
| UI/UX | Layout consistency and message visibility |

---

# 📋 Manual Testing

A structured set of functional and negative test cases were designed and executed.

### Example Test Cases

- Valid User Registration
- Existing Email Registration
- Valid Login
- Wrong Password Login
- Membership Plan Selection
- Successful Payment Flow
- Booking with Active Membership
- Duplicate Booking Attempt
- Cancel Booking
- Guest Access Restriction

---

# 🐞 Bug Reporting

Realistic defects were documented with severity classification and reproduction steps.

### Sample Reported Issues

- Footer layout appears visually incomplete
- Error messages displayed far from form area
- Seat availability counter unclear to users
- Zoom/responsive layout inconsistency

Each bug report includes:

- Severity
- Priority
- Reproduction Steps
- Expected Result
- Actual Result
- Screenshot Evidence

---

# 🤖 Automation Testing

Automation testing was implemented using **Selenium WebDriver**.

### Executed Automated Scenarios

| ID | Scenario | Result |
|----|----------|--------|
| AT-01 | Valid Login Test | ✅ Passed |
| AT-02 | Invalid Login Test | ✅ Passed |
| AT-03 | Duplicate Registration Test | ✅ Passed |

### Benefits Achieved

- Reduced repetitive manual execution
- Faster regression checks
- Reliable authentication validation

---

# ⚡ Performance Testing

Basic load testing was performed using **Apache JMeter**.

### Test Scenario

- Target: Login Page
- Virtual Users: 20
- Ramp-Up Time: 5 seconds
- Request Type: HTTP GET

### Result

✅ Stable performance under light concurrent traffic  
✅ No major failures observed

---

# 🛠️ Tools & Technologies

- **Manual Testing**
- **Selenium WebDriver**
- **Apache JMeter**
- **Google Chrome**
- **HTML / CSS / JavaScript**
- **VS Code**

---

# 📂 Repository Structure

```bash
BYEM-GYM-Software-Testing-Project/
│── README.md
│── Test_Plan.docx
│── Final_Test_Report.docx
│── automation/
│   ├── test_login.py
│   ├── test_invalid_login.py
│   └── test_duplicate_registration.py
│── screenshots/
│── jmeter/
