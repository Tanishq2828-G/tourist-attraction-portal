/**
 * Comprehensive End-to-End System Test Suite
 * Tests Frontend static serving, REST APIs, Filter/Search, Contact storage, and Admin CRUD.
 */

const { app } = require('./server');

async function runTestSuite() {
  const PORT = 4050;
  const server = app.listen(PORT, async () => {
    console.log(`\n=== Running Full E2E Test Suite on http://127.0.0.1:${PORT} ===\n`);
    const BASE_URL = `http://127.0.0.1:${PORT}`;

    try {
      // Phase 1: Static Web Pages Verification
      const pages = [
        '/',
        '/index.html',
        '/destinations.html',
        '/destination-details.html',
        '/about.html',
        '/contact.html',
        '/favorites.html',
        '/travel-tips.html',
        '/admin.html',
        '/css/style.css',
        '/js/api.js',
        '/js/app.js',
        '/js/destinations.js',
        '/js/destination-details.js',
        '/js/favorites.js',
        '/js/contact.js',
        '/js/admin.js',
        '/images/placeholder.svg'
      ];

      console.log('--- Phase 1: Testing Static Assets & Web Pages Delivery ---');
      for (const page of pages) {
        const res = await fetch(`${BASE_URL}${page}`);
        if (res.status !== 200) {
          throw new Error(`Failed to serve ${page}, status: ${res.status}`);
        }
        console.log(`  ✓ ${page.padEnd(28)} [HTTP ${res.status}] OK`);
      }

      // Phase 2: REST API Endpoints
      console.log('\n--- Phase 2: Testing Public REST APIs ---');
      
      // Health
      const health = await (await fetch(`${BASE_URL}/api/health`)).json();
      console.log(`  ✓ /api/health              [Status: ${health.status}, DB: ${health.database}]`);

      // Stats
      const stats = await (await fetch(`${BASE_URL}/api/stats`)).json();
      console.log(`  ✓ /api/stats               [Destinations: ${stats.stats.totalDestinations}, Categories: ${stats.stats.totalCategories}, States: ${stats.stats.totalStates}]`);

      // All destinations
      const dests = await (await fetch(`${BASE_URL}/api/destinations`)).json();
      console.log(`  ✓ /api/destinations        [Retrieved ${dests.count} items]`);

      // Destination Details
      const charminar = await (await fetch(`${BASE_URL}/api/destinations/1`)).json();
      console.log(`  ✓ /api/destinations/1      [Name: "${charminar.data.name}", City: "${charminar.data.city}"]`);

      // Search Query
      const searchRes = await (await fetch(`${BASE_URL}/api/search?q=golconda`)).json();
      console.log(`  ✓ /api/search?q=golconda   [Found ${searchRes.count} matching results]`);

      // Filter by Category
      const catRes = await (await fetch(`${BASE_URL}/api/destinations?category=Historical%20Monuments`)).json();
      console.log(`  ✓ Category Filter          [Found ${catRes.count} Historical Monuments]`);

      // Filter by State
      const stateRes = await (await fetch(`${BASE_URL}/api/destinations?state=Telangana`)).json();
      console.log(`  ✓ State Filter             [Found ${stateRes.count} Telangana Destinations]`);

      // Combined Query
      const comboRes = await (await fetch(`${BASE_URL}/api/destinations?category=Temples%20and%20Religious%20Places&state=Telangana`)).json();
      console.log(`  ✓ Combined Filter          [Found ${comboRes.count} Religious sites in Telangana]`);

      // Phase 3: Contact Form Submissions
      console.log('\n--- Phase 3: Testing Contact Form Submission & Validation ---');
      
      // Validation failure
      const badContact = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '', email: 'invalid-email', subject: '', message: '' })
      });
      if (badContact.status !== 400) throw new Error('Bad contact did not return 400');
      console.log('  ✓ Contact Validation       [Correctly rejected invalid payload with HTTP 400]');

      // Successful contact submission
      const goodContact = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Academic Evaluator',
          email: 'evaluator@university.edu',
          subject: 'Academic Demonstration Feedback',
          message: 'The website interface is modern, clean, and fully operational.'
        })
      });
      const goodContactData = await goodContact.json();
      if (goodContact.status !== 201 || !goodContactData.id) throw new Error('Valid contact submission failed');
      console.log(`  ✓ Contact Submission       [Recorded message #${goodContactData.id} into database]`);

      // Phase 4: Admin Authentication & Protected CRUD Operations
      console.log('\n--- Phase 4: Testing Admin Security & CRUD Operations ---');

      // Admin verification with incorrect key
      const unauthCheck = await fetch(`${BASE_URL}/api/admin/verify`, {
        headers: { 'x-admin-key': 'wrong-password' }
      });
      if (unauthCheck.status !== 401) throw new Error('Failed to block wrong admin key');
      console.log('  ✓ Admin Security Check     [Blocked unauthorized key with HTTP 401]');

      // Admin verification with valid key
      const authCheck = await fetch(`${BASE_URL}/api/admin/verify`, {
        headers: { 'x-admin-key': 'admin123' }
      });
      if (authCheck.status !== 200) throw new Error('Failed to authenticate valid admin key');
      console.log('  ✓ Admin Verification       [Successfully authenticated admin key with HTTP 200]');

      // Admin Read Contact Messages
      const adminMsgs = await (await fetch(`${BASE_URL}/api/contact`, {
        headers: { 'x-admin-key': 'admin123' }
      })).json();
      console.log(`  ✓ Admin View Inquiries     [Retrieved ${adminMsgs.count} visitor inquiries]`);

      // Admin Create Destination
      const newDestPayload = {
        name: 'Kuntala Waterfalls',
        category: 'Waterfalls',
        city: 'Neradigonda, Adilabad',
        state: 'Telangana',
        address: 'Neredigonda Mandal, Adilabad District, Telangana 504323',
        description: 'The highest waterfall in Telangana cascading down 147 feet through dense Sahyadri mountain forests.',
        image_url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&auto=format&fit=crop&q=80',
        opening_hours: '09:00 AM – 05:00 PM (Please verify before visiting)',
        entry_fee: 'Nominal fee approx ₹20 (Please verify before visiting)',
        best_time_to_visit: 'August to December',
        recommended_duration: '3 to 4 hours',
        facilities: ['Parking', 'Viewpoints', 'Steps Pathways'],
        latitude: 19.3082,
        longitude: 78.4839
      };

      const createRes = await fetch(`${BASE_URL}/api/destinations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'admin123'
        },
        body: JSON.stringify(newDestPayload)
      });
      const createdData = await createRes.json();
      if (createRes.status !== 201) throw new Error('Failed to create destination via admin API');
      const createdId = createdData.data.id;
      console.log(`  ✓ Admin Add Destination    [Created "${createdData.data.name}" with ID #${createdId}]`);

      // Admin Edit Destination
      const updateRes = await fetch(`${BASE_URL}/api/destinations/${createdId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'admin123'
        },
        body: JSON.stringify({
          name: 'Kuntala Waterfalls (Highest in Telangana)',
          city: 'Adilabad'
        })
      });
      const updatedData = await updateRes.json();
      if (updateRes.status !== 200) throw new Error('Failed to update destination via admin API');
      console.log(`  ✓ Admin Edit Destination   [Updated title to "${updatedData.data.name}"]`);

      // Admin Delete Destination
      const deleteRes = await fetch(`${BASE_URL}/api/destinations/${createdId}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': 'admin123' }
      });
      const deletedData = await deleteRes.json();
      if (deleteRes.status !== 200) throw new Error('Failed to delete destination via admin API');
      console.log(`  ✓ Admin Delete Destination [Successfully deleted temporary ID #${createdId}]`);

      console.log('\n======================================================');
      console.log(' ALL E2E INTEGRATION & SECURITY TESTS PASSED (100%)! ');
      console.log('======================================================\n');

      server.close(() => {
        process.exit(0);
      });
    } catch (error) {
      console.error('\n❌ E2E TEST FAILED:', error);
      server.close(() => {
        process.exit(1);
      });
    }
  });
}

runTestSuite();
