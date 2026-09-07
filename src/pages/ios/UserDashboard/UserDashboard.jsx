import { useState, useEffect, useMemo } from 'react';
import { useBodyScrollLock } from '../../../hooks/useBodyScrollLock';
import PortalModal from '../../../components/PortalModal';
import {
  User,
  Bookmark,
  FileText,
  Clock,
  Briefcase,
  MapPin,
  Mail,
  Sliders,
  Sparkles,
  LogOut,
  Save,
  CheckCircle,
  ExternalLink,
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  Globe,
  Send,
  Bot,
  ArrowRight,
  BookOpen,
  Video,
  Calendar,
  Trash2,
  Download,
  Filter
} from 'lucide-react';
import { updateProfile } from '../../../services/authService';
import { submitContactForm, getMyCounselingQueries } from '../../../services/submissionService';
import { getBookmarks, removeBookmark, clearAllBookmarks, onBookmarksChange } from '../../../services/bookmarkService';
import DualMediaUpload from '../../../components/common/DualMediaUpload';
import { INITIAL_JOBS } from '../../../data/jobsData';
import NotificationPanel from '../../../components/NotificationPanel';
import logoImg from '../../../assets/logo.png';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from '../../../services/notificationService';

const getJobs = async () => INITIAL_JOBS;
const getRequests = async () => [];
const getMessages = async () => {
  return await getMyCounselingQueries();
};
const updateUserProfile = updateProfile;
const submitMessage = submitContactForm;

