import { useState, useEffect } from 'react';
import {
  Search,
  Calendar as CalendarIcon,
  Clock,
  Bell,
  ShieldCheck,
  Users,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  X,
  MessageSquare,
  BellRing
} from 'lucide-react';



export default function Announcements({ initialAnnouncementId, onClearInitialAnnouncement }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  
  // Notification preference checkboxes
  const [preferences, setPreferences] = useState({
    email: true,
    website: true,
    whatsapp: true,
    telegram: false
  });

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState(null);

  const categories = [
    { name: 'All' },
    { name: 'Jobs & Inductions' },
    { name: 'Official Notices' },
    { name: 'Competitions' },
    { name: 'Study Updates' },
    { name: 'Community Updates' }
  ];

  // Map user categories to data tags
  const getFilterTag = (cat) => {
    if (cat === 'All') return 'All';
    if (cat === 'Jobs & Inductions') return 'Inductions';
    if (cat === 'Official Notices') return 'Official Notices';
    if (cat === 'Study Updates') return 'Study Updates';
    if (cat === 'Community Updates') return 'Community Updates';
    return cat;
  };

  const INITIAL_TIMELINE_DATA = [
    {
      id: 101,
      group: 'Today',
      date: '08 June 2026',
      time: '12:00 PM',
      tag: 'Inductions',
      title: 'EY Pakistan Fall Inductions Open for CA Inter & ACCA Students',
      desc: 'EY has officially opened applications for its Fall articleship and audit internship. Apply online before the deadline.',
      isNew: true,
      author: 'EY Pakistan HR',
      details: `EY has officially opened applications for its Fall articleship and audit internship. Apply online before the deadline.
      
      ### Induction Details:
      - Open for: CA Intermediate & ACCA Students.
      - Departments: Audit, Tax, and Advisory.
      - Apply through the EY online portal.`,
      ctaText: 'Apply via EY Portal',
      ctaUrl: 'https://ey.com/pk'
    },
    {
      id: 103,
      group: 'Today',
      date: '05 June 2026',
      time: '10:00 AM',
      tag: 'Study Updates',
      title: 'Updated 2026 CV Template Suite is now available for download',
      desc: 'We have updated our professional CV templates based on direct feedback from recruiters at PwC, KPMG and EY.',
      isNew: true,
      author: 'TaxMan Study Panel',
      details: `We have updated our professional CV templates based on direct feedback from recruiters at PwC, KPMG and EY. Clean, ATS-friendly designs are now available in the Resources tab.`,
      ctaText: 'Go to Resources',
      ctaUrl: '#resources'
    },
    {
      id: 1,
      group: 'Today',
      date: '24 May 2024',
      time: '10:30 AM',
      tag: 'Inductions',
      title: 'New PwC Articleship Batch – Applications Open',
      desc: 'PwC Pakistan has opened applications for its 2026 Articleship Program.',
      isNew: true,
      author: 'PwC Pakistan HR',
      details: `PwC Pakistan (A.F. Ferguson & Co.) has officially launched its recruitment portal for the 2026 Trainee Scheme / Articleship batch. This intake is open to CA Intermediate (CAF passed) and ACCA students who meet the academic qualifications.
      
      ### Key Requirements:
      - CA Students: Minimum CAF passed.
      - ACCA Students: Minimum 9 papers cleared (Knowledge & Skills modules).
      
      Apply online through the PwC Pakistan portal before the deadline.`,
      ctaText: 'Apply via PwC Portal',
      ctaUrl: 'https://pwc.com.pk'
    },
    {
      id: 3,
      group: 'Today',
      date: '24 May 2024',
      time: '08:00 AM',
      tag: 'Study Updates',
      title: 'New Study Notes Added – Audit & Assurance',
      desc: 'High quality handwritten notes are now available in the resources section.',
      isNew: true,
      author: 'TaxMan Study Panel',
      details: `High-quality, condensed revision notes covering key International Standards on Auditing (ISAs) have been compiled by qualified CAs and uploaded to our Resources database. Downloadable for free.`,
      ctaText: 'Go to Resources',
      ctaUrl: '#resources'
    },
    {
      id: 4,
      group: 'Yesterday',
      date: '23 May 2024',
      time: '05:45 PM',
      tag: 'Inductions',
      title: 'EY Summer Internship Program 2026 – Applications Open',
      desc: 'Kickstart your career with EY Pakistan. Apply before the deadline.',
      isNew: false,
      author: 'EY Pakistan HR',
      details: `EY Pakistan invites applications for its 6-week Summer Audit & Tax Internship program. Gain real-world corporate experience working on actual client files. Eligibility: CA Inter / ACCA candidates.`,
      ctaText: 'Apply via EY Portal',
      ctaUrl: 'https://ey.com/pk'
    },
    {
      id: 5,
      group: 'Yesterday',
      date: '23 May 2024',
      time: '04:30 PM',
      tag: 'Community Updates',
      title: 'Community Meetup – Lahore Chapter',
      desc: 'Join fellow CA & ACCA students for networking and guidance.',
      isNew: false,
      author: 'TaxMan Lahore Lead',
      details: `Network directly with senior qualified members and peers. Discuss articleship tips, exam guides, and corporate career tracks. Free registration.`,
      ctaText: 'Register for Meetup',
      ctaUrl: '#meetup'
    },
    {
      id: 7,
      group: '22 May 2024',
      date: '22 May 2024',
      time: '11:20 AM',
      tag: 'Official Notices',
      title: 'ACCA June 2024 Attempt – Important Reminders',
      desc: 'Check important exam day reminders and guidelines.',
      isNew: false,
      author: 'ACCA Pakistan Office',
      details: `Key guidelines regarding exam docket printouts, valid CNIC requirements, calculator restrictions, and COVID-19 safety guidelines for the upcoming June session.`,
      ctaText: 'View Exam Reminders',
      ctaUrl: 'https://accaglobal.com'
    },
    {
      id: 9,
      group: '20 May 2024',
      date: '20 May 2024',
      time: '11:00 AM',
      tag: 'Inductions',
      title: 'KPMG Pakistan Trainee Induction 2026 – Apply Now',
      desc: 'KPMG Taseer Hadi & Co. invites applications for CA & ACCA trainees in Karachi, Lahore, and Islamabad.',
      isNew: false,
      author: 'KPMG Pakistan HR',
      details: `KPMG Pakistan has officially opened its trainee recruitment portal for the Spring 2026 batch.
      
      ### Eligibility Criteria:
      - **CA Stream:** CAF passed candidates.
      - **ACCA Stream:** ACCA Affiliates or those with minimum 9 papers cleared.
      
      Select your preferred city (Karachi, Lahore, or Islamabad) and department (Audit & Assurance, Tax, or Advisory) during online submission.`,
      ctaText: 'Apply via KPMG Portal',
      ctaUrl: 'https://kpmg.com.pk'
    },
    {
      id: 10,
      group: '19 May 2024',
      date: '19 May 2024',
      time: '02:30 PM',
      tag: 'Inductions',
      title: 'BDO Ebrahim & Co. Trainee Recruitment',
      desc: 'Applications are now open for CA Trainees and ACCA Trainees across Pakistan.',
      isNew: false,
      author: 'BDO Pakistan HR',
      details: `BDO Pakistan is hiring CA trainees (CAF qualified) and ACCA trainees for Audit, Tax, and Corporate Advisory departments.
      
      ### Selection Process:
      - Online Application Screening.
      - Written Test (Accounting, Audit, and General Aptitude).
      - HR & Partner Interviews.`,
      ctaText: 'Apply via BDO Portal',
      ctaUrl: 'https://bdo.com.pk'
    },
    {
      id: 12,
      group: '17 May 2024',
      date: '17 May 2024',
      time: '09:00 AM',
      tag: 'Official Notices',
      title: 'ICAP Introduces Digital Technology Competency Roadmap',
      desc: 'New guidelines on integrating data analytics and digital tools into practical training.',
      isNew: false,
      author: 'ICAP Education Dept',
      details: `The Institute of Chartered Accountants of Pakistan (ICAP) has published a new guideline outlining the Digital Technology Competency requirements for trainees. Firms are instructed to provide exposure in:
      - Data Analysis Tools (Excel Advanced, PowerBI, Tableau).
      - Basic IT Audit techniques.
      - Cloud accounting basics.`,
      ctaText: 'Download Official Circular',
      ctaUrl: 'https://icap.org.pk'
    }
  ];

  const [timelineList] = useState(INITIAL_TIMELINE_DATA);

  // Data is now purely static

  useEffect(() => {
    if (initialAnnouncementId) {
      const ann = timelineList.find((item) => item.id === initialAnnouncementId);
      if (ann) {
        const timer = setTimeout(() => {
          setSelectedAnnouncement(ann);
          if (onClearInitialAnnouncement) {
            onClearInitialAnnouncement();
          }
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [initialAnnouncementId, onClearInitialAnnouncement, timelineList]);

  const newsCards = [
    {
      id: 1,
      tag: 'OFFICIAL NOTICE',
      title: 'ICAP Issues New Guidance for Practical Training',
      date: '22 May 2024',
      color: 'bg-blue-600',
      desc: 'Important guidelines for CA trainees regarding leaves and training contracts.',
      author: 'ICAP Education Department',
      details: `ICAP has officially released updated regulations regarding trainee leaves, training contract transfers, and supervisor evaluations. Trainees are advised to review the maximum leave allowance for CAF and CFAP attempts to avoid delays in articleship execution.
      
      ### Key Guidelines:
      - Leaves count adjustments for exam attempts.
      - Simplified process for firm-to-firm transfer certificates.
      - Mandatory digital logging of training hours.`,
      ctaText: 'Download Official Directive',
      ctaUrl: 'https://icap.org.pk'
    },
    {
      id: 2,
      tag: 'CAREER FAIR',
      title: 'Top Firms to Participate in ICAP Career Fair 2026',
      date: '21 May 2024',
      color: 'bg-emerald-600',
      desc: 'PwC, EY, KPMG, BDO, and major banks set to recruit on the spot.',
      author: 'ICAP Placement Board',
      details: `The annual national ICAP Career Fair is back. Senior partners and HR executives from the Big 4 accounting firms, mid-tier advisory practices, and leading multinational banks will be holding on-the-spot interviews and screening resume portfolios.
      
      ### Preparation Instructions:
      - Carry multiple hardcopies of your updated resume.
      - Formal professional business attire is mandatory.
      - Pre-register via the ICAP student portal link.`,
      ctaText: 'Register for Career Fair',
      ctaUrl: 'https://icap.org.pk'
    },
    {
      id: 3,
      tag: 'STUDY UPDATE',
      title: 'IFRS 18 Standards Cheat Sheet Released',
      date: '20 May 2024',
      color: 'bg-purple-600',
      desc: 'Download our comprehensive 2-page summary guide on incoming IFRS 18 changes.',
      author: 'TaxMan Study Panel',
      details: `With the incoming introduction of IFRS 18 (Presentation and Disclosure in Financial Statements) replacing IAS 1, our study panel has compiled a concise 2-page reference booklet detailing key balance sheet adjustments, operating profit categorizations, and disclosure requirements for CA Finalists.
      
      Free for download in PDF format.`,
      ctaText: 'Download PDF Cheat Sheet',
      ctaUrl: '#resources'
    },
    {
      id: 4,
      tag: 'COMMUNITY',
      title: 'Islamabad Chapter Meetup Highlights',
      date: '19 May 2024',
      color: 'bg-cyan-600',
      desc: 'Highlights from our recent peer networking and panel session in Islamabad.',
      author: 'TaxMan Islamabad Lead',
      details: `Over 150 CA and ACCA candidates attended our networking meetup in Islamabad. Highlights included resume reviews by HR reps, mock interviews, and career guidance panel talks by qualified controllers from foreign MNCs.
      
      Photos and video briefs are available on our social channels.`,
      ctaText: 'View Event Gallery',
      ctaUrl: 'https://facebook.com'
    },
    {
      id: 5,
      tag: 'COMPETITION',
      title: 'Case Study Competition – Winners Announced',
      date: '18 May 2024',
      color: 'bg-amber-600',
      desc: 'Congratulations to the winning team from CAF level students!',
      author: 'TaxMan Competition Board',
      details: `The National Corporate Analysis Case Study Competition has successfully concluded. We received over 50 submissions from CAF and ACCA students nationwide. Special congratulations to the winning team from Lahore, who analyzed financial structures of major telecom networks.
      
      Winning entries have been published on our Resources portal.`,
      ctaText: 'View Winning Case Study',
      ctaUrl: '#resources'
    },
    {
      id: 6,
      tag: 'STUDY UPDATE',
      title: 'New IFRS Notes Now Available',
      date: '17 May 2024',
      color: 'bg-rose-600',
      desc: 'Comprehensive revision booklets for IFRS 15, IFRS 16, and IFRS 9.',
      author: 'TaxMan Academic Team',
      details: `Highly structured revision sheets and practice questions covering complex accounting standards (IFRS 15 Revenue, IFRS 16 Leases, and IFRS 9 Financial Instruments) have been finalized by senior mentors. Includes solved exam papers and formatting templates.`,
      ctaText: 'Download IFRS Booklets',
      ctaUrl: '#resources'
    },
    {
      id: 7,
      tag: 'JOBS',
      title: 'Crowe Pakistan Announces Corporate Advisory Vacancies',
      date: '16 May 2024',
      color: 'bg-teal-700',
      desc: 'Hiring CA/ACCA trainees and junior consultants for financial modeling and transaction services.',
      author: 'Crowe Pakistan HR',
      details: `Crowe Pakistan is accepting applications for junior advisory consultants and trainee analysts in Deal Advisory, Corporate Valuations, and Tax Advisory. Open to CA Intermediate (CAF passed) and ACCA members/affiliates.
      
      Send resumes directly to recruitment@crowe.com.pk.`,
      ctaText: 'Apply via Email',
      ctaUrl: 'mailto:recruitment@crowe.com.pk'
    },
    {
      id: 8,
      tag: 'TRAINING',
      title: 'Articleship Orientation Series by Grant Thornton',
      date: '15 May 2024',
      color: 'bg-orange-600',
      desc: 'Access video guidelines on audit documentation, professional ethics, and spreadsheet basics.',
      author: 'Grant Thornton HR',
      details: `Get ready to join audit practices. This video session series compiled by senior managers from Grant Thornton covers Excel basics, audit documentation fundamentals, audit working paper file designs, and ethics directives.
      
      Free for all TaxMan registered students.`,
      ctaText: 'Watch Video Series',
      ctaUrl: '#resources'
    },
    {
      id: 9,
      tag: 'TRAINING',
      title: 'ICAP Presentation & Communication Skills (PCSF) Course',
      date: '14 May 2024',
      color: 'bg-emerald-700',
      desc: 'New schedules announced for Lahore and Karachi students at ICAP campuses.',
      author: 'ICAP Training Dept',
      details: `ICAP has announced its PCSF Course schedule for the upcoming months. The presentation and communications course is a mandatory prerequisite for CA candidates registering for CFAP level exams.
      
      Enrollment closes this weekend. Register via your ICAP student login.`,
      ctaText: 'Register on ICAP Portal',
      ctaUrl: 'https://icap.org.pk'
    }
  ];


  const upcomingEvents = [
    { day: '24', title: 'Webinar: How to Prepare for CA Final', time: '07:00 PM - 08:30 PM', loc: 'Online (Zoom)' },
    { day: '25', title: 'CV & Cover Letter Workshop', time: '04:00 PM - 06:00 PM', loc: 'Online' },
    { day: '28', title: 'Mock Interview Session', time: '11:00 AM - 01:00 PM', loc: 'Lahore Office' },
    { day: '31', title: 'Networking Evening – Karachi Chapter', time: '06:00 PM - 09:00 PM', loc: 'Karachi' }
  ];

  const deadlines = [
    { title: 'PwC Articleship Program', desc: 'Last date to apply', date: '20', month: 'JUL', year: '2026', color: 'text-red-500' },
    { title: 'EY Internship Program', desc: 'Last date to apply', date: '25', month: 'JUL', year: '2026', color: 'text-gray-900' },
    { title: 'ICAP Annual Registration', desc: 'Last date for students', date: '30', month: 'JUL', year: '2026', color: 'text-gray-900' },
    { title: 'ACCA June 2024 Attempt', desc: 'Exams start from', date: '03', month: 'JUN', year: '2026', color: 'text-red-500' },
    { title: 'CA Final Practical Training', desc: 'Last date to enroll', date: '15', month: 'AUG', year: '2026', color: 'text-red-500' }
  ];

  const faqs = [
    { q: 'How can I receive announcements?', a: 'You can receive announcements directly by signing up for email notifications, joining our WhatsApp community channel, or checking this updates feed regularly.' },
    { q: 'How often are announcements posted?', a: 'Announcements are posted in real-time as soon as top audit firms open registration or official student guidelines are announced by ICAP/ACCA.' },
    { q: 'Are all announcements verified?', a: 'Yes. Every single update regarding firm inductions, exam dates, and registration portals is double-checked against official resources before release.' },
    { q: 'Can I submit my event for announcement?', a: 'Yes! Recruiter reps or community leads can submit events for review using the "Request a Resource" or event suggestion tools.' },
    { q: 'How can I report incorrect information?', a: 'Please contact our admin team via email at support@thetaxmanscapital.com or use our query form, and our moderation panel will review immediately.' }
  ];

  // Filter Logic
  const filteredTimeline = timelineList.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const filterTag = getFilterTag(selectedCategory);
    const matchesCategory = filterTag === 'All' || item.tag === filterTag;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-grow bg-bgLight">

      {/* ── 1. Mockup Hero Header Banner ── */}
      <section className="relative bg-navy text-white pt-20 pb-24 overflow-hidden">
        {/* Glow shapes */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-brandGreen/5 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute -bottom-20 left-10 w-[350px] h-[350px] bg-brandGreen/5 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
              <span className="bg-brandGreen/10 border border-brandGreen/25 text-brandGreen text-[11px] font-extrabold tracking-widest px-3 py-1.5 rounded-full uppercase">
                ANNOUNCEMENTS
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
                Stay Updated with<br />
                Every Important <span className="text-brandGreen">Announcement</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-300 max-w-xl font-normal leading-relaxed">
                Official updates, webinars, induction schedules, deadlines, events and community notices for CA & ACCA students.
              </p>

              {/* Sleek Search Input */}
              <div className="relative w-full max-w-md mt-2">
                <input
                  type="text"
                  placeholder="Search announcements, inductions, events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-brandGreen focus:ring-1 focus:ring-brandGreen/30 transition-all"
                />
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              </div>


              {/* 4 Feature Bullet Points */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-lg pt-2 text-xs font-bold text-gray-250">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-brandGreen shrink-0" />
                  <div className="flex flex-col">
                    <span>Verified Updates</span>
                    <span className="text-[10px] text-gray-400 font-medium">100% verified information</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-brandGreen shrink-0" />
                  <div className="flex flex-col">
                    <span>Timely Updates</span>
                    <span className="text-[10px] text-gray-400 font-medium">Important updates delivered on time</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-brandGreen shrink-0" />
                  <div className="flex flex-col">
                    <span>Multiple Channels</span>
                    <span className="text-[10px] text-gray-400 font-medium">Website, Email, Whatsapp & more</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-brandGreen shrink-0" />
                  <div className="flex flex-col">
                    <span>Student Focused</span>
                    <span className="text-[10px] text-gray-400 font-medium">Curated for CA & ACCA students</span>
                  </div>
                </div>
              </div>

              {/* Button Row */}
              <div className="flex items-center space-x-4 pt-4">
                <button
                  onClick={() => alert('Notifications enabled!')}
                  className="flex items-center justify-center px-5 py-3.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl font-bold transition-all duration-200 text-xs shrink-0 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Enable Notifications
                </button>
                <span className="text-xs text-gray-400 font-medium">Join 10,000+ students who never miss an update</span>
              </div>
            </div>

            {/* Right Column Featured Update Card */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative group max-w-[420px] w-full">
                <div className="absolute -inset-2 bg-brandGreen rounded-3xl blur-2xl opacity-20 pointer-events-none" />
                
                {/* Featured card matching mockup layout */}
                <div className="relative rounded-3xl border border-white/10 bg-navy p-6 shadow-2xl flex flex-col sm:flex-row items-center gap-6">
                  
                  {/* Left Info block */}
                  <div className="flex-grow text-left space-y-4">
                    <span className="text-[9px] font-black text-brandGreen uppercase tracking-widest">
                      ★ FEATURED ANNOUNCEMENT
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
                      ICAP Career Fair 2026
                    </h3>
                    <p className="text-xs text-gray-300 font-medium leading-relaxed">
                      Meet top audit firms including PwC, EY, KPMG and Deloitte under one roof.
                    </p>
                    
                    <div className="space-y-1.5 text-[11px] text-gray-400 font-semibold">
                      <div className="flex items-center">
                        <CalendarIcon className="w-3.5 h-3.5 mr-2 text-brandGreen" />
                        <span>20 July 2026 (Sunday)</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-2 text-brandGreen" />
                        <span>10:00 AM - 5:00 PM</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-2 text-brandGreen" />
                        <span>Lahore Expo Center, Lahore</span>
                      </div>
                    </div>

                    <button
                      onClick={() => alert('Registering for ICAP Career Fair 2026')}
                      className="px-5 py-3.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl font-bold transition-all duration-200 text-xs cursor-pointer shadow-md"
                    >
                      Register Now →
                    </button>
                  </div>

                  {/* Mock 3D Smartphone Image Overlay representation (modeled using SVGs & styles) */}
                  <div className="w-24 h-40 bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-white/20 rounded-2xl p-2 relative shrink-0 shadow-inner flex flex-col justify-between overflow-hidden">
                    <div className="w-10 h-1 bg-white/20 rounded-full mx-auto" />
                    <div className="flex flex-col space-y-1.5 my-auto">
                      <div className="w-full h-1.5 bg-brandGreen/25 rounded" />
                      <div className="w-2/3 h-1.5 bg-white/10 rounded" />
                      <div className="w-4/5 h-1.5 bg-white/10 rounded" />
                      <div className="w-1/2 h-1.5 bg-white/10 rounded" />
                    </div>
                    {/* Glowing green bell graphic */}
                    <div className="absolute top-2 right-2 w-7 h-7 bg-brandGreen/20 rounded-full border border-brandGreen flex items-center justify-center animate-bounce">
                      <BellRing className="w-4 h-4 text-brandGreen" />
                    </div>
                    {/* Small grid representation */}
                    <div className="w-full h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                      <span className="text-[6px] text-gray-400 font-bold uppercase tracking-wider">TM App</span>
                    </div>
                  </div>

                </div>

                {/* Carousel dots */}
                <div className="flex justify-center space-x-2 mt-4">
                  <span className="w-5 h-1.5 rounded-full bg-brandGreen" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. Category Browse Grid ── */}
      <section className="py-4 bg-white border-b border-gray-100 sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-x-auto py-2">
          <div className="flex items-center space-x-2 sm:space-x-4 whitespace-nowrap">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
                  selectedCategory === cat.name
                    ? 'bg-emerald-500/5 text-brandGreen border-brandGreen/20 shadow-inner'
                    : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Main Split Column Content ── */}
      <section className="py-12 bg-bgLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── LEFT COLUMN: Timeline Feed & News ── */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Timeline feed matching mockup style */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-extrabold text-navy text-left mb-8 pb-3 border-b border-gray-50">
                  Latest Announcements
                </h3>

                {filteredTimeline.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 font-bold">
                    No announcements found matching selector.
                  </div>
                ) : (
                  <div className="relative border-l border-emerald-500/25 ml-4 sm:ml-28 text-left space-y-8">
                    {filteredTimeline.map((item) => (
                      <div key={item.id} className="relative pl-6 sm:pl-8 group">
                        
                        {/* Date Tag positioning on the absolute left for wide screens */}
                        <div className="hidden sm:block absolute right-full mr-8 top-1 text-right w-24">
                          <span className="text-xs font-bold text-navy block leading-none">{item.group}</span>
                          <span className="text-[10px] text-gray-400 font-bold mt-1 block">{item.date.split(' ')[0]} {item.date.split(' ')[1]}</span>
                        </div>

                        {/* Timeline Circle Bullet */}
                        <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-brandGreen border-2 border-white shadow-md ring-4 ring-emerald-500/10 group-hover:scale-125 transition-transform" />

                        {/* Content Container */}
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h4 className="font-extrabold text-navy text-sm sm:text-base leading-snug group-hover:text-brandGreen transition-colors flex items-center gap-2">
                              {item.title}
                              {item.isNew && (
                                <span className="px-2 py-0.5 bg-emerald-500/10 text-[9px] font-black text-brandGreen rounded border border-brandGreen/10">
                                  New
                                </span>
                              )}
                            </h4>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider shrink-0">
                              {item.time}
                            </span>
                          </div>

                          <p className="text-xs text-gray-500 font-medium leading-relaxed">
                            {item.desc}
                          </p>

                          <div className="pt-2 flex items-center justify-between sm:justify-start gap-4">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                              Category: {item.tag}
                            </span>
                            <button
                              onClick={() => setSelectedAnnouncement(item)}
                              className="text-xs font-bold text-brandGreen hover:underline flex items-center cursor-pointer"
                            >
                              Read Details <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-50 flex justify-center">
                  <button
                    onClick={() => alert('Loading older announcements...')}
                    className="flex items-center space-x-1.5 px-6 py-3 border border-gray-100 hover:border-brandGreen/20 bg-gray-50/50 hover:bg-white text-navy font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                  >
                    <span>View Older Announcements</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Latest News & Updates Grid */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-navy tracking-tight text-left">Latest News & Updates</h3>
                  <button
                    onClick={() => alert('View All News under development')}
                    className="text-xs font-extrabold text-brandGreen hover:underline cursor-pointer"
                  >
                    View All News
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {newsCards.map((news) => (
                    <div
                      key={news.id}
                      className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between text-left group"
                    >
                      {/* Graphics card top visual */}
                      <div className={`h-24 ${news.color} p-4 flex flex-col justify-between relative overflow-hidden`}>
                        <div className="absolute -right-8 -bottom-8 w-20 h-20 bg-white/10 rounded-full" />
                        <span className="text-[8px] font-black text-white bg-white/20 px-2 py-0.5 rounded border border-white/10 tracking-widest uppercase inline-block self-start">
                          {news.tag}
                        </span>
                        <span className="text-[9px] text-white/75 font-semibold">{news.date}</span>
                      </div>

                      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-extrabold text-navy text-sm group-hover:text-brandGreen transition-colors duration-200 leading-snug line-clamp-2">
                            {news.title}
                          </h4>
                          <p className="text-[11px] text-gray-400 font-semibold leading-relaxed line-clamp-3">
                            {news.desc}
                          </p>
                        </div>

                        <button
                          onClick={() => setSelectedAnnouncement(news)}
                          className="text-xs font-bold text-navy hover:text-brandGreen flex items-center transition-colors pt-2 cursor-pointer self-start"
                        >
                          Read Post <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN: Sidebar Blocks ── */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Upcoming Events & Calendar */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                  <h4 className="text-sm font-extrabold text-navy uppercase tracking-wider">
                    Upcoming Events
                  </h4>
                  <button
                    onClick={() => { window.location.hash = '#events'; }}
                    className="text-[10px] font-extrabold text-brandGreen hover:underline cursor-pointer"
                  >
                    View Calendar
                  </button>
                </div>

                {/* Calendar grid representation */}
                <div className="bg-gray-50/50 rounded-2xl border border-gray-100/50 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-extrabold text-navy">
                    <button className="p-1 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
                    <span>May 2024</span>
                    <button className="p-1 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-1 border-b border-gray-100">
                    <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold text-gray-550">
                    <span className="text-gray-300">29</span>
                    <span className="text-gray-300">30</span>
                    <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                    <span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span>
                    <span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span><span>19</span>
                    <span>20</span><span>21</span><span>22</span><span>23</span>
                    <span className="bg-brandGreen text-white rounded-lg flex items-center justify-center w-6 h-6 mx-auto shadow-md">24</span>
                    <span>25</span><span>26</span>
                    <span>27</span><span>28</span><span>29</span><span>30</span><span>31</span>
                    <span className="text-gray-300">1</span>
                    <span className="text-gray-300">2</span>
                  </div>
                </div>

                {/* Events List */}
                <div className="space-y-4 pt-2">
                  {upcomingEvents.map((evt, idx) => (
                    <div
                      key={idx}
                      onClick={() => { window.location.hash = '#events'; }}
                      className="flex items-start space-x-3.5 group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/5 border border-brandGreen/15 flex flex-col items-center justify-center shrink-0">
                        <span className="text-brandGreen font-black text-base leading-none">{evt.day}</span>
                        <span className="text-[8px] text-brandGreen font-bold uppercase tracking-widest mt-0.5">MAY</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-navy text-xs group-hover:text-brandGreen transition-colors leading-snug">{evt.title}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{evt.time} • {evt.loc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => { window.location.hash = '#events'; }}
                  className="w-full py-3.5 bg-gray-50 hover:bg-brandGreen hover:text-white border border-gray-100 hover:border-brandGreen text-navy text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer"
                >
                  View All Events →
                </button>
              </div>

              {/* Important Deadlines */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                  <h4 className="text-sm font-extrabold text-navy uppercase tracking-wider">
                    Important Deadlines
                  </h4>
                  <button
                    onClick={() => alert('View All Deadlines')}
                    className="text-[10px] font-extrabold text-brandGreen hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {deadlines.map((dl, idx) => (
                    <div key={idx} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-gray-200/60 flex items-center justify-center shrink-0">
                          <Clock className="w-4.5 h-4.5 text-gray-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-extrabold text-navy text-xs group-hover:text-brandGreen transition-colors leading-snug">{dl.title}</span>
                          <span className="text-[10px] text-gray-400 font-medium mt-0.5">{dl.desc}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0 border border-gray-150 rounded-lg px-2.5 py-1 text-center bg-gray-50/50">
                        <span className={`font-black text-sm leading-none ${dl.color}`}>{dl.date}</span>
                        <span className="text-[8px] text-gray-400 font-bold uppercase mt-0.5">{dl.month}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5 text-left">
                <h4 className="text-sm font-extrabold text-navy uppercase tracking-wider pb-3 border-b border-gray-50">
                  Notification Preferences
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                  Choose how you want to receive announcements.
                </p>

                <div className="space-y-3.5">
                  {[
                    { key: 'email', label: 'Email Notifications', desc: 'Receive updates on your email' },
                    { key: 'website', label: 'Website Notifications', desc: 'Show alerts on website' },
                    { key: 'whatsapp', label: 'WhatsApp Community', desc: 'Get updates on WhatsApp' },
                    { key: 'telegram', label: 'Telegram Channel', desc: 'Get updates on Telegram' }
                  ].map((ch) => (
                    <label key={ch.key} className="flex items-start space-x-3.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences[ch.key]}
                        onChange={() => setPreferences({ ...preferences, [ch.key]: !preferences[ch.key] })}
                        className="mt-0.5 accent-brandGreen w-4.5 h-4.5 rounded border-gray-200"
                      />
                      <div className="flex flex-col">
                        <span className="font-extrabold text-navy text-xs leading-none">{ch.label}</span>
                        <span className="text-[10px] text-gray-400 font-medium mt-1 leading-none">{ch.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  onClick={() => alert('Preferences saved!')}
                  className="w-full py-3.5 bg-brandGreen hover:bg-brandGreen-dark text-white text-xs font-extrabold rounded-xl transition-all duration-200 shadow-md shadow-emerald-500/10 cursor-pointer"
                >
                  Save Preferences
                </button>
              </div>

              {/* Announcement Archive */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4 text-left">
                <h4 className="text-sm font-extrabold text-navy uppercase tracking-wider pb-3 border-b border-gray-50">
                  Announcement Archive
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold mb-2">
                  Browse past announcements by month.
                </p>

                <div className="space-y-2">
                  {[
                    { month: 'May 2024', count: 28 },
                    { month: 'April 2024', count: 15 },
                    { month: 'March 2024', count: 30 },
                    { month: 'February 2024', count: 27 },
                    { month: 'January 2024', count: 25 }
                  ].map((arch, idx) => (
                    <button
                      key={idx}
                      onClick={() => alert(`Opening archive for ${arch.month}`)}
                      className="w-full py-2.5 px-4 rounded-xl border border-gray-50 hover:border-brandGreen/25 hover:bg-emerald-500/[0.02] text-left text-xs font-semibold text-gray-550 hover:text-brandGreen transition-all duration-200 flex items-center justify-between"
                    >
                      <span>{arch.month}</span>
                      <span className="text-[9px] text-gray-400 font-bold bg-gray-50 px-2.5 py-0.5 rounded-full">
                        {arch.count}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => alert('Full Archive Archive under development')}
                  className="w-full text-center text-xs font-extrabold text-brandGreen hover:underline cursor-pointer block pt-2"
                >
                  View Full Archive →
                </button>
              </div>

              {/* Frequently Asked Questions */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5 text-left">
                <h4 className="text-sm font-extrabold text-navy uppercase tracking-wider pb-3 border-b border-gray-50">
                  Frequently Asked Questions
                </h4>
                
                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                      <button
                        onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                        className="w-full text-left font-extrabold text-navy text-xs flex items-center justify-between hover:text-brandGreen transition-colors cursor-pointer py-1.5"
                      >
                        <span>{faq.q}</span>
                        {activeFaq === idx ? (
                          <ChevronUp className="w-4 h-4 text-brandGreen shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                        )}
                      </button>
                      {activeFaq === idx && (
                        <p className="mt-2 text-[11px] text-gray-400 leading-relaxed font-semibold">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── CTA Banner bottom ── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-navy border border-white/5 rounded-3xl p-8 shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -left-16 -bottom-16 w-52 h-52 rounded-full bg-white/5 border-4 border-white/5 pointer-events-none" />
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5 border border-white/5 pointer-events-none" />
            
            <div className="flex items-center space-x-4 z-10 text-left">
              <div className="w-12 h-12 rounded-2xl bg-brandGreen/10 flex items-center justify-center border border-brandGreen/20 shrink-0">
                <Bell className="w-6 h-6 text-brandGreen" />
              </div>
              <div className="flex flex-col space-y-1">
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">Never Miss an Opportunity</h3>
                <p className="text-xs sm:text-sm text-gray-400 font-semibold leading-relaxed">
                  Join 10,000+ CA & ACCA students who stay ahead with every important update.
                </p>
              </div>
            </div>

            <div className="z-10 flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => alert('Notifications enabled!')}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl font-bold transition-all duration-200 text-xs shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Enable Notifications <Bell className="w-4 h-4 ml-1.5" />
              </button>
              <div className="flex -space-x-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-full bg-gray-600 border border-navy flex items-center justify-center text-[8px] font-bold text-white shrink-0">UA</div>
                <div className="w-7 h-7 rounded-full bg-slate-600 border border-navy flex items-center justify-center text-[8px] font-bold text-white shrink-0">AF</div>
                <div className="w-7 h-7 rounded-full bg-emerald-600 border border-navy flex items-center justify-center text-[8px] font-bold text-white shrink-0">HR</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Detailed Details Modal ── */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-navy/70 backdrop-blur-md flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-[0_20px_50px_rgba(2,27,58,0.15)] border border-gray-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-300">
            
            {/* Close button */}
            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-navy transition-all duration-200 z-20 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="p-6 pb-2 text-left shrink-0">
              <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold border uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border-emerald-500/20`}>
                {selectedAnnouncement.tag}
              </span>
              <h3 className="text-xl font-bold text-navy mt-3 leading-snug">{selectedAnnouncement.title}</h3>
              <div className="flex items-center space-x-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2">
                <span>By: {selectedAnnouncement.author}</span>
                <span>•</span>
                <span>Date: {selectedAnnouncement.date}</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 pb-6 pt-2 overflow-y-auto flex-grow text-left space-y-4 max-h-[calc(90vh-140px)]">
              <div className="text-xs sm:text-sm text-gray-650 leading-relaxed font-semibold whitespace-pre-line border-t border-gray-100 pt-4">
                {selectedAnnouncement.details}
              </div>

              {/* Action Button */}
              <a
                href={selectedAnnouncement.ctaUrl}
                target={selectedAnnouncement.ctaUrl.startsWith('http') ? '_blank' : '_self'}
                rel="noreferrer"
                onClick={() => {
                  if (!selectedAnnouncement.ctaUrl.startsWith('http')) {
                    setSelectedAnnouncement(null);
                  }
                }}
                className="w-full py-3.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-extrabold rounded-xl text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:translate-y-0 text-center flex items-center justify-center uppercase tracking-wider block"
              >
                {selectedAnnouncement.ctaText}
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
