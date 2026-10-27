/**
 * Destination Details View Logic
 * Dynamically loads and renders full attraction information from the backend API.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('detailsContainer');
  const breadcrumbName = document.getElementById('breadcrumbName');
  const fallbackImg = '/images/placeholder.svg';

  const urlParams = new URLSearchParams(window.location.search);
  const destinationId = urlParams.get('id');

  if (!destinationId) {
    if (container) {
      container.innerHTML = `
        <div class="text-center py-5">
          <i class="fas fa-map-marked-alt fa-4x text-muted mb-3"></i>
          <h2>No Destination Selected</h2>
          <p class="text-muted">Please choose a tourist destination from our catalog to view its details.</p>
          <a href="destinations.html" class="btn btn-primary mt-3">
            <i class="fas fa-compass me-2"></i>Browse Destinations
          </a>
        </div>
      `;
    }
    return;
  }

  try {
    const response = await ApiService.getDestinationById(destinationId);
    const dest = response.data;

    // Update document title and breadcrumb
    document.title = `${dest.name} - Tourist Attraction Portal`;
    if (breadcrumbName) breadcrumbName.textContent = dest.name;

    const isFav = FavoritesManager.isFavorite(dest.id);

    // Build facility icon mapper
    function getFacilityIcon(name) {
      const lower = name.toLowerCase();
      if (lower.includes('park')) return 'fa-parking';
      if (lower.includes('water')) return 'fa-tint';
      if (lower.includes('restroom') || lower.includes('toilet')) return 'fa-restroom';
      if (lower.includes('guide')) return 'fa-user-tie';
      if (lower.includes('wheelchair') || lower.includes('ramp')) return 'fa-wheelchair';
      if (lower.includes('restaurant') || lower.includes('cafe') || lower.includes('food') || lower.includes('dining')) return 'fa-utensils';
      if (lower.includes('shop') || lower.includes('souvenir') || lower.includes('market')) return 'fa-store';
      if (lower.includes('boat') || lower.includes('ferry')) return 'fa-ship';
      if (lower.includes('train') || lower.includes('rail')) return 'fa-train';
      if (lower.includes('atm')) return 'fa-credit-card';
      if (lower.includes('audio')) return 'fa-headphones';
      return 'fa-check-circle';
    }

    // Build facilities markup
    const facilitiesList = Array.isArray(dest.facilities) ? dest.facilities : [];
    const facilitiesMarkup = facilitiesList.length > 0 
      ? facilitiesList.map(f => `
          <span class="facility-pill">
            <i class="fas ${getFacilityIcon(f)}"></i> ${f}
          </span>
        `).join('')
      : '<span class="text-muted">Information currently not listed. Please check on arrival.</span>';

    // Build gallery thumbnails
    const gallery = Array.isArray(dest.gallery_urls) && dest.gallery_urls.length > 0
      ? dest.gallery_urls
      : [dest.image_url];

    const galleryThumbsMarkup = gallery.length > 1
      ? `
        <div class="gallery-thumbs mt-3">
          ${gallery.map((url, idx) => `
            <div class="gallery-thumb-item ${idx === 0 ? 'active' : ''}" onclick="changeMainImage('${url}', this)">
              <img src="${url}" alt="Thumbnail ${idx + 1}" onerror="this.onerror=null; this.src='${fallbackImg}';">
            </div>
          `).join('')}
        </div>
      `
      : '';

    // Nearby attractions links/badges
    const nearbyList = dest.nearby_attractions 
      ? dest.nearby_attractions.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    
    const nearbyMarkup = nearbyList.length > 0
      ? nearbyList.map(item => `
          <span class="badge bg-light text-dark border p-2 me-2 mb-2" style="font-size: 0.9rem;">
            <i class="fas fa-map-pin text-primary me-1"></i>${item}
          </span>
        `).join('')
      : '<p class="text-muted">No nearby landmarks listed.</p>';

    // Google Maps link
    const mapsQuery = dest.latitude && dest.longitude 
      ? `${dest.latitude},${dest.longitude}`
      : encodeURIComponent(`${dest.name}, ${dest.city}, ${dest.state}`);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

    // Render full details view
    container.innerHTML = `
      <div class="row mb-4">
        <div class="col-12">
          <!-- Back button and Actions -->
          <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <a href="destinations.html" class="btn btn-outline-secondary btn-sm rounded-pill px-3">
              <i class="fas fa-arrow-left me-1"></i> Back to Destinations
            </a>
            <div class="d-flex gap-2">
              <button 
                id="detailsFavBtn" 
                class="btn ${isFav ? 'btn-danger' : 'btn-outline-danger'} btn-sm rounded-pill px-3"
                onclick="toggleDetailsFavorite(${dest.id})"
              >
                <i class="${isFav ? 'fas' : 'far'} fa-heart me-1"></i>
                <span id="detailsFavText">${isFav ? 'In Favorites' : 'Add to Favorites'}</span>
              </button>
              <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-primary btn-sm rounded-pill px-3">
                <i class="fas fa-external-link-alt me-1"></i> Open in Google Maps
              </a>
            </div>
          </div>

          <!-- Hero Image & Title Overlay -->
          <div class="details-hero">
            <img 
              id="mainDetailsImg"
              src="${dest.image_url || fallbackImg}" 
              alt="${dest.name}" 
              onerror="this.onerror=null; this.src='${fallbackImg}';"
            >
            <div class="details-hero-overlay">
              <div class="details-badge-row">
                <span class="badge-tag">
                  <i class="fas fa-tag me-1"></i>${dest.category}
                </span>
                <span class="badge-tag">
                  <i class="fas fa-map-marker-alt me-1"></i>${dest.city}, ${dest.state}
                </span>
              </div>
              <h1 class="display-5 fw-extrabold text-white mb-1">${dest.name}</h1>
              ${dest.address ? `<p class="text-light mb-0 small"><i class="fas fa-location-arrow me-1"></i>${dest.address}</p>` : ''}
            </div>
          </div>

          ${galleryThumbsMarkup}
        </div>
      </div>

      <div class="row">
        <!-- Left Column: Description & Content -->
        <div class="col-lg-8">
          <div class="details-card">
            <h2 class="details-card-title">
              <i class="fas fa-info-circle text-primary"></i> About the Attraction
            </h2>
            <p class="lead text-dark" style="font-size: 1.05rem; line-height: 1.75;">
              ${dest.description}
            </p>

            ${dest.travel_tips ? `
              <div class="mt-4 p-3 bg-light rounded-3 border">
                <h5 class="fw-bold text-dark mb-2">
                  <i class="fas fa-lightbulb text-warning me-2"></i>Visitor Travel Tips
                </h5>
                <p class="mb-0 text-muted" style="font-size: 0.95rem;">${dest.travel_tips}</p>
              </div>
            ` : ''}

            <div class="notice-box">
              <i class="fas fa-exclamation-triangle me-1"></i>
              <strong>Notice:</strong> Information provided is for academic demonstration and general tourism reference. Official opening hours, entry fees, and seasonal rules are subject to change by local authorities. Please verify before visiting.
            </div>
          </div>

          <!-- Available Facilities -->
          <div class="details-card">
            <h2 class="details-card-title">
              <i class="fas fa-concierge-bell text-secondary"></i> Available Tourist Facilities
            </h2>
            <div class="d-flex flex-wrap pt-2">
              ${facilitiesMarkup}
            </div>
          </div>

          <!-- Nearby Attractions -->
          <div class="details-card">
            <h2 class="details-card-title">
              <i class="fas fa-compass text-primary"></i> Nearby Attractions & Landmarks
            </h2>
            <div class="pt-2">
              ${nearbyMarkup}
            </div>
          </div>
        </div>

        <!-- Right Column: Quick Facts & Maps -->
        <div class="col-lg-4">
          <div class="details-card sticky-top" style="top: 90px;">
            <h3 class="details-card-title" style="font-size: 1.15rem;">
              <i class="fas fa-clipboard-list text-primary"></i> Key Visitor Information
            </h3>
            
            <table class="table info-table mb-3">
              <tbody>
                <tr>
                  <td class="info-label"><i class="far fa-clock me-1 text-primary"></i> Timings</td>
                  <td class="info-value">${dest.opening_hours || 'Please verify before visiting'}</td>
                </tr>
                <tr>
                  <td class="info-label"><i class="fas fa-ticket-alt me-1 text-primary"></i> Entry Fee</td>
                  <td class="info-value">${dest.entry_fee || 'Please verify before visiting'}</td>
                </tr>
                <tr>
                  <td class="info-label"><i class="fas fa-calendar-alt me-1 text-primary"></i> Best Time</td>
                  <td class="info-value">${dest.best_time_to_visit || 'October to March'}</td>
                </tr>
                <tr>
                  <td class="info-label"><i class="fas fa-hourglass-half me-1 text-primary"></i> Duration</td>
                  <td class="info-value">${dest.recommended_duration || '2 to 3 hours'}</td>
                </tr>
                <tr>
                  <td class="info-label"><i class="fas fa-wheelchair me-1 text-primary"></i> Accessibility</td>
                  <td class="info-value" style="font-size: 0.85rem;">${dest.accessibility || 'Please verify before visiting'}</td>
                </tr>
                ${dest.latitude && dest.longitude ? `
                  <tr>
                    <td class="info-label"><i class="fas fa-crosshairs me-1 text-primary"></i> GPS Coordinates</td>
                    <td class="info-value font-monospace small">${dest.latitude.toFixed(4)}° N, ${dest.longitude.toFixed(4)}° E</td>
                  </tr>
                ` : ''}
              </tbody>
            </table>

            <div class="d-grid gap-2 pt-2">
              <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary fw-bold py-2 rounded-3">
                <i class="fas fa-directions me-2"></i> Get Directions on Google Maps
              </a>
              <a href="destinations.html?category=${encodeURIComponent(dest.category)}" class="btn btn-light border fw-semibold py-2 rounded-3">
                <i class="fas fa-search me-2 text-muted"></i> More in ${dest.category}
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

  } catch (err) {
    console.error('Error fetching destination details:', err);
    if (container) {
      container.innerHTML = `
        <div class="text-center py-5">
          <div class="alert alert-danger d-inline-block p-4">
            <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
            <h4>Destination Not Found</h4>
            <p class="mb-3">${err.message || 'The requested destination could not be loaded.'}</p>
            <a href="destinations.html" class="btn btn-outline-danger">Back to Destinations Catalog</a>
          </div>
        </div>
      `;
    }
  }
});

// Image thumbnail click handler
function changeMainImage(url, elem) {
  const mainImg = document.getElementById('mainDetailsImg');
  if (mainImg) {
    mainImg.src = url;
  }
  document.querySelectorAll('.gallery-thumb-item').forEach(el => el.classList.remove('active'));
  if (elem) elem.classList.add('active');
}

// Toggle favorite in details view
function toggleDetailsFavorite(id) {
  const isAdded = FavoritesManager.toggle(id);
  const btn = document.getElementById('detailsFavBtn');
  const text = document.getElementById('detailsFavText');

  if (isAdded) {
    btn.className = 'btn btn-danger btn-sm rounded-pill px-3';
    btn.innerHTML = '<i class="fas fa-heart me-1"></i> <span id="detailsFavText">In Favorites</span>';
    showToast('Destination added to your saved favorites!', 'success');
  } else {
    btn.className = 'btn btn-outline-danger btn-sm rounded-pill px-3';
    btn.innerHTML = '<i class="far fa-heart me-1"></i> <span id="detailsFavText">Add to Favorites</span>';
    showToast('Destination removed from favorites.', 'info');
  }
}

window.changeMainImage = changeMainImage;
window.toggleDetailsFavorite = toggleDetailsFavorite;
