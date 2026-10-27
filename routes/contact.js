/**
 * Contact Routes Module
 * Validates and records contact messages submitted by portal visitors.
 */

const express = require('express');
const router = express.Router();
const { getDb } = require('../database/database');

/**
 * Validate email address syntax
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

/**
 * POST /api/contact
 * Validate and save a visitor's contact inquiry.
 */
router.post('/', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const errors = [];

    // Validations
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Full name is required (at least 2 characters).');
    }

    if (!email || typeof email !== 'string' || !isValidEmail(email.trim())) {
      errors.push('A valid email address is required.');
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
      errors.push('Subject is required (at least 3 characters).');
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      errors.push('Message is required (at least 10 characters).');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
        error: errors[0]
      });
    }

    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      name.trim(),
      email.trim(),
      subject.trim(),
      message.trim()
    );

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! Your inquiry has been received and saved. Our team will get back to you shortly.',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your message. Please try again.'
    });
  }
});

/**
 * GET /api/contact
 * Admin endpoint to view contact submissions
 */
router.get('/', (req, res) => {
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  const configuredKey = process.env.ADMIN_KEY || 'admin123';

  if (!adminKey || adminKey !== configuredKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized access.'
    });
  }

  try {
    const db = getDb();
    const messages = db.prepare(`SELECT * FROM contact_messages ORDER BY created_at DESC`).all();
    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Error retrieving contact messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve messages.'
    });
  }
});

module.exports = router;
