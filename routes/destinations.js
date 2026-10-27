/**
 * Destinations Route Module
 * Handles all REST API endpoints for destination queries, filters, search, and details.
 */

const express = require('express');
const router = express.Router();
const { getDb } = require('../database/database');

/**
 * Safely parse JSON fields stored in SQLite text columns
 */
function formatDestination(dest) {
  if (!dest) return null;
  let facilities = [];
  let galleryUrls = [];

  try {
    facilities = dest.facilities ? JSON.parse(dest.facilities) : [];
  } catch (e) {
    facilities = dest.facilities ? dest.facilities.split(',').map(s => s.trim()) : [];
  }

  try {
    galleryUrls = dest.gallery_urls ? JSON.parse(dest.gallery_urls) : [];
  } catch (e) {
    galleryUrls = dest.gallery_urls ? [dest.gallery_urls] : [];
  }

  // Ensure main image is in gallery if gallery is empty
  if (galleryUrls.length === 0 && dest.image_url) {
    galleryUrls.push(dest.image_url);
  }

  return {
    ...dest,
    facilities,
    gallery_urls: galleryUrls
  };
}

/**
 * Middleware for Admin authentication on protected routes
 */
function requireAdmin(req, res, next) {
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  const configuredKey = process.env.ADMIN_KEY || 'admin123';

  if (!adminKey || adminKey !== configuredKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or missing administrator key.'
    });
  }
  next();
}

/**
 * GET /api/destinations
 * List all destinations with optional filtering (category, state, city, q) and sorting.
 */
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const { category, state, city, q, sort = 'name_asc', limit, offset } = req.query;

    let query = `SELECT * FROM destinations WHERE 1=1`;
    const params = {};

    if (category && category.trim() !== '' && category !== 'All') {
      query += ` AND LOWER(category) = LOWER(@category)`;
      params.category = category.trim();
    }

    if (state && state.trim() !== '' && state !== 'All') {
      query += ` AND LOWER(state) = LOWER(@state)`;
      params.state = state.trim();
    }

    if (city && city.trim() !== '') {
      query += ` AND LOWER(city) = LOWER(@city)`;
      params.city = city.trim();
    }

    if (q && q.trim() !== '') {
      query += ` AND (
        LOWER(name) LIKE @searchPattern OR
        LOWER(city) LIKE @searchPattern OR
        LOWER(state) LIKE @searchPattern OR
        LOWER(description) LIKE @searchPattern OR
        LOWER(category) LIKE @searchPattern
      )`;
      params.searchPattern = `%${q.trim().toLowerCase()}%`;
    }

    // Sorting
    switch (sort) {
      case 'name_desc':
        query += ` ORDER BY name DESC`;
        break;
      case 'id_desc':
        query += ` ORDER BY id DESC`;
        break;
      case 'name_asc':
      default:
        query += ` ORDER BY name ASC`;
        break;
    }

    if (limit && !isNaN(parseInt(limit))) {
      query += ` LIMIT @limit`;
      params.limit = parseInt(limit);

      if (offset && !isNaN(parseInt(offset))) {
        query += ` OFFSET @offset`;
        params.offset = parseInt(offset);
      }
    }

    const rows = db.prepare(query).all(params);
    const formatted = rows.map(formatDestination);

    res.json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve destinations. Please try again later.'
    });
  }
});

/**
 * GET /api/destinations/:id
 * Retrieve full details for a specific tourist attraction.
 */
