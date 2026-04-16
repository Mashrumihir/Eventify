import { apiRequest } from './api';

export function fetchEventCategories() {
  return apiRequest('/events/categories');
}

export function fetchEvents(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value);
    }
  });

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : '';
  return apiRequest(`/events${suffix}`);
}

export function createEvent(payload) {
  return apiRequest('/events', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateEvent(eventId, payload) {
  return apiRequest(`/events/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteEvent(eventId) {
  return apiRequest(`/events/${eventId}`, {
    method: 'DELETE',
  });
}

export function fetchAttendeeDashboard(userId) {
  return apiRequest(`/dashboard/attendee?userId=${encodeURIComponent(userId)}`);
}

export function fetchOrganizerDashboard(organizerId) {
  return apiRequest(`/dashboard/organizer?organizerId=${encodeURIComponent(organizerId)}`);
}

export function fetchAdminDashboard() {
  return apiRequest('/dashboard/admin');
}

export function toggleWishlist(userId, eventId) {
  return apiRequest('/attendee/wishlist/toggle', {
    method: 'POST',
    body: JSON.stringify({ userId, eventId }),
  });
}

export function fetchUsers(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : '';
  return apiRequest(`/admin/users${suffix}`);
}

export function createUser(payload) {
  return apiRequest('/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateUserStatus(userId, status) {
  return apiRequest(`/admin/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function removeUser(userId) {
  return apiRequest(`/admin/users/${userId}`, {
    method: 'DELETE',
  });
}

export function fetchOrganizerApplications(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : '';
  return apiRequest(`/admin/organizer-applications${suffix}`);
}

export function createOrganizerApplication(payload) {
  return apiRequest('/admin/organizer-applications', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateOrganizerApplication(applicationId, status) {
  return apiRequest(`/admin/organizer-applications/${applicationId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
