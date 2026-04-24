import { Router } from 'express';
import {
	cancelAttendeeBooking,
	listAttendeeBookings,
	toggleWishlist,
} from '../controllers/dataController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/bookings', asyncHandler(listAttendeeBookings));
router.patch('/bookings/:id/cancel', asyncHandler(cancelAttendeeBooking));
router.post('/wishlist/toggle', asyncHandler(toggleWishlist));

export default router;
