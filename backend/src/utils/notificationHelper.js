import { query } from '../db/db.js';

/**
 * Notification Helper Utility
 * Creates notifications for different system events
 */

// Notification types
export const NotificationTypes = {
  // Attendee notifications
  LOGIN_SUCCESS: 'success',
  NEW_DEVICE_LOGIN: 'warning',
  PROFILE_UPDATED: 'success',
  PASSWORD_CHANGED: 'success',
  BOOKING_CONFIRMED: 'success',
  BOOKING_FAILED: 'danger',
  TICKET_GENERATED: 'success',
  BOOKING_CANCELLED: 'warning',
  PAYMENT_SUCCESS: 'success',
  PAYMENT_FAILED: 'danger',
  REFUND_INITIATED: 'warning',
  REFUND_COMPLETED: 'success',
  EVENT_REMINDER: 'reminder',
  EVENT_STARTING: 'warning',
  EVENT_LIVE: 'success',
  EVENT_CANCELLED: 'danger',
  WISHLIST_ALERT: 'announcement',
  PRICE_DROP: 'announcement',
  REVIEW_REQUEST: 'reminder',

  // Admin notifications
  NEW_USER_REGISTERED: 'user',
  USER_DELETED: 'user',
  SUSPICIOUS_ACTIVITY: 'warning',
  NEW_BOOKING: 'booking',
  USER_CANCELLED_BOOKING: 'booking',
  HIGH_DEMAND_ALERT: 'warning',
  PAYMENT_RECEIVED: 'payment',
  PAYMENT_FAILED_ADMIN: 'payment',
  REFUND_REQUESTED: 'payment',
  NEW_EVENT_CREATED: 'announcement',
  EVENT_UPDATED: 'announcement',
  EVENT_DELETED: 'warning',
  EVENT_SOLD_OUT: 'warning',
  SERVER_ISSUE: 'system',
  DATABASE_ERROR: 'system',
  MAINTENANCE_SCHEDULED: 'system',
};

/**
 * Create a notification for a user
 * @param {string} userId - User ID to notify
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type (from NotificationTypes)
 * @returns {Promise<Object>} Created notification
 */
export async function createNotification(userId, title, message, type = 'general') {
  const result = await query(
    `INSERT INTO notifications (user_id, title, message, type, is_read)
     VALUES ($1, $2, $3, $4, FALSE)
     RETURNING id, user_id, title, message, type, is_read, created_at`,
    [userId, title, message, type]
  );

  return result.rows[0];
}

/**
 * Create a notification for all admin users
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type
 * @returns {Promise<Array>} Created notifications
 */
export async function notifyAllAdmins(title, message, type = 'general') {
  const adminsResult = await query(
    `SELECT id FROM users WHERE role = 'admin'`,
    []
  );

  const notifications = [];
  for (const admin of adminsResult.rows) {
    const notification = await createNotification(admin.id, title, message, type);
    notifications.push(notification);
  }

  return notifications;
}

/**
 * Create a notification for a specific user by email
 * @param {string} email - User email
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type
 * @returns {Promise<Object|null>} Created notification or null if user not found
 */
export async function notifyUserByEmail(email, title, message, type = 'general') {
  const userResult = await query(
    `SELECT id FROM users WHERE email = $1 LIMIT 1`,
    [email]
  );

  if (userResult.rowCount === 0) {
    return null;
  }

  return await createNotification(userResult.rows[0].id, title, message, type);
}

// Attendee notification helpers

export async function notifyLoginSuccess(userId, deviceInfo = '') {
  return await createNotification(
    userId,
    'Welcome Back',
    deviceInfo ? `Login successful from ${deviceInfo}` : 'Login successful. Welcome back!',
    NotificationTypes.LOGIN_SUCCESS
  );
}

export async function notifyNewDeviceLogin(userId, deviceInfo) {
  return await createNotification(
    userId,
    'New Device Login Detected',
    `A new login was detected from ${deviceInfo}. If this was not you, please change your password immediately.`,
    NotificationTypes.NEW_DEVICE_LOGIN
  );
}

export async function notifyProfileUpdated(userId) {
  return await createNotification(
    userId,
    'Profile Updated',
    'Your profile information has been updated successfully.',
    NotificationTypes.PROFILE_UPDATED
  );
}

export async function notifyPasswordChanged(userId) {
  return await createNotification(
    userId,
    'Password Changed',
    'Your password has been changed successfully. If you did not make this change, please contact support immediately.',
    NotificationTypes.PASSWORD_CHANGED
  );
}

export async function notifyBookingConfirmed(userId, eventName, bookingRef) {
  await createNotification(
    userId,
    'Booking Confirmed',
    `Your booking for "${eventName}" is confirmed. Reference: ${bookingRef}`,
    NotificationTypes.BOOKING_CONFIRMED
  );
}

