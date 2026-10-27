/**
 * Global Application Scripts - Tourist Attraction Information Service Portal
 * Manages favorites persistence, toast alerts, card rendering, and UI states.
 */

const STORAGE_KEY_FAVORITES = 'tourist_portal_favorites_v1';

// Favorites Store (using browser localStorage)
const FavoritesManager = {
  getAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('LocalStorage access issue:', e);
      return [];
    }
  },

  isFavorite(id) {
    const list = this.getAll();
    return list.includes(Number(id));
  },

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
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }

    this.updateBadges();

    // Trigger custom event so any active page view updates immediately
    window.dispatchEvent(new CustomEvent('favoritesUpdated', {
      detail: { id: numId, isAdded, list }
    }));

    return isAdded;
  },

  updateBadges() {
    const count = this.getAll().length;
    document.querySelectorAll('.favorites-count-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    });
  }
};

window.FavoritesManager = FavoritesManager;

// Toast Notification System
function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container-custom';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `custom-toast ${type}`;

  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-check-circle text-success';
  if (type === 'error') icon = 'fa-exclamation-triangle text-danger';

  toast.innerHTML = `
    <i class="fas ${icon} fa-lg"></i>
    <div class="flex-grow-1" style="font-size: 0.95rem; font-weight: 600;">${message}</div>
    <button type="button" class="btn-close btn-sm" aria-label="Close" style="font-size: 0.75rem;"></button>
  `;

  const closeBtn = toast.querySelector('.btn-close');
  closeBtn.addEventListener('click', () => {
    toast.remove();
  });

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }
  }, duration);
}

window.showToast = showToast;

/**
 * Generates an HTML card for a destination
 */
function createDestinationCard(dest) {
  const isFav = FavoritesManager.isFavorite(dest.id);
  const fallbackImg = '/images/placeholder.svg';

  return `
    <div class="col-lg-4 col-md-6 mb-4 destination-card-col" data-id="${dest.id}">
      <div class="destination-card h-100">
        <div class="card-img-wrapper">
          <img 
            src="${dest.image_url || fallbackImg}" 
            alt="${dest.name}" 
            loading="lazy"
            onerror="this.onerror=null; this.src='${fallbackImg}';"
          >
          <span class="card-category-badge">
            <i class="fas fa-tag me-1"></i>${dest.category}
          </span>
          <button 
            type="button"
            class="card-favorite-btn ${isFav ? 'favorited' : ''}" 
            data-id="${dest.id}" 
            title="${isFav ? 'Remove from favorites' : 'Add to favorites'}"
            aria-label="Toggle favorite for ${dest.name}"
            onclick="handleCardFavoriteClick(event, ${dest.id})"
          >
            <i class="${isFav ? 'fas text-danger' : 'far'} fa-heart"></i>
          </button>
        </div>

        <div class="card-body-content">
          <div class="card-location">
            <i class="fas fa-map-marker-alt"></i>
            <span>${dest.city}, ${dest.state}</span>
          </div>
          
          <h3 class="card-title">${dest.name}</h3>
          
          <p class="card-description">${dest.description}</p>
          
          <div class="card-meta-row">
            <span class="text-muted small fw-medium">
              <i class="far fa-clock me-1 text-primary"></i>${dest.recommended_duration || '2-3 hours'}
            </span>
            <a href="destination-details.html?id=${dest.id}" class="btn-details">
              View Details <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.createDestinationCard = createDestinationCard;

// Card Favorite Click Event Handler
function handleCardFavoriteClick(event, id) {
  event.preventDefault();
  event.stopPropagation();
  const isAdded = FavoritesManager.toggle(id);
  
  // Update button visual
  const btn = event.currentTarget;
  if (isAdded) {
    btn.classList.add('favorited');
    btn.innerHTML = '<i class="fas text-danger fa-heart"></i>';
    btn.title = 'Remove from favorites';
    showToast('Added to your favorite destinations!', 'success');
  } else {
    btn.classList.remove('favorited');
    btn.innerHTML = '<i class="far fa-heart"></i>';
    btn.title = 'Add to favorites';
    showToast('Removed from your favorites.', 'info');
  }
}

window.handleCardFavoriteClick = handleCardFavoriteClick;

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Update favorite badge counters
  FavoritesManager.updateBadges();

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar-custom');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Sync favorites when updated in another tab or button
  window.addEventListener('favoritesUpdated', (e) => {
    const { id, isAdded } = e.detail;
    document.querySelectorAll(`.card-favorite-btn[data-id="${id}"]`).forEach(btn => {
      if (isAdded) {
        btn.classList.add('favorited');
        btn.innerHTML = '<i class="fas text-danger fa-heart"></i>';
      } else {
        btn.classList.remove('favorited');
        btn.innerHTML = '<i class="far fa-heart"></i>';
      }
    });
  });
});
