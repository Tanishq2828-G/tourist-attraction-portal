/**
 * Contact Form Logic
 * Validates fields on client-side, communicates with POST /api/contact,
 * and renders server confirmation messages.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const alertContainer = document.getElementById('contactAlert');
  const submitBtn = document.getElementById('contactSubmitBtn');
  const btnOriginalText = submitBtn ? submitBtn.innerHTML : 'Send Message';

  if (!form) return;

  function showAlert(message, type = 'success') {
    if (!alertContainer) return;
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    alertContainer.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    alertContainer.innerHTML = `
      <i class="fas ${icon} me-2"></i>
      <span>${message}</span>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertContainer.style.display = 'block';
    alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function clearAlert() {
    if (alertContainer) {
      alertContainer.style.display = 'none';
      alertContainer.innerHTML = '';
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const subjectInput = document.getElementById('contactSubject');
    const messageInput = document.getElementById('contactMessage');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    // Client-side validations
    if (!name || name.length < 2) {
      showAlert('Please enter your full name (at least 2 characters).', 'error');
      if (nameInput) nameInput.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showAlert('Please enter a valid email address.', 'error');
      if (emailInput) emailInput.focus();
      return;
    }

    if (!subject || subject.length < 3) {
      showAlert('Please enter a subject (at least 3 characters).', 'error');
      if (subjectInput) subjectInput.focus();
      return;
    }

    if (!message || message.length < 10) {
      showAlert('Please enter a message with at least 10 characters.', 'error');
      if (messageInput) messageInput.focus();
      return;
    }

    // Disable button & show spinner
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...';
    }

    try {
      const response = await ApiService.submitContact({
        name,
        email,
        subject,
        message
      });

      // ONLY display success if server confirmed
      if (response && response.success) {
        showAlert(response.message || 'Your message was successfully received and stored!', 'success');
        showToast('Message sent successfully!', 'success');
        form.reset();
      } else {
        showAlert(response.error || 'The server could not record your inquiry.', 'error');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      showAlert(err.message || 'An error occurred while transmitting your message. Please try again.', 'error');
      showToast('Submission error. Please check inputs.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = btnOriginalText;
      }
    }
  });
});