export async function notifyBookingFailed(userId, eventName, reason) {
  return await createNotification(
    userId,
    'Booking Failed',
    `Unable to complete booking for "${eventName}". ${reason}`,
    NotificationTypes.BOOKING_FAILED
  );
}

export async function notifyTicketGenerated(userId, eventName) {
  return await createNotification(
    userId,
    'Ticket Ready',
    `Your ticket for "${eventName}" is ready. Download it from your bookings.`,
    NotificationTypes.TICKET_GENERATED
  );
}

export async function notifyBookingCancelled(userId, eventName) {
  return await createNotification(
    userId,
    'Booking Cancelled',
    `Your booking for "${eventName}" has been cancelled as requested.`,
    NotificationTypes.BOOKING_CANCELLED
  );
}

export async function notifyPaymentSuccess(userId, eventName, amount) {
  return await createNotification(
    userId,
    'Payment Successful',
    `Payment of ₹${amount} for "${eventName}" completed successfully.`,
    NotificationTypes.PAYMENT_SUCCESS
  );
}

export async function notifyPaymentFailed(userId, eventName) {
  return await createNotification(
    userId,
    'Payment Failed',
    `Payment for "${eventName}" could not be processed. Please try again or use a different payment method.`,
    NotificationTypes.PAYMENT_FAILED
  );
}

export async function notifyRefundInitiated(userId, eventName, amount) {
  return await createNotification(
    userId,
    'Refund Initiated',
    `Refund of ₹${amount} for "${eventName}" has been initiated. It will be credited within 5-7 business days.`,
    NotificationTypes.REFUND_INITIATED
  );
}

export async function notifyRefundCompleted(userId, eventName, amount) {
  return await createNotification(
    userId,
    'Refund Completed',
    `Refund of ₹${amount} for "${eventName}" has been credited to your account.`,
    NotificationTypes.REFUND_COMPLETED
  );
}

export async function notifyEventTomorrow(userId, eventName) {
  return await createNotification(
    userId,
    'Event Tomorrow',
    `"${eventName}" is happening tomorrow! Don't miss it.`,
    NotificationTypes.EVENT_REMINDER
  );
}

export async function notifyEventStartingSoon(userId, eventName) {
  return await createNotification(
    userId,
    'Event Starting Soon',
    `"${eventName}" starts in 1 hour. Get ready!`,
    NotificationTypes.EVENT_STARTING
  );
}

export async function notifyEventLive(userId, eventName, joinUrl) {
  return await createNotification(
    userId,
    'Event is Live',
    `"${eventName}" is now live! ${joinUrl ? `Join here: ${joinUrl}` : 'Check your email for the join link.'}`,
    NotificationTypes.EVENT_LIVE
  );
}

export async function notifyEventCancelled(userId, eventName, reason) {
  return await createNotification(
    userId,
    'Event Cancelled',
    `"${eventName}" has been cancelled. ${reason || 'A full refund will be processed shortly.'}`,
    NotificationTypes.EVENT_CANCELLED
  );
}

export async function notifyWishlistTrending(userId, eventName) {
  return await createNotification(
    userId,
    'Wishlist Alert',
    `"${eventName}" in your wishlist is trending! Book now before tickets run out.`,
    NotificationTypes.WISHLIST_ALERT
  );
}

export async function notifyPriceDrop(userId, eventName, oldPrice, newPrice) {
  return await createNotification(
    userId,
    'Price Drop Alert',
    `Great news! "${eventName}" ticket price dropped from ₹${oldPrice} to ₹${newPrice}. Book now!`,
    NotificationTypes.PRICE_DROP
  );
}

export async function notifyReviewRequest(userId, eventName) {
  return await createNotification(
    userId,
    'How Was Your Experience?',
    `We hope you enjoyed "${eventName}". Please take a moment to rate and review your experience.`,
    NotificationTypes.REVIEW_REQUEST
  );
}

// Admin notification helpers

export async function notifyAdminNewUserRegistered(userName, userEmail) {
  return await notifyAllAdmins(
    'New User Registered',
    `${userName} (${userEmail}) just signed up on the platform.`,
    NotificationTypes.NEW_USER_REGISTERED
  );
}

export async function notifyAdminUserDeleted(userName, userEmail) {
  return await notifyAllAdmins(
    'User Account Deleted',
    `User account for ${userName} (${userEmail}) has been removed.`,
    NotificationTypes.USER_DELETED
  );
}

export async function notifyAdminSuspiciousActivity(userEmail, activity) {
  return await notifyAllAdmins(
    'Suspicious Activity Detected',
    `Multiple failed login attempts detected for ${userEmail}. Activity: ${activity}`,
    NotificationTypes.SUSPICIOUS_ACTIVITY
  );
}

export async function notifyAdminNewBooking(eventName, attendeeName, quantity) {
  return await notifyAllAdmins(
    'New Booking Received',
    `${attendeeName} booked ${quantity} ticket(s) for "${eventName}".`,
    NotificationTypes.NEW_BOOKING
  );
}

