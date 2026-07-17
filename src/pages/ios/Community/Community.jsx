import { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  BookOpen,
  Calendar,
  Megaphone,
  AlertCircle,
  FileText,
  ChevronRight,
  HelpCircle,
  Heart,
  X
} from 'lucide-react';
import communityHeroBg from '../../../assets/community_hero_bg.png';

const INITIAL_COMMUNITIES = [
  {
    id: 'prc',
    title: 'PRC Students',
    badge: 'Beginner Level',
    badgeBg: 'bg-emerald-500/10 text-brandGreen border border-brandGreen/20',
    desc: 'For students starting their journey with PRC.',
    members: '4,250+ Members',
    bullets: [
      'Study Tips & Guidance',
      'PRC Registration Help',
      'Subject Discussion',
      'Exam Preparation Support'
    ],
    btnBg: 'bg-brandGreen hover:bg-brandGreen-dark text-white'
  },
  {
    id: 'caf',
    title: 'CAF Students',
    badge: 'Intermediate Level',
    badgeBg: 'bg-blue-500/10 text-blue-500 border border-blue-200',
    desc: 'For CA Foundation (CAF) students preparing for exams.',
    members: '5,800+ Members',
    bullets: [
      'Subject Discussions',
      'Past Papers & MCQs',
      'Important Resources',
      'Motivation & Support'
    ],
    btnBg: 'bg-blue-600 hover:bg-blue-750 text-white'
  },
  {
    id: 'cfap',
    title: 'CFAP Students',
    badge: 'Advanced Level',
    badgeBg: 'bg-purple-500/10 text-purple-500 border border-purple-200',
    desc: 'For CA Final (CFAP) students preparing for exams.',
    members: '4,600+ Members',
    bullets: [
      'Advanced Study Material',
      'Audit & Case Discussions',
      'Exam Strategies',
      'Career Guidance'
    ],
    btnBg: 'bg-purple-600 hover:bg-purple-750 text-white'
  },
  {
    id: 'acca',
    title: 'ACCA Students',
    badge: 'ACCA Community',
    badgeBg: 'bg-amber-500/10 text-amber-600 border border-amber-200',
    desc: 'For ACCA students at all levels (Applied to Strategic).',
    members: '3,250+ Members',
    bullets: [
      'ACCA Study Support',
      'Global Resources',
      'Exam Tips & Techniques',
      'Career Opportunities'
    ],
    btnBg: 'bg-amber-600 hover:bg-amber-700 text-white'
  }
];

const ANNOUNCEMENTS = [
  {
    title: 'Summer 2024 Inductions are now live!',
    desc: 'Check Jobs / Inductions section for latest opportunities.',
    date: '22 May, 2024',
    icon: <Megaphone className="w-5 h-5 text-brandGreen" />,
    bg: 'bg-emerald-50'
  },
  {
    title: 'Live Session: How to Prepare for CA Final Exams Effectively',
    desc: 'Join our free live session this Sunday at 8 PM.',
    date: '20 May, 2024',
    icon: <Calendar className="w-5 h-5 text-blue-500" />,
    bg: 'bg-blue-50'
  },
  {
    title: 'Important Update: PRC Exam Form Deadline Extended',
    desc: 'Last date extended to 15 June 2024.',
    date: '18 May, 2024',
    icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
    bg: 'bg-amber-50'
  },
  {
    title: 'New Study Resources Added',
    desc: 'Check Resources section for notes and MCQs.',
    date: '16 May, 2024',
    icon: <FileText className="w-5 h-5 text-purple-500" />,
    bg: 'bg-purple-50'
  }
];

const DISCUSSIONS = [
  {
    title: 'How to manage time during articleship?',
    category: 'PRC Students',
    replies: '24 replies',
    time: '2h ago',
    tag: 'New',
    tagBg: 'bg-emerald-500 text-white',
    avatar: 'A'
  },
  {
    title: 'Which subjects are most important in CAF?',
    category: 'CAF Students',
    replies: '18 replies',
    time: '5h ago',
    tag: 'Popular',
    tagBg: 'bg-blue-500 text-white',
    avatar: 'S'
  },
  {
    title: 'Need help in Audit case study.',
    category: 'CFAP Students',
    replies: '12 replies',
    time: '1d ago',
    avatar: 'M'
  },
  {
    title: 'Which ACCA paper is most scoring?',
    category: 'ACCA Students',
    replies: '16 replies',
    time: '1d ago',
    avatar: 'K'
  }
];

