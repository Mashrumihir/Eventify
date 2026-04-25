import { Router } from 'express';
import {
  createNotification,
  createOrganizerApplication,
  createUser,
  deleteUser,
  listAdminNotifications,
  listOrganizerApplications,
  listUsers,
  markAdminNotificationAsRead,
  markAllAdminNotificationsAsRead,
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

router.get('/notifications', asyncHandler(listAdminNotifications));
router.patch('/notifications/read-all', asyncHandler(markAllAdminNotificationsAsRead));
router.patch('/notifications/:id/read', asyncHandler(markAdminNotificationAsRead));
router.post('/notifications', asyncHandler(createNotification));

export default router;
