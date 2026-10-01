# 👑 Siddartha Palace — Hotel Management System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-2ea44f?style=for-the-badge&logo=github)](https://siddarthabeemaneni.github.io/Hotel-Management/siddartha-palace/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-SiddarthaBeemaneni%2FHotel--Management-181717?style=for-the-badge&logo=github)](https://github.com/SiddarthaBeemaneni/Hotel-Management)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)

> 🌐 **Live Website**: **[https://siddarthabeemaneni.github.io/Hotel-Management/siddartha-palace/](https://siddarthabeemaneni.github.io/Hotel-Management/siddartha-palace/)**

A full-stack hotel and PG management web application built with **HTML/CSS/JS + Express.js + MySQL + Twilio**.

---

## 🔐 Demo Access

| Role | URL | Credentials |
|------|-----|-------------|
| **Customer** | `/login.html` → Customer tab | Register or use Google Sign-In |
| **Super Admin** | `/login.html` → Admin tab | Name: `Siddarth` · Email: `siddarthabeemaneni@gmail.com` · Password: `thor_8981` |

> ⚠️ Admin access is strictly locked — only the exact credentials above will open the dashboard.

---

## ✨ Features

### Public Website
- **Landing page** — Hero, amenities, testimonials, room preview
- **Rooms & Suites** — Search/filter by dates & type, book instantly
- **Gallery, About, FAQ, Contact, Policies** — Full marketing pages
- **Booking form** — Multi-step guest & stay details checkout

### Customer Dashboard
- Overview with loyalty tier, upcoming stays, pending payments
- My Bookings — view, cancel, download invoices
- Payments — pay now, download receipts
- Profile management & support contact form

### Admin Dashboard
- **Overview KPIs** — Monthly income, occupancy rate, active bookings, pending payments
- **Customers** — Search, add, edit, delete guest records
- **Rooms** — Manage room inventory and status
- **Bookings** — Approve, modify, cancel bookings
- **Payments** — Mark as paid, generate invoices
- **SMS Reminders** — Manual trigger + monthly schedule + delivery log

### Backend API (Express + MySQL)
| Route | Methods | Description |
|-------|---------|-------------|
| `/api/auth/login` | POST | Customer & Super Admin login |
| `/api/auth/register` | POST | Customer registration |
| `/api/auth/google` | POST | Google Sign-In |
| `/api/auth/customers` | GET | List all registered customers |
| `/api/auth/profile` | GET | Fetch customer profile |
| `/api/auth/forgot-password/*` | POST | OTP-based password reset |
| `/api/rooms` | GET, POST, PUT, DELETE | Room CRUD |
| `/api/tenants` | GET, POST, PUT, DELETE | Tenant CRUD |
| `/api/payments` | GET, POST, PUT | Rent payment management |
| `/api/bookings` | GET, POST | Booking creation & listing |
| `/api/bookings/:code/cancel` | PUT | Cancel a booking |
| `/api/reminders/send-now` | POST | Manually trigger SMS/WhatsApp reminders |
| `/api/reminders/log` | GET | View reminder delivery history |
| `/api/reminders/status` | GET | Cron and Twilio config status |
| `/api/health` | GET | Server health & diagnostics |

### Automated Rent Reminders (Twilio)
- Daily cron at 9:00 AM (days 1–5 of month)
- Sends personalised SMS + WhatsApp to tenants with pending/partial rent
- Dry-run mode when Twilio credentials are absent (logs to console)
- Duplicate prevention — won't re-send to same tenant on same day

### Resilience & High Availability
- **Active-Active Dual-Layer Storage** — MySQL primary + JSON file fallback
- **Auto-reconnect** — Exponential backoff on DB connection failure
- **Crash protection** — Global `uncaughtException` & `unhandledRejection` handlers
- **Rate limiting** — 500 req/min per IP with token bucket algorithm
- **Response compression** — Gzip/Brotli via `compression` middleware

---

## 🏗️ Project Structure

```
siddartha-palace/
├── assets/
│   ├── images/               # Room & palace photography
│   ├── styles.css            # Global design system
│   └── script.js             # Shared JS (tabs, modals, animations)
├── db/
│   ├── schema.sql            # MySQL table definitions, views, triggers
│   ├── seed.sql              # Sample data for demo/testing
│   ├── procedures.sql        # Stored procedures
│   └── optimize_performance.sql
├── server/
│   ├── index.js              # Express app entry point
│   ├── db.js                 # MySQL connection pool + executeWithRetry
│   ├── .env.example          # Environment variable template
│   ├── data/
│   │   ├── customers.json    # Persistent customer storage (fallback)
│   │   └── bookings.json     # Persistent booking storage (fallback)
│   ├── middleware/
│   │   └── concurrencyShield.js  # Rate limiting + metrics
│   ├── routes/
│   │   ├── auth.js           # /api/auth — login, register, OTP
│   │   ├── bookings.js       # /api/bookings
│   │   ├── rooms.js          # /api/rooms
│   │   ├── tenants.js        # /api/tenants
│   │   ├── payments.js       # /api/payments
│   │   └── reminders.js      # /api/reminders
│   ├── services/
│   │   ├── storageEngine.js  # In-memory + disk persistence layer
│   │   ├── reminderService.js # Cron + reminder logic
│   │   ├── emailService.js   # Nodemailer email dispatcher
│   │   └── twilioClient.js   # SMS/WhatsApp wrapper
│   └── scripts/
│       └── init_db.js        # DB migration runner
├── index.html                # Landing page
├── rooms.html                # Room listing & search
├── booking.html              # Booking checkout
├── login.html                # Sign-in / register / OTP recovery
├── admin-dashboard.html      # Admin console
├── customer-dashboard.html   # Guest portal
├── gallery.html
├── about.html
├── faq.html
├── contact.html
└── policies.html
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18
- **MySQL** ≥ 8.0 (optional — app works offline with JSON fallback)
- **Twilio account** (optional — runs in dry-run mode without it)

### 1. Clone & install
```bash
git clone https://github.com/SiddarthaBeemaneni/Hotel-Management.git
cd Hotel-Management/siddartha-palace/server
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your MySQL credentials and (optionally) Twilio keys
```

**.env example:**
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=siddartha_palace

EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password

# Leave blank to run without Twilio (dry-run mode)
TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_SMS_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=+1234567890
```

### 3. (Optional) Set up the database
```bash
# Run full migration (schema + seed + procedures)
node scripts/init_db.js

# Or manually:
mysql -u root -p < ../../db/schema.sql
mysql -u root -p siddartha_palace < ../../db/seed.sql
```

### 4. Start the server
```bash
# Development (auto-reload on file change)
npm run dev

# Production
npm start
```

Open **http://localhost:3000** in your browser.

---

## 🔔 SMS / WhatsApp Reminders

Reminders run automatically at **9:00 AM on days 1–5 of each month**.

| Env Variable | Default | Description |
|---|---|---|
| `REMINDER_CRON` | `0 9 * * *` | Cron expression |
| `REMINDER_START_DAY` | `1` | First day of month to send |
| `REMINDER_END_DAY` | `5` | Last day of month to send |

**Without Twilio credentials** — messages are logged to the console (dry-run).  
**With Twilio credentials** — live SMS + WhatsApp are sent.

Trigger manually from **Admin Dashboard → SMS Reminders → Send Now**, or via:
```bash
curl -X POST http://localhost:3000/api/reminders/send-now
```

---

## 🎨 Design System

- **Palette** — Deep ink (`#1B1030`), gold (`#C9A227`), ivory (`#FBF8F1`), maroon (`#8B1A2F`)
- **Typography** — Cormorant Garamond (headings), Inter (body) via Google Fonts
- **Components** — Buttons, badges, panels, modals, tabs, data tables, progress bars, form fields
- **Animations** — Page loader, scroll-reveal, counter, bar charts, micro-interactions

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, Vanilla CSS, Vanilla JS |
| Backend | Node.js 18+, Express 4 |
| Database | MySQL 8 (mysql2 driver) |
| Fallback Storage | JSON files (Active-Active dual layer) |
| Email | Nodemailer (Gmail / SMTP) |
| Messaging | Twilio (SMS + WhatsApp) |
| Indian SMS | Fast2SMS gateway |
| Scheduler | node-cron |
| Config | dotenv |
| Compression | compression (Gzip/Brotli) |

---

## 📋 Changelog

### v2.0.0 — 2026-10-01
- 🔐 **Strict Super Admin auth gate** — name + email + password must all match exactly (frontend + backend)
- 🛡️ **Crash-proof routes** — rooms, payments, tenants, reminders now return `503` JSON when MySQL is offline instead of crashing
- 🔧 **Concurrency fix** — `finish`+`close` double-decrement bug in metrics middleware fixed
- 🗺️ **404 handler** — unmatched `/api/*` routes return JSON (not HTML)
- 📊 **DB init fix** — `init_db.js` verification now queries correct table names
- 🔑 **Consistent credentials** — storageEngine default accounts aligned with enforced auth
- 🖼️ **New assets** — palace hero images added

### v1.0.0 — 2026-08-28
- Initial release: full hotel management platform with booking, auth, dashboards, SMS reminders

---

© 2026 Siddartha Palace. All rights reserved.
