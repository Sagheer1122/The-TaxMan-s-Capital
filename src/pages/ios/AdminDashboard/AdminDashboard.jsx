import { useState, useEffect } from 'react';
import { useBodyScrollLock } from '../../../hooks/useBodyScrollLock';
import PortalModal from '../../../components/PortalModal';
import {
  Briefcase,
  Calendar,
  Users,
  AlertTriangle,
  Bell,
  User,
  MapPin,
  Send,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  MessageSquare,
  Clock,
  FileText,
  Globe,
  Search,
  LogOut,
  Trash2,
  Edit,
  Plus,
  Filter,
  Sliders,
  ExternalLink,
  Tv,
  BookOpen,
  Eye,
  EyeOff,
  Ban,
  CheckCircle,
  LayoutList,
  LayoutGrid,
  CheckCheck
} from 'lucide-react';
import logoImg from '../../../assets/logo.png';
import AdminPagination from '../../../components/common/AdminPagination';
import {
  getAllUsers,
  createAdminUser,
  updateUserRole,
  updateAdminUser,
  toggleUserStatus,
  deleteUser,
  createAdminJob,
  updateAdminJob,
  deleteAdminJob,
  getAllAdminJobs,
  createAdminResource,
  updateAdminResource,
  deleteAdminResource,
  approveAdminResource,
  rejectAdminResource,
  getAllAdminResources,
  createAdminAnnouncement,
  updateAdminAnnouncement,
  deleteAdminAnnouncement,
  getAllAdminAnnouncements,
  getInquiries,
  replyToInquiry,
  deleteInquiry
} from '../../../services/adminService';
import { fetchBlogs, createBlog, updateBlog, deleteBlog } from '../../../services/blogService';
import RichBlogEditor from '../../../components/blog/RichBlogEditor';
import DualMediaUpload from '../../../components/common/DualMediaUpload';
import { updateProfile } from '../../../services/authService';

const updateProfileRole = updateUserRole;
const replyToMessage = replyToInquiry;

const loadLocalStorageTable = (tableName, defaults) => {
  try {
    const stored = localStorage.getItem(`admin_table_${tableName}`);
    return stored ? JSON.parse(stored) : defaults;
  } catch {
    return defaults;
  }
};

const saveLocalStorageTable = (tableName, data) => {
  try {
    localStorage.setItem(`admin_table_${tableName}`, JSON.stringify(data));
  } catch (err) {
    console.warn('Storage save error:', err);
  }
};

