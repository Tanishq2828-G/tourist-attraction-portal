# Tourist Attraction Information Service Portal

> **College Academic Project**  
> A complete, modern, responsive, and functional web application for discovering Indian tourist destinations, exploring iconic attractions, viewing verified visitor guidance, and planning trips.

---

## 1. Project Overview

The **Tourist Attraction Information Service Portal** is a full-stack web application developed as an academic capstone project. It bridges the gap between travelers and authentic tourism information across India, with special emphasis on the architectural, historical, and natural marvels of **Telangana** as well as renowned national destinations.

Unlike static UI mockups, this portal operates on a live Node.js and Express backend with persistent SQLite database storage, dynamic RESTful APIs, client-side bookmarking, input-validated contact communication, and an optional administrative control panel.

---

## 2. Project Objectives

- **Consolidate Regional Tourism Data:** Deliver structured, high-quality information covering heritage monuments, sacred temples, hill stations, beaches, waterfalls, and nature sanctuaries.
- **Dynamic Search & Filtering:** Enable multi-criteria filtering by state, category, and keyword search using parameterized SQL queries.
- **Actionable Visitor Insights:** Provide realistic visiting hours, entry fees, optimal travel seasons, recommended durations, and direct Google Maps navigation.
- **Data Persistence:** Store visitor inquiries in SQLite and preserve tourist favorite destinations in browser storage without forcing account creation.
- **Academic Demonstration:** Present clean, maintainable, modular code adhering to industry standards.

---

## 3. Technology Stack

### Frontend
- **HTML5:** Semantic document structuring, accessibility tags, and clean layout.
- **CSS3:** Custom responsive styling, CSS variables, gradient hero sections, hover micro-interactions, and loading skeletons.
- **JavaScript (ES6+):** Modular asynchronous Fetch API requests, DOM manipulation, custom event buses, and `localStorage`.
- **Bootstrap 5.3:** Mobile-responsive 12-column grid system, modals, and responsive navigation collapse.
- **Font Awesome 6:** Vector iconography for facilities, categories, and controls.

### Backend
- **Node.js:** Asynchronous event-driven JavaScript runtime environment.
- **Express.js (v5):** REST API endpoints, static file serving, and middleware pipelines.
- **CORS & Dotenv:** Cross-origin request management and environment variable abstraction.

### Database
- **SQLite (via `better-sqlite3`):** High-performance, zero-configuration serverless relational database with WAL (Write-Ahead Logging) journaling and parameterized SQL queries.

---

## 4. Key Features

1. **Discover Amazing Destinations (Home Page):**
   - Immersive hero section with destination search bar and quick-search chips.
   - Live portal metrics counters (total destinations, categories, states).
   - Dynamic featured attractions grid (8+ sample destinations).
   - Interactive category cards with instant filter links.
   - Portal highlight modules and travel inspiration banner.

2. **Explore Destinations Page:**
   - Real-time debounced search by name, city, state, or description.
   - Multi-category filtering (Historical Monuments, Temples, Beaches, Hill Stations, Waterfalls, Wildlife, Museums, Adventure, Nature).
   - State-wise filtering (Telangana, Andhra Pradesh, Uttar Pradesh, Delhi, Rajasthan, etc.).
   - Alphabetical (A-Z, Z-A) and recent sorting.
   - Instant "Clear Filters" reset button.
   - Paginated "Load More" controls.
   - Friendly empty-state illustration when no destinations match.

3. **Destination Details Page:**
   - Dynamic data loading via URL query parameter (`?id=X`).
   - High-resolution hero image with interactive multi-image thumbnail gallery.
   - Comprehensive historical context and architectural descriptions.
   - Key visitor facts table: opening hours, entry fee, best time to visit, recommended duration, accessibility notes, and GPS coordinates.
   - Available facilities rendered as stylized icon tags (Parking, Restrooms, Guides, etc.).
   - Curated visitor tips and nearby attraction recommendations.
   - One-click **Get Directions on Google Maps** button opening live coordinates.
   - Interactive favorite bookmarking toggle.

4. **Saved Favorites Page:**
   - Client-side persistence using `localStorage`.
   - Real-time updates without page reloads.
   - One-click removal and "Clear All Favorites" confirmation dialog.
   - Clean empty state directing visitors back to the destination catalog.

5. **Essential Travel Tips Page:**
   - Organized guidance cards covering Trip Planning, Packing Essentials, Local Transportation (Metro, RTC buses, scenic trains), Safety Guidelines, and Emergency Helplines (112, 100, 108, 1363).
   - Environmental protection tips and responsible tourism practices.
   - Prominent disclaimer urging travelers to verify official visiting schedules.

