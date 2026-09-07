import express from 'express';
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  incrementDownload,
  requestResource,
  getResourceRequests,
  approveResource,
  rejectResource
} from '../controllers/resource.controller.js';
import { authenticateUser, authorizeRoles, optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', optionalAuth, getResources);
router.get('/requests', authenticateUser, authorizeRoles('admin', 'moderator'), getResourceRequests);
router.get('/:id', optionalAuth, getResourceById);
router.post('/', authenticateUser, authorizeRoles('admin', 'moderator', 'mentor'), createResource);
router.put('/:id', authenticateUser, authorizeRoles('admin', 'moderator', 'mentor'), updateResource);
router.delete('/:id', authenticateUser, authorizeRoles('admin', 'moderator'), deleteResource);
router.post('/:id/approve', authenticateUser, authorizeRoles('admin', 'moderator'), approveResource);
router.post('/:id/reject', authenticateUser, authorizeRoles('admin', 'moderator'), rejectResource);
router.post('/:id/download', incrementDownload);
router.post('/requests', optionalAuth, requestResource);

export default router;
