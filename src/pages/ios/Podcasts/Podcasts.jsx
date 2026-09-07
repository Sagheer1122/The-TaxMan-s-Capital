import { useState, useMemo, useEffect } from 'react';
import { requireAuth } from '../../../services/authService';
import { toggleBookmark as toggleUnifiedBookmark, getBookmarks, onBookmarksChange } from '../../../services/bookmarkService';
import {
  Play,
  Headphones,
  Tv,
  Search,
  Clock,
  Eye,
  Sparkles,
  ExternalLink,
  ThumbsUp,
  Bookmark,
  CheckCircle2,
  X,
  Filter,
  Radio,
  ArrowRight,
  ChevronRight,
  Volume2
} from 'lucide-react';
import mentorsDiscussing from '../../../assets/mentors_discussing.png';
import heroBg from '../../../assets/counseling_hero_bg.png';

const YoutubeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export default function Podcasts() {
  const [activeTypeFilter, setActiveTypeFilter] = useState('All');
  const [activeQualFilter, setActiveQualFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    return getBookmarks().filter(b => b.type === 'podcast').map(b => String(b.itemId || b.id));
  });
  const [likedIds, setLikedIds] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const sub = onBookmarksChange((all) => {
      setBookmarkedIds(all.filter(b => b.type === 'podcast').map(b => String(b.itemId || b.id)));
    });
    return () => sub.unsubscribe();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const toggleBookmark = (id, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!requireAuth('save videos to your watch later list')) {
      return;
    }
    const ep = (episodes || []).find(item => item.id === id) || { id, title: `Podcast Episode #${id}` };
    const result = toggleUnifiedBookmark({
      id: id,
      title: ep.title,
      subtitle: ep.speaker || 'Saboor Ahmad CA',
      category: ep.type || ep.qualification || 'Masterclass',
      duration: ep.duration || '',
      link: '/podcasts'
    }, 'podcast');

    const idStr = String(id);
    setBookmarkedIds(prev =>
      result.isBookmarked ? [...prev, idStr] : prev.filter(item => item !== idStr)
    );
    showToast(result.isBookmarked ? 'Saved to your Bookmarks library!' : 'Removed from Bookmarks');
  };

  const toggleLike = (id, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!requireAuth('like video episodes')) {
      return;
    }
    if (likedIds.includes(id)) {
      setLikedIds(prev => prev.filter(item => item !== id));
    } else {
      setLikedIds(prev => [...prev, id]);
      showToast('Liked video!');
    }
  };

  // Default Authentic Channel Videos from @SaboorAhmadCA
  const defaultEpisodes = [
    {
      id: 'ep-1',
      youtubeId: 'L_LUpnjgPso',
      title: 'ICAP Firm Induction Guide 2026: QCR Rated vs Non-QCR Firms & Department Selection',
      guest: 'Saboor Ahmad CA',
      role: 'Founder & Lead Mentor @ The TaxMan\'s Capital',
      desc: 'Comprehensive guidance for CA trainees on choosing audit firms, understanding QCR ratings, rotation rules, and induction preparation.',
      duration: '42:15',
      views: '24.5K',
      likes: '1.8K',
      date: 'July 2026',
      type: 'Inductions & CVs',
      qualification: 'CA',
      isFeatured: true,
      thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
      tags: ['SaboorAhmadCA', 'ICAP', 'Induction', 'QCR', 'Articleship']
    },
    {
      id: 'ep-2',
      youtubeId: '5qap5aO4i9A',
      title: 'A.F. Ferguson & Co. (PwC) Test Preparation & Written Test Guidelines',
      guest: 'Saboor Ahmad CA',
      role: 'Lead Mentor @ The TaxMan\'s Capital',
      desc: 'Detailed breakdown of AFF induction test syllabus, English & Accounting sections, sample questions, and time management strategies.',
      duration: '35:20',
      views: '31.2K',
      likes: '2.4K',
      date: 'June 2026',
      type: 'Inductions & CVs',
      qualification: 'CA',
      isFeatured: false,
      thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      tags: ['AFF', 'PwC', 'TestPrep', 'SaboorAhmadCA', 'Induction']
    },
    {
      id: 'ep-3',
      youtubeId: '3JZ_D3ELwOQ',
      title: 'How I Secured a Job in Saudi Arabia | Relocation Guide for Pakistani CAs & ACCAs',
      guest: 'Saboor Ahmad CA',
      role: 'Founder @ The TaxMan\'s Capital',
      desc: 'Personal journey and step-by-step roadmap for Pakistani finance professionals to land high-paying roles in Saudi Arabia and Gulf regions.',
      duration: '48:10',
      views: '45.9K',
      likes: '3.8K',
      date: 'June 2026',
      type: 'Career & Overseas',
      qualification: 'Corporate / Tax',
      isFeatured: false,
      thumbnail: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      tags: ['SaudiArabia', 'GulfJobs', 'SaboorAhmadCA', 'Relocation', 'FCA']
    },
    {
      id: 'ep-4',
      youtubeId: '7tNs-xSft34',
      title: 'Audit Firm Training vs Industry Training in CA Articleship (Stipends & Growth)',
      guest: 'Saboor Ahmad CA',
      role: 'Lead Mentor @ The TaxMan\'s Capital',
      desc: 'Detailed comparison between 3.5 years training in Big 4 / audit firms versus ICAP approved industrial training opportunities.',
      duration: '29:45',
      views: '28.0K',
      likes: '2.1K',
      date: 'May 2026',
      type: 'Podcasts & Interviews',
      qualification: 'CA',
      isFeatured: false,
      thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
      tags: ['FirmsVsIndustry', 'Articleship', 'SaboorAhmadCA', 'ICAP']
    },
    {
      id: 'ep-5',
      youtubeId: 'dpw9EHDh2bM',
      title: 'How to Prepare Professional CV & Cover Letter for KPMG & EY Inductions',
      guest: 'Saboor Ahmad CA',
      role: 'Founder @ The TaxMan\'s Capital',
      desc: 'ATS-friendly resume formatting tips for CA candidates, highlighting attempt history, academic records, and extracurricular achievements.',
      duration: '32:15',
      views: '22.4K',
      likes: '1.9K',
      date: 'May 2026',
      type: 'Inductions & CVs',
      qualification: 'CA',
      isFeatured: false,
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
      tags: ['CVReview', 'KPMG', 'EY', 'SaboorAhmadCA', 'Resume']
    },
    {
      id: 'ep-6',
      youtubeId: 'kJQP7kiw5Fk',
      title: 'CAF Exam Attempt Strategy: Subject Combination & ICAP Exam Preparation',
      guest: 'Saboor Ahmad CA',
      role: 'Lead Mentor @ The TaxMan\'s Capital',
      desc: 'Practical revision techniques, paper planning, and subject combination advice to clear CAF exams in first attempts.',
      duration: '38:15',
      views: '19.8K',
      likes: '1.5K',
      date: 'April 2026',
      type: 'Exam Guides',
      qualification: 'CA',
      isFeatured: false,
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      tags: ['CAF', 'ICAP', 'Exams', 'SaboorAhmadCA', 'StudyStrategy']
    },
    {
      id: 'ep-7',
      youtubeId: 'L_LUpnjgPso',
      title: 'International Career & Settling in New Zealand for Chartered Accountants',
      guest: 'Saboor Ahmad CA',
      role: 'Founder @ The TaxMan\'s Capital',
      desc: 'Visa pathways, job search strategy, and skill recognition for Pakistani CAs relocating to New Zealand.',
      duration: '41:20',
      views: '26.7K',
      likes: '2.2K',
      date: 'April 2026',
      type: 'Career & Overseas',
      qualification: 'Corporate / Tax',
      isFeatured: false,
      thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      tags: ['NewZealand', 'OverseasJobs', 'SaboorAhmadCA', 'Immigration']
    },
    {
      id: 'ep-8',
      youtubeId: '5qap5aO4i9A',
      title: 'LinkedIn Job Search Masterclass for CA & ACCA Trainees',
      guest: 'Saboor Ahmad CA',
      role: 'Lead Mentor @ The TaxMan\'s Capital',
      desc: 'How to optimize your LinkedIn profile, connect with HR recruiters, and find corporate finance vacancies in Pakistan and abroad.',
      duration: '36:00',
      views: '33.1K',
      likes: '2.9K',
      date: 'March 2026',
      type: 'Inductions & CVs',
      qualification: 'CA',
      isFeatured: false,
      thumbnail: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?auto=format&fit=crop&w=800&q=80',
      tags: ['LinkedIn', 'JobSearch', 'SaboorAhmadCA', 'Recruitment']
    }
  ];

  const [episodes, setEpisodes] = useState(() => {
    const saved = localStorage.getItem('taxman_podcasts_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (err) {
        console.error("Error loading podcasts data from localStorage:", err);
      }
    }
    return defaultEpisodes;
  });

  const filteredEpisodes = useMemo(() => {
    return episodes.filter(ep => {
      const matchesSearch =
        searchQuery === '' ||
        ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType =
        activeTypeFilter === 'All' ||
        ep.type === activeTypeFilter ||
        (activeTypeFilter === 'Saved' && bookmarkedIds.includes(ep.id));

      const matchesQual =
        activeQualFilter === 'All' ||
        ep.qualification === activeQualFilter ||
        ep.qualification === 'All';

      return matchesSearch && matchesType && matchesQual;
    });
  }, [episodes, searchQuery, activeTypeFilter, activeQualFilter, bookmarkedIds]);

  const featuredEpisode = episodes.find(e => e.isFeatured) || episodes[0];

  return (
    <div className="min-h-screen bg-[#011126] text-white pt-4 sm:pt-6 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brandGreen/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-3/4 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-navy border border-brandGreen/40 text-emerald-400 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center space-x-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-brandGreen flex-shrink-0" />
          <span className="text-sm font-semibold text-white">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-navy via-[#021b38] to-[#01162e] border border-white/10 p-8 sm:p-12 shadow-2xl overflow-hidden group">
          <div
            className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: `url(${heroBg})` }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brandGreen/10 border border-brandGreen/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Radio className="w-4 h-4 text-brandGreen animate-pulse" />
                <span>Official Channel & Podcast Hub</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Videos & Podcasts by <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brandGreen via-emerald-400 to-teal-300">
                  Saboor Ahmad CA
                </span>
              </h1>

              <p className="text-gray-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                Watch in-depth career masterclasses, Big 4 induction roadmaps, ICAP exam techniques, and podcasts with industry leaders directly from Saboor Ahmad CA's official channel.
              </p>

              {/* YouTube Channel Stats & Subscribe CTA */}
              <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6">
                <a
                  href="https://www.youtube.com/@SaboorAhmadCA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2.5 cursor-pointer"
                >
                  <YoutubeIcon className="w-5 h-5 text-white" />
                  <span>Subscribe @SaboorAhmadCA</span>
                  <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
                </a>

                <div className="flex items-center space-x-6 text-xs sm:text-sm text-gray-300 border-l border-white/10 pl-6">
                  <div>
                    <span className="block text-lg font-bold text-white">15.4K+</span>
                    <span className="text-gray-400 text-xs">Subscribers</span>
                  </div>
                  <div>
                    <span className="block text-lg font-bold text-brandGreen">45+</span>
                    <span className="text-gray-400 text-xs">Podcasts & Videos</span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="block text-lg font-bold text-emerald-400">250K+</span>
                    <span className="text-gray-400 text-xs">Total Views</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Host Profile Card */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="w-full max-w-xs p-6 rounded-2xl bg-navy/80 border border-white/15 backdrop-blur-xl shadow-xl space-y-4 text-center">
                <div className="relative w-24 h-24 mx-auto rounded-full p-1 bg-gradient-to-tr from-brandGreen via-emerald-400 to-teal-400 shadow-lg shadow-emerald-500/20">
                  <img
                    src={mentorsDiscussing}
                    alt="Saboor Ahmad CA"
                    className="w-full h-full rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 p-1.5 bg-red-600 rounded-full text-white shadow-md">
                    <YoutubeIcon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">Saboor Ahmad CA</h3>
                  <p className="text-xs text-brandGreen font-medium mt-0.5">Founder & Lead Mentor</p>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Helping CA/ACCA students crack Big 4 firm inductions & achieve corporate success.
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-around text-xs text-gray-300">
                  <span className="flex items-center space-x-1">
                    <Tv className="w-3.5 h-3.5 text-brandGreen" />
                    <span>Weekly Videos</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Headphones className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mentorship</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Video Spotlight - Direct Link */}
        {featuredEpisode && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-brandGreen font-bold text-sm uppercase tracking-wider">
              <Sparkles className="w-5 h-5 text-brandGreen animate-spin" />
              <span>Featured Masterclass Spotlight</span>
            </div>

            <div className="bg-navy/90 border border-brandGreen/30 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 group hover:border-brandGreen/60 transition-all duration-300">
              {/* Thumbnail Container */}
              <a
                href={`https://youtu.be/GTm4fuyCZmg?si=clcQEWlB6XzctZLy`}
                target="_blank"
                rel="noopener noreferrer"
                className="lg:col-span-7 relative bg-black aspect-video sm:aspect-auto h-64 lg:h-full cursor-pointer overflow-hidden group/thumb block"
              >
                <img
                  src={featuredEpisode.thumbnail}
                  alt={featuredEpisode.title}
                  className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500 opacity-90 group-hover/thumb:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-600/40 group-hover/thumb:scale-110 transition-all duration-300">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
                  </div>
                </div>
                <div className="absolute top-4 left-4 px-3 py-1 bg-red-600/90 text-white text-xs font-bold rounded-lg backdrop-blur-md flex items-center space-x-1.5">
                  <YoutubeIcon className="w-3.5 h-3.5" />
                  <span>MUST WATCH ON YOUTUBE</span>
                </div>
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 text-emerald-400 font-mono text-xs font-bold rounded-lg border border-white/10 backdrop-blur-md flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{featuredEpisode.duration}</span>
                </div>
              </a>

              {/* Spotlight Info */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="px-3 py-1 rounded-full bg-brandGreen/10 border border-brandGreen/20 text-brandGreen font-semibold">
                      {featuredEpisode.type}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5 text-gray-400" />
                      <span>{featuredEpisode.views} Views</span>
                    </span>
                  </div>

                  <a
                    href={`https://www.youtube.com/watch?v=${featuredEpisode.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl sm:text-2xl font-extrabold text-white leading-snug hover:text-brandGreen cursor-pointer transition-colors block"
                  >
                    {featuredEpisode.title}
                  </a>

                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3">
                    {featuredEpisode.desc}
                  </p>

                  <div className="flex items-center space-x-3 text-xs text-gray-400 pt-2 border-t border-white/10">
                    <span className="font-semibold text-white">{featuredEpisode.guest}</span>
                    <span>•</span>
                    <span>{featuredEpisode.date}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <a
                    href={`https://www.youtube.com/watch?v=${featuredEpisode.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all shadow-lg shadow-red-600/20 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <YoutubeIcon className="w-4 h-4" />
                    <span>Watch Full Video on YouTube</span>
                  </a>

                  <button
                    onClick={(e) => toggleBookmark(featuredEpisode.id, e)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${bookmarkedIds.includes(featuredEpisode.id)
                      ? 'bg-emerald-500/20 border-brandGreen text-brandGreen'
                      : 'border-white/15 text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    title="Save Video"
                  >
                    <Bookmark className={`w-5 h-5 ${bookmarkedIds.includes(featuredEpisode.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Bar & Search */}
        <div className="space-y-6 pt-4 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Type Filter Buttons */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {[
                { label: 'All Episodes', value: 'All' },
                { label: 'Inductions & CVs', value: 'Inductions & CVs' },
                { label: 'Podcasts & Interviews', value: 'Podcasts & Interviews' },
                { label: 'Exam Guides', value: 'Exam Guides' },
                { label: 'Career & Overseas', value: 'Career & Overseas' },
                { label: 'Saved Videos', value: 'Saved' }
              ].map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTypeFilter(tab.value)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${activeTypeFilter === tab.value
                    ? 'bg-brandGreen text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-navy/80 border border-white/10 text-gray-300 hover:text-white hover:border-white/20'
                    }`}
                >
                  {tab.label}
                  {tab.value === 'Saved' && bookmarkedIds.length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-white text-navy font-extrabold rounded-full">
                      {bookmarkedIds.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search videos, topics or guests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-navy/90 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-brandGreen transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Qualification Filter Sub-pills */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-gray-400 font-semibold flex items-center space-x-1 mr-2">
              <Filter className="w-3.5 h-3.5 text-brandGreen" />
              <span>Target Field:</span>
            </span>
            {['All', 'CA', 'ACCA', 'Corporate / Tax'].map((qual) => (
              <button
                key={qual}
                onClick={() => setActiveQualFilter(qual)}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${activeQualFilter === qual
                  ? 'bg-emerald-500/20 text-emerald-400 border border-brandGreen/40'
                  : 'bg-white/5 text-gray-400 hover:text-gray-200 border border-transparent'
                  }`}
              >
                {qual === 'CA' ? 'CA (ICAP)' : qual}
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid - Opens Directly on YouTube */}
        {filteredEpisodes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEpisodes.map((ep) => {
              const isSaved = bookmarkedIds.includes(ep.id);
              const isLiked = likedIds.includes(ep.id);

              return (
                <div
                  key={ep.id}
                  className="bg-navy/80 border border-white/10 hover:border-brandGreen/40 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-brandGreen/5 transition-all duration-300 flex flex-col group"
                >
                  {/* Thumbnail Image - Direct Link */}
                  <a
                    href={`https://www.youtube.com/watch?v=${ep.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-video bg-black cursor-pointer overflow-hidden block"
                  >
                    <img
                      src={ep.thumbnail}
                      alt={ep.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 bg-black/80 text-emerald-400 font-mono text-[11px] font-bold rounded-md border border-white/10 backdrop-blur-md flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{ep.duration}</span>
                    </div>
                    {/* Type badge */}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-navy/90 border border-white/15 text-white text-[10px] font-bold rounded-md backdrop-blur-md">
                      {ep.type}
                    </div>
                  </a>

                  {/* Content Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span className="font-medium text-brandGreen">{ep.guest}</span>
                        <span>{ep.date}</span>
                      </div>

                      <a
                        href={`https://www.youtube.com/watch?v=${ep.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-base text-white hover:text-brandGreen cursor-pointer line-clamp-2 leading-snug transition-colors block"
                      >
                        {ep.title}
                      </a>

                      <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                        {ep.desc}
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1 text-gray-400">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{ep.views}</span>
                        </span>
                        <button
                          onClick={(e) => toggleLike(ep.id, e)}
                          className={`flex items-center space-x-1 transition-colors cursor-pointer ${isLiked ? 'text-red-400' : 'hover:text-white'
                            }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                          <span>{ep.likes}</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => toggleBookmark(ep.id, e)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${isSaved
                            ? 'bg-emerald-500/20 border-brandGreen text-brandGreen'
                            : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                            }`}
                          title="Save Video"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                        <a
                          href={`https://www.youtube.com/watch?v=${ep.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer shadow-md"
                        >
                          <YoutubeIcon className="w-3.5 h-3.5" />
                          <span>Watch</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-navy/40 rounded-3xl border border-white/10 space-y-4">
            <Radio className="w-12 h-12 text-gray-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No episodes found</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              We couldn't find any videos matching your search criteria. Try resetting your filters.
            </p>
            <button
              onClick={() => {
                setActiveTypeFilter('All');
                setActiveQualFilter('All');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-brandGreen text-white text-xs font-bold hover:bg-brandGreen-dark transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Audio Podcast Listening Mode Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950/60 via-navy to-[#011a36] border border-emerald-500/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-emerald-500/20 text-brandGreen border border-brandGreen/30 flex-shrink-0">
              <Headphones className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Prefer Listening On The Go?</span>
                <span className="px-2 py-0.5 text-[10px] bg-brandGreen/20 text-brandGreen font-bold rounded-full">
                  AUDIO MODE
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Stream full audio podcasts while commuting, studying, or exercising.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <a
              href="https://www.youtube.com/@SaboorAhmadCA"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all shadow-lg shadow-red-600/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen on YouTube Channel</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