6. **About Us Page:**
   - Academic context, project purpose, technical breakdown, and software architecture.
   - Formatted for college evaluation and viva demonstrations.

7. **Contact Us Page:**
   - Multi-field contact form (Name, Email, Subject, Message).
   - Strict client-side and server-side validation.
   - Direct persistence into SQLite `contact_messages` table.
   - Interactive alerts confirming successful storage.

8. **Admin Management Dashboard (Optional Extension):**
   - Protected behind an administrator secret key (`ADMIN_KEY`).
   - Summary statistics and directory overview.
   - Create new destination record modal with full form validation.
   - Edit existing destination records.
   - Delete destination records with confirmation.
   - View visitor contact submissions.

---

## 5. Project Folder Structure

```
tourist-attraction-portal/
├── public/
│   ├── index.html                   # Home Landing Page
│   ├── destinations.html            # Explore Destinations & Filters
│   ├── destination-details.html     # Comprehensive Attraction View
│   ├── about.html                   # Academic Project & Purpose
│   ├── contact.html                 # Contact Form & Helpdesk
│   ├── favorites.html               # Saved Favorites Wishlist
│   ├── travel-tips.html             # Travel Guidance & Safety
│   ├── admin.html                   # Admin Dashboard Console
│   │
│   ├── css/
│   │   └── style.css                # Custom Responsive Theme Stylesheet
│   │
│   ├── js/
│   │   ├── api.js                   # Centralized Fetch API Service Helper
│   │   ├── app.js                   # Global Helpers, Favorites, Toasts, Cards
│   │   ├── destinations.js          # Catalog Search, Filter, Sort, Pagination
│   │   ├── destination-details.js   # Dynamic Detail View & Gallery Logic
│   │   ├── favorites.js             # LocalStorage Wishlist Logic
│   │   ├── contact.js               # Form Validation & API Submission
│   │   └── admin.js                 # Admin Authentication & CRUD Controller
│   │
│   └── images/
│       └── placeholder.svg          # Fallback SVG Illustration
│
├── database/
│   ├── database.js                  # SQLite Connection & Table Schemas
│   ├── seed.js                      # Idempotent Sample Seeding (19 Attractions)
│   └── tourist_portal.db            # Persistent SQLite Database (auto-generated)
│
├── routes/
│   ├── destinations.js              # REST Endpoints for Destinations & CRUD
│   └── contact.js                   # REST Endpoints for Contact Submissions
│
├── server.js                        # Express Server & Static File Host
├── test-endpoints.js                # Automated E2E REST & Static Test Suite
├── package.json                     # Project Manifest & NPM Scripts
├── .env.example                     # Environment Configuration Template
├── .env                             # Local Environment Configuration
├── .gitignore                       # Git Exclusion Rules
└── README.md                        # Project Documentation
```

---

## 6. Sample Tourist Destinations Included

The database is pre-seeded with 19 realistic destinations across 10 Indian states:

| # | Attraction Name | City | State | Category |
|---|---|---|---|---|
| 1 | **Charminar** | Hyderabad | Telangana | Historical Monuments |
| 2 | **Golconda Fort** | Hyderabad | Telangana | Historical Monuments |
| 3 | **Ramoji Film City** | Hyderabad | Telangana | Adventure Destinations |
| 4 | **Thousand Pillar Temple** | Hanamkonda | Telangana | Temples and Religious Places |
| 5 | **Ramappa Temple** | Palampet | Telangana | Temples and Religious Places |
| 6 | **Nagarjuna Sagar Dam** | Nalgonda | Telangana | Lakes and Natural Attractions |
| 7 | **Tirumala Venkateswara Temple** | Tirupati | Andhra Pradesh | Temples and Religious Places |
| 8 | **Taj Mahal** | Agra | Uttar Pradesh | Historical Monuments |
| 9 | **Red Fort (Lal Qila)** | Delhi | Delhi | Historical Monuments |
| 10 | **Hawa Mahal** | Jaipur | Rajasthan | Historical Monuments |
| 11 | **Gateway of India** | Mumbai | Maharashtra | Historical Monuments |
| 12 | **Mysore Palace** | Mysuru | Karnataka | Historical Monuments |
| 13 | **Goa Beaches (Calangute/Baga)** | North Goa | Goa | Beaches |
| 14 | **Ooty Hill Station** | Nilgiris | Tamil Nadu | Hill Stations |
| 15 | **Araku Valley** | Visakhapatnam | Andhra Pradesh | Hill Stations |
| 16 | **Kerala Backwaters** | Alappuzha | Kerala | Lakes and Natural Attractions |
| 17 | **Bogatha Waterfalls** | Mulugu | Telangana | Waterfalls |
| 18 | **Pakhal Wildlife Sanctuary** | Warangal | Telangana | Wildlife Sanctuaries |
| 19 | **Salar Jung Museum** | Hyderabad | Telangana | Museums |

