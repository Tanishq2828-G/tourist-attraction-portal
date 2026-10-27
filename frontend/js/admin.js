/**
 * Admin Dashboard Controller
 * Enforces server-side authentication, loads records, and executes CRUD operations.
 */

const ADMIN_STORAGE_KEY = 'tourist_admin_session_key';

document.addEventListener('DOMContentLoaded', () => {
  const loginGate = document.getElementById('adminLoginGate');
  const dashboardView = document.getElementById('adminDashboardView');
  const loginForm = document.getElementById('adminLoginForm');
  const loginAlert = document.getElementById('adminLoginAlert');
  const logoutBtn = document.getElementById('adminLogoutBtn');
  const destTableBody = document.getElementById('adminDestTableBody');
  const msgsTableBody = document.getElementById('adminMsgsTableBody');

  let currentAdminKey = sessionStorage.getItem(ADMIN_STORAGE_KEY) || '';
  let destinationsCache = [];
  let destinationToDelete = null;

  // Modals
  const destinationModalElem = document.getElementById('destinationModal');
  const destinationModal = new bootstrap.Modal(destinationModalElem);
  const deleteConfirmModalElem = document.getElementById('deleteConfirmModal');
  const deleteConfirmModal = new bootstrap.Modal(deleteConfirmModalElem);

  // Check initial authentication
  if (currentAdminKey) {
    verifyAndDisplay(currentAdminKey);
  }

  // Handle Login submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('adminKeyInput');
      const key = input ? input.value.trim() : '';

      if (!key) {
        showLoginError('Please enter the administrator secret key.');
        return;
      }

      const isValid = await verifyAndDisplay(key);
      if (!isValid) {
        showLoginError('Invalid administrator secret key. Access denied.');
      }
    });
  }

  function showLoginError(msg) {
    if (loginAlert) {
      loginAlert.textContent = msg;
      loginAlert.style.display = 'block';
    }
  }

  // Authenticate key with server
  async function verifyAndDisplay(key) {
    try {
      const isValid = await ApiService.adminVerify(key);
      if (isValid) {
        currentAdminKey = key;
        sessionStorage.setItem(ADMIN_STORAGE_KEY, key);

        if (loginGate) loginGate.style.display = 'none';
        if (dashboardView) dashboardView.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';

        await refreshDashboard();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Admin verification failure:', err);
      return false;
    }
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
      currentAdminKey = '';
      if (loginGate) loginGate.style.display = 'flex';
      if (dashboardView) dashboardView.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'none';
      const input = document.getElementById('adminKeyInput');
      if (input) input.value = '';
      if (loginAlert) loginAlert.style.display = 'none';
    });
  }

  // Refresh all dashboard metrics, destinations, and messages
  async function refreshDashboard() {
    try {
      const [statsRes, destsRes, msgsRes] = await Promise.all([
        ApiService.getStats(),
        ApiService.getDestinations(),
        fetch(`${window.location.origin}/api/contact`, {
          headers: { 'x-admin-key': currentAdminKey }
        }).then(r => r.json())
      ]);

      // Metrics
      if (statsRes.success && statsRes.stats) {
        document.getElementById('dashTotalDest').textContent = statsRes.stats.totalDestinations;
        document.getElementById('dashTotalCat').textContent = statsRes.stats.totalCategories;
        document.getElementById('dashTotalStates').textContent = statsRes.stats.totalStates;
        document.getElementById('dashTotalMsgs').textContent = statsRes.stats.totalMessages;
      }

      // Destinations Table
      if (destsRes.success && destsRes.data) {
        destinationsCache = destsRes.data;
        document.getElementById('tabDestCount').textContent = destsRes.data.length;
        renderDestTable(destinationsCache);
      }

      // Messages Table
      if (msgsRes.success && msgsRes.data) {
        document.getElementById('tabMsgCount').textContent = msgsRes.data.length;
        renderMsgsTable(msgsRes.data);
      }

    } catch (err) {
      console.error('Error refreshing dashboard:', err);
      showToast('Error syncing dashboard data: ' + err.message, 'error');
    }
  }

  // Render destinations table
  function renderDestTable(list) {
    if (!destTableBody) return;
    if (list.length === 0) {
      destTableBody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No destinations in database.</td></tr>';
      return;
    }

    destTableBody.innerHTML = list.map(d => `
      <tr>
        <td class="font-monospace text-muted small">#${d.id}</td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <img src="${d.image_url || '/images/placeholder.svg'}" alt="" style="width: 44px; height: 32px; object-fit: cover; border-radius: 4px;" onerror="this.src='/images/placeholder.svg';">
            <div class="fw-bold text-dark">${d.name}</div>
          </div>
        </td>
        <td class="small">${d.city}, ${d.state}</td>
        <td><span class="badge bg-light text-dark border">${d.category}</span></td>
        <td class="small text-muted">${d.opening_hours || 'N/A'}</td>
        <td class="small text-muted">${d.entry_fee || 'N/A'}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary me-1" onclick="openEditModal(${d.id})" title="Edit destination">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="promptDeleteDestination(${d.id}, '${d.name.replace(/'/g, "\\'")}')" title="Delete destination">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Render contact messages table
  function renderMsgsTable(messages) {
    if (!msgsTableBody) return;
    if (messages.length === 0) {
      msgsTableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">No visitor contact inquiries received yet.</td></tr>';
      return;
    }

    msgsTableBody.innerHTML = messages.map(m => `
      <tr>
        <td class="font-monospace text-muted small">#${m.id}</td>
        <td class="small text-muted">${new Date(m.created_at).toLocaleDateString()}</td>
        <td class="fw-semibold text-dark">${m.name}</td>
        <td class="small"><a href="mailto:${m.email}">${m.email}</a></td>
        <td class="fw-medium">${m.subject}</td>
        <td class="small text-muted" style="max-width: 250px;">${m.message}</td>
      </tr>
    `).join('');
  }

  // Add Destination Modal opener
  window.openAddModal = function() {
    document.getElementById('destinationModalLabel').textContent = 'Add New Destination';
    document.getElementById('destFormId').value = '';
    document.getElementById('destinationForm').reset();
    document.getElementById('modalAlert').style.display = 'none';
  };

  // Edit Destination Modal opener
  window.openEditModal = function(id) {
    const dest = destinationsCache.find(d => d.id === Number(id));
    if (!dest) return;

    document.getElementById('destinationModalLabel').textContent = `Edit Destination #${dest.id} - ${dest.name}`;
    document.getElementById('destFormId').value = dest.id;
    document.getElementById('destFormName').value = dest.name || '';
    document.getElementById('destFormCategory').value = dest.category || 'Historical Monuments';
    document.getElementById('destFormCity').value = dest.city || '';
    document.getElementById('destFormState').value = dest.state || '';
    document.getElementById('destFormAddress').value = dest.address || '';
    document.getElementById('destFormDesc').value = dest.description || '';
    document.getElementById('destFormImageUrl').value = dest.image_url || '';
    document.getElementById('destFormTimings').value = dest.opening_hours || '';
    document.getElementById('destFormEntryFee').value = dest.entry_fee || '';
    document.getElementById('destFormBestTime').value = dest.best_time_to_visit || '';
    document.getElementById('destFormDuration').value = dest.recommended_duration || '';
    document.getElementById('destFormLat').value = dest.latitude || '';
    document.getElementById('destFormLong').value = dest.longitude || '';
    document.getElementById('destFormFacilities').value = Array.isArray(dest.facilities) ? dest.facilities.join(', ') : (dest.facilities || '');
    document.getElementById('destFormTips').value = dest.travel_tips || '';
    document.getElementById('destFormNearby').value = dest.nearby_attractions || '';
    document.getElementById('modalAlert').style.display = 'none';

    destinationModal.show();
  };

  // Delete Prompt
  window.promptDeleteDestination = function(id, name) {
    destinationToDelete = { id, name };
    document.getElementById('deleteDestNamePrompt').textContent = `"${name}" (#${id})`;
    deleteConfirmModal.show();
  };

  // Confirm Delete
  document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    if (!destinationToDelete) return;

    try {
      await ApiService.adminDeleteDestination(destinationToDelete.id, currentAdminKey);
      showToast(`Destination "${destinationToDelete.name}" deleted successfully.`, 'success');
      deleteConfirmModal.hide();
      destinationToDelete = null;
      await refreshDashboard();
    } catch (err) {
      console.error('Delete error:', err);
      showToast(err.message || 'Failed to delete destination.', 'error');
    }
  });

  // Handle Save Destination Form (Create / Edit)
  const destForm = document.getElementById('destinationForm');
  destForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const modalAlert = document.getElementById('modalAlert');
    modalAlert.style.display = 'none';

    const id = document.getElementById('destFormId').value;
    const name = document.getElementById('destFormName').value.trim();
    const category = document.getElementById('destFormCategory').value;
    const city = document.getElementById('destFormCity').value.trim();
    const state = document.getElementById('destFormState').value.trim();
    const address = document.getElementById('destFormAddress').value.trim();
    const description = document.getElementById('destFormDesc').value.trim();
    const image_url = document.getElementById('destFormImageUrl').value.trim();
    const opening_hours = document.getElementById('destFormTimings').value.trim();
    const entry_fee = document.getElementById('destFormEntryFee').value.trim();
    const best_time_to_visit = document.getElementById('destFormBestTime').value.trim();
    const recommended_duration = document.getElementById('destFormDuration').value.trim();
    const latitude = document.getElementById('destFormLat').value;
    const longitude = document.getElementById('destFormLong').value;
    const facilitiesRaw = document.getElementById('destFormFacilities').value.trim();
    const travel_tips = document.getElementById('destFormTips').value.trim();
    const nearby_attractions = document.getElementById('destFormNearby').value.trim();

    // Validation
    if (!name || !city || !state || !description || !image_url) {
      modalAlert.textContent = 'Please fill out all required fields marked with *.';
      modalAlert.style.display = 'block';
      return;
    }

    const facilities = facilitiesRaw 
      ? facilitiesRaw.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const payload = {
      name, category, city, state, address, description, image_url,
      opening_hours, entry_fee, best_time_to_visit, recommended_duration,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      facilities, travel_tips, nearby_attractions
    };

    try {
      if (id) {
        // Update
        await ApiService.adminUpdateDestination(id, payload, currentAdminKey);
        showToast(`Destination "${name}" updated successfully!`, 'success');
      } else {
        // Create
        await ApiService.adminCreateDestination(payload, currentAdminKey);
        showToast(`New destination "${name}" created successfully!`, 'success');
      }

      destinationModal.hide();
      await refreshDashboard();
    } catch (err) {
      console.error('Destination save error:', err);
      modalAlert.textContent = err.message || 'Operation failed.';
      modalAlert.style.display = 'block';
    }
  });

});

