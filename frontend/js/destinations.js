/**
 * Destinations Page Logic - Simple & User-Friendly
 * Handles search, category/state filters, sorting, and pagination.
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

  let allDestinations = [];
  let displayedCount = 9;
  const PAGE_SIZE = 9;

  // Read URL query parameters (e.g. ?search=Charminar or ?category=Historical%20Monuments)
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('search') || urlParams.get('q') || '';
  const initialCategory = urlParams.get('category') || '';
  const initialState = urlParams.get('state') || '';

  if (searchInput && initialQuery) searchInput.value = initialQuery;

  // Populate filter dropdowns from backend
  async function loadFilterDropdowns() {
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

  // Fetch destinations from backend API
  async function fetchDestinations() {
    if (gridContainer) {
      gridContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="text-muted mt-2">Loading destinations...</p>
        </div>
      `;
    }

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

      renderDestinations();
    } catch (err) {
      console.error('Error fetching destinations:', err);
      if (gridContainer) {
        gridContainer.innerHTML = `
          <div class="col-12 py-4 text-center">
            <div class="alert alert-danger d-inline-block">
              Unable to load destinations from backend.
            </div>
          </div>
        `;
      }
    }
  }

  // Render list to screen
  function renderDestinations() {
    if (!gridContainer) return;

    if (allDestinations.length === 0) {
      gridContainer.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      if (resultsCount) resultsCount.textContent = '0 destinations found';
      if (loadMoreWrapper) loadMoreWrapper.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (resultsCount) {
      resultsCount.textContent = `${allDestinations.length} destination${allDestinations.length > 1 ? 's' : ''} found`;
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

  // Load More button click
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      displayedCount += PAGE_SIZE;
      renderDestinations();
    });
  }

  // Debounced search typing
  let debounceTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        fetchDestinations();
      }, 300);
    });
  }

  // Filter change handlers
  if (categoryFilter) categoryFilter.addEventListener('change', fetchDestinations);
  if (stateFilter) stateFilter.addEventListener('change', fetchDestinations);
  if (sortSelect) sortSelect.addEventListener('change', fetchDestinations);

  // Clear filters
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (categoryFilter) categoryFilter.value = '';
      if (stateFilter) stateFilter.value = '';
      if (sortSelect) sortSelect.value = 'name_asc';
      fetchDestinations();
    });
  }

  const resetEmptyBtn = document.getElementById('resetEmptyBtn');
  if (resetEmptyBtn) {
    resetEmptyBtn.addEventListener('click', () => {
      if (clearBtn) clearBtn.click();
    });
  }

  // Run initialization
  await loadFilterDropdowns();
  await fetchDestinations();
});