export default function UserDashboard({ session, onLogout, onProfileUpdate, savedJobs = [], onRemoveSavedJob, onGoHome, onNavigateTab, initialSubTab = 'Overview' }) {
  const [activeSubTab, setActiveSubTab] = useState(() => {
    if (initialSubTab === 'Saved Jobs' || initialSubTab === 'Bookmarks') return 'Bookmarks';
    return initialSubTab;
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [headerDropdownOpen, setHeaderDropdownOpen] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Unified Bookmarks State
  const [allBookmarks, setAllBookmarks] = useState(() => getBookmarks(session?.user?.id));
  const [bookmarkCategoryFilter, setBookmarkCategoryFilter] = useState('all');
  const [bookmarkSearchQuery, setBookmarkSearchQuery] = useState('');

  useEffect(() => {
    setAllBookmarks(getBookmarks(session?.user?.id));
    const sub = onBookmarksChange((updated) => {
      setAllBookmarks(updated);
    });
    return () => sub.unsubscribe();
  }, [session]);

  useEffect(() => {
    getNotifications().then(setNotifications).catch(() => {});
  }, []);

  const handleMarkNotifRead = async (id) => {
    setNotifications(prev => prev.map(n => String(n.id) === String(id) ? { ...n, read: true } : n));
    const updated = await markNotificationAsRead(id, notifications);
    if (Array.isArray(updated)) setNotifications(updated);
  };

  const handleMarkAllNotifsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    const updated = await markAllNotificationsAsRead(notifications);
    if (Array.isArray(updated)) setNotifications(updated);
  };

  const handleDeleteNotif = async (id) => {
    setNotifications(prev => prev.filter(n => String(n.id) !== String(id)));
    const updated = await deleteNotification(id, notifications);
    if (Array.isArray(updated)) setNotifications(updated);
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (initialSubTab) {
      const timer = setTimeout(() => {
        setActiveSubTab(initialSubTab);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialSubTab]);

  const [profile, setProfile] = useState({
    full_name: session?.user?.full_name || 'Student',
    username: session?.user?.username || 'student',
    avatar_url: session?.user?.avatar_url || '',
    level: 'CAF', // Default education stage
    phone: '',
    city: 'Lahore',
    institution: '',
    papers_cleared: 0,
    cv_url: ''
  });
  const [userQueries, setUserQueries] = useState([]);
  const [newQueryForm, setNewQueryForm] = useState({ subject: '', category: 'Career Guidance', message: '' });
  const [submittingQuery, setSubmittingQuery] = useState(false);
  const [selectedQueryDetail, setSelectedQueryDetail] = useState(null);

  // Explore Placements states
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [selectedJobDetail, setSelectedJobDetail] = useState(null);

  const [savingProfile, setSavingProfile] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load jobs and resource requests
  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        // Fetch all jobs
        const allJobs = await getJobs();
        setJobs(allJobs || []);

        // Fetch resource requests and filter by user's email
        const allRequests = await getRequests();
        const userEmail = session?.user?.email;
        if (userEmail) {
          const userRequests = allRequests.filter(r => r.email === userEmail || r.name === profile.full_name);
          setRequests(userRequests);

          // Fetch counseling queries and filter by student email
          const allMessages = await getMessages();
          const userMsg = allMessages.filter(m => !userEmail || m.email?.toLowerCase() === userEmail.toLowerCase() || m.name === profile.full_name);
          setUserQueries(userMsg.length > 0 ? userMsg : allMessages);
        } else {
          const allMessages = await getMessages();
          setUserQueries(allMessages);
        }

        // Fetch user's qualification level and profile metadata from session and storage
        if (session?.user?.id) {
          const storedProfileStr = localStorage.getItem(`user_profile_meta_${session.user.id}`);
          const storedProfile = storedProfileStr ? JSON.parse(storedProfileStr) : null;
          const userMeta = session.user.user_metadata || {};

          setProfile(prev => ({
            ...prev,
            full_name: session.user.fullName || session.user.name || prev.full_name,
            username: session.user.username || prev.username,
            avatar_url: session.user.avatar_url || session.user.profileImage || prev.avatar_url,
            level: session.user.level || userMeta.level || storedProfile?.level || prev.level || 'CAF',
            phone: session.user.phone || userMeta.phone || storedProfile?.phone || prev.phone || '',
            city: session.user.city || userMeta.city || storedProfile?.city || prev.city || 'Lahore',
            institution: session.user.institution || userMeta.institution || storedProfile?.institution || prev.institution || '',
            papers_cleared: session.user.papers_cleared !== undefined ? session.user.papers_cleared : (storedProfile?.papers_cleared !== undefined ? storedProfile.papers_cleared : prev.papers_cleared),
            cv_url: session.user.cv_url || userMeta.cv_url || storedProfile?.cv_url || prev.cv_url || ''
          }));
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [session]);

  // Handle avatar upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("File is too large! Maximum size allowed is 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile update submit
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      if (session?.user?.id) {
        await updateUserProfile({
          full_name: profile.full_name,
          name: profile.full_name,
          username: profile.username,
          avatar_url: profile.avatar_url,
          level: profile.level,
          qualification: profile.level,
          phone: profile.phone,
          city: profile.city,
          institution: profile.institution,
          papers_cleared: profile.papers_cleared,
          cv_url: profile.cv_url
        });

        // Save level and all custom metadata locally for instant retrieval
        localStorage.setItem(`user_level_${session.user.id}`, profile.level);
        localStorage.setItem(`user_profile_meta_${session.user.id}`, JSON.stringify({
          level: profile.level,
          phone: profile.phone,
          city: profile.city,
          institution: profile.institution,
          papers_cleared: profile.papers_cleared,
          cv_url: profile.cv_url
        }));
      }

      if (onProfileUpdate) {
        onProfileUpdate({
          full_name: profile.full_name,
          username: profile.username,
          avatar_url: profile.avatar_url,
          level: profile.level,
          phone: profile.phone,
          city: profile.city,
          institution: profile.institution,
          papers_cleared: profile.papers_cleared,
          cv_url: profile.cv_url
        });
      }

      alert("Profile updated successfully!");
    } catch (err) {
      alert(`Failed to save profile: ${err.message}`);
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle submitting new counseling query
  const handleCreateQuery = async (e) => {
    e.preventDefault();
    if (!newQueryForm.subject.trim() || !newQueryForm.message.trim()) {
      alert("Please fill in all fields!");
      return;
    }
    setSubmittingQuery(true);
    try {
      const payload = {
        name: profile.full_name,
        email: session?.user?.email || 'student@taxman.com',
        phone: profile.phone || '',
        subject: newQueryForm.subject,
        category: newQueryForm.category,
        message: newQueryForm.message
      };

      const result = await submitMessage(payload);
      if (result) {
        setUserQueries(prev => [result, ...prev]);
        setNewQueryForm({ subject: '', category: 'Career Guidance', message: '' });
        alert("Your career query has been submitted successfully to our counseling team!");
      }
    } catch (err) {
      alert(`Error submitting query: ${err.message}`);
    } finally {
      setSubmittingQuery(false);
    }
  };

  // Get bookmarked jobs detail
  // Normalize job objects just like Jobs.jsx
  const normalizedJobs = jobs.map(job => ({
    ...job,
    jobType: job.job_type === 'Full-time' ? 'Full Time' : job.job_type === 'Part-time' ? 'Part Time' : job.job_type || job.jobType,
    isOverseas: job.is_overseas || job.isOverseas
  }));

  const savedJobsList = normalizedJobs.filter(j => savedJobs.includes(j.id));

  // Get personalized recommendations matching student qualification stage
  const recommendedJobs = normalizedJobs.filter(j => {
    if (!profile.level) return false;
    const levelStr = String(j.level || '').toLowerCase();
    const studentLvl = String(profile.level).toLowerCase();
    return levelStr.includes(studentLvl) || levelStr.includes('all');
  }).slice(0, 3);

  // Generate notifications for student dashboard
  const notificationsList = savedJobsList.map(job => ({
    id: `job-${job.id}`,
    jobId: job.id,
    title: job.title,
    company: job.company,
    deadline: job.deadline,
    description: `Application deadline approaching at ${job.company} (${job.deadline}). Tap to view.`,
    time: 'Deadline',
    bg: 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
  }));

  return (
    <div className="flex bg-[#F8F9FB] h-screen overflow-hidden text-gray-800 font-sans relative w-full">

      {/* 1. LEFT SIDEBAR (Dark - Desktop & Mobile Drawer) */}
      <aside className={`w-72 bg-[#090C11] text-white flex flex-col h-screen fixed lg:static left-0 top-0 z-40 flex-shrink-0 transition-transform duration-300 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        {/* Top Logo / Slogan */}
        <div className="p-6 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center space-x-3 select-none">
            <img
              src={logoImg}
              alt="The TaxMan's Capital Logo"
              className="h-10 w-auto object-contain shrink-0 drop-shadow-[0_2px_10px_rgba(0,230,118,0.25)] translate-y-1"
            />
            <div className="flex flex-col justify-center">
              <span className="text-white font-black text-sm tracking-tight whitespace-nowrap font-['Outfit',sans-serif]">
                The TaxMan's
              </span>
              <div className="flex items-center space-x-1 mt-0.5">
                <span className="h-[1px] w-2.5 bg-gradient-to-r from-transparent to-[#00E676]/80"></span>
                <span className="text-[#00E676] font-bold text-[8px] tracking-[0.22em] uppercase leading-none font-['Outfit',sans-serif]">
                  Capital
                </span>
                <span className="h-[1px] w-2.5 bg-gradient-to-l from-transparent to-[#00E676]/80"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 min-h-0 px-4 pt-4 pb-2 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-white/10">
          {[
            { id: 'Overview', label: 'My Dashboard', icon: <Sparkles className="w-4.5 h-4.5" /> },
            { id: 'Career Tools', label: 'Career Tools & AI Hub', icon: <Bot className="w-4.5 h-4.5" /> },
            { id: 'Explore Placements', label: 'Explore Placements', icon: <Briefcase className="w-4.5 h-4.5" /> },
            { id: 'Bookmarks', label: 'Bookmarks', icon: <Bookmark className="w-4.5 h-4.5" />, badge: allBookmarks.length },
            { id: 'Ask Counselor', label: 'Ask Counselor', icon: <Mail className="w-4.5 h-4.5" />, badge: userQueries.filter(q => !q.reply).length },
            { id: 'Study Circles', label: 'Study Circles', icon: <Globe className="w-4.5 h-4.5" /> },
            { id: 'My Requests', label: 'Resource Requests', icon: <FileText className="w-4.5 h-4.5" />, badge: requests.length },
            { id: 'Firm Announcements', label: 'Firm Announcements', icon: <Clock className="w-4.5 h-4.5" /> },
            { id: 'Settings', label: 'Profile Settings', icon: <Sliders className="w-4.5 h-4.5" /> }
          ].map(item => {
            const isActive = activeSubTab === item.id || (item.id === 'Bookmarks' && activeSubTab === 'Saved Jobs');
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'Career Tools') {
                    if (onGoHome) onGoHome();
                    window.history.pushState(null, '', '/careertools');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                    return;
                  }
                  setActiveSubTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all ${isActive
                    ? 'text-brandGreen bg-brandGreen/10 border border-brandGreen/30 shadow-inner'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <div className="flex items-center space-x-3.5">
                  <span className={isActive ? 'text-brandGreen' : 'text-gray-400 group-hover:text-white'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="w-5 h-5 flex items-center justify-center text-[10px] font-black rounded-full bg-brandGreen text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="p-4 border-t border-white/5 flex-shrink-0">
          <div
            onClick={() => {
              setActiveSubTab('Settings');
              setMobileSidebarOpen(false);
            }}
            className="flex items-center justify-between p-2.5 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brandGreen to-emerald-400 text-white font-black flex items-center justify-center border-2 border-white/10 shadow-inner flex-shrink-0 overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  profile.full_name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white truncate">{profile.full_name}</span>
                <span className="text-[9px] text-brandGreen font-semibold mt-0.5 truncate">{profile.level} Student</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* 2. MAIN CONTENT WRAPPER */}
      <main className="flex-1 h-screen overflow-y-auto min-w-0 flex flex-col bg-[#F8F9FB] w-full">

        {/* Header Bar */}
        <header className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-20 shadow-sm flex-shrink-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-1.5 text-gray-500 hover:text-navy focus:outline-none"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>

            {/* Search Input Bar */}
            <div className="relative w-64 sm:w-80 hidden md:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search for study courses, resources..."
                className="w-full pl-10 pr-4 py-2 border border-gray-100 bg-[#F8F9FB] rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:border-brandGreen transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Quick Links Shortcut */}
            <button
              onClick={onGoHome}
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center space-x-1 mr-2 cursor-pointer focus:outline-none"
            >
              <span>Back to Portal Home</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                data-notification-trigger
                onClick={() => setNotificationsDropdownOpen(!notificationsDropdownOpen)}
                className="relative p-2 text-gray-500 hover:text-navy transition-colors rounded-full hover:bg-gray-100 cursor-pointer focus:outline-none"
                aria-label="Toggle notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brandGreen text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm animate-pulse">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              <NotificationPanel
                isOpen={notificationsDropdownOpen}
                onClose={() => setNotificationsDropdownOpen(false)}
                notifications={notifications}
                onMarkAsRead={handleMarkNotifRead}
                onMarkAllAsRead={handleMarkAllNotifsRead}
                onDelete={handleDeleteNotif}
                onNavigateTab={(tab) => {
                  if (onNavigateTab) {
                    onNavigateTab(tab);
                  } else if (tab === 'Jobs') {
                    setActiveSubTab('Saved Jobs');
                  }
                  setNotificationsDropdownOpen(false);
                }}
              />
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <div
                onClick={() => setHeaderDropdownOpen(!headerDropdownOpen)}
                className="w-8.5 h-8.5 rounded-full bg-[#0A2540] text-white font-black flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  profile.full_name.charAt(0).toUpperCase()
                )}
              </div>

              {headerDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setHeaderDropdownOpen(false)} />

                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-40 animate-fadeIn text-xs text-left">
                    <div className="px-4 py-2 border-b border-gray-50 flex flex-col">
                      <span className="font-extrabold text-gray-800">{profile.full_name}</span>
                      <span className="text-[10px] text-gray-400 font-semibold mt-0.5 truncate">{session?.user?.email}</span>
                    </div>

                    <button
                      onClick={() => {
                        setHeaderDropdownOpen(false);
                        setActiveSubTab('Settings');
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700 hover:text-[#090C11] transition-colors font-bold flex items-center space-x-2 cursor-pointer focus:outline-none"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      <span>Edit Profile</span>
                    </button>

                    <button
                      onClick={async () => {
                        setHeaderDropdownOpen(false);
                        if (onLogout) {
                          await onLogout();
                        }
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors font-bold flex items-center space-x-2 cursor-pointer focus:outline-none"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span>Logout Account</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Body Content */}
        <div className="p-6 md:p-8 flex-grow max-w-7xl w-full mx-auto space-y-8">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-brandGreen border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* VIEW: OVERVIEW */}
          {activeSubTab === 'Overview' && !loading && (
            <div className="space-y-8 animate-fadeIn text-left">
              {/* Welcome Banner */}
              <div className="relative overflow-hidden bg-gradient-to-r from-navy via-[#052347] to-[#011126] text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brandGreen/10 to-transparent pointer-events-none rounded-r-3xl" />
                <div className="space-y-2 relative z-10">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-brandGreen/25 text-brandGreen text-[10px] font-black tracking-wider uppercase rounded-full">
                      Student Dashboard
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brandGreen animate-pulse" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Hello, {profile.full_name}! 👋
                  </h1>
                  <p className="text-gray-300 text-xs sm:text-sm font-medium max-w-xl">
                    Manage your bookmarked jobs, study resources, articles, masterclasses, and counseling requests all in one place.
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: 'Educational Level', value: profile.level, sub: 'Updated stage', icon: <Sliders className="w-5.5 h-5.5 text-blue-500" />, bg: 'bg-blue-500/10' },
                  { label: 'Saved Bookmarks', value: allBookmarks.length, sub: 'Items in your library', icon: <Bookmark className="w-5.5 h-5.5 text-amber-500" />, bg: 'bg-amber-500/10' },
                  { label: 'Requested Resources', value: requests.length, sub: 'Study files requested', icon: <FileText className="w-5.5 h-5.5 text-emerald-500" />, bg: 'bg-emerald-500/10' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                        {stat.icon}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{stat.label}</span>
                        <h4 className="text-2xl font-black text-navy leading-none mt-2">{stat.value}</h4>
                        <span className="text-[10px] text-gray-400 font-semibold mt-1 block">{stat.sub}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Smart Recommendations Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recommended Jobs */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                  <h3 className="text-sm font-extrabold text-navy uppercase tracking-wider flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-brandGreen" />
                    <span>Recommended Placements ({profile.level})</span>
                  </h3>
                  <div className="space-y-3.5">
                    {recommendedJobs.map((job) => (
                      <div key={job.id} className="p-4 bg-[#F8F9FB] rounded-2xl border border-transparent hover:border-brandGreen/25 transition-all flex justify-between items-center">
                        <div className="truncate pr-3 space-y-1">
                          <h4 className="font-extrabold text-navy text-xs sm:text-sm truncate">{job.title}</h4>
                          <span className="text-[10px] text-gray-400 font-semibold block">{job.company} • {job.location}</span>
                        </div>
                        <span className="px-2.5 py-1 bg-brandGreen/10 text-brandGreen-dark text-[9px] font-black rounded-lg shrink-0">
                          {job.jobType}
                        </span>
                      </div>
                    ))}
                    {recommendedJobs.length === 0 && (
                      <p className="text-xs text-gray-400 italic text-center py-6">No matching recommendations found for level: {profile.level}</p>
                    )}
                  </div>
                </div>

                {/* Study Tips & Guide */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                  <h3 className="text-sm font-extrabold text-navy uppercase tracking-wider flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Quick Mentorship Tips</span>
                  </h3>
                  <div className="space-y-3.5 text-xs text-gray-600 font-semibold leading-relaxed">
                    <div className="p-3.5 bg-emerald-500/5 rounded-2xl flex items-start space-x-3">
                      <span className="text-emerald-600 font-black">💡</span>
                      <p>Always review syllabus blueprints and past exam papers before building your study routine.</p>
                    </div>
                    <div className="p-3.5 bg-emerald-500/5 rounded-2xl flex items-start space-x-3">
                      <span className="text-emerald-600 font-black">💼</span>
                      <p>CV tailoring is key! Make sure to detail your academic highlights (paper scores, attempts) for induction applications.</p>
                    </div>
                    <div className="p-3.5 bg-emerald-500/5 rounded-2xl flex items-start space-x-3">
                      <span className="text-emerald-600 font-black">🌟</span>
                      <p>Regular mock exams will train your time management skills. Check the Resources section to download prep materials.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: BOOKMARKS & SAVED LIBRARY */}
          {(activeSubTab === 'Bookmarks' || activeSubTab === 'Saved Jobs') && !loading && (
            <div className="space-y-6 animate-fadeIn text-left">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-brandGreen/10 text-brandGreen text-[10px] font-black tracking-wider uppercase rounded-md border border-brandGreen/20">
                      Personal Archive
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                      • {allBookmarks.length} total saved item{allBookmarks.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-navy mt-1">Saved Library & Bookmarks</h1>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">
                    Manage and quickly access your saved job inductions, study notes, articles, podcasts, and upcoming webinars.
                  </p>
                </div>

                {allBookmarks.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear all your bookmarked items?')) {
                        const updated = clearAllBookmarks(session?.user?.id);
                        setAllBookmarks(updated);
                      }
                    }}
                    className="self-start sm:self-auto px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all border border-red-200/60 inline-flex items-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Bookmarks</span>
                  </button>
                )}
              </div>

              {/* Category Filter Pills & Search Bar */}
              <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm space-y-3">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  {/* Category Pills */}
                  <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                    {[
                      { id: 'all', label: 'All Items', icon: <Sparkles className="w-3.5 h-3.5" />, count: allBookmarks.length },
                      { id: 'job', label: 'Jobs & Inductions', icon: <Briefcase className="w-3.5 h-3.5" />, count: allBookmarks.filter(b => b.type === 'job').length },
                      { id: 'resource', label: 'Study Resources', icon: <BookOpen className="w-3.5 h-3.5" />, count: allBookmarks.filter(b => b.type === 'resource').length },
                      { id: 'blog', label: 'Blogs & Articles', icon: <FileText className="w-3.5 h-3.5" />, count: allBookmarks.filter(b => b.type === 'blog').length },
                      { id: 'podcast', label: 'Podcasts & Videos', icon: <Video className="w-3.5 h-3.5" />, count: allBookmarks.filter(b => b.type === 'podcast').length },
                      { id: 'event', label: 'Events & Webinars', icon: <Calendar className="w-3.5 h-3.5" />, count: allBookmarks.filter(b => b.type === 'event').length },
                    ].map(cat => {
                      const isCatActive = bookmarkCategoryFilter === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setBookmarkCategoryFilter(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
                            isCatActive
                              ? 'bg-brandGreen text-white shadow-md shadow-emerald-500/20'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-navy border border-gray-100'
                          }`}
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                            isCatActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {cat.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search within Bookmarks */}
                  <div className="relative flex-shrink-0 md:w-64">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search bookmarks..."
                      value={bookmarkSearchQuery}
                      onChange={(e) => setBookmarkSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-7 py-1.5 bg-[#F8F9FB] border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brandGreen"
                    />
                    {bookmarkSearchQuery && (
                      <button
                        onClick={() => setBookmarkSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bookmarks Grid List */}
              {(() => {
                const displayed = allBookmarks.filter(item => {
                  const matchesCat = bookmarkCategoryFilter === 'all' || item.type === bookmarkCategoryFilter;
                  const q = bookmarkSearchQuery.trim().toLowerCase();
                  const matchesQuery = !q ||
                    item.title?.toLowerCase().includes(q) ||
                    item.subtitle?.toLowerCase().includes(q) ||
                    item.category?.toLowerCase().includes(q) ||
                    item.location?.toLowerCase().includes(q);
                  return matchesCat && matchesQuery;
                });

                if (displayed.length === 0) {
                  return (
                    <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-brandGreen">
                        <Bookmark className="w-7 h-7 stroke-[1.8]" />
                      </div>
                      <div className="space-y-1 max-w-sm">
                        <h3 className="font-black text-navy text-base">
                          {bookmarkSearchQuery
                            ? 'No matching bookmarks found'
                            : bookmarkCategoryFilter === 'all'
                            ? 'Your Saved Library is Empty'
                            : `No Saved ${bookmarkCategoryFilter === 'job' ? 'Jobs' : bookmarkCategoryFilter === 'resource' ? 'Resources' : bookmarkCategoryFilter === 'blog' ? 'Blogs' : bookmarkCategoryFilter === 'podcast' ? 'Podcasts' : 'Events'} Yet`}
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed font-medium">
                          {bookmarkSearchQuery
                            ? 'Try searching with a different keyword or switch categories.'
                            : 'Click the bookmark icon across any job posting, study note, article, podcast, or webinar to build your library.'}
                        </p>
                      </div>

                      <div className="pt-2 flex flex-wrap gap-2 justify-center">
                        <button
                          onClick={() => {
                            if (onGoHome) onGoHome();
                            window.history.pushState(null, '', '/jobs');
                            window.dispatchEvent(new PopStateEvent('popstate'));
                          }}
                          className="px-3.5 py-2 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/10 inline-flex items-center space-x-1.5 cursor-pointer"
                        >
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>Explore Placements</span>
                        </button>
                        <button
                          onClick={() => {
                            if (onGoHome) onGoHome();
                            window.history.pushState(null, '', '/resources');
                            window.dispatchEvent(new PopStateEvent('popstate'));
                          }}
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 inline-flex items-center space-x-1.5 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Study Resources</span>
                        </button>
                        <button
                          onClick={() => {
                            if (onGoHome) onGoHome();
                            window.history.pushState(null, '', '/podcasts');
                            window.dispatchEvent(new PopStateEvent('popstate'));
                          }}
                          className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-500/10 inline-flex items-center space-x-1.5 cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Podcasts & Videos</span>
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {displayed.map((item) => {
                      // Category Badge Styles
                      const typeConfig = {
                        job: { label: 'Job Placement', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <Briefcase className="w-3 h-3" /> },
                        resource: { label: 'Study Resource', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: <BookOpen className="w-3 h-3" /> },
                        blog: { label: 'Career Article', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: <FileText className="w-3 h-3" /> },
                        podcast: { label: 'Podcast Masterclass', color: 'bg-red-50 text-red-700 border-red-200', icon: <Video className="w-3 h-3" /> },
                        event: { label: 'Live Webinar', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Calendar className="w-3 h-3" /> }
                      }[item.type] || { label: 'Saved Item', color: 'bg-gray-50 text-gray-700 border-gray-200', icon: <Bookmark className="w-3 h-3" /> };

                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-brandGreen/30 transition-all flex flex-col justify-between group"
                        >
                          <div>
                            {/* Top Badge & Remove Button */}
                            <div className="flex items-center justify-between gap-2">
                              <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg border uppercase inline-flex items-center space-x-1 ${typeConfig.color}`}>
                                {typeConfig.icon}
                                <span>{typeConfig.label}</span>
                              </span>
                              <button
                                onClick={() => {
                                  const updated = removeBookmark(item.id, session?.user?.id);
                                  setAllBookmarks(updated);
                                }}
                                title="Remove from bookmarks"
                                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Title & Subtitle */}
                            <h3 className="text-base font-black text-navy mt-3 leading-snug group-hover:text-brandGreen transition-colors line-clamp-2">
                              {item.title}
                            </h3>
                            <p className="text-xs font-bold text-gray-400 mt-1 truncate">
                              {item.subtitle}
                            </p>

                            {/* Metadata Pills */}
                            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-gray-500">
                              {item.category && (
                                <span className="px-2 py-0.5 bg-[#F8F9FB] rounded-md border border-gray-100">
                                  {item.category}
                                </span>
                              )}
                              {item.location && (
                                <span className="inline-flex items-center space-x-1 text-gray-400">
                                  <MapPin className="w-3 h-3" />
                                  <span>{item.location}</span>
                                </span>
                              )}
                              {item.deadline && (
                                <span className="text-red-500 font-extrabold">
                                  DL: {item.deadline}
                                </span>
                              )}
                              {item.duration && (
                                <span className="inline-flex items-center space-x-1 text-gray-400">
                                  <Clock className="w-3 h-3" />
                                  <span>{item.duration}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Footer Action Link */}
                          <div className="mt-5 pt-3.5 border-t border-gray-50 flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-gray-400">
                              Saved {item.savedAt ? new Date(item.savedAt).toLocaleDateString() : 'recently'}
                            </span>
                            <button
                              onClick={() => {
                                if (item.link) {
                                  if (item.link.startsWith('http')) {
                                    window.open(item.link, '_blank');
                                  } else {
                                    if (onGoHome) onGoHome();
                                    window.history.pushState(null, '', item.link);
                                    window.dispatchEvent(new PopStateEvent('popstate'));
                                  }
                                }
                              }}
                              className="px-3 py-1.5 bg-brandGreen/10 hover:bg-brandGreen text-brandGreen hover:text-white rounded-xl text-xs font-bold transition-all inline-flex items-center space-x-1 cursor-pointer"
                            >
                              <span>View Item</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* VIEW: RESOURCE REQUESTS */}
          {activeSubTab === 'My Requests' && !loading && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div>
                <h1 className="text-2xl font-black text-navy">Resource Requests Hub</h1>
                <p className="text-xs text-gray-400 mt-1 font-semibold">Track preparation files and study guides you requested.</p>
              </div>

              <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F8F9FB] text-gray-400 font-bold uppercase border-b border-gray-100">
                        <th className="p-4 pl-6">Requested Resource</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Notes</th>
                        <th className="p-4 pr-6 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-semibold text-gray-600">
                      {requests.map((req) => (
                        <tr key={req.id} className="hover:bg-[#F8F9FB]/50 transition-colors">
                          <td className="p-4 pl-6 font-extrabold text-navy">{req.resource_title}</td>
                          <td className="p-4 uppercase text-brandGreen-dark">{req.category}</td>
                          <td className="p-4 font-normal text-gray-400 max-w-xs truncate">{req.notes || 'None'}</td>
                          <td className="p-4 pr-6 text-right">
                            <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-600 rounded-md text-[9px] uppercase font-black">
                              Pending Curation
                            </span>
                          </td>
                        </tr>
                      ))}
                      {requests.length === 0 && (
                        <tr>
                          <td colSpan="4" className="p-8 text-center text-gray-400">
                            <p className="italic mb-3">No study resources requested yet.</p>
                            <button
                              onClick={() => {
                                window.history.pushState(null, '', '/resources');
                                window.dispatchEvent(new PopStateEvent('popstate'));
                              }}
                              className="px-4 py-2 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/10 inline-flex items-center space-x-1.5 cursor-pointer"
                            >
                              <span>Explore Resources</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: EXPLORE PLACEMENTS */}
          {activeSubTab === 'Explore Placements' && !loading && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-navy">Explore Placements</h1>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">Browse active CA articleships, local inductions, and global vacancies.</p>
                </div>

                {/* Search / Filter Controls */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search company, title..."
                      value={jobSearchQuery}
                      onChange={(e) => setJobSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 text-xs border border-gray-100 bg-white rounded-xl focus:outline-none focus:border-brandGreen transition-colors w-44"
                    />
                  </div>
                  <select
                    value={jobTypeFilter}
                    onChange={(e) => setJobTypeFilter(e.target.value)}
                    className="p-2 border border-gray-100 bg-white rounded-xl text-xs font-bold text-gray-600 focus:outline-none"
                  >
                    <option value="All">All Types</option>
                    <option value="Articleship">Articleship</option>
                    <option value="Full-time">Full Time</option>
                    <option value="Overseas">Overseas Placements</option>
                  </select>
                </div>
              </div>

              {/* Placements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {normalizedJobs
                  .filter(job => {
                    const matchesSearch = job.title?.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
                      job.company?.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
                      job.location?.toLowerCase().includes(jobSearchQuery.toLowerCase());
                    const matchesFilter = jobTypeFilter === 'All' ||
                      (jobTypeFilter === 'Articleship' && job.jobType === 'Articleship') ||
                      (jobTypeFilter === 'Full-time' && job.jobType === 'Full Time') ||
                      (jobTypeFilter === 'Overseas' && job.isOverseas);
                    return matchesSearch && matchesFilter;
                  })
                  .map((job) => (
                    <div key={job.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase ${job.isOverseas ? 'bg-amber-500/10 text-amber-600' : 'bg-brandGreen/10 text-brandGreen-dark'
                            }`}>
                            {job.isOverseas ? 'Overseas' : job.jobType}
                          </span>
                          <span className="text-[11px] font-bold text-red-500 flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1" /> DL: {job.deadline}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-navy mt-3 leading-tight">{job.title}</h3>
                        <p className="text-xs font-bold text-gray-400 mt-1">{job.company}</p>
                        <div className="flex items-center text-gray-400 text-xs mt-3 space-x-2">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{job.location} • {job.level}</span>
                        </div>
                      </div>
                      <div className="mt-5 pt-3 border-t border-gray-50 flex justify-end">
                        <button
                          onClick={() => setSelectedJobDetail(job)}
                          className="px-4 py-1.5 bg-navy hover:bg-navy-light text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          View Specifications
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* VIEW: ASK COUNSELOR (Career Queries) */}
          {activeSubTab === 'Ask Counselor' && !loading && (
            <div className="space-y-8 animate-fadeIn text-left">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Ask a Question Form */}
                <div className="lg:col-span-1 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4">
                  <h3 className="text-sm font-extrabold text-navy uppercase tracking-wider flex items-center space-x-2">
                    <Mail className="w-4.5 h-4.5 text-brandGreen" />
                    <span>Ask Counseling Team</span>
                  </h3>

                  <form onSubmit={handleCreateQuery} className="space-y-4 text-xs">
                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-gray-400">Subject</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. KPMG induction timeline"
                        value={newQueryForm.subject}
                        onChange={(e) => setNewQueryForm({ ...newQueryForm, subject: e.target.value })}
                        className="p-3 border border-gray-100 bg-[#F8F9FB] rounded-xl focus:outline-none focus:border-brandGreen transition-all font-semibold text-gray-700"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-gray-400">Category</label>
                      <select
                        value={newQueryForm.category}
                        onChange={(e) => setNewQueryForm({ ...newQueryForm, category: e.target.value })}
                        className="p-3 border border-gray-100 bg-[#F8F9FB] rounded-xl focus:outline-none focus:border-brandGreen transition-all font-bold text-gray-700"
                      >
                        <option value="Career Guidance">Career Guidance</option>
                        <option value="Articleship Induction">Articleship Induction</option>
                        <option value="CV Feedback">CV & Cover Letter Review</option>
                        <option value="Exam Preparation">Exam Strategy advice</option>
                      </select>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-gray-400">Your Query Details</label>
                      <textarea
                        rows="4"
                        required
                        placeholder="Write details of your problem or guidance query here..."
                        value={newQueryForm.message}
                        onChange={(e) => setNewQueryForm({ ...newQueryForm, message: e.target.value })}
                        className="p-3 border border-gray-100 bg-[#F8F9FB] rounded-xl focus:outline-none focus:border-brandGreen transition-all font-semibold text-gray-700 leading-relaxed resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingQuery}
                      className="w-full py-3 bg-brandGreen hover:bg-brandGreen-dark text-white font-black rounded-xl shadow-md transition-all active:scale-95 text-center text-sm disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{submittingQuery ? 'Sending...' : 'Send Career Query'}</span>
                    </button>
                  </form>
                </div>

                {/* Submitted Queries Tracker List */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-navy uppercase tracking-wider">Submitted Counseling Queries</h3>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">Review the responses provided by senior counselors to your questions.</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#F8F9FB] text-gray-400 font-bold uppercase border-b border-gray-100">
                          <th className="p-3 pl-4">Topic / Subject</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Sent Date</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 pr-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-semibold text-gray-600">
                        {userQueries.map((q, idx) => {
                          const qSubject = q.subject || q.service || 'Career Inquiry';
                          const qCategory = q.category || q.level || 'General';
                          const qDate = q.created_at || q.createdAt;
                          const hasReply = q.reply || q.replyText;
                          return (
                            <tr key={q.id || q._id || idx} className="hover:bg-[#F8F9FB]/50 transition-colors">
                              <td className="p-3 pl-4 font-extrabold text-navy truncate max-w-xs">{qSubject}</td>
                              <td className="p-3 text-[10px]">{qCategory}</td>
                              <td className="p-3 font-normal text-gray-400">{qDate ? new Date(qDate).toLocaleDateString() : 'Today'}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-md text-[9px] uppercase font-black ${hasReply ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/15 text-amber-600'
                                  }`}>
                                  {hasReply ? 'Answered' : 'Pending Review'}
                                </span>
                              </td>
                              <td className="p-3 pr-4 text-right">
                                <button
                                  onClick={() => setSelectedQueryDetail(q)}
                                  className="text-[10px] text-brandGreen hover:underline font-bold cursor-pointer"
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {userQueries.length === 0 && (
                          <tr>
                            <td colSpan="5" className="p-8 text-center text-gray-400 italic">
                              You have not submitted any career queries yet. Submit your first query using the panel on the left!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          )}


          {/* VIEW: STUDY CIRCLES */}
          {activeSubTab === 'Study Circles' && !loading && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div>
                <h1 className="text-2xl font-black text-navy">WhatsApp Study Circles</h1>
                <p className="text-xs text-gray-400 mt-1 font-semibold">Join stage-specific WhatsApp discussion circles to prep alongside fellow students.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { title: 'PRC Group', sub: 'CA Entry Level', desc: 'Study discussions for entry level CA Foundation candidates.', members: '1,500+ Trainees', link: 'https://chat.whatsapp.com/example1', color: 'bg-emerald-500/10 text-emerald-600' },
                  { title: 'CAF Study Circle', sub: 'CA Intermediate', desc: 'WhatsApp support room for CA Intermediate CAF papers.', members: '3,200+ Trainees', link: 'https://chat.whatsapp.com/example2', color: 'bg-brandGreen/10 text-brandGreen-dark' },
                  { title: 'CFAP Forum', sub: 'CA Finalist Portal', desc: 'Networking room for CA Finalists & CFAP preparations.', members: '800+ Trainees', link: 'https://chat.whatsapp.com/example3', color: 'bg-purple-500/10 text-purple-600' },
                  { title: 'ACCA Stream', sub: 'Global Qualification', desc: 'Discussions about ACCA paper exam tips & placements.', members: '1,100+ Members', link: 'https://chat.whatsapp.com/example4', color: 'bg-blue-500/10 text-blue-600' }
                ].map((group, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    <div>
                      <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase ${group.color}`}>
                        {group.title}
                      </span>
                      <h4 className="font-extrabold text-navy mt-3 text-sm leading-tight">{group.sub}</h4>
                      <p className="text-xs text-gray-400 font-semibold mt-1">{group.members}</p>
                      <p className="text-[11px] text-gray-500 mt-3.5 leading-relaxed font-semibold">{group.desc}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-50 flex">
                      <a
                        href={group.link}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full text-center py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
                      >
                        Join WhatsApp Group
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: FIRM ANNOUNCEMENTS */}
          {activeSubTab === 'Firm Announcements' && !loading && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div>
                <h1 className="text-2xl font-black text-navy">Inductions & Webinars Announcements</h1>
                <p className="text-xs text-gray-400 mt-1 font-semibold">Latest updates on career fairs, Big 4 induction deadlines, and live counseling webinars.</p>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'ICAP Career Fair 2026', desc: 'Annual ICAP Career Fair will host partner firm recruiters at Lahore Expo. Don\'t miss building your resume network.', date: '20 MAY', category: 'Event', color: 'bg-blue-500/10 text-blue-600' },
                  { title: 'CA Final Preparation Webinar', desc: 'Zoom session with Omer Abid discussing best study techniques for CFAP papers preparation.', date: '24 MAY', category: 'Alert', color: 'bg-red-500/10 text-red-600' },
                  { title: 'CV & Cover Letter Workshop', desc: 'Join the physical CV review workspace to refine your application forms for summer articleships.', date: '28 MAY', category: 'General', color: 'bg-emerald-500/10 text-emerald-600' }
                ].map((ann, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex flex-col items-center justify-center flex-shrink-0 text-center p-1.5">
                      <span className="text-[10px] text-gray-400 font-extrabold leading-none uppercase">{ann.date.split(' ')[1]}</span>
                      <span className="text-lg text-navy font-black leading-none mt-1">{ann.date.split(' ')[0]}</span>
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${ann.color}`}>
                          {ann.category}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-navy text-sm leading-tight">{ann.title}</h4>
                      <p className="text-xs text-gray-500 font-semibold leading-relaxed">{ann.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: SETTINGS */}
          {activeSubTab === 'Settings' && !loading && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm max-w-2xl animate-fadeIn text-left">
              <h2 className="text-lg font-black text-navy mb-6">Profile Settings</h2>

              <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
                {/* Image Upload */}
                <div className="flex items-center space-x-5 border-b border-gray-50 pb-6">
                  <div className="relative group w-20 h-20 rounded-full bg-gradient-to-tr from-brandGreen to-emerald-400 text-white font-black flex items-center justify-center border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">{profile.full_name.charAt(0).toUpperCase()}</span>
                    )}
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                      <span className="text-[10px] text-white font-bold text-center leading-none px-1">Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-extrabold text-sm text-gray-800">Profile Image</span>
                    <span className="text-[10px] text-gray-400 mt-1 font-semibold">JPG, PNG or GIF. Max size 1MB.</span>
                    {profile.avatar_url && (
                      <button
                        type="button"
                        onClick={() => setProfile(prev => ({ ...prev, avatar_url: '' }))}
                        className="text-red-500 hover:text-red-600 font-bold mt-2 text-left self-start"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>

                {/* Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-gray-500">Full Name</label>
                      <input
                        type="text"
                        required
                        value={profile.full_name || ''}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        className="p-3 border border-gray-100 bg-[#F8F9FB] rounded-xl focus:outline-none focus:border-brandGreen focus:bg-white transition-all font-semibold text-gray-700 text-sm"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-gray-500">Username</label>
                      <input
                        type="text"
                        required
                        value={profile.username || ''}
                        onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                        className="p-3 border border-gray-100 bg-[#F8F9FB] rounded-xl focus:outline-none focus:border-brandGreen focus:bg-white transition-all font-semibold text-gray-700 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-gray-500">Education Stage / Level</label>
                      <select
                        value={profile.level || 'CAF'}
                        onChange={(e) => setProfile({ ...profile, level: e.target.value })}
                        className="p-3 border border-gray-100 bg-[#F8F9FB] rounded-xl focus:outline-none focus:border-brandGreen focus:bg-white transition-all font-bold text-gray-700 text-sm"
                      >
                        <option value="PRC">PRC (CAF Entry)</option>
                        <option value="CAF">CAF Stage (CA Inter)</option>
                        <option value="CFAP">CFAP Stage (CA Final)</option>
                        <option value="ACCA">ACCA Stream</option>
                      </select>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-gray-400">Email Address (Read-only)</label>
                      <input
                        type="email"
                        disabled
                        value={session?.user?.email || ''}
                        className="p-3 border border-gray-100 bg-gray-50 rounded-xl font-semibold text-gray-400 cursor-not-allowed text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-gray-500">Phone Number</label>
                      <input
                        type="text"
                        placeholder="e.g. 03001234567"
                        value={profile.phone || ''}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="p-3 border border-gray-100 bg-[#F8F9FB] rounded-xl focus:outline-none focus:border-brandGreen focus:bg-white transition-all font-semibold text-gray-700 text-sm"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-gray-500">City</label>
                      <select
                        value={profile.city || 'Lahore'}
                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        className="p-3 border border-gray-100 bg-[#F8F9FB] rounded-xl focus:outline-none focus:border-brandGreen focus:bg-white transition-all font-bold text-gray-700 text-sm"
                      >
                        <option value="Lahore">Lahore</option>
                        <option value="Karachi">Karachi</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Multan">Multan</option>
                        <option value="Peshawar">Peshawar</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-gray-500">Academic Institution</label>
                      <input
                        type="text"
                        placeholder="e.g. PAC, SKANS, TMUC"
                        value={profile.institution || ''}
                        onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                        className="p-3 border border-gray-100 bg-[#F8F9FB] rounded-xl focus:outline-none focus:border-brandGreen focus:bg-white transition-all font-semibold text-gray-700 text-sm"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-gray-500">CA / ACCA Papers Cleared</label>
                      <input
                        type="number"
                        min="0"
                        max="15"
                        value={profile.papers_cleared ?? 0}
                        onChange={(e) => setProfile({ ...profile, papers_cleared: parseInt(e.target.value) || 0 })}
                        className="p-3 border border-gray-100 bg-[#F8F9FB] rounded-xl focus:outline-none focus:border-brandGreen focus:bg-white transition-all font-semibold text-gray-700 text-sm"
                      />
                    </div>
                  </div>

                  <DualMediaUpload
                    type="file"
                    label="CV / Resume Document (Google Drive Link or Upload from Device)"
                    value={profile.cv_url || ''}
                    onChange={(val) => setProfile({ ...profile, cv_url: val })}
                    accept=".pdf,.doc,.docx"
                    placeholder="https://drive.google.com/your-cv-link or direct PDF URL"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-3 bg-brandGreen hover:bg-brandGreen-dark text-white font-black rounded-xl shadow-md transition-all active:scale-95 text-center text-sm disabled:opacity-50 cursor-pointer flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Job Detail Modal Popup */}
      <PortalModal isOpen={!!selectedJobDetail} onClose={() => setSelectedJobDetail(null)} maxWidth="max-w-lg" className="p-6 space-y-4">
        {selectedJobDetail && (
          <>
            <button
              onClick={() => setSelectedJobDetail(null)}
              className="absolute right-4 top-4 p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 bg-brandGreen/10 text-[9px] font-black text-brandGreen-dark rounded-md uppercase">
                {selectedJobDetail.jobType}
              </span>
              <h3 className="text-lg font-black text-navy leading-tight pt-1">{selectedJobDetail.title}</h3>
              <p className="text-xs font-bold text-brandGreen">{selectedJobDetail.company}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-[#F8F9FB] p-3 rounded-2xl text-xs font-semibold text-gray-600">
              <div>
                <span className="text-[10px] text-gray-400 block font-bold">LOCATION</span>
                <span className="text-navy">{selectedJobDetail.location}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-bold">ELIGIBILITY LEVEL</span>
                <span className="text-navy">{selectedJobDetail.level}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black text-navy uppercase tracking-wider">Role Specifications:</h4>
              <p className="text-xs text-gray-600 leading-relaxed font-semibold whitespace-pre-line">
                {selectedJobDetail.description}
              </p>
            </div>

            {selectedJobDetail.requirements && selectedJobDetail.requirements.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-navy uppercase tracking-wider">Candidate Requirements:</h4>
                <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1 font-semibold">
                  {selectedJobDetail.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs">
              <span className="text-red-500 font-extrabold">Closing Date: {selectedJobDetail.deadline}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    if (savedJobs.includes(selectedJobDetail.id)) {
                      if (onRemoveSavedJob) onRemoveSavedJob(selectedJobDetail.id);
                    } else {
                      if (onRemoveSavedJob) onRemoveSavedJob(selectedJobDetail.id);
                    }
                    setSelectedJobDetail(null);
                  }}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all cursor-pointer animate-fadeIn"
                >
                  {savedJobs.includes(selectedJobDetail.id) ? 'Saved' : 'Save Placement'}
                </button>
              </div>
            </div>
          </>
        )}
      </PortalModal>

      {/* Inquiry Detail Conversation Modal */}
      <PortalModal isOpen={!!selectedQueryDetail} onClose={() => setSelectedQueryDetail(null)} maxWidth="max-w-xl" className="p-6 space-y-6">
        {selectedQueryDetail && (
          <>
            <button
              onClick={() => setSelectedQueryDetail(null)}
              className="absolute right-4 top-4 p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="px-2 py-0.5 bg-brandGreen/10 text-brandGreen-dark text-[9px] font-black uppercase rounded-md">
                {selectedQueryDetail.category}
              </span>
              <h3 className="text-lg font-black text-navy mt-2 leading-tight">{selectedQueryDetail.subject}</h3>
              <span className="text-[10px] text-gray-400 font-semibold block mt-1">Submitted on {new Date(selectedQueryDetail.created_at).toLocaleString()}</span>
            </div>

            {/* Conversation Log */}
            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {/* User Message */}
              <div className="bg-[#F8F9FB] rounded-2xl p-4 space-y-1">
                <span className="text-[10px] text-gray-400 font-extrabold uppercase">Your Question:</span>
                <p className="text-xs text-gray-600 font-semibold leading-relaxed whitespace-pre-wrap">{selectedQueryDetail.message}</p>
              </div>

              {/* Counselor Reply */}
              {selectedQueryDetail.reply ? (
                <div className="bg-brandGreen/5 border border-brandGreen/10 rounded-2xl p-4 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-brandGreen font-black uppercase">Counselor Response:</span>
                    <span className="text-[9px] text-gray-400 font-semibold">{new Date(selectedQueryDetail.replied_at).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-navy font-bold leading-relaxed whitespace-pre-wrap">{selectedQueryDetail.reply}</p>
                  <span className="text-[9px] text-gray-400 font-semibold block">Replied by: {selectedQueryDetail.replied_by || 'Counselor Coach'}</span>
                </div>
              ) : (
                <div className="p-4 bg-amber-500/5 border border-amber-200/20 rounded-2xl text-center">
                  <p className="text-xs text-amber-600 font-extrabold animate-pulse">⏳ Counselor is currently drafting their guidance advice. Check back shortly!</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedQueryDetail(null)}
                className="px-4 py-2.5 bg-navy hover:bg-navy-light text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Close Conversation
              </button>
            </div>
          </>
        )}
      </PortalModal>

    </div>
  );
}
