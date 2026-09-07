import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Briefcase,
  Users,
  BookOpen,
  Award,
  Bell,
  MapPin,
  Phone,
  Mail,
  Send,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  Clock,
  FileText,
  CheckSquare,
  FileCheck,
  Bookmark,
  Globe,
  Sparkles,
  Zap,
  TrendingUp,
  CheckCircle2,
  User,
  LayoutDashboard,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { AnimatedCounter, AnimatedSection, AnimatedCard, PageTransition, AntigravityCanvas } from '../../../components/motion/MotionSystem';
import mentorImage from '../../../assets/mentor_portrait.png';
import logoImg from '../../../assets/logo.png';
import tmBadge from '../../../assets/tm_badge.png';
import Jobs from '../Jobs/Jobs';
import Counseling from '../career_support/career_support';
import Community from '../Community/Community';
import Mission from '../Mission/Mission';
import Resources from '../Resources/Resources';
import Announcements from '../Announcements/Announcements';
import Contact from '../Contact/Contact';
import Login from '../Login/Login';
import AdminDashboard from '../AdminDashboard/AdminDashboard';
import UserDashboard from '../UserDashboard/UserDashboard';
import Events from '../Events/Events';
import Podcasts from '../Podcasts/Podcasts';
import CareerTools from '../CareerTools/CareerTools';
import Blog from '../Blog/Blog';
import NotificationPanel from '../../../components/NotificationPanel';
import BeginnerGuide from '../BeginnerGuide/BeginnerGuide';
import TermsAndPrivacyModal from '../../../components/legal/TermsAndPrivacyModal';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from '../../../services/notificationService';
import { getProfiles, logoutUser, registerUser, loginUser, requireAuth, getInitialSessionSync } from '../../../services/authService';
import { toggleBookmark as toggleUnifiedBookmark, getBookmarks, onBookmarksChange } from '../../../services/bookmarkService';
import { INITIAL_JOBS } from '../../../data/jobsData';
const parseRouteToTabState = () => {
  if (typeof window === 'undefined') {
    return { tab: 'Home', resourcesCategory: 'All', loginStartFlipped: false, scrollTarget: null };
  }
  const pathname = (window.location.pathname || '').replace(/^\/+|\/+$/g, '').toLowerCase();
  const hash = (window.location.hash || '').replace(/^#+/, '').toLowerCase();
  const route = pathname || hash || '';
  let tab = 'Home';
  let resourcesCategory = 'All';
  let loginStartFlipped = false;
  let scrollTarget = null;

  if (route === 'jobs') {
    tab = 'Jobs';
  } else if (route === 'inductions') {
    tab = 'Inductions';
  } else if (route === 'overseas') {
    tab = 'Overseas';
  } else if (route === 'guidance' || route === 'counseling' || route === 'careersupport') {
    tab = 'Counseling';
  } else if (route === 'careertools' || route === 'career-tools' || route === 'tools') {
    tab = 'Career Tools';
  } else if (route === 'communities' || route === 'community') {
    tab = 'Community';
  } else if (route === 'podcasts' || route === 'videos' || route === 'sessions') {
    tab = 'Podcasts';
  } else if (route === 'mission' || route === 'our-mission') {
    tab = 'Our Mission';
  } else if (route === 'vision' || route === 'our-vision') {
    tab = 'Our Mission';
    scrollTarget = 'our-vision';
  } else if (route === 'admin') {
    tab = 'AdminDashboard';
  } else if (route === 'dashboard' || route === 'user-dashboard') {
    tab = 'UserDashboard';
  } else if (route.startsWith('resources')) {
    tab = 'Resources';
    const subCat = route.split('-')[1];
    if (subCat === 'prc') resourcesCategory = 'PRC';
    else if (subCat === 'caf') resourcesCategory = 'CAF';
    else if (subCat === 'induction' || subCat === 'training') resourcesCategory = 'Training/Induction';
    else if (subCat === 'cfap') resourcesCategory = 'CFAP & SCS (Finals)';
    else if (subCat === 'qualified') resourcesCategory = 'CA Qualified';
    else if (subCat === 'acca') resourcesCategory = 'ACCA';
    else resourcesCategory = 'All';
  } else if (route === 'contact') {
    tab = 'Contact Us';
  } else if (route === 'announcements') {
    tab = 'Announcements';
  } else if (route === 'events') {
    tab = 'Events';
  } else if (route === 'blog' || route === 'blogs' || route === 'articles' || route.startsWith('blog/')) {
    tab = 'Blog';
  } else if (route === 'team' || route === 'our-team') {
    tab = 'Our Mission';
    scrollTarget = 'our-team';
  } else if (route === 'what-is-ca' || route === 'beginner-guide' || route === 'how-to-start-ca' || route === 'ca-guide') {
    tab = 'WhatIsCA';
  } else if (route === 'login') {
    tab = 'Login';
    loginStartFlipped = false;
  } else if (route === 'signup' || route === 'register') {
    tab = 'Login';
    loginStartFlipped = true;
  } else {
    tab = 'Home';
    if (route && route !== 'home') {
      scrollTarget = route;
    }
  }

  return { tab, resourcesCategory, loginStartFlipped, scrollTarget };
};

const TAB_TO_PATH = {
  'Home': '/',
  'Jobs': '/jobs',
  'Inductions': '/inductions',
  'Overseas': '/overseas',
  'Counseling': '/guidance',
  'Career Support': '/guidance',
  'Career Tools': '/careertools',
  'CareerTools': '/careertools',
  'Community': '/communities',
  'Podcasts': '/podcasts',
  'Our Mission': '/mission',
  'Resources': '/resources',
  'Contact Us': '/contact',
  'WhatIsCA': '/what-is-ca',
  'Announcements': '/announcements',
  'Events': '/events',
  'Blog': '/blog',
  'Login': '/login',
  'AdminDashboard': '/admin',
  'UserDashboard': '/dashboard'
};

const updateAppUrl = (path, replace = false) => {
  if (typeof window === 'undefined') return;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (window.location.pathname !== cleanPath || window.location.hash) {
    if (replace || window.location.hash) {
      window.history.replaceState(null, '', cleanPath);
    } else {
      window.history.pushState(null, '', cleanPath);
    }
  }
};

export default function Home({ session, sessionLoading }) {
  const initialNav = parseRouteToTabState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(initialNav.tab);
  const [resourcesCategory, setResourcesCategory] = useState(initialNav.resourcesCategory);
  const [announcementSubscribed, setAnnouncementSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const initialSync = session || getInitialSessionSync();
  const initialUser = initialSync?.user;
  const initialIsAdmin = Boolean(
    initialUser?.role === 'admin' ||
    initialUser?.role === 'team_head' ||
    initialUser?.email?.toLowerCase().includes('admin')
  );
  const initialUsername = initialUser?.full_name || initialUser?.username || initialUser?.name || initialUser?.email?.split('@')[0] || '';

  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(initialUser));
  const [loginStartFlipped, setLoginStartFlipped] = useState(initialNav.loginStartFlipped);
  const [username, setUsername] = useState(initialUsername);
  const [avatarLetter, setAvatarLetter] = useState(() => (initialUsername ? initialUsername.charAt(0).toUpperCase() : 'U'));
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const [avatarUrl, setAvatarUrl] = useState(() => initialUser?.avatar_url || initialUser?.profileImage || '');
  const [authLoading, setAuthLoading] = useState(() => !initialSync);
  const [savedJobs, setSavedJobs] = useState([]);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [userDashboardTab, setUserDashboardTab] = useState('Overview');
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState('terms');
  const [feedbackViewMode, setFeedbackViewMode] = useState('reviews');

  useEffect(() => {
    getNotifications().then(setNotifications).catch(() => { });
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

  // Lock body scroll and listen for Escape key when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  // Automatically sync clean HTML5 URL with active tab (removes '#' hash completely)
  useEffect(() => {
    let cleanPath = TAB_TO_PATH[activeTab] || '/';
    if (activeTab === 'Resources' && resourcesCategory && resourcesCategory !== 'All') {
      const catSlug = resourcesCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      cleanPath = `/resources-${catSlug}`;
    }
    updateAppUrl(cleanPath);
  }, [activeTab, resourcesCategory]);

  // Support browser Back/Forward navigation with clean URLs
  useEffect(() => {
    const handlePopState = () => {
      const nav = parseRouteToTabState();
      setActiveTab(nav.tab);
      setResourcesCategory(nav.resourcesCategory);
      setLoginStartFlipped(nav.loginStartFlipped);
      if (nav.scrollTarget) {
        setTimeout(() => {
          const el = document.getElementById(nav.scrollTarget);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    if (initialNav.scrollTarget) {
      setTimeout(() => {
        const el = document.getElementById(initialNav.scrollTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      try {
        const stored = localStorage.getItem(`saved_jobs_${session.user.id}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length === 3 && parsed[0] === 1 && parsed[1] === 3 && parsed[2] === 5) {
            localStorage.setItem(`saved_jobs_${session.user.id}`, JSON.stringify([]));
            setSavedJobs([]);
          } else {
            setSavedJobs(Array.isArray(parsed) ? parsed : []);
          }
        } else {
          setSavedJobs([]);
        }
      } catch {
        setSavedJobs([]);
      }
    } else {
      setSavedJobs([]);
    }
  }, [session]);

  const handleToggleSaveJob = (id) => {
    if (!requireAuth('save or bookmark jobs to your profile')) {
      return;
    }
    const targetJob = INITIAL_JOBS.find(j => j.id === id) || { id, title: `Job Placement #${id}` };
    const result = toggleUnifiedBookmark({
      id: id,
      title: targetJob.title,
      subtitle: targetJob.company || "The TaxMan's Capital",
      category: targetJob.jobType || targetJob.job_type || 'Job Placement',
      location: targetJob.location || '',
      deadline: targetJob.deadline || '',
      link: '/jobs'
    }, 'job', session?.user?.id);

    setSavedJobs(prev => {
      const updated = result.isBookmarked ? [...prev.filter(item => item !== id), id] : prev.filter(item => item !== id);
      if (session?.user?.id) {
        localStorage.setItem(`saved_jobs_${session.user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  useEffect(() => {
    if (sessionLoading) {
      setAuthLoading(true);
      return;
    }

    if (!session) {
      setIsLoggedIn(false);
      setUsername('');
      setAvatarLetter('U');
      setIsAdmin(false);
      setAvatarUrl('');
      setAuthLoading(false);
      return;
    }

    setIsLoggedIn(true);
    const userMeta = session.user?.user_metadata;
    const displayUsername = userMeta?.username || session.user?.username || session.user?.name || session.user?.email?.split('@')[0] || 'User';
    setUsername(displayUsername);
    setAvatarLetter(displayUsername.charAt(0).toUpperCase());
    const isRoleAdmin = session.user?.role === 'admin' || session.user?.role === 'team_head' || session.user?.email?.toLowerCase().includes('admin');
    setIsAdmin(isRoleAdmin);
    setAvatarUrl(session.user?.avatar_url || session.user?.profileImage || '');
    setAuthLoading(false);

    // Trigger profile prompt check for regular users
    const isProfileIncomplete = !session.user?.avatar_url && !session.user?.profileImage;
    const promptDismissed = sessionStorage.getItem('dismissed_profile_prompt') === 'true';
    if (isProfileIncomplete && !promptDismissed && !isRoleAdmin) {
      const promptTimer = setTimeout(() => {
        setShowProfilePrompt(true);
      }, 2000);
      return () => clearTimeout(promptTimer);
    }
  }, [session, sessionLoading]);
  const [selectedJobIdForModal, setSelectedJobIdForModal] = useState(null);
  const [selectedCommunityIdForModal, setSelectedCommunityIdForModal] = useState(null);
  const [selectedAnnouncementIdForModal, setSelectedAnnouncementIdForModal] = useState(null);

  const handleViewJobDetails = (id) => {
    setActiveTab('Inductions');
    updateAppUrl('/inductions');
    setSelectedJobIdForModal(id);
  };

  const handleJoinCommunity = (id) => {
    setActiveTab('Community');
    updateAppUrl('/communities');
    setSelectedCommunityIdForModal(id);
  };

  const handleViewAnnouncement = (id) => {
    setActiveTab('Announcements');
    updateAppUrl('/announcements');
    setSelectedAnnouncementIdForModal(id);
  };

  // Synchronize active tab with sessionStorage so it is remembered seamlessly on refresh
  useEffect(() => {
    try {
      if (activeTab) {
        sessionStorage.setItem('thetaxman_active_tab', activeTab);
      }
    } catch {
      // ignore
    }
  }, [activeTab]);

  // Sync profile state when session updates
  useEffect(() => {
    if (session?.user) {
      setAvatarUrl(session.user.avatar_url || session.user.profileImage || '');
      setUsername(session.user.full_name || session.user.username || session.user.name || session.user.email?.split('@')[0] || 'User');
    }
  }, [session]);

  useEffect(() => {
    if (sessionLoading || authLoading) return;

    if (activeTab === 'AdminDashboard') {
      if (!isLoggedIn) {
        setActiveTab('Login');
        updateAppUrl('/login');
      }
    } else if (activeTab === 'UserDashboard') {
      if (!isLoggedIn) {
        setActiveTab('Login');
        updateAppUrl('/login');
      }
    }
  }, [activeTab, isLoggedIn, sessionLoading, authLoading]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  // Intersection Observer for scroll reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -45px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [activeTab]);





  const stats = [
    {
      value: '15,000+',
      label: 'Students Guided',
      icon: <Users className="w-6 h-6 text-brandGreen" />,
      bg: 'bg-emerald-500/10'
    },
    {
      value: '8,500+',
      label: 'Opportunities Shared',
      icon: <Briefcase className="w-6 h-6 text-brandGreen" />,
      bg: 'bg-emerald-500/10'
    },
    {
      value: '25+',
      label: 'WhatsApp Communities',
      icon: <MessageSquare className="w-6 h-6 text-brandGreen" />,
      bg: 'bg-emerald-500/10'
    },
    {
      value: '100+',
      label: 'Top Firms Connected',
      icon: <Globe className="w-6 h-6 text-brandGreen" />,
      bg: 'bg-emerald-500/10'
    }
  ];

  const jobCards = INITIAL_JOBS.slice(0, 5);

  const guidanceItems = [
    {
      title: 'Career Roadmap',
      desc: 'Step-by-step career path guidelines from PRC all the way to qualified CA and ACCA members.',
      icon: <Award className="w-8 h-8 text-brandGreen" />,
      color: 'from-green-500/20 to-emerald-500/5'
    },
    {
      title: 'CV Review',
      desc: 'Get your CV professionalized and polished to meet the recruitment standards of Big 4 firms.',
      icon: <FileCheck className="w-8 h-8 text-brandGreen" />,
      color: 'from-emerald-500/20 to-teal-500/5'
    },
    {
      title: 'Interview Tips',
      desc: 'Crack manager and partner-level interviews with our compiled interview questions and tactics.',
      icon: <Users className="w-8 h-8 text-brandGreen" />,
      color: 'from-green-500/20 to-green-500/5'
    },
    {
      title: 'Articleship Guidance',
      desc: 'Comprehensive advice on selecting firms, tracking inductions, and securing your training contract.',
      icon: <Briefcase className="w-8 h-8 text-brandGreen" />,
      color: 'from-teal-500/20 to-emerald-500/5'
    }
  ];

  const whyChooseUs = [
    {
      title: 'Job Opportunities',
      desc: 'Latest inductions and vacancies from top-tier professional firms and corporations across Pakistan.',
      icon: <Briefcase className="w-6 h-6 text-brandGreen" />
    },
    {
      title: 'Career Counseling',
      desc: '1-on-1 counseling sessions tailored to guide your professional path and career growth.',
      icon: <Users className="w-6 h-6 text-brandGreen" />
    },
    {
      title: 'CV & Interview Help',
      desc: 'Professional CV evaluation, resume templates, and mock interviews to make you recruitment-ready.',
      icon: <CheckSquare className="w-6 h-6 text-brandGreen" />
    },
    {
      title: 'Strong Community',
      desc: 'Join thousands of active CA & ACCA students in our moderated peer-to-peer discussion channels.',
      icon: <MessageSquare className="w-6 h-6 text-brandGreen" />
    },
    {
      title: 'Trusted Guidance',
      desc: 'Experienced mentors with a proven track record of placing hundreds of students in the Big 4.',
      icon: <ShieldCheck className="w-6 h-6 text-brandGreen" />
    }
  ];

  const communities = [
    { id: 'prc', name: 'PRC Students', desc: 'Pre-requisite Competency course entry level group.', members: '2,400+ Active' },
    { id: 'caf', name: 'CAF Students', desc: 'Certificate in Accounting and Finance level guidance.', members: '4,800+ Active' },
    { id: 'cfap', name: 'CFAP Students', desc: 'Certified Finance and Accounting Professional mentorship.', members: '1,900+ Active' },
    { id: 'acca', name: 'ACCA Students', desc: 'Global accounting qualification support & training updates.', members: '3,250+ Active' }
  ];

  const resources = [
    { title: 'CV Templates', type: 'DOCX Format', size: '1.2 MB', icon: <FileText className="text-brandGreen w-6 h-6" /> },
    { title: 'Interview Questions', type: 'PDF Handbook', size: '2.4 MB', icon: <BookOpen className="text-brandGreen w-6 h-6" /> },
    { title: 'Study Notes', type: 'CAF & CFAP Modules', size: '15.8 MB', icon: <Bookmark className="text-brandGreen w-6 h-6" /> },
    { title: 'CA Firms List', type: 'Directory Excel', size: '850 KB', icon: <Briefcase className="text-brandGreen w-6 h-6" /> }
  ];

  const announcements = [
    {
      id: 101,
      tag: 'New Induction',
      title: 'EY Pakistan Fall Inductions Open for CA Inter & ACCA Students',
      date: 'June 08, 2026',
      desc: 'EY has officially opened applications for its Fall articleship and audit internship. Apply online before the deadline.',
      status: 'Open'
    },
    {
      id: 102,
      tag: 'Webinar',
      title: 'Partner Interview Secrets: Live Session with Saboor Ahmad',
      date: 'June 12, 2026',
      desc: 'Join our exclusive webinar on how to clear final round partner interviews. Registration is free but seats are limited.',
      status: 'Upcoming'
    },
    {
      id: 103,
      tag: 'Resource Release',
      title: 'Updated 2026 CV Template Suite is now available for download',
      date: 'June 05, 2026',
      desc: 'We have updated our professional CV templates based on direct feedback from recruiters at PwC, KPMG and EY.',
      status: 'New'
    }
  ];

  const successStories = [
    {
      quote: "Got placed in PwC Islamabad! Thank you Saboor Ahmad sir for your guidance and CV review support. It made a massive difference.",
      name: "Usman Ali",
      role: "CA Finalist",
      placedAt: "PwC Pakistan",
      avatar: "UA"
    },
    {
      quote: "Alhamdulillah placed in EY through this amazing platform. The CV guidance and interview preparation tips really helped me stand out.",
      name: "Areeba Fatima",
      role: "CA Intermediate",
      placedAt: "EY Pakistan",
      avatar: "AF"
    },
    {
      quote: "Best platform for CA & ACCA students in Pakistan. Regular induction updates and proper, honest guidance at every single step.",
      name: "Hamza Raza",
      role: "ACCA Student",
      placedAt: "KPMG Pakistan",
      avatar: "HR"
    }
  ];

  const chatScreenshots = [
    {
      id: 1,
      sender: "Muhammad Bilal",
      firm: "KPMG Lahore",
      category: "Audit Trainee",
      message: "Assalam o Alaikum Sir Saboor! Alhamdulillah I got call from KPMG today and partner round was cleared! Sir aap ka CV template and mock interview questions bilkul exact thay jo partner ne poochay!",
      date: "WhatsApp Chat • 2 days ago",
      verifiedBadge: "Verified Placement"
    },
    {
      id: 2,
      sender: "Zainab Shah",
      firm: "PwC Karachi",
      category: "CAF Qualified",
      message: "Sir Saboor thank you so much! Secured induction in PwC Assurance department. Your guidance on IFRS standards and mock interview confidence was a game changer for me.",
      date: "LinkedIn Message • 1 week ago",
      verifiedBadge: "Verified Placement"
    },
    {
      id: 3,
      sender: "Danish Mehmood",
      firm: "EY Rawalpindi",
      category: "CA Trainee",
      message: "Alhamdulillah received formal offer letter from EY. Thank you to The TaxMan's Capital team! From CV audit to final interview prep, pure honest guidance. Best free resource for every student.",
      date: "WhatsApp Group • Recent",
      verifiedBadge: "Verified Placement"
    }
  ];

  const videoTestimonials = [
    {
      id: 1,
      name: "Saad Rehman",
      firm: "Deloitte Pakistan",
      title: "From 3rd CAF Attempt to Big 4 Articleship",
      duration: "3:45 mins",
      desc: "How structured CV restructuring and technical mock sessions helped clear the partner interview."
    },
    {
      id: 2,
      name: "Fatima Noor",
      firm: "BDO Ebrahim & Co.",
      title: "How I Prepared for Partner Round & Tax Case Studies",
      duration: "4:12 mins",
      desc: "Step-by-step breakdown of questions asked in firm induction interviews."
    },
    {
      id: 3,
      name: "Ali Hassan CA",
      firm: "EY Overseas / UAE",
      title: "Transitioning from Trainee to Overseas Senior Associate",
      duration: "5:20 mins",
      desc: "Advice on international placement, visa benchmarks, and GCC corporate tax opportunities."
    }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim() !== '') {
      setAnnouncementSubscribed(true);
      setEmailInput('');
      setTimeout(() => setAnnouncementSubscribed(false), 5000);
    }
  };
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-bgLight text-textColor flex flex-col selection:bg-brandGreen selection:text-white">

      {/* 1. Navbar */}
      {activeTab !== 'Login' && activeTab !== 'Register' && activeTab !== 'AdminDashboard' && activeTab !== 'UserDashboard' && (
        <nav className="bg-navy/95 backdrop-blur-md sticky top-0 z-50 border-b border-white/10 w-full max-w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              {/* Logo */}
              <div
                onClick={() => {
                  setActiveTab('Home');
                }}
                className="flex-shrink-0 flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group select-none py-1"
              >
                {/* TM Emblem: Transparent, Pure White 'T' & Vivid Green 'M' */}
                <img
                  src={logoImg}
                  alt="The TaxMan's Capital Logo"
                  className="h-9 sm:h-12 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_2px_12px_rgba(0,230,118,0.3)] translate-y-1 sm:translate-y-1.5"
                />

                {/* Brand Typography (The TaxMan's / — CAPITAL —) */}
                <div className="flex flex-col min-w-0 justify-center">
                  <span className="text-white font-black text-base sm:text-lg xl:text-xl leading-none tracking-tight whitespace-nowrap group-hover:text-white/95 transition-colors font-['Outfit',sans-serif]">
                    The TaxMan's
                  </span>
                  <div className="flex items-center space-x-1.5 sm:space-x-2 mt-1 sm:mt-1.5">
                    <span className="h-[1.5px] w-3.5 sm:w-5 bg-gradient-to-r from-transparent to-[#00E676]/80"></span>
                    <span className="text-[#00E676] font-bold text-[10px] sm:text-xs tracking-[0.26em] sm:tracking-[0.3em] uppercase leading-none font-['Outfit',sans-serif] drop-shadow-[0_0_8px_rgba(0,230,118,0.4)]">
                      Capital
                    </span>
                    <span className="h-[1.5px] w-3.5 sm:w-5 bg-gradient-to-l from-transparent to-[#00E676]/80"></span>
                  </div>
                </div>
              </div>

              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center space-x-1 xl:space-x-4 h-full">
                {/* Home */}
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('Home');
                  }}
                  className={`px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-300 relative flex items-center h-full ${activeTab === 'Home'
                    ? 'text-brandGreen'
                    : 'text-gray-300 hover:text-white'
                    }`}
                >
                  Home
                  {activeTab === 'Home' && (
                    <span className="absolute bottom-0 left-3 right-3 h-[3px] bg-brandGreen rounded-full shadow-[0_0_12px_rgba(0,200,83,1)]" />
                  )}
                </a>

                {/* Career Dropdown */}
                <div className="relative group flex items-center h-full">
                  <button
                    className={`px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-300 flex items-center space-x-1.5 cursor-pointer ${activeTab === 'Jobs' || activeTab === 'Inductions' || activeTab === 'Overseas' || activeTab === 'Counseling' || activeTab === 'Career Support'
                      ? 'text-brandGreen'
                      : 'text-gray-300 hover:text-white'
                      }`}
                  >
                    <span>Career</span>
                    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute top-[80%] left-0 w-52 bg-navy border border-white/10 rounded-xl shadow-2xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:top-[90%] transition-all duration-300 backdrop-blur-xl bg-opacity-95">
                    <a
                      href="/inductions"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Inductions');
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Inductions' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      CA/ACCA Inductions
                    </a>
                    <a
                      href="/jobs"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Jobs');
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Jobs' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Pakistan Jobs
                    </a>
                    <a
                      href="/overseas"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Overseas');
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Overseas' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Overseas Jobs
                    </a>
                    <a
                      href="/guidance"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Counseling');
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Counseling' || activeTab === 'Career Support' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Career Support
                    </a>
                    <a
                      href="/careertools"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Career Tools');
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Career Tools' || activeTab === 'CareerTools' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Career Tools & AI Hub
                    </a>
                  </div>
                </div>

                {/* Resources Dropdown */}
                <div className="relative group flex items-center h-full">
                  <button
                    className={`px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-300 flex items-center space-x-1.5 cursor-pointer ${activeTab === 'Resources'
                      ? 'text-brandGreen'
                      : 'text-gray-300 hover:text-white'
                      }`}
                  >
                    <span>Resources</span>
                    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute top-[80%] left-0 w-56 bg-navy border border-white/10 rounded-xl shadow-2xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:top-[90%] transition-all duration-300 backdrop-blur-xl bg-opacity-95">
                    <a
                      href="/resources"
                      onClick={(e) => {
                        e.preventDefault();
                        setResourcesCategory('All');
                        setActiveTab('Resources');
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Resources' && resourcesCategory === 'All' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      All Resources
                    </a>
                    <a
                      href="/resources-prc"
                      onClick={(e) => {
                        e.preventDefault();
                        setResourcesCategory('PRC');
                        setActiveTab('Resources');
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Resources' && resourcesCategory === 'PRC' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      PRC (Entry Level)
                    </a>
                    <a
                      href="/resources-caf"
                      onClick={(e) => {
                        e.preventDefault();
                        setResourcesCategory('CAF');
                        setActiveTab('Resources');
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Resources' && resourcesCategory === 'CAF' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      CAF (Intermediate)
                    </a>
                    <a
                      href="/resources-induction"
                      onClick={(e) => {
                        e.preventDefault();
                        setResourcesCategory('Training/Induction');
                        setActiveTab('Resources');
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Resources' && resourcesCategory === 'Training/Induction' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Training / Induction
                    </a>
                    <a
                      href="/resources-cfap"
                      onClick={(e) => {
                        e.preventDefault();
                        setResourcesCategory('CFAP & SCS (Finals)');
                        setActiveTab('Resources');
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Resources' && resourcesCategory === 'CFAP & SCS (Finals)' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      CFAP & SCS (Finals)
                    </a>
                    <a
                      href="/resources-qualified"
                      onClick={(e) => {
                        e.preventDefault();
                        setResourcesCategory('CA Qualified');
                        setActiveTab('Resources');
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Resources' && resourcesCategory === 'CA Qualified' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      CA Qualified
                    </a>
                    <a
                      href="/resources-acca"
                      onClick={(e) => {
                        e.preventDefault();
                        setResourcesCategory('ACCA');
                        setActiveTab('Resources');
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Resources' && resourcesCategory === 'ACCA' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      ACCA
                    </a>
                  </div>
                </div>

                {/* Community Dropdown */}
                <div className="relative group flex items-center h-full">
                  <button
                    className={`px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-300 flex items-center space-x-1.5 cursor-pointer ${activeTab === 'Community' || activeTab === 'Announcements' || activeTab === 'Events' || activeTab === 'Podcasts'
                      ? 'text-brandGreen'
                      : 'text-gray-300 hover:text-white'
                      }`}
                  >
                    <span>Community</span>
                    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute top-[80%] left-0 w-52 bg-navy border border-white/10 rounded-xl shadow-2xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:top-[90%] transition-all duration-300 backdrop-blur-xl bg-opacity-95">
                    <a
                      href="/communities"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Community');
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Community' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Communities
                    </a>
                    <a
                      href="/announcements"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Announcements');
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Announcements' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Announcements
                    </a>
                    <a
                      href="/events"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Events');
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Events' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Events
                    </a>
                    <a
                      href="/podcasts"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Podcasts');
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Podcasts' ? 'text-brandGreen bg-white/5' : 'text-gray-300'}`}
                    >
                      Videos & Podcasts
                    </a>

                  </div>
                </div>

                {/* About Dropdown */}
                <div className="relative group flex items-center h-full">
                  <button
                    className={`px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-300 flex items-center space-x-1.5 cursor-pointer ${activeTab === 'Our Mission' || activeTab === 'Contact Us'
                      ? 'text-brandGreen'
                      : 'text-gray-300 hover:text-white'
                      }`}
                  >
                    <span>About</span>
                    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute top-[80%] left-0 w-52 bg-navy border border-white/10 rounded-xl shadow-2xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:top-[90%] transition-all duration-300 backdrop-blur-xl bg-opacity-95">
                    <a
                      href="/mission"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Our Mission');
                        updateAppUrl('/mission');
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Our Mission' && window.location.pathname !== '/vision' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Our Mission
                    </a>
                    <a
                      href="/vision"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Our Mission');
                        updateAppUrl('/vision');
                        setTimeout(() => {
                          const el = document.getElementById('our-vision');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Our Mission' && window.location.pathname === '/vision' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Our Vision
                    </a>
                    <a
                      href="/team"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Our Mission');
                        updateAppUrl('/team');
                        setTimeout(() => {
                          const el = document.getElementById('our-team');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Our Mission' && window.location.pathname === '/team' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Team Profiles & Mentors
                    </a>
                    <a
                      href="/contact"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Contact Us');
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Contact Us' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Contact Us
                    </a>
                  </div>
                </div>

                {/* Blog – top-level link (next to About) */}
                <a
                  href="/blog"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('Blog');
                    updateAppUrl('/blog');
                  }}
                  className={`px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    activeTab === 'Blog'
                      ? 'text-brandGreen'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Blog
                </a>
              </div>

              {/* Desktop Auth Actions & Icons */}
              <div className="hidden lg:flex items-center space-x-3 relative">
                {isLoggedIn ? (
                  <>
                    <div className="relative">
                      <button
                        data-notification-trigger
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className="relative p-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
                        title="Notifications"
                      >
                        <Bell className="w-5.5 h-5.5" />
                        {unreadNotifCount > 0 && (
                          <span className="absolute top-1 right-1 w-4 h-4 bg-brandGreen text-white text-[9px] font-bold rounded-full border-2 border-navy flex items-center justify-center animate-pulse">
                            {unreadNotifCount}
                          </span>
                        )}
                      </button>

                      {/* Desktop Notification Panel Dropdown */}
                      <NotificationPanel
                        isOpen={isNotificationOpen}
                        onClose={() => setIsNotificationOpen(false)}
                        notifications={notifications}
                        onMarkAsRead={handleMarkNotifRead}
                        onMarkAllAsRead={handleMarkAllNotifsRead}
                        onDelete={handleDeleteNotif}
                        onNavigateTab={(tab) => {
                          setActiveTab(tab);
                          updateAppUrl(TAB_TO_PATH[tab] || '/');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          setIsNotificationOpen(false);
                        }}
                      />
                    </div>

                    {/* User Avatar Dropdown (Hover & Click Supported) */}
                    <div className="relative group flex items-center h-full py-2">
                      <button
                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                        className="p-0.5 rounded-full hover:bg-white/10 transition-all focus:outline-none cursor-pointer"
                        aria-label="User Account Menu"
                      >
                        <div className="w-8.5 h-8.5 rounded-full bg-[#0A2540] text-white font-black flex items-center justify-center text-xs shadow-md overflow-hidden border border-white/20 group-hover:border-brandGreen transition-colors">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            avatarLetter
                          )}
                        </div>
                      </button>

                      {/* Dropdown Menu Card (Hover & Click Supported) */}
                      <div
                        className={`absolute top-[85%] right-0 w-60 bg-[#031835]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl py-2 z-50 transition-all duration-200 text-xs overflow-hidden ${
                          userDropdownOpen
                            ? 'opacity-100 visible top-[95%]'
                            : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:top-[95%]'
                        }`}
                      >
                        {/* Profile Header */}
                        <div className="px-4 py-3 border-b border-white/10 flex items-center space-x-3 bg-white/[0.02]">
                          <div className="w-10 h-10 rounded-full bg-[#0A2540] text-white font-black flex items-center justify-center text-sm overflow-hidden border border-white/20 shrink-0">
                            {avatarUrl ? (
                              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              avatarLetter
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-white text-xs font-bold truncate">
                              {username || 'Student'}
                            </span>
                            <span className="text-[10px] text-brandGreen font-semibold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-brandGreen animate-pulse" />
                              {isAdmin ? 'Administrator' : 'Student Trainee'}
                            </span>
                          </div>
                        </div>

                        {/* Menu Options: Only Dashboard & Sign Out */}
                        <div className="py-1.5 space-y-0.5">
                          {/* 1. Dashboard */}
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              if (isAdmin) {
                                setActiveTab('AdminDashboard');
                              } else {
                                setUserDashboardTab('Overview');
                                setActiveTab('UserDashboard');
                              }
                            }}
                            className="w-full px-4 py-2.5 text-left text-xs font-semibold text-gray-200 hover:text-white hover:bg-white/5 flex items-center space-x-3 transition-colors cursor-pointer group/item"
                          >
                            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover/item:bg-emerald-500/20 transition-colors">
                              <LayoutDashboard className="w-4 h-4" />
                            </div>
                            <span className="flex-1 font-bold">My Dashboard</span>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover/item:text-gray-300" />
                          </button>

                          <div className="border-t border-white/10 my-1" />

                          {/* 2. Sign Out */}
                          <button
                            onClick={async () => {
                              setUserDropdownOpen(false);
                              await logoutUser();
                              setIsLoggedIn(false);
                              setActiveTab('Home');
                            }}
                            className="w-full px-4 py-2.5 text-left text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center space-x-3 transition-colors cursor-pointer group/item"
                          >
                            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 group-hover/item:bg-rose-500/20 transition-colors">
                              <LogOut className="w-4 h-4" />
                            </div>
                            <span className="font-bold">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setLoginStartFlipped(false);
                        setActiveTab('Login');
                      }}
                      className="px-4 py-1.5 border border-white/20 hover:border-brandGreen/40 rounded-lg text-xs xl:text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 whitespace-nowrap cursor-pointer"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setLoginStartFlipped(true);
                        setActiveTab('Login');
                        window.history.pushState(null, '', '#signup');
                      }}
                      className="px-4.5 py-1.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-lg text-xs xl:text-sm font-bold transition-all duration-300 shadow-md shadow-brandGreen/10 hover:shadow-brandGreen/20 hover:scale-[1.02] active:scale-95 whitespace-nowrap cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Auth Actions & Menu Trigger */}
              <div className="lg:hidden flex items-center space-x-2 sm:space-x-3 relative">
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      if (isAdmin) {
                        setActiveTab('AdminDashboard');
                      } else {
                        setUserDashboardTab('Overview');
                        setActiveTab('UserDashboard');
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-[#0A2540] text-white font-bold flex items-center justify-center text-xs overflow-hidden border border-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
                    title={isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
                    aria-label="User profile and dashboard"
                  >
                    {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : avatarLetter}
                  </button>
                ) : (
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <button
                      onClick={() => {
                        setLoginStartFlipped(false);
                        setActiveTab('Login');
                      }}
                      className="px-2.5 py-1 border border-white/25 hover:border-brandGreen text-white text-[11px] sm:text-xs font-semibold rounded-lg hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setLoginStartFlipped(true);
                        setActiveTab('Login');
                        window.history.pushState(null, '', '#signup');
                      }}
                      className="hidden sm:inline-flex px-2.5 py-1 bg-brandGreen hover:bg-brandGreen-dark text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      Sign Up
                    </button>
                  </div>
                )}

                {isLoggedIn && (
                  <div className="relative">
                    <button
                      data-notification-trigger
                      onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                      className="relative p-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer"
                      title="Notifications"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadNotifCount > 0 && (
                        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-brandGreen text-white text-[8px] font-bold rounded-full border border-navy flex items-center justify-center animate-pulse">
                          {unreadNotifCount}
                        </span>
                      )}
                    </button>

                    {/* Mobile Notification Panel */}
                    <NotificationPanel
                      isOpen={isNotificationOpen}
                      onClose={() => setIsNotificationOpen(false)}
                      notifications={notifications}
                      onMarkAsRead={handleMarkNotifRead}
                      onMarkAllAsRead={handleMarkAllNotifsRead}
                      onDelete={handleDeleteNotif}
                      onNavigateTab={(tab) => {
                        setActiveTab(tab);
                        updateAppUrl(TAB_TO_PATH[tab] || '/');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setIsNotificationOpen(false);
                      }}
                    />
                  </div>
                )}

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1.5 text-gray-300 hover:text-white focus:outline-none cursor-pointer"
                  aria-label="Toggle Navigation Menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6 text-brandGreen" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Right-Side Slide-Out Drawer Portal */}
          {typeof document !== 'undefined' && createPortal(
            <div className="lg:hidden">
              {/* Mobile Backdrop Overlay */}
              <div
                className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[99990] transition-opacity duration-300 ${
                  mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setMobileMenuOpen(false)}
                aria-hidden="true"
              />

              {/* Mobile Right-Side Slide-Out Drawer */}
              <div
                className={`fixed top-0 right-0 h-full w-[88vw] max-w-sm bg-[#04162e] border-l border-white/10 z-[99995] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
                  mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
              >
                {/* Drawer Top Header with Logo and Close 'X' Button */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#021B3A] shrink-0">
              <div className="flex items-center gap-2.5">
                <img
                  src={logoImg}
                  alt="The TaxMan's Capital Logo"
                  className="h-8 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,230,118,0.3)]"
                />
                <div className="flex flex-col justify-center">
                  <span className="text-white font-black text-sm leading-none tracking-tight font-['Outfit',sans-serif]">
                    The TaxMan's
                  </span>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <span className="h-[1px] w-3 bg-[#00E676]/60"></span>
                    <span className="text-[#00E676] font-bold text-[9px] tracking-[0.22em] uppercase leading-none font-['Outfit',sans-serif]">
                      Capital
                    </span>
                    <span className="h-[1px] w-3 bg-[#00E676]/60"></span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 active:scale-95 transition-all focus:outline-none cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="w-6 h-6 text-brandGreen" />
              </button>
            </div>

            {/* Scrollable Drawer Content */}
            <div className="flex-1 overflow-y-auto py-5 px-5 space-y-4">

              {/* Prominent Top Auth Section in Mobile Menu */}
              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10">
                {isLoggedIn ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-[#0A2540] text-white font-black flex items-center justify-center text-sm shadow-md overflow-hidden border border-white/20">
                        {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : avatarLetter}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-white text-xs font-bold leading-tight">{username}</span>
                        <span className="text-[10px] text-brandGreen font-semibold uppercase">{isAdmin ? 'Admin' : 'Student'}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          if (isAdmin) {
                            setActiveTab('AdminDashboard');
                          } else {
                            setUserDashboardTab('Overview');
                            setActiveTab('UserDashboard');
                          }
                        }}
                        className="px-3 py-1.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={async () => {
                          await logoutUser();
                          setIsLoggedIn(false);
                          setMobileMenuOpen(false);
                          setActiveTab('Home');
                        }}
                        className="px-2.5 py-1.5 border border-white/20 text-gray-300 hover:text-white text-xs font-semibold rounded-xl hover:bg-white/5 cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Account Portal</span>
                      <span className="text-[10px] text-brandGreen font-semibold">Join 15k+ Students</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setLoginStartFlipped(false);
                          setActiveTab('Login');
                        }}
                        className="py-2.5 px-3 border border-white/20 hover:border-brandGreen rounded-xl text-xs font-bold text-white text-center hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        Log In
                      </button>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setLoginStartFlipped(true);
                          setActiveTab('Login');
                          window.history.pushState(null, '', '#signup');
                        }}
                        className="py-2.5 px-3 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl text-xs font-bold text-center transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                      >
                        Create Account
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Home Link */}
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('Home');
                  setMobileMenuOpen(false);
                }}
                className={`block py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${activeTab === 'Home'
                  ? 'text-brandGreen bg-brandGreen/10 border-l-4 border-brandGreen shadow-[0_2px_8px_rgba(0,200,83,0.1)]'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
              >
                Home
              </a>

              {/* Career Section */}
              <div className="space-y-1">
                <span className="block px-4 text-xs font-bold uppercase tracking-wider text-brandGreen/60">Career</span>
                <div className="pl-3 space-y-1">
                  <a
                    href="/inductions"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Inductions');
                      setMobileMenuOpen(false);
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Inductions' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Inductions
                  </a>
                  <a
                    href="/jobs"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Jobs');
                      setMobileMenuOpen(false);
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Jobs' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Pakistan Jobs
                  </a>
                  <a
                    href="/overseas"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Overseas');
                      setMobileMenuOpen(false);
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Overseas' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Overseas Jobs
                  </a>
                  <a
                    href="/guidance"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Counseling');
                      setMobileMenuOpen(false);
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Counseling' || activeTab === 'Career Support' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Career Support
                  </a>
                  <a
                    href="/careertools"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Career Tools');
                      setMobileMenuOpen(false);
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Career Tools' || activeTab === 'CareerTools' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Career Tools & AI Hub
                  </a>
                </div>
              </div>

              {/* Resources Section */}
              <div className="space-y-1">
                <span className="block px-4 text-xs font-bold uppercase tracking-wider text-brandGreen/60">Resources</span>
                <div className="pl-3 space-y-1">
                  <a
                    href="/resources"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Resources');
                      setResourcesCategory('All');
                      setMobileMenuOpen(false);
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Resources' && resourcesCategory === 'All' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • All Resources
                  </a>
                  <a
                    href="/resources-prc"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Resources');
                      setResourcesCategory('PRC');
                      setMobileMenuOpen(false);
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Resources' && resourcesCategory === 'PRC' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • PRC (Entry Level)
                  </a>
                  <a
                    href="/resources-caf"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Resources');
                      setResourcesCategory('CAF');
                      setMobileMenuOpen(false);
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Resources' && resourcesCategory === 'CAF' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • CAF (Intermediate)
                  </a>
                  <a
                    href="/resources-induction"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Resources');
                      setResourcesCategory('Training/Induction');
                      setMobileMenuOpen(false);
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Resources' && resourcesCategory === 'Training/Induction' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Training & Induction
                  </a>
                  <a
                    href="/resources-cfap"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Resources');
                      setResourcesCategory('CFAP & SCS (Finals)');
                      setMobileMenuOpen(false);
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Resources' && resourcesCategory === 'CFAP & SCS (Finals)' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • CFAP & SCS (Finals)
                  </a>
                  <a
                    href="/resources-qualified"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Resources');
                      setResourcesCategory('CA Qualified');
                      setMobileMenuOpen(false);
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Resources' && resourcesCategory === 'CA Qualified' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • CA Qualified
                  </a>
                  <a
                    href="/resources-acca"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Resources');
                      setResourcesCategory('ACCA');
                      setMobileMenuOpen(false);
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Resources' && resourcesCategory === 'ACCA' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • ACCA
                  </a>
                </div>
              </div>

              {/* Community Section */}
              <div className="space-y-1">
                <span className="block px-4 text-xs font-bold uppercase tracking-wider text-brandGreen/60">Community</span>
                <div className="pl-3 space-y-1">
                  <a
                    href="/communities"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Community');
                      setMobileMenuOpen(false);
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Community' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Communities
                  </a>
                  <a
                    href="/announcements"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Announcements');
                      setMobileMenuOpen(false);
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Announcements' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Announcements
                  </a>
                  <a
                    href="/events"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Events');
                      setMobileMenuOpen(false);
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Events' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Events
                  </a>
                  <a
                    href="/podcasts"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Podcasts');
                      setMobileMenuOpen(false);
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Podcasts' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'}`}
                  >
                    • Videos & Podcasts
                  </a>

                </div>
              </div>

              {/* Blog Section */}
              <div className="space-y-1">
                <span className="block px-4 text-xs font-bold uppercase tracking-wider text-brandGreen/60">Blog</span>
                <div className="pl-3 space-y-1">
                  <a
                    href="/blog"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Blog');
                      updateAppUrl('/blog');
                      setMobileMenuOpen(false);
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Blog' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'}`}
                  >
                    • Blog & Articles
                  </a>
                </div>
              </div>

              {/* About Section */}
              <div className="space-y-1">
                <span className="block px-4 text-xs font-bold uppercase tracking-wider text-brandGreen/60">About</span>
                <div className="pl-3 space-y-1">
                  <a
                    href="/mission"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Our Mission');
                      updateAppUrl('/mission');
                      setMobileMenuOpen(false);
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Our Mission' && window.location.pathname !== '/vision' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Our Mission
                  </a>
                  <a
                    href="/vision"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Our Mission');
                      updateAppUrl('/vision');
                      setMobileMenuOpen(false);
                      setTimeout(() => {
                        const el = document.getElementById('our-vision');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Our Mission' && window.location.pathname === '/vision' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Our Vision
                  </a>
                  <a
                    href="/team"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Our Mission');
                      updateAppUrl('/team');
                      setMobileMenuOpen(false);
                      setTimeout(() => {
                        const el = document.getElementById('our-team');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Our Mission' && window.location.pathname === '/team' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Team Profiles & Mentors
                  </a>

                  <a
                    href="/contact"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Contact Us');
                      setMobileMenuOpen(false);
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Contact Us' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Contact Us
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}
        </nav>
      )}

      <div key={activeTab} className={`${(activeTab === 'AdminDashboard' || activeTab === 'UserDashboard') ? 'h-screen overflow-hidden' : 'animate-page-transition'} flex-grow flex flex-col`}>
        {activeTab === 'WhatIsCA' ? (
          <BeginnerGuide
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              updateAppUrl(TAB_TO_PATH[tab] || '/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeTab === 'Jobs' ? (
          <Jobs mode="jobs" initialSelectedJobId={selectedJobIdForModal} onClearInitialJob={() => setSelectedJobIdForModal(null)} savedJobs={savedJobs} onToggleSaveJob={handleToggleSaveJob} />
        ) : activeTab === 'Inductions' ? (
          <Jobs mode="inductions" initialSelectedJobId={selectedJobIdForModal} onClearInitialJob={() => setSelectedJobIdForModal(null)} savedJobs={savedJobs} onToggleSaveJob={handleToggleSaveJob} />
        ) : activeTab === 'Overseas' ? (
          <Jobs mode="overseas" initialSelectedJobId={selectedJobIdForModal} onClearInitialJob={() => setSelectedJobIdForModal(null)} savedJobs={savedJobs} onToggleSaveJob={handleToggleSaveJob} />
        ) : (activeTab === 'Counseling' || activeTab === 'Career Support') ? (
          <Counseling />
        ) : (activeTab === 'Career Tools' || activeTab === 'CareerTools') ? (
          <CareerTools />
        ) : activeTab === 'Community' ? (
          <Community initialCommunityId={selectedCommunityIdForModal} onClearInitialCommunity={() => setSelectedCommunityIdForModal(null)} />
        ) : activeTab === 'Our Mission' ? (
          <Mission />
        ) : activeTab === 'Resources' ? (
          <Resources selectedCategory={resourcesCategory} setSelectedCategory={setResourcesCategory} setActiveTab={setActiveTab} />
        ) : activeTab === 'Contact Us' ? (
          <Contact />
        ) : activeTab === 'Blog' ? (
          <Blog onNavigateTab={(tab) => { setActiveTab(tab); updateAppUrl(TAB_TO_PATH[tab] || '/'); }} />
        ) : activeTab === 'Announcements' ? (
          <Announcements initialAnnouncementId={selectedAnnouncementIdForModal} onClearInitialAnnouncement={() => setSelectedAnnouncementIdForModal(null)} />
        ) : activeTab === 'Events' ? (
          <Events />
        ) : activeTab === 'Podcasts' ? (
          <Podcasts />
        ) : activeTab === 'Login' ? (
          <Login
            startFlipped={loginStartFlipped}
            onLoginSuccess={() => {
              setActiveTab('Home');
              updateAppUrl('/');
            }}
            onBack={() => {
              setActiveTab('Home');
              updateAppUrl('/');
            }}
            onSignUpRedirect={() => {
              updateAppUrl('/signup');
              setLoginStartFlipped(true);
            }}
            onLoginRedirect={() => {
              updateAppUrl('/login');
              setLoginStartFlipped(false);
            }}
          />
        ) : activeTab === 'AdminDashboard' ? (
          (sessionLoading || authLoading) ? (
            <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-2 border-brandGreen border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-semibold text-gray-400">Verifying administrator access...</p>
            </div>
          ) : isAdmin ? (
            <AdminDashboard
              onLogout={async () => {
                await logoutUser();
                setIsLoggedIn(false);
                setActiveTab('Home');
              }}
              currentAdminName={username || 'Ahmad Raza'}
              session={session}
              onProfileUpdate={(newProfile) => {
                if (newProfile.full_name) {
                  setUsername(newProfile.full_name);
                  setAvatarLetter(newProfile.full_name.charAt(0).toUpperCase());
                }
                if (newProfile.avatar_url || newProfile.profileImage) {
                  setAvatarUrl(newProfile.avatar_url || newProfile.profileImage);
                }
              }}
              onNavigateHome={() => {
                setActiveTab('Home');
                updateAppUrl('/');
              }}
            />
          ) : (
            <div className="min-h-[85vh] bg-[#02152c] text-white flex items-center justify-center p-6">
              <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl shadow-2xl space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 text-2xl shadow-lg">
                  🛡️
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">Admin Privileges Required</h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    You are currently signed in as <span className="text-white font-bold">{username || 'Student'}</span> (<span className="text-brandGreen font-semibold">{session?.user?.role || 'student'}</span>). The Admin Panel is restricted to platform administrators.
                  </p>
                </div>
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      setActiveTab('Login');
                    }}
                    className="w-full py-3 px-4 bg-brandGreen hover:bg-brandGreen-dark text-white font-black text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-brandGreen/20 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Log In as Administrator</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('UserDashboard');
                    }}
                    className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold text-xs sm:text-sm rounded-2xl transition-all cursor-pointer"
                  >
                    Go to Student Dashboard
                  </button>
                </div>
              </div>
            </div>
          )
        ) : activeTab === 'UserDashboard' ? (
          <UserDashboard
            session={session}
            initialSubTab={userDashboardTab}
            onLogout={async () => {
              await logoutUser();
              setIsLoggedIn(false);
              setActiveTab('Home');
            }}
            onGoHome={() => {
              setActiveTab('Home');
            }}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              updateAppUrl(TAB_TO_PATH[tab] || '/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            savedJobs={savedJobs}
            onRemoveSavedJob={(id) => handleToggleSaveJob(id)}
            onProfileUpdate={(newProfile) => {
              if (newProfile.full_name) {
                setUsername(newProfile.full_name);
                setAvatarLetter(newProfile.full_name.charAt(0).toUpperCase());
              }
            }}
          />
        ) : (
          <>
            {/* 2. Hero Section */}
            <section className="skyline-bg bg-navy text-white pt-8 pb-20 sm:pt-10 sm:pb-24 relative overflow-hidden">
              {/* Interactive Antigravity Physics Particle Layer */}
              <AntigravityCanvas className="z-0 opacity-50" particleCount={22} />

              {/* Ambient Background Glow Orbs */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-brandGreen/8 rounded-full blur-[130px] pointer-events-none" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-full">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-6 lg:gap-10 items-center">

                  {/* Hero Left Content */}
                  <div className="order-2 md:order-1 md:col-span-7 lg:col-span-7 flex flex-col space-y-4 sm:space-y-5 text-left">
                    {/* Live Status Pill */}
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-brandGreen/30 backdrop-blur-md w-fit shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-brandGreen animate-pulse" />
                      <span className="text-[11px] sm:text-xs font-bold text-gray-200 tracking-wide">
                        The Career Platform for CA & ACCA
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-[42px] font-extrabold tracking-tight leading-[1.18] font-['Outfit',sans-serif]">
                      Helping CA & ACCA <br className="hidden sm:inline" />
                      Students Build <br className="hidden sm:inline" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-brandGreen via-emerald-400 to-teal-300">
                        Successful Careers
                      </span>
                    </h1>

                    <p className="text-xs sm:text-sm md:text-sm lg:text-base text-gray-300 max-w-xl font-normal leading-relaxed">
                      Discover verified Big 4 inductions, corporate finance roles, real-time AI interview simulations, 47 ATS resume templates, and 25+ moderated student communities.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2.5 sm:space-y-0 sm:space-x-3 pt-1 w-full sm:w-auto flex-wrap gap-y-2.5">
                      <a
                        href="/jobs"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveTab('Jobs');
                        }}
                        className="flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-brandGreen to-emerald-500 hover:from-brandGreen-dark hover:to-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 shadow-md shadow-brandGreen/20 hover:scale-[1.02] active:scale-95 group cursor-pointer"
                      >
                        <Briefcase className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        <span>Explore Opportunities</span>
                      </a>

                      <a
                        href="/what-is-ca"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveTab('WhatIsCA');
                          updateAppUrl('/what-is-ca');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 border border-amber-400/40 text-amber-200 hover:text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/5 hover:scale-[1.02] active:scale-95 cursor-pointer"
                      >
                        <GraduationCap className="w-4 h-4 mr-2 text-amber-400" />
                        <span>What is CA & How to Start</span>
                      </a>
                    </div>

                    {/* Stacked Avatars and Guided Students Count */}
                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
                      <div className="flex -space-x-2 overflow-hidden flex-shrink-0">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-full border-2 border-navy bg-gradient-to-tr from-amber-400 to-orange-500 text-[10px] font-bold text-white shadow-sm">AS</div>
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-full border-2 border-navy bg-gradient-to-tr from-blue-500 to-indigo-600 text-[10px] font-bold text-white shadow-sm">KB</div>
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-full border-2 border-navy bg-gradient-to-tr from-emerald-400 to-teal-500 text-[10px] font-bold text-white shadow-md">ZA</div>
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-full border-2 border-navy bg-gradient-to-tr from-pink-500 to-rose-600 text-[10px] font-bold text-white shadow-sm">MN</div>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs sm:text-sm font-semibold text-gray-200">
                          <AnimatedCounter target={10000} suffix="+" className="text-brandGreen text-sm sm:text-base font-extrabold mr-1" />
                          CA & ACCA Trainees Mentored
                        </span>
                        <div className="flex items-center space-x-1.5 text-[10px] sm:text-[11px] text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-brandGreen flex-shrink-0" />
                          <span className="truncate">Across PwC, EY, KPMG, BDO, Deloitte & MNCs</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hero Right Graphic Card (Saboor Ahmad Profile) */}
                  <div className="order-1 md:order-2 md:col-span-5 lg:col-span-5 flex flex-col items-center justify-center relative mb-6 md:mb-0 w-full max-w-full">

                    {/* Floating Tech Pill: Top Right */}
                    <div className="absolute -top-3 right-0 sm:right-2 md:-right-2 lg:right-4 z-30 hidden sm:flex items-center space-x-1.5 md:space-x-2 px-2.5 py-1 md:px-3 md:py-1.5 bg-black/70 backdrop-blur-xl border border-brandGreen/40 rounded-xl shadow-lg animate-float-subtle">
                      <Sparkles className="w-3.5 h-3.5 text-brandGreen" />
                      <div className="text-left leading-tight">
                        <span className="text-[9px] text-gray-400 block font-semibold">AI Interview Studio</span>
                        <span className="text-[10px] md:text-[11px] font-bold text-emerald-300">Live Voice & Video</span>
                      </div>
                    </div>

                    {/* Profile Graphic Wrapper */}
                    <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-52 md:h-52 lg:w-72 lg:h-72 flex items-center justify-center max-w-full">
                      {/* Rotating outer dashed border */}
                      <div className="absolute inset-0 rounded-full border-3 border-dashed border-brandGreen/40 flex items-center justify-center p-2.5 animate-[spin_60s_linear_infinite] pointer-events-none">
                        <div className="w-full h-full rounded-full border-2 border-brandGreen bg-navy-dark overflow-hidden pointer-events-auto"></div>
                      </div>

                      {/* Portrait Image container over the border */}
                      <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-44 md:h-44 lg:w-64 lg:h-64 rounded-full overflow-hidden border-3 border-brandGreen shadow-xl flex items-center justify-center bg-navy-dark hover:scale-105 transition-transform duration-300">
                        <img
                          src={mentorImage}
                          alt="Saboor Ahmad - Mentor Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Mentor Quote Card */}
                    <div className="relative mt-3 md:mt-3 lg:mt-4 w-full max-w-sm md:max-w-[300px] lg:max-w-sm mx-auto glass-panel text-white p-3 sm:p-3.5 md:p-3 lg:p-4 rounded-2xl shadow-xl border border-white/10 hover:border-brandGreen/40 transition-colors duration-300 text-left">
                      <div className="flex items-start space-x-2.5">
                        <div className="p-1.5 bg-brandGreen/10 rounded-lg flex-shrink-0">
                          <MessageSquare className="w-4 h-4 text-brandGreen" />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <p className="text-[11px] sm:text-xs md:text-[11px] lg:text-xs italic text-gray-300 leading-relaxed">
                            "My mission is to guide CA/ACCA students, help them build their careers and connect them with the right opportunities."
                          </p>
                          <div className="border-t border-white/10 pt-1.5 flex flex-col">
                            <span className="text-xl md:text-xl lg:text-2xl font-signature text-brandGreen tracking-wide select-none leading-none pt-0.5">Saboor Ahmad</span>
                            <span className="text-[9px] text-gray-400 mt-0.5 font-semibold">CA & ACCA | Career Counselor & Mentor</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* 3. Floating Stats Bar Section */}
            <section className="relative -mt-8 sm:-mt-12 z-20 px-4 sm:px-6 lg:px-8 w-full max-w-full">
              <div className="max-w-7xl mx-auto">
                <div className="bg-[#021B3A] rounded-3xl shadow-2xl border border-white/10 p-5 sm:p-8 backdrop-blur-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
                    <div className="flex items-center space-x-3 sm:space-x-4 p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] sm:bg-transparent border border-white/5 sm:border-0">
                      <div className="p-3 sm:p-4 rounded-2xl bg-emerald-500/15 border border-brandGreen/30 flex-shrink-0 text-brandGreen">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <AnimatedCounter target={15000} suffix="+" className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-['Outfit',sans-serif] leading-none" />
                        <span className="text-xs sm:text-sm text-gray-400 mt-1 font-medium truncate">Students Guided</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4 p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] sm:bg-transparent border border-white/5 sm:border-0">
                      <div className="p-3 sm:p-4 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex-shrink-0 text-blue-400">
                        <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <AnimatedCounter target={8500} suffix="+" className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-['Outfit',sans-serif] leading-none" />
                        <span className="text-xs sm:text-sm text-gray-400 mt-1 font-medium truncate">Opportunities Shared</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4 p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] sm:bg-transparent border border-white/5 sm:border-0">
                      <div className="p-3 sm:p-4 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex-shrink-0 text-purple-400">
                        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <AnimatedCounter target={25} suffix="+" className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-['Outfit',sans-serif] leading-none" />
                        <span className="text-xs sm:text-sm text-gray-400 mt-1 font-medium truncate">WhatsApp Communities</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4 p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] sm:bg-transparent border border-white/5 sm:border-0">
                      <div className="p-3 sm:p-4 rounded-2xl bg-emerald-500/15 border border-brandGreen/30 flex-shrink-0 text-emerald-400">
                        <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <AnimatedCounter target={100} suffix="+" className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-['Outfit',sans-serif] leading-none" />
                        <span className="text-xs sm:text-sm text-gray-400 mt-1 font-medium truncate">Top Firms Connected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Latest Induction Updates Section */}
            <section id="jobs" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll w-full max-w-full">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
                <div className="flex flex-col space-y-2 sm:space-y-3">
                  <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase">Opportunities</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight relative pb-3">
                    LATEST INDUCTION UPDATES
                    <span className="absolute bottom-0 left-0 w-16 h-1 bg-brandGreen rounded-full" />
                  </h2>
                </div>
                <a
                  href="/jobs"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('Jobs');
                  }}
                  className="group flex items-center text-xs sm:text-sm font-bold text-navy hover:text-brandGreen transition-colors mt-4 md:mt-0"
                >
                  View All Jobs
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* 5-Card Responsive Job Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6">
                {jobCards.map((job, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between premium-card-hover"
                  >
                    <div>
                      {/* Firm Logo & Company Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-shrink-0">
                          {job.logoSvg}
                        </div>
                        <span className="px-2.5 py-1 bg-gray-100 text-[10px] font-bold text-gray-600 rounded-full">
                          {job.company.split(' ')[0]}
                        </span>
                      </div>

                      {/* Job Title & Details */}
                      <div className="mt-4">
                        <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-brandGreen transition-colors">
                          {job.company}
                        </h3>
                        <p className="text-[13px] text-gray-500 mt-1 font-medium">{job.title}</p>
                      </div>

                      {/* Location with Icon */}
                      <div className="flex items-center text-gray-400 text-xs mt-3">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400 flex-shrink-0" />
                        <span>{job.location}</span>
                      </div>

                      {/* Qualification Tag */}
                      <div className="mt-4">
                        <span className="inline-block px-2.5 py-1 bg-emerald-500/5 text-brandGreen border border-brandGreen/10 rounded text-xs font-semibold">
                          {job.badge}
                        </span>
                      </div>
                    </div>

                    {/* Deadline and Details Button */}
                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <span className="text-gray-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" /> Deadline:
                        </span>
                        <span className="font-bold text-red-500">{job.deadline}</span>
                      </div>
                      <button
                        onClick={() => handleViewJobDetails(job.id)}
                        className="w-full py-2 bg-navy hover:bg-brandGreen text-white font-medium rounded-lg text-xs transition-colors duration-200 focus:outline-none cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Free Guidance Section */}
            <section id="guidance" className="py-16 sm:py-20 bg-gray-50 border-y border-gray-100 reveal-on-scroll w-full max-w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 flex flex-col items-center">
                  <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase mb-2">Mentor-Led Support</span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy tracking-tight pb-3 relative">
                    FREE CAREER GUIDANCE
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-brandGreen rounded-full" />
                  </h2>
                  <p className="text-gray-500 mt-4 text-xs sm:text-sm sm:text-base">
                    Get direct resources and professional feedback curated by industry leaders to kickstart your corporate journey.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                  {guidanceItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col justify-between premium-card-hover"
                    >
                      <div>
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center mb-5 sm:mb-6 shadow-sm`}>
                          {item.icon}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-navy mb-2 sm:mb-3">{item.title}</h3>
                        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-50">
                        <button
                          onClick={() => setActiveTab('Career Support')}
                          className="flex items-center text-xs font-bold text-brandGreen hover:text-brandGreen-dark transition-colors group cursor-pointer"
                        >
                          Learn More
                          <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* 6. Why Choose Us Section */}
            <section id="why-us" className="py-16 sm:py-24 bg-navy text-white relative reveal-on-scroll w-full max-w-full">
              {/* Subtle grid pattern mask in CSS */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,200,83,0.05),transparent)] pointer-events-none"></div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-20 flex flex-col items-center">
                  <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase mb-2">Our Value</span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight pb-3 relative text-white">
                    WHY CHOOSE US?
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-brandGreen rounded-full" />
                  </h2>
                  <p className="text-gray-400 mt-4 text-xs sm:text-sm sm:text-base">
                    Providing end-to-end guidance to bridge the gap between hard work and top-tier placements.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
                  {whyChooseUs.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center text-center p-5 sm:p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-brandGreen/45 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-xl bg-brandGreen/10 border border-brandGreen/30 flex items-center justify-center mb-5 sm:mb-6">
                        {item.icon}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3 tracking-wide text-white">{item.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-normal">{item.desc}</p>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* Videos, Sessions & Podcasts Section */}
            <section id="podcasts-section" className="py-16 sm:py-24 bg-white border-b border-gray-100 reveal-on-scroll w-full max-w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 flex flex-col items-center">
                  <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase mb-2">Media & Mentorship</span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy tracking-tight pb-3 relative">
                    VIDEOS, SESSIONS & PODCASTS
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-brandGreen rounded-full" />
                  </h2>
                  <p className="text-gray-500 mt-4 text-xs sm:text-sm sm:text-base">
                    Watch our exclusive mentorship sessions, partner interview preparation guidelines, and career podcasts.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {[
                    {
                      id: 'ep-1',
                      youtubeId: 'L_LUpnjgPso',
                      tag: 'Interview Series',
                      title: 'ICAP Firm Induction Guide 2026: QCR Rated vs Non-QCR Firms',
                      desc: 'An in-depth session discussing what audit partners look for in CA & ACCA candidates during final round interviews.',
                      duration: '42:15',
                      author: 'Saboor Ahmad',
                      authorInitials: 'SA',
                      authorBg: 'bg-brandGreen'
                    },
                    {
                      id: 'ep-2',
                      youtubeId: '5qap5aO4i9A',
                      tag: 'Test Prep',
                      title: 'A.F. Ferguson & Co. (PwC) Test Preparation & Written Test Guidelines',
                      desc: 'Detailed breakdown of AFF induction test syllabus, English & Accounting sections, sample questions, and strategies.',
                      duration: '35:20',
                      author: 'Saboor Ahmad',
                      authorInitials: 'SA',
                      authorBg: 'bg-brandGreen'
                    },
                    {
                      id: 'ep-3',
                      youtubeId: '3JZ_D3ELwOQ',
                      tag: 'International Jobs',
                      title: 'Securing Middle East Jobs for Qualified Professionals (Saudi Arabia & Gulf)',
                      desc: 'Step-by-step roadmap for qualified professionals to secure roles in UAE, Saudi Arabia, and other Gulf regions.',
                      duration: '48:10',
                      author: 'Saboor Ahmad',
                      authorInitials: 'SA',
                      authorBg: 'bg-brandGreen'
                    }
                  ].map((video) => (
                    <div
                      key={video.id}
                      className="bg-bgLight rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between premium-card-hover"
                    >
                      <div>
                        {/* Direct YouTube Video Thumbnail Area */}
                        <a
                          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative aspect-video bg-navy-dark flex items-center justify-center overflow-hidden group/thumb block cursor-pointer"
                          title={`Watch "${video.title}" on YouTube`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent z-10 pointer-events-none"></div>
                          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(0,200,83,0.3),transparent)] group-hover/thumb:scale-110 transition-transform duration-500 pointer-events-none"></div>
                          <div className="z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brandGreen/90 group-hover/thumb:bg-brandGreen text-white flex items-center justify-center shadow-lg transform group-hover/thumb:scale-110 transition-all duration-300">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-1" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                          <span className="absolute bottom-3 right-3 bg-navy-dark/90 text-white text-[10px] font-bold px-2 py-0.5 rounded z-20">
                            {video.duration}
                          </span>
                        </a>

                        {/* Body */}
                        <div className="p-5 sm:p-6">
                          <span className="text-brandGreen text-[10px] font-extrabold uppercase tracking-widest">
                            {video.tag}
                          </span>
                          <a
                            href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base sm:text-lg font-extrabold text-navy mt-2 leading-snug hover:text-brandGreen transition-colors block"
                          >
                            {video.title}
                          </a>
                          <p className="text-gray-500 text-xs mt-3 leading-relaxed">
                            {video.desc}
                          </p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-4 border-t border-gray-100/50 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${video.authorBg} text-white font-bold flex items-center justify-center text-xs shadow-sm`}>
                            {video.authorInitials}
                          </div>
                          <span className="text-[11px] font-semibold text-gray-600">{video.author}</span>
                        </div>
                        <a
                          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-navy hover:bg-brandGreen text-white rounded-lg text-xs font-bold transition-all duration-300 flex items-center space-x-1"
                        >
                          <span>Watch Now</span>
                          <svg className="w-3 h-3 fill-current ml-0.5" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 7. Communities & Resources Sections */}
            <section className="py-16 sm:py-24 bg-bgLight reveal-on-scroll w-full max-w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                  {/* Communities Column */}
                  <div id="communities" className="lg:col-span-6 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col space-y-2 mb-6 sm:mb-8">
                        <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase">WhatsApp Channels</span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight relative pb-3">
                          STUDENT COMMUNITIES
                          <span className="absolute bottom-0 left-0 w-16 h-1 bg-brandGreen rounded-full" />
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 pt-2">
                          Interact directly with seniors, access immediate vacancy alerts, and share peer-to-peer prep files.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {communities.map((comm, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm premium-card-hover"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-gray-800 text-sm sm:text-base">{comm.name}</h3>
                              <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-brandGreen font-bold rounded-full">{comm.members}</span>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">{comm.desc}</p>
                            <button
                              onClick={() => {
                                if (!requireAuth('join student community rooms')) return;
                                handleJoinCommunity(comm.id);
                              }}
                              className="mt-4 flex items-center text-xs font-semibold text-brandGreen hover:underline cursor-pointer"
                            >
                              Join Room <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Resources Column */}
                  <div id="resources" className="lg:col-span-6 flex flex-col justify-between mt-8 lg:mt-0">
                    <div>
                      <div className="flex flex-col space-y-2 mb-6 sm:mb-8">
                        <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase">Preparation Material</span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight relative pb-3">
                          POPULAR RESOURCES
                          <span className="absolute bottom-0 left-0 w-16 h-1 bg-brandGreen rounded-full" />
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 pt-2">
                          Free, download-ready toolkits created by qualified experts to elevate your professional toolkit.
                        </p>
                      </div>

                      <div className="space-y-3.5 sm:space-y-4">
                        {resources.map((res, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-xl p-3.5 sm:p-4 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm premium-card-hover"
                          >
                            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                              <div className="w-10 h-10 rounded-lg bg-emerald-500/5 flex items-center justify-center flex-shrink-0">
                                {res.icon}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-navy text-sm sm:text-base truncate">{res.title}</span>
                                <span className="text-xs text-gray-400 font-medium">{res.type} • {res.size}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                if (!requireAuth('download study resources')) return;
                                alert(`Downloading ${res.title}... File is being prepared.`);
                              }}
                              className="w-full sm:w-auto px-4 py-2 bg-gray-50 hover:bg-brandGreen hover:text-white border border-gray-200 hover:border-brandGreen rounded-lg text-xs font-semibold text-navy transition-all duration-200 cursor-pointer text-center"
                            >
                              Download
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab('Resources');
                          }}
                          className="w-full flex items-center justify-center py-3.5 bg-navy hover:bg-brandGreen text-white font-bold rounded-xl text-xs transition-colors duration-200 shadow-md cursor-pointer"
                        >
                          View All Resources
                          <ArrowRight className="w-4 h-4 ml-1.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* 8. Announcements Preview Section */}
            <section id="announcements" className="w-full max-w-full py-16 sm:py-24 bg-gray-50 border-t border-gray-100 reveal-on-scroll">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
                  <div className="flex flex-col space-y-2 sm:space-y-3">
                    <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase">Updates & Events</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight relative pb-3">
                      LATEST ANNOUNCEMENTS
                      <span className="absolute bottom-0 left-0 w-16 h-1 bg-brandGreen rounded-full" />
                    </h2>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Announcements');
                    }}
                    className="flex items-center text-sm font-bold text-navy hover:text-brandGreen transition-colors mt-4 sm:mt-0 cursor-pointer self-start sm:self-auto"
                  >
                    All Announcements
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {announcements.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden premium-card-hover"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-2.5 py-0.5 bg-emerald-500/10 text-[10px] font-bold text-brandGreen rounded-full">
                            {item.tag}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">{item.date}</span>
                        </div>
                        <h3 className="text-base font-bold text-navy leading-snug hover:text-brandGreen cursor-pointer transition-colors mb-3">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed font-normal">{item.desc}</p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                        <span className={`text-[10px] uppercase tracking-wider font-extrabold ${item.status === 'Open' ? 'text-green-500' : item.status === 'Upcoming' ? 'text-amber-500' : 'text-blue-500'
                          }`}>
                          • {item.status}
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleViewAnnouncement(item.id);
                          }}
                          className="text-xs font-bold text-navy hover:text-brandGreen transition-colors cursor-pointer"
                        >
                          Read Full Post
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* 9. Success Stories & Verified Feedback Section */}
            <section className="w-full max-w-full py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll">

              <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 flex flex-col items-center">
                <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase mb-2">Student Proof & Reviews</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy tracking-tight pb-3 relative">
                  SUCCESS STORIES & FEEDBACK
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-brandGreen rounded-full" />
                </h2>
                <p className="text-gray-500 mt-4 text-xs sm:text-sm md:text-base">
                  Real feedback from students placed in Big 4 and corporate firms through our free mentorship ecosystem.
                </p>

                {/* 3-Way Feedback View Mode Switcher */}
                <div className="flex items-center space-x-1 sm:space-x-2 mt-6 p-1.5 bg-gray-100 rounded-2xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setFeedbackViewMode('reviews')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      feedbackViewMode === 'reviews'
                        ? 'bg-white text-navy shadow-sm font-black'
                        : 'text-gray-500 hover:text-navy'
                    }`}
                  >
                    💬 Student Quotes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackViewMode('chats')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      feedbackViewMode === 'chats'
                        ? 'bg-white text-navy shadow-sm font-black'
                        : 'text-gray-500 hover:text-navy'
                    }`}
                  >
                    📱 Chat Screenshots
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackViewMode('video')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      feedbackViewMode === 'video'
                        ? 'bg-white text-navy shadow-sm font-black'
                        : 'text-gray-500 hover:text-navy'
                    }`}
                  >
                    🎥 Video Reviews
                  </button>
                </div>
              </div>

              {/* VIEW 1: TEXT QUOTES */}
              {feedbackViewMode === 'reviews' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-fadeIn">
                  {successStories.map((story, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative premium-card-hover"
                    >
                      <div className="absolute top-5 right-5 sm:top-6 sm:right-6 text-brandGreen/25">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 fill-current" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                      </div>

                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed pt-2">
                          "{story.quote}"
                        </p>
                      </div>

                      <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-100 flex items-center space-x-3 sm:space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brandGreen to-emerald-600 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-md text-xs sm:text-sm">
                          {story.avatar}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-navy text-xs sm:text-sm leading-none truncate">{story.name}</span>
                          <span className="text-[11px] sm:text-xs text-brandGreen font-medium mt-1 truncate">{story.role}</span>
                          <span className="text-[10px] text-gray-400 mt-0.5 truncate">Placed at {story.placedAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* VIEW 2: VERIFIED CHAT SCREENSHOT CARDS (WHATSAPP / LINKEDIN) */}
              {feedbackViewMode === 'chats' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                  {chatScreenshots.map((chat) => (
                    <div
                      key={chat.id}
                      className="bg-[#0b141a] rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-950/60 flex flex-col justify-between text-left space-y-4 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                            {chat.sender.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-white text-xs block">{chat.sender}</span>
                            <span className="text-[10px] text-emerald-400 font-semibold">{chat.firm}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-wider border border-emerald-500/30">
                          {chat.verifiedBadge}
                        </span>
                      </div>

                      {/* WhatsApp chat bubble */}
                      <div className="bg-[#1f2c34] p-4 rounded-2xl rounded-tl-sm text-xs text-gray-200 space-y-2 relative shadow-inner">
                        <p className="leading-relaxed text-[11px] sm:text-xs font-medium text-emerald-50/90">
                          "{chat.message}"
                        </p>
                        <div className="text-[9px] text-gray-400 flex items-center justify-end space-x-1">
                          <span>{chat.date}</span>
                          <span className="text-emerald-400 font-bold">✓✓</span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[11px] text-gray-400">
                        <span className="italic">{chat.category}</span>
                        <span className="text-emerald-400 font-semibold text-[10px]">Verified Student Feedback</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* VIEW 3: VIDEO TESTIMONIALS */}
              {feedbackViewMode === 'video' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                  {videoTestimonials.map((vid) => (
                    <div
                      key={vid.id}
                      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col justify-between text-left hover:shadow-lg transition-all"
                    >
                      {/* Video Player Card Frame */}
                      <div className="aspect-video bg-gradient-to-tr from-[#021B3A] to-[#090C11] relative flex items-center justify-center group cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-brandGreen text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono">
                          {vid.duration}
                        </span>
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-brandGreen text-white text-[9px] font-black uppercase">
                          {vid.firm}
                        </span>
                      </div>

                      <div className="p-5 space-y-2">
                        <h4 className="font-extrabold text-navy text-sm leading-snug">{vid.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{vid.desc}</p>
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                          <span className="font-bold text-gray-700">{vid.name}</span>
                          <span className="text-brandGreen font-semibold">Video Verified</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Indicator */}
              <div className="flex items-center justify-center space-x-2 mt-8 sm:mt-10">
                <span className="w-6 h-2 rounded-full bg-brandGreen"></span>
                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
              </div>
            </section>

            {/* 10. WhatsApp CTA Section */}
            <section className="w-full max-w-full px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 reveal-on-scroll">
              <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl shadow-emerald-500/10 text-white flex flex-col lg:flex-row items-center justify-between relative overflow-hidden">
                  {/* Visual background ripple rings */}
                  <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-white/5 border-4 border-white/5 pointer-events-none" />
                  <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/5 border border-white/5 pointer-events-none" />

                  <div className="flex flex-col lg:flex-row items-center space-y-4 sm:space-y-6 lg:space-y-0 lg:space-x-8 text-center lg:text-left z-10">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10">
                      <svg className="w-8 h-8 sm:w-12 sm:h-12 fill-current text-white" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div className="flex flex-col space-y-1.5 sm:space-y-2">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">Join Our Free CA Student Community</h3>
                      <p className="text-xs sm:text-sm text-white/90 max-w-xl font-medium leading-relaxed">
                        Stay updated with latest Jobs, Inductions & Announcements. Join the active discussion room with over 10,000+ peers.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 lg:mt-0 z-10 w-full lg:w-auto">
                    <button
                      onClick={() => {
                        if (!requireAuth('join our student communities')) return;
                        setActiveTab('Community');
                      }}
                      className="w-full sm:w-auto flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-gray-50 text-emerald-600 font-bold rounded-xl shadow-lg transition-all duration-200 group text-sm sm:text-base mx-auto lg:mx-0"
                    >
                      Join Now
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      {/* 11. Footer */}
      {activeTab !== 'Login' && activeTab !== 'Register' && activeTab !== 'AdminDashboard' && activeTab !== 'UserDashboard' && (
        <footer className="w-full max-w-full bg-navy-dark text-white pt-10 sm:pt-12 pb-6 mt-auto border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-8 lg:gap-10 pb-8 border-b border-white/5">

              {/* Column 1: Brand & Logo */}
              <div className="sm:col-span-2 md:col-span-6 lg:col-span-4 flex flex-col space-y-4">
                <div className="flex items-center space-x-2.5 sm:space-x-3 select-none">
                  <img
                    src={logoImg}
                    alt="The TaxMan's Capital Logo"
                    className="h-10 w-auto object-contain shrink-0 drop-shadow-[0_2px_10px_rgba(0,230,118,0.25)] translate-y-1"
                  />
                  <div className="flex flex-col min-w-0 justify-center">
                    <span className="text-white font-black text-base leading-none tracking-tight font-['Outfit',sans-serif]">
                      The TaxMan's
                    </span>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <span className="h-[1px] w-3.5 bg-gradient-to-r from-transparent to-[#00E676]/80"></span>
                      <span className="text-[#00E676] font-bold text-[10px] tracking-[0.26em] uppercase leading-none font-['Outfit',sans-serif]">
                        Capital
                      </span>
                      <span className="h-[1px] w-3.5 bg-gradient-to-l from-transparent to-[#00E676]/80"></span>
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 font-normal leading-relaxed max-w-sm">
                  Your trusted platform for CA & ACCA career guidance, job vacancies, inductions, counseling and peer student community support.
                </p>

                {/* Social Icons */}
                <div className="flex space-x-3">
                  <a href="https://www.facebook.com/saboor.ahmad.3956?utm_source=ig&utm_medium=social&utm_content=link_in_bio" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-brandGreen hover:bg-brandGreen/10 flex items-center justify-center text-gray-400 hover:text-brandGreen transition-all duration-200">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                    </svg>
                  </a>
                  <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-brandGreen hover:bg-brandGreen/10 flex items-center justify-center text-gray-400 hover:text-brandGreen transition-all duration-200">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/saboornoor10" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-brandGreen hover:bg-brandGreen/10 flex items-center justify-center text-gray-400 hover:text-brandGreen transition-all duration-200">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/in/saboorahmad10" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-brandGreen hover:bg-brandGreen/10 flex items-center justify-center text-gray-400 hover:text-brandGreen transition-all duration-200">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75-1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Column 2: Quick Links */}
              <div className="sm:col-span-1 md:col-span-3 lg:col-span-2 flex flex-col space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-brandGreen">Quick Links</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                  <li>
                    <a
                      href="/inductions"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Inductions');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Inductions
                    </a>
                  </li>
                  <li>
                    <a
                      href="/jobs"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Jobs');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Pakistan Jobs
                    </a>
                  </li>
                  <li>
                    <a
                      href="/overseas"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Overseas');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Overseas Jobs
                    </a>
                  </li>
                  <li>
                    <a
                      href="/guidance"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Counseling');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Career Support
                    </a>
                  </li>
                  <li>
                    <a
                      href="/careertools"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Career Tools');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Career Tools & AI Hub
                    </a>
                  </li>
                  <li>
                    <a
                      href="/communities"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Community');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Community
                    </a>
                  </li>
                  <li>
                    <a
                      href="/mission"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Our Mission');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Our Mission
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Contact Us');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 3: Resources */}
              <div className="sm:col-span-1 md:col-span-3 lg:col-span-2 flex flex-col space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-brandGreen">Popular Resources</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                  <li>
                    <a
                      href="/resources-induction"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Resources');
                        setResourcesCategory('Training/Induction');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      CV Templates
                    </a>
                  </li>
                  <li>
                    <a
                      href="/resources-induction"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Resources');
                        setResourcesCategory('Training/Induction');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Interview Questions
                    </a>
                  </li>
                  <li>
                    <a
                      href="/resources-induction"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Resources');
                        setResourcesCategory('Training/Induction');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      CA Firms List
                    </a>
                  </li>
                  <li>
                    <a
                      href="/resources-caf"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Resources');
                        setResourcesCategory('CAF');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      CAF revision notes
                    </a>
                  </li>
                  <li>
                    <a
                      href="/resources-acca"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Resources');
                        setResourcesCategory('ACCA');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      ACCA Guides
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 4: Contact Us */}
              <div className="sm:col-span-1 md:col-span-3 lg:col-span-2 flex flex-col space-y-4">
                <h3
                  onClick={() => {
                    setActiveTab('Contact Us');
                  }}
                  className="text-sm font-bold uppercase tracking-wider text-brandGreen cursor-pointer hover:text-brandGreen/80 transition-colors"
                >
                  Contact Us
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-gray-400">
                  <li className="flex items-center space-x-2.5">
                    <Phone className="w-4 h-4 text-brandGreen flex-shrink-0" />
                    <span>+92 300 1234567</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Mail className="w-4 h-4 text-brandGreen flex-shrink-0" />
                    <span className="break-all">info@cacareerhub.pk</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <MapPin className="w-4 h-4 text-brandGreen flex-shrink-0" />
                    <span>Lahore, Pakistan</span>
                  </li>
                </ul>
              </div>

              {/* Column 5: Newsletter */}
              <div className="sm:col-span-1 md:col-span-3 lg:col-span-2 flex flex-col space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-brandGreen">Newsletter</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-normal">
                  Subscribe to get the latest updates on jobs and inductions.
                </p>

                <form onSubmit={handleSubscribe} className="flex flex-col space-y-2 mt-2">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brandGreen pr-10 transition-colors"
                    />
                    <button
                      type="submit"
                      className="absolute right-1 top-1 bottom-1 px-2.5 bg-brandGreen hover:bg-brandGreen-dark rounded-md text-white flex items-center justify-center transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {announcementSubscribed && (
                    <span className="text-[10px] text-brandGreen font-medium animate-fadeIn">✓ Subscribed successfully!</span>
                  )}
                </form>
              </div>

            </div>

            {/* Bottom Footer Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-5 sm:pt-6 text-xs text-gray-500 text-center sm:text-left gap-3 sm:gap-0">
              <p>
                &copy; {new Date().getFullYear()} The TaxMan's Capital. All Rights Reserved.
              </p>
              <div className="flex space-x-6">
                <button
                  type="button"
                  onClick={() => {
                    setLegalModalTab('privacy');
                    setShowLegalModal(true);
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => {
                    setLegalModalTab('terms');
                    setShowLegalModal(true);
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Premium Floating "Complete Profile" Banner */}
      {showProfilePrompt && isLoggedIn && !isAdmin && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-auto sm:max-w-sm bg-navy text-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/10 animate-slideUp font-sans">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brandGreen/25 flex items-center justify-center text-brandGreen shrink-0 mt-0.5 animate-pulse">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex-grow space-y-1 text-left min-w-0">
              <h4 className="font-extrabold text-xs sm:text-sm text-white tracking-tight">Complete Your Profile!</h4>
              <p className="text-[11px] text-gray-300 font-semibold leading-relaxed">
                Add a profile photo and select your educational stage to unlock custom placement recommendations.
              </p>
              <div className="flex items-center space-x-3 pt-3">
                <button
                  onClick={() => {
                    setShowProfilePrompt(false);
                    setUserDashboardTab('Settings');
                    setActiveTab('UserDashboard');
                  }}
                  className="px-4 py-2 bg-brandGreen hover:bg-brandGreen-dark text-white font-extrabold text-[10px] uppercase rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Complete Now
                </button>
                <button
                  onClick={() => {
                    setShowProfilePrompt(false);
                    sessionStorage.setItem('dismissed_profile_prompt', 'true');
                  }}
                  className="text-[10px] text-gray-400 hover:text-white font-bold hover:underline transition-all cursor-pointer"
                >
                  Maybe Later
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                setShowProfilePrompt(false);
                sessionStorage.setItem('dismissed_profile_prompt', 'true');
              }}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}


      {/* Terms & Privacy Data Protection Policy Modal */}
      <TermsAndPrivacyModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        initialTab={legalModalTab}
      />

    </div>
  );
}
