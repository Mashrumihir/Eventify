import { Router } from 'express';
import {
  getAdminDashboard,
  getAttendeeDashboard,
  getOrganizerDashboard,
} from '../controllers/dataController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/attendee', asyncHandler(getAttendeeDashboard));
router.get('/organizer', asyncHandler(getOrganizerDashboard));
router.get('/admin', asyncHandler(getAdminDashboard));

export default router;
