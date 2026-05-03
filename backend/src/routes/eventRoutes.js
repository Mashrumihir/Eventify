import { Router } from 'express';
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEventCategories,
  listEvents,
  updateEvent,
} from '../controllers/dataController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(listEvents));
router.get('/categories', asyncHandler(getEventCategories));
router.get('/:id', asyncHandler(getEventById));
router.post('/', asyncHandler(createEvent));
router.put('/:id', asyncHandler(updateEvent));
router.delete('/:id', asyncHandler(deleteEvent));

export default router;
