import { Router } from 'express';
import {
  createOrganizerApplication,
  createUser,
  deleteUser,
  listOrganizerApplications,
  listUsers,
  updateOrganizerApplication,
  updateUserStatus,
} from '../controllers/dataController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/users', asyncHandler(listUsers));
router.post('/users', asyncHandler(createUser));
router.patch('/users/:id/status', asyncHandler(updateUserStatus));
router.delete('/users/:id', asyncHandler(deleteUser));

router.get('/organizer-applications', asyncHandler(listOrganizerApplications));
router.post('/organizer-applications', asyncHandler(createOrganizerApplication));
router.patch('/organizer-applications/:id', asyncHandler(updateOrganizerApplication));

export default router;
