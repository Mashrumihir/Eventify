import { Router } from 'express';
import {
  getAdminDashboard,
  getAttendeeDashboard,
  getOrganizerDashboard,
  listOrganizerPayments,
} from '../controllers/dataController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/attendee', asyncHandler(getAttendeeDashboard));
router.get('/organizer', asyncHandler(getOrganizerDashboard));
router.get('/organizer/payments', asyncHandler(listOrganizerPayments));
router.get('/admin', asyncHandler(getAdminDashboard));

export default router;
