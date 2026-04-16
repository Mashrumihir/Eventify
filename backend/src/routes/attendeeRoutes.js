import { Router } from 'express';
import { toggleWishlist } from '../controllers/dataController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/wishlist/toggle', asyncHandler(toggleWishlist));

export default router;
