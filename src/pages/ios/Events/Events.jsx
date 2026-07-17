import { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  CheckCircle2,
  X,
  ChevronRight,
  Sparkles,
  FileText,
  Play
} from 'lucide-react';
import mentorsDiscussing from '../../../assets/mentors_discussing.png';

export default function Events() {
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [activeQualFilter, setActiveQualFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Registration modal states
  const [selectedEventForModal, setSelectedEventForModal] = useState(null);
  const [isRegisteredSuccess, setIsRegisteredSuccess] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    phone: '',
    level: 'CAF Student',
    questions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);

  // Mock Events Data
  const [events] = useState([
    {
      id: 'evt-1',
      title: 'Big 4 Articleship CV & Interview Boot Camp',
      desc: 'Learn ATS-friendly CV design and crack technical & HR interviews for EY, PwC, KPMG, and Deloitte Pakistan.',
      date: 'July 25, 2026',
      time: '04:00 PM - 06:30 PM (PKT)',
      speaker: {
        name: 'Saboor Ahmad',
        title: 'Founder & Lead Mentor',
        organization: "The TaxMan's Capital",
        role: 'Ex-Big 4 Senior Consultant'
      },
      category: 'Workshop',
      qualification: 'CA',
      status: 'Upcoming',
      duration: '2.5 Hours',
      platform: 'Zoom Interactive',
      attendees: 420
    },
    {
      id: 'evt-2',
      title: 'ACCA Performance Management (PM) Masterclass',
      desc: 'Deep-dive revision on high-weightage syllabus topics, time planning strategies, and past paper walkthroughs.',
      date: 'July 28, 2026',
      time: '06:00 PM - 08:00 PM (PKT)',
      speaker: {
        name: 'M. Bilal',
        title: 'ACCA Member & Community Manager',
        organization: 'Corporate Finance Specialist',
        role: 'Audit Supervisor'
      },
      category: 'Exam Revision',
      qualification: 'ACCA',
      status: 'Upcoming',
      duration: '2 Hours',
      platform: 'Microsoft Teams',
      attendees: 185
    },
    {
      id: 'evt-3',
      title: 'Venture Capital & Corporate Advisory Careers in PK',
      desc: 'Unlocking opportunities beyond traditional audit. A guide to entering advisory, valuation, and VC roles in Pakistan.',
      date: 'August 03, 2026',
      time: '05:00 PM - 06:30 PM (PKT)',
      speaker: {
        name: 'Ahmad Raza',
        title: 'Investment Associate',
        organization: 'Lakson Venture Capital',
        role: 'ACA / CA Member'
      },
      category: 'Webinar',
      qualification: 'CA',
      status: 'Upcoming',
      duration: '1.5 Hours',
      platform: 'Zoom Webinar',
      attendees: 310
    },
    {
      id: 'evt-4',
      title: 'CAF-5 Audit & Assurance Master Revision Session',
      desc: 'Recorded: Full coverage of internal controls, audit reports, and critical ISA frameworks for ICAP Autumn 2026.',
      date: 'June 18, 2026',
      time: 'Completed',
      speaker: {
        name: 'Iram Fatima',
        title: 'Counseling Head & CA Finalist',
        organization: "The TaxMan's Capital",
        role: 'Syllabus Revision Specialist'
      },
      category: 'Exam Revision',
      qualification: 'CA',
      status: 'Past',
      duration: '3.5 Hours',
      platform: 'YouTube Recording',
      attendees: 1240,
      recordingUrl: 'https://youtube.com',
      slidesUrl: '#'
    },
    {
      id: 'evt-5',
      title: 'ACCA Financial Reporting (FR) Quick revision',
      desc: 'Recorded: Group consolidation rules, single-entity financial statement adjustments, and mock exam walkthrough.',
      date: 'May 28, 2026',
      time: 'Completed',
      speaker: {
        name: 'Usman Ali',
        title: 'ACCA Affiliate & Tech Lead',
        organization: 'Top Finance Academy',
        role: 'Lecturer in Financial Reporting'
      },
      category: 'Exam Revision',
      qualification: 'ACCA',
      status: 'Past',
      duration: '3 Hours',
      platform: 'Vimeo Archive',
      attendees: 890,
      recordingUrl: 'https://vimeo.com',
      slidesUrl: '#'
    },
    {
      id: 'evt-6',
      title: 'CA PRC-5 Introduction to Accounting Basics',
      desc: 'Recorded: Double-entry concepts, ledger creation, and bank reconciliation statements for freshers.',
      date: 'May 12, 2026',
      time: 'Completed',
      speaker: {
        name: 'Ayesha Khan',
        title: 'Resource Curator',
        organization: 'CA Intermediate Mentor',
        role: 'Double-entry Coach'
      },
      category: 'Workshop',
      qualification: 'CA',
      status: 'Past',
      duration: '2 Hours',
      platform: 'YouTube Archive',
      attendees: 512,
      recordingUrl: 'https://youtube.com',
      slidesUrl: '#'
    }
  ]);

  const pastSpeakers = [
    {
      name: 'Saboor Ahmad',
      role: 'Founder, The TaxMan\'s Capital',
      desc: 'Ex-Big 4 Senior Advisory Consultant with over 5 years of mentoring CA & ACCA students across Pakistan.',
      tag: 'CA ACA'
    },
    {
      name: 'Iram Fatima',
      role: 'Counseling Head, CA Finalist',
      desc: 'Passionate career coach specialized in ICAP CAF syllabus guidance, exam mapping, and mental health counseling.',
      tag: 'CA Finalist'
    },
    {
      name: 'M. Bilal',
      role: 'ACCA Member & Mentor',
      desc: 'Corporate accounting expert advising ACCA affiliates on MNC placement interviews, articles, and CPD training.',
      tag: 'ACCA Member'
    },
    {
      name: 'Ahmad Raza',
      role: 'Advisory Associate, Lakson VC',
      desc: 'Qualified Chartered Accountant specializing in startup valuation, fundraising rounds, and corporate law advisory.',
      tag: 'CA Member'
    }
  ];

  // Filtering Logic
  const filteredEvents = events.filter(evt => {
    const matchesStatus = activeStatusFilter === 'All' || evt.status === activeStatusFilter;
    const matchesQual = activeQualFilter === 'All' || evt.qualification === activeQualFilter;
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.speaker.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQual && matchesSearch;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenRegistration = (evt) => {
    setSelectedEventForModal(evt);
    setIsRegisteredSuccess(false);
    setRegistrationForm({
      name: '',
      email: '',
      phone: '',
      level: evt.qualification === 'CA' ? 'CAF Student' : 'ACCA Student',
      questions: ''
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registrationForm.name || !registrationForm.email || !registrationForm.phone) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API registration delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setIsSubmitting(false);
    setRegisteredEventIds(prev => [...prev, selectedEventForModal.id]);
    setIsRegisteredSuccess(true);
  };

  return (
    <div className="min-h-screen bg-navy-dark text-white flex flex-col font-sans selection:bg-brandGreen selection:text-white">
      
      {/* ── 1. Hero Section ── */}
      <section className="relative pt-16 pb-24 border-b border-brandGreen/10 bg-[radial-gradient(ellipse_at_top_right,rgba(0,200,83,0.08),transparent_50%)] text-left">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute top-24 right-[-10%] w-[500px] h-[500px] bg-brandGreen/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column (Text) */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-5">
              <span className="inline-flex items-center space-x-2 bg-brandGreen/10 border border-brandGreen/30 text-brandGreen text-xs font-extrabold tracking-[0.2em] px-3.5 py-1.5 rounded-full uppercase shadow-[0_0_15px_rgba(0,200,83,0.1)]">
                <Sparkles className="w-3.5 h-3.5 text-brandGreen animate-pulse" />
                <span>EVENTS & WEBINARS</span>
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Learn from Industry Experts,<br />
                <span className="bg-gradient-to-r from-brandGreen to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(0,200,83,0.15)]">Accelerate Your Career</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-400 leading-relaxed font-light">
                Join our interactive live workshops, masterclasses, and career panels. Get real advice on CA/ACCA studies, exams, CV prep, and articleship selection from mentors who have been there.
              </p>
            </div>
            
            {/* Right Column (Image) */}
            <div className="lg:col-span-5 flex justify-center relative pt-8 lg:pt-0">
              <div className="relative group max-w-[440px] w-full">
                <div className="absolute -inset-2 bg-brandGreen rounded-3xl blur-xl opacity-20 group-hover:opacity-35 transition duration-500 pointer-events-none" />
                <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/3] bg-navy">
                  <img
                    src={mentorsDiscussing}
                    alt="Mentors discussing in event webinar"
                    className="w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. Filters & Events Grid Section ── */}
      <section className="py-16 bg-navy bg-opacity-30 relative z-10 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Controls Panel */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 bg-white/[0.02] border border-white/5 p-4 rounded-3xl backdrop-blur-md">
            
            {/* Status Filter Tab Row */}
            <div className="flex space-x-2">
              {['All', 'Upcoming', 'Past'].map(status => (
                <button
                  key={status}
                  onClick={() => setActiveStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
                    activeStatusFilter === status
                      ? 'bg-brandGreen text-white shadow-lg shadow-emerald-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {status} Events
                </button>
              ))}
            </div>

            {/* Right Group: Qualification Filter & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              
              {/* Qual Filter */}
              <div className="flex bg-[#011126] border border-white/10 rounded-xl p-1 shrink-0">
                {['All', 'CA', 'ACCA'].map(qual => (
                  <button
                    key={qual}
                    onClick={() => setActiveQualFilter(qual)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeQualFilter === qual
                        ? 'bg-emerald-500/20 text-brandGreen border border-brandGreen/20'
                        : 'text-gray-400 hover:text-white border border-transparent'
                    }`}
                  >
                    {qual}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search events, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-60 pl-10 pr-4 py-2 bg-[#011126] border border-white/10 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brandGreen/50 placeholder-gray-500 text-white font-medium transition-all"
                />
              </div>

            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-300">No Events Found</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto font-medium">
                We couldn't find any events matching your selected filter criteria. Try adjusting your settings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(evt => {
                const isRegistered = registeredEventIds.includes(evt.id);
                const isUpcoming = evt.status === 'Upcoming';
                
                return (
                  <div
                    key={evt.id}
                    className="group bg-gradient-to-b from-[#011630] to-[#010e20] border border-white/5 hover:border-brandGreen/25 rounded-3xl p-6 flex flex-col justify-between hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Visual Card Accent Overlay */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brandGreen/3 rounded-full blur-2xl group-hover:bg-brandGreen/8 transition-colors duration-500 pointer-events-none" />

                    <div>
                      {/* Card Header (Category & Badges) */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          evt.category === 'Workshop' 
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                            : evt.category === 'Exam Revision'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {evt.category}
                        </span>
                        
                        <div className="flex items-center space-x-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isUpcoming ? 'bg-brandGreen animate-pulse' : 'bg-gray-500'}`} />
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            {evt.status}
                          </span>
                        </div>
                      </div>

                      {/* Event Title */}
                      <h3 className="text-lg font-extrabold text-white group-hover:text-brandGreen text-left line-clamp-2 leading-snug transition-colors mb-3">
                        {evt.title}
                      </h3>

                      {/* Event Description */}
                      <p className="text-xs text-gray-400 text-left line-clamp-3 mb-5 leading-relaxed font-medium">
                        {evt.desc}
                      </p>

                      {/* Event Metadata List */}
                      <div className="space-y-2.5 mb-6 text-xs text-gray-300 font-semibold border-t border-white/5 pt-4">
                        <div className="flex items-center space-x-2.5">
                          <Calendar className="w-4 h-4 text-brandGreen shrink-0" />
                          <span>{evt.date}</span>
                        </div>
                        <div className="flex items-center space-x-2.5">
                          <Clock className="w-4 h-4 text-brandGreen shrink-0" />
                          <span>{evt.time}</span>
                        </div>
                        <div className="flex items-center space-x-2.5">
                          <MapPin className="w-4 h-4 text-brandGreen shrink-0" />
                          <span>{evt.platform}</span>
                        </div>
                        <div className="flex items-center space-x-2.5">
                          <Users className="w-4 h-4 text-brandGreen shrink-0" />
                          <span>{evt.attendees}+ Joined</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer (Speaker & Action Button) */}
                    <div className="border-t border-white/5 pt-4">
                      {/* Speaker Info */}
                      <div className="flex items-center space-x-3 text-left mb-4 bg-white/[0.01] border border-white/5 p-2.5 rounded-2xl">
                        <div className="w-8 h-8 rounded-full bg-brandGreen/20 border border-brandGreen/20 text-brandGreen font-black flex items-center justify-center text-xs shrink-0">
                          {evt.speaker.name.charAt(0)}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-xs font-black text-white truncate leading-tight">{evt.speaker.name}</span>
                          <span className="text-[10px] text-gray-500 font-bold truncate leading-tight mt-0.5">{evt.speaker.title} ({evt.speaker.organization})</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      {isUpcoming ? (
                        <button
                          onClick={() => {
                            if (isRegistered) {
                              alert('You are already registered for this event!');
                            } else {
                              handleOpenRegistration(evt);
                            }
                          }}
                          className={`w-full py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer ${
                            isRegistered 
                              ? 'bg-emerald-500/20 text-brandGreen border border-brandGreen/30'
                              : 'bg-brandGreen hover:bg-brandGreen-dark text-white shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20'
                          }`}
                        >
                          {isRegistered ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-brandGreen" />
                              <span>Registered</span>
                            </>
                          ) : (
                            <>
                              <span>Register for Free</span>
                              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <a
                            href={evt.recordingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3 bg-[#011b36] hover:bg-[#01254a] border border-white/10 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
                          >
                            <Play className="w-3.5 h-3.5 text-brandGreen fill-brandGreen shrink-0" />
                            <span>Watch</span>
                          </a>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              alert('Downloading resources slides document...');
                            }}
                            className="flex-1 py-3 bg-[#011b36] hover:bg-[#01254a] border border-white/10 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span>Slides</span>
                          </a>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── 3. Past Mentors / Speakers Section ── */}
      <section className="py-20 bg-white text-navy border-t border-gray-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase mb-2 block">OUR HOSTS</span>
            <h2 className="text-3xl font-extrabold text-navy tracking-tight">Meet Our Past Speakers</h2>
            <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed mt-2">
              Our events are hosted by qualified Chartered Accountants, ACCA members, and senior industry mentors representing Big 4 audit firms, multinational corporations, and leading academic platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pastSpeakers.map((speaker, idx) => (
              <div
                key={idx}
                className="bg-gray-50/50 border border-gray-100 rounded-3xl p-6 text-center hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-brandGreen font-black text-lg border border-brandGreen/25 mb-4 shadow-sm">
                    {speaker.name.charAt(0)}
                  </div>
                  <span className="bg-emerald-500/10 text-brandGreen text-[9px] font-black px-2 py-0.5 rounded-full uppercase mb-2">
                    {speaker.tag}
                  </span>
                  <h4 className="text-base font-extrabold text-navy leading-tight">{speaker.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{speaker.role}</p>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold mt-3 text-center line-clamp-3">
                    {speaker.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Registration Modal ── */}
      {selectedEventForModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-navy-dark bg-opacity-80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#011227] border border-brandGreen/20 w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 animate-scaleIn relative flex flex-col max-h-[90vh] overflow-hidden text-left">
            
            {/* Glowing Backdrop inside Modal */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-brandGreen/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedEventForModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5 z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Content Container */}
            <div className="overflow-y-auto pr-1 flex-1 z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {isRegisteredSuccess ? (
                <div className="flex flex-col items-center text-center py-6">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-brandGreen/30 text-brandGreen rounded-full flex items-center justify-center mb-5 animate-pulse shadow-[0_0_15px_rgba(0,200,83,0.2)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-xl font-extrabold text-white mb-2">Seat Reserved!</h3>
                  
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium mb-1">
                    Thank you, <span className="text-brandGreen font-bold">{registrationForm.name}</span>.
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-sm mb-6 font-medium">
                    You are registered for <strong>{selectedEventForModal.title}</strong>. A confirmation email with the Zoom/Teams invite link has been sent to <span className="text-emerald-400 font-semibold">{registrationForm.email}</span>.
                  </p>

                  <button
                    onClick={() => setSelectedEventForModal(null)}
                    className="px-6 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 cursor-pointer"
                  >
                    Got it, Thanks!
                  </button>
                </div>
              ) : (
                <>
                  {/* Modal Title */}
                  <div className="flex items-center space-x-2 mb-3">
                    <Calendar className="w-5 h-5 text-brandGreen" />
                    <span className="text-brandGreen text-xs font-black uppercase tracking-widest">Reserve Your Seat</span>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug pr-6 mb-2">
                    {selectedEventForModal.title}
                  </h3>
                  
                  <p className="text-xs text-gray-400 leading-relaxed font-medium mb-6">
                    Join this free webinar on <strong>{selectedEventForModal.date}</strong> at <strong>{selectedEventForModal.time}</strong>. Fill out the registration form below.
                  </p>

                  {/* Modal Form */}
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Ahmad Shah"
                        value={registrationForm.name}
                        onChange={handleInputChange}
                        className="w-full bg-[#010915] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-brandGreen/50 text-white font-medium"
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="e.g. ahmad@gmail.com"
                        value={registrationForm.email}
                        onChange={handleInputChange}
                        className="w-full bg-[#010915] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-brandGreen/50 text-white font-medium"
                      />
                    </div>

                    {/* Contact Number */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">WhatsApp / Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="e.g. +92 300 1234567"
                        value={registrationForm.phone}
                        onChange={handleInputChange}
                        className="w-full bg-[#010915] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-brandGreen/50 text-white font-medium"
                      />
                    </div>

                    {/* Qualification / Current Stage */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Current Stage / Level</label>
                      <select
                        name="level"
                        value={registrationForm.level}
                        onChange={handleInputChange}
                        className="w-full bg-[#010915] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-brandGreen/50 text-white font-medium cursor-pointer"
                      >
                        <option value="CAF Student">CA - CAF Stage</option>
                        <option value="CFAP Student">CA - CFAP / MSA Stage</option>
                        <option value="PRC Student">CA - PRC (Entry Level)</option>
                        <option value="ACCA Student">ACCA Student</option>
                        <option value="ACCA Affiliate">ACCA Affiliate / Member</option>
                        <option value="Finance Professional">Other Finance Graduate</option>
                      </select>
                    </div>

                    {/* Optional Questions */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Questions for the Speaker (Optional)</label>
                      <textarea
                        name="questions"
                        rows="2"
                        placeholder="What is your biggest hurdle? Ask the speaker here..."
                        value={registrationForm.questions}
                        onChange={handleInputChange}
                        className="w-full bg-[#010915] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-brandGreen/50 text-white font-medium resize-none"
                      />
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 pb-1">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-brandGreen hover:bg-brandGreen-dark text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span>Submit &amp; Reserve Seat</span>
                        )}
                      </button>
                    </div>

                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
