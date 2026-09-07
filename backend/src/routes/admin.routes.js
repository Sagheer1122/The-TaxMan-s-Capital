import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  createAdminUser,
  updateUserRole,
  deleteUser,
  getReports,
  resolveReport
} from '../controllers/admin.controller.js';
import {
  approveResource,
  rejectResource
} from '../controllers/resource.controller.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateUser);

// ── Shared Content & Overview Routes (Admin & Moderator) ──
router.get('/dashboard', authorizeRoles('admin', 'moderator'), getDashboardStats);
router.get('/reports', authorizeRoles('admin', 'moderator'), getReports);
router.put('/reports/:id', authorizeRoles('admin', 'moderator'), resolveReport);

// Resource Approval and Rejection Workflows (Admin & Moderator)
router.post('/resources/:id/approve', authorizeRoles('admin', 'moderator'), approveResource);
router.post('/resources/:id/reject', authorizeRoles('admin', 'moderator'), rejectResource);

// ── Strictly Admin-Only Routes (USER MANAGER & ROLE MANAGEMENT) ──
// Moderators are explicitly forbidden from these routes and will receive 403 Forbidden
router.get('/users', authorizeRoles('admin'), getAllUsers);
router.get('/users/:id', authorizeRoles('admin'), (req, res, next) => {
  // Pass through to getAllUsers or specific lookup
  return getAllUsers(req, res, next);
});
router.post('/users', authorizeRoles('admin'), createAdminUser);
router.put('/users/:id/role', authorizeRoles('admin'), updateUserRole);
router.put('/users/:id', authorizeRoles('admin'), updateUserRole);
router.patch('/users/:id/status', authorizeRoles('admin'), updateUserRole);
router.delete('/users/:id', authorizeRoles('admin'), deleteUser);

// Explicit Direct URLs protection for /admin/roles and /admin/moderators
router.get('/roles', authorizeRoles('admin'), (req, res) => {
  return res.status(200).json({
    success: true,
    roles: ['student', 'mentor', 'employer', 'moderator', 'admin', 'team_head']
  });
});
router.get('/moderators', authorizeRoles('admin'), (req, res, next) => {
  req.query.role = 'moderator';
  return getAllUsers(req, res, next);
});

export default router;
