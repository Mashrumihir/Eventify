import { Router } from 'express';
import {
  login,
  register,
  requestPasswordResetOtp,
  resetPasswordWithOtp,
  verifyPasswordResetOtp,
} from '../controllers/authController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/password/forgot', asyncHandler(requestPasswordResetOtp));
router.post('/password/verify', asyncHandler(verifyPasswordResetOtp));
router.post('/password/reset', asyncHandler(resetPasswordWithOtp));

export default router;
