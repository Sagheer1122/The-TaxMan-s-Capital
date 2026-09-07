import express from 'express';
import {
  getCommunityGroups,
  createCommunityGroup,
  getPosts,
  createPost,
  toggleLikePost,
  addComment,
  getComments,
  createReport
} from '../controllers/community.controller.js';
import { authenticateUser, authorizeRoles, optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// WhatsApp/Discord Community Groups
router.get('/groups', getCommunityGroups);
router.post('/groups', authenticateUser, authorizeRoles('admin', 'moderator'), createCommunityGroup);

// Community Posts & Discussions
router.get('/posts', optionalAuth, getPosts);
router.post('/posts', authenticateUser, createPost);
router.post('/posts/:id/like', authenticateUser, toggleLikePost);
router.post('/posts/:id/comments', authenticateUser, addComment);
router.get('/posts/:id/comments', optionalAuth, getComments);

// Moderation Reports
router.post('/reports', authenticateUser, createReport);

export default router;
