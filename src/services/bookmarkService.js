/**
 * Centralized Unified Bookmark Service for The TaxMan's Capital
 * Supports saving & managing:
 * - Jobs & Inductions ('job')
 * - Study Resources & Notes ('resource')
 * - Blogs & Career Articles ('blog')
 * - Podcasts & Video Sessions ('podcast')
 * - Events & Webinars ('event')
 */

import { api } from './api';

const BOOKMARKS_STORAGE_KEY_PREFIX = 'taxman_unified_bookmarks_';
const GLOBAL_STORAGE_KEY = 'taxman_unified_bookmarks_global';

// In-memory listeners for cross-component real-time updates
const listeners = new Set();

const notifyListeners = (bookmarks) => {
  listeners.forEach(callback => {
    try {
      callback(bookmarks);
    } catch (err) {
      console.warn('[BookmarkService] Listener error:', err);
    }
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('taxman_bookmarks_updated', { detail: bookmarks }));
  }
};

const getStorageKey = (userId) => {
  return userId ? `${BOOKMARKS_STORAGE_KEY_PREFIX}${userId}` : GLOBAL_STORAGE_KEY;
};

/**
 * Get all bookmarks for a user with automatic legacy store migration
 */
export const getBookmarks = (userId = null) => {
  if (typeof window === 'undefined') return [];

  const key = getStorageKey(userId);
  try {
    const raw = localStorage.getItem(key);
    let items = raw ? JSON.parse(raw) : [];

    // Migrate legacy saved blogs if present
    const legacyBlogs = localStorage.getItem('thetaxman_bookmarked_blogs');
    if (legacyBlogs && !raw) {
      try {
        const blogIds = JSON.parse(legacyBlogs);
        if (Array.isArray(blogIds)) {
          blogIds.forEach(id => {
            if (!items.some(i => i.id === id || i.itemId === id)) {
              items.push({
                id: `blog_${id}`,
                itemId: id,
                type: 'blog',
                title: `Career Article #${id}`,
                subtitle: 'The TaxMan Editorial',
                category: 'Career Guidance',
                link: `/blog/${id}`,
                savedAt: new Date().toISOString()
              });
            }
          });
        }
      } catch {}
    }

    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
};

/**
 * Save all bookmarks to localStorage & notify
 */
export const saveBookmarks = (items, userId = null) => {
  if (typeof window === 'undefined') return;

  const key = getStorageKey(userId);
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (err) {
    console.warn('[BookmarkService] Failed to save bookmarks:', err);
  }
  notifyListeners(items);
};

/**
 * Check if a specific item is bookmarked
 */
export const isBookmarked = (itemId, type = null, userId = null) => {
  const bookmarks = getBookmarks(userId);
  const targetId = String(itemId);
  return bookmarks.some(b => 
    (String(b.id) === targetId || String(b.itemId) === targetId) && 
    (!type || b.type === type)
  );
};

/**
 * Toggle bookmark for any entity (job, resource, blog, podcast, event)
 */
export const toggleBookmark = (item, type = 'job', userId = null) => {
  if (!item) return { isBookmarked: false, bookmarks: [] };

  const bookmarks = getBookmarks(userId);
  const rawId = item.id || item._id;
  const targetId = String(rawId);
  const existingIndex = bookmarks.findIndex(b => 
    (String(b.id) === targetId || String(b.itemId) === targetId) && 
    b.type === type
  );

  let updated = [];
  let isSaved = false;

  if (existingIndex >= 0) {
    // Remove bookmark
    updated = bookmarks.filter((_, idx) => idx !== existingIndex);
    isSaved = false;
  } else {
    // Add unified bookmark object
    const newBookmark = {
      id: `${type}_${rawId}`,
      itemId: rawId,
      type: type, // 'job' | 'resource' | 'blog' | 'podcast' | 'event'
      title: item.title || item.name || item.subject || 'Saved Item',
      subtitle: item.company || item.firm || item.instructor || item.speaker || item.author || item.platform || "The TaxMan's Capital",
      category: item.category || item.level || item.qualification || item.jobType || item.job_type || 'General',
      location: item.location || item.city || '',
      deadline: item.deadline || item.date || item.timestamp || '',
      fileUrl: item.fileUrl || item.downloadUrl || item.url || '',
      fileSize: item.fileSize || item.size || '',
      duration: item.duration || item.readTime || '',
      link: item.link || (type === 'job' ? '/jobs' : type === 'resource' ? '/resources' : type === 'blog' ? `/blog/${rawId}` : type === 'podcast' ? '/podcasts' : '/events'),
      image: item.image || item.coverImage || item.thumbnail || '',
      rawItem: item,
      savedAt: new Date().toISOString()
    };
    updated = [newBookmark, ...bookmarks];
    isSaved = true;
  }

  saveBookmarks(updated, userId);

  // Sync with backend API in background if user is authenticated
  try {
    if (isSaved) {
      api.post('/bookmarks', { itemId: rawId, type, itemData: item }).catch(() => {});
    } else {
      api.delete(`/bookmarks/${rawId}?type=${type}`).catch(() => {});
    }
  } catch {}

  return { isBookmarked: isSaved, bookmarks: updated };
};

/**
 * Remove bookmark by id
 */
export const removeBookmark = (bookmarkId, userId = null) => {
  const bookmarks = getBookmarks(userId);
  const targetId = String(bookmarkId);
  const updated = bookmarks.filter(b => String(b.id) !== targetId && String(b.itemId) !== targetId);
  saveBookmarks(updated, userId);
  return updated;
};

/**
 * Clear all bookmarks for user
 */
export const clearAllBookmarks = (userId = null) => {
  saveBookmarks([], userId);
  return [];
};

/**
 * Real-time listener subscription
 */
export const onBookmarksChange = (callback) => {
  if (typeof callback === 'function') {
    listeners.add(callback);
  }
  return {
    unsubscribe: () => {
      listeners.delete(callback);
    }
  };
};
