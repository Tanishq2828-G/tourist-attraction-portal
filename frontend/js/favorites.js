/**
 * Favorites Page Logic
 * Displays tourist attractions saved by visitors in browser localStorage.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('favoritesGrid');
  const emptyState = document.getElementById('favoritesEmptyState');
  const countBadge = document.getElementById('favoritesPageCount');
  const clearAllBtn = document.getElementById('clearAllFavoritesBtn');

  async function loadFavorites() {
    const favoriteIds = FavoritesManager.getAll();

    if (favoriteIds.length === 0) {
      if (container) container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      if (countBadge) countBadge.textContent = '0 destinations';
      if (clearAllBtn) clearAllBtn.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (clearAllBtn) clearAllBtn.style.display = 'inline-block';
    if (countBadge) {
      countBadge.textContent = `${favoriteIds.length} destination${favoriteIds.length > 1 ? 's' : ''}`;
    }

    try {
      // Fetch all destinations from backend
      const res = await ApiService.getDestinations();
      const all = res.data || [];
      const favoritedItems = all.filter(d => favoriteIds.includes(d.id));

      if (container) {
        if (favoritedItems.length === 0) {
          container.innerHTML = '';
          if (emptyState) emptyState.style.display = 'block';
          if (clearAllBtn) clearAllBtn.style.display = 'none';
        } else {
          container.innerHTML = favoritedItems.map(createDestinationCard).join('');
        }
      }
    } catch (err) {
      console.error('Error loading favorites data:', err);
      if (container) {
        container.innerHTML = `
          <div class="col-12 py-5 text-center">
            <div class="alert alert-warning">
              Unable to load your saved attractions. Please check backend connection.
            </div>
          </div>
        `;
      }
    }
  }

  // Clear All Favorites button
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to remove all saved favorites?')) {
        localStorage.removeItem('tourist_portal_favorites');
        FavoritesManager.updateBadges();
        showToast('All saved favorites have been cleared.', 'info');
        loadFavorites();
      }
    });
  }

  // Handle immediate visual updates when user un-favorites a destination
  window.addEventListener('favoritesUpdated', (e) => {
    const { id, isAdded } = e.detail;
    if (!isAdded) {
      const cardCol = document.querySelector(`.destination-card-col[data-id="${id}"]`);
      if (cardCol) {
        cardCol.style.transition = 'all 0.3s ease';
        cardCol.style.opacity = '0';
        cardCol.style.transform = 'scale(0.9)';
        setTimeout(() => {
          cardCol.remove();
          const remaining = FavoritesManager.getAll().length;
          if (countBadge) {
            countBadge.textContent = `${remaining} destination${remaining !== 1 ? 's' : ''}`;
          }
          if (remaining === 0) {
            if (emptyState) emptyState.style.display = 'block';
            if (clearAllBtn) clearAllBtn.style.display = 'none';
          }
        }, 300);
      }
    }
  });

  await loadFavorites();
});

