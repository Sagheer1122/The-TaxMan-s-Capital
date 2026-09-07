import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyForJob
} from '../controllers/job.controller.js';
import { authenticateUser, authorizeRoles, optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', optionalAuth, getJobs);
router.get('/:id', optionalAuth, getJobById);
router.post('/', authenticateUser, authorizeRoles('admin', 'moderator', 'employer'), createJob);
router.put('/:id', authenticateUser, authorizeRoles('admin', 'moderator', 'employer'), updateJob);
router.delete('/:id', authenticateUser, authorizeRoles('admin', 'moderator', 'employer'), deleteJob);
router.post('/:id/apply', authenticateUser, applyForJob);

export default router;
