/**
 * Database Module for Tourist Attraction Information Service Portal
 * Uses SQLite (via better-sqlite3) for persistent, fast, and reliable local storage.
 */

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
require('dotenv').config();

const dbPath = process.env.DB_PATH 
  ? path.resolve(__dirname, '..', process.env.DB_PATH)
  : path.resolve(__dirname, 'tourist_portal.db');

// Ensure parent directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let dbInstance = null;

function getDb() {
  if (!dbInstance) {
    dbInstance = new Database(dbPath, {
      // verbose: process.env.NODE_ENV === 'development' ? console.log : null
    });
    dbInstance.pragma('journal_mode = WAL');
    dbInstance.pragma('foreign_keys = ON');
  }
  return dbInstance;
}

function initDb() {
  const db = getDb();

  // Create destinations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS destinations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      address TEXT,
      category TEXT NOT NULL,
      image_url TEXT NOT NULL,
      gallery_urls TEXT,
      opening_hours TEXT,
      entry_fee TEXT,
      best_time_to_visit TEXT,
      recommended_duration TEXT,
      facilities TEXT,
      accessibility TEXT,
      travel_tips TEXT,
      nearby_attractions TEXT,
      latitude REAL,
      longitude REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_destinations_category ON destinations(category);
    CREATE INDEX IF NOT EXISTS idx_destinations_state ON destinations(state);
    CREATE INDEX IF NOT EXISTS idx_destinations_city ON destinations(city);
    CREATE INDEX IF NOT EXISTS idx_destinations_name ON destinations(name);
  `);

  return db;
}

module.exports = {
  getDb,
  initDb,
  dbPath
};

