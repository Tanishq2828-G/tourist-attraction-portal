/**
 * Global JavaScript Helpers - Tourist Attraction Information Service Portal
 * College Academic Project
 * Handles: Favorites in localStorage, toast messages, and destination card HTML generator.
 */

const FAVORITES_KEY = 'tourist_portal_favorites';

// 1. Manage Favorites in localStorage
const FavoritesManager = {
  // Get all saved destination IDs
  getAll() {
    try {
      const data = localStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('LocalStorage error:', e);
      return [];
    }
  },

  // Check if an ID is favorited
  isFavorite(id) {
    const list = this.getAll();
    return list.includes(Number(id));
  },

  // Add or remove an ID from favorites
  toggle(id) {
    const numId = Number(id);
    let list = this.getAll();
    let isAdded = false;

    if (list.includes(numId)) {
      list = list.filter(item => item !== numId);
      isAdded = false;
    } else {
      list.push(numId);
      isAdded = true;
    }

    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }

    this.updateBadges();

    // Notify other components on the page
    window.dispatchEvent(new CustomEvent('favoritesUpdated', {
      detail: { id: numId, isAdded, list }
    }));

    return isAdded;
  },

  // Update count badge in navigation bar
  updateBadges() {
    const count = this.getAll().length;
    document.querySelectorAll('.favorites-count-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    });
  }
};

window.FavoritesManager = FavoritesManager;

// 2. Simple Toast Notification
function showToast(message, type = 'info', duration = 3000) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container-custom';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-simple ${type}`;
  let icon = 'fa-info-circle text-primary';
  if (type === 'success') icon = 'fa-check-circle text-success';
  if (type === 'error') icon = 'fa-exclamation-triangle text-danger';

  toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, duration);
}

window.showToast = showToast;

// 3. Create a Simple Destination Card HTML
function createDestinationCard(dest) {
  const isFav = FavoritesManager.isFavorite(dest.id);
  const fallbackImg = 'images/placeholder.svg';

  return `
    <div class="col-lg-4 col-md-6 mb-4 destination-card-col" data-id="${dest.id}">
      <div class="card-destination">
        <img 
          src="${dest.image_url || fallbackImg}" 
          alt="${dest.name}" 
          class="card-img"
          loading="lazy"
          onerror="this.onerror=null; this.src='${fallbackImg}';"
        >
        <div class="card-body">
          <span class="card-category">${dest.category}</span>
          <h3 class="card-title">${dest.name}</h3>
          <div class="card-location">
            <i class="fas fa-map-marker-alt"></i> ${dest.city}, ${dest.state}
          </div>
          <p class="card-text">${dest.description}</p>
          
          <div class="card-actions">
            <a href="destination-details.html?id=${dest.id}" class="btn btn-sm btn-primary">
              <i class="fas fa-eye me-1"></i> View Details
            </a>
            <button 
              type="button" 
              class="btn btn-sm ${isFav ? 'btn-danger' : 'btn-outline-danger'} card-fav-btn" 
              onclick="handleCardFavoriteClick(event, ${dest.id})"
            >
              <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
              <span class="ms-1">${isFav ? 'Favorited' : 'Favorite'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.createDestinationCard = createDestinationCard;

// 4. Click Handler for Card Favorite Button
function handleCardFavoriteClick(event, id) {
  event.preventDefault();
  event.stopPropagation();
  const isAdded = FavoritesManager.toggle(id);
  const btn = event.currentTarget;

  if (isAdded) {
    btn.className = 'btn btn-sm btn-danger card-fav-btn';
    btn.innerHTML = '<i class="fas fa-heart"></i> <span class="ms-1">Favorited</span>';
    showToast('Destination added to your favorites!', 'success');
  } else {
    btn.className = 'btn btn-sm btn-outline-danger card-fav-btn';
    btn.innerHTML = '<i class="far fa-heart"></i> <span class="ms-1">Favorite</span>';
    showToast('Removed from favorites.', 'info');
  }
}

window.handleCardFavoriteClick = handleCardFavoriteClick;

// 5. Initialize Badges on Page Load
document.addEventListener('DOMContentLoaded', () => {
  FavoritesManager.updateBadges();

  // Listen for favorites updates across buttons
  window.addEventListener('favoritesUpdated', (e) => {
    const { id, isAdded } = e.detail;
    document.querySelectorAll(`.destination-card-col[data-id="${id}"] .card-fav-btn`).forEach(btn => {
      if (isAdded) {
        btn.className = 'btn btn-sm btn-danger card-fav-btn';
        btn.innerHTML = '<i class="fas fa-heart"></i> <span class="ms-1">Favorited</span>';
      } else {
        btn.className = 'btn btn-sm btn-outline-danger card-fav-btn';
        btn.innerHTML = '<i class="far fa-heart"></i> <span class="ms-1">Favorite</span>';
      }
    });
  });
});
