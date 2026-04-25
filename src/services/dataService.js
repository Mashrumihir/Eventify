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

export function fetchAttendeeBookings(userId) {
  return apiRequest(`/attendee/bookings?userId=${encodeURIComponent(userId)}`);
}

export function cancelAttendeeBooking(bookingId, userId) {
  return apiRequest(`/attendee/bookings/${encodeURIComponent(bookingId)}/cancel`, {
    method: 'PATCH',
    body: JSON.stringify({ userId }),
  });
}

export function fetchAttendeePayments(userId) {
  return apiRequest(`/attendee/payments?userId=${encodeURIComponent(userId)}`);
}

export function fetchAttendeeWishlist(userId) {
  return apiRequest(`/attendee/wishlist?userId=${encodeURIComponent(userId)}`);
}

export function fetchAttendeeNotifications(userId) {
  return apiRequest(`/attendee/notifications?userId=${encodeURIComponent(userId)}`);
}

export function markAttendeeNotificationRead(notificationId, userId) {
  return apiRequest(`/attendee/notifications/${encodeURIComponent(notificationId)}/read`, {
    method: 'PATCH',
    body: JSON.stringify({ userId }),
  });
}

export function markAllAttendeeNotificationsRead(userId) {
  return apiRequest('/attendee/notifications/read-all', {
    method: 'PATCH',
    body: JSON.stringify({ userId }),
  });
}

export function fetchAttendeeReviews(userId) {
  return apiRequest(`/attendee/reviews?userId=${encodeURIComponent(userId)}`);
}

export function createAttendeeReview(payload) {
  return apiRequest('/attendee/reviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateAttendeeReview(reviewId, payload) {
  return apiRequest(`/attendee/reviews/${encodeURIComponent(reviewId)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteAttendeeReview(reviewId, userId) {
  return apiRequest(`/attendee/reviews/${encodeURIComponent(reviewId)}?userId=${encodeURIComponent(userId)}`, {
    method: 'DELETE',
  });
}

export function fetchAttendeeProfile(userId) {
  return apiRequest(`/attendee/profile?userId=${encodeURIComponent(userId)}`);
}

export function updateAttendeeProfile(payload) {
  return apiRequest('/attendee/profile', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function updateAttendeePassword(payload) {
  return apiRequest('/attendee/profile/password', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function uploadAvatar(file, userId) {
  const formData = new FormData();
  formData.append('avatar', file);
  formData.append('userId', userId);

  return apiRequest('/attendee/profile/avatar', {
    method: 'POST',
    body: formData,
    headers: {},
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

export function fetchAdminNotifications(userId) {
  return apiRequest(`/admin/notifications?userId=${encodeURIComponent(userId)}`);
}

export function markAdminNotificationRead(notificationId, userId) {
  return apiRequest(`/admin/notifications/${encodeURIComponent(notificationId)}/read`, {
    method: 'PATCH',
    body: JSON.stringify({ userId }),
  });
}

export function markAllAdminNotificationsRead(userId) {
  return apiRequest('/admin/notifications/read-all', {
    method: 'PATCH',
    body: JSON.stringify({ userId }),
  });
}

export function createAdminNotification(payload) {
  return apiRequest('/admin/notifications', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
