import { useState, useEffect } from 'react';
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
  Sparkles
} from 'lucide-react';
import mentorImage from '../../../assets/mentor_portrait.png';
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
import { getProfiles, logoutUser, registerUser } from '../../../services/authService';
import { INITIAL_JOBS } from '../../../data/jobsData';

export default function Home({ session, sessionLoading }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [resourcesCategory, setResourcesCategory] = useState('All');
  const [announcementSubscribed, setAnnouncementSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginStartFlipped, setLoginStartFlipped] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarLetter, setAvatarLetter] = useState('U');
  const [isAdmin, setIsAdmin] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([1, 3, 5]);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [userDashboardTab, setUserDashboardTab] = useState('Overview');

  useEffect(() => {
    if (session?.user?.id) {
      const stored = localStorage.getItem(`saved_jobs_${session.user.id}`);
      const timer = setTimeout(() => {
        if (stored) {
          setSavedJobs(JSON.parse(stored));
        } else {
          setSavedJobs([1, 3, 5]);
        }
      }, 0);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setSavedJobs([1, 3, 5]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [session]);

  const handleToggleSaveJob = (id) => {
    setSavedJobs(prev => {
      const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      if (session?.user?.id) {
        localStorage.setItem(`saved_jobs_${session.user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  useEffect(() => {
    if (sessionLoading) {
      const timer = setTimeout(() => {
        setAuthLoading(true);
      }, 0);
      return () => clearTimeout(timer);
    }

    if (!session) {
      const timer = setTimeout(() => {
        setIsLoggedIn(false);
        setUsername('');
        setAvatarLetter('U');
        setIsAdmin(false);
        setAuthLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    const timer1 = setTimeout(() => {
      setIsLoggedIn(true);
      const userMeta = session.user.user_metadata;
      const displayUsername = userMeta?.username || session.user.email?.split('@')[0] || 'User';
      setUsername(displayUsername);
      setAvatarLetter(displayUsername.charAt(0).toUpperCase());
      setAuthLoading(true);

      getProfiles().then(profiles => {
        const profile = profiles.find(p => p.id === session.user.id);
        const isEmailAdmin = session.user.email?.toLowerCase().includes('admin');

        if (profile) {
          setIsAdmin(profile.role === 'admin' || profile.role === 'team_head' || isEmailAdmin);
          setAvatarUrl(profile.avatar_url || '');

          // Trigger profile prompt check for regular users
          const isProfileIncomplete = !profile.avatar_url || !profile.level;
          const promptDismissed = sessionStorage.getItem('dismissed_profile_prompt') === 'true';
          if (isProfileIncomplete && !promptDismissed && profile.role !== 'admin' && profile.role !== 'team_head' && !isEmailAdmin) {
            setTimeout(() => {
              setShowProfilePrompt(true);
            }, 2000);
          }
        } else {
          // Self-heal profile record in localStorage
          registerUser(
            session.user.email,
            'user123',
            displayUsername,
            userMeta?.full_name || displayUsername
          ).then(() => {
            console.log("Self-healed missing profile record successfully.");
            setIsAdmin(isEmailAdmin);
          }).catch(err => {
            console.error("Failed to self-heal profile record:", err);
            setIsAdmin(isEmailAdmin);
          });
        }
        setAuthLoading(false);
      }).catch(err => {
        console.error('Error fetching profiles:', err);
        setIsAdmin(session.user.email?.toLowerCase().includes('admin'));
        setAuthLoading(false);
      });
    }, 0);

    return () => clearTimeout(timer1);
  }, [session, sessionLoading]);
  const [selectedJobIdForModal, setSelectedJobIdForModal] = useState(null);
  const [selectedCommunityIdForModal, setSelectedCommunityIdForModal] = useState(null);
  const [selectedAnnouncementIdForModal, setSelectedAnnouncementIdForModal] = useState(null);

  const handleViewJobDetails = (id) => {
    setActiveTab('Inductions');
    window.history.pushState(null, '', '#inductions');
    setSelectedJobIdForModal(id);
  };

  const handleJoinCommunity = (id) => {
    setActiveTab('Community');
    window.history.pushState(null, '', '#communities');
    setSelectedCommunityIdForModal(id);
  };

  const handleViewAnnouncement = (id) => {
    setActiveTab('Announcements');
    window.history.pushState(null, '', '#announcements');
    setSelectedAnnouncementIdForModal(id);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#jobs') {
        setActiveTab('Jobs');
      } else if (hash === '#inductions') {
        setActiveTab('Inductions');
      } else if (hash === '#overseas') {
        setActiveTab('Overseas');
      } else if (hash === '#guidance') {
        setActiveTab('Counseling');
      } else if (hash === '#careertools' || hash === '#career-tools' || hash === '#tools') {
        setActiveTab('Career Tools');
      } else if (hash === '#communities') {
        setActiveTab('Community');
      } else if (hash === '#podcasts' || hash === '#videos' || hash === '#sessions') {
        setActiveTab('Podcasts');
      } else if (hash === '#mission') {
        setActiveTab('Our Mission');
      } else if (hash === '#admin') {
        setActiveTab('AdminDashboard');
      } else if (hash === '#dashboard' || hash === '#user-dashboard') {
        setActiveTab('UserDashboard');
      } else if (hash === '#vision') {
        setActiveTab('Our Mission');
        setTimeout(() => {
          const element = document.getElementById('our-vision');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      } else if (hash.startsWith('#resources')) {
        setActiveTab('Resources');
        const subCat = hash.split('-')[1];
        if (subCat === 'prc') setResourcesCategory('PRC');
        else if (subCat === 'caf') setResourcesCategory('CAF');
        else if (subCat === 'induction') setResourcesCategory('Training/Induction');
        else if (subCat === 'cfap') setResourcesCategory('CFAP & SCS (Finals)');
        else if (subCat === 'qualified') setResourcesCategory('CA Qualified');
        else if (subCat === 'acca') setResourcesCategory('ACCA');
        else setResourcesCategory('All');
      } else if (hash === '#contact') {
        setActiveTab('Contact Us');
      } else if (hash === '#announcements') {
        setActiveTab('Announcements');
      } else if (hash === '#events') {
        setActiveTab('Events');
      } else if (hash === '#team') {
        setActiveTab('Our Mission');
        setTimeout(() => {
          const element = document.getElementById('our-team');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      } else if (hash === '#login') {
        setActiveTab('Login');
        setLoginStartFlipped(false);
      } else if (hash === '#signup' || hash === '#register') {
        setActiveTab('Login');
        setLoginStartFlipped(true);
      } else if (hash === '#' || hash === '') {
        setActiveTab('Home');
      } else {
        setActiveTab('Home');
        // Wait for page render, then smooth scroll to the target section
        setTimeout(() => {
          const element = document.getElementById(hash.substring(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Lightweight profile refresh on tab change
  useEffect(() => {
    if (session?.user?.id) {
      getProfiles().then(profiles => {
        const profile = profiles.find(p => p.id === session.user.id);
        if (profile) {
          setAvatarUrl(profile.avatar_url || '');
          setUsername(profile.full_name || profile.username || session.user.email?.split('@')[0] || 'User');
        }
      }).catch(console.error);
    }
  }, [activeTab, session]);

  useEffect(() => {
    if (sessionLoading || authLoading) return;

    if (activeTab === 'AdminDashboard') {
      if (!isLoggedIn) {
        const timer = setTimeout(() => {
          setActiveTab('Login');
          window.history.pushState(null, '', '#login');
        }, 0);
        return () => clearTimeout(timer);
      } else if (!isAdmin) {
        alert('Access Denied: You do not have administrator permissions.');
        const timer = setTimeout(() => {
          setActiveTab('Home');
          window.history.pushState(null, '', '#');
        }, 0);
        return () => clearTimeout(timer);
      }
    } else if (activeTab === 'UserDashboard') {
      if (!isLoggedIn) {
        const timer = setTimeout(() => {
          setActiveTab('Login');
          window.history.pushState(null, '', '#login');
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [activeTab, isLoggedIn, isAdmin, sessionLoading, authLoading]);

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

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim() !== '') {
      setAnnouncementSubscribed(true);
      setEmailInput('');
      setTimeout(() => setAnnouncementSubscribed(false), 5000);
    }
  };
  return (
    <div className="min-h-screen bg-bgLight text-textColor flex flex-col selection:bg-brandGreen selection:text-white">

      {/* 1. Navbar */}
      {activeTab !== 'Login' && activeTab !== 'Register' && activeTab !== 'AdminDashboard' && activeTab !== 'UserDashboard' && (
        <nav className="bg-navy/95 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <div
                onClick={() => {
                  setActiveTab('Home');
                  window.location.hash = '';
                }}
                className="flex-shrink-0 flex items-center space-x-2.5 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brandGreen to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-transform duration-300">
                  <span className="text-white font-extrabold text-xl tracking-tighter">TM</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-extrabold text-base xl:text-lg leading-tight tracking-wide whitespace-nowrap group-hover:text-brandGreen transition-colors">The TaxMan's Capital</span>
                  <span className="text-brandGreen text-[10px] uppercase tracking-widest font-bold hidden sm:block lg:hidden xl:block">Guidance. Opportunities. Success.</span>
                </div>
              </div>

              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center space-x-1 xl:space-x-4 h-full">
                {/* Home */}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('Home');
                    window.location.hash = '';
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
                      href="#inductions"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Inductions');
                        window.location.hash = '#inductions';
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Inductions' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      CA/ACCA Inductions
                    </a>
                    <a
                      href="#jobs"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Jobs');
                        window.location.hash = '#jobs';
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Jobs' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Pakistan Jobs
                    </a>
                    <a
                      href="#overseas"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Overseas');
                        window.location.hash = '#overseas';
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Overseas' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Overseas Jobs
                    </a>
                    <a
                      href="#guidance"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Counseling');
                        window.location.hash = '#guidance';
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Counseling' || activeTab === 'Career Support' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Career Support
                    </a>
                    <a
                      href="#careertools"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Career Tools');
                        window.location.hash = '#careertools';
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
                      href="#resources"
                      onClick={(e) => {
                        e.preventDefault();
                        setResourcesCategory('All');
                        setActiveTab('Resources');
                        window.location.hash = '#resources';
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Resources' && resourcesCategory === 'All' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      All Resources
                    </a>
                    <a
                      href="#resources-prc"
                      onClick={(e) => {
                        e.preventDefault();
                        setResourcesCategory('PRC');
                        setActiveTab('Resources');
                        window.location.hash = '#resources-prc';
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Resources' && resourcesCategory === 'PRC' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      PRC (Entry Level)
                    </a>
                    <a
                      href="#resources-caf"
                      onClick={(e) => {
                        e.preventDefault();
                        setResourcesCategory('CAF');
                        setActiveTab('Resources');
                        window.location.hash = '#resources-caf';
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Resources' && resourcesCategory === 'CAF' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      CAF (Intermediate)
                    </a>
                    <a
                      href="#resources-induction"
                      onClick={(e) => {
                        e.preventDefault();
                        setResourcesCategory('Training/Induction');
                        setActiveTab('Resources');
                        window.location.hash = '#resources-induction';
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Resources' && resourcesCategory === 'Training/Induction' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Training / Induction
                    </a>
                    <a
                      href="#resources-cfap"
                      onClick={(e) => {
                        e.preventDefault();
                        setResourcesCategory('CFAP & SCS (Finals)');
                        setActiveTab('Resources');
                        window.location.hash = '#resources-cfap';
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Resources' && resourcesCategory === 'CFAP & SCS (Finals)' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      CFAP & SCS (Finals)
                    </a>
                    <a
                      href="#resources-qualified"
                      onClick={(e) => {
                        e.preventDefault();
                        setResourcesCategory('CA Qualified');
                        setActiveTab('Resources');
                        window.location.hash = '#resources-qualified';
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Resources' && resourcesCategory === 'CA Qualified' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      CA Qualified
                    </a>
                    <a
                      href="#resources-acca"
                      onClick={(e) => {
                        e.preventDefault();
                        setResourcesCategory('ACCA');
                        setActiveTab('Resources');
                        window.location.hash = '#resources-acca';
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
                    className={`px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-300 flex items-center space-x-1.5 cursor-pointer ${activeTab === 'Community' || activeTab === 'Announcements'
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
                      href="#communities"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Community');
                        window.location.hash = '#communities';
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Community' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Communities
                    </a>
                    <a
                      href="#announcements"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Announcements');
                        window.location.hash = '#announcements';
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Announcements' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Announcements
                    </a>
                    <a
                      href="#events"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Events');
                        window.location.hash = '#events';
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Events' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Events
                    </a>
                    <a
                      href="#podcasts"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Podcasts');
                        window.location.hash = '#podcasts';
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
                      href="#mission"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Our Mission');
                        window.location.hash = '#mission';
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Our Mission' && window.location.hash !== '#vision' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Our Mission
                    </a>
                    <a
                      href="#vision"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Our Mission');
                        window.location.hash = '#vision';
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Our Mission' && window.location.hash === '#vision' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Our Vision
                    </a>
                    <a
                      href="#contact"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Contact Us');
                        window.location.hash = '#contact';
                      }}
                      className={`block px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors hover:text-brandGreen hover:bg-white/5 ${activeTab === 'Contact Us' ? 'text-brandGreen bg-white/5' : 'text-gray-300'
                        }`}
                    >
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>

              {/* Desktop Auth Actions & Icons */}
              <div className="hidden lg:flex items-center space-x-3">
                {isLoggedIn ? (
                  <>
                    <button className="relative p-2 text-gray-300 hover:text-white transition-colors cursor-pointer">
                      <Bell className="w-5.5 h-5.5" />
                      <span className="absolute top-1 right-1 w-4 h-4 bg-brandGreen text-white text-[9px] font-bold rounded-full border-2 border-navy flex items-center justify-center">3</span>
                    </button>

                    <button
                      onClick={() => {
                        if (isAdmin) {
                          setActiveTab('AdminDashboard');
                          window.location.hash = '#admin';
                        } else {
                          setUserDashboardTab('Overview');
                          setActiveTab('UserDashboard');
                          window.location.hash = '#dashboard';
                        }
                      }}
                      className="px-4 py-1.5 bg-brandGreen hover:bg-brandGreen-dark text-white text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap"
                    >
                      {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
                    </button>

                    {/* Styled Avatar Section */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brandGreen to-emerald-400 text-white font-black flex items-center justify-center text-sm shadow-md cursor-default overflow-hidden border-2 border-white/10">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        avatarLetter
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setLoginStartFlipped(false);
                        setActiveTab('Login');
                        window.location.hash = '#login';
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

              {/* Mobile Menu Button */}
              <div className="lg:hidden flex items-center space-x-3.5">
                <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
                  <Bell className="w-5.5 h-5.5" />
                  <span className="absolute top-1 right-1 w-4 h-4 bg-brandGreen text-white text-[9px] font-bold rounded-full border-2 border-navy flex items-center justify-center">3</span>
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1.5 text-gray-300 hover:text-white focus:outline-none"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-navy-dark border-b border-white/10 py-4 px-6 space-y-4 animate-fadeIn max-h-[80vh] overflow-y-auto">
              {/* Home Link */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('Home');
                  setMobileMenuOpen(false);
                  window.location.hash = '';
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
                    href="#inductions"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Inductions');
                      setMobileMenuOpen(false);
                      window.location.hash = '#inductions';
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Inductions' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Inductions
                  </a>
                  <a
                    href="#jobs"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Jobs');
                      setMobileMenuOpen(false);
                      window.location.hash = '#jobs';
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Jobs' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Pakistan Jobs
                  </a>
                  <a
                    href="#overseas"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Overseas');
                      setMobileMenuOpen(false);
                      window.location.hash = '#overseas';
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Overseas' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Overseas Jobs
                  </a>
                  <a
                    href="#guidance"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Counseling');
                      setMobileMenuOpen(false);
                      window.location.hash = '#guidance';
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Counseling' || activeTab === 'Career Support' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Career Support
                  </a>
                  <a
                    href="#careertools"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Career Tools');
                      setMobileMenuOpen(false);
                      window.location.hash = '#careertools';
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
                    href="#resources"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Resources');
                      setResourcesCategory('All');
                      setMobileMenuOpen(false);
                      window.location.hash = '#resources';
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Resources' && resourcesCategory === 'All' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • All Resources
                  </a>
                  <a
                    href="#resources-prc"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Resources');
                      setResourcesCategory('PRC');
                      setMobileMenuOpen(false);
                      window.location.hash = '#resources-prc';
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Resources' && resourcesCategory === 'PRC' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • PRC (Entry Level)
                  </a>
                  <a
                    href="#resources-caf"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Resources');
                      setResourcesCategory('CAF');
                      setMobileMenuOpen(false);
                      window.location.hash = '#resources-caf';
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Resources' && resourcesCategory === 'CAF' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • CAF (Intermediate)
                  </a>
                  <a
                    href="#resources-induction"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Resources');
                      setResourcesCategory('Training/Induction');
                      setMobileMenuOpen(false);
                      window.location.hash = '#resources-induction';
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Resources' && resourcesCategory === 'Training/Induction' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Training & Induction
                  </a>
                  <a
                    href="#resources-cfap"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Resources');
                      setResourcesCategory('CFAP & SCS (Finals)');
                      setMobileMenuOpen(false);
                      window.location.hash = '#resources-cfap';
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Resources' && resourcesCategory === 'CFAP & SCS (Finals)' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • CFAP & SCS (Finals)
                  </a>
                  <a
                    href="#resources-qualified"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Resources');
                      setResourcesCategory('CA Qualified');
                      setMobileMenuOpen(false);
                      window.location.hash = '#resources-qualified';
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Resources' && resourcesCategory === 'CA Qualified' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • CA Qualified
                  </a>
                  <a
                    href="#resources-acca"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Resources');
                      setResourcesCategory('ACCA');
                      setMobileMenuOpen(false);
                      window.location.hash = '#resources-acca';
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
                    href="#communities"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Community');
                      setMobileMenuOpen(false);
                      window.location.hash = '#communities';
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Community' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Communities
                  </a>
                  <a
                    href="#announcements"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Announcements');
                      setMobileMenuOpen(false);
                      window.location.hash = '#announcements';
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Announcements' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Announcements
                  </a>
                  <a
                    href="#events"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Events');
                      setMobileMenuOpen(false);
                      window.location.hash = '#events';
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Events' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Events
                  </a>
                  <a
                    href="#podcasts"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Podcasts');
                      setMobileMenuOpen(false);
                      window.location.hash = '#podcasts';
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Podcasts' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'}`}
                  >
                    • Videos & Podcasts
                  </a>
                </div>
              </div>

              {/* About Section */}
              <div className="space-y-1">
                <span className="block px-4 text-xs font-bold uppercase tracking-wider text-brandGreen/60">About</span>
                <div className="pl-3 space-y-1">
                  <a
                    href="#mission"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Our Mission');
                      setMobileMenuOpen(false);
                      window.location.hash = '#mission';
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Our Mission' && window.location.hash !== '#vision' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Our Mission
                  </a>
                  <a
                    href="#vision"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Our Mission');
                      setMobileMenuOpen(false);
                      window.location.hash = '#vision';
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Our Mission' && window.location.hash === '#vision' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Our Vision
                  </a>

                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Contact Us');
                      setMobileMenuOpen(false);
                      window.location.hash = '#contact';
                    }}
                    className={`block py-2 px-4 rounded-xl text-sm ${activeTab === 'Contact Us' ? 'text-brandGreen bg-white/5 font-semibold' : 'text-gray-300'
                      }`}
                  >
                    • Contact Us
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col space-y-2">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center space-x-3 px-4 py-2.5 bg-white/5 rounded-xl mb-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brandGreen to-emerald-400 text-white font-black flex items-center justify-center text-xs shadow-inner">
                        {avatarLetter}
                      </div>
                      <span className="text-gray-300 text-sm font-bold">Hi, {username}</span>
                    </div>
                    {isAdmin ? (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setActiveTab('AdminDashboard');
                          window.location.hash = '#admin';
                        }}
                        className="w-full text-center py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-bold rounded-lg text-sm transition-colors mb-2"
                      >
                        Admin Dashboard
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setUserDashboardTab('Overview');
                          setActiveTab('UserDashboard');
                          window.location.hash = '#dashboard';
                        }}
                        className="w-full text-center py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-bold rounded-lg text-sm transition-colors mb-2"
                      >
                        My Dashboard
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        await logoutUser();
                        setIsLoggedIn(false);
                        setMobileMenuOpen(false);
                        setActiveTab('Home');
                      }}
                      className="w-full text-center py-2.5 border border-white/20 rounded-lg text-sm font-medium text-white hover:bg-white/5 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setLoginStartFlipped(false);
                        setActiveTab('Login');
                        window.location.hash = '#login';
                      }}
                      className="w-full text-center py-2.5 border border-white/20 rounded-lg text-sm font-medium text-white hover:bg-white/5 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setLoginStartFlipped(true);
                        setActiveTab('Login');
                        window.history.pushState(null, '', '#signup');
                      }}
                      className="w-full text-center py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      )}

      <div key={activeTab} className="animate-page-transition flex-grow flex flex-col">
        {activeTab === 'Jobs' ? (
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
              window.history.pushState(null, '', '#');
            }}
            onBack={() => {
              setActiveTab('Home');
              window.history.pushState(null, '', '#');
            }}
            onSignUpRedirect={() => {
              window.history.pushState(null, '', '#signup');
              setLoginStartFlipped(true);
            }}
            onLoginRedirect={() => {
              window.history.pushState(null, '', '#login');
              setLoginStartFlipped(false);
            }}
          />
        ) : activeTab === 'AdminDashboard' ? (
          <AdminDashboard
            onLogout={async () => {
              await logoutUser();
              setIsLoggedIn(false);
              setActiveTab('Home');
              window.location.hash = '';
            }}
            currentAdminName={username || 'Ahmad Raza'}
            session={session}
            onProfileUpdate={(newProfile) => {
              if (newProfile.full_name) {
                setUsername(newProfile.full_name);
                setAvatarLetter(newProfile.full_name.charAt(0).toUpperCase());
              }
            }}
          />
        ) : activeTab === 'UserDashboard' ? (
          <UserDashboard
            session={session}
            initialSubTab={userDashboardTab}
            onLogout={async () => {
              await logoutUser();
              setIsLoggedIn(false);
              setActiveTab('Home');
              window.location.hash = '';
            }}
            onGoHome={() => {
              setActiveTab('Home');
              window.location.hash = '';
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
            <section className="skyline-bg bg-navy text-white pt-12 pb-36 relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                  {/* Hero Left Content */}
                  <div className="lg:col-span-7 flex flex-col space-y-8 order-2 lg:order-1">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                      Helping CA & ACCA <br />
                      Students Build <br />
                      <span className="text-brandGreen">Successful Careers</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-300 max-w-xl font-normal leading-relaxed">
                      Find jobs, inductions, free career guidance, resources and student communities across Pakistan.
                    </p>

                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                      <a
                        href="#jobs"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveTab('Jobs');
                          window.location.hash = '#jobs';
                        }}
                        className="flex items-center justify-center px-6 py-4 bg-brandGreen hover:bg-brandGreen-dark text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 group"
                      >
                        <Briefcase className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Explore Jobs
                      </a>
                      <a
                        href="#communities"
                        className="flex items-center justify-center px-6 py-4 border border-white/30 hover:border-white hover:bg-white/5 text-white font-semibold rounded-xl transition-all duration-200"
                      >
                        <Users className="w-5 h-5 mr-2" />
                        Join Community
                      </a>
                    </div>

                    {/* Stacked Avatars and Guided Students Count */}
                    <div className="flex items-center space-x-4 pt-4">
                      <div className="flex -space-x-3 overflow-hidden">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full border-2 border-navy bg-gradient-to-tr from-amber-400 to-orange-500 text-xs font-bold text-white shadow-md">AS</div>
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full border-2 border-navy bg-gradient-to-tr from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-md">KB</div>
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full border-2 border-navy bg-gradient-to-tr from-emerald-400 to-teal-500 text-xs font-bold text-white shadow-md">ZA</div>
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full border-2 border-navy bg-gradient-to-tr from-pink-500 to-rose-600 text-xs font-bold text-white shadow-md">MN</div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-300">
                          <strong className="text-brandGreen text-base">10,000+</strong> CA Students Guided
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-brandGreen animate-pulse"></span>
                          <span className="text-[11px] text-gray-400">Across Lahore, Karachi, Islamabad & globally</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hero Right Graphic Card (Saboor Ahmad Profile) */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center relative translate-y-0 lg:-translate-y-24 mt-6 lg:mt-0 order-1 lg:order-2">
                    {/* Profile Graphic Wrapper */}
                    <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
                      {/* Rotating outer dashed border */}
                      <div className="absolute inset-0 rounded-full border-4 border-dashed border-brandGreen/40 flex items-center justify-center p-3 animate-[spin_60s_linear_infinite] pointer-events-none">
                        <div className="w-full h-full rounded-full border-2 border-brandGreen bg-navy-dark overflow-hidden pointer-events-auto"></div>
                      </div>

                      {/* Portrait Image container over the border */}
                      <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-brandGreen shadow-2xl flex items-center justify-center bg-navy-dark hover:scale-105 transition-transform duration-300">
                        <img
                          src={mentorImage}
                          alt="Saboor Ahmad - Mentor Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Mentor Quote Card - Repositioned to the right side with bottom offset */}
                    <div className="relative mt-8 w-full max-w-sm mx-auto lg:absolute lg:bottom-0 lg:right-12 lg:translate-y-[105%] lg:mt-0 glass-panel text-white p-5 rounded-2xl shadow-2xl border border-white/10 hover:border-brandGreen/40 transition-colors duration-300">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-brandGreen/10 rounded-lg flex-shrink-0">
                          <MessageSquare className="w-5 h-5 text-brandGreen" />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <p className="text-xs italic text-gray-300 leading-relaxed">
                            "My mission is to guide CA/ACCA students, help them build their careers and connect them with the right opportunities."
                          </p>
                          <div className="border-t border-white/10 pt-2 flex flex-col">
                            <span className="text-3xl font-signature text-brandGreen tracking-wide select-none leading-none pt-1">Saboor Ahmad</span>
                            <span className="text-[10px] text-gray-400 mt-1">CA & ACCA | Career Counselor & Mentor</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* 3. Floating Stats Bar Section */}
            <section className="relative -mt-16 z-20 px-4 sm:px-6 lg:px-8 reveal-on-scroll">
              <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    {stats.map((stat, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center space-x-4 py-4 md:py-0 md:px-6 first:pl-0 ${idx > 0 ? 'pt-6 md:pt-0' : ''}`}
                      >
                        <div className={`p-4 rounded-xl ${stat.bg} flex-shrink-0`}>
                          {stat.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-2xl sm:text-3xl font-extrabold text-navy font-sans leading-none">{stat.value}</span>
                          <span className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">{stat.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Latest Induction Updates Section */}
            <section id="jobs" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                <div className="flex flex-col space-y-3">
                  <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase">Opportunities</span>
                  <h2 className="text-3xl font-extrabold text-navy tracking-tight relative pb-3">
                    LATEST INDUCTION UPDATES
                    <span className="absolute bottom-0 left-0 w-16 h-1 bg-brandGreen rounded-full" />
                  </h2>
                </div>
                <a
                  href="#jobs"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('Jobs');
                    window.location.hash = '#jobs';
                  }}
                  className="group flex items-center text-sm font-bold text-navy hover:text-brandGreen transition-colors mt-4 md:mt-0"
                >
                  View All Jobs
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* 5-Card Responsive Job Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
                        className="w-full py-2 bg-navy hover:bg-brandGreen text-white font-medium rounded-lg text-xs transition-colors duration-200 focus:outline-none"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Free Guidance Section */}
            <section id="guidance" className="py-20 bg-gray-50 border-y border-gray-100 reveal-on-scroll">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
                  <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase mb-2">Mentor-Led Support</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight pb-3 relative">
                    FREE CAREER GUIDANCE
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-brandGreen rounded-full" />
                  </h2>
                  <p className="text-gray-500 mt-4 text-sm sm:text-base">
                    Get direct resources and professional feedback curated by industry leaders to kickstart your corporate journey.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {guidanceItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between premium-card-hover"
                    >
                      <div>
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center mb-6 shadow-sm`}>
                          {item.icon}
                        </div>
                        <h3 className="text-lg font-bold text-navy mb-3">{item.title}</h3>
                        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-50">
                        <button
                          onClick={() => setActiveTab('Career Support')}
                          className="flex items-center text-xs font-bold text-brandGreen hover:text-brandGreen-dark transition-colors group"
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
            <section id="why-us" className="py-24 bg-navy text-white relative reveal-on-scroll">
              {/* Subtle grid pattern mask in CSS */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,200,83,0.05),transparent)] pointer-events-none"></div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="text-center max-w-2xl mx-auto mb-20 flex flex-col items-center">
                  <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase mb-2">Our Value</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight pb-3 relative text-white">
                    WHY CHOOSE US?
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-brandGreen rounded-full" />
                  </h2>
                  <p className="text-gray-400 mt-4 text-sm sm:text-base">
                    Providing end-to-end guidance to bridge the gap between hard work and top-tier placements.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                  {whyChooseUs.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center text-center p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-brandGreen/45 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-xl bg-brandGreen/10 border border-brandGreen/30 flex items-center justify-center mb-6">
                        {item.icon}
                      </div>
                      <h3 className="text-base font-bold mb-3 tracking-wide text-white">{item.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-normal">{item.desc}</p>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* Videos, Sessions & Podcasts Section */}
            <section id="podcasts-section" className="py-24 bg-white border-b border-gray-100 reveal-on-scroll">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
                  <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase mb-2">Media & Mentorship</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight pb-3 relative">
                    VIDEOS, SESSIONS & PODCASTS
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-brandGreen rounded-full" />
                  </h2>
                  <p className="text-gray-500 mt-4 text-sm sm:text-base">
                    Watch our exclusive mentorship sessions, partner interview preparation guidelines, and career podcasts.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Card 1 */}
                  <div className="bg-bgLight rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between premium-card-hover">
                    <div>
                      {/* Thumbnail Area */}
                      <div className="relative aspect-video bg-navy-dark flex items-center justify-center overflow-hidden group/thumb">
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent z-10"></div>
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(0,200,83,0.3),transparent)] group-hover/thumb:scale-110 transition-transform duration-500"></div>
                        <div className="z-20 w-14 h-14 rounded-full bg-brandGreen/90 hover:bg-brandGreen text-white flex items-center justify-center shadow-lg cursor-pointer transform group-hover/thumb:scale-110 transition-all duration-300">
                          <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <span className="absolute bottom-3 right-3 bg-navy-dark/80 text-white text-[10px] font-bold px-2 py-0.5 rounded z-20">45:12</span>
                      </div>

                      {/* Body */}
                      <div className="p-6">
                        <span className="text-brandGreen text-[10px] font-extrabold uppercase tracking-widest">Interview Series</span>
                        <h3 className="text-lg font-extrabold text-navy mt-2 leading-snug">Big 4 Partner Interview Secrets & Preparation</h3>
                        <p className="text-gray-500 text-xs mt-3 leading-relaxed">
                          An in-depth session discussing what audit partners look for in CA & ACCA candidates during final round interviews.
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6 pt-4 border-t border-gray-100/50 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-brandGreen text-white font-bold flex items-center justify-center text-xs">SA</div>
                        <span className="text-[11px] font-semibold text-gray-600">Saboor Ahmad</span>
                      </div>
                      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 bg-navy hover:bg-brandGreen text-white hover:text-white rounded-lg text-xs font-bold transition-all duration-300">
                        Watch Now
                      </a>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-bgLight rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between premium-card-hover">
                    <div>
                      {/* Thumbnail Area */}
                      <div className="relative aspect-video bg-navy-dark flex items-center justify-center overflow-hidden group/thumb">
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent z-10"></div>
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(0,200,83,0.3),transparent)] group-hover/thumb:scale-110 transition-transform duration-500"></div>
                        <div className="z-20 w-14 h-14 rounded-full bg-brandGreen/90 hover:bg-brandGreen text-white flex items-center justify-center shadow-lg cursor-pointer transform group-hover/thumb:scale-110 transition-all duration-300">
                          <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <span className="absolute bottom-3 right-3 bg-navy-dark/80 text-white text-[10px] font-bold px-2 py-0.5 rounded z-20">32:45</span>
                      </div>

                      {/* Body */}
                      <div className="p-6">
                        <span className="text-brandGreen text-[10px] font-extrabold uppercase tracking-widest">Career Guidance</span>
                        <h3 className="text-lg font-extrabold text-navy mt-2 leading-snug">CA vs ACCA: Corporate Scope & Salary Packages</h3>
                        <p className="text-gray-500 text-xs mt-3 leading-relaxed">
                          A detailed comparison of qualifications, training structures, and job scopes inside and outside Pakistan.
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6 pt-4 border-t border-gray-100/50 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">US</div>
                        <span className="text-[11px] font-semibold text-gray-600">Usman Saleem</span>
                      </div>
                      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 bg-navy hover:bg-brandGreen text-white hover:text-white rounded-lg text-xs font-bold transition-all duration-300">
                        Watch Now
                      </a>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-bgLight rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between premium-card-hover">
                    <div>
                      {/* Thumbnail Area */}
                      <div className="relative aspect-video bg-navy-dark flex items-center justify-center overflow-hidden group/thumb">
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent z-10"></div>
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(0,200,83,0.3),transparent)] group-hover/thumb:scale-110 transition-transform duration-500"></div>
                        <div className="z-20 w-14 h-14 rounded-full bg-brandGreen/90 hover:bg-brandGreen text-white flex items-center justify-center shadow-lg cursor-pointer transform group-hover/thumb:scale-110 transition-all duration-300">
                          <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <span className="absolute bottom-3 right-3 bg-navy-dark/80 text-white text-[10px] font-bold px-2 py-0.5 rounded z-20">55:18</span>
                      </div>

                      {/* Body */}
                      <div className="p-6">
                        <span className="text-brandGreen text-[10px] font-extrabold uppercase tracking-widest">International Jobs</span>
                        <h3 className="text-lg font-extrabold text-navy mt-2 leading-snug">Securing Middle East Jobs for Qualified Professionals</h3>
                        <p className="text-gray-500 text-xs mt-3 leading-relaxed">
                          Step-by-step roadmap for qualified professionals to secure roles in UAE, Saudi Arabia, and other Gulf regions.
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6 pt-4 border-t border-gray-100/50 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-brandGreen text-white font-bold flex items-center justify-center text-xs">SA</div>
                        <span className="text-[11px] font-semibold text-gray-600">Saboor Ahmad</span>
                      </div>
                      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 bg-navy hover:bg-brandGreen text-white hover:text-white rounded-lg text-xs font-bold transition-all duration-300">
                        Watch Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. Communities & Resources Sections */}
            <section className="py-24 bg-bgLight reveal-on-scroll">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                  {/* Communities Column */}
                  <div id="communities" className="lg:col-span-6 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col space-y-2 mb-8">
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
                            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm premium-card-hover"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-gray-800 text-sm sm:text-base">{comm.name}</h3>
                              <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-brandGreen font-bold rounded-full">{comm.members}</span>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">{comm.desc}</p>
                            <button
                              onClick={() => handleJoinCommunity(comm.id)}
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
                  <div id="resources" className="lg:col-span-6 flex flex-col justify-between mt-12 lg:mt-0">
                    <div>
                      <div className="flex flex-col space-y-2 mb-8">
                        <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase">Preparation Material</span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight relative pb-3">
                          POPULAR RESOURCES
                          <span className="absolute bottom-0 left-0 w-16 h-1 bg-brandGreen rounded-full" />
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 pt-2">
                          Free, download-ready toolkits created by qualified experts to elevate your professional toolkit.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {resources.map((res, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between shadow-sm premium-card-hover"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-lg bg-emerald-500/5 flex items-center justify-center flex-shrink-0">
                                {res.icon}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-navy text-sm sm:text-base">{res.title}</span>
                                <span className="text-xs text-gray-400 font-medium">{res.type} • {res.size}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => alert(`Downloading ${res.title}...`)}
                              className="px-4 py-2 bg-gray-50 hover:bg-brandGreen hover:text-white border border-gray-200 hover:border-brandGreen rounded-lg text-xs font-semibold text-navy transition-all duration-200"
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
                            window.location.hash = '#resources';
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
            <section id="announcements" className="py-24 bg-gray-50 border-t border-gray-100 reveal-on-scroll">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                  <div className="flex flex-col space-y-3">
                    <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase">Updates & Events</span>
                    <h2 className="text-3xl font-extrabold text-navy tracking-tight relative pb-3">
                      LATEST ANNOUNCEMENTS
                      <span className="absolute bottom-0 left-0 w-16 h-1 bg-brandGreen rounded-full" />
                    </h2>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('Announcements');
                      window.location.hash = '#announcements';
                    }}
                    className="flex items-center text-sm font-bold text-navy hover:text-brandGreen transition-colors mt-4 md:mt-0 cursor-pointer"
                  >
                    All Announcements
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {announcements.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden premium-card-hover"
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

            {/* 9. Success Stories Section */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll">

              <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
                <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase mb-2">Testimonials</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight pb-3 relative">
                  SUCCESS STORIES
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-brandGreen rounded-full" />
                </h2>
                <p className="text-gray-500 mt-4 text-sm sm:text-base">
                  Read stories of how CA and ACCA students secured articleships and careers through our guidance resources.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {successStories.map((story, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative premium-card-hover"
                  >
                    {/* Green quote icon absolute at top right */}
                    <div className="absolute top-6 right-6 text-brandGreen/25">
                      <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 italic leading-relaxed pt-2">
                        "{story.quote}"
                      </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-100 flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brandGreen to-emerald-600 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-md">
                        {story.avatar}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-navy text-sm leading-none">{story.name}</span>
                        <span className="text-xs text-brandGreen font-medium mt-1">{story.role}</span>
                        <span className="text-[10px] text-gray-400 mt-0.5">Placed at {story.placedAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Dots */}
              <div className="flex items-center justify-center space-x-2 mt-10">
                <span className="w-6 h-2 rounded-full bg-brandGreen"></span>
                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
              </div>
            </section>

            {/* 10. WhatsApp CTA Section */}
            <section className="px-4 sm:px-6 lg:px-8 pb-16 reveal-on-scroll">
              <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-3xl p-8 sm:p-12 shadow-xl shadow-emerald-500/10 text-white flex flex-col lg:flex-row items-center justify-between relative overflow-hidden">
                  {/* Visual background ripple rings */}
                  <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-white/5 border-4 border-white/5 pointer-events-none" />
                  <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/5 border border-white/5 pointer-events-none" />

                  <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8 text-center lg:text-left z-10">
                    <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 animate-pulse border border-white/10">
                      <svg className="w-12 h-12 fill-current text-white" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Join Our Free CA Student Community</h3>
                      <p className="text-xs sm:text-sm text-white/80 max-w-xl font-medium leading-relaxed">
                        Stay updated with latest Jobs, Inductions & Announcements. Join the active discussion room with over 10,000+ peers.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 lg:mt-0 z-10 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setActiveTab('Community');
                        window.location.hash = '#communities';
                      }}
                      className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-emerald-600 font-bold rounded-xl shadow-lg transition-all duration-200 group"
                    >
                      Join Now
                      <ArrowRight className="w-5 h-5 ml-2 text-emerald-600 group-hover:translate-x-1 transition-transform" />
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
        <footer className="bg-navy-dark text-white pt-10 sm:pt-12 pb-6 mt-auto border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pb-8 border-b border-white/5">

              {/* Column 1: Brand & Logo */}
              <div className="md:col-span-4 flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brandGreen to-emerald-400 flex items-center justify-center">
                    <span className="text-white font-extrabold text-lg tracking-tighter">TM</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-base leading-tight">The TaxMan's Capital</span>
                    <span className="text-brandGreen text-[9px] uppercase tracking-widest font-semibold">Guidance. Opportunities. Success.</span>
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
              <div className="md:col-span-2 flex flex-col space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-brandGreen">Quick Links</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                  <li>
                    <a
                      href="#inductions"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Inductions');
                        window.location.hash = '#inductions';
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Inductions
                    </a>
                  </li>
                  <li>
                    <a
                      href="#jobs"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Jobs');
                        window.location.hash = '#jobs';
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Pakistan Jobs
                    </a>
                  </li>
                  <li>
                    <a
                      href="#overseas"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Overseas');
                        window.location.hash = '#overseas';
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Overseas Jobs
                    </a>
                  </li>
                  <li>
                    <a
                      href="#guidance"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Counseling');
                        window.location.hash = '#guidance';
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Career Support
                    </a>
                  </li>
                  <li>
                    <a
                      href="#careertools"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Career Tools');
                        window.location.hash = '#careertools';
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Career Tools & AI Hub
                    </a>
                  </li>
                  <li>
                    <a
                      href="#communities"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Community');
                        window.location.hash = '#communities';
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Community
                    </a>
                  </li>
                  <li>
                    <a
                      href="#mission"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Our Mission');
                        window.location.hash = '#mission';
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Our Mission
                    </a>
                  </li>
                  <li>
                    <a
                      href="#contact"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Contact Us');
                        window.location.hash = '#contact';
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 3: Resources */}
              <div className="md:col-span-2 flex flex-col space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-brandGreen">Popular Resources</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                  <li>
                    <a
                      href="#resources-induction"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Resources');
                        setResourcesCategory('Training/Induction');
                        window.location.hash = '#resources-induction';
                      }}
                      className="hover:text-white transition-colors"
                    >
                      CV Templates
                    </a>
                  </li>
                  <li>
                    <a
                      href="#resources-induction"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Resources');
                        setResourcesCategory('Training/Induction');
                        window.location.hash = '#resources-induction';
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Interview Questions
                    </a>
                  </li>
                  <li>
                    <a
                      href="#resources-induction"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Resources');
                        setResourcesCategory('Training/Induction');
                        window.location.hash = '#resources-induction';
                      }}
                      className="hover:text-white transition-colors"
                    >
                      CA Firms List
                    </a>
                  </li>
                  <li>
                    <a
                      href="#resources-caf"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Resources');
                        setResourcesCategory('CAF');
                        window.location.hash = '#resources-caf';
                      }}
                      className="hover:text-white transition-colors"
                    >
                      CAF revision notes
                    </a>
                  </li>
                  <li>
                    <a
                      href="#resources-acca"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('Resources');
                        setResourcesCategory('ACCA');
                        window.location.hash = '#resources-acca';
                      }}
                      className="hover:text-white transition-colors"
                    >
                      ACCA Guides
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 4: Contact Us */}
              <div className="md:col-span-2 flex flex-col space-y-4">
                <h3
                  onClick={() => {
                    setActiveTab('Contact Us');
                    window.location.hash = '#contact';
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
              <div className="md:col-span-2 flex flex-col space-y-4">
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
            <div className="flex flex-col sm:flex-row items-center justify-between pt-5 sm:pt-6 text-xs text-gray-500">
              <p className="mb-4 sm:mb-0">
                &copy; {new Date().getFullYear()} The TaxMan's Capital. All Rights Reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                <span>|</span>
                <a href="#terms" className="hover:text-white transition-colors">Terms & Conditions</a>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Premium Floating "Complete Profile" Banner */}
      {showProfilePrompt && isLoggedIn && !isAdmin && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-navy text-white rounded-3xl p-5 shadow-2xl border border-white/10 animate-slideUp font-sans">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-brandGreen/25 flex items-center justify-center text-brandGreen shrink-0 mt-0.5 animate-pulse">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-grow space-y-1 text-left">
              <h4 className="font-extrabold text-sm text-white tracking-tight">Complete Your Profile!</h4>
              <p className="text-[11px] text-gray-300 font-semibold leading-relaxed">
                Add a profile photo and select your educational stage to unlock custom placement recommendations.
              </p>
              <div className="flex items-center space-x-3 pt-3">
                <button
                  onClick={() => {
                    setShowProfilePrompt(false);
                    setUserDashboardTab('Settings');
                    setActiveTab('UserDashboard');
                    window.location.hash = '#dashboard';
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

    </div>
  );
}