export default function Community({ initialCommunityId, onClearInitialCommunity }) {
  const [communitiesList] = useState(INITIAL_COMMUNITIES);

  // Data is now purely static

  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  useEffect(() => {
    if (initialCommunityId) {
      const comm = communitiesList.find((c) => c.id === initialCommunityId);
      if (comm) {
        const timer = setTimeout(() => {
          setSelectedCommunity(comm);
          setIsJoinModalOpen(true);
          if (onClearInitialCommunity) {
            onClearInitialCommunity();
          }
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [initialCommunityId, onClearInitialCommunity, communitiesList]);

  const handleJoinClick = (comm) => {
    setSelectedCommunity(comm);
    setIsJoinModalOpen(true);
  };

  const filteredCommunities = activeFilter === 'all'
    ? communitiesList
    : communitiesList.filter(c => c.id === activeFilter);

  return (
    <div className="flex-grow bg-bgLight">
      <header
        className="bg-navy text-white pt-16 pb-24 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(2, 27, 58, 0.95), rgba(2, 27, 58, 0.92)), url(${communityHeroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Glow shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brandGreen/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-brandGreen/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Hero Left Content */}
            <div className="lg:col-span-8 space-y-6">
              <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase block">
                COMMUNITY
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">
                Learn, Connect & <br />
                <span className="text-brandGreen">Grow Together</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-300 max-w-xl font-normal leading-relaxed">
                Join our active CA student communities and connect with thousands of students across Pakistan. Share knowledge, ask questions and grow together.
              </p>

              {/* Three badge icons row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                <div className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 rounded-xl bg-brandGreen/10 border border-brandGreen/20 flex items-center justify-center text-brandGreen group-hover:scale-105 transition-transform shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">Active Discussions</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Get answers to your questions</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">Study Together</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Share notes, tips and resources</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">Grow Your Network</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Connect with peers & mentors</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Right: Saboor Ahmad Quote Card */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="w-full max-w-sm bg-navy-dark/60 border border-white/10 p-6 rounded-3xl shadow-2xl backdrop-blur-md relative overflow-hidden space-y-6">

                {/* quote mark icon */}
                <div className="absolute top-6 right-6 text-brandGreen/20">
                  <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                <p className="text-sm italic text-gray-300 leading-relaxed pt-2">
                  "Alone we can do so little; together we can do so much."
                </p>

                <div className="border-t border-white/10 pt-4 flex flex-col">
                  <span className="text-2xl font-signature text-brandGreen tracking-wide select-none leading-none pt-1">Saboor Ahmad</span>
                  <span className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">CA, ACCA</span>
                  <span className="text-[10px] text-gray-400 mt-0.5 font-medium">Career Counselor & Mentor</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* 2. Main Two-Column Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column Sidebar */}
          <div className="lg:col-span-3 space-y-6">

            {/* Our Communities card */}
            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
              <div className="flex items-center space-x-2.5 pb-3 border-b border-gray-50">
                <Users className="w-5 h-5 text-brandGreen" />
                <h3 className="text-sm font-extrabold text-navy uppercase tracking-wider">Our Communities</h3>
              </div>

              <div className="flex flex-col space-y-1.5">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${activeFilter === 'all'
                      ? 'bg-brandGreen/10 text-brandGreen'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-navy'
                    }`}
                >
                  <span>All Communities</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {communitiesList.map((comm) => (
                  <button
                    key={comm.id}
                    onClick={() => setActiveFilter(comm.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${activeFilter === comm.id
                        ? 'bg-brandGreen/10 text-brandGreen'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-navy'
                      }`}
                  >
                    <div className="flex flex-col">
                      <span>{comm.title}</span>
                      <span className="text-[9px] text-gray-400 font-semibold mt-0.5">{comm.members}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar quick links list */}
            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
              <div className="flex flex-col space-y-3 text-xs font-bold text-gray-500">
                <button onClick={() => alert('Announcements Section')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-navy transition-colors flex items-center space-x-2.5 cursor-pointer">
                  <Megaphone className="w-4 h-4 text-gray-400" />
                  <span>All Announcements</span>
                </button>
                <button onClick={() => alert('Events Section')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-navy transition-colors flex items-center space-x-2.5 cursor-pointer">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Community Events</span>
                </button>
                <button onClick={() => alert('Resources Section')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-navy transition-colors flex items-center space-x-2.5 cursor-pointer">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span>Study Resources</span>
                </button>
                <button onClick={() => alert('Success Stories')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-navy transition-colors flex items-center space-x-2.5 cursor-pointer">
                  <Heart className="w-4 h-4 text-gray-400" />
                  <span>Success Stories</span>
                </button>
                <button onClick={() => alert('FAQ Section')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-navy transition-colors flex items-center space-x-2.5 cursor-pointer">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <span>FAQ / Help Center</span>
                </button>
              </div>
            </div>

            {/* Have a Question CTA Card */}
            <div className="bg-navy text-white rounded-3xl p-5 border border-white/5 shadow-md flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <h4 className="text-sm font-extrabold">Have a Question?</h4>
                <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                  Still have questions? We are here to help you!
                </p>
              </div>
              <button
                onClick={() => alert("Redirecting to Support Desk...")}
                className="w-full py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Ask Now
              </button>
            </div>

          </div>

          {/* Right Column Content */}
          <div className="lg:col-span-9 space-y-12">

            {/* Choose Your Community Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h2 className="text-xl sm:text-2xl font-extrabold text-navy">Choose Your Community</h2>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {activeFilter === 'all' ? 'Showing All' : 'Filtered'}
                </span>
              </div>

              {/* 4 Cards Main Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCommunities.map((comm) => (
                  <div
                    key={comm.id}
                    className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div>
                      {/* header row */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${comm.badgeBg}`}>
                          {comm.badge}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{comm.members}</span>
                      </div>

                      <h3 className="font-extrabold text-navy text-lg sm:text-xl mb-1.5 leading-snug">
                        {comm.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mb-5">
                        {comm.desc}
                      </p>

                      {/* list items */}
                      <div className="space-y-2 mb-6 pt-4 border-t border-gray-50">
                        {comm.bullets.map((bullet, idx) => (
                          <div key={idx} className="flex items-center space-x-2.5 text-xs text-textColor font-medium">
                            <span className="w-4 h-4 rounded-full bg-brandGreen/10 flex items-center justify-center text-brandGreen font-bold shrink-0 text-[10px]">✓</span>
                            <span>{bullet}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleJoinClick(comm)}
                      className={`w-full py-3.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer shadow-md ${comm.btnBg}`}
                    >
                      Join Community
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Join Banner */}
            <section className="bg-navy text-white rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-white/5 border border-white/5 rounded-full pointer-events-none" />
              <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/5 border border-white/5 rounded-full pointer-events-none" />

              <div className="space-y-6 relative z-10 flex-grow max-w-xl text-left">
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">Why Join Our Communities?</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-brandGreen/10 border border-brandGreen/25 flex items-center justify-center text-brandGreen shrink-0 font-bold text-[10px] mt-0.5">✓</span>
                    <div>
                      <h4 className="text-xs font-black text-white">Real-time Help</h4>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Get quick answers from peers & seniors</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-brandGreen/10 border border-brandGreen/25 flex items-center justify-center text-brandGreen shrink-0 font-bold text-[10px] mt-0.5">✓</span>
                    <div>
                      <h4 className="text-xs font-black text-white">Trusted Guidance</h4>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Learn from experienced professionals</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-brandGreen/10 border border-brandGreen/25 flex items-center justify-center text-brandGreen shrink-0 font-bold text-[10px] mt-0.5">✓</span>
                    <div>
                      <h4 className="text-xs font-black text-white">Jobs & Updates</h4>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Get latest vacancies & induction alerts</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-brandGreen/10 border border-brandGreen/25 flex items-center justify-center text-brandGreen shrink-0 font-bold text-[10px] mt-0.5">✓</span>
                    <div>
                      <h4 className="text-xs font-black text-white">Friendly Environment</h4>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">A positive space to learn, share & grow</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Styled Illustration Graphic right column inside why join banner */}
              <div className="shrink-0 z-10 w-44 h-28 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-2 text-brandGreen">
                  <Users className="w-8 h-8 animate-bounce" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-white">10,000+ Active</span>
                    <span className="text-[9px] text-gray-400">Join discussion channels</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Split announcements & discussion rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">

              {/* Left Column: Announcements */}
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="font-extrabold text-navy text-lg">Latest Announcements</h3>
                  <button onClick={() => alert('Archived Announcements')} className="text-xs font-bold text-brandGreen hover:underline cursor-pointer">View All</button>
                </div>

                <div className="space-y-4">
                  {ANNOUNCEMENTS.map((ann, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow flex items-start space-x-4"
                    >
                      <div className={`w-10 h-10 rounded-xl ${ann.bg} flex items-center justify-center shrink-0`}>
                        {ann.icon}
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-400 font-bold block">{ann.date}</span>
                        <h4 className="font-bold text-navy text-xs sm:text-sm leading-snug">
                          {ann.title}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">
                          {ann.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => alert("Announcement center coming soon!")}
                  className="w-full py-3.5 border border-brandGreen text-brandGreen hover:bg-brandGreen hover:text-white transition-colors text-xs font-extrabold rounded-xl uppercase tracking-wider"
                >
                  View All Announcements
                </button>
              </div>

              {/* Right Column: Active Discussions */}
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="font-extrabold text-navy text-lg">Active Discussions</h3>
                  <button onClick={() => alert('All discussions')} className="text-xs font-bold text-brandGreen hover:underline cursor-pointer">View All</button>
                </div>

                <div className="space-y-4">
                  {DISCUSSIONS.map((disc, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between space-x-4"
                    >
                      <div className="flex items-start space-x-3.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brandGreen to-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                          {disc.avatar}
                        </div>
                        <div className="space-y-1 pt-0.5">
                          <h4 className="font-bold text-navy text-xs sm:text-sm leading-snug hover:text-brandGreen cursor-pointer transition-colors">
                            {disc.title}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-bold block">
                            {disc.category} • {disc.replies} • {disc.time}
                          </span>
                        </div>
                      </div>

                      {disc.tag && (
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shrink-0 ${disc.tagBg}`}>
                          {disc.tag}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => alert("Discussion forums coming soon!")}
                  className="w-full py-3.5 border border-brandGreen text-brandGreen hover:bg-brandGreen hover:text-white transition-colors text-xs font-extrabold rounded-xl uppercase tracking-wider"
                >
                  View All Discussions
                </button>
              </div>

            </div>

          </div>
        </div>
      </main>

      {/* 3. Bottom WhatsApp Banner */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16 bg-white pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-3xl p-6 sm:p-8 shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -left-16 -bottom-16 w-52 h-52 rounded-full bg-white/5 border border-white/5 pointer-events-none" />
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5 border border-white/5 pointer-events-none" />

            <div className="flex items-center space-x-4 z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                {/* SVG WhatsApp icon */}
                <svg className="w-6 h-6 fill-current text-white animate-pulse" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="flex flex-col space-y-1 text-left">
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">Join Our WhatsApp Communities</h3>
                <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed">
                  Connect with thousands of CA students and stay updated.
                </p>
              </div>
            </div>

            <div className="z-10 w-full sm:w-auto shrink-0">
              <button
                onClick={() => alert("Joining WhatsApp Channels...")}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3.5 bg-brandGreen hover:bg-brandGreen-dark text-white border border-white/30 rounded-xl font-bold transition-all duration-200 text-xs shadow-lg cursor-pointer"
              >
                Join All Communities
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Join Confirmation Modal */}
      {isJoinModalOpen && selectedCommunity && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="px-6 py-4.5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="text-sm font-extrabold text-navy">Join Community</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{selectedCommunity.title}</p>
              </div>
              <button
                onClick={() => setIsJoinModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4 text-center">
              <div className="w-14 h-14 bg-brandGreen/10 border border-brandGreen/20 rounded-full flex items-center justify-center text-brandGreen mx-auto animate-pulse">
                <Users className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-navy">WhatsApp Group Redirect</h4>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                  You are being redirected to the official WhatsApp Group for <span className="text-brandGreen font-bold">{selectedCommunity.title}</span>.
                </p>
              </div>

              {/* Bullet notes */}
              <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100 text-left space-y-1.5 text-[10px] text-gray-500 font-semibold leading-normal">
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-brandGreen/10 flex items-center justify-center text-brandGreen shrink-0 font-bold">✓</span>
                  <span>Direct peer connection & doubt support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-brandGreen/10 flex items-center justify-center text-brandGreen shrink-0 font-bold">✓</span>
                  <span>Instant vacancy & articleship alerts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-brandGreen/10 flex items-center justify-center text-brandGreen shrink-0 font-bold">✓</span>
                  <span>100% Free moderated environment</span>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setIsJoinModalOpen(false)}
                  className="w-1/2 py-3 border border-gray-200 hover:bg-gray-50 text-gray-500 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsJoinModalOpen(false);
                    alert(`Redirecting to WhatsApp Group invite link for ${selectedCommunity.title}...`);
                  }}
                  className="w-1/2 py-3 bg-brandGreen hover:bg-brandGreen-dark text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  Open WhatsApp
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