---

## 7. REST API Endpoints

All APIs return standardized JSON responses and proper HTTP status codes.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/health` | Health check reporting database and uptime | Public |
| `GET` | `/api/destinations` | List all destinations with `?category=`, `?state=`, `?q=`, `?sort=`, `?limit=` | Public |
| `GET` | `/api/destinations/:id` | Retrieve full details for destination by ID | Public |
| `GET` | `/api/categories` | List all unique categories with counts | Public |
| `GET` | `/api/states` | List all unique states with counts | Public |
| `GET` | `/api/search?q=charminar` | Search across name, city, state, description | Public |
| `GET` | `/api/stats` | Summary counts of destinations, categories, states | Public |
| `POST` | `/api/contact` | Validate and insert a visitor contact inquiry | Public |
| `GET` | `/api/admin/verify` | Verify admin key validity | Admin Key |
| `GET` | `/api/contact` | Retrieve all visitor contact messages | Admin Key |
| `POST` | `/api/destinations` | Add a new tourist attraction | Admin Key |
| `PUT` | `/api/destinations/:id` | Update an existing attraction record | Admin Key |
| `DELETE` | `/api/destinations/:id` | Delete an attraction record | Admin Key |

---

## 8. Prerequisites

- **Node.js:** v18.0.0 or later (v24.x recommended)
- **NPM:** v9.0.0 or later
- **Operating System:** Windows 10/11, macOS, or Linux

---

## 9. Local Installation & Running Instructions (Windows)

Follow these simple steps in **Windows Command Prompt (CMD)** or **PowerShell**:

### Step 1: Open Terminal and Navigate to Project Directory
```cmd
cd path\to\tourist-attraction-portal
```

### Step 2: Install Project Dependencies
```cmd
npm install
```

### Step 3: (Optional) Seed or Re-seed the Database
The server seeds sample attractions automatically if the database is empty, but you can also run:
```cmd
npm run seed
```

### Step 4: Start the Web Application
```cmd
npm start
```

### Step 5: Open in Your Browser
Once the server starts, open your web browser and navigate to:
```
http://localhost:3000
```

> **How to Stop the Server:** Press `Ctrl + C` in the CMD/PowerShell terminal window.  
> **How to Restart the Server:** Run `npm start` again.

---

## 10. Automated Testing

To run the automated End-to-End (E2E) test suite verifying all 18 static files, REST APIs, validations, and admin operations:

```cmd
npm test
```

Expected output:
```
======================================================
 ALL E2E INTEGRATION & SECURITY TESTS PASSED (100%)! 
======================================================
```

---

## 11. Screenshots Section

Add screenshots of your working portal to this section before final submission:

1. **Home Page & Hero Banner**  
   *(Place screenshot in `screenshots/homepage.png`)*
2. **Explore Destinations & Multi-Filters**  
   *(Place screenshot in `screenshots/explore.png`)*
3. **Destination Details & Map Integration**  
   *(Place screenshot in `screenshots/details.png`)*
4. **Favorites Wishlist**  
   *(Place screenshot in `screenshots/favorites.png`)*
5. **Contact Form Submission & Feedback**  
   *(Place screenshot in `screenshots/contact.png`)*
6. **Admin Management Console**  
   *(Place screenshot in `screenshots/admin.png`)*

---

## 12. Git & GitHub Upload Instructions

To upload this project to your GitHub account:

```cmd
git init
git add .
git commit -m "Initial commit: Complete Tourist Attraction Information Service Portal"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

*(Replace `<your-username>` and `<your-repo-name>` with your actual GitHub repository URL).*

---

## 13. Future Enhancements

- Multi-language localization (Hindi, Telugu, English).
- User reviews and community star-rating submissions.
- Live weather forecast integration for each attraction via OpenWeather API.
- Offline Progressive Web App (PWA) caching for low-connectivity travelers.

---

## 14. Academic Project Disclaimer

This web application has been developed strictly for educational and academic evaluation purposes. Attraction details, visiting hours, and fees are realistic educational sample records. Visitors planning actual trips must verify schedules and guidelines with official state tourism departments and local authorities.

---
**Academic Year:** 2026 | **Technology:** Express.js, SQLite, HTML5, CSS3, JavaScript
