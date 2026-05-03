/**
 * Eventify API Service Layer
 * Complete API integration for Admin, Attendee, and Organizer
 * Compatible with PostgreSQL backend
 */

import { apiRequest } from './api.js';

// ============================================================================
// AUTHENTICATION API
// ============================================================================

export const AuthAPI = {
  // Register new user
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  // Login
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  // Logout
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),

  // Forgot password - request OTP
  forgotPassword: (email) => apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  // Reset password with OTP
  resetPassword: (data) => apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Verify email
  verifyEmail: (token) => apiRequest('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token }),
  }),

  // Resend verification email
  resendVerification: (email) => apiRequest('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  // Change password (authenticated)
  changePassword: (data) => apiRequest('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Refresh token
  refreshToken: () => apiRequest('/auth/refresh', { method: 'POST' }),

  // Get current user profile
  getProfile: () => apiRequest('/auth/profile'),

  // Update profile
  updateProfile: (data) => apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Upload avatar
  uploadAvatar: (formData) => apiRequest('/auth/avatar', {
    method: 'POST',
    body: formData,
  }),
};

// ============================================================================
// EVENTS API (Public + Organizer)
// ============================================================================

export const EventsAPI = {
  // List all published events
  list: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/events${queryString ? `?${queryString}` : ''}`);
  },

  // Get single event details
  getById: (id) => apiRequest(`/events/${id}`),

  // Get event by slug (for SEO-friendly URLs)
  getBySlug: (slug) => apiRequest(`/events/slug/${slug}`),

  // Create event (Organizer only)
  create: (data) => apiRequest('/events', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Update event (Organizer only)
  update: (id, data) => apiRequest(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Delete event (Organizer/Admin)
  delete: (id) => apiRequest(`/events/${id}`, { method: 'DELETE' }),

  // Publish event
  publish: (id) => apiRequest(`/events/${id}/publish`, { method: 'POST' }),

  // Get event categories
  getCategories: () => apiRequest('/events/categories'),

  // Get event tags
  getTags: () => apiRequest('/events/tags'),

  // Get organizer's events
  getOrganizerEvents: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/organizer/events${queryString ? `?${queryString}` : ''}`);
  },

  // Search events
  search: (query, filters = {}) => apiRequest('/events/search', {
    method: 'POST',
    body: JSON.stringify({ query, ...filters }),
  }),

  // Get featured events
  getFeatured: () => apiRequest('/events/featured'),

  // Get upcoming events
  getUpcoming: (limit = 10) => apiRequest(`/events/upcoming?limit=${limit}`),

  // Get related events
  getRelated: (id, limit = 5) => apiRequest(`/events/${id}/related?limit=${limit}`),
};

// ============================================================================
// TICKETS API
// ============================================================================

export const TicketsAPI = {
  // Get ticket types for an event
  getByEvent: (eventId) => apiRequest(`/events/${eventId}/tickets`),

  // Create ticket type (Organizer)
  create: (eventId, data) => apiRequest(`/events/${eventId}/tickets`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Update ticket type
  update: (ticketId, data) => apiRequest(`/tickets/${ticketId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Delete ticket type
  delete: (ticketId) => apiRequest(`/tickets/${ticketId}`, { method: 'DELETE' }),

  // Check availability
  checkAvailability: (eventId) => apiRequest(`/events/${eventId}/availability`),

  // Validate promo code
  validatePromoCode: (eventId, code) => apiRequest(`/events/${eventId}/promo/validate`, {
    method: 'POST',
    body: JSON.stringify({ code }),
  }),
};

// ============================================================================
// BOOKINGS API (Attendee)
// ============================================================================

export const BookingsAPI = {
  // Create booking (initiate checkout)
  create: (data) => apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Get booking details
  getById: (id) => apiRequest(`/bookings/${id}`),

  // Get booking by reference number
  getByReference: (reference) => apiRequest(`/bookings/reference/${reference}`),

  // List user's bookings
  list: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/bookings${queryString ? `?${queryString}` : ''}`);
  },

  // Cancel booking
  cancel: (id, reason) => apiRequest(`/bookings/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),

  // Resend booking confirmation email
  resendConfirmation: (id) => apiRequest(`/bookings/${id}/resend-confirmation`, {
    method: 'POST',
  }),

  // Download ticket
  downloadTicket: (id) => apiRequest(`/bookings/${id}/ticket`, {
    headers: { Accept: 'application/pdf' },
  }),

  // Transfer ticket to another user
  transfer: (id, data) => apiRequest(`/bookings/${id}/transfer`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Get booking statistics (for dashboard)
  getStats: () => apiRequest('/bookings/stats'),
};

// ============================================================================
// PAYMENTS API
// ============================================================================

export const PaymentsAPI = {
  // Initialize payment
  initialize: (bookingId) => apiRequest('/payments/initialize', {
    method: 'POST',
    body: JSON.stringify({ bookingId }),
  }),

  // Process payment
  process: (data) => apiRequest('/payments/process', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Verify payment (callback from gateway)
  verify: (data) => apiRequest('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Get payment status
  getStatus: (paymentId) => apiRequest(`/payments/${paymentId}/status`),

  // List user's payments
  list: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/payments${queryString ? `?${queryString}` : ''}`);
  },

  // Request refund
  requestRefund: (paymentId, data) => apiRequest(`/payments/${paymentId}/refund`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Get invoice
  getInvoice: (paymentId) => apiRequest(`/payments/${paymentId}/invoice`),

  // Download invoice PDF
  downloadInvoice: (paymentId) => apiRequest(`/payments/${paymentId}/invoice/download`),
};

