import { useState, useEffect } from 'react';
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
  ExternalLink
} from 'lucide-react';
const supabase = null;
const updateProfileRole = async (id, role) => {
  if (id && role) { /* no-op */ }
  await new Promise(r => setTimeout(r, 300));
};
const replyToMessage = async (id, replyText, adminName) => {
  if (id && replyText && adminName) { /* no-op */ }
  await new Promise(r => setTimeout(r, 300));
};

const loadLocalStorageTable = (tableName, defaults) => {
  // Static UI Mode - No LocalStorage
  return defaults;
};

export default function AdminDashboard({ onLogout, currentAdminName = "Ahmad Raza", session, onProfileUpdate }) {
  // State for Navigation
  const [activeSubTab, setActiveSubTab] = useState('Dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  // Reply States for student counseling connection
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedMessageForReply, setSelectedMessageForReply] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Profile Edit States
  const [adminProfile, setAdminProfile] = useState({
    full_name: currentAdminName,
    username: currentAdminName.toLowerCase().replace(/\s+/g, ''),
    avatar_url: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
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
  const [jobSearch, setJobSearch] = useState('');
  const [resourceSearch, setResourceSearch] = useState('');
  const [announcementSearch, setAnnouncementSearch] = useState('');
  // CRUD Modals state

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobForm, setJobForm] = useState({
    company: '', title: '', location: '', level: '', job_type: 'Articleship',
    deadline: '', description: '', requirements: '', is_overseas: false
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

  // Mock Fallbacks for testing & development
  const mockProfiles = [
    { id: '1', full_name: 'Saboor Noor', username: 'admin', email: 'admin@saboornoor.com', role: 'team_head', created_at: '2026-01-10' }
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

  const mockMessages = [
    { id: '1', name: 'Ali Raza', email: 'ali@gmail.com', phone: '03001234567', subject: 'Articleship Inquiry', category: 'General Inquiry', message: 'Hello, when is the KPMG induction starting?', created_at: '2026-06-23T10:00:00Z' },
    { id: '2', name: 'Sara Khan', email: 'sara@yahoo.com', phone: '03217654321', subject: 'Career Counseling Appointment', category: 'Career Guidance', message: 'I need to schedule a counseling session with Saboor Ahmad.', created_at: '2026-06-24T15:30:00Z' }
  ];

  const mockRequests = [
    { id: '1', name: 'Bilal Ahmad', resource_title: 'CFAP 1 Advanced Accounting Notes', category: 'CFAP & SCS', notes: 'Need this urgently for June attempt.', created_at: '2026-06-24T12:00:00Z' },
    { id: '2', name: 'Sana Malik', resource_title: 'Big 4 Interview Guide', category: 'Training/Induction', notes: 'Have an interview at PwC next week.', created_at: '2026-06-25T08:00:00Z' }
  ];

  const mockCommunities = [
    { id: '1', title: 'CA Foundation Study Group', category_key: 'prc', badge: 'PRC Group', description: 'WhatsApp channel for entry level CA students.', members_count_text: '1,500+ Members', whatsapp_link: 'https://chat.whatsapp.com/example1' },
    { id: '2', title: 'CAF Intermediate Forum', category_key: 'caf', badge: 'CAF Group', description: 'WhatsApp study room for CA Intermediate students.', members_count_text: '3,200+ Members', whatsapp_link: 'https://chat.whatsapp.com/example2' },
    { id: '3', title: 'Overseas Jobs Network', category_key: 'cfap', badge: 'CFAP Group', description: 'Trainees network discussing international opportunities.', members_count_text: '800+ Members', whatsapp_link: 'https://chat.whatsapp.com/example3' }
  ];

  // Load Data from Supabase
  const loadData = async () => {
    setLoading(true);
    try {
      if (supabase) {
        // Fetch Current Admin Profile asynchronously
        const fetchAdminProfile = async () => {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const { data: currentProf } = await supabase.from('profiles').select('*').eq('id', user.id).single();
              if (currentProf) {
                setAdminProfile({
                  full_name: currentProf.full_name || user.user_metadata?.full_name || 'Admin',
                  username: currentProf.username || user.user_metadata?.username || 'admin',
                  avatar_url: currentProf.avatar_url || user.user_metadata?.avatar_url || ''
                });
              }
            }
          } catch (e) {
            console.error("Error fetching admin profile:", e);
          }
        };

        // Fetch all data lists in parallel to eliminate waterfall network delay
        const [
          ,
          profsRes,
          jobsRes,
          resourcesRes,
          announcementsRes,
          messagesRes,
          requestsRes,
          communitiesRes
        ] = await Promise.all([
          fetchAdminProfile(),
          supabase.from('profiles').select('*').order('created_at', { ascending: false }),
          supabase.from('jobs').select('*').order('created_at', { ascending: false }),
          supabase.from('resources').select('*').order('created_at', { ascending: false }),
          supabase.from('announcements').select('*').order('created_at', { ascending: false }),
          supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
          supabase.from('resource_requests').select('*').order('created_at', { ascending: false }),
          supabase.from('communities').select('*').order('created_at', { ascending: false })
        ]);

        // Profiles
        if (profsRes.error) {
          console.error('Error fetching profiles:', profsRes.error);
          setProfiles(loadLocalStorageTable('profiles', mockProfiles));
        } else {
          setProfiles(profsRes.data && profsRes.data.length > 0 ? profsRes.data : loadLocalStorageTable('profiles', mockProfiles));
        }

        // Jobs
        if (jobsRes.error) {
          console.error('Error fetching jobs:', jobsRes.error);
          setJobs(loadLocalStorageTable('jobs', mockJobs));
        } else {
          setJobs(jobsRes.data && jobsRes.data.length > 0 ? jobsRes.data : loadLocalStorageTable('jobs', mockJobs));
        }

        // Resources
        if (resourcesRes.error) {
          console.error('Error fetching resources:', resourcesRes.error);
          setResources(loadLocalStorageTable('resources', mockResources));
        } else {
          setResources(resourcesRes.data && resourcesRes.data.length > 0 ? resourcesRes.data : loadLocalStorageTable('resources', mockResources));
        }

        // Announcements
        if (announcementsRes.error) {
          console.error('Error fetching announcements:', announcementsRes.error);
          setAnnouncements(loadLocalStorageTable('announcements', mockAnnouncements));
        } else {
          setAnnouncements(announcementsRes.data && announcementsRes.data.length > 0 ? announcementsRes.data : loadLocalStorageTable('announcements', mockAnnouncements));
        }

        // Messages
        if (messagesRes.error) {
          console.error('Error fetching messages:', messagesRes.error);
          setMessages(loadLocalStorageTable('contact_messages', mockMessages));
        } else {
          setMessages(messagesRes.data && messagesRes.data.length > 0 ? messagesRes.data : loadLocalStorageTable('contact_messages', mockMessages));
        }

        // Requests
        if (requestsRes.error) {
          console.error('Error fetching requests:', requestsRes.error);
          setRequests(loadLocalStorageTable('resource_requests', mockRequests));
        } else {
          setRequests(requestsRes.data && requestsRes.data.length > 0 ? requestsRes.data : loadLocalStorageTable('resource_requests', mockRequests));
        }

        // Communities
        if (communitiesRes.error) {
          console.error('Error fetching communities:', communitiesRes.error);
          setCommunities(loadLocalStorageTable('communities', mockCommunities));
        } else {
          setCommunities(communitiesRes.data && communitiesRes.data.length > 0 ? communitiesRes.data : loadLocalStorageTable('communities', mockCommunities));
        }
      } else {
        // Set mock data directly if supabase client is not configured
        setProfiles(loadLocalStorageTable('profiles', mockProfiles));
        setJobs(loadLocalStorageTable('jobs', mockJobs));
        setResources(loadLocalStorageTable('resources', mockResources));
        setAnnouncements(loadLocalStorageTable('announcements', mockAnnouncements));
        setMessages(loadLocalStorageTable('contact_messages', mockMessages));
        setRequests(loadLocalStorageTable('resource_requests', mockRequests));
        setCommunities(loadLocalStorageTable('communities', mockCommunities));
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      // Universal safety fallback in case of query execution hangs
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
          if (supabase) {
            const { error } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', currentTeamHead.id);
            if (error) throw error;
          }
          await updateProfileRole(currentTeamHead.id, 'admin');
        }
      }

      if (supabase) {
        const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
        if (error) throw error;
      }
      await updateProfileRole(userId, newRole);

      setProfiles(prev => {
        let updated = prev.map(p => p.id === userId ? { ...p, role: newRole } : p);
        if (newRole === 'team_head') {
          updated = updated.map(p => p.id !== userId && p.role === 'team_head' ? { ...p, role: 'admin' } : p);
        }
        return updated;
      });
      alert(`User role updated to ${newRole}`);
    } catch (err) {
      alert(`Error updating role: ${err.message}`);
    }
  };

  const handleDeleteProfile = (userId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete User Profile',
      message: 'Are you sure you want to delete this user profile? This action is permanent.',
      onConfirm: async () => {
        try {
          if (supabase) {
            const { error } = await supabase.from('profiles').delete().eq('id', userId);
            if (error) throw error;
          }
          setProfiles(prev => prev.filter(p => p.id !== userId));
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
        ? jobForm.requirements.split(',').map(r => r.trim()).filter(Boolean)
        : [];

      const jobPayload = {
        ...jobForm,
        requirements: requirementsArray
      };

      if (supabase) {
        if (selectedJob) {
          // Edit
          const { error } = await supabase.from('jobs').update(jobPayload).eq('id', selectedJob.id);
          if (error) throw error;
        } else {
          // Add
          const { error } = await supabase.from('jobs').insert([jobPayload]);
          if (error) throw error;
        }
      } else {
        // Mock add/edit
        if (selectedJob) {
          setJobs(prev => prev.map(j => j.id === selectedJob.id ? { ...j, ...jobPayload } : j));
        } else {
          setJobs(prev => [{ id: String(Date.now()), ...jobPayload }, ...prev]);
        }
      }

      alert(selectedJob ? "Job opportunity updated!" : "Job opportunity posted successfully!");
      setIsJobModalOpen(false);
      setSelectedJob(null);
      setJobForm({ company: '', title: '', location: '', level: '', job_type: 'Articleship', deadline: '', description: '', requirements: '', is_overseas: false });
      if (supabase) loadData();
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
          if (supabase) {
            const { error } = await supabase.from('jobs').delete().eq('id', jobId);
            if (error) throw error;
          }
          setJobs(prev => prev.filter(j => j.id !== jobId));
          alert("Job posting deleted.");
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
      if (supabase) {
        if (selectedResource) {
          // Edit
          const { error } = await supabase.from('resources').update(resourceForm).eq('id', selectedResource.id);
          if (error) throw error;
        } else {
          // Add
          const { error } = await supabase.from('resources').insert([resourceForm]);
          if (error) throw error;
        }
      } else {
        // Mock add/edit
        if (selectedResource) {
          setResources(prev => prev.map(r => r.id === selectedResource.id ? { ...r, ...resourceForm } : r));
        } else {
          setResources(prev => [{ id: String(Date.now()), ...resourceForm }, ...prev]);
        }
      }

      alert(selectedResource ? "Resource updated!" : "Resource added successfully!");
      setIsResourceModalOpen(false);
      setSelectedResource(null);
      setResourceForm({
        title: '', description: '', category: 'CAF', type: 'PDF',
        downloads: 0, tag: '', tag_color: 'bg-blue-500/10 text-blue-600',
        btn_color: 'bg-blue-600 hover:bg-blue-700', download_url: '', is_featured: false
      });
      if (supabase) loadData();
    } catch (err) {
      alert(`Error saving resource: ${err.message}`);
    }
  };

  const handleDeleteResource = (resId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Study Resource',
      message: 'Are you sure you want to delete this resource file from the portal?',
      onConfirm: async () => {
        try {
          if (supabase) {
            const { error } = await supabase.from('resources').delete().eq('id', resId);
            if (error) throw error;
          }
          setResources(prev => prev.filter(r => r.id !== resId));
          alert("Resource deleted.");
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
      if (supabase) {
        if (selectedAnnouncement) {
          // Edit
          const { error } = await supabase.from('announcements').update(announcementForm).eq('id', selectedAnnouncement.id);
          if (error) throw error;
        } else {
          // Add
          const { error } = await supabase.from('announcements').insert([announcementForm]);
          if (error) throw error;
        }
      } else {
        // Mock add/edit
        if (selectedAnnouncement) {
          setAnnouncements(prev => prev.map(a => a.id === selectedAnnouncement.id ? { ...a, ...announcementForm } : a));
        } else {
          setAnnouncements(prev => [{ id: String(Date.now()), ...announcementForm }, ...prev]);
        }
      }

      alert(selectedAnnouncement ? "Announcement updated!" : "Announcement published successfully!");
      setIsAnnouncementModalOpen(false);
      setSelectedAnnouncement(null);
      setAnnouncementForm({ title: '', summary: '', content: '', category: 'General', event_date: '' });
      if (supabase) loadData();
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
          if (supabase) {
            const { error } = await supabase.from('announcements').delete().eq('id', annId);
            if (error) throw error;
          }
          setAnnouncements(prev => prev.filter(a => a.id !== annId));
          alert("Announcement deleted.");
        } catch (err) {
          alert(`Error deleting announcement: ${err.message}`);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // CRUD Actions - Communities
  const handleCommunitySubmit = async (e) => {
    e.preventDefault();
    try {
      const commPayload = {
        ...communityForm,
        badge: `${communityForm.category_key.toUpperCase()} Group`
      };

      if (supabase) {
        if (selectedCommunity) {
          // Edit
          const { error } = await supabase.from('communities').update(commPayload).eq('id', selectedCommunity.id);
          if (error) throw error;
        } else {
          // Add
          const { error } = await supabase.from('communities').insert([commPayload]);
          if (error) throw error;
        }
      } else {
        // Mock add/edit
        if (selectedCommunity) {
          setCommunities(prev => prev.map(c => c.id === selectedCommunity.id ? { ...c, ...commPayload } : c));
        } else {
          setCommunities(prev => [{ id: String(Date.now()), ...commPayload }, ...prev]);
        }
      }

      alert(selectedCommunity ? "Community study room updated!" : "Community study room published!");
      setIsCommunityModalOpen(false);
      setSelectedCommunity(null);
      setCommunityForm({ title: '', category_key: 'caf', badge: 'CAF Group', description: '', members_count_text: '1,000+ Members', whatsapp_link: '', discord_link: '' });
      if (supabase) loadData();
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
          if (supabase) {
            const { error } = await supabase.from('communities').delete().eq('id', commId);
            if (error) throw error;
          }
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
          if (supabase) {
            const { error } = await supabase.from('contact_messages').delete().eq('id', msgId);
            if (error) throw error;
          }
          setMessages(prev => prev.filter(m => m.id !== msgId));
          alert("Message deleted.");
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
      const replyData = await replyToMessage(selectedMessageForReply.id, replyText, adminProfile.full_name);
      if (replyData) {
        setMessages(prev => prev.map(m => m.id === selectedMessageForReply.id ? { ...m, ...replyData } : m));
        alert("Reply submitted successfully to student!");
        setReplyText('');
        setSelectedMessageForReply(null);
        setReplyModalOpen(false);
      }
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
      if (supabase && session?.user) {
        const { error } = await supabase.from('profiles').update({
          full_name: adminProfile.full_name,
          username: adminProfile.username,
          avatar_url: adminProfile.avatar_url
        }).eq('id', session.user.id);

        if (error) {
          console.warn('Error updating profiles table:', error);
        }

        const { error: authError } = await supabase.auth.updateUser({
          data: {
            full_name: adminProfile.full_name,
            username: adminProfile.username,
            avatar_url: adminProfile.avatar_url
          }
        });
        if (authError) throw authError;
      }

      setProfiles(prev => prev.map(p => 
        (session?.user && p.id === session.user.id) || p.username === adminProfile.username
          ? { ...p, full_name: adminProfile.full_name, username: adminProfile.username, avatar_url: adminProfile.avatar_url }
          : p
      ));

      if (onProfileUpdate) {
        onProfileUpdate({
          full_name: adminProfile.full_name,
          username: adminProfile.username,
          avatar_url: adminProfile.avatar_url
        });
      }

      alert("Profile updated successfully!");
    } catch (err) {
      alert(`Error saving profile: ${err.message}`);
    } finally {
      setSavingProfile(false);
    }
  };

  // Get notifications count and list
  const getNotificationsList = () => {
    const list = [];
    messages.slice(0, 3).forEach(m => {
      list.push({
        id: `msg-${m.id}`,
        title: 'New Contact Inquiry',
        description: `From ${m.name}: "${m.subject}"`,
        time: 'Inquiry',
        bg: 'bg-emerald-500/10 text-emerald-600'
      });
    });
    requests.slice(0, 3).forEach(r => {
      list.push({
        id: `req-${r.id}`,
        title: 'Study Resource Request',
        description: `${r.name} requested: "${r.resource_title}"`,
        time: 'Request',
        bg: 'bg-blue-500/10 text-blue-600'
      });
    });
    return list;
  };
  const notificationsList = getNotificationsList();

  return (
    <div className="flex bg-[#F8F9FB] min-h-screen text-gray-800 font-sans relative overflow-x-hidden w-full">
      
      {/* 1. LEFT SIDEBAR (Dark - Desktop) */}
      <aside className={`w-72 bg-[#090C11] text-white flex flex-col justify-between h-screen fixed left-0 top-0 z-40 transition-transform duration-300 ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Top Logo / Slogan */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center space-x-3">
            {/* Hexagonal Gold Shield Monogram */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brandGreen to-emerald-400 p-[1.5px] flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(243,193,50,0.15)]">
              <div className="w-full h-full bg-[#090C11] rounded-[10px] flex items-center justify-center">
                <span className="text-brandGreen font-black text-base tracking-tighter">TM</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-sm tracking-tight whitespace-nowrap">The TaxMan's Capital</span>
              <span className="text-brandGreen text-[8px] uppercase tracking-widest font-extrabold mt-0.5">GUIDANCE. OPPORTUNITIES. SUCCESS.</span>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links matching main home links */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-white/10">
          {[
            { id: 'Dashboard', label: 'Dashboard', icon: <Globe className="w-4.5 h-4.5" /> },
            { id: 'Pakistan Jobs', label: 'Pakistan Jobs', icon: <Briefcase className="w-4.5 h-4.5" /> },
            { id: 'Inductions', label: 'Inductions', icon: <Clock className="w-4.5 h-4.5" /> },
            { id: 'Overseas Jobs', label: 'Overseas Jobs', icon: <Globe className="w-4.5 h-4.5" /> },
            { id: 'Career Support', label: 'Career Support', icon: <User className="w-4.5 h-4.5" /> },
            { id: 'Community', label: 'Community', icon: <Users className="w-4.5 h-4.5" /> },
            { id: 'Resources', label: 'Resources', icon: <Sliders className="w-4.5 h-4.5" /> },
            { id: 'Announcements', label: 'Announcements', icon: <Calendar className="w-4.5 h-4.5" /> },
            { id: 'Users List', label: 'Manage Users', icon: <Users className="w-4.5 h-4.5" /> },
            { id: 'Messages', label: 'Contact Messages', icon: <MessageSquare className="w-4.5 h-4.5" />, badge: messages.length },
            { id: 'Profile', label: 'Admin Profile', icon: <User className="w-4.5 h-4.5" /> },
          ].map(item => {
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSubTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                  isActive
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
                  <span className={`w-5 h-5 flex items-center justify-center text-[10px] font-black rounded-full ${
                    isActive ? 'bg-brandGreen text-white' : 'bg-brandGreen text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Cards */}
        <div className="p-4 space-y-4 border-t border-white/5">
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
                <span className="text-[9px] text-brandGreen font-semibold mt-0.5 truncate">CA Final Student / Admin</span>
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
      <main className="flex-grow lg:pl-72 min-h-screen flex flex-col overflow-y-auto w-full">
        
        {/* Header Bar */}
        <header className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-20 shadow-sm">
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
            <a
              href="#"
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center space-x-1 mr-2"
            >
              <span>Back to Portal Home</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsDropdownOpen(!notificationsDropdownOpen)}
                className="relative p-2 text-gray-500 hover:text-navy transition-colors rounded-full hover:bg-gray-50 cursor-pointer focus:outline-none"
              >
                <Bell className="w-5 h-5" />
                {notificationsList.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    {notificationsList.length}
                  </span>
                )}
              </button>

              {notificationsDropdownOpen && (
                <>
                  {/* Backdrop click to close */}
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsDropdownOpen(false)} />
                  
                  {/* Dropdown Box */}
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl py-3 z-50 animate-fadeIn text-xs">
                    <div className="px-4 pb-2 border-b border-gray-50 flex items-center justify-between">
                      <span className="font-extrabold text-gray-800">Notifications ({notificationsList.length})</span>
                      <button 
                        onClick={() => {
                          setNotificationsDropdownOpen(false);
                          setActiveSubTab('Messages');
                        }}
                        className="text-[10px] text-brandGreen hover:underline font-bold"
                      >
                        View Messages
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                      {notificationsList.map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => {
                            setNotificationsDropdownOpen(false);
                            if (n.id.startsWith('msg')) {
                              setActiveSubTab('Messages');
                            } else {
                              setActiveSubTab('Dashboard');
                            }
                          }}
                          className="px-4 py-3 hover:bg-[#F8F9FB] transition-colors cursor-pointer text-left"
                        >
                          <div className="flex items-center space-x-1.5 mb-1">
                            <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-bold uppercase ${n.bg}`}>
                              {n.time}
                            </span>
                            <span className="font-bold text-gray-800">{n.title}</span>
                          </div>
                          <p className="text-[10px] text-gray-400 font-semibold line-clamp-2">{n.description}</p>
                        </div>
                      ))}
                      {notificationsList.length === 0 && (
                        <div className="px-4 py-6 text-center text-gray-400 italic">
                          No new notifications.
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
        <div className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto space-y-8">
          
          {loading && (
            <div className="flex items-center justify-center py-10">
              <div className="w-8 h-8 border-4 border-brandGreen border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* VIEW: OVERVIEW / DASHBOARD */}
          {activeSubTab === 'Dashboard' && !loading && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Hero Header Dashboard Banner */}
              <div className="relative overflow-hidden bg-gradient-to-r from-navy via-[#052347] to-[#011126] text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
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
                  { title: 'Total Registered Users', value: profiles.length, sub: `${profiles.filter(p => p.role === 'admin').length} Admins • ${profiles.filter(p => p.role !== 'admin').length} Students`, icon: <Users className="w-5.5 h-5.5 text-blue-500" />, bg: 'bg-blue-500/10', hoverBg: 'hover:border-blue-500/30 hover:shadow-blue-500/5', border: 'border-blue-500/5' },
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[
                    { label: 'Post Pakistan Job', onClick: () => { setSelectedJob(null); setJobForm({ company: '', title: '', location: '', level: '', job_type: 'Full-time', deadline: '', description: '', requirements: '', is_overseas: false }); setIsJobModalOpen(true); }, color: 'bg-brandGreen/5 hover:bg-brandGreen text-brandGreen hover:text-white border border-brandGreen/10', desc: 'Create full/part-time local vacancies' },
                    { label: 'Post Trainee Induction', onClick: () => { setSelectedJob(null); setJobForm({ company: '', title: 'Audit Associate (Trainee)', location: 'Lahore', level: 'CA CAF Qualified', job_type: 'Articleship', deadline: '', description: '', requirements: '', is_overseas: false }); setIsJobModalOpen(true); }, color: 'bg-emerald-500/5 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-500/10', desc: 'Add new CA/ACCA articleships' },
                    { label: 'Add Study Resource', onClick: () => { setSelectedResource(null); setResourceForm({ title: '', description: '', category: 'CAF', type: 'PDF', downloads: 0, tag: '', tag_color: 'bg-blue-500/10 text-blue-600', btn_color: 'bg-blue-600 hover:bg-blue-700', download_url: '', is_featured: false }); setIsResourceModalOpen(true); }, color: 'bg-blue-500/5 hover:bg-blue-500 text-blue-500 hover:text-white border border-blue-500/10', desc: 'Upload preparation PDFs & packs' },
                    { label: 'Publish Announcement', onClick: () => { setSelectedAnnouncement(null); setAnnouncementForm({ title: '', summary: '', content: '', category: 'General', event_date: '' }); setIsAnnouncementModalOpen(true); }, color: 'bg-purple-500/5 hover:bg-purple-500 text-purple-500 hover:text-white border border-purple-500/10', desc: 'Broadcast news & alerts to feed' },
                    { label: 'Create Community Room', onClick: () => { setSelectedCommunity(null); setCommunityForm({ title: '', category_key: 'caf', badge: 'CAF Group', description: '', members_count_text: '1,000+ Members', whatsapp_link: '', discord_link: '' }); setIsCommunityModalOpen(true); }, color: 'bg-indigo-500/5 hover:bg-indigo-500 text-indigo-500 hover:text-white border border-indigo-500/10', desc: 'Set up WhatsApp study groups' },
                  ].map((act, idx) => (
                    <button
                      key={idx}
                      onClick={act.onClick}
                      className={`flex flex-col items-start p-4.5 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${act.color} cursor-pointer group` }
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

                {/* Card 7: User Profiles */}
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
                          <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                            p.role === 'admin' ? 'bg-brandGreen/10 text-brandGreen-dark' : 'bg-emerald-500/10 text-emerald-600'
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-[#090C11]">Manage Pakistan Jobs</h1>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">Publish and update domestic professional job opportunities.</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedJob(null);
                    setJobForm({ company: '', title: '', location: '', level: '', job_type: 'Full-time', deadline: '', description: '', requirements: '', is_overseas: false });
                    setIsJobModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-black text-xs rounded-xl flex items-center space-x-1.5 shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post Pakistan Job</span>
                </button>
              </div>

              {/* Search */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search domestic jobs..."
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl text-xs focus:outline-none focus:border-brandGreen transition-colors"
                  />
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs
                  .filter(j => !j.is_overseas && j.job_type !== 'Articleship')
                  .filter(j => j.company?.toLowerCase().includes(jobSearch.toLowerCase()) || j.title?.toLowerCase().includes(jobSearch.toLowerCase()))
                  .map(job => (
                    <div key={job.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 bg-brandGreen/10 text-[9px] font-black text-brandGreen-dark rounded-full uppercase">
                            {job.job_type}
                          </span>
                          <span className="text-[11px] font-bold text-red-500 flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1" /> {job.deadline}
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
                          className="p-2 text-gray-500 hover:text-brandGreen bg-gray-50 hover:bg-brandGreen/5 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-2 text-red-500 hover:text-red-700 bg-red-500/5 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* VIEW: INDUCTIONS */}
          {activeSubTab === 'Inductions' && !loading && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-[#090C11]">Manage Trainee Inductions</h1>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">Publish Trainee / Articleship positions for CA & ACCA students.</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedJob(null);
                    setJobForm({ company: '', title: 'Audit Associate (Trainee)', location: 'Lahore', level: 'CA CAF Qualified', job_type: 'Articleship', deadline: '', description: '', requirements: '', is_overseas: false });
                    setIsJobModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-black text-xs rounded-xl flex items-center space-x-1.5 shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post Trainee Induction</span>
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs
                  .filter(j => j.job_type === 'Articleship')
                  .map(job => (
                    <div key={job.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 bg-brandGreen/10 text-[9px] font-black text-brandGreen-dark rounded-full uppercase">
                            Induction
                          </span>
                          <span className="text-[11px] font-bold text-red-500 flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1" /> {job.deadline}
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
                          className="p-2 text-gray-500 hover:text-brandGreen bg-gray-50 hover:bg-brandGreen/5 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-2 text-red-500 hover:text-red-700 bg-red-500/5 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* VIEW: OVERSEAS JOBS */}
          {activeSubTab === 'Overseas Jobs' && !loading && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-[#090C11]">Manage Overseas Placements</h1>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">Publish job vacancies located outside Pakistan (e.g. Middle East, UK).</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedJob(null);
                    setJobForm({ company: '', title: '', location: 'Riyadh, Saudi Arabia', level: 'ACCA Member', job_type: 'Full-time', deadline: '', description: '', requirements: '', is_overseas: true });
                    setIsJobModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-black text-xs rounded-xl flex items-center space-x-1.5 shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post Overseas Placement</span>
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs
                  .filter(j => j.is_overseas)
                  .map(job => (
                    <div key={job.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 bg-emerald-500/10 text-[9px] font-black text-brandGreen rounded-full uppercase">
                            Overseas Placements
                          </span>
                          <span className="text-[11px] font-bold text-red-500 flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1" /> {job.deadline}
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
                          className="p-2 text-gray-500 hover:text-brandGreen bg-gray-50 hover:bg-brandGreen/5 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-2 text-red-500 hover:text-red-700 bg-red-500/5 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* VIEW: CAREER SUPPORT */}
          {activeSubTab === 'Career Support' && !loading && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-2xl font-black text-[#090C11]">Career Support & Counseling</h1>
                <p className="text-xs text-gray-400 mt-1 font-semibold">Review submissions requesting student counseling and professional guidance.</p>
              </div>

              <div className="space-y-4">
                {messages
                  .filter(msg => msg.category === 'Career Guidance' || msg.subject?.toLowerCase().includes('counsel') || msg.subject?.toLowerCase().includes('career'))
                  .map(msg => (
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
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Clear Record</span>
                        </button>
                      </div>
                    </div>
                  ))}

                {messages.filter(msg => msg.category === 'Career Guidance' || msg.subject?.toLowerCase().includes('counsel') || msg.subject?.toLowerCase().includes('career')).length === 0 && (
                  <p className="text-xs text-gray-400 italic text-center py-10">No pending career counseling requests.</p>
                )}
              </div>
            </div>
          )}

          {/* VIEW: COMMUNITY ROOMS */}
          {activeSubTab === 'Community' && !loading && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-[#090C11]">Manage Community Rooms</h1>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">Configure WhatsApp study groups and discord links for students.</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCommunity(null);
                    setCommunityForm({ title: '', category_key: 'caf', badge: 'CAF Group', description: '', members_count_text: '1,000+ Members', whatsapp_link: '', discord_link: '' });
                    setIsCommunityModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-black text-xs rounded-xl flex items-center space-x-1.5 shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Room</span>
                </button>
              </div>

              {/* Grid of WhatsApp Rooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communities.map(comm => (
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
                        className="p-2 text-gray-500 hover:text-brandGreen bg-gray-50 hover:bg-brandGreen/5 rounded-lg transition-colors"
                        title="Edit Community"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCommunity(comm.id)}
                        className="p-2 text-red-500 hover:text-red-700 bg-red-500/5 rounded-lg transition-colors"
                        title="Delete Community"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: RESOURCES / MANAGING RESOURCES */}
          {activeSubTab === 'Resources' && !loading && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-[#090C11]">Manage Study Materials</h1>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">Upload PDF, ZIP study resource links for students.</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedResource(null);
                    setResourceForm({ title: '', description: '', category: 'CAF', type: 'PDF', downloads: 0, tag: '', tag_color: 'bg-blue-500/10 text-blue-600', btn_color: 'bg-blue-600 hover:bg-blue-700', download_url: '', is_featured: false });
                    setIsResourceModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-black text-xs rounded-xl flex items-center space-x-1.5 shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Resource</span>
                </button>
              </div>

              {/* Search */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search resources by title..."
                    value={resourceSearch}
                    onChange={(e) => setResourceSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl text-xs focus:outline-none focus:border-brandGreen transition-colors"
                  />
                </div>
              </div>

              {/* Resources Table */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8F9FB] text-gray-400 font-bold text-xs uppercase border-b border-gray-100">
                        <th className="p-4 pl-6">Title</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Downloads</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-600">
                      {resources
                        .filter(r => r.title?.toLowerCase().includes(resourceSearch.toLowerCase()))
                        .map(res => (
                          <tr key={res.id} className="hover:bg-[#F8F9FB]/50 transition-colors">
                            <td className="p-4 pl-6 font-black text-[#090C11]">{res.title}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 bg-blue-500/5 text-blue-600 rounded">
                                {res.category}
                              </span>
                            </td>
                            <td className="p-4 font-normal text-gray-400">{res.type}</td>
                            <td className="p-4 font-normal text-gray-400">{res.downloads}</td>
                            <td className="p-4 pr-6 text-right space-x-2">
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
                                className="text-brandGreen hover:text-brandGreen-dark px-2 py-1 rounded bg-brandGreen/5"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteResource(res.id)}
                                className="text-red-500 hover:text-red-700 p-1 hover:bg-red-500/5 rounded"
                              >
                                <Trash2 className="w-4 h-4 inline" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: ANNOUNCEMENTS */}
          {activeSubTab === 'Announcements' && !loading && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-[#090C11]">Manage Announcements</h1>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">Publish events and alert notices on the dashboard feed.</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedAnnouncement(null);
                    setAnnouncementForm({ title: '', summary: '', content: '', category: 'General', event_date: '' });
                    setIsAnnouncementModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-black text-xs rounded-xl flex items-center space-x-1.5 shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Event</span>
                </button>
              </div>

              {/* Search */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search announcements by title..."
                    value={announcementSearch}
                    onChange={(e) => setAnnouncementSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl text-xs focus:outline-none focus:border-brandGreen transition-colors"
                  />
                </div>
              </div>

              {/* Announcements Table */}
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
                      {announcements
                        .filter(a => a.title?.toLowerCase().includes(announcementSearch.toLowerCase()))
                        .map(ann => (
                          <tr key={ann.id} className="hover:bg-[#F8F9FB]/50 transition-colors">
                            <td className="p-4 pl-6 font-black text-[#090C11]">{ann.title}</td>
                            <td className="p-4 font-normal text-gray-500 max-w-sm truncate">{ann.summary}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 bg-purple-500/5 border border-purple-500/10 text-purple-600 rounded">
                                {ann.category}
                              </span>
                            </td>
                            <td className="p-4 font-normal text-gray-400">{ann.event_date || 'N/A'}</td>
                            <td className="p-4 pr-6 text-right space-x-2">
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
                                className="text-brandGreen hover:text-brandGreen-dark px-2 py-1 rounded bg-brandGreen/5"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteAnnouncement(ann.id)}
                                className="text-red-500 hover:text-red-700 p-1 hover:bg-red-500/5 rounded"
                              >
                                <Trash2 className="w-4 h-4 inline" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: USERS LIST */}
          {activeSubTab === 'Users List' && !loading && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-2xl font-black text-[#090C11]">Manage User Profiles</h1>
                <p className="text-xs text-gray-400 mt-1 font-semibold">Configure account privileges and toggle admin authorization.</p>
              </div>

              {/* Search */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-center">
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
                
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="px-3 py-2.5 border border-gray-100 bg-[#F8F9FB] rounded-xl text-xs focus:outline-none focus:border-brandGreen text-gray-500 font-bold"
                  >
                    <option value="All">All Roles</option>
                    <option value="admin">Administrator</option>
                    <option value="user">Student / User</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8F9FB] text-gray-400 font-bold text-xs uppercase border-b border-gray-100">
                        <th className="p-4 pl-6">Profile</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Joined Date</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-600">
                      {profiles
                        .filter(p => {
                          const searchStr = userSearch.toLowerCase();
                          const matchesSearch =
                            (p.full_name || '').toLowerCase().includes(searchStr) ||
                            (p.username || '').toLowerCase().includes(searchStr) ||
                            (p.email || '').toLowerCase().includes(searchStr);
                          const matchesRole = userRoleFilter === 'All' || p.role === userRoleFilter;
                          return matchesSearch && matchesRole;
                        })
                        .map(p => (
                          <tr key={p.id} className="hover:bg-[#F8F9FB]/50 transition-colors">
                            <td className="p-4 pl-6 flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-brandGreen/10 text-brandGreen-dark font-bold flex items-center justify-center overflow-hidden">
                                {p.avatar_url ? (
                                  <img src={p.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                  p.full_name?.charAt(0).toUpperCase()
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[#090C11] font-black">{p.full_name}</span>
                                <span className="text-[10px] text-gray-400">@{p.username}</span>
                              </div>
                            </td>
                            <td className="p-4 font-normal text-gray-500">{p.email}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                p.role === 'team_head' ? 'bg-amber-500/15 text-amber-600 border border-amber-200' :
                                p.role === 'admin' ? 'bg-brandGreen/10 text-brandGreen-dark' : 'bg-emerald-500/10 text-emerald-600'
                              }`}>
                                {p.role === 'team_head' ? 'Team Head' : p.role}
                              </span>
                            </td>
                            <td className="p-4 font-normal text-gray-400">{p.created_at ? p.created_at.split('T')[0] : 'N/A'}</td>
                            <td className="p-4 pr-6 text-right space-x-2">
                              {p.role === 'team_head' ? (
                                <span className="text-amber-600 text-xs font-bold mr-2">👑 Team Head</span>
                              ) : (
                                <>
                                  {p.role === 'admin' ? (
                                    <>
                                      <button
                                        onClick={() => handleUpdateUserRole(p.id, 'user')}
                                        className="text-emerald-600 hover:text-emerald-700 bg-emerald-500/5 hover:bg-emerald-500/10 px-2.5 py-1 rounded"
                                      >
                                        Make User
                                      </button>
                                      <button
                                        onClick={() => handleUpdateUserRole(p.id, 'team_head')}
                                        className="text-amber-600 hover:text-amber-700 bg-amber-500/5 hover:bg-amber-500/10 px-2.5 py-1 rounded font-bold"
                                      >
                                        Make Head
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => handleUpdateUserRole(p.id, 'admin')}
                                      className="text-brandGreen hover:text-brandGreen-dark bg-brandGreen/5 hover:bg-brandGreen/10 px-2.5 py-1 rounded"
                                    >
                                      Make Admin
                                    </button>
                                  )}
                                </>
                              )}
                              <button
                                onClick={() => handleDeleteProfile(p.id)}
                                className="text-red-500 hover:text-red-700 p-1 hover:bg-red-500/5 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: MESSAGES (Contact Inbox) */}
          {activeSubTab === 'Messages' && !loading && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-2xl font-black text-[#090C11]">Contact Inquiries</h1>
                <p className="text-xs text-gray-400 mt-1 font-semibold">Read emails and feedback submitted by site visitors.</p>
              </div>

              <div className="space-y-4">
                {messages.map(msg => (
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

                    <div className="flex justify-end pt-2 space-x-2">
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

                {messages.length === 0 && (
                  <p className="text-xs text-gray-400 italic text-center py-10">No incoming messages.</p>
                )}
              </div>
            </div>
          )}

          {/* VIEW: PROFILE */}
          {activeSubTab === 'Profile' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm max-w-xl animate-fadeIn">
              <h2 className="text-lg font-black text-[#090C11] mb-6 font-sans">Edit Admin Profile</h2>
              
              <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
                {/* Profile Image Upload Component */}
                <div className="flex items-center space-x-5 border-b border-gray-50 pb-6">
                  <div className="relative group w-20 h-20 rounded-full bg-gradient-to-tr from-brandGreen to-emerald-400 text-white font-black flex items-center justify-center border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
                    {adminProfile.avatar_url ? (
                      <img src={adminProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">{adminProfile.full_name.charAt(0).toUpperCase()}</span>
                    )}
                    
                    {/* Hover edit overlay */}
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
                    {adminProfile.avatar_url && (
                      <button 
                        type="button"
                        onClick={() => setAdminProfile(prev => ({ ...prev, avatar_url: '' }))}
                        className="text-red-500 hover:text-red-600 font-bold mt-2 text-left self-start"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
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

                  <div className="grid grid-cols-2 gap-4">
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
      {isJobModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-[#090C11]">
                {selectedJob ? 'Edit Placement Details' : 'Publish Placement Opportunity'}
              </h3>
              <button onClick={() => setIsJobModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleJobSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3.5">
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

              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-gray-500">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lahore / Online"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-gray-500">Required Level</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CA CAF / ACCA Part-Qualified"
                    value={jobForm.level}
                    onChange={(e) => setJobForm({ ...jobForm, level: e.target.value })}
                    className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-gray-500">Placement Type</label>
                  <select
                    value={jobForm.job_type}
                    onChange={(e) => setJobForm({ ...jobForm, job_type: e.target.value })}
                    className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
                  >
                    <option value="Articleship">Articleship / Induction</option>
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time Job</option>
                    <option value="Part-time">Part-time Job</option>
                  </select>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-gray-500">Deadline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 31 May 2026"
                    value={jobForm.deadline}
                    onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                    className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 py-1">
                <input
                  type="checkbox"
                  id="is_overseas"
                  checked={jobForm.is_overseas}
                  onChange={(e) => setJobForm({ ...jobForm, is_overseas: e.target.checked })}
                  className="rounded text-brandGreen focus:ring-brandGreen"
                />
                <label htmlFor="is_overseas" className="font-bold text-gray-500 select-none">This is an international/overseas listing</label>
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
          </div>
        </div>
      )}

      {/* MODAL: RESOURCES CRUD */}
      {isResourceModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-[#090C11]">
                {selectedResource ? 'Edit Resource' : 'Add New Study Resource'}
              </h3>
              <button onClick={() => setIsResourceModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleResourceSubmit} className="space-y-3.5 text-xs">
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

              <div className="grid grid-cols-2 gap-3.5">
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
                    <option value="CFAP & SCS">CFAP & SCS</option>
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

              <div className="grid grid-cols-2 gap-3.5">
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
                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-gray-500">Download Link URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/file.pdf"
                    value={resourceForm.download_url}
                    onChange={(e) => setResourceForm({ ...resourceForm, download_url: e.target.value })}
                    className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
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
          </div>
        </div>
      )}

      {/* MODAL: ANNOUNCEMENTS CRUD */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-[#090C11]">
                {selectedAnnouncement ? 'Edit Announcement/Event' : 'Publish Announcement/Event'}
              </h3>
              <button onClick={() => setIsAnnouncementModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAnnouncementSubmit} className="space-y-3.5 text-xs">
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

              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-gray-500">Category</label>
                  <select
                    value={announcementForm.category}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, category: e.target.value })}
                    className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
                  >
                    <option value="General">General</option>
                    <option value="Alert">Alert</option>
                    <option value="Event">Event</option>
                    <option value="News">News</option>
                  </select>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-gray-500">Event Date Badge (e.g. "20 MAY")</label>
                  <input
                    type="text"
                    placeholder="e.g. 20 MAY"
                    value={announcementForm.event_date}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, event_date: e.target.value })}
                    className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
                  />
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
          </div>
        </div>
      )}

      {/* MODAL: COMMUNITY CRUD */}
      {isCommunityModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-[#090C11]">
                {selectedCommunity ? 'Edit Study Group' : 'Add Study Group Room'}
              </h3>
              <button onClick={() => setIsCommunityModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCommunitySubmit} className="space-y-3.5 text-xs">
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

              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-gray-500">Category Key</label>
                  <select
                    value={communityForm.category_key}
                    onChange={(e) => setCommunityForm({ ...communityForm, category_key: e.target.value })}
                    className="p-2.5 border border-gray-100 bg-[#F8F9FB] rounded-lg focus:outline-none focus:border-brandGreen"
                  >
                    <option value="prc">PRC (Entry Level)</option>
                    <option value="caf">CAF (Intermediate)</option>
                    <option value="cfap">CFAP & SCS</option>
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

              <div className="grid grid-cols-2 gap-3.5">
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
                className="w-full py-3 bg-brandGreen hover:bg-brandGreen-dark text-white font-black rounded-xl shadow-md transition-all active:scale-95 mt-2 text-center"
              >
                {selectedCommunity ? 'Save Changes' : 'Publish Study Group'}
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
      {replyModalOpen && selectedMessageForReply && (
        <div className="fixed inset-0 bg-black/60 z-[99] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative text-left">
            <button
              onClick={() => {
                setSelectedMessageForReply(null);
                setReplyModalOpen(false);
              }}
              className="absolute right-4 top-4 p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
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
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-xs font-semibold text-gray-500 leading-relaxed max-h-40 overflow-y-auto">
              <strong>Question details:</strong>
              <p className="mt-1 font-normal whitespace-pre-wrap">{selectedMessageForReply.message}</p>
            </div>

            {/* Draft Reply Form */}
            <form onSubmit={handleSubmitReply} className="space-y-4">
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
          </div>
        </div>
      )}

    </div>
  );
}
