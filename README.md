# Emerald HRMS - Quick Start Guide

Welcome to Emerald HRMS! This is a simple, premium Human Resource Management System running locally in your browser.

## Getting Started

1. **Start the server:** 
   Run `npx serve` in the project directory using your terminal. This is required because modern web browsers block certain JavaScript modules (like Babel compilation) if you just double-click the `index.html` file.
2. **Open the app:** 
   Go to `http://localhost:3000` in your browser.
   
*Note: If you make changes to the files, you MUST use a **Hard Refresh** (`Ctrl` + `Shift` + `R` on Windows, or `Cmd` + `Shift` + `R` on Mac) so your browser pulls the latest changes instead of its cached memory.*

## How to Log In

There are two default mock accounts you can use to test the system:

**1. Employee Login**
- **Login ID or Email:** `EMP001` or `employee@emerald.com`
- **Password:** `password123`
- *Use this to view attendance, request leaves, view payslips, and check your profile.*

**2. HR / Admin Login**
- **Login ID or Email:** `HR001` or `hr@emerald.com`
- **Password:** `password123`
- *Use this to view the overall company dashboard, manage employees, approve/reject leaves, and generate payroll.*

**Note on New Employees:** 
When an HR Admin creates a new employee, the system automatically generates a strict Login ID (e.g., `EMSUMO20260001`). The new employee must use this generated ID or their registered email to sign in.

## Features & Usage

### For Employees
- **Dashboard:** Gives you a quick overview of your profile and quick links to modules.
- **Attendance:** Click "Check In" when you arrive and "Check Out" when you leave. You can view your monthly calendar and history.
- **Leave:** Submit new leave requests (sick leave, casual leave, etc.) and view the status of pending/past requests.
- **Payroll:** View your latest payslip, complete with basic pay, allowances, and deductions.
- **Profile:** View your personal info. If you hover over your large profile initials, you can upload a profile picture.

### For HR / Admins
- **Dashboard:** A bird's-eye view of headcount, attendance rates, and pending actions.
- **Employees:** A list of all active staff. Click "Manage" to edit their personal or job details.
- **Attendance Overview:** See a log of everyone who checked in or out today.
- **Leave Approvals:** See all pending leave requests and instantly "Approve" or "Reject" them.
- **Payroll Management:** Generate the payload for all employees for the current month. Click the "Generate Payload" button to process salaries automatically based on the employees' basic pay configuration.

## Customization

The core UI is built entirely in React and Tailwind CSS without complex build steps.
- **Adding new routes:** See `router/HashRouter.jsx` and `app.jsx`.
- **Modifying styles:** Check `index.css` for custom color palettes (e.g., deep black `#0A0A0B` and gold accents `#C9A34E`).
- **Changing Mock Data:** To add new employees or modify existing histories, edit `services/mockData.js`.