// ============================================================================
// WISHLIST API (Attendee)
// ============================================================================

export const WishlistAPI = {
  // Get wishlist
  list: () => apiRequest('/wishlist'),

  // Add to wishlist
  add: (eventId) => apiRequest('/wishlist', {
    method: 'POST',
    body: JSON.stringify({ eventId }),
  }),

  // Remove from wishlist
  remove: (eventId) => apiRequest(`/wishlist/${eventId}`, { method: 'DELETE' }),

  // Check if event is in wishlist
  check: (eventId) => apiRequest(`/wishlist/check/${eventId}`),
};

// ============================================================================
// REVIEWS API
// ============================================================================

export const ReviewsAPI = {
  // Get reviews for an event
  getByEvent: (eventId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/events/${eventId}/reviews${queryString ? `?${queryString}` : ''}`);
  },

  // Create review
  create: (eventId, data) => apiRequest(`/events/${eventId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Update review
  update: (reviewId, data) => apiRequest(`/reviews/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Delete review
  delete: (reviewId) => apiRequest(`/reviews/${reviewId}`, { method: 'DELETE' }),

  // Mark review as helpful
  markHelpful: (reviewId) => apiRequest(`/reviews/${reviewId}/helpful`, { method: 'POST' }),

  // Get user's reviews
  getUserReviews: () => apiRequest('/reviews/my-reviews'),
};

// ============================================================================
// NOTIFICATIONS API
// ============================================================================

export const NotificationsAPI = {
  // Get notifications
  list: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/notifications${queryString ? `?${queryString}` : ''}`);
  },

  // Get unread count
  getUnreadCount: () => apiRequest('/notifications/unread-count'),

  // Mark as read
  markAsRead: (id) => apiRequest(`/notifications/${id}/read`, { method: 'POST' }),

  // Mark all as read
  markAllAsRead: () => apiRequest('/notifications/read-all', { method: 'POST' }),

  // Delete notification
  delete: (id) => apiRequest(`/notifications/${id}`, { method: 'DELETE' }),

  // Update notification preferences
  updatePreferences: (data) => apiRequest('/notifications/preferences', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// ============================================================================
// ORGANIZER API
// ============================================================================

export const OrganizerAPI = {
  // Apply to become organizer
  apply: (data) => apiRequest('/organizer/apply', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Get application status
  getApplicationStatus: () => apiRequest('/organizer/application-status'),

  // Get dashboard stats
  getDashboardStats: () => apiRequest('/organizer/dashboard'),

  // Get revenue reports
  getRevenue: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/organizer/revenue${queryString ? `?${queryString}` : ''}`);
  },

  // Get bookings for organizer's events
  getBookings: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/organizer/bookings${queryString ? `?${queryString}` : ''}`);
  },

  // Update organizer profile
  updateProfile: (data) => apiRequest('/organizer/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Get payout details
  getPayouts: () => apiRequest('/organizer/payouts'),

  // Update payout method
  updatePayoutMethod: (data) => apiRequest('/organizer/payout-method', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Create announcement
  createAnnouncement: (eventId, data) => apiRequest(`/organizer/events/${eventId}/announcements`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Check in attendee
  checkInAttendee: (bookingId) => apiRequest(`/organizer/check-in/${bookingId}`, {
    method: 'POST',
  }),
};

// ============================================================================
// ADMIN API
// ============================================================================

export const AdminAPI = {
  // Users
  getUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  getUserById: (id) => apiRequest(`/admin/users/${id}`),

  updateUser: (id, data) => apiRequest(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  deleteUser: (id) => apiRequest(`/admin/users/${id}`, { method: 'DELETE' }),

  // User status management
  suspendUser: (id, reason) => apiRequest(`/admin/users/${id}/suspend`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),

  activateUser: (id) => apiRequest(`/admin/users/${id}/activate`, { method: 'POST' }),

  // Organizer applications
  getOrganizerApplications: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/organizer-applications${queryString ? `?${queryString}` : ''}`);
  },

  approveOrganizer: (applicationId, data) => apiRequest(`/admin/organizer-applications/${applicationId}/approve`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  rejectOrganizer: (applicationId, data) => apiRequest(`/admin/organizer-applications/${applicationId}/reject`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Events
  getAllEvents: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/events${queryString ? `?${queryString}` : ''}`);
  },

  approveEvent: (eventId) => apiRequest(`/admin/events/${eventId}/approve`, { method: 'POST' }),

  rejectEvent: (eventId, reason) => apiRequest(`/admin/events/${eventId}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),

  featureEvent: (eventId) => apiRequest(`/admin/events/${eventId}/feature`, { method: 'POST' }),

  unfeatureEvent: (eventId) => apiRequest(`/admin/events/${eventId}/unfeature`, { method: 'POST' }),

  // Categories
  createCategory: (data) => apiRequest('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateCategory: (id, data) => apiRequest(`/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  deleteCategory: (id) => apiRequest(`/admin/categories/${id}`, { method: 'DELETE' }),

  // Bookings
  getAllBookings: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/bookings${queryString ? `?${queryString}` : ''}`);
  },

  // Payments & Refunds
  getAllPayments: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/payments${queryString ? `?${queryString}` : ''}`);
  },

  processRefund: (paymentId, data) => apiRequest(`/admin/payments/${paymentId}/refund`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Payouts to organizers
  getPayouts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/payouts${queryString ? `?${queryString}` : ''}`);
  },

  processPayout: (payoutId) => apiRequest(`/admin/payouts/${payoutId}/process`, { method: 'POST' }),

  // Reviews moderation
  getPendingReviews: () => apiRequest('/admin/reviews/pending'),

  approveReview: (reviewId) => apiRequest(`/admin/reviews/${reviewId}/approve`, { method: 'POST' }),

  rejectReview: (reviewId, reason) => apiRequest(`/admin/reviews/${reviewId}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),

  // Dashboard & Analytics
  getDashboardStats: () => apiRequest('/admin/dashboard'),

  getRevenueAnalytics: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/analytics/revenue${queryString ? `?${queryString}` : ''}`);
  },

  getUserAnalytics: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/analytics/users${queryString ? `?${queryString}` : ''}`);
  },

  getEventAnalytics: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/analytics/events${queryString ? `?${queryString}` : ''}`);
  },

  // Contact messages
  getContactMessages: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/contact-messages${queryString ? `?${queryString}` : ''}`);
  },

  replyToMessage: (messageId, data) => apiRequest(`/admin/contact-messages/${messageId}/reply`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // System settings
  getSettings: () => apiRequest('/admin/settings'),

  updateSetting: (key, value) => apiRequest(`/admin/settings/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ value }),
  }),

  // Activity logs
  getActivityLogs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/activity-logs${queryString ? `?${queryString}` : ''}`);
  },
};

