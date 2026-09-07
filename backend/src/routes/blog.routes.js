import express from 'express';
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} from '../controllers/blog.controller.js';
import { authenticateUser, authorizeRoles, optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', optionalAuth, getBlogs);
router.get('/:id', optionalAuth, getBlogById);
router.post('/', authenticateUser, authorizeRoles('admin', 'moderator'), createBlog);
router.put('/:id', authenticateUser, authorizeRoles('admin', 'moderator'), updateBlog);
router.delete('/:id', authenticateUser, authorizeRoles('admin', 'moderator'), deleteBlog);

export default router;