router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid destination ID.'
      });
    }

    const row = db.prepare(`SELECT * FROM destinations WHERE id = ?`).get(parseInt(id));

    if (!row) {
      return res.status(404).json({
        success: false,
        error: `Destination with ID ${id} was not found.`
      });
    }

    res.json({
      success: true,
      data: formatDestination(row)
    });
  } catch (error) {
    console.error(`Error retrieving destination #${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching destination details.'
    });
  }
});

/**
 * POST /api/destinations
 * Admin route: Add a new destination
 */
router.post('/', requireAdmin, (req, res) => {
  try {
    const db = getDb();
    const {
      name, description, city, state, address, category,
      image_url, gallery_urls, opening_hours, entry_fee,
      best_time_to_visit, recommended_duration, facilities,
      accessibility, travel_tips, nearby_attractions,
      latitude, longitude
    } = req.body;

    if (!name || !description || !city || !state || !category || !image_url) {
      return res.status(400).json({
        success: false,
        error: 'Required fields missing: name, description, city, state, category, image_url.'
      });
    }

    const stmt = db.prepare(`
      INSERT INTO destinations (
        name, description, city, state, address, category,
        image_url, gallery_urls, opening_hours, entry_fee,
        best_time_to_visit, recommended_duration, facilities,
        accessibility, travel_tips, nearby_attractions,
        latitude, longitude
      ) VALUES (
        @name, @description, @city, @state, @address, @category,
        @image_url, @gallery_urls, @opening_hours, @entry_fee,
        @best_time_to_visit, @recommended_duration, @facilities,
        @accessibility, @travel_tips, @nearby_attractions,
        @latitude, @longitude
      )
    `);

    const result = stmt.run({
      name: name.trim(),
      description: description.trim(),
      city: city.trim(),
      state: state.trim(),
      address: address ? address.trim() : null,
      category: category.trim(),
      image_url: image_url.trim(),
      gallery_urls: Array.isArray(gallery_urls) ? JSON.stringify(gallery_urls) : (gallery_urls || null),
      opening_hours: opening_hours ? opening_hours.trim() : 'Please verify before visiting',
      entry_fee: entry_fee ? entry_fee.trim() : 'Please verify before visiting',
      best_time_to_visit: best_time_to_visit ? best_time_to_visit.trim() : 'October to March',
      recommended_duration: recommended_duration ? recommended_duration.trim() : '2 to 3 hours',
      facilities: Array.isArray(facilities) ? JSON.stringify(facilities) : (facilities || '[]'),
      accessibility: accessibility ? accessibility.trim() : 'Please verify before visiting',
      travel_tips: travel_tips ? travel_tips.trim() : '',
      nearby_attractions: nearby_attractions ? nearby_attractions.trim() : '',
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null
    });

    const newDest = db.prepare(`SELECT * FROM destinations WHERE id = ?`).get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Tourist destination created successfully.',
      data: formatDestination(newDest)
    });
  } catch (error) {
    console.error('Error creating destination:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create destination record.'
    });
  }
});

/**
 * PUT /api/destinations/:id
 * Admin route: Update an existing destination
 */
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    const existing = db.prepare(`SELECT * FROM destinations WHERE id = ?`).get(parseInt(id));
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `Destination #${id} not found.`
      });
    }

    const {
      name, description, city, state, address, category,
      image_url, gallery_urls, opening_hours, entry_fee,
      best_time_to_visit, recommended_duration, facilities,
      accessibility, travel_tips, nearby_attractions,
      latitude, longitude
    } = req.body;

    const stmt = db.prepare(`
      UPDATE destinations SET
        name = @name,
        description = @description,
        city = @city,
        state = @state,
        address = @address,
        category = @category,
        image_url = @image_url,
        gallery_urls = @gallery_urls,
        opening_hours = @opening_hours,
        entry_fee = @entry_fee,
        best_time_to_visit = @best_time_to_visit,
        recommended_duration = @recommended_duration,
        facilities = @facilities,
        accessibility = @accessibility,
        travel_tips = @travel_tips,
        nearby_attractions = @nearby_attractions,
        latitude = @latitude,
        longitude = @longitude
      WHERE id = @id
    `);

    stmt.run({
      id: parseInt(id),
      name: name !== undefined ? name.trim() : existing.name,
      description: description !== undefined ? description.trim() : existing.description,
      city: city !== undefined ? city.trim() : existing.city,
      state: state !== undefined ? state.trim() : existing.state,
      address: address !== undefined ? address : existing.address,
      category: category !== undefined ? category.trim() : existing.category,
      image_url: image_url !== undefined ? image_url.trim() : existing.image_url,
      gallery_urls: gallery_urls !== undefined 
        ? (Array.isArray(gallery_urls) ? JSON.stringify(gallery_urls) : gallery_urls) 
        : existing.gallery_urls,
      opening_hours: opening_hours !== undefined ? opening_hours : existing.opening_hours,
      entry_fee: entry_fee !== undefined ? entry_fee : existing.entry_fee,
      best_time_to_visit: best_time_to_visit !== undefined ? best_time_to_visit : existing.best_time_to_visit,
      recommended_duration: recommended_duration !== undefined ? recommended_duration : existing.recommended_duration,
      facilities: facilities !== undefined 
        ? (Array.isArray(facilities) ? JSON.stringify(facilities) : facilities) 
        : existing.facilities,
      accessibility: accessibility !== undefined ? accessibility : existing.accessibility,
      travel_tips: travel_tips !== undefined ? travel_tips : existing.travel_tips,
      nearby_attractions: nearby_attractions !== undefined ? nearby_attractions : existing.nearby_attractions,
      latitude: latitude !== undefined ? parseFloat(latitude) : existing.latitude,
      longitude: longitude !== undefined ? parseFloat(longitude) : existing.longitude
    });

    const updated = db.prepare(`SELECT * FROM destinations WHERE id = ?`).get(parseInt(id));

    res.json({
      success: true,
      message: 'Destination updated successfully.',
      data: formatDestination(updated)
    });
  } catch (error) {
    console.error('Error updating destination:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update destination.'
    });
  }
});

/**
 * DELETE /api/destinations/:id
 * Admin route: Delete a destination
 */
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    const existing = db.prepare(`SELECT * FROM destinations WHERE id = ?`).get(parseInt(id));
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `Destination #${id} does not exist.`
      });
    }

    db.prepare(`DELETE FROM destinations WHERE id = ?`).run(parseInt(id));

    res.json({
      success: true,
      message: `Destination "${existing.name}" (#${id}) deleted successfully.`
    });
  } catch (error) {
    console.error('Error deleting destination:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete destination.'
    });
  }
});

module.exports = router;