// ============================================================================
// CART API
// ============================================================================

export const CartAPI = {
  // Get cart items
  get: () => apiRequest('/cart'),

  // Add item to cart
  add: (ticketTypeId, quantity) => apiRequest('/cart', {
    method: 'POST',
    body: JSON.stringify({ ticketTypeId, quantity }),
  }),

  // Update cart item quantity
  update: (itemId, quantity) => apiRequest(`/cart/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  }),

  // Remove from cart
  remove: (itemId) => apiRequest(`/cart/${itemId}`, { method: 'DELETE' }),

  // Clear cart
  clear: () => apiRequest('/cart', { method: 'DELETE' }),

  // Apply promo code
  applyPromo: (code) => apiRequest('/cart/promo', {
    method: 'POST',
    body: JSON.stringify({ code }),
  }),

  // Remove promo code
  removePromo: () => apiRequest('/cart/promo', { method: 'DELETE' }),
};

// ============================================================================
// VENUES API
// ============================================================================

export const VenuesAPI = {
  // List venues
  list: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/venues${queryString ? `?${queryString}` : ''}`);
  },

  // Get venue by ID
  getById: (id) => apiRequest(`/venues/${id}`),

  // Create venue (Admin/Organizer)
  create: (data) => apiRequest('/venues', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Update venue
  update: (id, data) => apiRequest(`/venues/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Delete venue
  delete: (id) => apiRequest(`/venues/${id}`, { method: 'DELETE' }),

  // Search venues
  search: (query) => apiRequest(`/venues/search?q=${encodeURIComponent(query)}`),
};

// ============================================================================
// UPLOAD API
// ============================================================================

export const UploadAPI = {
  // Upload image
  image: (formData) => apiRequest('/upload/image', {
    method: 'POST',
    body: formData,
  }),

  // Upload document
  document: (formData) => apiRequest('/upload/document', {
    method: 'POST',
    body: formData,
  }),

  // Upload multiple files
  multiple: (formData) => apiRequest('/upload/multiple', {
    method: 'POST',
    body: formData,
  }),

  // Delete uploaded file
  delete: (fileUrl) => apiRequest('/upload', {
    method: 'DELETE',
    body: JSON.stringify({ fileUrl }),
  }),
};

// ============================================================================
// EXPORT ALL APIS
// ============================================================================

export default {
  Auth: AuthAPI,
  Events: EventsAPI,
  Tickets: TicketsAPI,
  Bookings: BookingsAPI,
  Payments: PaymentsAPI,
  Wishlist: WishlistAPI,
  Reviews: ReviewsAPI,
  Notifications: NotificationsAPI,
  Organizer: OrganizerAPI,
  Admin: AdminAPI,
  Cart: CartAPI,
  Venues: VenuesAPI,
  Upload: UploadAPI,
};
