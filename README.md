# Tourist Attraction Information Service Portal

> A complete, modern, responsive, and functional web application for discovering Indian tourist destinations, exploring iconic attractions, viewing visitor guidance, and planning trips.

---

## 1. Project Structure (Frontend & Backend Separated)

The project is cleanly divided into two separate directories:

```
tourist-attraction-portal/
├── frontend/                        # Client-side web application
│   ├── index.html                   # Home Landing Page
│   ├── destinations.html            # Explore Catalog & Multi-Filters
│   ├── destination-details.html     # Dynamic Attraction Details View
│   ├── about.html                   # About Us Page
│   ├── contact.html                 # Contact Us Helpdesk Form
│   ├── favorites.html               # Saved Favorites Wishlist
│   ├── travel-tips.html             # Travel & Safety Guidance
│   ├── admin.html                   # Admin Management Console
│   ├── css/
│   │   └── style.css                # Minimal, Clean Theme Stylesheet
│   ├── js/
│   │   ├── api.js                   # Centralized Fetch API Service
│   │   ├── app.js                   # Favorites, Badges, Toasts & Cards
│   │   ├── destinations.js          # Catalog Search, Filter, Sort
│   │   ├── destination-details.js   # Dynamic Page Renderer & Gallery
│   │   ├── favorites.js             # LocalStorage Wishlist Logic
│   │   ├── contact.js               # Form Validation & Submission
│   │   └── admin.js                 # Admin Authentication & CRUD
│   └── images/
│       └── placeholder.svg          # Fallback SVG Illustration
│
├── backend/                         # Server-side API & Database
│   ├── database/
│   │   ├── database.js              # SQLite Schemas & Tables
│   │   ├── seed.js                  # Idempotent Seeding (19 Destinations)
│   │   └── tourist_portal.db        # SQLite Database (auto-generated)
│   ├── routes/
│   │   ├── destinations.js          # Destinations REST Endpoints
│   │   └── contact.js               # Contact Form REST Endpoints
│   ├── server.js                    # Express Application Server
│   ├── test-endpoints.js            # Automated E2E Test Suite
│   ├── package.json                 # Backend Dependencies & Scripts
│   ├── .env.example                 # Environment Template
│   └── .env                         # Local Environment Configuration
│
├── package.json                     # Root convenience scripts
├── .gitignore                       # Git Exclusion Rules
└── README.md                        # Project Documentation
```

---

## 2. Key Features

1. **Home Page (`frontend/index.html`):**
   - Clean hero banner with instant destination search.
   - Live portal metrics counters (total destinations, categories, states).
   - 8 sample tourist attraction cards loaded dynamically from SQLite.
   - Category boxes with direct filter links.
   - Highlights and travel inspiration section.

2. **Explore Catalog (`frontend/destinations.html`):**
   - Real-time debounced search by name, city, or state.
   - Multi-category filtering (Historical Monuments, Temples, Beaches, Hill Stations, Waterfalls, Wildlife, Museums, Adventure, Nature).
   - State-wise filtering (Telangana, Andhra Pradesh, Uttar Pradesh, Delhi, Rajasthan, etc.).
   - Alphabetical (A-Z, Z-A) and recent sorting.
   - Instant "Clear Filters" reset button and pagination "Load More".

3. **Destination Details (`frontend/destination-details.html`):**
   - Dynamic data loading via URL query parameter (`?id=X`).
   - Image gallery with interactive thumbnail switcher.
   - Comprehensive descriptions, visiting hours, entry fees, optimal seasons, and durations.
   - Available facilities rendered as clean icon tags.
   - Curated visitor tips and nearby landmarks.
   - One-click **Get Directions on Google Maps** button opening live coordinates.
   - Interactive favorite wishlist toggle.

4. **Saved Favorites (`frontend/favorites.html`):**
   - Client-side persistence using browser `localStorage`.
   - Real-time removal without page reloads.
   - Clear All button with confirmation dialog.

5. **Travel Tips (`frontend/travel-tips.html`):**
   - Organized guidance covering Trip Planning, Packing Essentials, Local Transportation (Metro, RTC buses, scenic trains), Safety Guidelines, and Emergency Helplines (112, 100, 108, 1363).
   - Environmental protection and responsible tourism practices.

6. **About Us (`frontend/about.html`):**
   - Portal mission, architecture overview, and technology breakdown.

7. **Contact Us (`frontend/contact.html`):**
   - Multi-field contact form (Name, Email, Subject, Message).
   - Client-side and server-side validation.
   - Direct persistence into SQLite `contact_messages` table.

8. **Admin Console (`frontend/admin.html`):**
   - Protected behind an administrator secret key (`ADMIN_KEY=admin123`).
   - Create, edit, and delete destination records.
   - View visitor contact inquiries.

---

## 3. Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.3, Font Awesome 6.
- **Backend:** Node.js, Express.js (v5), CORS, Dotenv.
- **Database:** SQLite (via `better-sqlite3`) with WAL journaling.

---

## 4. How to Run Locally

### Option A: Running from the Root Folder (Recommended)
```cmd
cd tourist-attraction-portal
npm start
```

### Option B: Running from the Backend Folder
```cmd
cd tourist-attraction-portal\backend
npm install
npm start
```

Once started, open your browser and go to:
**http://localhost:3000**

> **How to Stop the Server:** Press `Ctrl + C` in your terminal.  
> **How to Restart the Server:** Run `npm start` again.

---

## 5. REST API Documentation

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/health` | Health check reporting service status | Public |
| `GET` | `/api/destinations` | List destinations with `?category=`, `?state=`, `?q=`, `?sort=` | Public |
| `GET` | `/api/destinations/:id` | Full details for destination by ID | Public |
| `GET` | `/api/categories` | Unique categories with counts | Public |
| `GET` | `/api/states` | Unique states with counts | Public |
| `GET` | `/api/search?q=charminar` | Search across name, city, state, description | Public |
| `GET` | `/api/stats` | Counts of destinations, categories, states | Public |
| `POST` | `/api/contact` | Validate and insert visitor inquiry | Public |
| `GET` | `/api/admin/verify` | Verify admin key | Admin Key |
| `GET` | `/api/contact` | View all visitor inquiries | Admin Key |
| `POST` | `/api/destinations` | Add a new destination | Admin Key |
| `PUT` | `/api/destinations/:id` | Update an existing destination | Admin Key |
| `DELETE` | `/api/destinations/:id` | Delete a destination | Admin Key |

---

## 6. Running Tests

```cmd
cd backend
npm test
```
