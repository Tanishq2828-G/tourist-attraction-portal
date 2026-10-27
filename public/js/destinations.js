/**
 * Destinations Page Logic - Filter, Search, Sort, and Paginated Listing
 */

document.addEventListener('DOMContentLoaded', async () => {
  const searchInput = document.getElementById('destSearchInput');
  const categoryFilter = document.getElementById('destCategoryFilter');
  const stateFilter = document.getElementById('destStateFilter');
  const sortSelect = document.getElementById('destSortSelect');
  const clearBtn = document.getElementById('destClearBtn');
  const gridContainer = document.getElementById('destinationsGrid');
  const resultsCount = document.getElementById('destResultsCount');
  const emptyState = document.getElementById('destEmptyState');
  const loadMoreBtn = document.getElementById('destLoadMoreBtn');
  const loadMoreWrapper = document.getElementById('destLoadMoreWrapper');

  // State
  let allDestinations = [];
  let displayedCount = 9;
  const PAGE_SIZE = 9;

  // Read URL query parameters (e.g. ?search=fort or ?category=Historical%20Monuments)
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('search') || urlParams.get('q') || '';
  const initialCategory = urlParams.get('category') || '';
  const initialState = urlParams.get('state') || '';

  if (searchInput && initialQuery) searchInput.value = initialQuery;

  // Initialize Filter Dropdowns
  async function loadFilterOptions() {
    try {
      const [categoriesRes, statesRes] = await Promise.all([
        ApiService.getCategories(),
        ApiService.getStates()
      ]);

      if (categoryFilter && categoriesRes.success) {
        categoriesRes.data.forEach(item => {
          const opt = document.createElement('option');
          opt.value = item.category;
          opt.textContent = `${item.category} (${item.count})`;
          if (initialCategory.toLowerCase() === item.category.toLowerCase()) {
            opt.selected = true;
          }
          categoryFilter.appendChild(opt);
        });
      }

      if (stateFilter && statesRes.success) {
        statesRes.data.forEach(item => {
          const opt = document.createElement('option');
          opt.value = item.state;
          opt.textContent = `${item.state} (${item.count})`;
          if (initialState.toLowerCase() === item.state.toLowerCase()) {
            opt.selected = true;
          }
          stateFilter.appendChild(opt);
        });
      }
    } catch (err) {
      console.warn('Could not populate filter dropdowns:', err);
    }
  }

  // Show Skeleton Loaders
  function renderSkeletons() {
    if (!gridContainer) return;
    gridContainer.innerHTML = Array(6).fill(0).map(() => `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="destination-card">
          <div class="card-img-wrapper skeleton"></div>
          <div class="card-body-content">
            <div class="skeleton mb-2" style="height: 18px; width: 40%;"></div>
            <div class="skeleton mb-3" style="height: 26px; width: 75%;"></div>
            <div class="skeleton mb-2" style="height: 14px; width: 100%;"></div>
            <div class="skeleton mb-4" style="height: 14px; width: 85%;"></div>
            <div class="d-flex justify-content-between pt-3 border-top">
              <div class="skeleton" style="height: 20px; width: 30%;"></div>
              <div class="skeleton" style="height: 34px; width: 35%; border-radius: 8px;"></div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Fetch from API and render
  async function fetchAndRenderDestinations() {
    renderSkeletons();
    if (emptyState) emptyState.style.display = 'none';
    if (loadMoreWrapper) loadMoreWrapper.style.display = 'none';

    const params = {
      q: searchInput ? searchInput.value.trim() : '',
      category: categoryFilter ? categoryFilter.value : '',
      state: stateFilter ? stateFilter.value : '',
      sort: sortSelect ? sortSelect.value : 'name_asc'
    };

    try {
      const response = await ApiService.getDestinations(params);
      allDestinations = response.data || [];
      displayedCount = PAGE_SIZE;

      renderCurrentList();
    } catch (err) {
      console.error('Error fetching destinations:', err);
      if (gridContainer) {
        gridContainer.innerHTML = `
          <div class="col-12 py-5 text-center">
            <div class="alert alert-danger d-inline-block px-4 py-3">
              <i class="fas fa-exclamation-circle me-2"></i>
              Unable to load destinations. Ensure the backend server is running at 
              <strong>${window.location.origin}</strong>.
            </div>
          </div>
        `;
      }
    }
  }

  function renderCurrentList() {
    if (!gridContainer) return;

    if (allDestinations.length === 0) {
      gridContainer.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      if (resultsCount) resultsCount.textContent = '0 destinations';
      if (loadMoreWrapper) loadMoreWrapper.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (resultsCount) {
      resultsCount.textContent = `${allDestinations.length} destination${allDestinations.length > 1 ? 's' : ''}`;
    }

    const itemsToDisplay = allDestinations.slice(0, displayedCount);
    gridContainer.innerHTML = itemsToDisplay.map(createDestinationCard).join('');

    // Load more button logic
    if (loadMoreWrapper && loadMoreBtn) {
      if (displayedCount < allDestinations.length) {
        loadMoreWrapper.style.display = 'block';
        loadMoreBtn.innerHTML = `Load More (${allDestinations.length - displayedCount} remaining)`;
      } else {
        loadMoreWrapper.style.display = 'none';
      }
    }
  }

  // Load More Click
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      displayedCount += PAGE_SIZE;
      renderCurrentList();
    });
  }

  // Debounced search
  let debounceTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        fetchAndRenderDestinations();
      }, 350);
    });
  }

  // Filter Changes
  if (categoryFilter) categoryFilter.addEventListener('change', fetchAndRenderDestinations);
  if (stateFilter) stateFilter.addEventListener('change', fetchAndRenderDestinations);
  if (sortSelect) sortSelect.addEventListener('change', fetchAndRenderDestinations);

  // Clear Filters Button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (categoryFilter) categoryFilter.value = '';
      if (stateFilter) stateFilter.value = '';
      if (sortSelect) sortSelect.value = 'name_asc';
      fetchAndRenderDestinations();
    });
  }

  // Reset button in empty state
  const resetEmptyBtn = document.getElementById('resetEmptyBtn');
  if (resetEmptyBtn) {
    resetEmptyBtn.addEventListener('click', () => {
      if (clearBtn) clearBtn.click();
    });
  }

  // Initialize
  await loadFilterOptions();
  await fetchAndRenderDestinations();
});
