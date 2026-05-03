/**
 * Eventify API Routes Index
 * Complete routing structure for PostgreSQL backend
 */

import { Router } from 'express';

// Import route modules
import authRoutes from './authRoutes.js';
import eventRoutes from './eventRoutes.js';
import ticketRoutes from './ticketRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import userRoutes from './userRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import organizerRoutes from './organizerRoutes.js';
import adminRoutes from './adminRoutes.js';
import venueRoutes from './venueRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import cartRoutes from './cartRoutes.js';

const router = Router();

// ============================================================================
// PUBLIC ROUTES (No authentication required)
// ============================================================================

// Auth routes (public endpoints)
router.use('/auth', authRoutes);

// Public event browsing
router.use('/events', eventRoutes);

// Public venue listing
router.use('/venues', venueRoutes);

// ============================================================================
// PROTECTED ROUTES (Authentication required)
// ============================================================================

// User profile & management
router.use('/users', userRoutes);

// Tickets (protected for purchase)
router.use('/tickets', ticketRoutes);

// Bookings (requires authentication)
router.use('/bookings', bookingRoutes);

// Payments (requires authentication)
router.use('/payments', paymentRoutes);

// Wishlist (requires authentication)
router.use('/wishlist', wishlistRoutes);

// Reviews (requires authentication for write)
router.use('/reviews', reviewRoutes);

// Notifications (requires authentication)
router.use('/notifications', notificationRoutes);

// Cart (requires authentication)
router.use('/cart', cartRoutes);

// Upload (requires authentication)
router.use('/upload', uploadRoutes);

// ============================================================================
// ORGANIZER ROUTES (Organizer role required)
// ============================================================================

router.use('/organizer', organizerRoutes);

// ============================================================================
// ADMIN ROUTES (Admin role required)
// ============================================================================

router.use('/admin', adminRoutes);

export default router;