export async function notifyAdminUserCancelledBooking(eventName, attendeeName, reason) {
  return await notifyAllAdmins(
    'Booking Cancelled',
    `${attendeeName} cancelled their booking for "${eventName}". ${reason || ''}`,
    NotificationTypes.USER_CANCELLED_BOOKING
  );
}

export async function notifyAdminHighDemand(eventName, ticketsRemaining) {
  return await notifyAllAdmins(
    'High Demand Alert',
    `"${eventName}" is almost sold out! Only ${ticketsRemaining} tickets remaining.`,
    NotificationTypes.HIGH_DEMAND_ALERT
  );
}

export async function notifyAdminPaymentReceived(eventName, attendeeName, amount) {
  return await notifyAllAdmins(
    'Payment Received',
    `Payment of ₹${amount} received from ${attendeeName} for "${eventName}".`,
    NotificationTypes.PAYMENT_RECEIVED
  );
}

export async function notifyAdminPaymentFailed(eventName, attendeeName, reason) {
  return await notifyAllAdmins(
    'Payment Failed',
    `Payment failed for ${attendeeName}'s booking of "${eventName}". ${reason || ''}`,
    NotificationTypes.PAYMENT_FAILED_ADMIN
  );
}

export async function notifyAdminRefundRequested(eventName, attendeeName, amount) {
  return await notifyAllAdmins(
    'Refund Requested',
    `${attendeeName} requested a refund of ₹${amount} for "${eventName}".`,
    NotificationTypes.REFUND_REQUESTED
  );
}

export async function notifyAdminNewEventCreated(organizerName, eventName) {
  return await notifyAllAdmins(
    'New Event Created',
    `${organizerName} created a new event: "${eventName}".`,
    NotificationTypes.NEW_EVENT_CREATED
  );
}

export async function notifyAdminEventUpdated(organizerName, eventName, changes) {
  return await notifyAllAdmins(
    'Event Updated',
    `${organizerName} updated "${eventName}". Changes: ${changes || 'See event details'}`,
    NotificationTypes.EVENT_UPDATED
  );
}

export async function notifyAdminEventDeleted(organizerName, eventName) {
  return await notifyAllAdmins(
    'Event Deleted',
    `"${eventName}" by ${organizerName} has been removed from the platform.`,
    NotificationTypes.EVENT_DELETED
  );
}

export async function notifyAdminEventSoldOut(eventName) {
  return await notifyAllAdmins(
    'Event Sold Out',
    `"${eventName}" is now completely sold out!`,
    NotificationTypes.EVENT_SOLD_OUT
  );
}

export async function notifyAdminServerIssue(issue, severity = 'warning') {
  return await notifyAllAdmins(
    'Server Issue Detected',
    `Backend issue: ${issue}`,
    severity === 'critical' ? 'danger' : NotificationTypes.SERVER_ISSUE
  );
}

export async function notifyAdminDatabaseError(error) {
  return await notifyAllAdmins(
    'Database Error',
    `Database connection failed: ${error}`,
    NotificationTypes.DATABASE_ERROR
  );
}

export async function notifyAdminMaintenanceScheduled(startTime, duration) {
  return await notifyAllAdmins(
    'Maintenance Scheduled',
    `System maintenance planned for ${startTime}. Expected duration: ${duration}.`,
    NotificationTypes.MAINTENANCE_SCHEDULED
  );
}

export default {
  NotificationTypes,
  createNotification,
  notifyAllAdmins,
  notifyUserByEmail,

  // Attendee
  notifyLoginSuccess,
  notifyNewDeviceLogin,
  notifyProfileUpdated,
  notifyPasswordChanged,
  notifyBookingConfirmed,
  notifyBookingFailed,
  notifyTicketGenerated,
  notifyBookingCancelled,
  notifyPaymentSuccess,
  notifyPaymentFailed,
  notifyRefundInitiated,
  notifyRefundCompleted,
  notifyEventTomorrow,
  notifyEventStartingSoon,
  notifyEventLive,
  notifyEventCancelled,
  notifyWishlistTrending,
  notifyPriceDrop,
  notifyReviewRequest,

  // Admin
  notifyAdminNewUserRegistered,
  notifyAdminUserDeleted,
  notifyAdminSuspiciousActivity,
  notifyAdminNewBooking,
  notifyAdminUserCancelledBooking,
  notifyAdminHighDemand,
  notifyAdminPaymentReceived,
  notifyAdminPaymentFailed,
  notifyAdminRefundRequested,
  notifyAdminNewEventCreated,
  notifyAdminEventUpdated,
  notifyAdminEventDeleted,
  notifyAdminEventSoldOut,
  notifyAdminServerIssue,
  notifyAdminDatabaseError,
  notifyAdminMaintenanceScheduled,
};
