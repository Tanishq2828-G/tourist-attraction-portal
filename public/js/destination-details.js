/**
 * Destination Details View Logic - Simple & Student-Friendly
 * Fetches single destination data from API by ID and renders clean HTML.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('detailsContainer');
  const breadcrumbTitle = document.getElementById('breadcrumbTitle');
  const fallbackImg = 'images/placeholder.svg';

  const urlParams = new URLSearchParams(window.location.search);
  const destinationId = urlParams.get('id');

  if (!destinationId) {
    if (container) {
      container.innerHTML = `
        <div class="text-center py-5">
          <i class="fas fa-exclamation-circle fa-3x text-warning mb-3"></i>
          <h4>No Destination Selected</h4>
          <p class="text-muted">Please select an attraction from our catalog to see its details.</p>
          <a href="destinations.html" class="btn btn-primary mt-2">Browse Destinations</a>
        </div>
      `;
    }
    return;
  }

  try {
    const response = await ApiService.getDestinationById(destinationId);
    const dest = response.data;

    // Set page title and breadcrumb
    document.title = `${dest.name} - Tourist Attraction Portal`;
    if (breadcrumbTitle) breadcrumbTitle.textContent = dest.name;

    const isFav = FavoritesManager.isFavorite(dest.id);

    // Render gallery thumbnails
    const gallery = Array.isArray(dest.gallery_urls) && dest.gallery_urls.length > 0
      ? dest.gallery_urls
      : [dest.image_url];

    const galleryHtml = gallery.length > 1
      ? `
        <div class="mt-2 mb-3">
          <small class="text-muted fw-bold d-block mb-1">More Photographs:</small>
          <div class="d-flex flex-wrap">
            ${gallery.map((url, idx) => `
              <img 
                src="${url}" 
                alt="Photo ${idx+1}" 
                class="gallery-thumb ${idx === 0 ? 'active' : ''}" 
                onclick="changeDetailImage('${url}', this)"
                onerror="this.onerror=null; this.src='${fallbackImg}';"
              >
            `).join('')}
          </div>
        </div>
      `
      : '';

    // Render Facilities Badges
    const facilitiesList = Array.isArray(dest.facilities) ? dest.facilities : [];
    const facilitiesHtml = facilitiesList.length > 0
      ? facilitiesList.map(f => `<span class="facility-badge"><i class="fas fa-check text-success me-1"></i>${f}</span>`).join('')
      : '<span class="text-muted small">Information not listed. Please check on arrival.</span>';

    // Render Nearby Attractions
    const nearbyList = dest.nearby_attractions 
      ? dest.nearby_attractions.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const nearbyHtml = nearbyList.length > 0
      ? nearbyList.map(n => `<span class="badge bg-light text-dark border p-2 me-2 mb-2"><i class="fas fa-map-marker-alt text-danger me-1"></i>${n}</span>`).join('')
      : '<span class="text-muted small">No nearby attractions listed.</span>';

    // Google Maps URL
    const mapsQuery = dest.latitude && dest.longitude 
      ? `${dest.latitude},${dest.longitude}`
      : encodeURIComponent(`${dest.name}, ${dest.city}, ${dest.state}`);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

    container.innerHTML = `
      <!-- Action Toolbar -->
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <a href="destinations.html" class="btn btn-outline-secondary btn-sm">
          <i class="fas fa-arrow-left me-1"></i> Back to Destinations
        </a>
        <div class="d-flex gap-2">
          <button 
            id="detailFavBtn" 
            class="btn btn-sm ${isFav ? 'btn-danger' : 'btn-outline-danger'}"
            onclick="toggleDetailFavorite(${dest.id})"
          >
            <i class="${isFav ? 'fas' : 'far'} fa-heart me-1"></i>
            <span id="detailFavText">${isFav ? 'Saved in Favorites' : 'Add to Favorites'}</span>
          </button>
          <a href="${mapsUrl}" target="_blank" class="btn btn-sm btn-outline-primary">
            <i class="fas fa-external-link-alt me-1"></i> Open Google Maps
          </a>
        </div>
      </div>

      <div class="row">
        <!-- Left Column: Image, Description, Facilities -->
        <div class="col-lg-8">
          <div class="info-box">
            <!-- Main Title & Badges -->
            <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span class="badge bg-primary">${dest.category}</span>
              <span class="badge bg-success"><i class="fas fa-map-marker-alt me-1"></i>${dest.city}, ${dest.state}</span>
            </div>
            
            <h1 class="h2 fw-bold text-dark mb-1">${dest.name}</h1>
            ${dest.address ? `<p class="text-muted small mb-3"><i class="fas fa-location-dot me-1 text-danger"></i>${dest.address}</p>` : ''}

            <!-- Large Photograph -->
            <img 
              id="mainDetailImg"
              src="${dest.image_url || fallbackImg}" 
              alt="${dest.name}" 
              class="detail-main-img"
              onerror="this.onerror=null; this.src='${fallbackImg}';"
            >

            ${galleryHtml}

            <!-- Detailed Description -->
            <h4 class="fw-bold text-dark mt-4 mb-2"><i class="fas fa-align-left text-primary me-2"></i>About the Attraction</h4>
            <p style="font-size: 1rem; color: #444; line-height: 1.7;">
              ${dest.description}
            </p>

            <!-- Travel Tips Box -->
            ${dest.travel_tips ? `
              <div class="bg-light p-3 rounded border my-3">
                <h5 class="fw-bold mb-1 text-dark"><i class="fas fa-lightbulb text-warning me-2"></i>Travel Tips</h5>
                <p class="small text-muted mb-0">${dest.travel_tips}</p>
              </div>
            ` : ''}

            <!-- Available Facilities -->
            <h4 class="fw-bold text-dark mt-4 mb-2"><i class="fas fa-concierge-bell text-success me-2"></i>Available Facilities</h4>
            <div class="d-flex flex-wrap mb-3">
              ${facilitiesHtml}
            </div>

            <!-- Nearby Attractions -->
            <h4 class="fw-bold text-dark mt-4 mb-2"><i class="fas fa-compass text-primary me-2"></i>Nearby Attractions</h4>
            <div class="d-flex flex-wrap mb-2">
              ${nearbyHtml}
            </div>

            <!-- Verification Notice -->
            <div class="verification-notice">
              <i class="fas fa-exclamation-triangle me-1"></i>
              <strong>Notice:</strong> Information provided is for educational & academic project purposes. Official visiting hours, admission tickets, and seasonal schedules should be verified before visiting.
            </div>
          </div>
        </div>

        <!-- Right Column: Key Visitor Facts -->
        <div class="col-lg-4">
          <div class="info-box">
            <h4 class="h5 fw-bold text-dark border-bottom pb-2 mb-3">
              <i class="fas fa-clipboard-list text-primary me-2"></i>Visitor Information
            </h4>

            <table class="table table-sm info-table mb-3">
              <tbody>
                <tr>
                  <th><i class="far fa-clock text-primary me-1"></i> Timings</th>
                  <td>${dest.opening_hours || 'Please verify before visiting'}</td>
                </tr>
                <tr>
                  <th><i class="fas fa-ticket-alt text-primary me-1"></i> Entry Fee</th>
                  <td>${dest.entry_fee || 'Please verify before visiting'}</td>
                </tr>
                <tr>
                  <th><i class="fas fa-calendar-alt text-primary me-1"></i> Best Time</th>
                  <td>${dest.best_time_to_visit || 'October to March'}</td>
                </tr>
                <tr>
                  <th><i class="fas fa-hourglass-half text-primary me-1"></i> Duration</th>
                  <td>${dest.recommended_duration || '2 to 3 hours'}</td>
                </tr>
                <tr>
                  <th><i class="fas fa-wheelchair text-primary me-1"></i> Accessibility</th>
                  <td class="small">${dest.accessibility || 'Please verify before visiting'}</td>
                </tr>
                ${dest.latitude && dest.longitude ? `
                  <tr>
                    <th><i class="fas fa-map-pin text-primary me-1"></i> Coordinates</th>
                    <td class="font-monospace small">${dest.latitude}° N, ${dest.longitude}° E</td>
                  </tr>
                ` : ''}
              </tbody>
            </table>

            <div class="d-grid gap-2">
              <a href="${mapsUrl}" target="_blank" class="btn btn-primary fw-bold">
                <i class="fas fa-map-marked-alt me-1"></i> View on Google Maps
              </a>
              <a href="destinations.html?category=${encodeURIComponent(dest.category)}" class="btn btn-outline-secondary btn-sm">
                More in ${dest.category}
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

  } catch (err) {
    console.error('Details fetch error:', err);
    container.innerHTML = `
      <div class="text-center py-5">
        <div class="alert alert-danger d-inline-block">
          <h5>Error Loading Destination</h5>
          <p class="mb-2">${err.message || 'Could not fetch destination details.'}</p>
          <a href="destinations.html" class="btn btn-outline-danger btn-sm">Back to Catalog</a>
        </div>
      </div>
    `;
  }
});

// Switch main photo when thumbnail clicked
function changeDetailImage(url, elem) {
  const mainImg = document.getElementById('mainDetailImg');
  if (mainImg) mainImg.src = url;
  document.querySelectorAll('.gallery-thumb').forEach(el => el.classList.remove('active'));
  if (elem) elem.classList.add('active');
}

// Toggle favorite from details page
function toggleDetailFavorite(id) {
  const isAdded = FavoritesManager.toggle(id);
  const btn = document.getElementById('detailFavBtn');
  const text = document.getElementById('detailFavText');

  if (isAdded) {
    btn.className = 'btn btn-sm btn-danger';
    btn.innerHTML = '<i class="fas fa-heart me-1"></i> <span id="detailFavText">Saved in Favorites</span>';
    showToast('Destination added to your favorites!', 'success');
  } else {
    btn.className = 'btn btn-sm btn-outline-danger';
    btn.innerHTML = '<i class="far fa-heart me-1"></i> <span id="detailFavText">Add to Favorites</span>';
    showToast('Removed from favorites.', 'info');
  }
}

window.changeDetailImage = changeDetailImage;
window.toggleDetailFavorite = toggleDetailFavorite;
