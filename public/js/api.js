/**
 * Centralized API Service Module
 * Handles all Fetch API communication between frontend and Express backend.
 */

const API_BASE = window.location.origin;

const ApiService = {
  /**
   * Health Check
   */
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      return await res.json();
    } catch (err) {
      console.error('Health check failed:', err);
      return { status: 'error', error: err.message };
    }
  },

  /**
   * Retrieve destinations with optional search/filter/sort parameters
   */
  async getDestinations(params = {}) {
    const url = new URL(`${API_BASE}/api/destinations`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        url.searchParams.append(key, params[key]);
      }
    });

    const res = await fetch(url.toString());
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to fetch destinations' }));
      throw new Error(err.error || 'Server error');
    }
    return await res.json();
  },

  /**
   * Retrieve single destination details by ID
   */
  async getDestinationById(id) {
    const res = await fetch(`${API_BASE}/api/destinations/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Destination not found' }));
      throw new Error(err.error || 'Destination not found');
    }
    return await res.json();
  },

  /**
   * Search destinations by keyword
   */
  async search(query) {
    const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) {
      throw new Error('Search request failed');
    }
    return await res.json();
  },

  /**
   * Retrieve all categories and counts
   */
  async getCategories() {
    const res = await fetch(`${API_BASE}/api/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  },

  /**
   * Retrieve all states and counts
   */
  async getStates() {
    const res = await fetch(`${API_BASE}/api/states`);
    if (!res.ok) throw new Error('Failed to fetch states');
    return await res.json();
  },

  /**
   * Retrieve portal statistics
   */
  async getStats() {
    const res = await fetch(`${API_BASE}/api/stats`);
    if (!res.ok) throw new Error('Failed to fetch statistics');
    return await res.json();
  },

  /**
   * Submit contact inquiry
   */
  async submitContact(data) {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(body.error || 'Failed to submit contact message');
    }
    return body;
  },

  /**
   * Admin: Verify key
   */
  async adminVerify(key) {
    const res = await fetch(`${API_BASE}/api/admin/verify`, {
      headers: { 'x-admin-key': key }
    });
    return res.ok;
  },

  /**
   * Admin: Create new destination
   */
  async adminCreateDestination(data, key) {
    const res = await fetch(`${API_BASE}/api/destinations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': key
      },
      body: JSON.stringify(data)
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || 'Failed to create destination');
    return body;
  },

  /**
   * Admin: Update destination
   */
  async adminUpdateDestination(id, data, key) {
    const res = await fetch(`${API_BASE}/api/destinations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': key
      },
      body: JSON.stringify(data)
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || 'Failed to update destination');
    return body;
  },

  /**
   * Admin: Delete destination
   */
  async adminDeleteDestination(id, key) {
    const res = await fetch(`${API_BASE}/api/destinations/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-key': key }
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || 'Failed to delete destination');
    return body;
  }
};

window.ApiService = ApiService;

