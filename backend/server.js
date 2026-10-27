/**
 * Tourist Attraction Information Service Portal - Backend Server
 * Express.js application serving REST APIs and static frontend web pages.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb, getDb } = require('./database/database');
const { seedDatabase } = require('./database/seed');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize and auto-seed database if empty
try {
  const db = initDb();
  seedDatabase(db);
  console.log('✓ Database initialized and ready.');
} catch (err) {
  console.error('Database initialization error:', err);
}

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
  // Simple request log
  // console.log(`${req.method} ${req.url}`);
  next();
});

// Serve static frontend assets from frontend/ directory
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// Mount routes
const destinationRoutes = require('./routes/destinations');
const contactRoutes = require('./routes/contact');

app.use('/api/destinations', destinationRoutes);
app.use('/api/contact', contactRoutes);

/**
 * GET /api/health
 * Health check endpoint reporting service status
 */
app.get('/api/health', (req, res) => {
  try {
    const db = getDb();
    const result = db.prepare(`SELECT 1 AS alive`).get();
    res.json({
      status: 'ok',
      service: 'Tourist Attraction Information Service Portal',
      timestamp: new Date().toISOString(),
      database: result.alive === 1 ? 'connected' : 'unresponsive',
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Database check failed',
      error: error.message
    });
  }
});

/**
 * GET /api/categories
 * Return all distinct categories with attraction count
 */
app.get('/api/categories', (req, res) => {
  try {
    const db = getDb();
    const categories = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM destinations 
      GROUP BY category 
      ORDER BY category ASC
    `).all();

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve categories.'
    });
  }
});

/**
 * GET /api/states
 * Return all distinct states with attraction count
 */
app.get('/api/states', (req, res) => {
  try {
    const db = getDb();
    const states = db.prepare(`
      SELECT state, COUNT(*) as count 
      FROM destinations 
      GROUP BY state 
      ORDER BY state ASC
    `).all();

    res.json({
      success: true,
      data: states
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve states.'
    });
  }
});

/**
 * GET /api/search?q=...
 * Dedicated search endpoint across name, city, state, description, and category
 */
app.get('/api/search', (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    const db = getDb();
    const pattern = `%${q.trim().toLowerCase()}%`;
    const rows = db.prepare(`
      SELECT * FROM destinations 
      WHERE LOWER(name) LIKE ? 
         OR LOWER(city) LIKE ? 
         OR LOWER(state) LIKE ? 
         OR LOWER(description) LIKE ? 
         OR LOWER(category) LIKE ?
      ORDER BY name ASC
    `).all(pattern, pattern, pattern, pattern, pattern);

    // Format fields
    const formatted = rows.map(r => {
      let facilities = [];
      try {
        facilities = r.facilities ? JSON.parse(r.facilities) : [];
      } catch (e) {
        facilities = r.facilities ? r.facilities.split(',').map(s => s.trim()) : [];
      }
      return { ...r, facilities };
    });

    res.json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({
      success: false,
      error: 'Search operation failed.'
    });
  }
});

/**
 * GET /api/stats
 * Return public portal statistics
 */
app.get('/api/stats', (req, res) => {
  try {
    const db = getDb();
    const totalDestinations = db.prepare(`SELECT COUNT(*) as count FROM destinations`).get().count;
    const totalCategories = db.prepare(`SELECT COUNT(DISTINCT category) as count FROM destinations`).get().count;
    const totalStates = db.prepare(`SELECT COUNT(DISTINCT state) as count FROM destinations`).get().count;
    const totalMessages = db.prepare(`SELECT COUNT(*) as count FROM contact_messages`).get().count;

    const topCategories = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM destinations 
      GROUP BY category 
      ORDER BY count DESC 
      LIMIT 5
    `).all();

    res.json({
      success: true,
      stats: {
        totalDestinations,
        totalCategories,
        totalStates,
        totalMessages
      },
      topCategories
    });
  } catch (error) {
    console.error('Stats API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve portal statistics.'
    });
  }
});

/**
 * GET /api/admin/verify
 * Validate admin secret key
 */
app.get('/api/admin/verify', (req, res) => {
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  const configuredKey = process.env.ADMIN_KEY || 'admin123';

  if (adminKey && adminKey === configuredKey) {
    return res.json({ success: true, message: 'Admin authentication verified.' });
  }
  return res.status(401).json({ success: false, error: 'Invalid admin credentials.' });
});

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint ${req.method} ${req.originalUrl} does not exist.`
  });
});

// Start Server when executed directly
let server;
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  Tourist Attraction Information Service Portal`);
    console.log(`  Destination Information Guide - Live Web Application`);
    console.log(`=======================================================`);
    console.log(`  Local Address:  http://localhost:${PORT}`);
    console.log(`  API Health:     http://localhost:${PORT}/api/health`);
    console.log(`  Destinations:   http://localhost:${PORT}/api/destinations`);
    console.log(`  Environment:    ${process.env.NODE_ENV || 'development'}`);
    console.log(`=======================================================`);
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nGracefully shutting down Tourist Portal server...');
  if (server) {
    server.close(() => {
      console.log('Server stopped.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

module.exports = { app, server };
