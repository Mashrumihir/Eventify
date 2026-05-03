import { Router } from 'express';
import {
	cancelAttendeeBooking,
	createAttendeeReview,
	createBooking,
	deleteAttendeeReview,
	getAttendeeProfile,
	listAttendeeBookings,
	listAttendeeNotifications,
	listAttendeePayments,
	listAttendeeReviews,
	listAttendeeWishlist,
	markAllNotificationsAsRead,
	markNotificationAsRead,
	processPayment,
	toggleWishlist,
	updateAttendeePassword,
	updateAttendeeProfile,
	updateAttendeeReview,
	uploadUserAvatar,
} from '../controllers/dataController.js';
import { uploadAvatar } from '../middleware/upload.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/bookings', asyncHandler(listAttendeeBookings));
router.patch('/bookings/:id/cancel', asyncHandler(cancelAttendeeBooking));
router.get('/payments', asyncHandler(listAttendeePayments));
router.get('/wishlist', asyncHandler(listAttendeeWishlist));
router.post('/wishlist/toggle', asyncHandler(toggleWishlist));
router.get('/notifications', asyncHandler(listAttendeeNotifications));
router.patch('/notifications/read-all', asyncHandler(markAllNotificationsAsRead));
router.patch('/notifications/:id/read', asyncHandler(markNotificationAsRead));
router.get('/reviews', asyncHandler(listAttendeeReviews));
router.post('/reviews', asyncHandler(createAttendeeReview));
router.patch('/reviews/:id', asyncHandler(updateAttendeeReview));
router.delete('/reviews/:id', asyncHandler(deleteAttendeeReview));
router.get('/profile', asyncHandler(getAttendeeProfile));
router.patch('/profile', asyncHandler(updateAttendeeProfile));
router.patch('/profile/password', asyncHandler(updateAttendeePassword));
router.post('/profile/avatar', uploadAvatar, asyncHandler(uploadUserAvatar));
router.post('/bookings', asyncHandler(createBooking));
router.post('/payments', asyncHandler(processPayment));

export default router;