export default function AdminDashboard({
  onLogout,
  currentAdminName = "Ahmad Raza",
  session,
  onProfileUpdate,
  onNavigateHome,
  isModerator = false,
  initialSubTab = 'Dashboard'
}) {
  const effectiveIsModerator = Boolean(isModerator || session?.user?.role === 'moderator');
  // State for Navigation
  const [activeSubTab, setActiveSubTab] = useState(() => (effectiveIsModerator && initialSubTab === 'Users List' ? 'Dashboard' : initialSubTab));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  // Reply States for student counseling connection
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedMessageForReply, setSelectedMessageForReply] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Profile Edit States
  const [adminProfile, setAdminProfile] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('taxman_user') || '{}');
      const s = JSON.parse(localStorage.getItem('taxman_session') || '{}');
      const user = session?.user || (u.email ? u : s.user) || {};
      const fallbackName = user.full_name || user.name || currentAdminName;
      return {
        full_name: fallbackName,
        username: user.username || fallbackName.toLowerCase().replace(/\s+/g, ''),
        avatar_url: user.avatar_url || user.profileImage || u.avatar_url || u.profileImage || ''
      };
    } catch {
      return {
        full_name: currentAdminName,
        username: currentAdminName.toLowerCase().replace(/\s+/g, ''),
        avatar_url: ''
      };
    }
  });

  // Sync profile when session updates
  useEffect(() => {
    const user = session?.user;
    if (user) {
      setAdminProfile(prev => ({
        ...prev,
        full_name: user.full_name || user.name || prev.full_name,
        username: user.username || prev.username,
        avatar_url: user.avatar_url || user.profileImage || prev.avatar_url || ''
      }));
    }
  }, [session]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const [adminReadIds, setAdminReadIds] = useState(() => {
    try {
      const stored = localStorage.getItem('thetaxman_admin_read_notifs');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [headerDropdownOpen, setHeaderDropdownOpen] = useState(false);

  // Database Data States
  const [profiles, setProfiles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [resources, setResources] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [messages, setMessages] = useState([]);
  const [requests, setRequests] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search & Filter States
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [userStatusFilter, setUserStatusFilter] = useState('All');
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [userEditForm, setUserEditForm] = useState({
    id: '',
    full_name: '',
    username: '',
    email: '',
    avatar_url: '',
    role: 'student',
    level: 'CAF',
    isActive: true
  });

  const resolveUserAvatar = (user) => {
    if (!user) return '';
    if (user.avatar_url) return user.avatar_url;
    if (user.profileImage) return user.profileImage;
    if (user.avatar) return user.avatar;
    if (user.picture) return user.picture;
    try {
      if (user.email) {
        const emailLower = user.email.toLowerCase();
        if (session?.user?.email?.toLowerCase() === emailLower && (session.user.avatar_url || session.user.profileImage)) {
          return session.user.avatar_url || session.user.profileImage;
        }
        const regUsers = JSON.parse(localStorage.getItem('taxman_registered_users') || '[]');
        const matchedReg = regUsers.find(r => r.email?.toLowerCase() === emailLower);
        if (matchedReg?.avatar_url || matchedReg?.profileImage) {
          return matchedReg.avatar_url || matchedReg.profileImage;
        }
        const localUser = JSON.parse(localStorage.getItem('taxman_user') || '{}');
        if (localUser.email?.toLowerCase() === emailLower && (localUser.avatar_url || localUser.profileImage)) {
          return localUser.avatar_url || localUser.profileImage;
        }
      }
    } catch {}
    return '';
  };
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    role: 'student',
    level: 'CAF',
    isActive: true
  });
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [jobSearch, setJobSearch] = useState('');
  const [announcementSearch, setAnnouncementSearch] = useState('');
  const [resourceSearch, setResourceSearch] = useState('');
  const [messageSearch, setMessageSearch] = useState('');

  const ITEMS_PER_PAGE = 15;

  // View Mode states ('list' | 'grid')
  const [userViewMode, setUserViewMode] = useState('list');
  const [pakistanJobViewMode, setPakistanJobViewMode] = useState('list');
  const [inductionJobViewMode, setInductionJobViewMode] = useState('list');
  const [overseasJobViewMode, setOverseasJobViewMode] = useState('list');
  const [resourceViewMode, setResourceViewMode] = useState('list');
  const [announcementViewMode, setAnnouncementViewMode] = useState('list');
  const [blogViewMode, setBlogViewMode] = useState('list');
  const [messageViewMode, setMessageViewMode] = useState('list');
  const [videoViewMode, setVideoViewMode] = useState('grid');
  const [careerSupportViewMode, setCareerSupportViewMode] = useState('list');
  const [communityViewMode, setCommunityViewMode] = useState('grid');

  // Pagination states (current page)
  const [userPage, setUserPage] = useState(1);
  const [pakistanJobPage, setPakistanJobPage] = useState(1);
  const [inductionJobPage, setInductionJobPage] = useState(1);
  const [overseasJobPage, setOverseasJobPage] = useState(1);
  const [resourcePage, setResourcePage] = useState(1);
  const [announcementPage, setAnnouncementPage] = useState(1);
  const [blogPage, setBlogPage] = useState(1);
  const [messagePage, setMessagePage] = useState(1);
  const [videoPage, setVideoPage] = useState(1);
  const [careerSupportPage, setCareerSupportPage] = useState(1);
  const [communityPage, setCommunityPage] = useState(1);

  // Auto-reset page when search or filters change
  useEffect(() => { setUserPage(1); }, [userSearch, userRoleFilter, userStatusFilter]);
  useEffect(() => { setPakistanJobPage(1); setInductionJobPage(1); setOverseasJobPage(1); }, [jobSearch]);
  useEffect(() => { setResourcePage(1); }, [resourceSearch]);
  useEffect(() => { setAnnouncementPage(1); }, [announcementSearch]);
  useEffect(() => { setMessagePage(1); }, [messageSearch]);

  const renderViewToggle = (mode, setMode) => (
    <div className="flex items-center bg-[#F8F9FB] p-1 border border-gray-100 rounded-xl space-x-0.5 flex-shrink-0">
      <button
        type="button"
        onClick={() => setMode('list')}
        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
          mode === 'list'
            ? 'bg-white text-brandGreen shadow-xs font-black'
            : 'text-gray-400 hover:text-gray-600'
        }`}
        title="Table List View"
      >
        <LayoutList className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">List</span>
      </button>
      <button
        type="button"
        onClick={() => setMode('grid')}
        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
          mode === 'grid'
            ? 'bg-white text-brandGreen shadow-xs font-black'
            : 'text-gray-400 hover:text-gray-600'
        }`}
        title="Cards Grid View"
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Grid</span>
      </button>
    </div>
  );

  // CRUD Modals state

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobForm, setJobForm] = useState({
    company: '', title: '', location: '', country: 'Pakistan', level: '', job_type: 'Articleship',
    workMode: 'On-site', deadline: '', description: '', requirements: '', is_overseas: false
  });

  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resourceForm, setResourceForm] = useState({
    title: '', description: '', category: 'CAF', type: 'PDF',
    downloads: 0, tag: '', tag_color: 'bg-blue-500/10 text-blue-600',
    btn_color: 'bg-blue-600 hover:bg-blue-700', download_url: '', is_featured: false
  });

  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '', summary: '', content: '', category: 'General', event_date: ''
  });

  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [communityForm, setCommunityForm] = useState({
    title: '', category_key: 'caf', badge: 'CAF Group', description: '',
    members_count_text: '1,000+ Members', whatsapp_link: '', discord_link: ''
  });

  const [blogs, setBlogs] = useState([]);
  const [blogSearch, setBlogSearch] = useState('');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('All');
  useEffect(() => { setBlogPage(1); }, [blogSearch, blogCategoryFilter]);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Big 4 & Inductions',
    authorName: 'Saboor Ahmad CA',
    authorRole: 'Founder & Lead Career Mentor',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    summary: '',
    content: '',
    tags: '',
    readTime: '5 min read',
    isFeatured: false,
    status: 'published'
  });

  // Mock Fallbacks for testing & development
  const mockProfiles = [
    { id: '1', full_name: 'Saboor Ahmad CA', username: 'admin', email: 'admin@taxmancapital.com', role: 'team_head', level: 'Qualified', created_at: '2026-05-01' },
    { id: '2', full_name: 'Sagheer Ahmad', username: 'sagheer_caf', email: 'sagheerahmad5767@gmail.com', role: 'student', level: 'CAF', created_at: '2026-09-04' },
    { id: '3', full_name: 'Muhammad Ahmed', username: 'ahmed_caf', email: 'student@taxmancapital.com', role: 'student', level: 'CAF', created_at: '2026-06-12' },
    { id: '4', full_name: 'Usman Saleem', username: 'usman_audit', email: 'mentor@taxmancapital.com', role: 'mentor', level: 'Qualified', created_at: '2026-06-18' },
    { id: '5', full_name: 'Fatima Noor', username: 'fatima_cfap', email: 'fatima.noor@gmail.com', role: 'student', level: 'CFAP', created_at: '2026-07-02' }
  ];

  const mockJobs = [
    { id: '1', company: 'KPMG Taseer Hadi', title: 'Audit Trainee (Articleship)', location: 'Lahore', level: 'CA CAF Qualified', job_type: 'Articleship', deadline: '31 May 2026', description: 'KPMG is hiring CA candidates for trainee inductions.', requirements: ['CA CAF Qualified', 'Good analytical skills'], is_overseas: false },
    { id: '2', company: 'EY Ford Rhodes', title: 'Tax Consultant', location: 'Karachi', level: 'ACCA Member', job_type: 'Full-time', deadline: '15 June 2026', description: 'EY is hiring Tax professionals.', requirements: ['ACCA Qualified', '1 year tax experience'], is_overseas: false },
    { id: '3', company: 'PwC Middle East', title: 'Audit Senior', location: 'Dubai, UAE', level: 'CA Qualified / ACCA Member', job_type: 'Full-time', deadline: '10 July 2026', description: 'Overseas placements at PwC Dubai offices.', requirements: ['CA Qualified', 'Strong communication'], is_overseas: true }
  ];

  const mockResources = [
    { id: '1', title: 'CAF-5 Audit Revision Notes', description: 'Comprehensive audit notes.', category: 'CAF', downloads: 124, type: 'PDF', tag: 'Audit', tag_color: 'bg-emerald-500/10 text-emerald-600', download_url: '#' },
    { id: '2', title: 'CV Template for Big 4 Firms', description: 'Standard professional template.', category: 'Training/Induction', downloads: 412, type: 'DOCX', tag: 'CV', tag_color: 'bg-brandGreen/10 text-brandGreen-dark', download_url: '#' },
    { id: '3', title: 'ACCA SBL Exam Pack', description: 'Study resources.', category: 'ACCA', downloads: 88, type: 'ZIP', tag: 'SBL', tag_color: 'bg-purple-500/10 text-purple-600', download_url: '#' }
  ];

  const mockAnnouncements = [
    { id: '1', title: 'ICAP Career Fair 2026', summary: 'Annual Career fair at Lahore Expo.', content: 'Full details of career fair...', category: 'Event', event_date: '20 MAY' },
    { id: '2', title: 'CA Final Preparation Webinar', summary: 'Zoom session with Omer Abid.', content: 'Join live to learn CA secrets...', category: 'Alert', event_date: '24 MAY' },
    { id: '3', title: 'CV & Cover Letter Workshop', summary: 'Physical workshop at Lahore Office.', content: 'Interactive CV checking session...', category: 'General', event_date: '28 MAY' }
  ];

  const mockMessages = [];

  const mockRequests = [];

  const mockCommunities = [
    { id: '1', title: 'CA Foundation Study Group', category_key: 'prc', badge: 'PRC Group', description: 'WhatsApp channel for entry level CA students.', members_count_text: '1,500+ Members', whatsapp_link: 'https://chat.whatsapp.com/example1' },
    { id: '2', title: 'CAF Intermediate Forum', category_key: 'caf', badge: 'CAF Group', description: 'WhatsApp study room for CA Intermediate students.', members_count_text: '3,200+ Members', whatsapp_link: 'https://chat.whatsapp.com/example2' },
    { id: '3', title: 'Overseas Jobs Network', category_key: 'cfap', badge: 'CFAP Group', description: 'Trainees network discussing international opportunities.', members_count_text: '800+ Members', whatsapp_link: 'https://chat.whatsapp.com/example3' }
  ];

  const mockVideos = [
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
      type: 'Inductions & Guidance',
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
      type: 'Inductions & Guidance',
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
    }
  ];

  const [videos, setVideos] = useState(() => {
    return loadLocalStorageTable('taxman_podcasts_data', mockVideos);
  });

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoSearch, setVideoSearch] = useState('');
  const [videoCategoryFilter, setVideoCategoryFilter] = useState('All');
  useEffect(() => { setVideoPage(1); }, [videoSearch, videoCategoryFilter]);
  const [videoForm, setVideoForm] = useState({
    title: '',
    youtubeId: '',
    guest: 'Saboor Ahmad CA',
    role: 'Founder & Lead Mentor @ The TaxMan\'s Capital',
    type: 'Inductions & Guidance',
    duration: '30:00',
    date: 'July 2026',
    views: '1.5K',
    likes: '200',
    desc: '',
    thumbnail: '',
    qualification: 'CA',
    isFeatured: false
  });

  const parseYoutubeId = (urlOrId) => {
    if (!urlOrId) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlOrId.match(regExp);
    return (match && match[2].length === 11) ? match[2] : urlOrId.trim();
  };

  const handleSaveVideo = (e) => {
    e?.preventDefault();
    const yId = parseYoutubeId(videoForm.youtubeId);
    const autoThumb = videoForm.thumbnail || (yId ? `https://img.youtube.com/vi/${yId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80');

    let updated;
    if (selectedVideo) {
      updated = videos.map(v => v.id === selectedVideo.id ? { ...v, ...videoForm, youtubeId: yId, thumbnail: autoThumb } : v);
    } else {
      const newVideo = {
        ...videoForm,
        id: `ep-${Date.now()}`,
        youtubeId: yId,
        thumbnail: autoThumb,
        date: videoForm.date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      };
      updated = [newVideo, ...videos];
    }

    if (videoForm.isFeatured) {
      const activeId = selectedVideo ? selectedVideo.id : updated[0].id;
      updated = updated.map(v => ({ ...v, isFeatured: v.id === activeId }));
    }

    setVideos(updated);
    saveLocalStorageTable('taxman_podcasts_data', updated);
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
  };

  const handleDeleteVideo = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Video & Podcast',
      message: 'Are you sure you want to remove this video from the public media library?',
      onConfirm: () => {
        const updated = videos.filter(v => v.id !== id);
        setVideos(updated);
        saveLocalStorageTable('taxman_podcasts_data', updated);
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
      }
    });
  };

  const handleToggleFeaturedVideo = (id) => {
    const updated = videos.map(v => ({ ...v, isFeatured: v.id === id }));
    setVideos(updated);
    saveLocalStorageTable('taxman_podcasts_data', updated);
  };

  // Load Data via Admin Service API & Local Storage
  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedUsers, fetchedInquiries, fetchedJobs, fetchedResources, fetchedAnnouncements, fetchedBlogs] = await Promise.all([
        effectiveIsModerator ? Promise.resolve(null) : getAllUsers().catch(() => null),
        getInquiries().catch(() => null),
        getAllAdminJobs().catch(() => null),
        getAllAdminResources().catch(() => null),
        getAllAdminAnnouncements().catch(() => null),
        fetchBlogs({ status: 'All' }).catch(() => null)
      ]);

      if (fetchedBlogs && Array.isArray(fetchedBlogs)) {
        setBlogs(fetchedBlogs);
      }

      const activeAdminEmail = session?.user?.email || (() => {
        try {
          const u = JSON.parse(localStorage.getItem('taxman_user') || '{}');
          if (u.email) return u.email;
          const s = JSON.parse(localStorage.getItem('taxman_session') || '{}');
          if (s.user?.email) return s.user.email;
        } catch {}
        return 'admin@taxmancapital.com';
      })();
      const activeAdminName = session?.user?.name || currentAdminName || 'Saboor Ahmad CA';
      const activeAdminRole = session?.user?.role || (effectiveIsModerator ? 'moderator' : 'team_head');

      if (effectiveIsModerator) {
        setProfiles([]);
      } else if (fetchedUsers && fetchedUsers.length > 0) {
        let mappedUsers = fetchedUsers.map(u => ({
          id: u._id || u.id,
          full_name: u.name || u.fullName || u.full_name,
          username: u.username || u.email?.split('@')[0],
          email: u.email,
          avatar_url: u.avatar_url || u.profileImage || u.avatar || u.picture || resolveUserAvatar(u) || '',
          role: u.role || 'student',
          level: u.level || u.qualification || 'CAF',
          isActive: u.isActive !== false,
          created_at: u.createdAt || u.created_at || new Date().toISOString()
        }));

        if (activeAdminEmail && !mappedUsers.some(u => u.email?.toLowerCase() === activeAdminEmail.toLowerCase())) {
          mappedUsers.unshift({
            id: session?.user?.id || 'admin_head',
            full_name: activeAdminName,
            username: activeAdminEmail.split('@')[0],
            email: activeAdminEmail,
            avatar_url: session?.user?.avatar_url || session?.user?.profileImage || adminProfile?.avatar_url || '',
            role: activeAdminRole,
            level: 'Qualified',
            isActive: true,
            created_at: new Date().toISOString()
          });
        }

        setProfiles(mappedUsers);
        saveLocalStorageTable('profiles', mappedUsers);
      } else {
        const local = loadLocalStorageTable('profiles', mockProfiles);
        let resolved = (local && local.length > 1) ? local : mockProfiles;
        resolved = resolved.map(p => ({
          ...p,
          avatar_url: p.avatar_url || p.profileImage || resolveUserAvatar(p) || ''
        }));
        if (activeAdminEmail && !resolved.some(u => u.email?.toLowerCase() === activeAdminEmail.toLowerCase())) {
          resolved = [{
            id: session?.user?.id || 'admin_head',
            full_name: activeAdminName,
            username: activeAdminEmail.split('@')[0],
            email: activeAdminEmail,
            avatar_url: session?.user?.avatar_url || session?.user?.profileImage || adminProfile?.avatar_url || '',
            role: activeAdminRole,
            level: 'Qualified',
            isActive: true,
            created_at: new Date().toISOString()
          }, ...resolved];
        }
        setProfiles(resolved);
      }

      const localMessages = loadLocalStorageTable('contact_messages', []);
      let allInquiries = [];
      if (fetchedInquiries && fetchedInquiries.length > 0) {
        allInquiries = [...fetchedInquiries];
        localMessages.forEach(lm => {
          if (!allInquiries.some(fi => (fi._id || fi.id) === (lm._id || lm.id) || (fi.email === lm.email && (fi.subject === lm.subject || fi.service === lm.service)))) {
            allInquiries.push(lm);
          }
        });
      } else {
        allInquiries = localMessages.length > 0 ? localMessages : mockMessages;
      }

      setMessages(allInquiries.map(inq => ({
        id: inq._id || inq.id,
        _id: inq._id || inq.id,
        name: inq.name,
        email: inq.email,
        phone: inq.phone || '',
        subject: inq.subject || inq.service || 'Event Registration / Inquiry',
        category: inq.category || inq.level || 'Event Registration',
        message: inq.message || inq.questions || '',
        reply: inq.replyText || inq.reply || '',
        status: inq.status || 'pending',
        created_at: inq.createdAt || inq.created_at || new Date().toISOString()
      })));

      if (fetchedJobs && fetchedJobs.length > 0) {
        setJobs(fetchedJobs.map(j => ({
          id: j._id || j.id,
          _id: j._id || j.id,
          company: j.company,
          title: j.title,
          location: j.location,
          level: j.level || 'CAF',
          job_type: j.jobType || j.job_type || 'Articleship',
          deadline: j.deadline || '',
          description: j.description || '',
          requirements: Array.isArray(j.requirements) ? j.requirements.join(', ') : (j.requirements || ''),
          is_overseas: !!(j.isOverseas || j.is_overseas),
          created_at: j.createdAt || new Date().toISOString()
        })));
      } else {
        setJobs(loadLocalStorageTable('jobs', mockJobs));
      }

      if (fetchedResources && fetchedResources.length > 0) {
        setResources(fetchedResources.map(r => ({
          id: r._id || r.id,
          _id: r._id || r.id,
          title: r.title,
          description: r.description || r.desc || '',
          category: r.category || 'CAF',
          type: r.type || 'PDF',
          downloads: r.downloads || 0,
          tag: r.tag || r.category || 'Study Resource',
          tag_color: r.tag_color || 'bg-blue-500/10 text-blue-600',
          btn_color: r.btn_color || 'bg-brandGreen hover:bg-brandGreen-dark',
          download_url: r.download_url || '',
          is_featured: !!(r.is_featured || r.isFeatured)
        })));
      } else {
        setResources(loadLocalStorageTable('resources', mockResources));
      }

      if (fetchedAnnouncements && fetchedAnnouncements.length > 0) {
        setAnnouncements(fetchedAnnouncements.map(a => ({
          id: a._id || a.id,
          _id: a._id || a.id,
          title: a.title,
          summary: a.summary || a.content || '',
          content: a.content || a.summary || '',
          category: a.category || 'General',
          event_date: a.event_date || a.createdAt ? new Date(a.createdAt).toISOString().split('T')[0] : '',
          created_at: a.createdAt || new Date().toISOString()
        })));
      } else {
        setAnnouncements(loadLocalStorageTable('announcements', mockAnnouncements));
      }

      setRequests(loadLocalStorageTable('resource_requests', mockRequests));
      setCommunities(loadLocalStorageTable('communities', mockCommunities));
    } catch (err) {
      console.warn('Error loading admin dashboard data:', err);
      setProfiles(loadLocalStorageTable('profiles', mockProfiles));
      setJobs(loadLocalStorageTable('jobs', mockJobs));
      setResources(loadLocalStorageTable('resources', mockResources));
      setAnnouncements(loadLocalStorageTable('announcements', mockAnnouncements));
      setMessages(loadLocalStorageTable('contact_messages', mockMessages));
      setRequests(loadLocalStorageTable('resource_requests', mockRequests));
      setCommunities(loadLocalStorageTable('communities', mockCommunities));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const run = async () => {
      await Promise.resolve();
      loadData();
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // CRUD Actions - Profiles / Users
  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      if (newRole === 'team_head') {
        const currentTeamHead = profiles.find(p => p.role === 'team_head');
        if (currentTeamHead) {
          await updateProfileRole(currentTeamHead.id, 'admin');
        }
      }

      await updateProfileRole(userId, newRole);

      setProfiles(prev => {
        let updated = prev.map(p => p.id === userId ? { ...p, role: newRole } : p);
        if (newRole === 'team_head') {
          updated = updated.map(p => p.id !== userId && p.role === 'team_head' ? { ...p, role: 'admin' } : p);
        }
        saveLocalStorageTable('profiles', updated);
        return updated;
      });
      alert(`User role updated to ${newRole}`);
    } catch (err) {
      alert(`Error updating role: ${err.message}`);
    }
  };

  const handleCreateNewUser = async (e) => {
    e?.preventDefault();
    if (!addUserForm.email || !addUserForm.password || !addUserForm.full_name) {
      alert('Please fill in Name, Email and Password.');
      return;
    }
    setIsAddingUser(true);
    try {
      const created = await createAdminUser({
        name: addUserForm.full_name.trim(),
        fullName: addUserForm.full_name.trim(),
        username: (addUserForm.username || addUserForm.email.split('@')[0]).trim(),
        email: addUserForm.email.trim(),
        password: addUserForm.password,
        role: addUserForm.role,
        level: addUserForm.level,
        qualification: addUserForm.level,
        isActive: addUserForm.isActive
      });

      const newUserObj = {
        id: created?._id || created?.id || ('usr_' + Date.now()),
        full_name: created?.name || created?.fullName || addUserForm.full_name.trim(),
        username: created?.username || addUserForm.username || addUserForm.email.split('@')[0],
        email: created?.email || addUserForm.email.trim(),
        role: created?.role || addUserForm.role,
        level: created?.level || created?.qualification || addUserForm.level,
        isActive: created?.isActive !== undefined ? created.isActive : addUserForm.isActive,
        created_at: created?.createdAt || new Date().toISOString()
      };

      setProfiles(prev => {
        const updated = [newUserObj, ...prev.filter(p => p.email?.toLowerCase() !== newUserObj.email.toLowerCase())];
        saveLocalStorageTable('profiles', updated);
        return updated;
      });

      alert('User account created successfully!');
      setIsAddUserModalOpen(false);
      setAddUserForm({
        full_name: '',
        username: '',
        email: '',
        password: '',
        role: 'student',
        level: 'CAF',
        isActive: true
      });
    } catch (err) {
      alert(`Failed to create user: ${err.message}`);
    } finally {
      setIsAddingUser(false);
    }
  };

  const handleOpenEditUser = (user) => {
    setSelectedUserForEdit(user);
    setUserEditForm({
      id: user.id || user._id,
      full_name: user.full_name || user.name || '',
      username: user.username || '',
      email: user.email || '',
      avatar_url: resolveUserAvatar(user) || '',
      role: user.role || 'student',
      level: user.level || user.qualification || 'CAF',
      isActive: user.isActive !== false
    });
    setIsEditUserModalOpen(true);
  };

  const handleSaveUserEdit = async (e) => {
    e?.preventDefault();
    if (!userEditForm.id) return;
    setIsSavingUser(true);
    try {
      await updateAdminUser(userEditForm.id, {
        name: userEditForm.full_name,
        fullName: userEditForm.full_name,
        email: userEditForm.email,
        username: userEditForm.username,
        role: userEditForm.role,
        level: userEditForm.level,
        qualification: userEditForm.level,
        isActive: userEditForm.isActive,
        avatar_url: userEditForm.avatar_url,
        profileImage: userEditForm.avatar_url
      });

      setProfiles(prev => {
        const updated = prev.map(p => (p.id === userEditForm.id || p._id === userEditForm.id) ? {
          ...p,
          ...userEditForm,
          full_name: userEditForm.full_name,
          level: userEditForm.level,
          isActive: userEditForm.isActive,
          avatar_url: userEditForm.avatar_url,
          profileImage: userEditForm.avatar_url
        } : p);
        saveLocalStorageTable('profiles', updated);
        return updated;
      });

      setIsEditUserModalOpen(false);
      setSelectedUserForEdit(null);
      alert('User details updated successfully!');
    } catch (err) {
      alert(`Failed to update user: ${err.message}`);
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleToggleBlockUser = (userId, currentIsActive) => {
    const nextStatus = !currentIsActive;
    const actionWord = nextStatus ? 'Unblock & Activate' : 'Block & Suspend';
    setConfirmModal({
      isOpen: true,
      title: `${actionWord} User Account`,
      message: `Are you sure you want to ${nextStatus ? 'unblock and reactivate access for' : 'block and suspend access for'} this user?`,
      onConfirm: async () => {
        try {
          await toggleUserStatus(userId, nextStatus);
          setProfiles(prev => {
            const updated = prev.map(p => (p.id === userId || p._id === userId) ? { ...p, isActive: nextStatus } : p);
            saveLocalStorageTable('profiles', updated);
            return updated;
          });
          alert(`User has been ${nextStatus ? 'unblocked and activated' : 'blocked and suspended'}.`);
        } catch (err) {
          alert(`Error updating user status: ${err.message}`);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDeleteProfile = (userId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete User Profile',
      message: 'Are you sure you want to delete this user profile? This action is permanent.',
      onConfirm: async () => {
        try {
          await deleteUser(userId);
          setProfiles(prev => {
            const updated = prev.filter(p => p.id !== userId && p._id !== userId);
            saveLocalStorageTable('profiles', updated);
            return updated;
          });
          alert("User profile deleted.");
        } catch (err) {
          alert(`Error deleting user: ${err.message}`);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // CRUD Actions - Jobs
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      const requirementsArray = jobForm.requirements
        ? (Array.isArray(jobForm.requirements) ? jobForm.requirements : jobForm.requirements.split(',').map(r => r.trim()).filter(Boolean))
        : [];

      const jobPayload = {
        ...jobForm,
        requirements: requirementsArray
      };

      if (selectedJob) {
        await updateAdminJob(selectedJob._id || selectedJob.id, jobPayload);
      } else {
        await createAdminJob(jobPayload);
      }

      alert(selectedJob ? "Job opportunity updated in database!" : "Job opportunity posted successfully!");
      setIsJobModalOpen(false);
      setSelectedJob(null);
      setJobForm({ company: '', title: '', location: '', country: 'Pakistan', level: '', job_type: 'Articleship', workMode: 'On-site', deadline: '', description: '', requirements: '', is_overseas: false });
      await loadData();
    } catch (err) {
      alert(`Error saving job: ${err.message}`);
    }
  };

  const handleDeleteJob = (jobId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Job Posting',
      message: 'Are you sure you want to delete this job placement opportunity?',
      onConfirm: async () => {
        try {
          await deleteAdminJob(jobId);
          setJobs(prev => prev.filter(j => (j._id || j.id) !== jobId));
          alert("Job posting deleted from database.");
          await loadData();
        } catch (err) {
          alert(`Error deleting job: ${err.message}`);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // CRUD Actions - Resources
  const handleResourceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedResource) {
        await updateAdminResource(selectedResource._id || selectedResource.id, resourceForm);
        alert("Resource updated in database!");
      } else {
        await createAdminResource(resourceForm);
        alert("Resource submitted for AI review.");
      }

      setIsResourceModalOpen(false);
      setSelectedResource(null);
      setResourceForm({
        title: '', description: '', category: 'CAF', type: 'PDF',
        downloads: 0, tag: '', tag_color: 'bg-blue-500/10 text-blue-600',
        btn_color: 'bg-blue-600 hover:bg-blue-700', download_url: '', is_featured: false
      });
      await loadData();
    } catch (err) {
      alert(`Error saving resource: ${err.message}`);
    }
  };

  const handleApproveResourceDirect = async (resId) => {
    try {
      await approveAdminResource(resId);
      alert("Resource approved and published!");
      await loadData();
    } catch (err) {
      alert(`Error approving resource: ${err.message}`);
    }
  };

  const handleRejectResourceDirect = async (resId) => {
    const reason = prompt("Enter rejection reason:", "Does not meet quality standards");
    if (!reason) return;
    try {
      await rejectAdminResource(resId, reason);
      alert("Resource rejected.");
      await loadData();
    } catch (err) {
      alert(`Error rejecting resource: ${err.message}`);
    }
  };

  const handleDeleteResource = (resId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Study Resource',
      message: 'Are you sure you want to delete this resource file from the portal?',
      onConfirm: async () => {
        try {
          await deleteAdminResource(resId);
          setResources(prev => prev.filter(r => (r._id || r.id) !== resId));
          alert("Resource deleted from database.");
          await loadData();
        } catch (err) {
          alert(`Error deleting resource: ${err.message}`);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // CRUD Actions - Announcements
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedAnnouncement) {
        await updateAdminAnnouncement(selectedAnnouncement._id || selectedAnnouncement.id, announcementForm);
      } else {
        await createAdminAnnouncement(announcementForm);
      }

      alert(selectedAnnouncement ? "Announcement updated in database!" : "Announcement published successfully!");
      setIsAnnouncementModalOpen(false);
      setSelectedAnnouncement(null);
      setAnnouncementForm({ title: '', summary: '', content: '', category: 'General', event_date: '' });
      await loadData();
    } catch (err) {
      alert(`Error saving announcement: ${err.message}`);
    }
  };

  const handleDeleteAnnouncement = (annId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Announcement',
      message: 'Are you sure you want to delete this announcement notice?',
      onConfirm: async () => {
        try {
          await deleteAdminAnnouncement(annId);
          setAnnouncements(prev => prev.filter(a => (a._id || a.id) !== annId));
          alert("Announcement deleted from database.");
          await loadData();
        } catch (err) {
          alert(`Error deleting announcement: ${err.message}`);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // CRUD Actions - Blog Articles
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      const blogPayload = {
        title: blogForm.title,
        category: blogForm.category,
        summary: blogForm.summary,
        content: blogForm.content,
        coverImage: blogForm.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
        readTime: blogForm.readTime || '5 min read',
        isFeatured: Boolean(blogForm.isFeatured),
        status: blogForm.status || 'published',
        tags: typeof blogForm.tags === 'string' ? blogForm.tags.split(',').map(t => t.trim()).filter(Boolean) : (blogForm.tags || []),
        author: {
          name: blogForm.authorName || 'Saboor Ahmad CA',
          role: blogForm.authorRole || 'Founder & Lead Career Mentor',
          avatar: ''
        }
      };

      if (selectedBlog) {
        await updateBlog(selectedBlog._id || selectedBlog.id, blogPayload);
        alert("Blog article updated successfully!");
      } else {
        await createBlog(blogPayload);
        alert("New blog article published successfully!");
      }

      setIsBlogModalOpen(false);
      setSelectedBlog(null);
      setBlogForm({
        title: '',
        category: 'Big 4 & Inductions',
        authorName: 'Saboor Ahmad CA',
        authorRole: 'Founder & Lead Career Mentor',
        coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
        summary: '',
        content: '',
        tags: '',
        readTime: '5 min read',
        isFeatured: false,
        status: 'published'
      });
      const reloaded = await fetchBlogs({ status: 'All' });
      setBlogs(reloaded || []);
    } catch (err) {
      alert(`Error saving blog article: ${err.message}`);
    }
  };

  const handleDeleteBlog = (blogId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Blog Article',
      message: 'Are you sure you want to permanently delete this blog article?',
      onConfirm: async () => {
        try {
          await deleteBlog(blogId);
          setBlogs(prev => prev.filter(b => (b._id !== blogId && b.id !== blogId)));
          alert("Blog article deleted.");
        } catch (err) {
          alert(`Error deleting blog: ${err.message}`);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleToggleBlogPublish = async (blog) => {
    try {
      const newStatus = blog.status === 'published' ? 'draft' : 'published';
      await updateBlog(blog._id || blog.id, { status: newStatus });
      setBlogs(prev => prev.map(b => (b._id === blog._id || b.id === blog.id) ? { ...b, status: newStatus } : b));
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  // CRUD Actions - Communities
  const handleCommunitySubmit = async (e) => {
    e.preventDefault();
    try {
      const commPayload = {
        ...communityForm,
        badge: `${communityForm.category_key.toUpperCase()} Group`
      };

      if (selectedCommunity) {
        setCommunities(prev => prev.map(c => c.id === selectedCommunity.id ? { ...c, ...commPayload } : c));
      } else {
        setCommunities(prev => [{ id: String(Date.now()), ...commPayload }, ...prev]);
      }

      alert(selectedCommunity ? "Community study room updated!" : "Community study room published!");
      setIsCommunityModalOpen(false);
      setSelectedCommunity(null);
      setCommunityForm({ title: '', category_key: 'caf', badge: 'CAF Group', description: '', members_count_text: '1,000+ Members', whatsapp_link: '', discord_link: '' });
    } catch (err) {
      alert(`Error saving community: ${err.message}`);
    }
  };

  const handleDeleteCommunity = (commId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Community Room',
      message: 'Are you sure you want to delete this community study group?',
      onConfirm: async () => {
        try {
          setCommunities(prev => prev.filter(c => c.id !== commId));
          alert("Community room deleted.");
        } catch (err) {
          alert(`Error deleting community: ${err.message}`);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Actions - Delete Messages / Requests
  const handleDeleteMessage = (msgId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Contact Message',
      message: 'Are you sure you want to delete this inquiry message from the records?',
      onConfirm: async () => {
        try {
          await deleteInquiry(msgId);
          setMessages(prev => {
            const updated = prev.filter(m => (m.id || m._id) !== msgId && m.id !== msgId && m._id !== msgId);
            saveLocalStorageTable('contact_messages', updated);
            return updated;
          });
          alert("Message deleted successfully.");
        } catch (err) {
          alert(`Error: ${err.message}`);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMessageForReply) return;
    setSubmittingReply(true);
    try {
      const replyData = await replyToInquiry(selectedMessageForReply.id || selectedMessageForReply._id, replyText);
      alert("Reply submitted successfully to student!");
      setReplyText('');
      setSelectedMessageForReply(null);
      setReplyModalOpen(false);
      await loadData();
    } catch (err) {
      alert(`Error submitting reply: ${err.message}`);
    } finally {
      setSubmittingReply(false);
    }
  };



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("Image file size should be less than 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminProfile(prev => ({
          ...prev,
          avatar_url: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updatedData = await updateProfile({
        full_name: adminProfile.full_name,
        name: adminProfile.full_name,
        username: adminProfile.username,
        avatar_url: adminProfile.avatar_url,
        profileImage: adminProfile.avatar_url
      });

      setProfiles(prev => prev.map(p =>
        (session?.user && (p.id === session.user.id || p.id === session.user._id)) || p.username === adminProfile.username
          ? { ...p, full_name: adminProfile.full_name, username: adminProfile.username, avatar_url: adminProfile.avatar_url }
          : p
      ));

      if (onProfileUpdate) {
        onProfileUpdate({
          ...session?.user,
          full_name: adminProfile.full_name,
          name: adminProfile.full_name,
          username: adminProfile.username,
          avatar_url: adminProfile.avatar_url,
          profileImage: adminProfile.avatar_url
        });
      }

      try {
        const u = JSON.parse(localStorage.getItem('taxman_user') || '{}');
        const updatedU = {
          ...u,
          full_name: adminProfile.full_name,
          name: adminProfile.full_name,
          username: adminProfile.username,
          avatar_url: adminProfile.avatar_url,
          profileImage: adminProfile.avatar_url
        };
        localStorage.setItem('taxman_user', JSON.stringify(updatedU));

        const s = JSON.parse(localStorage.getItem('taxman_session') || '{}');
        if (s && s.user) {
          s.user = {
            ...s.user,
            full_name: adminProfile.full_name,
            name: adminProfile.full_name,
            username: adminProfile.username,
            avatar_url: adminProfile.avatar_url,
            profileImage: adminProfile.avatar_url
          };
          localStorage.setItem('taxman_session', JSON.stringify(s));
        }
      } catch {}

      alert("Admin profile updated successfully in database!");
      await loadData();
    } catch (err) {
      alert(`Error saving profile: ${err.message}`);
    } finally {
      setSavingProfile(false);
    }
  };

  // Get notifications count and list
  const getNotificationsList = () => {
    const list = [];
    messages.forEach(m => {
      list.push({
        id: `msg-${m.id}`,
        title: 'New Contact Inquiry',
        description: `From ${m.name}: "${m.subject || m.message || 'New message'}"`,
        time: m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Inquiry',
        bg: 'bg-emerald-500/10 text-emerald-600',
        type: 'message'
      });
    });
    requests.forEach(r => {
      list.push({
        id: `req-${r.id}`,
        title: 'Study Resource Request',
        description: `${r.name} requested: "${r.resource_title || 'Resource'}"`,
        time: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Request',
        bg: 'bg-blue-500/10 text-blue-600',
        type: 'request'
      });
    });
    return list;
  };
  const notificationsList = getNotificationsList();

  const markAdminNotificationAsRead = (id) => {
    setAdminReadIds(prev => {
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem('thetaxman_admin_read_notifs', JSON.stringify(Array.from(next)));
      } catch (e) {
        console.warn('Failed to save admin read notifs:', e);
      }
      return next;
    });
  };

  const markAllAdminNotificationsAsRead = () => {
    setAdminReadIds(prev => {
      const next = new Set(prev);
      notificationsList.forEach(n => next.add(n.id));
      try {
        localStorage.setItem('thetaxman_admin_read_notifs', JSON.stringify(Array.from(next)));
      } catch (e) {
        console.warn('Failed to save admin read notifs:', e);
      }
      return next;
    });
  };

  const unreadAdminCount = notificationsList.filter(n => !adminReadIds.has(n.id)).length;

  return (
    <div className="flex bg-[#F8F9FB] h-screen overflow-hidden text-gray-800 font-sans relative w-full" data-admin-dashboard="true">

      {/* 1. LEFT SIDEBAR (Dark - Desktop) */}
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

        {/* Sidebar Nav Links matching main home links */}
        <nav className="flex-1 min-h-0 px-4 pt-4 pb-2 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-white/10">
          {[
            { id: 'Dashboard', label: 'Dashboard', icon: <Globe className="w-4.5 h-4.5" /> },
            { id: 'Pakistan Jobs', label: 'Pakistan Jobs', icon: <Briefcase className="w-4.5 h-4.5" /> },
            { id: 'Inductions', label: 'Inductions', icon: <Clock className="w-4.5 h-4.5" /> },
            { id: 'Overseas Jobs', label: 'Overseas Jobs', icon: <Globe className="w-4.5 h-4.5" /> },
            { id: 'Career Support', label: 'Career Support', icon: <User className="w-4.5 h-4.5" /> },
            { id: 'Community', label: 'Community', icon: <Users className="w-4.5 h-4.5" /> },
            { id: 'Resources', label: 'Resources', icon: <Sliders className="w-4.5 h-4.5" /> },
            { id: 'Videos & Podcasts', label: 'Videos & Podcasts', icon: <Tv className="w-4.5 h-4.5" /> },
            { id: 'Announcements', label: 'Announcements', icon: <Calendar className="w-4.5 h-4.5" /> },
            { id: 'Blog Posts', label: 'Blog Articles', icon: <BookOpen className="w-4.5 h-4.5" /> },
            ...(!effectiveIsModerator ? [{ id: 'Users List', label: 'Manage Users', icon: <Users className="w-4.5 h-4.5" /> }] : []),
            { id: 'Messages', label: 'Contact Messages', icon: <MessageSquare className="w-4.5 h-4.5" />, badge: messages.length },
            { id: 'Profile', label: effectiveIsModerator ? 'Moderator Profile' : 'Admin Profile', icon: <User className="w-4.5 h-4.5" /> },
          ].map(item => {
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSubTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all ${isActive
                    ? 'text-brandGreen bg-brandGreen/10 border border-brandGreen/30 shadow-inner shadow-emerald-500/5'
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
                  <span className={`w-5 h-5 flex items-center justify-center text-[10px] font-black rounded-full ${isActive ? 'bg-brandGreen text-white' : 'bg-brandGreen text-white'
                    }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Cards */}
        <div className="p-4 space-y-4 border-t border-white/5 flex-shrink-0">
          {/* User Profile Card */}
          <div
            onClick={() => setActiveSubTab('Profile')}
            className="flex items-center justify-between p-2.5 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brandGreen to-emerald-400 text-white font-black flex items-center justify-center border-2 border-white/10 shadow-inner flex-shrink-0 overflow-hidden">
                {adminProfile.avatar_url ? (
                  <img src={adminProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  adminProfile.full_name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white truncate">{adminProfile.full_name}</span>
                <span className="text-[9px] text-brandGreen font-semibold mt-0.5 truncate">
                  {effectiveIsModerator ? 'Content Moderator / Staff' : 'CA Final Student / Admin'}
                </span>
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
                placeholder="Search for courses, events..."
                className="w-full pl-10 pr-4 py-2 border border-gray-100 bg-[#F8F9FB] rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:border-brandGreen transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Quick Links Shortcut */}
            <button
              type="button"
              onClick={() => {
                if (onNavigateHome) {
                  onNavigateHome();
                } else {
                  window.location.href = '/';
                }
              }}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1 mr-2 cursor-pointer hover:underline bg-transparent border-none p-0 transition-colors"
              title="Return to Main Portal"
            >
              <span>Back to Portal Home</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsDropdownOpen(prev => !prev)}
                className="relative p-2 text-gray-500 hover:text-navy transition-colors rounded-full hover:bg-gray-100/80 cursor-pointer focus:outline-none"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadAdminCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[17px] h-4 px-1 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-scaleIn">
                    {unreadAdminCount > 9 ? '9+' : unreadAdminCount}
                  </span>
                )}
              </button>

              {notificationsDropdownOpen && (
                <>
                  {/* Backdrop click to close */}
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsDropdownOpen(false)} />

                  {/* Dropdown Box */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-[350px] max-w-sm bg-white border border-gray-100 rounded-2xl shadow-2xl py-3 z-50 animate-scaleIn text-xs overflow-hidden"
                  >
                    {/* Header */}
                    <div className="px-4 pb-2.5 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-gray-900 text-sm">Notifications</span>
                        {unreadAdminCount > 0 ? (
                          <span className="px-2 py-0.5 text-[10px] font-black bg-brandGreen/10 text-brandGreen rounded-full">
                            {unreadAdminCount} new
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-400 rounded-full">
                            All read
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1.5">
                        {unreadAdminCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllAdminNotificationsAsRead}
                            className="inline-flex items-center space-x-1 text-[11px] font-bold text-brandGreen hover:text-emerald-700 hover:bg-brandGreen/10 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                            title="Mark all as read"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Read all</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setNotificationsDropdownOpen(false)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          aria-label="Close notifications"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Notification Items - Scrollable */}
                    <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50 scrollbar-thin scrollbar-thumb-gray-200">
                      {notificationsList.map((n) => {
                        const isRead = adminReadIds.has(n.id);
                        return (
                          <div
                            key={n.id}
                            onClick={() => {
                              markAdminNotificationAsRead(n.id);
                              setNotificationsDropdownOpen(false);
                              if (n.id.startsWith('msg')) {
                                setActiveSubTab('Messages');
                              } else if (n.id.startsWith('req')) {
                                setActiveSubTab('Resources');
                              } else {
                                setActiveSubTab('Dashboard');
                              }
                            }}
                            className={`px-4 py-3 hover:bg-[#F8F9FB] transition-all cursor-pointer text-left flex items-start space-x-2.5 ${
                              !isRead ? 'bg-emerald-50/20' : 'opacity-80'
                            }`}
                          >
                            {!isRead ? (
                              <span className="w-2 h-2 rounded-full bg-brandGreen mt-1.5 flex-shrink-0 animate-pulse" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-transparent mt-1.5 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-1.5 mb-1">
                                <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-bold uppercase tracking-wider ${n.bg}`}>
                                  {n.time}
                                </span>
                                <span className={`font-bold truncate text-xs ${!isRead ? 'text-gray-900 font-extrabold' : 'text-gray-600'}`}>
                                  {n.title}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500 font-medium line-clamp-2 leading-snug">
                                {n.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}

                      {notificationsList.length === 0 && (
                        <div className="px-4 py-8 text-center text-gray-400 italic">
                          No notifications yet.
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown Component */}
            <div className="relative">
              <div
                onClick={() => setHeaderDropdownOpen(!headerDropdownOpen)}
                className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-brandGreen to-emerald-400 text-white font-black flex items-center justify-center border-2 border-white shadow-md overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                {adminProfile.avatar_url ? (
                  <img src={adminProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  adminProfile.full_name.charAt(0).toUpperCase()
                )}
              </div>

              {headerDropdownOpen && (
                <>
                  {/* Click overlay to close dropdown */}
                  <div className="fixed inset-0 z-30" onClick={() => setHeaderDropdownOpen(false)} />

                  {/* Dropdown Box */}
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-40 animate-fadeIn text-xs text-left">
                    <div className="px-4 py-2 border-b border-gray-50 flex flex-col">
                      <span className="font-extrabold text-gray-800">{adminProfile.full_name}</span>
                      <span className="text-[10px] text-gray-400 font-semibold mt-0.5 truncate">{session?.user?.email}</span>
                    </div>

                    <button
                      onClick={() => {
                        setHeaderDropdownOpen(false);
                        setActiveSubTab('Profile');
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
                      className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors font-bold border-t border-gray-50 flex items-center space-x-2 cursor-pointer focus:outline-none"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* 3. DYNAMIC CONTENT AREA */}
        <div className="p-3.5 sm:p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8 pb-20">

          {loading && (
            <div className="flex items-center justify-center py-10">
              <div className="w-8 h-8 border-4 border-brandGreen border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* VIEW: OVERVIEW / DASHBOARD */}
          {activeSubTab === 'Dashboard' && !loading && (
            <div className="space-y-8 animate-fadeIn">

              {/* Hero Header Dashboard Banner */}
              <div className="relative overflow-hidden bg-gradient-to-r from-navy via-[#052347] to-[#011126] text-white rounded-3xl p-4 sm:p-6 md:p-8 border border-white/10 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brandGreen/10 to-transparent pointer-events-none rounded-r-3xl" />
                <div className="space-y-2 relative z-10">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-brandGreen/20 text-brandGreen text-[10px] font-black tracking-wider uppercase rounded-full">
                      System Admin Panel
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brandGreen animate-pulse" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center space-x-2">
                    <span>Welcome back, {adminProfile.full_name.split(' ')[0]}!</span>
                    <span>👋</span>
                  </h1>
                  <p className="text-gray-300 text-xs sm:text-sm font-medium max-w-xl">
                    Manage internships, job postings, counseling inquiries, study materials, and system roles. Everything is synced in real-time.
                  </p>
                </div>
                <div className="flex items-center space-x-3.5 bg-white/5 backdrop-blur-md px-4.5 py-3 rounded-2xl border border-white/10 flex-shrink-0 self-stretch md:self-auto justify-center">
                  <Clock className="w-5 h-5 text-brandGreen" />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Session Date</span>
                    <span className="text-xs font-black text-white">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              {/* Stats Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Total Registered Users', value: profiles.length, sub: `${profiles.filter(p => p.role === 'admin' || p.role === 'team_head').length} Admins • ${profiles.filter(p => p.role === 'student' || p.role === 'user').length} Students • ${profiles.filter(p => p.role === 'mentor').length} Mentors`, icon: <Users className="w-5.5 h-5.5 text-blue-500" />, bg: 'bg-blue-500/10', hoverBg: 'hover:border-blue-500/30 hover:shadow-blue-500/5', border: 'border-blue-500/5' },
                  { title: 'Job Placements Postings', value: jobs.length, sub: `${jobs.filter(j => j.job_type === 'Articleship').length} Inductions • ${jobs.filter(j => !j.is_overseas && j.job_type !== 'Articleship').length} Pak Jobs`, icon: <Briefcase className="w-5.5 h-5.5 text-emerald-500" />, bg: 'bg-emerald-500/10', hoverBg: 'hover:border-emerald-500/30 hover:shadow-emerald-500/5', border: 'border-emerald-500/5' },
                  { title: 'Study Resource Files', value: resources.length, sub: `${resources.reduce((sum, r) => sum + (r.downloads || 0), 0)} Total Downloads`, icon: <FileText className="w-5.5 h-5.5 text-purple-500" />, bg: 'bg-purple-500/10', hoverBg: 'hover:border-purple-500/30 hover:shadow-purple-500/5', border: 'border-purple-500/5' },
                  { title: 'Contact Inquiries', value: messages.length, sub: `${messages.filter(m => m.category === 'Career Guidance' || m.subject?.toLowerCase().includes('counsel')).length} Career Counseling Requests`, icon: <MessageSquare className="w-5.5 h-5.5 text-brandGreen" />, bg: 'bg-brandGreen/10', hoverBg: 'hover:border-brandGreen/30 hover:shadow-brandGreen/5', border: 'border-brandGreen/5' },
                ].map((stat, i) => (
                  <div key={i} className={`bg-white rounded-3xl p-6 border ${stat.border} flex items-center justify-between shadow-sm hover:-translate-y-1 ${stat.hoverBg} transition-all duration-300`}>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                        {stat.icon}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-gray-400 tracking-wide uppercase">{stat.title}</span>
                        <span className="text-3xl font-black text-[#090C11] leading-none mt-2">{stat.value}</span>
                        <span className="text-[10px] font-semibold text-gray-400 mt-2 leading-none">{stat.sub}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden text-left">
                <div className="absolute right-0 top-0 w-24 h-24 bg-brandGreen/5 rounded-bl-full pointer-events-none" />
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-4.5 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-brandGreen" />
                  <span>Quick Administrative Actions</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
                  {[
                    { label: 'Post Pakistan Job', onClick: () => { setSelectedJob(null); setJobForm({ company: '', title: '', location: '', country: 'Pakistan', level: 'CA Qualified', job_type: 'Full-time', workMode: 'On-site', deadline: '', description: '', requirements: '', is_overseas: false }); setIsJobModalOpen(true); }, color: 'bg-brandGreen/5 hover:bg-brandGreen text-brandGreen hover:text-white border border-brandGreen/10', desc: 'Create full/part-time local vacancies' },
                    { label: 'Post Trainee Induction', onClick: () => { setSelectedJob(null); setJobForm({ company: '', title: 'Audit Associate (Trainee)', location: 'Lahore', country: 'Pakistan', level: 'CAF / CA Inter', job_type: 'Articleship', workMode: 'On-site', deadline: '', description: '', requirements: '', is_overseas: false }); setIsJobModalOpen(true); }, color: 'bg-emerald-500/5 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-500/10', desc: 'Add new CA/ACCA articleships' },
                    { label: 'Add Study Resource', onClick: () => { setSelectedResource(null); setResourceForm({ title: '', description: '', category: 'CAF', type: 'PDF', downloads: 0, tag: '', tag_color: 'bg-blue-500/10 text-blue-600', btn_color: 'bg-blue-600 hover:bg-blue-700', download_url: '', is_featured: false }); setIsResourceModalOpen(true); }, color: 'bg-blue-500/5 hover:bg-blue-500 text-blue-500 hover:text-white border border-blue-500/10', desc: 'Upload preparation PDFs & packs' },
                    { label: 'Publish Announcement', onClick: () => { setSelectedAnnouncement(null); setAnnouncementForm({ title: '', summary: '', content: '', category: 'General', event_date: '' }); setIsAnnouncementModalOpen(true); }, color: 'bg-purple-500/5 hover:bg-purple-500 text-purple-500 hover:text-white border border-purple-500/10', desc: 'Broadcast news & alerts to feed' },
                    { label: 'Upload Video / Podcast', onClick: () => { setSelectedVideo(null); setVideoForm({ title: '', youtubeId: '', guest: 'Saboor Ahmad CA', role: 'Founder & Lead Mentor @ The TaxMan\'s Capital', type: 'Inductions & Guidance', duration: '30:00', date: 'July 2026', views: '1.5K', likes: '200', desc: '', thumbnail: '', qualification: 'CA', isFeatured: false }); setIsVideoModalOpen(true); }, color: 'bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/10', desc: 'Add latest video & podcast link' },
                    { label: 'Create Community Room', onClick: () => { setSelectedCommunity(null); setCommunityForm({ title: '', category_key: 'caf', badge: 'CAF Group', description: '', members_count_text: '1,000+ Members', whatsapp_link: '', discord_link: '' }); setIsCommunityModalOpen(true); }, color: 'bg-indigo-500/5 hover:bg-indigo-500 text-indigo-500 hover:text-white border border-indigo-500/10', desc: 'Set up WhatsApp study groups' },
                  ].map((act, idx) => (
                    <button
                      key={idx}
                      onClick={act.onClick}
                      className={`flex flex-col items-start p-4.5 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${act.color} cursor-pointer group`}
                    >
                      <Plus className="w-5 h-5 mb-2.5 transition-transform duration-300 group-hover:rotate-90 flex-shrink-0" />
                      <span className="font-extrabold text-[13px] leading-tight mb-1">{act.label}</span>
                      <span className="text-[10px] text-gray-400 font-semibold leading-snug group-hover:text-white/80 transition-colors">{act.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed Management Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {/* Card 1: Pakistan Jobs */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-brandGreen/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-left">
                  <div>
                    <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-5 h-5 text-emerald-500" />
                        <h3 className="font-black text-sm text-[#090C11]">Pakistan Jobs</h3>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-[9px] font-black text-emerald-600 rounded">
                        {jobs.filter(j => !j.is_overseas && j.job_type !== 'Articleship').length} Posted
                      </span>
                    </div>
                    <div className="space-y-3 mb-4">
                      {jobs.filter(j => !j.is_overseas && j.job_type !== 'Articleship').slice(0, 3).map((job, idx) => (
                        <div key={idx} className="text-xs bg-[#F8F9FB] hover:bg-emerald-50/20 p-2.5 rounded-xl flex items-center justify-between font-semibold border border-transparent hover:border-emerald-500/10 transition-all cursor-pointer hover:translate-x-0.5 duration-200">
                          <div className="truncate pr-2">
                            <h4 className="text-[#090C11] truncate">{job.title}</h4>
                            <span className="text-[10px] text-gray-400 font-bold">{job.company}</span>
                          </div>
                          <span className="text-[9px] text-brandGreen-dark bg-brandGreen/5 px-1.5 py-0.5 rounded font-black whitespace-nowrap">{job.deadline}</span>
                        </div>
                      ))}
                      {jobs.filter(j => !j.is_overseas && j.job_type !== 'Articleship').length === 0 && (
                        <p className="text-[11px] text-gray-400 italic py-4 text-center font-normal">No Pakistan jobs posted.</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('Pakistan Jobs')}
                    className="w-full py-2 bg-[#F8F9FB] hover:bg-brandGreen/10 text-[#090C11] hover:text-brandGreen-dark border border-gray-100 hover:border-brandGreen/20 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer"
                  >
                    <span>Manage Pakistan Jobs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card 2: CA/ACCA Inductions */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-brandGreen/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-left">
                  <div>
                    <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-brandGreen" />
                        <h3 className="font-black text-sm text-[#090C11]">Trainee Inductions</h3>
                      </div>
                      <span className="px-2 py-0.5 bg-brandGreen/10 text-[9px] font-black text-brandGreen-dark rounded">
                        {jobs.filter(j => j.job_type === 'Articleship').length} Active
                      </span>
                    </div>
                    <div className="space-y-3 mb-4">
                      {jobs.filter(j => j.job_type === 'Articleship').slice(0, 3).map((job, idx) => (
                        <div key={idx} className="text-xs bg-[#F8F9FB] hover:bg-brandGreen/5 p-2.5 rounded-xl flex items-center justify-between font-semibold border border-transparent hover:border-brandGreen/10 transition-all cursor-pointer hover:translate-x-0.5 duration-200">
                          <div className="truncate pr-2">
                            <h4 className="text-[#090C11] truncate">{job.title}</h4>
                            <span className="text-[10px] text-gray-400 font-bold">{job.company}</span>
                          </div>
                          <span className="text-[9px] text-brandGreen-dark bg-brandGreen/5 px-1.5 py-0.5 rounded font-black whitespace-nowrap">{job.deadline}</span>
                        </div>
                      ))}
                      {jobs.filter(j => j.job_type === 'Articleship').length === 0 && (
                        <p className="text-[11px] text-gray-400 italic py-4 text-center font-normal">No inductions posted.</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('Inductions')}
                    className="w-full py-2 bg-[#F8F9FB] hover:bg-brandGreen/10 text-[#090C11] hover:text-brandGreen-dark border border-gray-100 hover:border-brandGreen/20 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer"
                  >
                    <span>Manage Inductions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card 3: Overseas Jobs */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-brandGreen/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-left">
                  <div>
                    <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-5 h-5 text-blue-500" />
                        <h3 className="font-black text-sm text-[#090C11]">Overseas Placements</h3>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-500/10 text-[9px] font-black text-blue-600 rounded">
                        {jobs.filter(j => j.is_overseas).length} Posted
                      </span>
                    </div>
                    <div className="space-y-3 mb-4">
                      {jobs.filter(j => j.is_overseas).slice(0, 3).map((job, idx) => (
                        <div key={idx} className="text-xs bg-[#F8F9FB] hover:bg-blue-50/20 p-2.5 rounded-xl flex items-center justify-between font-semibold border border-transparent hover:border-blue-500/10 transition-all cursor-pointer hover:translate-x-0.5 duration-200">
                          <div className="truncate pr-2">
                            <h4 className="text-[#090C11] truncate">{job.title}</h4>
                            <span className="text-[10px] text-gray-400 font-bold">{job.company}</span>
                          </div>
                          <span className="text-[9px] text-brandGreen-dark bg-brandGreen/5 px-1.5 py-0.5 rounded font-black whitespace-nowrap">{job.deadline}</span>
                        </div>
                      ))}
                      {jobs.filter(j => j.is_overseas).length === 0 && (
                        <p className="text-[11px] text-gray-400 italic py-4 text-center font-normal">No overseas jobs posted.</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('Overseas Jobs')}
                    className="w-full py-2 bg-[#F8F9FB] hover:bg-brandGreen/10 text-[#090C11] hover:text-brandGreen-dark border border-gray-100 hover:border-brandGreen/20 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer"
                  >
                    <span>Manage Overseas Placements</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card 4: Study Resources */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-brandGreen/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-left">
                  <div>
                    <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-purple-500" />
                        <h3 className="font-black text-sm text-[#090C11]">Study Resources</h3>
                      </div>
                      <span className="px-2 py-0.5 bg-purple-500/10 text-[9px] font-black text-purple-600 rounded">
                        {resources.length} Files
                      </span>
                    </div>
                    <div className="space-y-3 mb-4">
                      {resources.slice(0, 3).map((res, idx) => (
                        <div key={idx} className="text-xs bg-[#F8F9FB] hover:bg-purple-50/20 p-2.5 rounded-xl flex items-center justify-between font-semibold border border-transparent hover:border-purple-500/10 transition-all cursor-pointer hover:translate-x-0.5 duration-200">
                          <div className="truncate pr-2">
                            <h4 className="text-[#090C11] truncate">{res.title}</h4>
                            <span className="text-[9px] text-gray-400 font-bold">{res.category} • {res.type}</span>
                          </div>
                          <span className="text-[9px] text-blue-600 bg-blue-500/5 px-1.5 py-0.5 rounded font-black whitespace-nowrap">{res.downloads} DLs</span>
                        </div>
                      ))}
                      {resources.length === 0 && (
                        <p className="text-[11px] text-gray-400 italic py-4 text-center font-normal">No resources available.</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('Resources')}
                    className="w-full py-2 bg-[#F8F9FB] hover:bg-brandGreen/10 text-[#090C11] hover:text-brandGreen-dark border border-gray-100 hover:border-brandGreen/20 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer"
                  >
                    <span>Manage Study Materials</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card 5: Community Groups */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-brandGreen/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-left">
                  <div>
                    <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-indigo-500" />
                        <h3 className="font-black text-sm text-[#090C11]">Communities</h3>
                      </div>
                      <span className="px-2 py-0.5 bg-indigo-500/10 text-[9px] font-black text-indigo-600 rounded">
                        {communities.length} Rooms
                      </span>
                    </div>
                    <div className="space-y-3 mb-4">
                      {communities.slice(0, 3).map((comm, idx) => (
                        <div key={idx} className="text-xs bg-[#F8F9FB] hover:bg-indigo-50/20 p-2.5 rounded-xl flex items-center justify-between font-semibold border border-transparent hover:border-indigo-500/10 transition-all cursor-pointer hover:translate-x-0.5 duration-200">
                          <div className="truncate pr-2">
                            <h4 className="text-[#090C11] truncate">{comm.title}</h4>
                            <span className="text-[9px] text-emerald-600 font-bold uppercase">{comm.category_key}</span>
                          </div>
                          <span className="text-[9px] text-gray-400 whitespace-nowrap">{comm.members_count_text}</span>
                        </div>
                      ))}
                      {communities.length === 0 && (
                        <p className="text-[11px] text-gray-400 italic py-4 text-center font-normal">No community groups configured.</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('Community')}
                    className="w-full py-2 bg-[#F8F9FB] hover:bg-brandGreen/10 text-[#090C11] hover:text-brandGreen-dark border border-gray-100 hover:border-brandGreen/20 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer"
                  >
                    <span>Manage Communities</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card 6: Announcements */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-brandGreen/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-left">
                  <div>
                    <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-red-500" />
                        <h3 className="font-black text-sm text-[#090C11]">Announcements</h3>
                      </div>
                      <span className="px-2 py-0.5 bg-red-500/10 text-[9px] font-black text-red-600 rounded">
                        {announcements.length} Published
                      </span>
                    </div>
                    <div className="space-y-3 mb-4">
                      {announcements.slice(0, 3).map((ann, idx) => (
                        <div key={idx} className="text-xs bg-[#F8F9FB] hover:bg-red-55/20 p-2.5 rounded-xl flex items-center justify-between font-semibold border border-transparent hover:border-red-500/10 transition-all cursor-pointer hover:translate-x-0.5 duration-200">
                          <div className="truncate pr-2">
                            <h4 className="text-[#090C11] truncate">{ann.title}</h4>
                            <span className="text-[9px] text-purple-600 font-bold uppercase">{ann.category}</span>
                          </div>
                          <span className="text-[9px] text-gray-400 whitespace-nowrap">{ann.event_date || 'N/A'}</span>
                        </div>
                      ))}
                      {announcements.length === 0 && (
                        <p className="text-[11px] text-gray-400 italic py-4 text-center font-normal">No announcements posted.</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('Announcements')}
                    className="w-full py-2 bg-[#F8F9FB] hover:bg-brandGreen/10 text-[#090C11] hover:text-brandGreen-dark border border-gray-100 hover:border-brandGreen/20 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer"
                  >
                    <span>Manage Announcements</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card 7: User Profiles (Admin Only - Hidden for Moderator) */}
                {!effectiveIsModerator && (
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-brandGreen/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-left">
                    <div>
                      <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                        <div className="flex items-center space-x-2">
                          <Users className="w-5 h-5 text-teal-500" />
                          <h3 className="font-black text-sm text-[#090C11]">Registered Users</h3>
                        </div>
                        <span className="px-2 py-0.5 bg-teal-500/10 text-[9px] font-black text-teal-600 rounded">
                          {profiles.length} Accounts
                        </span>
                      </div>
                      <div className="space-y-3 mb-4">
                        {profiles.slice(0, 3).map((p, idx) => (
                          <div key={idx} className="text-xs bg-[#F8F9FB] hover:bg-teal-50/20 p-2.5 rounded-xl flex items-center justify-between font-semibold border border-transparent hover:border-teal-500/10 transition-all cursor-pointer hover:translate-x-0.5 duration-200">
                            <div className="truncate pr-2">
                              <h4 className="text-[#090C11] truncate">{p.full_name}</h4>
                              <span className="text-[9px] text-gray-400">@{p.username}</span>
                            </div>
                            <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${p.role === 'admin' ? 'bg-brandGreen/10 text-brandGreen-dark' : 'bg-emerald-500/10 text-emerald-600'
                              }`}>{p.role}</span>
                          </div>
                        ))}
                        {profiles.length === 0 && (
                          <p className="text-[11px] text-gray-400 italic py-4 text-center font-normal">No registered user profiles found.</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveSubTab('Users List')}
                      className="w-full py-2 bg-[#F8F9FB] hover:bg-brandGreen/10 text-[#090C11] hover:text-brandGreen-dark border border-gray-100 hover:border-brandGreen/20 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer"
                    >
                      <span>Manage User Accounts</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Card 8: Career Guidance & Counseling */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-brandGreen/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-left">
                  <div>
                    <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-pink-500" />
                        <h3 className="font-black text-sm text-[#090C11]">Career Counseling</h3>
                      </div>
                      <span className="px-2 py-0.5 bg-pink-500/10 text-[9px] font-black text-pink-600 rounded">
                        {messages.filter(msg => msg.category === 'Career Guidance' || msg.subject?.toLowerCase().includes('counsel') || msg.subject?.toLowerCase().includes('career')).length} Requests
                      </span>
                    </div>
                    <div className="space-y-3 mb-4">
                      {messages.filter(msg => msg.category === 'Career Guidance' || msg.subject?.toLowerCase().includes('counsel') || msg.subject?.toLowerCase().includes('career')).slice(0, 3).map((msg, idx) => (
                        <div key={idx} className="text-xs bg-[#F8F9FB] hover:bg-pink-50/20 p-2.5 rounded-xl flex flex-col space-y-1 font-semibold border border-transparent hover:border-pink-500/10 transition-all cursor-pointer hover:translate-x-0.5 duration-200">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[#090C11] truncate max-w-[150px] font-black">{msg.name}</h4>
                            <span className="text-[8px] text-gray-400 font-bold">{msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ''}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 truncate leading-none italic font-normal">"${msg.message}"</span>
                        </div>
                      ))}
                      {messages.filter(msg => msg.category === 'Career Guidance' || msg.subject?.toLowerCase().includes('counsel') || msg.subject?.toLowerCase().includes('career')).length === 0 && (
                        <p className="text-[11px] text-gray-400 italic py-4 text-center font-normal">No counseling requests.</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('Career Support')}
                    className="w-full py-2 bg-[#F8F9FB] hover:bg-brandGreen/10 text-[#090C11] hover:text-brandGreen-dark border border-gray-100 hover:border-brandGreen/20 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer"
                  >
                    <span>Manage Counseling Submissions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card 9: Contact Messages */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-brandGreen/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-left">
                  <div>
                    <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-5 h-5 text-brandGreen" />
                        <h3 className="font-black text-sm text-[#090C11]">Contact Inquiries</h3>
                      </div>
                      <span className="px-2 py-0.5 bg-brandGreen/10 text-[9px] font-black text-brandGreen-dark rounded">
                        {messages.length} Total
                      </span>
                    </div>
                    <div className="space-y-3 mb-4">
                      {messages.slice(0, 3).map((msg, idx) => (
                        <div key={idx} className="text-xs bg-[#F8F9FB] hover:bg-brandGreen/5 p-2.5 rounded-xl flex flex-col space-y-1 font-semibold border border-transparent hover:border-brandGreen/10 transition-all cursor-pointer hover:translate-x-0.5 duration-200 font-sans">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[#090C11] truncate max-w-[150px]">{msg.subject}</h4>
                            <span className="text-[8px] text-gray-400 font-bold">{msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ''}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 truncate leading-none font-normal">From: {msg.name}</span>
                        </div>
                      ))}
                      {messages.length === 0 && (
                        <p className="text-[11px] text-gray-400 italic py-4 text-center font-normal">No contact inquiries.</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('Messages')}
                    className="w-full py-2 bg-[#F8F9FB] hover:bg-brandGreen/10 text-[#090C11] hover:text-brandGreen-dark border border-gray-100 hover:border-brandGreen/20 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer"
                  >
                    <span>Manage Contact Inbox</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          )}          {/* VIEW: PAKISTAN JOBS */}
          {activeSubTab === 'Pakistan Jobs' && !loading && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#090C11]">Manage Pakistan Jobs</h1>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">Publish and update domestic professional job opportunities.</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedJob(null);
                    setJobForm({ company: '', title: '', location: '', country: 'Pakistan', level: 'CA Qualified', job_type: 'Full-time', workMode: 'On-site', deadline: '', description: '', requirements: '', is_overseas: false });
                    setIsJobModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-black text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post Pakistan Job</span>
                </button>
              </div>

              {/* Search & View Toggle */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search domestic jobs by title, company, or city..."
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl text-xs focus:outline-none focus:border-brandGreen transition-colors"
                  />
                </div>
                {renderViewToggle(pakistanJobViewMode, setPakistanJobViewMode)}
              </div>

              {(() => {
                const filteredPakistanJobs = jobs
                  .filter(j => !j.is_overseas && j.job_type !== 'Articleship')
                  .filter(j => (j.company || '').toLowerCase().includes(jobSearch.toLowerCase()) || (j.title || '').toLowerCase().includes(jobSearch.toLowerCase()) || (j.location || '').toLowerCase().includes(jobSearch.toLowerCase()));
                const paginatedPakistanJobs = filteredPakistanJobs.slice((pakistanJobPage - 1) * ITEMS_PER_PAGE, pakistanJobPage * ITEMS_PER_PAGE);

                return (
                  <>
                    {pakistanJobViewMode === 'list' ? (
                      /* Table List View */
                      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#F8F9FB] text-gray-400 font-bold text-xs uppercase border-b border-gray-100">
                                <th className="p-4 pl-6">Job Title & Company</th>
                                <th className="p-4">Location & Level</th>
                                <th className="p-4">Job Type</th>
                                <th className="p-4">Deadline</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-600">
                              {paginatedPakistanJobs.map(job => (
                                <tr key={job.id} className="hover:bg-[#F8F9FB]/50 transition-colors">
                                  <td className="p-4 pl-6">
                                    <div className="font-black text-[#090C11]">{job.title}</div>
                                    <div className="text-[11px] font-bold text-gray-400 mt-0.5">{job.company}</div>
                                  </td>
                                  <td className="p-4 font-normal text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                      <span>{job.location} • {job.level}</span>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <span className="px-2.5 py-0.5 bg-brandGreen/10 text-[10px] font-black text-brandGreen-dark rounded-full uppercase">
                                      {job.job_type}
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    <span className="text-[11px] font-bold text-red-500 flex items-center">
                                      <Clock className="w-3 h-3 mr-1" /> {job.deadline || 'Ongoing'}
                                    </span>
                                  </td>
                                  <td className="p-4 pr-6 text-right space-x-1.5">
                                    <button
                                      onClick={() => {
                                        setSelectedJob(job);
                                        setJobForm({
                                          company: job.company,
                                          title: job.title,
                                          location: job.location,
                                          level: job.level,
                                          job_type: job.job_type,
                                          deadline: job.deadline,
                                          description: job.description,
                                          requirements: job.requirements?.join(', ') || '',
                                          is_overseas: false
                                        });
                                        setIsJobModalOpen(true);
                                      }}
                                      className="p-1.5 text-gray-500 hover:text-brandGreen bg-gray-50 hover:bg-brandGreen/5 rounded-lg transition-colors cursor-pointer"
                                      title="Edit Job"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteJob(job.id)}
                                      className="p-1.5 text-red-500 hover:text-red-700 bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                                      title="Delete Job"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}

                              {paginatedPakistanJobs.length === 0 && (
                                <tr>
                                  <td colSpan="5" className="p-8 text-center text-gray-400 italic">
                                    No Pakistan jobs found matching your criteria.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      /* Cards Grid View */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {paginatedPakistanJobs.map(job => (
                          <div key={job.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="px-2.5 py-0.5 bg-brandGreen/10 text-[9px] font-black text-brandGreen-dark rounded-full uppercase">
                                  {job.job_type}
                                </span>
                                <span className="text-[11px] font-bold text-red-500 flex items-center">
                                  <Clock className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> {job.deadline ? (job.deadline.includes('T') ? job.deadline.split('T')[0] : job.deadline) : 'N/A'}
                                </span>
                              </div>
                              <h3 className="text-base font-black text-[#090C11] mt-3 leading-tight">{job.title}</h3>
                              <p className="text-xs font-bold text-gray-400 mt-1">{job.company}</p>
                              <div className="flex items-center text-gray-400 text-xs mt-3">
                                <MapPin className="w-3.5 h-3.5 mr-1" />
                                <span>{job.location} • {job.level}</span>
                              </div>
                              <p className="text-xs font-normal text-gray-500 mt-4 leading-relaxed line-clamp-3">
                                {job.description}
                              </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedJob(job);
                                  setJobForm({
                                    company: job.company,
                                    title: job.title,
                                    location: job.location,
                                    level: job.level,
                                    job_type: job.job_type,
                                    deadline: job.deadline,
                                    description: job.description,
                                    requirements: job.requirements?.join(', ') || '',
                                    is_overseas: false
                                  });
                                  setIsJobModalOpen(true);
                                }}
                                className="p-2 text-gray-500 hover:text-brandGreen bg-gray-50 hover:bg-brandGreen/5 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteJob(job.id)}
                                className="p-2 text-red-500 hover:text-red-700 bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {paginatedPakistanJobs.length === 0 && (
                          <div className="col-span-full bg-white rounded-2xl p-10 text-center text-gray-400 italic border border-gray-100">
                            No Pakistan jobs found matching your criteria.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pagination */}
                    <AdminPagination
                      currentPage={pakistanJobPage}
                      totalItems={filteredPakistanJobs.length}
                      pageSize={ITEMS_PER_PAGE}
                      onPageChange={setPakistanJobPage}
                    />
                  </>
                );
              })()}
            </div>
          )}

          {/* VIEW: INDUCTIONS */}
          {activeSubTab === 'Inductions' && !loading && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#090C11]">Manage Trainee Inductions</h1>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">Publish Trainee / Articleship positions for CA & ACCA students.</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedJob(null);
                    setJobForm({ company: '', title: 'Audit Associate (Trainee)', location: 'Lahore', country: 'Pakistan', level: 'CAF / CA Inter', job_type: 'Articleship', workMode: 'On-site', deadline: '', description: '', requirements: '', is_overseas: false });
                    setIsJobModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-black text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post Trainee Induction</span>
                </button>
              </div>

              {/* Search & View Toggle */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search trainee inductions by firm, role, or city..."
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl text-xs focus:outline-none focus:border-brandGreen transition-colors"
                  />
                </div>
                {renderViewToggle(inductionJobViewMode, setInductionJobViewMode)}
              </div>

              {(() => {
                const filteredInductions = jobs
                  .filter(j => j.job_type === 'Articleship')
                  .filter(j => (j.company || '').toLowerCase().includes(jobSearch.toLowerCase()) || (j.title || '').toLowerCase().includes(jobSearch.toLowerCase()) || (j.location || '').toLowerCase().includes(jobSearch.toLowerCase()));
                const paginatedInductions = filteredInductions.slice((inductionJobPage - 1) * ITEMS_PER_PAGE, inductionJobPage * ITEMS_PER_PAGE);

                return (
                  <>
                    {inductionJobViewMode === 'list' ? (
                      /* Table List View */
                      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#F8F9FB] text-gray-400 font-bold text-xs uppercase border-b border-gray-100">
                                <th className="p-4 pl-6">Induction & Firm</th>
                                <th className="p-4">Location & Level</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Deadline</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-600">
                              {paginatedInductions.map(job => (
                                <tr key={job.id} className="hover:bg-[#F8F9FB]/50 transition-colors">
                                  <td className="p-4 pl-6">
                                    <div className="font-black text-[#090C11]">{job.title}</div>
                                    <div className="text-[11px] font-bold text-gray-400 mt-0.5">{job.company}</div>
                                  </td>
                                  <td className="p-4 font-normal text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                      <span>{job.location} • {job.level}</span>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <span className="px-2.5 py-0.5 bg-brandGreen/10 text-[10px] font-black text-brandGreen-dark rounded-full uppercase">
                                      Articleship
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    <span className="text-[11px] font-bold text-red-500 flex items-center">
                                      <Clock className="w-3 h-3 mr-1" /> {job.deadline || 'Ongoing'}
                                    </span>
                                  </td>
                                  <td className="p-4 pr-6 text-right space-x-1.5">
                                    <button
                                      onClick={() => {
                                        setSelectedJob(job);
                                        setJobForm({
                                          company: job.company,
                                          title: job.title,
                                          location: job.location,
                                          level: job.level,
                                          job_type: 'Articleship',
                                          deadline: job.deadline,
                                          description: job.description,
                                          requirements: job.requirements?.join(', ') || '',
                                          is_overseas: false
                                        });
                                        setIsJobModalOpen(true);
                                      }}
                                      className="p-1.5 text-gray-500 hover:text-brandGreen bg-gray-50 hover:bg-brandGreen/5 rounded-lg transition-colors cursor-pointer"
                                      title="Edit Induction"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteJob(job.id)}
                                      className="p-1.5 text-red-500 hover:text-red-700 bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                                      title="Delete Induction"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}

                              {paginatedInductions.length === 0 && (
                                <tr>
                                  <td colSpan="5" className="p-8 text-center text-gray-400 italic">
                                    No trainee inductions found matching your criteria.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      /* Cards Grid View */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {paginatedInductions.map(job => (
                          <div key={job.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="px-2.5 py-0.5 bg-brandGreen/10 text-[9px] font-black text-brandGreen-dark rounded-full uppercase">
                                  Induction
                                </span>
                                <span className="text-[11px] font-bold text-red-500 flex items-center">
                                  <Clock className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> {job.deadline ? (job.deadline.includes('T') ? job.deadline.split('T')[0] : job.deadline) : 'N/A'}
                                </span>
                              </div>
                              <h3 className="text-base font-black text-[#090C11] mt-3 leading-tight">{job.title}</h3>
                              <p className="text-xs font-bold text-gray-400 mt-1">{job.company}</p>
                              <div className="flex items-center text-gray-400 text-xs mt-3">
                                <MapPin className="w-3.5 h-3.5 mr-1" />
                                <span>{job.location} • {job.level}</span>
                              </div>
                              <p className="text-xs font-normal text-gray-500 mt-4 leading-relaxed line-clamp-3">
                                {job.description}
                              </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedJob(job);
                                  setJobForm({
                                    company: job.company,
                                    title: job.title,
                                    location: job.location,
                                    level: job.level,
                                    job_type: 'Articleship',
                                    deadline: job.deadline,
                                    description: job.description,
                                    requirements: job.requirements?.join(', ') || '',
                                    is_overseas: false
                                  });
                                  setIsJobModalOpen(true);
                                }}
                                className="p-2 text-gray-500 hover:text-brandGreen bg-gray-50 hover:bg-brandGreen/5 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteJob(job.id)}
                                className="p-2 text-red-500 hover:text-red-700 bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {paginatedInductions.length === 0 && (
                          <div className="col-span-full bg-white rounded-2xl p-10 text-center text-gray-400 italic border border-gray-100">
                            No trainee inductions found matching your criteria.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pagination */}
                    <AdminPagination
                      currentPage={inductionJobPage}
                      totalItems={filteredInductions.length}
                      pageSize={ITEMS_PER_PAGE}
                      onPageChange={setInductionJobPage}
                    />
                  </>
                );
              })()}
            </div>
          )}

          {/* VIEW: OVERSEAS JOBS */}
          {activeSubTab === 'Overseas Jobs' && !loading && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#090C11]">Manage Overseas Placements</h1>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">Publish job vacancies located outside Pakistan (e.g. Middle East, UK).</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedJob(null);
                    setJobForm({ company: '', title: '', location: 'Riyadh, Saudi Arabia', country: 'Saudi Arabia', level: 'CA Qualified', job_type: 'Full-time', workMode: 'On-site', deadline: '', description: '', requirements: '', is_overseas: true });
                    setIsJobModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-black text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post Overseas Placement</span>
                </button>
              </div>

              {/* Search & View Toggle */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search overseas opportunities by title, company, country..."
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl text-xs focus:outline-none focus:border-brandGreen transition-colors"
                  />
                </div>
                {renderViewToggle(overseasJobViewMode, setOverseasJobViewMode)}
              </div>

              {(() => {
                const filteredOverseasJobs = jobs
                  .filter(j => j.is_overseas)
                  .filter(j => (j.company || '').toLowerCase().includes(jobSearch.toLowerCase()) || (j.title || '').toLowerCase().includes(jobSearch.toLowerCase()) || (j.location || '').toLowerCase().includes(jobSearch.toLowerCase()));
                const paginatedOverseasJobs = filteredOverseasJobs.slice((overseasJobPage - 1) * ITEMS_PER_PAGE, overseasJobPage * ITEMS_PER_PAGE);

                return (
                  <>
                    {overseasJobViewMode === 'list' ? (
                      /* Table List View */
                      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#F8F9FB] text-gray-400 font-bold text-xs uppercase border-b border-gray-100">
                                <th className="p-4 pl-6">Job Title & Company</th>
                                <th className="p-4">Location & Level</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Deadline</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-600">
                              {paginatedOverseasJobs.map(job => (
                                <tr key={job.id} className="hover:bg-[#F8F9FB]/50 transition-colors">
                                  <td className="p-4 pl-6">
                                    <div className="font-black text-[#090C11]">{job.title}</div>
                                    <div className="text-[11px] font-bold text-gray-400 mt-0.5">{job.company}</div>
                                  </td>
                                  <td className="p-4 font-normal text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="w-3.5 h-3.5 text-brandGreen shrink-0" />
                                      <span>{job.location} • {job.level}</span>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <span className="px-2.5 py-0.5 bg-emerald-500/10 text-[10px] font-black text-brandGreen rounded-full uppercase">
                                      Overseas
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    <span className="text-[11px] font-bold text-red-500 flex items-center">
                                      <Clock className="w-3 h-3 mr-1" /> {job.deadline || 'Ongoing'}
                                    </span>
                                  </td>
                                  <td className="p-4 pr-6 text-right space-x-1.5">
                                    <button
                                      onClick={() => {
                                        setSelectedJob(job);
                                        setJobForm({
                                          company: job.company,
                                          title: job.title,
                                          location: job.location,
                                          level: job.level,
                                          job_type: job.job_type,
                                          deadline: job.deadline,
                                          description: job.description,
                                          requirements: job.requirements?.join(', ') || '',
                                          is_overseas: true
                                        });
                                        setIsJobModalOpen(true);
                                      }}
                                      className="p-1.5 text-gray-500 hover:text-brandGreen bg-gray-50 hover:bg-brandGreen/5 rounded-lg transition-colors cursor-pointer"
                                      title="Edit Job"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteJob(job.id)}
                                      className="p-1.5 text-red-500 hover:text-red-700 bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                                      title="Delete Job"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}

                              {paginatedOverseasJobs.length === 0 && (
                                <tr>
                                  <td colSpan="5" className="p-8 text-center text-gray-400 italic">
                                    No overseas opportunities found matching your criteria.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      /* Cards Grid View */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {paginatedOverseasJobs.map(job => (
                          <div key={job.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-[9px] font-black text-brandGreen rounded-full uppercase">
                                  Overseas Placements
                                </span>
                                <span className="text-[11px] font-bold text-red-500 flex items-center">
                                  <Clock className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> {job.deadline ? (job.deadline.includes('T') ? job.deadline.split('T')[0] : job.deadline) : 'N/A'}
                                </span>
                              </div>
                              <h3 className="text-base font-black text-[#090C11] mt-3 leading-tight">{job.title}</h3>
                              <p className="text-xs font-bold text-gray-400 mt-1">{job.company}</p>
                              <div className="flex items-center text-gray-400 text-xs mt-3">
                                <MapPin className="w-3.5 h-3.5 mr-1 text-brandGreen" />
                                <span>{job.location} • {job.level}</span>
                              </div>
                              <p className="text-xs font-normal text-gray-500 mt-4 leading-relaxed line-clamp-3">
                                {job.description}
                              </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedJob(job);
                                  setJobForm({
                                    company: job.company,
                                    title: job.title,
                                    location: job.location,
                                    level: job.level,
                                    job_type: job.job_type,
                                    deadline: job.deadline,
                                    description: job.description,
                                    requirements: job.requirements?.join(', ') || '',
                                    is_overseas: true
                                  });
                                  setIsJobModalOpen(true);
                                }}
                                className="p-2 text-gray-500 hover:text-brandGreen bg-gray-50 hover:bg-brandGreen/5 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteJob(job.id)}
                                className="p-2 text-red-500 hover:text-red-700 bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {paginatedOverseasJobs.length === 0 && (
                          <div className="col-span-full bg-white rounded-2xl p-10 text-center text-gray-400 italic border border-gray-100">
                            No overseas opportunities found matching your criteria.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pagination */}
                    <AdminPagination
                      currentPage={overseasJobPage}
                      totalItems={filteredOverseasJobs.length}
                      pageSize={ITEMS_PER_PAGE}
                      onPageChange={setOverseasJobPage}
                    />
                  </>
                );
              })()}
            </div>
          )}

          {/* VIEW: VIDEOS & PODCASTS */}
          {activeSubTab === 'Videos & Podcasts' && !loading && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#090C11] flex items-center space-x-2">
                    <Tv className="w-5 h-5 sm:w-6 sm:h-6 text-brandGreen flex-shrink-0" />
                    <span>Manage Videos & Podcasts</span>
                  </h1>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">
                    Upload latest video & podcast links from @SaboorAhmadCA YouTube channel.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedVideo(null);
                    setVideoForm({
                      title: '',
                      youtubeId: '',
                      guest: 'Saboor Ahmad CA',
                      role: 'Founder & Lead Mentor @ The TaxMan\'s Capital',
                      type: 'Inductions & Guidance',
                      duration: '30:00',
                      date: 'July 2026',
                      views: '1.5K',
                      likes: '200',
                      desc: '',
                      thumbnail: '',
                      qualification: 'CA',
                      isFeatured: false
                    });
                    setIsVideoModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-black text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Video / Podcast</span>
                </button>
              </div>

              {/* Filters & Search & View Toggle */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative w-full lg:w-72">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search videos, titles, guests..."
                    value={videoSearch}
                    onChange={(e) => setVideoSearch(e.target.value)}
                    className="w-full bg-[#F8F9FB] border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brandGreen"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2.5 w-full lg:w-auto">
                  <div className="flex items-center space-x-1.5 overflow-x-auto">
                    {['All', 'Inductions & Guidance', 'Podcasts & Interviews', 'Exam Preparation', 'Career & Overseas'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setVideoCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${videoCategoryFilter === cat
                            ? 'bg-brandGreen text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  {renderViewToggle(videoViewMode, setVideoViewMode)}
                </div>
              </div>

              {(() => {
                const filteredVideos = videos
                  .filter(v => {
                    const matchesCategory = videoCategoryFilter === 'All' || v.type === videoCategoryFilter;
                    const matchesSearch = !videoSearch || v.title?.toLowerCase().includes(videoSearch.toLowerCase()) || v.guest?.toLowerCase().includes(videoSearch.toLowerCase());
                    return matchesCategory && matchesSearch;
                  });
                const paginatedVideos = filteredVideos.slice((videoPage - 1) * ITEMS_PER_PAGE, videoPage * ITEMS_PER_PAGE);

                return (
                  <>
                    {videoViewMode === 'list' ? (
                      /* Table List View */
                      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#F8F9FB] text-gray-400 font-bold text-xs uppercase border-b border-gray-100">
                                <th className="p-4 pl-6">Video & Media</th>
                                <th className="p-4">Guest & Role</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Duration & Views</th>
                                <th className="p-4">Spotlight</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-600">
                              {paginatedVideos.map(v => (
                                <tr key={v.id} className="hover:bg-[#F8F9FB]/50 transition-colors">
                                  <td className="p-4 pl-6">
                                    <div className="flex items-center space-x-3 max-w-sm">
                                      <div className="w-16 h-10 rounded-lg bg-black overflow-hidden relative shrink-0">
                                        <img
                                          src={v.thumbnail || `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                                          alt={v.title}
                                          className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-0.5 right-0.5 px-1 py-0.2 bg-black/80 text-emerald-400 font-mono text-[8px] rounded">
                                          {v.duration}
                                        </div>
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-black text-[#090C11] truncate">{v.title}</p>
                                        <p className="text-[10px] text-gray-400 font-bold mt-0.5">ID: {v.youtubeId}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4 font-normal text-gray-600">
                                    <div className="font-bold text-[#090C11]">{v.guest}</div>
                                    <div className="text-[10px] text-gray-400 truncate max-w-[150px]">{v.role}</div>
                                  </td>
                                  <td className="p-4">
                                    <span className="px-2.5 py-1 bg-brandGreen/10 text-brandGreen font-bold rounded-lg text-[10px]">
                                      {v.type}
                                    </span>
                                  </td>
                                  <td className="p-4 font-normal text-gray-500">
                                    <div>{v.duration}</div>
                                    <div className="text-[10px] text-gray-400">{v.views || '0'} views</div>
                                  </td>
                                  <td className="p-4">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleFeaturedVideo(v.id)}
                                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${v.isFeatured
                                          ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                    >
                                      {v.isFeatured ? 'Spotlight ★' : 'Set'}
                                    </button>
                                  </td>
                                  <td className="p-4 pr-6 text-right space-x-1.5">
                                    <button
                                      onClick={() => {
                                        setSelectedVideo(v);
                                        setVideoForm({
                                          title: v.title,
                                          youtubeId: v.youtubeId,
                                          guest: v.guest || 'Saboor Ahmad CA',
                                          role: v.role || 'Founder & Lead Mentor @ The TaxMan\'s Capital',
                                          type: v.type || 'Inductions & Guidance',
                                          duration: v.duration || '30:00',
                                          date: v.date || 'July 2026',
                                          views: v.views || '1.5K',
                                          likes: v.likes || '200',
                                          desc: v.desc || '',
                                          thumbnail: v.thumbnail || '',
                                          qualification: v.qualification || 'CA',
                                          isFeatured: !!v.isFeatured
                                        });
                                        setIsVideoModalOpen(true);
                                      }}
                                      className="p-1.5 text-gray-500 hover:text-brandGreen bg-gray-50 hover:bg-brandGreen/5 rounded-lg transition-colors cursor-pointer"
                                      title="Edit Video"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteVideo(v.id)}
                                      className="p-1.5 text-red-500 hover:text-red-700 bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                                      title="Delete Video"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}

                              {paginatedVideos.length === 0 && (
                                <tr>
                                  <td colSpan="6" className="p-8 text-center text-gray-400 italic">
                                    No videos or podcasts found matching your search.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      /* Cards Grid View */
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedVideos.map(v => (
                          <div key={v.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4">
                            <div className="space-y-3">
                              <div className="relative aspect-video rounded-xl bg-black overflow-hidden group">
                                <img
                                  src={v.thumbnail || `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                                  alt={v.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[10px] font-bold rounded">
                                  {v.type}
                                </div>
                                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-emerald-400 font-mono text-[10px] font-bold rounded">
                                  {v.duration}
                                </div>
                                {v.isFeatured && (
                                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded">
                                    SPOTLIGHT
                                  </div>
                                )}
                              </div>

                              <div>
                                <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold mb-1">
                                  <span className="text-brandGreen">{v.guest}</span>
                                  <span>{v.date}</span>
                                </div>
                                <h3 className="text-sm font-black text-[#090C11] line-clamp-2 leading-tight">{v.title}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">{v.desc}</p>
                                <p className="text-[10px] font-bold text-gray-400 mt-2">YouTube ID: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">{v.youtubeId}</code></p>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                              <button
                                onClick={() => handleToggleFeaturedVideo(v.id)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${v.isFeatured
                                    ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                  }`}
                              >
                                {v.isFeatured ? 'Featured Spotlight ★' : 'Set Spotlight'}
                              </button>

                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedVideo(v);
                                    setVideoForm({
                                      title: v.title,
                                      youtubeId: v.youtubeId,
                                      guest: v.guest || 'Saboor Ahmad CA',
                                      role: v.role || 'Founder & Lead Mentor @ The TaxMan\'s Capital',
                                      type: v.type || 'Inductions & Guidance',
                                      duration: v.duration || '30:00',
                                      date: v.date || 'July 2026',
                                      views: v.views || '1.5K',
                                      likes: v.likes || '200',
                                      desc: v.desc || '',
                                      thumbnail: v.thumbnail || '',
                                      qualification: v.qualification || 'CA',
                                      isFeatured: !!v.isFeatured
                                    });
                                    setIsVideoModalOpen(true);
                                  }}
                                  className="p-2 text-gray-500 hover:text-brandGreen bg-gray-50 hover:bg-brandGreen/5 rounded-lg transition-colors cursor-pointer"
                                  title="Edit Video"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleDeleteVideo(v.id)}
                                  className="p-2 text-red-500 hover:text-red-700 bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Video"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {paginatedVideos.length === 0 && (
                          <div className="col-span-full bg-white rounded-2xl p-10 text-center text-gray-400 italic border border-gray-100">
                            No videos or podcasts found matching your search.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pagination */}
                    <AdminPagination
                      currentPage={videoPage}
                      totalItems={filteredVideos.length}
                      pageSize={ITEMS_PER_PAGE}
                      onPageChange={setVideoPage}
                    />
                  </>
                );
              })()}
            </div>
          )}

          {/* VIEW: CAREER SUPPORT */}
          {activeSubTab === 'Career Support' && !loading && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-[#090C11]">Career Support & Counseling</h1>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">Review submissions requesting student counseling and professional guidance.</p>
                </div>
                {renderViewToggle(careerSupportViewMode, setCareerSupportViewMode)}
              </div>

              {(() => {
                const filteredCounseling = messages.filter(msg => msg.category === 'Career Guidance' || msg.subject?.toLowerCase().includes('counsel') || msg.subject?.toLowerCase().includes('career'));
                const paginatedCounseling = filteredCounseling.slice((careerSupportPage - 1) * ITEMS_PER_PAGE, careerSupportPage * ITEMS_PER_PAGE);

                return (
                  <>
                    {careerSupportViewMode === 'list' ? (
                      /* Table List View */
                      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#F8F9FB] text-gray-400 font-bold text-xs uppercase border-b border-gray-100">
                                <th className="p-4 pl-6">Student & Contact</th>
                                <th className="p-4">Subject</th>
                                <th className="p-4">Message Snippet</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-600">
                              {paginatedCounseling.map(msg => (
                                <tr key={msg.id} className="hover:bg-[#F8F9FB]/50 transition-colors">
                                  <td className="p-4 pl-6">
                                    <div className="font-black text-[#090C11]">{msg.name}</div>
                                    <div className="text-[11px] text-gray-400">{msg.email} {msg.phone && `• ${msg.phone}`}</div>
                                  </td>
                                  <td className="p-4">
                                    <div className="font-bold text-[#090C11]">{msg.subject}</div>
                                    <span className="px-2 py-0.5 bg-brandGreen/10 text-brandGreen text-[9px] font-black rounded uppercase">
                                      Counseling
                                    </span>
                                  </td>
                                  <td className="p-4 max-w-xs">
                                    <p className="line-clamp-2 text-gray-500 font-normal">{msg.message}</p>
                                  </td>
                                  <td className="p-4 text-[11px] text-gray-400 font-normal">
                                    {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ''}
                                  </td>
                                  <td className="p-4 pr-6 text-right space-x-1.5">
                                    <button
                                      onClick={() => {
                                        setSelectedMessageForReply(msg);
                                        setReplyText(msg.reply || '');
                                        setReplyModalOpen(true);
                                      }}
                                      className="p-1.5 text-brandGreen hover:text-brandGreen-dark bg-brandGreen/5 rounded-lg transition-colors cursor-pointer text-xs font-bold"
                                      title="Reply"
                                    >
                                      Reply
                                    </button>
                                    <button
                                      onClick={() => handleDeleteMessage(msg.id)}
                                      className="p-1.5 text-red-500 hover:text-red-700 bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                                      title="Delete Record"
                                    >
                                      <Trash2 className="w-4 h-4 inline" />
                                    </button>
                                  </td>
                                </tr>
                              ))}

                              {paginatedCounseling.length === 0 && (
                                <tr>
                                  <td colSpan="5" className="p-8 text-center text-gray-400 italic">
                                    No pending career counseling requests.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      /* Cards Grid View */
                      <div className="space-y-4">
                        {paginatedCounseling.map(msg => (
                          <div key={msg.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
                            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                              <div>
                                <span className="px-2 py-0.5 bg-brandGreen/10 text-brandGreen-dark rounded text-[9px] font-black uppercase">
                                  Counseling Request
                                </span>
                                <h4 className="font-black text-sm text-[#090C11] mt-2">{msg.subject}</h4>
                              </div>
                              <span className="text-[10px] text-gray-400 font-bold">
                                {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ''}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400">
                              Student: <strong>{msg.name}</strong> ({msg.email}) {msg.phone && `• Ph: ${msg.phone}`}
                            </p>
                            <p className="text-xs text-gray-600 leading-relaxed italic bg-gray-50 p-3 rounded-lg border border-gray-50 font-normal">
                              " {msg.message} "
                            </p>
                            <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                              <button
                                onClick={() => {
                                  setSelectedMessageForReply(msg);
                                  setReplyText(msg.reply || '');
                                  setReplyModalOpen(true);
                                }}
                                className="text-xs text-brandGreen hover:text-brandGreen-dark font-bold px-2.5 py-1.5 rounded-lg bg-brandGreen/5 transition-colors cursor-pointer"
                              >
                                Answer Query
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center space-x-1 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Clear Record</span>
                              </button>
                            </div>
                          </div>
                        ))}

                        {paginatedCounseling.length === 0 && (
                          <p className="text-xs text-gray-400 italic text-center py-10">No pending career counseling requests.</p>
                        )}
                      </div>
                    )}

                    {/* Pagination */}
                    <AdminPagination
                      currentPage={careerSupportPage}
                      totalItems={filteredCounseling.length}
                      pageSize={ITEMS_PER_PAGE}
                      onPageChange={setCareerSupportPage}
                    />
                  </>
                );
              })()}
            </div>
          )}

          {/* VIEW: COMMUNITY ROOMS */}
          {activeSubTab === 'Community' && !loading && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#090C11]">Manage Community Rooms</h1>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">Configure WhatsApp study groups and discord links for students.</p>
                </div>
                <div className="flex items-center space-x-2.5 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                  {renderViewToggle(communityViewMode, setCommunityViewMode)}
                  <button
                    onClick={() => {
                      setSelectedCommunity(null);
                      setCommunityForm({ title: '', category_key: 'caf', badge: 'CAF Group', description: '', members_count_text: '1,000+ Members', whatsapp_link: '', discord_link: '' });
                      setIsCommunityModalOpen(true);
                    }}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-black text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Room</span>
                  </button>
                </div>
              </div>

              {(() => {
                const paginatedCommunities = communities.slice((communityPage - 1) * ITEMS_PER_PAGE, communityPage * ITEMS_PER_PAGE);

                return (
                  <>
                    {communityViewMode === 'list' ? (
                      /* Table List View */
                      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#F8F9FB] text-gray-400 font-bold text-xs uppercase border-b border-gray-100">
                                <th className="p-4 pl-6">Community Room</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Members</th>
                                <th className="p-4">Links</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-600">
                              {paginatedCommunities.map(comm => (
                                <tr key={comm.id} className="hover:bg-[#F8F9FB]/50 transition-colors">
                                  <td className="p-4 pl-6">
                                    <div className="font-black text-[#090C11]">{comm.title}</div>
                                    <div className="text-[11px] text-gray-400 truncate max-w-sm mt-0.5">{comm.description}</div>
                                  </td>
                                  <td className="p-4">
                                    <span className="px-2.5 py-0.5 bg-emerald-500/10 text-brandGreen font-bold rounded-full text-[10px] uppercase">
                                      {comm.category_key}
                                    </span>
                                  </td>
                                  <td className="p-4 font-normal text-gray-500">
                                    {comm.members_count_text}
                                  </td>
                                  <td className="p-4 space-y-1">
                                    {comm.whatsapp_link && (
                                      <div>
                                        <a href={comm.whatsapp_link} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline font-bold text-[11px]">
                                          WhatsApp Group
                                        </a>
                                      </div>
                                    )}
                                    {comm.discord_link && (
                                      <div>
                                        <a href={comm.discord_link} target="_blank" rel="noreferrer" className="text-brandGreen hover:underline font-bold text-[11px]">
                                          Discord Server
                                        </a>
                                      </div>
                                    )}
                                  </td>
                                  <td className="p-4 pr-6 text-right space-x-1.5">
                                    <button
                                      onClick={() => {
                                        setSelectedCommunity(comm);
                                        setCommunityForm({
                                          title: comm.title,
                                          category_key: comm.category_key,
                                          badge: comm.badge,
                                          description: comm.description,
                                          members_count_text: comm.members_count_text,
                                          whatsapp_link: comm.whatsapp_link || '',
                                          discord_link: comm.discord_link || ''
                                        });
                                        setIsCommunityModalOpen(true);
                                      }}
                                      className="p-1.5 text-gray-500 hover:text-brandGreen bg-gray-50 hover:bg-brandGreen/5 rounded-lg transition-colors cursor-pointer"
                                      title="Edit Community"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCommunity(comm.id)}
                                      className="p-1.5 text-red-500 hover:text-red-700 bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                                      title="Delete Community"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}

                              {paginatedCommunities.length === 0 && (
                                <tr>
                                  <td colSpan="5" className="p-8 text-center text-gray-400 italic">
                                    No community rooms configured.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      /* Cards Grid View */
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedCommunities.map(comm => (
                          <div key={comm.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-[9px] font-black text-brandGreen rounded-full uppercase">
                                  {comm.category_key}
                                </span>
                                <span className="text-[11px] font-bold text-gray-400">
                                  {comm.members_count_text}
                                </span>
                              </div>
                              <h3 className="text-base font-black text-[#090C11] mt-3 leading-tight">{comm.title}</h3>
                              <p className="text-xs font-normal text-gray-500 mt-2 leading-relaxed">
                                {comm.description}
                              </p>

                              <div className="mt-4 space-y-1 text-xs">
                                {comm.whatsapp_link && (
                                  <div className="text-gray-400 truncate font-semibold">
                                    WhatsApp: <a href={comm.whatsapp_link} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">{comm.whatsapp_link}</a>
                                  </div>
                                )}
                                {comm.discord_link && (
                                  <div className="text-gray-400 truncate font-semibold">
                                    Discord: <a href={comm.discord_link} target="_blank" rel="noreferrer" className="text-brandGreen hover:underline">{comm.discord_link}</a>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedCommunity(comm);
                                  setCommunityForm({
                                    title: comm.title,
                                    category_key: comm.category_key,
                                    badge: comm.badge,
                                    description: comm.description,
                                    members_count_text: comm.members_count_text,
                                    whatsapp_link: comm.whatsapp_link || '',
                                    discord_link: comm.discord_link || ''
                                  });
                                  setIsCommunityModalOpen(true);
                                }}
                                className="p-2 text-gray-500 hover:text-brandGreen bg-gray-50 hover:bg-brandGreen/5 rounded-lg transition-colors cursor-pointer"
                                title="Edit Community"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCommunity(comm.id)}
                                className="p-2 text-red-500 hover:text-red-700 bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                                title="Delete Community"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {paginatedCommunities.length === 0 && (
                          <div className="col-span-full bg-white rounded-2xl p-10 text-center text-gray-400 italic border border-gray-100">
                            No community rooms configured.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pagination */}
                    <AdminPagination
                      currentPage={communityPage}
                      totalItems={communities.length}
                      pageSize={ITEMS_PER_PAGE}
                      onPageChange={setCommunityPage}
                    />
                  </>
                );
              })()}
            </div>
          )}

          {/* VIEW: RESOURCES / MANAGING RESOURCES */}
          {activeSubTab === 'Resources' && !loading && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#090C11]">Manage Study Materials</h1>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">Upload PDF, ZIP study resource links for students.</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedResource(null);
                    setResourceForm({ title: '', description: '', category: 'CAF', type: 'PDF', downloads: 0, tag: '', tag_color: 'bg-blue-500/10 text-blue-600', btn_color: 'bg-blue-600 hover:bg-blue-700', download_url: '', is_featured: false });
                    setIsResourceModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-black text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Resource</span>
                </button>
              </div>

              {/* Search & View Toggle */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search resources by title or category..."
                    value={resourceSearch}
                    onChange={(e) => setResourceSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl text-xs focus:outline-none focus:border-brandGreen transition-colors"
                  />
                </div>
                {renderViewToggle(resourceViewMode, setResourceViewMode)}
              </div>

              {(() => {
                const filteredResources = resources.filter(r => (r.title || '').toLowerCase().includes(resourceSearch.toLowerCase()) || (r.category || '').toLowerCase().includes(resourceSearch.toLowerCase()));
                const paginatedResources = filteredResources.slice((resourcePage - 1) * ITEMS_PER_PAGE, resourcePage * ITEMS_PER_PAGE);

                return (
                  <>
                    {resourceViewMode === 'list' ? (
                      /* Table List View */
                      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#F8F9FB] text-gray-400 font-bold text-xs uppercase border-b border-gray-100">
                                <th className="p-4 pl-6">Title</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Downloads</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-600">
                              {paginatedResources.map(res => {
                                const resStatus = res.status || (res.published ? 'published' : 'pending_review');
                                const resId = res._id || res.id;
                                return (
                                <tr key={resId} className="hover:bg-[#F8F9FB]/50 transition-colors">
                                  <td className="p-4 pl-6">
                                    <div className="font-black text-[#090C11]">{res.title}</div>
                                    {res.description && <div className="text-[11px] text-gray-400 font-normal truncate max-w-sm">{res.description}</div>}
                                  </td>
                                  <td className="p-4">
                                    <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-600 rounded-full font-bold text-[10px]">
                                      {res.category}
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                      resStatus === 'published' || resStatus === 'approved'
                                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                        : resStatus === 'pending_review'
                                        ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse'
                                        : resStatus === 'rejected'
                                        ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                                        : 'bg-gray-500/10 text-gray-500'
                                    }`}>
                                      {resStatus === 'pending_review' ? 'Pending AI Review' : resStatus}
                                    </span>
                                  </td>
                                  <td className="p-4 font-bold text-gray-500 uppercase">{res.type || res.resourceType || 'PDF'}</td>
                                  <td className="p-4 font-normal text-gray-400">{res.downloads || 0}</td>
                                  <td className="p-4 pr-6 text-right space-x-1.5">
                                    {resStatus === 'pending_review' && (
                                      <>
                                        <button
                                          onClick={() => handleApproveResourceDirect(resId)}
                                          className="p-1.5 px-2.5 text-emerald-600 hover:text-white hover:bg-emerald-600 bg-emerald-500/10 rounded-lg transition-colors cursor-pointer text-xs font-bold"
                                          title="Approve & Publish"
                                        >
                                          Approve
                                        </button>
                                        <button
                                          onClick={() => handleRejectResourceDirect(resId)}
                                          className="p-1.5 px-2.5 text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-500/10 rounded-lg transition-colors cursor-pointer text-xs font-bold"
                                          title="Reject Resource"
                                        >
                                          Reject
                                        </button>
                                      </>
                                    )}
                                    <button
                                      onClick={() => {
                                        setSelectedResource(res);
                                        setResourceForm({
                                          title: res.title,
                                          description: res.description || '',
                                          category: res.category,
                                          type: res.type || res.resourceType || 'PDF',
                                          downloads: res.downloads,
                                          tag: res.tag || '',
                                          tag_color: res.tag_color || 'bg-blue-500/10 text-blue-600',
                                          btn_color: res.btn_color || 'bg-blue-600 hover:bg-blue-700',
                                          download_url: res.download_url || res.fileUrl || '',
                                          is_featured: res.is_featured || false
                                        });
                                        setIsResourceModalOpen(true);
                                      }}
                                      className="p-1.5 text-brandGreen hover:text-brandGreen-dark bg-brandGreen/5 rounded-lg transition-colors cursor-pointer text-xs font-bold"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteResource(resId)}
                                      className="p-1.5 text-red-500 hover:text-red-700 bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                                      title="Delete Resource"
                                    >
                                      <Trash2 className="w-4 h-4 inline" />
                                    </button>
                                  </td>
                                </tr>
                              );})}

                              {paginatedResources.length === 0 && (
                                <tr>
                                  <td colSpan="5" className="p-8 text-center text-gray-400 italic">
                                    No study resources found matching your search.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      /* Cards Grid View */
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedResources.map(res => (
                          <div key={res.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-600 font-bold rounded-full text-[10px]">
                                  {res.category}
                                </span>
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 font-mono font-bold rounded text-[10px] uppercase">
                                  {res.type}
                                </span>
                              </div>
                              <h3 className="text-base font-black text-[#090C11] mt-3 leading-tight">{res.title}</h3>
                              <p className="text-xs font-normal text-gray-500 mt-2 leading-relaxed line-clamp-2">
                                {res.description || 'Study material available for download.'}
                              </p>
                              <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400 font-semibold">
                                <span>Downloads: {res.downloads || 0}</span>
                                {res.tag && (
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${res.tag_color || 'bg-gray-100 text-gray-600'}`}>
                                    {res.tag}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                              {res.download_url ? (
                                <a
                                  href={res.download_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[11px] font-bold text-brandGreen hover:underline flex items-center space-x-1"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>View File</span>
                                </a>
                              ) : <span className="text-[11px] text-gray-400">No URL</span>}

                              <div className="flex items-center space-x-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedResource(res);
                                    setResourceForm({
                                      title: res.title,
                                      description: res.description || '',
                                      category: res.category,
                                      type: res.type,
                                      downloads: res.downloads,
                                      tag: res.tag || '',
                                      tag_color: res.tag_color || 'bg-blue-500/10 text-blue-600',
                                      btn_color: res.btn_color || 'bg-blue-600 hover:bg-blue-700',
                                      download_url: res.download_url || '',
                                      is_featured: res.is_featured || false
                                    });
                                    setIsResourceModalOpen(true);
                                  }}
                                  className="p-1.5 text-brandGreen hover:text-brandGreen-dark bg-brandGreen/5 rounded-lg transition-colors cursor-pointer text-xs font-bold"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteResource(res.id)}
                                  className="p-1.5 text-red-500 hover:text-red-700 bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Resource"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {paginatedResources.length === 0 && (
                          <div className="col-span-full bg-white rounded-2xl p-10 text-center text-gray-400 italic border border-gray-100">
                            No study resources found matching your search.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pagination */}
                    <AdminPagination
                      currentPage={resourcePage}
                      totalItems={filteredResources.length}
                      pageSize={ITEMS_PER_PAGE}
                      onPageChange={setResourcePage}
                    />
                  </>
                );
              })()}
            </div>
          )}

          {/* VIEW: ANNOUNCEMENTS */}
          {activeSubTab === 'Announcements' && !loading && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#090C11]">Manage Announcements</h1>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">Publish events and alert notices on the dashboard feed.</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedAnnouncement(null);
                    setAnnouncementForm({ title: '', summary: '', content: '', category: 'General', event_date: '' });
                    setIsAnnouncementModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-black text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Event</span>
                </button>
              </div>

              {/* Search & View Toggle */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search announcements by title, summary, or category..."
                    value={announcementSearch}
                    onChange={(e) => setAnnouncementSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl text-xs focus:outline-none focus:border-brandGreen transition-colors"
                  />
                </div>
                {renderViewToggle(announcementViewMode, setAnnouncementViewMode)}
              </div>

              {(() => {
                const filteredAnnouncements = announcements.filter(a => (a.title || '').toLowerCase().includes(announcementSearch.toLowerCase()) || (a.summary || '').toLowerCase().includes(announcementSearch.toLowerCase()) || (a.category || '').toLowerCase().includes(announcementSearch.toLowerCase()));
                const paginatedAnnouncements = filteredAnnouncements.slice((announcementPage - 1) * ITEMS_PER_PAGE, announcementPage * ITEMS_PER_PAGE);

                return (
                  <>
                    {announcementViewMode === 'list' ? (
                      /* Table List View */
                      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#F8F9FB] text-gray-400 font-bold text-xs uppercase border-b border-gray-100">
                                <th className="p-4 pl-6">Title</th>
                                <th className="p-4">Summary</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Event Date</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-600">
                              {paginatedAnnouncements.map(ann => (
                                <tr key={ann.id} className="hover:bg-[#F8F9FB]/50 transition-colors">
                                  <td className="p-4 pl-6 font-black text-[#090C11]">{ann.title}</td>
                                  <td className="p-4 font-normal text-gray-500 max-w-sm truncate">{ann.summary}</td>
                                  <td className="p-4">
                                    <span className="px-2.5 py-0.5 bg-purple-500/10 text-purple-600 rounded-full font-bold text-[10px]">
                                      {ann.category}
                                    </span>
                                  </td>
                                  <td className="p-4 font-bold text-gray-500">{ann.event_date || 'N/A'}</td>
                                  <td className="p-4 pr-6 text-right space-x-1.5">
                                    <button
                                      onClick={() => {
                                        setSelectedAnnouncement(ann);
                                        setAnnouncementForm({
                                          title: ann.title,
                                          summary: ann.summary,
                                          content: ann.content || '',
                                          category: ann.category,
                                          event_date: ann.event_date || ''
                                        });
                                        setIsAnnouncementModalOpen(true);
                                      }}
                                      className="p-1.5 text-brandGreen hover:text-brandGreen-dark bg-brandGreen/5 rounded-lg transition-colors cursor-pointer text-xs font-bold"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteAnnouncement(ann.id)}
                                      className="p-1.5 text-red-500 hover:text-red-700 bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                                      title="Delete Announcement"
                                    >
                                      <Trash2 className="w-4 h-4 inline" />
                                    </button>
                                  </td>
                                </tr>
                              ))}

                              {paginatedAnnouncements.length === 0 && (
                                <tr>
                                  <td colSpan="5" className="p-8 text-center text-gray-400 italic">
                                    No announcements found matching your search.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      /* Cards Grid View */
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedAnnouncements.map(ann => (
                          <div key={ann.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="px-2.5 py-0.5 bg-purple-500/10 text-purple-600 font-bold rounded-full text-[10px]">
                                  {ann.category}
                                </span>
                                {ann.event_date && (
                                  <span className="text-[11px] font-extrabold text-brandGreen flex items-center">
                                    <Calendar className="w-3.5 h-3.5 mr-1" /> {ann.event_date}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-base font-black text-[#090C11] mt-3 leading-tight">{ann.title}</h3>
                              <p className="text-xs font-normal text-gray-500 mt-2 leading-relaxed line-clamp-3">
                                {ann.summary}
                              </p>
                            </div>

                            <div className="pt-4 border-t border-gray-50 flex justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedAnnouncement(ann);
                                  setAnnouncementForm({
                                    title: ann.title,
                                    summary: ann.summary,
                                    content: ann.content || '',
                                    category: ann.category,
                                    event_date: ann.event_date || ''
                                  });
                                  setIsAnnouncementModalOpen(true);
                                }}
                                className="p-1.5 text-brandGreen hover:text-brandGreen-dark bg-brandGreen/5 rounded-lg transition-colors cursor-pointer text-xs font-bold"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAnnouncement(ann.id)}
                                className="p-1.5 text-red-500 hover:text-red-700 bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                                title="Delete Announcement"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {paginatedAnnouncements.length === 0 && (
                          <div className="col-span-full bg-white rounded-2xl p-10 text-center text-gray-400 italic border border-gray-100">
                            No announcements found matching your search.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pagination */}
                    <AdminPagination
                      currentPage={announcementPage}
                      totalItems={filteredAnnouncements.length}
                      pageSize={ITEMS_PER_PAGE}
                      onPageChange={setAnnouncementPage}
                    />
                  </>
                );
              })()}
            </div>
          )}

          {/* VIEW: BLOG POSTS CRUD */}
          {activeSubTab === 'Blog Posts' && !loading && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#090C11]">Manage Blog Articles</h1>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">Publish career guides, Big 4 tips, and student masterclasses.</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedBlog(null);
                    setBlogForm({
                      title: '',
                      category: 'Big 4 & Inductions',
                      authorName: 'Saboor Ahmad CA',
                      authorRole: 'Founder & Lead Career Mentor',
                      coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
                      summary: '',
                      content: '',
                      tags: 'Big 4, Career, ICAP',
                      readTime: '5 min read',
                      isFeatured: false,
                      status: 'published'
                    });
                    setIsBlogModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-black text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Blog Article</span>
                </button>
              </div>

              {/* Stat Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-brandGreen/10 text-brandGreen">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-[#090C11]">{blogs.length}</p>
                    <p className="text-[11px] font-semibold text-gray-400">Total Articles</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-[#090C11]">{blogs.filter(b => b.status === 'published').length}</p>
                    <p className="text-[11px] font-semibold text-gray-400">Published</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                    <EyeOff className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-[#090C11]">{blogs.filter(b => b.status === 'draft').length}</p>
                    <p className="text-[11px] font-semibold text-gray-400">Drafts</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-[#090C11]">{blogs.reduce((acc, b) => acc + (b.views || 0), 0)}</p>
                    <p className="text-[11px] font-semibold text-gray-400">Total Readers</p>
                  </div>
                </div>
              </div>

              {/* Search & Category Filter Bar */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search articles by title, topic, or keyword..."
                    value={blogSearch}
                    onChange={(e) => setBlogSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl text-xs focus:outline-none focus:border-brandGreen transition-colors"
                  />
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <select
                    value={blogCategoryFilter}
                    onChange={(e) => setBlogCategoryFilter(e.target.value)}
                    className="w-full sm:w-48 p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl text-xs focus:outline-none focus:border-brandGreen font-semibold text-gray-600 cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Big 4 & Inductions">Big 4 & Inductions</option>
                    <option value="CA Guidance">CA Guidance</option>
                    <option value="ACCA Careers">ACCA Careers</option>
                    <option value="Tax & Audit">Tax & Audit</option>
                    <option value="Study Tips">Study Tips</option>
                    <option value="Industry Insights">Industry Insights</option>
                  </select>

                  {renderViewToggle(blogViewMode, setBlogViewMode)}
                </div>
              </div>

              {(() => {
                const filteredBlogs = blogs
                  .filter(b => {
                    const matchesCat = blogCategoryFilter === 'All' || b.category === blogCategoryFilter;
                    const q = blogSearch.toLowerCase().trim();
                    const matchesQ = !q || b.title?.toLowerCase().includes(q) || b.summary?.toLowerCase().includes(q);
                    return matchesCat && matchesQ;
                  });
                const paginatedBlogs = filteredBlogs.slice((blogPage - 1) * ITEMS_PER_PAGE, blogPage * ITEMS_PER_PAGE);

                return (
                  <>
                    {blogViewMode === 'list' ? (
                      /* Table List View */
                      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#F8F9FB] text-gray-400 font-bold text-xs uppercase border-b border-gray-100">
                                <th className="p-4 pl-6">Article</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Author</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Views</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-600">
                              {paginatedBlogs.map(blog => (
                                <tr key={blog._id || blog.id} className="hover:bg-[#F8F9FB]/50 transition-colors">
                                  <td className="p-4 pl-6">
                                    <div className="flex items-center space-x-3.5 max-w-md">
                                      <img
                                        src={blog.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&auto=format&fit=crop&q=80'}
                                        alt={blog.title}
                                        className="w-14 h-10 rounded-lg object-cover border border-gray-100 shrink-0 bg-gray-100"
                                      />
                                      <div className="min-w-0">
                                        <div className="flex items-center space-x-1.5">
                                          <p className="font-black text-[#090C11] truncate">{blog.title}</p>
                                          {blog.isFeatured && (
                                            <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[9px] font-extrabold rounded">
                                              FEATURED
                                            </span>
                                          )}
                                        </div>
                                        <p className="font-normal text-gray-400 text-[11px] truncate mt-0.5">{blog.summary}</p>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="p-4">
                                    <span className="px-2.5 py-1 bg-emerald-500/10 text-brandGreen font-bold rounded-lg text-[11px]">
                                      {blog.category}
                                    </span>
                                  </td>

                                  <td className="p-4 font-normal text-gray-600">
                                    <div className="flex flex-col">
                                      <span className="font-bold text-[#090C11]">{blog.author?.name || 'Saboor Ahmad CA'}</span>
                                      <span className="text-[10px] text-gray-400">{blog.readTime || '4 min read'}</span>
                                    </div>
                                  </td>

                                  <td className="p-4">
                                    <span
                                      className={`px-2 py-0.5 rounded text-[11px] font-extrabold inline-flex items-center space-x-1 ${
                                        blog.status === 'published'
                                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                                      }`}
                                    >
                                      <span className={`w-1.5 h-1.5 rounded-full ${blog.status === 'published' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                                      <span className="capitalize">{blog.status || 'published'}</span>
                                    </span>
                                  </td>

                                  <td className="p-4 font-normal text-gray-500">
                                    {blog.views || 0}
                                  </td>

                                  <td className="p-4 pr-6 text-right space-x-1.5">
                                    {/* Toggle Publish */}
                                    <button
                                      onClick={() => handleToggleBlogPublish(blog)}
                                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                                        blog.status === 'published'
                                          ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                                          : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                                      }`}
                                      title={blog.status === 'published' ? 'Unpublish to Draft' : 'Publish Article'}
                                    >
                                      {blog.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>

                                    {/* Edit */}
                                    <button
                                      onClick={() => {
                                        setSelectedBlog(blog);
                                        setBlogForm({
                                          title: blog.title || '',
                                          category: blog.category || 'Big 4 & Inductions',
                                          authorName: blog.author?.name || 'Saboor Ahmad CA',
                                          authorRole: blog.author?.role || 'Founder & Lead Career Mentor',
                                          coverImage: blog.coverImage || '',
                                          summary: blog.summary || '',
                                          content: blog.content || '',
                                          tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
                                          readTime: blog.readTime || '5 min read',
                                          isFeatured: Boolean(blog.isFeatured),
                                          status: blog.status || 'published'
                                        });
                                        setIsBlogModalOpen(true);
                                      }}
                                      className="text-brandGreen hover:text-brandGreen-dark px-2.5 py-1 rounded bg-brandGreen/5 font-bold hover:bg-brandGreen/10 transition-colors cursor-pointer"
                                    >
                                      Edit
                                    </button>

                                    {/* Delete */}
                                    <button
                                      onClick={() => handleDeleteBlog(blog._id || blog.id)}
                                      className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-500/5 rounded transition-colors cursor-pointer"
                                      title="Delete Blog"
                                    >
                                      <Trash2 className="w-4 h-4 inline" />
                                    </button>
                                  </td>
                                </tr>
                              ))}

                              {paginatedBlogs.length === 0 && (
                                <tr>
                                  <td colSpan="6" className="p-8 text-center text-gray-400 italic">
                                    No blog articles found matching your criteria.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      /* Cards Grid View */
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedBlogs.map(blog => (
                          <div key={blog._id || blog.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4">
                            <div className="space-y-3">
                              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                                <img
                                  src={blog.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80'}
                                  alt={blog.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 left-2 px-2.5 py-1 bg-black/70 backdrop-blur-xs text-white text-[10px] font-extrabold rounded-lg">
                                  {blog.category}
                                </div>
                                {blog.isFeatured && (
                                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-amber-500 text-white text-[9px] font-black rounded uppercase">
                                    FEATURED
                                  </div>
                                )}
                              </div>

                              <div>
                                <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold mb-1">
                                  <span>{blog.author?.name || 'Saboor Ahmad CA'}</span>
                                  <span>{blog.readTime || '4 min read'}</span>
                                </div>
                                <h3 className="text-base font-black text-[#090C11] line-clamp-2 leading-tight">{blog.title}</h3>
                                <p className="text-xs font-normal text-gray-500 line-clamp-2 mt-2 leading-relaxed">{blog.summary}</p>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold inline-flex items-center space-x-1 ${
                                    blog.status === 'published'
                                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                                  }`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${blog.status === 'published' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                                  <span className="capitalize">{blog.status || 'published'}</span>
                                </span>
                                <span className="text-[10px] text-gray-400">{blog.views || 0} views</span>
                              </div>

                              <div className="flex items-center space-x-1.5">
                                <button
                                  onClick={() => handleToggleBlogPublish(blog)}
                                  className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                                  title={blog.status === 'published' ? 'Draft' : 'Publish'}
                                >
                                  {blog.status === 'published' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedBlog(blog);
                                    setBlogForm({
                                      title: blog.title || '',
                                      category: blog.category || 'Big 4 & Inductions',
                                      authorName: blog.author?.name || 'Saboor Ahmad CA',
                                      authorRole: blog.author?.role || 'Founder & Lead Career Mentor',
                                      coverImage: blog.coverImage || '',
                                      summary: blog.summary || '',
                                      content: blog.content || '',
                                      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
                                      readTime: blog.readTime || '5 min read',
                                      isFeatured: Boolean(blog.isFeatured),
                                      status: blog.status || 'published'
                                    });
                                    setIsBlogModalOpen(true);
                                  }}
                                  className="p-1.5 text-brandGreen hover:text-brandGreen-dark bg-brandGreen/5 rounded-lg transition-colors cursor-pointer"
                                  title="Edit Article"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteBlog(blog._id || blog.id)}
                                  className="p-1.5 text-red-500 hover:text-red-700 bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Article"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {paginatedBlogs.length === 0 && (
                          <div className="col-span-full bg-white rounded-2xl p-10 text-center text-gray-400 italic border border-gray-100">
                            No blog articles found matching your criteria.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pagination */}
                    <AdminPagination
                      currentPage={blogPage}
                      totalItems={filteredBlogs.length}
                      pageSize={ITEMS_PER_PAGE}
                      onPageChange={setBlogPage}
                    />
                  </>
                );
              })()}
            </div>
          )}

          {/* VIEW: USERS LIST */}
          {activeSubTab === 'Users List' && !loading && (
            effectiveIsModerator ? (
              <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-sm text-center space-y-4 max-w-lg mx-auto mt-12 animate-fadeIn">
                <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
                  🚫
                </div>
                <h2 className="text-xl font-black text-[#090C11]">Access Denied</h2>
                <p className="text-xs text-gray-500 leading-relaxed">
                  As a Content Moderator, you have access to manage website content, announcements, and resources, but User & Role Management is restricted exclusively to Platform Administrators.
                </p>
                <button
                  onClick={() => setActiveSubTab('Dashboard')}
                  className="px-5 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-[#090C11]">Manage User Profiles</h1>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">Configure account privileges, add users, and toggle platform access.</p>
                </div>
                <button
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New User</span>
                </button>
              </div>

              {/* Search & Filters */}
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by full name, username, or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl text-xs focus:outline-none focus:border-brandGreen transition-colors"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between sm:justify-start">
                  <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                    <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="flex-1 sm:flex-initial px-3 py-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl text-xs focus:outline-none focus:border-brandGreen text-gray-500 font-bold cursor-pointer"
                    >
                      <option value="All">All Roles</option>
                      <option value="student">Student / User</option>
                      <option value="mentor">Mentor</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Administrator</option>
                      <option value="team_head">Team Head</option>
                    </select>

                    <select
                      value={userStatusFilter}
                      onChange={(e) => setUserStatusFilter(e.target.value)}
                      className="flex-1 sm:flex-initial px-3 py-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl text-xs focus:outline-none focus:border-brandGreen text-gray-500 font-bold cursor-pointer"
                    >
                      <option value="All">All Status</option>
                      <option value="active">Active Only</option>
                      <option value="blocked">Blocked Only</option>
                    </select>
                  </div>

                  {renderViewToggle(userViewMode, setUserViewMode)}
                </div>
              </div>

              {(() => {
                const filteredUsers = profiles.filter(p => {
                  const searchStr = userSearch.toLowerCase();
                  const matchesSearch =
                    (p.full_name || '').toLowerCase().includes(searchStr) ||
                    (p.username || '').toLowerCase().includes(searchStr) ||
                    (p.email || '').toLowerCase().includes(searchStr);
                  const matchesRole = userRoleFilter === 'All'
                    ? true
                    : (userRoleFilter === 'student' || userRoleFilter === 'user')
                      ? (p.role === 'student' || p.role === 'user')
                      : p.role === userRoleFilter;
                  const matchesStatus = userStatusFilter === 'All'
                    ? true
                    : userStatusFilter === 'active'
                      ? (p.isActive !== false)
                      : (p.isActive === false);
                  return matchesSearch && matchesRole && matchesStatus;
                });
                const paginatedUsers = filteredUsers.slice((userPage - 1) * ITEMS_PER_PAGE, userPage * ITEMS_PER_PAGE);

                return (
                  <>
                    {userViewMode === 'list' ? (
                      /* Table View */
                      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#F8F9FB] text-gray-400 font-bold text-xs uppercase border-b border-gray-100">
                                <th className="p-4 pl-6">Profile</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role & Level</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Joined Date</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-600">
                              {paginatedUsers.map(p => {
                                const isBlocked = p.isActive === false;
                                const activeAdminEmail = session?.user?.email || 'admin@taxmancapital.com';
                                const isSelf = (p.email && p.email.toLowerCase() === activeAdminEmail.toLowerCase()) || p.role === 'team_head';
                                return (
                                  <tr key={p.id} className={`hover:bg-[#F8F9FB]/50 transition-colors ${isBlocked ? 'bg-red-50/20' : ''}`}>
                                    <td className="p-4 pl-6 flex items-center space-x-3">
                                      {(() => {
                                        const avatarSrc = resolveUserAvatar(p);
                                        return (
                                          <div className={`w-9 h-9 rounded-full font-bold flex items-center justify-center overflow-hidden flex-shrink-0 relative border border-gray-100 shadow-2xs ${
                                            isBlocked ? 'bg-red-500/10 text-red-600' : 'bg-brandGreen/10 text-brandGreen-dark'
                                          }`}>
                                            {avatarSrc ? (
                                              <img
                                                src={avatarSrc}
                                                alt={p.full_name || 'Avatar'}
                                                className="w-full h-full object-cover rounded-full"
                                                onError={(e) => {
                                                  e.currentTarget.style.display = 'none';
                                                  const fb = e.currentTarget.nextElementSibling;
                                                  if (fb) fb.style.display = 'flex';
                                                }}
                                              />
                                            ) : null}
                                            <span
                                              className="items-center justify-center text-xs font-black"
                                              style={{ display: avatarSrc ? 'none' : 'flex' }}
                                            >
                                              {p.full_name?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                          </div>
                                        );
                                      })()}
                                      <div className="flex flex-col truncate">
                                        <span className="text-[#090C11] font-black truncate">{p.full_name}</span>
                                        <span className="text-[10px] text-gray-400">@{p.username}</span>
                                      </div>
                                    </td>
                                    <td className="p-4 font-normal text-gray-500">{p.email}</td>
                                    <td className="p-4">
                                      <div className="flex flex-col space-y-1 items-start">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                            p.role === 'team_head' ? 'bg-amber-500/15 text-amber-600 border border-amber-200' :
                                            p.role === 'admin' ? 'bg-brandGreen/10 text-brandGreen-dark' :
                                            p.role === 'mentor' ? 'bg-purple-500/10 text-purple-600' :
                                            'bg-blue-500/10 text-blue-600'
                                          }`}>
                                          {p.role === 'team_head' ? 'Team Head' : p.role === 'student' ? 'Student' : p.role}
                                        </span>
                                        {p.level && (
                                          <span className="text-[10px] text-gray-400 font-semibold pl-1">
                                            Level: {p.level}
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="p-4">
                                      {isBlocked ? (
                                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-red-50 text-red-600 border border-red-200">
                                          <Ban className="w-3 h-3 text-red-500" />
                                          <span>Blocked</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                          <span>Active</span>
                                        </span>
                                      )}
                                    </td>
                                    <td className="p-4 font-normal text-gray-400">{p.created_at ? p.created_at.split('T')[0] : 'N/A'}</td>
                                    <td className="p-4 pr-6 text-right">
                                      <div className="flex items-center justify-end space-x-1.5">
                                        {/* Edit Profile Button */}
                                        <button
                                          onClick={() => handleOpenEditUser(p)}
                                          className="p-1.5 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                                          title="Edit User Details"
                                        >
                                          <Edit className="w-4 h-4" />
                                        </button>

                                        {/* Block / Unblock Toggle Button */}
                                        {!isSelf && (
                                          <button
                                            onClick={() => handleToggleBlockUser(p.id, !isBlocked)}
                                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                              isBlocked
                                                ? 'text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                                                : 'text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100'
                                            }`}
                                            title={isBlocked ? 'Unblock User' : 'Block / Suspend User'}
                                          >
                                            {isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                          </button>
                                        )}

                                        {/* Delete Profile Button */}
                                        {!isSelf && (
                                          <button
                                            onClick={() => handleDeleteProfile(p.id)}
                                            className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                            title="Delete User Account"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        )}

                                        {isSelf && (
                                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md">
                                            Active You
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                              {filteredUsers.length === 0 && (
                                <tr>
                                  <td colSpan="6" className="p-8 text-center text-gray-400 italic">
                                    No user profiles found matching your search and filter criteria.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      /* Grid Cards View */
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paginatedUsers.map(p => {
                          const isBlocked = p.isActive === false;
                          const activeAdminEmail = session?.user?.email || 'admin@taxmancapital.com';
                          const isSelf = (p.email && p.email.toLowerCase() === activeAdminEmail.toLowerCase()) || p.role === 'team_head';
                          return (
                            <div
                              key={p.id}
                              className={`bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                                isBlocked ? 'border-red-200 bg-red-50/15' : 'border-gray-100'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center space-x-3 min-w-0">
                                  {(() => {
                                    const avatarSrc = resolveUserAvatar(p);
                                    return (
                                      <div
                                        className={`w-11 h-11 rounded-2xl font-bold flex items-center justify-center overflow-hidden flex-shrink-0 text-base relative border border-gray-100 shadow-2xs ${
                                          isBlocked ? 'bg-red-500/10 text-red-600' : 'bg-brandGreen/10 text-brandGreen-dark'
                                        }`}
                                      >
                                        {avatarSrc ? (
                                          <img
                                            src={avatarSrc}
                                            alt={p.full_name || 'Avatar'}
                                            className="w-full h-full object-cover rounded-2xl"
                                            onError={(e) => {
                                              e.currentTarget.style.display = 'none';
                                              const fb = e.currentTarget.nextElementSibling;
                                              if (fb) fb.style.display = 'flex';
                                            }}
                                          />
                                        ) : null}
                                        <span
                                          className="items-center justify-center text-sm font-black"
                                          style={{ display: avatarSrc ? 'none' : 'flex' }}
                                        >
                                          {p.full_name?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                      </div>
                                    );
                                  })()}
                                  <div className="min-w-0">
                                    <h3 className="text-sm font-black text-[#090C11] truncate">{p.full_name}</h3>
                                    <p className="text-[11px] text-gray-400 font-semibold truncate">@{p.username}</p>
                                  </div>
                                </div>
                                {isBlocked ? (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-red-50 text-red-600 border border-red-200 flex-shrink-0">
                                    <Ban className="w-2.5 h-2.5 text-red-500" />
                                    <span>Blocked</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200 flex-shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span>Active</span>
                                  </span>
                                )}
                              </div>

                              <div className="space-y-2 pt-1 border-t border-gray-50 text-xs">
                                <div className="text-gray-500 truncate flex items-center space-x-1.5">
                                  <span className="text-gray-400 text-[10px] font-bold">Email:</span>
                                  <span className="truncate font-semibold text-gray-700">{p.email}</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                  <span
                                    className={`px-2 py-0.5 rounded-full font-extrabold uppercase text-[9px] ${
                                      p.role === 'team_head'
                                        ? 'bg-amber-500/15 text-amber-600 border border-amber-200'
                                        : p.role === 'admin'
                                        ? 'bg-brandGreen/10 text-brandGreen-dark'
                                        : p.role === 'mentor'
                                        ? 'bg-purple-500/10 text-purple-600'
                                        : 'bg-blue-500/10 text-blue-600'
                                    }`}
                                  >
                                    {p.role === 'team_head' ? 'Team Head' : p.role === 'student' ? 'Student' : p.role}
                                  </span>
                                  {p.level && (
                                    <span className="text-gray-400 font-bold text-[10px]">Level: {p.level}</span>
                                  )}
                                </div>
                              </div>

                              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-[10px] text-gray-400 font-semibold">
                                  {p.created_at ? p.created_at.split('T')[0] : 'N/A'}
                                </span>
                                <div className="flex items-center space-x-1.5">
                                  <button
                                    onClick={() => handleOpenEditUser(p)}
                                    className="p-1.5 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                                    title="Edit User Details"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  {!isSelf && (
                                    <button
                                      onClick={() => handleToggleBlockUser(p.id, !isBlocked)}
                                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                        isBlocked
                                          ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                                          : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                                      }`}
                                      title={isBlocked ? 'Unblock User' : 'Block User'}
                                    >
                                      {isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                    </button>
                                  )}
                                  {!isSelf && (
                                    <button
                                      onClick={() => handleDeleteProfile(p.id)}
                                      className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                      title="Delete User"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                  {isSelf && (
                                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                      Active You
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {filteredUsers.length === 0 && (
                          <div className="col-span-full p-8 text-center text-gray-400 italic bg-white rounded-2xl border border-gray-100">
                            No user profiles found matching your search and filter criteria.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pagination */}
                    <AdminPagination
                      currentPage={userPage}
                      totalItems={filteredUsers.length}
                      pageSize={ITEMS_PER_PAGE}
                      onPageChange={setUserPage}
                    />
                  </>
                );
              })()}
            </div>
            )
          )}

          {/* VIEW: MESSAGES (Contact Inbox) */}
          {activeSubTab === 'Messages' && !loading && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-[#090C11]">Contact Inquiries</h1>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">Read emails and feedback submitted by site visitors.</p>
                </div>
              </div>

              {/* Search & View Toggle */}
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search messages by sender name, email, subject, or keywords..."
                    value={messageSearch}
                    onChange={(e) => setMessageSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl text-xs focus:outline-none focus:border-brandGreen transition-colors"
                  />
                </div>
                {renderViewToggle(messageViewMode, setMessageViewMode)}
              </div>

              {(() => {
                const filteredMessages = messages.filter(m => {
                  const q = messageSearch.toLowerCase().trim();
                  return !q || (m.subject || '').toLowerCase().includes(q) || (m.name || '').toLowerCase().includes(q) || (m.email || '').toLowerCase().includes(q) || (m.message || '').toLowerCase().includes(q);
                });
                const paginatedMessages = filteredMessages.slice((messagePage - 1) * ITEMS_PER_PAGE, messagePage * ITEMS_PER_PAGE);

                return (
                  <>
                    {messageViewMode === 'list' ? (
                      /* Table List View */
                      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#F8F9FB] text-gray-400 font-bold text-xs uppercase border-b border-gray-100">
                                <th className="p-4 pl-6">Sender</th>
                                <th className="p-4">Subject & Message</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-600">
                              {paginatedMessages.map(msg => (
                                <tr key={msg.id} className="hover:bg-[#F8F9FB]/50 transition-colors">
                                  <td className="p-4 pl-6">
                                    <div className="font-black text-[#090C11]">{msg.name}</div>
                                    <div className="text-[11px] text-gray-400">{msg.email} {msg.phone && `• ${msg.phone}`}</div>
                                  </td>
                                  <td className="p-4 max-w-sm">
                                    <div className="font-bold text-[#090C11]">{msg.subject}</div>
                                    <p className="line-clamp-1 text-gray-400 text-[11px] font-normal mt-0.5">{msg.message}</p>
                                  </td>
                                  <td className="p-4">
                                    {msg.reply ? (
                                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-extrabold rounded-full inline-flex items-center space-x-1">
                                        <CheckCircle className="w-3 h-3" />
                                        <span>Replied</span>
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-extrabold rounded-full">
                                        Pending
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-4 text-[11px] text-gray-400 font-normal">
                                    {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ''}
                                  </td>
                                  <td className="p-4 pr-6 text-right space-x-1.5">
                                    <button
                                      onClick={() => {
                                        setSelectedMessageForReply(msg);
                                        setReplyText(msg.reply || '');
                                        setReplyModalOpen(true);
                                      }}
                                      className="p-1.5 text-brandGreen hover:text-brandGreen-dark bg-brandGreen/5 rounded-lg transition-colors cursor-pointer text-xs font-bold"
                                    >
                                      {msg.reply ? 'Edit Reply' : 'Reply'}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteMessage(msg.id)}
                                      className="p-1.5 text-red-500 hover:text-red-700 bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                                      title="Delete Message"
                                    >
                                      <Trash2 className="w-4 h-4 inline" />
                                    </button>
                                  </td>
                                </tr>
                              ))}

                              {paginatedMessages.length === 0 && (
                                <tr>
                                  <td colSpan="5" className="p-8 text-center text-gray-400 italic">
                                    No incoming messages found matching your search.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      /* Cards Grid View */
                      <div className="space-y-4">
                        {paginatedMessages.map(msg => (
                          <div key={msg.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-50 pb-3">
                              <div>
                                <h3 className="font-black text-sm text-[#090C11]">{msg.subject}</h3>
                                <p className="text-xs text-gray-400 font-semibold mt-1">
                                  From: <strong>{msg.name}</strong> ({msg.email}) {msg.phone && `• Ph: ${msg.phone}`}
                                </p>
                              </div>
                              <span className="text-[10px] text-gray-400 mt-2 sm:mt-0 font-bold">
                                {msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}
                              </span>
                            </div>

                            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap font-normal">
                              {msg.message}
                            </p>

                            {msg.reply && (
                              <div className="bg-brandGreen/5 border border-brandGreen/10 rounded-xl p-3.5 mt-2 space-y-1.5 text-xs text-left animate-fadeIn">
                                <span className="font-extrabold text-[10px] text-brandGreen uppercase">Admin Counseling Reply:</span>
                                <p className="text-navy font-bold leading-relaxed whitespace-pre-wrap">{msg.reply}</p>
                                <span className="text-[9px] text-gray-400 font-semibold block">Replied by {msg.replied_by || 'Counselor'} on {msg.replied_at ? new Date(msg.replied_at).toLocaleString() : 'N/A'}</span>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                              <button
                                onClick={() => {
                                  setSelectedMessageForReply(msg);
                                  setReplyText(msg.reply || '');
                                  setReplyModalOpen(true);
                                }}
                                className="text-xs text-brandGreen hover:text-brandGreen-dark font-bold flex items-center space-x-1 hover:bg-brandGreen/5 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                <span>{msg.reply ? 'Edit Counseling Reply' : 'Answer Counseling Query'}</span>
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center space-x-1 hover:bg-red-500/5 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Message</span>
                              </button>
                            </div>
                          </div>
                        ))}

                        {paginatedMessages.length === 0 && (
                          <p className="text-xs text-gray-400 italic text-center py-10">No incoming messages found.</p>
                        )}
                      </div>
                    )}

                    {/* Pagination */}
                    <AdminPagination
                      currentPage={messagePage}
                      totalItems={filteredMessages.length}
                      pageSize={ITEMS_PER_PAGE}
                      onPageChange={setMessagePage}
                    />
                  </>
                );
              })()}
            </div>
          )}

          {/* VIEW: PROFILE */}
          {activeSubTab === 'Profile' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm max-w-xl animate-fadeIn">
              <h2 className="text-lg font-black text-[#090C11] mb-6 font-sans">Edit Admin Profile</h2>

              <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
                {/* Profile Image Upload Component */}
                <div className="border-b border-gray-100 pb-6 space-y-4">
                  <div className="flex items-center space-x-5">
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-brandGreen to-emerald-400 text-white font-black flex items-center justify-center border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
                      {adminProfile.avatar_url ? (
                        <img src={adminProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl">{adminProfile.full_name?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span className="font-extrabold text-sm text-gray-800">Admin Profile Picture</span>
                      <span className="text-[10px] text-gray-400 mt-1 font-semibold">Upload an image file from your device or paste an image URL.</span>
                      {adminProfile.avatar_url && (
                        <button
                          type="button"
                          onClick={() => setAdminProfile(prev => ({ ...prev, avatar_url: '' }))}
                          className="text-red-500 hover:text-red-600 font-bold mt-2 text-left self-start cursor-pointer hover:underline"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>

                  <DualMediaUpload
                    value={adminProfile.avatar_url}
                    onChange={(url) => setAdminProfile(prev => ({ ...prev, avatar_url: url }))}
                    label="Choose Profile Photo (Device File or Image URL)"
                    accept="image/*"
                    maxSizeMB={5}
                  />
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <label className="font-bold text-gray-500">Full Name</label>
                    <input
                      type="text"
                      required
                      value={adminProfile.full_name}
                      onChange={(e) => setAdminProfile({ ...adminProfile, full_name: e.target.value })}
                      className="p-3 border border-gray-100 bg-[#F8F9FB] rounded-xl focus:outline-none focus:border-brandGreen focus:bg-white transition-all font-semibold text-gray-700 text-sm"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-bold text-gray-500">Username</label>
                    <input
                      type="text"
                      required
                      value={adminProfile.username}
                      onChange={(e) => setAdminProfile({ ...adminProfile, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                      className="p-3 border border-gray-100 bg-[#F8F9FB] rounded-xl focus:outline-none focus:border-brandGreen focus:bg-white transition-all font-semibold text-gray-700 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-gray-400">Email Address (Read-only)</label>
                      <input
                        type="email"
                        disabled
                        value={session?.user?.email || 'admin@taxman.com'}
                        className="p-3 border border-gray-100 bg-gray-50 rounded-xl font-semibold text-gray-400 cursor-not-allowed text-sm"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-gray-400">Role (Read-only)</label>
                      <input
                        type="text"
                        disabled
                        value="Administrator"
                        className="p-3 border border-gray-100 bg-gray-50 rounded-xl font-semibold text-gray-400 cursor-not-allowed text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-3 bg-brandGreen hover:bg-brandGreen-dark text-white font-black rounded-xl shadow-md transition-all active:scale-95 text-center text-sm disabled:opacity-50 cursor-pointer"
                  >
                    {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* MOCKED VIEWS */}
          {activeSubTab === 'Career Path' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center py-12 animate-fadeIn">
              <h2 className="text-lg font-black text-[#090C11]">Career Path Map</h2>
              <p className="text-xs text-gray-400 mt-2">Manage student career tracks and course progression guides.</p>
            </div>
          )}

        </div>
      </main>

      {/* ========================================== */}
      {/* 4. CRUD FORMS & OVERLAY MODALS */}
      {/* ========================================== */}

      {/* MODAL: JOBS CRUD */}
      <PortalModal isOpen={isJobModalOpen} onClose={() => setIsJobModalOpen(false)} maxWidth="max-w-lg" className="p-4 sm:p-6 space-y-4 max-h-[88vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 flex-shrink-0">
          <h3 className="text-base font-black text-[#090C11]">
            {selectedJob ? 'Edit Placement Details' : 'Publish Placement Opportunity'}
          </h3>
          <button onClick={() => setIsJobModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleJobSubmit} className="space-y-3.5 text-xs overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-500">Company Name</label>
              <input
                type="text"
                required
                value={jobForm.company}
                onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-500">Job Title</label>
              <input
                type="text"
                required
                value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-500">Location (City / Base)</label>
              <input
                type="text"
                required
                placeholder="e.g. Lahore / Dubai / London"
                value={jobForm.location}
                onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-500">Country</label>
              <select
                value={jobForm.country || (jobForm.is_overseas ? 'UAE' : 'Pakistan')}
                onChange={(e) => {
                  const val = e.target.value;
                  setJobForm({
                    ...jobForm,
                    country: val,
                    is_overseas: val !== 'Pakistan'
                  });
                }}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen font-medium text-gray-700"
              >
                <option value="Pakistan">🇵🇰 Pakistan</option>
                <option value="UAE">🇦🇪 UAE (Dubai / Abu Dhabi)</option>
                <option value="Saudi Arabia">🇸🇦 Saudi Arabia (Riyadh / Jeddah)</option>
                <option value="Qatar">🇶🇦 Qatar (Doha)</option>
                <option value="Oman">🇴🇲 Oman (Muscat)</option>
                <option value="UK">🇬🇧 United Kingdom</option>
                <option value="Other">🌍 Other International</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-500">Target Level / Qualification</label>
              <select
                required
                value={jobForm.level}
                onChange={(e) => setJobForm({ ...jobForm, level: e.target.value })}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen font-medium text-gray-700"
              >
                <option value="">-- Select Target Qualification --</option>
                <option value="PRC">PRC (Foundation)</option>
                <option value="CAF / CA Inter">CAF / CA Inter (Inductions / Training)</option>
                <option value="ACCA Finalist">ACCA Finalist (Internships & Training)</option>
                <option value="ACCA Affiliate">ACCA Affiliate (Trainee & Roles)</option>
                <option value="CA Finalist">CA Finalist (Articles Done - Employment)</option>
                <option value="CA Qualified">CA Qualified (Professional Positions)</option>
                <option value="ACCA Member">ACCA Member (Professional Positions)</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-500">Work Mode</label>
              <select
                value={jobForm.workMode || 'On-site'}
                onChange={(e) => setJobForm({ ...jobForm, workMode: e.target.value })}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen font-medium text-gray-700"
              >
                <option value="On-site">🏢 On-site</option>
                <option value="Virtual / Remote">🌐 Virtual / Remote</option>
                <option value="Hybrid">🔄 Hybrid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-500">Placement Type</label>
              <select
                value={jobForm.job_type}
                onChange={(e) => setJobForm({ ...jobForm, job_type: e.target.value })}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
              >
                <option value="Articleship">Articleship / Induction</option>
                <option value="Internship">Internship (Audit / Tax)</option>
                <option value="Full-time">Full-time Job</option>
                <option value="Contract">Contract Placement</option>
                <option value="Part-time">Part-time Job</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-gray-500 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-brandGreen" />
                  <span>Deadline</span>
                </label>
                {jobForm.deadline && (
                  <span className="text-[10px] font-bold text-brandGreen">
                    {jobForm.deadline}
                  </span>
                )}
              </div>
              <input
                type="date"
                required
                value={jobForm.raw_deadline || (jobForm.deadline && /^\d{4}-\d{2}-\d{2}$/.test(jobForm.deadline) ? jobForm.deadline : '')}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) {
                    setJobForm({ ...jobForm, raw_deadline: '', deadline: '' });
                    return;
                  }
                  try {
                    const d = new Date(val);
                    const formatted = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                    setJobForm({
                      ...jobForm,
                      raw_deadline: val,
                      deadline: formatted
                    });
                  } catch {
                    setJobForm({ ...jobForm, raw_deadline: val, deadline: val });
                  }
                }}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen cursor-pointer font-medium text-gray-700"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 py-1">
            <input
              type="checkbox"
              id="is_overseas"
              checked={jobForm.is_overseas}
              onChange={(e) => {
                const checked = e.target.checked;
                setJobForm({
                  ...jobForm,
                  is_overseas: checked,
                  country: checked ? (jobForm.country === 'Pakistan' ? 'UAE' : jobForm.country) : 'Pakistan'
                });
              }}
              className="rounded text-brandGreen focus:ring-brandGreen"
            />
            <label htmlFor="is_overseas" className="font-bold text-gray-500 select-none">This is an international/overseas listing (Gulf / Europe)</label>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-bold text-gray-500">Job Description</label>
            <textarea
              required
              rows="3"
              value={jobForm.description}
              onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
              className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-bold text-gray-500">Key Requirements (Comma-separated)</label>
            <input
              type="text"
              placeholder="CA Qualified, 1 year experience, Strong analytical skills"
              value={jobForm.requirements}
              onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
              className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brandGreen hover:bg-brandGreen-dark text-white font-black rounded-xl shadow-md transition-all active:scale-95 mt-2 text-center"
          >
            {selectedJob ? 'Save Changes' : 'Publish Opportunity'}
          </button>
        </form>
      </PortalModal>

      {/* MODAL: RESOURCES CRUD */}
      <PortalModal isOpen={isResourceModalOpen} onClose={() => setIsResourceModalOpen(false)} maxWidth="max-w-lg" className="p-4 sm:p-6 space-y-4 max-h-[88vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 flex-shrink-0">
          <h3 className="text-base font-black text-[#090C11]">
            {selectedResource ? 'Edit Resource' : 'Add New Study Resource'}
          </h3>
          <button onClick={() => setIsResourceModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleResourceSubmit} className="space-y-3.5 text-xs overflow-y-auto pr-1">
          <div className="flex flex-col space-y-1">
            <label className="font-bold text-gray-500">Resource Title</label>
            <input
              type="text"
              required
              value={resourceForm.title}
              onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
              className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-500">Category</label>
              <select
                value={resourceForm.category}
                onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value })}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
              >
                <option value="PRC">PRC</option>
                <option value="CAF">CAF</option>
                <option value="Training/Induction">Training/Induction</option>
                <option value="CFAP & SCS (Finals)">CFAP & SCS (Finals)</option>
                <option value="CA Qualified">CA Qualified</option>
                <option value="ACCA">ACCA</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-500">File Type</label>
              <input
                type="text"
                required
                placeholder="e.g. PDF"
                value={resourceForm.type}
                onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-500">Tag Label</label>
              <input
                type="text"
                placeholder="e.g. Notes / CV"
                value={resourceForm.tag}
                onChange={(e) => setResourceForm({ ...resourceForm, tag: e.target.value })}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
              />
            </div>
            <div className="flex flex-col space-y-1 sm:col-span-2">
              <DualMediaUpload
                type="file"
                label="Resource Document / Download File *"
                value={resourceForm.download_url}
                onChange={(val) => setResourceForm({ ...resourceForm, download_url: val })}
                accept=".pdf,.doc,.docx,.zip,.xlsx,.xls"
                placeholder="https://example.com/file.pdf or Google Drive link"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-bold text-gray-500">Description</label>
            <textarea
              rows="2"
              value={resourceForm.description}
              onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
              className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
            />
          </div>

          <div className="flex items-center space-x-2 py-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={resourceForm.is_featured}
              onChange={(e) => setResourceForm({ ...resourceForm, is_featured: e.target.checked })}
              className="rounded text-brandGreen focus:ring-brandGreen"
            />
            <label htmlFor="is_featured" className="font-bold text-gray-500 select-none">Feature this resource on the main page</label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brandGreen hover:bg-brandGreen-dark text-white font-black rounded-xl shadow-md transition-all active:scale-95 mt-2 text-center"
          >
            {selectedResource ? 'Save Changes' : 'Upload Resource'}
          </button>
        </form>
      </PortalModal>

      {/* MODAL: ANNOUNCEMENTS CRUD */}
      <PortalModal isOpen={isAnnouncementModalOpen} onClose={() => setIsAnnouncementModalOpen(false)} maxWidth="max-w-lg" className="p-4 sm:p-6 space-y-4 max-h-[88vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 flex-shrink-0">
          <h3 className="text-base font-black text-[#090C11]">
            {selectedAnnouncement ? 'Edit Announcement/Event' : 'Publish Announcement/Event'}
          </h3>
          <button onClick={() => setIsAnnouncementModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAnnouncementSubmit} className="space-y-3.5 text-xs overflow-y-auto pr-1">
          <div className="flex flex-col space-y-1">
            <label className="font-bold text-gray-500">Title</label>
            <input
              type="text"
              required
              value={announcementForm.title}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
              className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-500">Category</label>
              <select
                value={announcementForm.category}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, category: e.target.value })}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
              >
                <option value="General">General</option>
                <option value="Event">Event / Webinar</option>
                <option value="Workshop">Workshop</option>
                <option value="Inductions">Jobs & Inductions</option>
                <option value="Official Notices">Official Notices</option>
                <option value="Study Updates">Study Updates</option>
                <option value="Alert">Alert</option>
                <option value="News">News</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-gray-500 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-brandGreen" />
                  <span>Event / Notice Date</span>
                </label>
                {announcementForm.event_date && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brandGreen/10 text-brandGreen">
                    {announcementForm.event_date}
                  </span>
                )}
              </div>
              <input
                type="date"
                value={announcementForm.raw_date || (announcementForm.event_date && /^\d{4}-\d{2}-\d{2}$/.test(announcementForm.event_date) ? announcementForm.event_date : '')}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) {
                    setAnnouncementForm({ ...announcementForm, raw_date: '', event_date: '' });
                    return;
                  }
                  try {
                    const d = new Date(val);
                    const day = d.getDate().toString().padStart(2, '0');
                    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                    setAnnouncementForm({
                      ...announcementForm,
                      raw_date: val,
                      event_date: `${day} ${month}`
                    });
                  } catch {
                    setAnnouncementForm({ ...announcementForm, raw_date: val, event_date: val });
                  }
                }}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen cursor-pointer font-medium text-gray-700"
              />
              {/* Quick Preset Buttons */}
              <div className="flex items-center space-x-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    const iso = today.toISOString().split('T')[0];
                    const day = today.getDate().toString().padStart(2, '0');
                    const month = today.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                    setAnnouncementForm({
                      ...announcementForm,
                      raw_date: iso,
                      event_date: `${day} ${month}`
                    });
                  }}
                  className="px-2 py-0.5 text-[10px] font-bold rounded bg-gray-100 hover:bg-brandGreen/10 hover:text-brandGreen text-gray-500 transition-colors cursor-pointer"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const tmrw = new Date();
                    tmrw.setDate(tmrw.getDate() + 1);
                    const iso = tmrw.toISOString().split('T')[0];
                    const day = tmrw.getDate().toString().padStart(2, '0');
                    const month = tmrw.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                    setAnnouncementForm({
                      ...announcementForm,
                      raw_date: iso,
                      event_date: `${day} ${month}`
                    });
                  }}
                  className="px-2 py-0.5 text-[10px] font-bold rounded bg-gray-100 hover:bg-brandGreen/10 hover:text-brandGreen text-gray-500 transition-colors cursor-pointer"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nextW = new Date();
                    nextW.setDate(nextW.getDate() + 7);
                    const iso = nextW.toISOString().split('T')[0];
                    const day = nextW.getDate().toString().padStart(2, '0');
                    const month = nextW.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                    setAnnouncementForm({
                      ...announcementForm,
                      raw_date: iso,
                      event_date: `${day} ${month}`
                    });
                  }}
                  className="px-2 py-0.5 text-[10px] font-bold rounded bg-gray-100 hover:bg-brandGreen/10 hover:text-brandGreen text-gray-500 transition-colors cursor-pointer"
                >
                  +7 Days
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-bold text-gray-500">Short Summary</label>
            <input
              type="text"
              required
              value={announcementForm.summary}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, summary: e.target.value })}
              className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-bold text-gray-500">Full Content Text</label>
            <textarea
              rows="3"
              value={announcementForm.content}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
              className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brandGreen hover:bg-brandGreen-dark text-white font-black rounded-xl shadow-md transition-all active:scale-95 mt-2 text-center"
          >
            {selectedAnnouncement ? 'Save Changes' : 'Publish Announcement'}
          </button>
        </form>
      </PortalModal>

      {/* MODAL: BLOG POST CRUD */}
      <PortalModal isOpen={isBlogModalOpen} onClose={() => setIsBlogModalOpen(false)} maxWidth="max-w-5xl" className="p-4 sm:p-6 space-y-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-base font-black text-[#090C11] flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-brandGreen" />
            <span>{selectedBlog ? 'Edit Blog Article' : 'Write & Publish Blog Article'}</span>
          </h3>
          <button onClick={() => setIsBlogModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleBlogSubmit} className="space-y-4 text-xs max-h-[82vh] overflow-y-auto pr-1">
          <div className="flex flex-col space-y-1">
            <label className="font-bold text-gray-700">Article Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Big 4 Trainee Inductions 2026: Complete Strategy"
              value={blogForm.title}
              onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
              className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl focus:outline-none focus:border-brandGreen font-bold text-gray-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-700">Category *</label>
              <select
                value={blogForm.category}
                onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl focus:outline-none focus:border-brandGreen font-medium text-gray-700"
              >
                <option value="Big 4 & Inductions">Big 4 & Inductions</option>
                <option value="CA Guidance">CA Guidance</option>
                <option value="ACCA Careers">ACCA Careers</option>
                <option value="Tax & Audit">Tax & Audit</option>
                <option value="Study Tips">Study Tips</option>
                <option value="Industry Insights">Industry Insights</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-700">Author Name</label>
              <input
                type="text"
                value={blogForm.authorName}
                onChange={(e) => setBlogForm({ ...blogForm, authorName: e.target.value })}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl focus:outline-none focus:border-brandGreen"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-700">Estimated Read Time</label>
              <input
                type="text"
                placeholder="e.g. 5 min read"
                value={blogForm.readTime}
                onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl focus:outline-none focus:border-brandGreen"
              />
            </div>
          </div>

          <DualMediaUpload
            type="image"
            label="Cover Image (Web URL or Upload from Device)"
            value={blogForm.coverImage}
            onChange={(val) => setBlogForm({ ...blogForm, coverImage: val })}
            presets={[
              { label: 'Corporate / Big 4', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80' },
              { label: 'Study / Books', url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80' },
              { label: 'Global / Aviation', url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1200&auto=format&fit=crop&q=80' }
            ]}
          />

          <div className="flex flex-col space-y-1">
            <label className="font-bold text-gray-700">Short Summary / Excerpt *</label>
            <textarea
              rows="2"
              required
              placeholder="A brief 1-2 sentence overview shown on article cards..."
              value={blogForm.summary}
              onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
              className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl focus:outline-none focus:border-brandGreen"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="font-bold text-gray-700 flex items-center justify-between">
              <span>Full Article Content * (WordPress-style Rich Editor)</span>
              <span className="text-[10px] text-gray-400 font-normal">Use toolbar to format headings, add links, lists & quotes</span>
            </label>
            <RichBlogEditor
              value={blogForm.content}
              onChange={(newContent) => setBlogForm(prev => ({ ...prev, content: newContent }))}
              onReadTimeChange={(rt) => setBlogForm(prev => ({ ...prev, readTime: rt }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-700">Topic Tags (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Big 4, PwC, Induction, CFAP"
                value={blogForm.tags}
                onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl focus:outline-none focus:border-brandGreen"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-700">Publication Status</label>
              <select
                value={blogForm.status}
                onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value })}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl focus:outline-none focus:border-brandGreen font-bold"
              >
                <option value="published">Published (Visible to Public)</option>
                <option value="draft">Draft (Hidden from Public)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="blog_is_featured"
              checked={blogForm.isFeatured}
              onChange={(e) => setBlogForm({ ...blogForm, isFeatured: e.target.checked })}
              className="rounded text-brandGreen focus:ring-brandGreen cursor-pointer"
            />
            <label htmlFor="blog_is_featured" className="font-bold text-gray-700 select-none cursor-pointer">
              Pin as Featured Masterclass at top of Blog page
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brandGreen hover:bg-brandGreen-dark text-white font-black rounded-xl shadow-md transition-all active:scale-95 text-center cursor-pointer text-sm"
          >
            {selectedBlog ? 'Save & Update Article' : 'Publish Blog Article'}
          </button>
        </form>
      </PortalModal>

      {/* MODAL: COMMUNITY CRUD */}
      <PortalModal isOpen={isCommunityModalOpen} onClose={() => setIsCommunityModalOpen(false)} maxWidth="max-w-lg" className="p-4 sm:p-6 space-y-4 max-h-[88vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 flex-shrink-0">
          <h3 className="text-base font-black text-[#090C11]">
            {selectedCommunity ? 'Edit Study Group' : 'Add Study Group Room'}
          </h3>
          <button onClick={() => setIsCommunityModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCommunitySubmit} className="space-y-3.5 text-xs overflow-y-auto pr-1">
          <div className="flex flex-col space-y-1">
            <label className="font-bold text-gray-500">Study Group Title</label>
            <input
              type="text"
              required
              placeholder="e.g. CAF Intermediate Group"
              value={communityForm.title}
              onChange={(e) => setCommunityForm({ ...communityForm, title: e.target.value })}
              className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-500">Category Key</label>
              <select
                value={communityForm.category_key}
                onChange={(e) => setCommunityForm({ ...communityForm, category_key: e.target.value })}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
              >
                <option value="prc">PRC (Entry Level)</option>
                <option value="caf">CAF (Intermediate)</option>
                <option value="cfap">CFAP & SCS (Finals)</option>
                <option value="acca">ACCA</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-500">Members Count Text</label>
              <input
                type="text"
                required
                placeholder="e.g. 1,500+ Members"
                value={communityForm.members_count_text}
                onChange={(e) => setCommunityForm({ ...communityForm, members_count_text: e.target.value })}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-500">WhatsApp Link URL</label>
              <input
                type="text"
                placeholder="https://chat.whatsapp.com/..."
                value={communityForm.whatsapp_link}
                onChange={(e) => setCommunityForm({ ...communityForm, whatsapp_link: e.target.value })}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-500">Discord Link URL</label>
              <input
                type="text"
                placeholder="https://discord.gg/..."
                value={communityForm.discord_link}
                onChange={(e) => setCommunityForm({ ...communityForm, discord_link: e.target.value })}
                className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-bold text-gray-500">Description</label>
            <textarea
              required
              rows="3"
              value={communityForm.description}
              onChange={(e) => setCommunityForm({ ...communityForm, description: e.target.value })}
              className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#00C853] text-white font-extrabold rounded-xl text-xs hover:bg-[#00B248] transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
          >
            {selectedCommunity ? 'Save Changes' : 'Publish Study Group'}
          </button>
        </form>
      </PortalModal>

      {/* MODAL: VIDEO & PODCAST CRUD */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-4 sm:p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-[#090C11] flex items-center space-x-2">
                <Tv className="w-5 h-5 text-brandGreen" />
                <span>{selectedVideo ? 'Edit Video / Podcast' : 'Upload New Video / Podcast'}</span>
              </h3>
              <button onClick={() => setIsVideoModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-3.5 text-xs">
              <div className="flex flex-col space-y-1">
                <label className="font-bold text-gray-500">Video Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ICAP Firm Induction Guide 2026"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-bold text-gray-500">YouTube Video Link or Video ID</label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/watch?v=L_LUpnjgPso OR L_LUpnjgPso"
                  value={videoForm.youtubeId}
                  onChange={(e) => setVideoForm({ ...videoForm, youtubeId: e.target.value })}
                  className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
                />
                <span className="text-[10px] text-gray-400">Pastes full YouTube link or 11-char ID.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-gray-500">Category</label>
                  <select
                    value={videoForm.type}
                    onChange={(e) => setVideoForm({ ...videoForm, type: e.target.value })}
                    className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
                  >
                    <option value="Inductions & Guidance">Inductions & Guidance</option>
                    <option value="Podcasts & Interviews">Podcasts & Interviews</option>
                    <option value="Exam Preparation">Exam Preparation</option>
                    <option value="Career & Overseas">Career & Overseas</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-gray-500">Target Qualification</label>
                  <select
                    value={videoForm.qualification}
                    onChange={(e) => setVideoForm({ ...videoForm, qualification: e.target.value })}
                    className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
                  >
                    <option value="CA">CA (ICAP)</option>
                    <option value="ACCA">ACCA</option>
                    <option value="Corporate / Tax">Corporate / Tax</option>
                    <option value="All">All Students</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-gray-500">Speaker / Guest</label>
                  <input
                    type="text"
                    required
                    value={videoForm.guest}
                    onChange={(e) => setVideoForm({ ...videoForm, guest: e.target.value })}
                    className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-gray-500">Video Duration (e.g. "42:15")</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 35:20"
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-bold text-gray-500">Description</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Key takeaways and topic summary..."
                  value={videoForm.desc}
                  onChange={(e) => setVideoForm({ ...videoForm, desc: e.target.value })}
                  className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
                />
              </div>

              <DualMediaUpload
                type="image"
                label="Custom Thumbnail Image (Optional)"
                value={videoForm.thumbnail}
                onChange={(val) => setVideoForm({ ...videoForm, thumbnail: val })}
                placeholder="Auto-generated from YouTube if left empty"
              />

              <div className="flex items-center space-x-2 py-1">
                <input
                  type="checkbox"
                  id="video_is_featured"
                  checked={videoForm.isFeatured}
                  onChange={(e) => setVideoForm({ ...videoForm, isFeatured: e.target.checked })}
                  className="rounded text-brandGreen focus:ring-brandGreen"
                />
                <label htmlFor="video_is_featured" className="font-bold text-gray-700 select-none">
                  Set as Featured Spotlight on Podcasts & Media page
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brandGreen hover:bg-brandGreen-dark text-white font-black rounded-xl shadow-md transition-all active:scale-95 mt-2 text-center cursor-pointer"
              >
                {selectedVideo ? 'Save Changes' : 'Upload Video'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CUSTOM CONFIRM ACTION */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-5 shadow-2xl text-center animate-fadeIn">
            {/* Warning Alert Icon */}
            <div className="w-14 h-14 rounded-full bg-brandGreen/10 text-brandGreen flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-[#090C11]">
                {confirmModal.title}
              </h3>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed font-sans">
                {confirmModal.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmModal.onConfirm) confirmModal.onConfirm();
                }}
                className="py-2.5 bg-red-500 hover:bg-red-600 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ANSWER STUDENT CAREER QUERY */}
      <PortalModal
        isOpen={replyModalOpen && !!selectedMessageForReply}
        onClose={() => {
          setSelectedMessageForReply(null);
          setReplyModalOpen(false);
        }}
        maxWidth="max-w-lg"
        className="p-4 sm:p-6 space-y-4 text-left max-h-[88vh] flex flex-col"
      >
        {selectedMessageForReply && (
          <>
            <button
              onClick={() => {
                setSelectedMessageForReply(null);
                setReplyModalOpen(false);
              }}
              className="absolute right-4 top-4 p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-shrink-0">
              <span className="px-2 py-0.5 bg-brandGreen/10 text-brandGreen-dark text-[9px] font-black uppercase rounded">
                {selectedMessageForReply.category}
              </span>
              <h3 className="text-base font-black text-[#090C11] mt-2 leading-tight">
                Reply to: {selectedMessageForReply.subject}
              </h3>
              <p className="text-[10px] text-gray-400 mt-1 font-semibold">
                Sent by: <strong>{selectedMessageForReply.name}</strong> ({selectedMessageForReply.email})
              </p>
            </div>

            {/* Student's Question */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-xs font-semibold text-gray-500 leading-relaxed max-h-40 overflow-y-auto flex-shrink-0">
              <strong>Question details:</strong>
              <p className="mt-1 font-normal whitespace-pre-wrap">{selectedMessageForReply.message}</p>
            </div>

            {/* Draft Reply Form */}
            <form onSubmit={handleSubmitReply} className="space-y-4 overflow-y-auto pr-1">
              <div className="flex flex-col space-y-1 text-xs">
                <label className="font-extrabold text-navy uppercase tracking-wider">Your Counseling Advice:</label>
                <textarea
                  required
                  rows="5"
                  placeholder="Draft your detailed advice or answer for the student here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="p-3 border border-gray-100 bg-[#F8F9FB] rounded-xl focus:outline-none focus:border-brandGreen transition-all font-semibold text-gray-700 leading-relaxed resize-none text-sm"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMessageForReply(null);
                    setReplyModalOpen(false);
                  }}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={submittingReply}
                  className="px-5 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center space-x-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{submittingReply ? 'Submitting...' : 'Submit Counseling Advice'}</span>
                </button>
              </div>
            </form>
          </>
        )}
      </PortalModal>

      {/* EDIT USER PROFILE MODAL */}
      <PortalModal
        isOpen={isEditUserModalOpen && !!selectedUserForEdit}
        onClose={() => {
          setSelectedUserForEdit(null);
          setIsEditUserModalOpen(false);
        }}
        maxWidth="max-w-lg"
        className="p-4 sm:p-6 space-y-4 text-left max-h-[88vh] flex flex-col"
      >
        {selectedUserForEdit && (
          <>
            <button
              onClick={() => {
                setSelectedUserForEdit(null);
                setIsEditUserModalOpen(false);
              }}
              className="absolute right-4 top-4 p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-shrink-0">
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 text-[9px] font-black uppercase rounded">
                Admin User Management
              </span>
              <h3 className="text-xl font-black text-[#090C11] mt-1">
                Edit User Profile
              </h3>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">
                Update credentials, role permissions, and active status for @{userEditForm.username || 'user'}.
              </p>
            </div>

            <form onSubmit={handleSaveUserEdit} className="space-y-4 pt-2 overflow-y-auto pr-1">
              {/* Profile Image Preview & Edit */}
              <div className="flex items-center space-x-3.5 p-3 bg-[#F8F9FB] border border-gray-100 rounded-2xl">
                <div className="w-13 h-13 rounded-2xl overflow-hidden bg-brandGreen/10 text-brandGreen-dark flex items-center justify-center font-black text-lg flex-shrink-0 relative border border-gray-200 shadow-2xs">
                  {userEditForm.avatar_url ? (
                    <img
                      src={userEditForm.avatar_url}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : null}
                  <span
                    className="items-center justify-center"
                    style={{ display: userEditForm.avatar_url ? 'none' : 'flex' }}
                  >
                    {userEditForm.full_name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div>
                    <p className="text-xs font-bold text-[#090C11]">Profile Photo</p>
                    <p className="text-[10px] text-gray-400 font-medium">User profile picture (PNG, JPG, WebP)</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <label className="px-2.5 py-1 bg-white border border-gray-200 hover:border-brandGreen hover:text-brandGreen text-gray-700 rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-2xs">
                      {userEditForm.avatar_url ? 'Change Photo' : 'Upload Photo'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 1024 * 1024) {
                              alert("File size exceeds 1MB limit.");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setUserEditForm(prev => ({ ...prev, avatar_url: reader.result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {userEditForm.avatar_url && (
                      <button
                        type="button"
                        onClick={() => setUserEditForm(prev => ({ ...prev, avatar_url: '' }))}
                        className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={userEditForm.full_name}
                    onChange={(e) => setUserEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="e.g. Ahmad Raza"
                    className="w-full px-3 py-2 bg-[#F8F9FB] border border-gray-100 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-brandGreen"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Username</label>
                  <input
                    type="text"
                    required
                    value={userEditForm.username}
                    onChange={(e) => setUserEditForm(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="e.g. ahmad_caf"
                    className="w-full px-3 py-2 bg-[#F8F9FB] border border-gray-100 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-brandGreen"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={userEditForm.email}
                  onChange={(e) => setUserEditForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 bg-[#F8F9FB] border border-gray-100 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-brandGreen"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Account Role</label>
                  <select
                    value={userEditForm.role}
                    onChange={(e) => setUserEditForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#F8F9FB] border border-gray-100 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-brandGreen cursor-pointer"
                  >
                    <option value="student">Student / Candidate</option>
                    <option value="mentor">Mentor</option>
                    <option value="moderator">Moderator (Content Management)</option>
                    <option value="admin">Administrator</option>
                    <option value="team_head">Team Head</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Qualification / Level</label>
                  <select
                    value={userEditForm.level}
                    onChange={(e) => setUserEditForm(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#F8F9FB] border border-gray-100 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-brandGreen cursor-pointer"
                  >
                    <option value="PRC">PRC</option>
                    <option value="CAF">CAF</option>
                    <option value="CFAP">CFAP</option>
                    <option value="MSA">MSA</option>
                    <option value="ACCA">ACCA</option>
                    <option value="Qualified">Qualified</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Account Access Status</label>
                <div className="flex items-center space-x-3 p-3 bg-[#F8F9FB] border border-gray-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setUserEditForm(prev => ({ ...prev, isActive: true }))}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      userEditForm.isActive
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Active / Allowed</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserEditForm(prev => ({ ...prev, isActive: false }))}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      !userEditForm.isActive
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Blocked / Suspended</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUserForEdit(null);
                    setIsEditUserModalOpen(false);
                  }}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingUser}
                  className="px-5 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center space-x-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>{isSavingUser ? 'Saving Changes...' : 'Save User Changes'}</span>
                </button>
              </div>
            </form>
          </>
        )}
      </PortalModal>

      {/* ADD NEW USER MODAL */}
      <PortalModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        maxWidth="max-w-lg"
        className="p-4 sm:p-6 space-y-4 text-left max-h-[88vh] flex flex-col"
      >
        <button
          onClick={() => setIsAddUserModalOpen(false)}
          className="absolute right-4 top-4 p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-shrink-0">
          <span className="px-2 py-0.5 bg-brandGreen/10 text-brandGreen text-[9px] font-black uppercase rounded">
            Admin User Management
          </span>
          <h3 className="text-xl font-black text-[#090C11] mt-1">
            Add New User
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">
            Create a new student, mentor, or administrator account directly with login credentials.
          </p>
        </div>

        <form onSubmit={handleCreateNewUser} className="space-y-4 pt-2 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Full Name *</label>
              <input
                type="text"
                required
                value={addUserForm.full_name}
                onChange={(e) => setAddUserForm(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="e.g. Ahmad Raza"
                className="w-full px-3 py-2 bg-[#F8F9FB] border border-gray-100 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-brandGreen"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Username</label>
              <input
                type="text"
                value={addUserForm.username}
                onChange={(e) => setAddUserForm(prev => ({ ...prev, username: e.target.value }))}
                placeholder="e.g. ahmad_caf"
                className="w-full px-3 py-2 bg-[#F8F9FB] border border-gray-100 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-brandGreen"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Email Address *</label>
            <input
              type="email"
              required
              value={addUserForm.email}
              onChange={(e) => setAddUserForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="user@example.com"
              className="w-full px-3 py-2 bg-[#F8F9FB] border border-gray-100 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-brandGreen"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Password *</label>
            <input
              type="password"
              required
              minLength={6}
              value={addUserForm.password}
              onChange={(e) => setAddUserForm(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Min 6 characters"
              className="w-full px-3 py-2 bg-[#F8F9FB] border border-gray-100 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-brandGreen"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Account Role</label>
              <select
                value={addUserForm.role}
                onChange={(e) => setAddUserForm(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 bg-[#F8F9FB] border border-gray-100 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-brandGreen cursor-pointer"
              >
                <option value="student">Student / Candidate</option>
                <option value="mentor">Mentor</option>
                <option value="moderator">Moderator (Content Management)</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Qualification / Level</label>
              <select
                value={addUserForm.level}
                onChange={(e) => setAddUserForm(prev => ({ ...prev, level: e.target.value }))}
                className="w-full px-3 py-2 bg-[#F8F9FB] border border-gray-100 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-brandGreen cursor-pointer"
              >
                <option value="PRC">PRC</option>
                <option value="CAF">CAF</option>
                <option value="CFAP">CFAP</option>
                <option value="MSA">MSA</option>
                <option value="ACCA">ACCA</option>
                <option value="Qualified">Qualified</option>
              </select>
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Account Access Status</label>
            <div className="flex items-center space-x-3 p-3 bg-[#F8F9FB] border border-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setAddUserForm(prev => ({ ...prev, isActive: true }))}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  addUserForm.isActive
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Active / Allowed</span>
              </button>
              <button
                type="button"
                onClick={() => setAddUserForm(prev => ({ ...prev, isActive: false }))}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  !addUserForm.isActive
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Blocked / Suspended</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAddUserModalOpen(false)}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAddingUser}
              className="px-5 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingUser ? 'Creating User...' : 'Create Account'}</span>
            </button>
          </div>
        </form>
      </PortalModal>

    </div>
  );
}
