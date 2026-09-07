import { Bookmark } from '../models/Bookmark.js';
import { Job } from '../models/Job.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Toggle Bookmark (Save / Unsave Job)
 * POST /api/bookmarks/toggle
 */
export const toggleBookmark = asyncHandler(async (req, res) => {
  const { jobId, opportunityId, resourceId } = req.body;
  const userId = req.user._id;

  if (jobId) {
    const existing = await Bookmark.findOne({ user: userId, job: jobId });
    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      return new ApiResponse(200, { isSaved: false, jobId }, 'Job removed from saved bookmarks').send(res);
    } else {
      await Bookmark.create({ user: userId, job: jobId });
      return new ApiResponse(201, { isSaved: true, jobId }, 'Job saved to bookmarks').send(res);
    }
  }

  return new ApiResponse(400, null, 'Target item ID is required to bookmark').send(res);
});

/**
 * Get Current User's Bookmarks
 * GET /api/bookmarks
 */
export const getBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await Bookmark.find({ user: req.user._id })
    .populate('job')
    .populate('resource')
    .sort({ createdAt: -1 });

  return new ApiResponse(200, bookmarks, 'User bookmarks retrieved').send(res);
});

/**
 * Remove Bookmark by ID
 * DELETE /api/bookmarks/:id
 */
export const removeBookmark = asyncHandler(async (req, res) => {
  await Bookmark.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  return new ApiResponse(200, null, 'Bookmark removed').send(res);
});
