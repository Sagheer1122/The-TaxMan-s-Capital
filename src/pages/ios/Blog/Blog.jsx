import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  Eye,
  ArrowRight,
  Bookmark,
  Sparkles,
  TrendingUp,
  User,
  ChevronRight
} from 'lucide-react';
import { fetchBlogs } from '../../../services/blogService';
import { toggleBookmark as toggleUnifiedBookmark, getBookmarks, onBookmarksChange } from '../../../services/bookmarkService';
import { AntigravityCanvas } from '../../../components/motion/MotionSystem';
import BlogArticle from './BlogArticle';

const CATEGORIES = [
  'All',
  'Big 4 & Inductions',
  'CA Guidance',
  'ACCA Careers',
  'Tax & Audit',
  'Study Tips',
  'Mentorship'
];

export default function Blog({ onNavigateTab }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    return getBookmarks().filter(b => b.type === 'blog').map(b => String(b.itemId || b.id));
  });

  useEffect(() => {
    const sub = onBookmarksChange((all) => {
      setBookmarkedIds(all.filter(b => b.type === 'blog').map(b => String(b.itemId || b.id)));
    });
    return () => sub.unsubscribe();
  }, []);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const data = await fetchBlogs();
      setBlogs(data || []);
    } catch (err) {
      console.warn('Failed to fetch blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (id, e) => {
    if (e) e.stopPropagation();
    const blog = blogs.find(b => (b.id === id || b._id === id || String(b.id) === String(id)));
    const targetBlog = blog || { id, title: `Career Article #${id}`, category: 'Career Guidance' };

    const result = toggleUnifiedBookmark({
      id: id,
      title: targetBlog.title,
      subtitle: targetBlog.author || "The TaxMan's Capital Editorial",
      category: targetBlog.category || 'Career Guidance',
      duration: targetBlog.readTime ? `${targetBlog.readTime} min read` : '5 min read',
      link: `/blog/${targetBlog.slug || id}`
    }, 'blog');

    const idStr = String(id);
    setBookmarkedIds(prev =>
      result.isBookmarked ? [...prev, idStr] : prev.filter(bId => bId !== idStr)
    );
  };

  // Synchronize browser URL and Back/Forward buttons
  useEffect(() => {
    const handlePop = () => {
      const pathname = (window.location.pathname || '').replace(/^\/+|\/+$/g, '');
      if (pathname.startsWith('blog/')) {
        const slug = pathname.replace(/^blog\//, '');
        const found = blogs.find(b => (b.slug === slug || b._id === slug || b.id === slug));
        if (found) {
          setSelectedBlog(found);
          window.scrollTo({ top: 0, behavior: 'instant' });
          return;
        }
      }
      setSelectedBlog(null);
    };
    window.addEventListener('popstate', handlePop);
    if (blogs.length > 0) {
      handlePop();
    }
    return () => window.removeEventListener('popstate', handlePop);
  }, [blogs]);

  const handleOpenReader = (blog) => {
    setSelectedBlog(blog);
    const slug = blog.slug || blog._id || blog.id || '';
    if (slug) {
      window.history.pushState(null, '', `/blog/${slug}`);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleCloseReader = () => {
    setSelectedBlog(null);
    window.history.pushState(null, '', '/blog');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Filter blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      // Must be published for public view
      if (blog.status && blog.status !== 'published') return false;

      const matchesCat = selectedCategory === 'All' || blog.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        blog.title?.toLowerCase().includes(q) ||
        blog.summary?.toLowerCase().includes(q) ||
        blog.content?.toLowerCase().includes(q) ||
        (blog.tags && blog.tags.some(t => t.toLowerCase().includes(q)));

      return matchesCat && matchesSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  const featuredBlog = useMemo(() => {
    return filteredBlogs.find(b => b.isFeatured) || filteredBlogs[0] || null;
  }, [filteredBlogs]);

  const remainingBlogs = useMemo(() => {
    if (!featuredBlog) return filteredBlogs;
    return filteredBlogs.filter(b => (b._id || b.id) !== (featuredBlog._id || featuredBlog.id));
  }, [filteredBlogs, featuredBlog]);

  // If an article is selected, render it directly in the natural document flow
  if (selectedBlog) {
    return (
      <div className="w-full bg-bgLight">
        <BlogArticle
          blog={selectedBlog}
          onBack={handleCloseReader}
          onNavigateTab={onNavigateTab}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgLight">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-navy text-white border-b border-navy-light/40">
        <AntigravityCanvas className="z-0 opacity-30" particleCount={20} />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Status Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-brandGreen/40 backdrop-blur-md mb-5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brandGreen animate-pulse" />
            <span className="text-xs font-bold text-gray-200 tracking-wide">
              Official Mentorship & Industry Articles
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-['Outfit',sans-serif] leading-tight mb-4">
            Insights, Guides &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brandGreen via-emerald-400 to-teal-300">
              Career Masterclasses
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Expert breakdowns by Big 4 audit partners, career counselors, and qualified accountants. Learn how to crack inductions, ace CFAP/ACCA exams, and navigate global opportunities.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by topic, keyword (e.g. PwC, CFAP, ATS, ACCA, Tax)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-white/10 border border-white/15 focus:border-brandGreen rounded-2xl text-sm text-white placeholder-gray-400 outline-none transition-all shadow-xl backdrop-blur-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 gap-2 scrollbar-none max-w-full">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-brandGreen text-white shadow-lg shadow-emerald-500/20 font-bold scale-[1.02]'
                      : 'bg-white/10 text-gray-200 hover:text-white hover:bg-white/20 border border-white/15'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-3 border-brandGreen border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm font-medium">Loading articles...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="py-20 text-center bg-white border border-gray-100 rounded-3xl p-8 max-w-md mx-auto shadow-sm">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-navy mb-1">No Articles Found</h3>
            <p className="text-xs text-gray-500 mb-5">
              No blog posts match your current search query or filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 bg-brandGreen text-white rounded-xl text-xs font-bold hover:bg-brandGreen-dark transition-colors cursor-pointer shadow-md shadow-emerald-500/15"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Featured Article Banner (Only on 'All' or when matched) */}
            {featuredBlog && !searchQuery && (
              <div className="mb-12">
                <div className="flex items-center space-x-2 text-xs font-extrabold text-brandGreen uppercase tracking-widest mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span>Featured Masterclass</span>
                </div>

                <div
                  onClick={() => handleOpenReader(featuredBlog)}
                  className="group relative bg-white border border-gray-100 hover:border-brandGreen/40 rounded-3xl overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl grid grid-cols-1 lg:grid-cols-12 cursor-pointer"
                >
                  {/* Left Banner Image */}
                  <div className="lg:col-span-6 h-64 sm:h-80 lg:h-full relative overflow-hidden bg-gray-100">
                    <img
                      src={featuredBlog.coverImage}
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-brandGreen text-white text-[11px] font-extrabold rounded-lg shadow-md uppercase tracking-wider">
                        {featuredBlog.category}
                      </span>
                    </div>
                  </div>

                  {/* Right Banner Content */}
                  <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-xs text-gray-400 font-semibold">
                        <span className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-brandGreen" />
                          <span>{new Date(featuredBlog.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-brandGreen" />
                          <span>{featuredBlog.readTime || '5 min read'}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1.5">
                          <Eye className="w-3.5 h-3.5 text-brandGreen" />
                          <span>{featuredBlog.views || 120} views</span>
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-navy group-hover:text-brandGreen transition-colors leading-tight font-['Outfit',sans-serif]">
                        {featuredBlog.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed font-medium">
                        {featuredBlog.summary}
                      </p>

                      {featuredBlog.tags && featuredBlog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {featuredBlog.tags.slice(0, 4).map((tag, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded-md bg-gray-50 border border-gray-100 text-[11px] text-gray-600 font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-brandGreen/10 border border-brandGreen/30 flex items-center justify-center font-bold text-xs text-brandGreen">
                          {featuredBlog.author?.name ? featuredBlog.author.name.charAt(0) : 'S'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-navy">{featuredBlog.author?.name || 'Saboor Ahmad CA'}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{featuredBlog.author?.role || 'Lead Career Mentor'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => toggleBookmark(featuredBlog._id || featuredBlog.id, e)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            bookmarkedIds.includes(featuredBlog._id || featuredBlog.id)
                              ? 'bg-brandGreen/10 border-brandGreen text-brandGreen'
                              : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-navy hover:bg-gray-100'
                          }`}
                          title="Bookmark"
                        >
                          <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(featuredBlog._id || featuredBlog.id) ? 'fill-current' : ''}`} />
                        </button>
                        <span className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brandGreen text-white text-xs font-bold rounded-xl shadow-md group-hover:bg-brandGreen-dark transition-colors">
                          <span>Read Guide</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Articles Grid Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-brandGreen" />
                <h3 className="text-lg sm:text-xl font-extrabold text-navy">
                  {selectedCategory === 'All' ? 'Latest Articles' : `${selectedCategory} Articles`}
                </h3>
                <span className="text-xs text-gray-500 font-bold bg-white px-2.5 py-0.5 rounded-full border border-gray-200 shadow-2xs">
                  {filteredBlogs.length}
                </span>
              </div>
            </div>

            {/* Responsive Grid: 1 col on mobile, 2 cols on tablet 768px (md), 3 cols on desktop (lg) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {remainingBlogs.map((blog) => {
                const isBookmarked = bookmarkedIds.includes(blog._id || blog.id);
                return (
                  <article
                    key={blog._id || blog.id}
                    onClick={() => handleOpenReader(blog)}
                    className="group bg-white border border-gray-100 hover:border-brandGreen/40 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                  >
                    <div>
                      {/* Thumbnail Container */}
                      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 bg-navy/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-extrabold rounded-lg uppercase tracking-wider">
                            {blog.category}
                          </span>
                        </div>
                        <button
                          onClick={(e) => toggleBookmark(blog._id || blog.id, e)}
                          className={`absolute top-3 right-3 p-1.5 rounded-lg backdrop-blur-md border transition-colors cursor-pointer ${
                            isBookmarked
                              ? 'bg-brandGreen text-white border-brandGreen'
                              : 'bg-white/80 border-gray-200 text-gray-600 hover:text-navy hover:bg-white'
                          }`}
                          title="Bookmark"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Content Info */}
                      <div className="p-5 space-y-2.5 text-left">
                        <div className="flex items-center space-x-2 text-[11px] text-gray-400 font-semibold">
                          <span>{new Date(blog.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span>•</span>
                          <span>{blog.readTime || '4 min read'}</span>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <Eye className="w-3 h-3 text-brandGreen" />
                            <span>{blog.views || 0}</span>
                          </span>
                        </div>

                        <h4 className="text-base sm:text-lg font-extrabold text-navy group-hover:text-brandGreen transition-colors line-clamp-2 leading-snug font-['Outfit',sans-serif]">
                          {blog.title}
                        </h4>

                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed font-medium">
                          {blog.summary}
                        </p>

                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {blog.tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-gray-50 border border-gray-100 text-[10px] text-gray-500 font-medium">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-full bg-brandGreen/10 border border-brandGreen/25 flex items-center justify-center text-[10px] font-extrabold text-brandGreen">
                          {blog.author?.name ? blog.author.name.charAt(0) : 'S'}
                        </div>
                        <div className="truncate max-w-[130px] text-left">
                          <p className="text-xs font-bold text-navy truncate">{blog.author?.name || 'Saboor Ahmad CA'}</p>
                        </div>
                      </div>

                      <span className="text-xs font-extrabold text-brandGreen flex items-center space-x-1 group-hover:underline">
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
