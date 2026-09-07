import express from 'express';
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from '../controllers/announcement.controller.js';
import { authenticateUser, authorizeRoles, optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', optionalAuth, getAnnouncements);
router.get('/:id', optionalAuth, getAnnouncementById);
router.post('/', authenticateUser, authorizeRoles('admin', 'moderator'), createAnnouncement);
router.put('/:id', authenticateUser, authorizeRoles('admin', 'moderator'), updateAnnouncement);
router.delete('/:id', authenticateUser, authorizeRoles('admin', 'moderator'), deleteAnnouncement);

export default router;
