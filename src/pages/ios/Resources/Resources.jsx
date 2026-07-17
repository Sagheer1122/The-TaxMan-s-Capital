import { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Download,
  FileText,
  Users,
  GraduationCap,
  Award,
  Clock,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Send,
  FileCheck,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function Resources({ selectedCategory: externalCategory, setSelectedCategory: setExternalCategory, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [internalCategory, setInternalCategory] = useState('All');
  
  const selectedCategory = externalCategory !== undefined ? externalCategory : internalCategory;
  const setSelectedCategory = setExternalCategory !== undefined ? setExternalCategory : setInternalCategory;

  const [, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [requestForm, setRequestForm] = useState({ name: '', resourceTitle: '', category: '', notes: '' });
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { name: 'All', count: 112, icon: <BookOpen className="w-5 h-5" /> },
    { name: 'PRC', count: 4, icon: <GraduationCap className="w-5 h-5" />, color: 'text-amber-500', bg: 'bg-amber-500/5', border: 'hover:border-amber-500/30' },
    { name: 'CAF', count: 28, icon: <BookOpen className="w-5 h-5" />, color: 'text-blue-500', bg: 'bg-blue-500/5', border: 'hover:border-blue-500/30' },
    { name: 'Training/Induction', count: 42, icon: <FileText className="w-5 h-5" />, color: 'text-emerald-500', bg: 'bg-emerald-500/5', border: 'hover:border-emerald-500/30' },
    { name: 'CFAP & SCS', count: 18, icon: <Award className="w-5 h-5" />, color: 'text-purple-500', bg: 'bg-purple-500/5', border: 'hover:border-purple-500/30' },
    { name: 'ACCA', count: 20, icon: <Users className="w-5 h-5" />, color: 'text-cyan-500', bg: 'bg-cyan-500/5', border: 'hover:border-cyan-500/30' }
  ];

  const INITIAL_FEATURED_RESOURCES = [
    {
      id: 1,
      tag: 'CV Template',
      title: 'Professional CV Template (CA Student)',
      desc: 'ATS-friendly CV template specially designed for CA/ACCA students for firm inductions.',
      downloads: 245,
      type: 'PDF',
      category: 'Training/Induction',
      tagColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      btnColor: 'bg-brandGreen hover:bg-brandGreen-dark shadow-emerald-500/15'
    },
    {
      id: 2,
      tag: 'Interview',
      title: 'Audit Associate Interview Questions',
      desc: 'Top 50 frequently asked questions with suggested answers for Big 4 audit recruitment.',
      downloads: 310,
      type: 'PDF',
      category: 'Training/Induction',
      tagColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      btnColor: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/15'
    },
    {
      id: 3,
      tag: 'Study Guide',
      title: 'FR - Financial Reporting Complete Guide',
      desc: 'Complete coverage of FR with key accounting standards, concepts, and exam tricks.',
      downloads: 528,
      type: 'PDF',
      category: 'CAF',
      tagColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      btnColor: 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/15'
    },
    {
      id: 4,
      tag: 'Firm List',
      title: 'Top CA Firms in Pakistan',
      desc: 'List of top audit, advisory, and accounting firms with addresses and contact details.',
      downloads: 402,
      type: 'PDF',
      category: 'Training/Induction',
      tagColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      btnColor: 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/15'
    }
  ];

  const INITIAL_ALL_RESOURCES = [
    { id: 11, title: 'ICAP Code of Ethics', desc: 'Complete ICAP Code of Ethics handbook for CA students.', date: '22 May 2026', downloads: 188, category: 'CFAP & SCS' },
    { id: 12, title: 'Taxation MCQs with Answers', desc: 'Important MCQs with detailed explanations for CA Final Taxation.', date: '20 May 2026', downloads: 367, category: 'CAF' },
    { id: 13, title: 'IAS - Important Notes', desc: 'Short notes for International Accounting Standards (CA Final).', date: '18 May 2026', downloads: 289, category: 'CFAP & SCS' },
    { id: 14, title: 'Interview Tips & Etiquette', desc: 'Professional tips for CA firm articleship interviews.', date: '16 May 2026', downloads: 315, category: 'Training/Induction' },
    { id: 15, title: 'CA Articleship Checklist', desc: 'Checklist for starting and managing articleship applications.', date: '14 May 2026', downloads: 201, category: 'Training/Induction' },
    { id: 16, title: 'ACCA CV Format Guide', desc: 'Official CV builder guide and guidelines for ACCA students.', date: '10 May 2026', downloads: 142, category: 'ACCA' },
    { id: 17, title: 'Audit Planning Notes', desc: 'Comprehensive revision notes for Audit & Assurance subjects.', date: '05 May 2026', downloads: 495, category: 'CAF' },
    { id: 18, title: 'Big 4 Firms Selection Process', desc: 'A guide explaining selection rounds of major accounting firms.', date: '01 May 2026', downloads: 588, category: 'Training/Induction' },
    { id: 19, title: 'ACCA ATS-Friendly CV Template', desc: 'ATS-compatible curriculum vitae layout tailored specifically for ACCA trainees and affiliates.', date: '30 May 2026', downloads: 189, category: 'ACCA' },
    { id: 20, title: 'Big 4 Trainee CV Template (Word)', desc: 'Professional, recruiter-approved Microsoft Word resume template for CA articleship applications.', date: '28 May 2026', downloads: 422, category: 'Training/Induction' },
    { id: 21, title: 'Executive Finance Resume Layout', desc: 'Minimalist, modern executive layout for qualified CAs/ACCAs targeting corporate jobs.', date: '25 May 2026', downloads: 156, category: 'CFAP & SCS' },
    { id: 22, title: 'KPMG Advisory Prep Handbook', desc: 'Curated technical and behavioral questions asked during KPMG Pakistan Advisory round.', date: '29 May 2026', downloads: 277, category: 'Training/Induction' },
    { id: 23, title: 'PwC Tax & Legal Interview Prep Guide', desc: 'Crucial tax concepts, income tax rules, and local regulations commonly tested in PwC interviews.', date: '26 May 2026', downloads: 305, category: 'Training/Induction' },
    { id: 24, title: 'Deloitte HR & Partner Round Prep', desc: 'Strategy guide and response templates for handling situational questions in Deloitte partner rounds.', date: '23 May 2026', downloads: 412, category: 'Training/Induction' },
    { id: 25, title: 'EY Consulting Case Study Bank', desc: 'Past business case studies and analytical framework questions for EY advisory applications.', date: '21 May 2026', downloads: 215, category: 'Training/Induction' },
    { id: 26, title: 'ICAP Registered Training Firms Directory', desc: 'Complete official list of ICAP authorized training firms in Lahore, Karachi, and Islamabad.', date: '27 May 2026', downloads: 688, category: 'Training/Induction' },
    { id: 27, title: 'Approved ACCA Employers (Pakistan)', desc: 'Directory of gold/platinum approved ACCA employers for completing practical experience.', date: '24 May 2026', downloads: 541, category: 'ACCA' },
    { id: 28, title: 'Non-Big 4 High-Quality Audit Firms', desc: 'Specialized list of mid-tier auditing firms offering excellent learning curves for articleship.', date: '19 May 2026', downloads: 382, category: 'Training/Induction' },
    { id: 29, title: 'CAF Financial Accounting II Quick Revision', desc: 'Consolidated formulas, key ledger mappings, and cheat sheet for CA Intermediate FAR-2.', date: '28 May 2026', downloads: 720, category: 'CAF' },
    { id: 30, title: 'Audit & Assurance (AAA) Exam Guide', desc: 'Important ISA standards checklists and case-based question-answering tips for exams.', date: '24 May 2026', downloads: 611, category: 'ACCA' },
    { id: 31, title: 'Tax Law Cheat Sheets (Finance Act 2024)', desc: 'Quick summary of tax slabs, deductions, and corporate tax guidelines updated for F.A. 2024.', date: '20 May 2026', downloads: 835, category: 'CAF' },
    { id: 32, title: 'ACCA Performance Management Flashcards', desc: 'Detailed revision flashcards for PM (Performance Management) syllabus by qualified mentors.', date: '15 May 2026', downloads: 390, category: 'ACCA' },
    { id: 33, title: 'ICAP Training Regulations Handbook', desc: 'Official guidelines on articleship duration, leaves, transfers, and registry eligibility.', date: '25 May 2026', downloads: 492, category: 'Training/Induction' },
    { id: 34, title: 'ACCA PER Achievement Roadmap', desc: 'Comprehensive guide explaining how to complete your Practical Experience Requirement objectives.', date: '21 May 2026', downloads: 377, category: 'ACCA' },
    { id: 35, title: 'Post-Articleship Corporate Opportunities', desc: 'Career path guide on selecting between audit, tax, commercial finance, or management consulting.', date: '18 May 2026', downloads: 512, category: 'CFAP & SCS' },
    { id: 36, title: 'PRC-5 Introduction to Accounting Revision Notes', desc: 'Syllabus guidelines, double-entry bookkeeping rules, and ledger templates for CA PRC-5.', date: '12 June 2026', downloads: 145, category: 'PRC' },
    { id: 37, title: 'PRC-2 Quantitative Methods Formula Sheet', desc: 'Complete compiled mathematical and statistical formulas sheet for PRC-2 exams.', date: '11 June 2026', downloads: 198, category: 'PRC' },
    { id: 38, title: 'PRC-1 Business Writing & Comprehension Guide', desc: 'Essential grammar rules, business letter formats, and mock exam questions for PRC-1.', date: '08 June 2026', downloads: 120, category: 'PRC' },
    { id: 39, title: 'PRC-3 Principles of Economics Revision Slides', desc: 'Visual summaries of microeconomics and economics concepts for PRC-3.', date: '05 June 2026', downloads: 162, category: 'PRC' }
  ];

  const INITIAL_RESOURCES = [
    ...INITIAL_FEATURED_RESOURCES.map(r => ({ ...r, is_featured: true })),
    ...INITIAL_ALL_RESOURCES.map(r => ({ ...r, is_featured: false }))
  ];

  const [resourcesList] = useState(INITIAL_RESOURCES);

  // Data is now purely static

  const featuredResources = useMemo(() => {
    return resourcesList.filter(item => item.is_featured);
  }, [resourcesList]);

  const allResources = useMemo(() => {
    return resourcesList.filter(item => !item.is_featured);
  }, [resourcesList]);

  const popularDownloads = [
    { title: 'CV Template (CA Student)', downloads: '245 Downloads' },
    { title: 'Audit Interview Q&A', downloads: '310 Downloads' },
    { title: 'Top CA Firms List', downloads: '402 Downloads' },
    { title: 'ICAP Code of Ethics', downloads: '188 Downloads' },
    { title: 'Tax MCQs with Answers', downloads: '367 Downloads' }
  ];

  const handleDownload = (title) => {
    alert(`Starting download for: ${title}\nYour PDF file will be ready in a moment.`);
  };

  const handleSubscribeSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
      alert('Subscribed successfully! You will receive weekly updates of newly added resources.');
    }, 1500);
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    // Static UI only - Request not actually saved to backend
    setRequestSubmitted(true);
    setTimeout(() => {
      setShowRequestModal(false);
      setRequestSubmitted(false);
      alert(`Thank you, ${requestForm.name}!\nYour request for "${requestForm.resourceTitle}" has been received. Our curation team will look into adding it.`);
      setRequestForm({ name: '', resourceTitle: '', category: '', notes: '' });
    }, 1500);
  };

  // Filtered Lists
  const filteredFeatured = featuredResources.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredAll = allResources.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const itemsPerPage = 12;
  const totalItems = filteredAll.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const paginatedAll = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredAll.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAll, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setTimeout(() => {
        const element = document.getElementById('latest-resources-heading');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className="flex-grow bg-bgLight">
      
      {/* ── 1. Premium Hero Header Banner ── */}
      <section className="relative bg-navy text-white pt-20 pb-28 overflow-hidden">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#021b3a_1px,transparent_1px),linear-gradient(to_bottom,#021b3a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none z-0" />
        
        {/* Glow shapes */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-brandGreen/5 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute -bottom-20 left-10 w-[350px] h-[350px] bg-brandGreen/5 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
              <span className="bg-brandGreen/10 border border-brandGreen/25 text-brandGreen text-[11px] font-extrabold tracking-widest px-3 py-1.5 rounded-full uppercase">
                RESOURCES
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
                Everything You Need<br />
                <span className="text-brandGreen">To Build Your CA Career</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-300 max-w-xl font-normal leading-relaxed">
                Access high-quality study materials, career guides, templates, interview questions, firm lists and more – all in one place. 100% Free for CA/ACCA Students.
              </p>

              {/* Functional Search Bar */}
              <div className="w-full max-w-lg relative flex items-center bg-white/5 border border-white/10 rounded-2xl p-1.5 focus-within:border-brandGreen focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-300 mt-2">
                <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search resources (e.g. CV template, MCQs)..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-transparent border-0 text-white placeholder-gray-400 font-semibold text-xs sm:text-sm pl-2.5 focus:outline-none focus:ring-0"
                />
                <button
                  onClick={() => alert(`Searching for: ${searchQuery}`)}
                  className="px-5 py-3.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl font-bold transition-all duration-200 text-xs shrink-0 flex items-center justify-center cursor-pointer shadow-lg shadow-emerald-500/10"
                >
                  Search
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 w-full max-w-2xl border-t border-white/5 pt-8">
                <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3.5 rounded-2xl hover:border-brandGreen/25 transition-colors duration-200">
                  <div className="w-9 h-9 rounded-xl bg-brandGreen/10 flex items-center justify-center border border-brandGreen/20 text-brandGreen shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-white text-sm">500+</span>
                    <span className="text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-wider">Resources</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3.5 rounded-2xl hover:border-brandGreen/25 transition-colors duration-200">
                  <div className="w-9 h-9 rounded-xl bg-brandGreen/10 flex items-center justify-center border border-brandGreen/20 text-brandGreen shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-white text-sm">10+</span>
                    <span className="text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-wider">Categories</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3.5 rounded-2xl hover:border-brandGreen/25 transition-colors duration-200">
                  <div className="w-9 h-9 rounded-xl bg-brandGreen/10 flex items-center justify-center border border-brandGreen/20 text-brandGreen shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-white text-sm">100%</span>
                    <span className="text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-wider">Free Access</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3.5 rounded-2xl hover:border-brandGreen/25 transition-colors duration-200">
                  <div className="w-9 h-9 rounded-xl bg-brandGreen/10 flex items-center justify-center border border-brandGreen/20 text-brandGreen shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-white text-sm">Weekly</span>
                    <span className="text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-wider">Updates</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column Laptop Mockup */}
            <div className="lg:col-span-5 flex justify-center relative pt-8 lg:pt-0">
              <div className="relative group max-w-[420px] w-full">
                {/* Back glowing blur overlay */}
                <div className="absolute -inset-2 bg-brandGreen rounded-3xl blur-2xl opacity-20 group-hover:opacity-35 transition duration-500 pointer-events-none" />
                
                {/* 3D-like Mockup Graphics */}
                <div className="relative rounded-3xl border border-white/10 bg-navy p-4 shadow-2xl flex flex-col items-center">
                  
                  {/* Laptop Screen Area */}
                  <div className="w-full aspect-[16/10] bg-slate-950 rounded-2xl border border-white/15 p-3 flex flex-col justify-between overflow-hidden relative shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-tr from-brandGreen/5 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Fake Header bar */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                      <span className="text-[8px] font-extrabold tracking-wider text-brandGreen uppercase">CA Career Hub</span>
                      <div className="flex space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                      </div>
                    </div>

                    {/* Mock Content */}
                    <div className="my-auto text-left space-y-2 py-4">
                      <span className="text-[9px] font-extrabold text-white uppercase tracking-widest bg-brandGreen/20 px-2 py-0.5 rounded-full">RESOURCES</span>
                      <h3 className="text-sm font-bold text-white tracking-tight leading-snug">Everything You Need<br />To Build Your Career</h3>
                      <div className="flex space-x-2 pt-1">
                        <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[7px] text-gray-300 font-bold uppercase tracking-wider">CV Builder</div>
                        <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[7px] text-gray-300 font-bold uppercase tracking-wider">MCQs</div>
                        <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[7px] text-gray-300 font-bold uppercase tracking-wider">Firm Lists</div>
                      </div>
                    </div>

                    {/* Fake Footer */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-1.5">
                      <span className="text-[7px] text-gray-500">Free download portal</span>
                      <span className="text-[7px] text-brandGreen font-bold flex items-center">
                        Secure SSL <ShieldCheck className="w-2 h-2 ml-0.5" />
                      </span>
                    </div>
                  </div>

                  {/* Keyboard Base Mockup */}
                  <div className="w-[106%] h-3 bg-white/5 border border-white/10 border-t-white/20 rounded-b-2xl -mt-0.5 shadow-2xl relative flex items-center justify-center">
                    <div className="w-16 h-1 bg-white/10 rounded-full -mt-1" />
                  </div>

                  {/* Connected stack of labeled book mockup cards below */}
                  <div className="mt-5 w-full flex flex-col space-y-2 relative">
                    <div className="flex justify-between items-center bg-white/5 border border-white/10 hover:border-brandGreen/45 px-4 py-2.5 rounded-xl transition-all duration-200">
                      <span className="text-xs font-extrabold text-white uppercase tracking-wider">Study Notes</span>
                      <span className="text-[9px] font-bold text-brandGreen bg-brandGreen/10 px-2 py-0.5 rounded-full">30 Files</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 border border-white/10 hover:border-brandGreen/45 px-4 py-2.5 rounded-xl transition-all duration-200">
                      <span className="text-xs font-extrabold text-white uppercase tracking-wider">Career Guides</span>
                      <span className="text-[9px] font-bold text-brandGreen bg-brandGreen/10 px-2 py-0.5 rounded-full">22 Files</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 border border-white/10 hover:border-brandGreen/45 px-4 py-2.5 rounded-xl transition-all duration-200">
                      <span className="text-xs font-extrabold text-white uppercase tracking-wider">Firm Portals</span>
                      <span className="text-[9px] font-bold text-brandGreen bg-brandGreen/10 px-2 py-0.5 rounded-full">18 Files</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. Category Browse Grid ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase mb-2">DIRECTORY</span>
          <h2 className="text-3xl font-extrabold text-navy tracking-tight pb-3 relative">
            Browse Resources by Category
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-brandGreen rounded-full" />
          </h2>
          
          {/* Categories Horizontal Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-12 w-full">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setCurrentPage(1);
                }}
                className={`flex flex-col items-center text-center p-6 bg-white border rounded-3xl transition-all duration-300 cursor-pointer shadow-sm ${
                  selectedCategory === cat.name
                    ? 'border-brandGreen ring-4 ring-emerald-500/5 -translate-y-1'
                    : 'border-gray-100 hover:shadow-md hover:-translate-y-1'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                  selectedCategory === cat.name ? 'bg-brandGreen text-white' : `${cat.bg || 'bg-gray-100'} ${cat.color || 'text-navy'}`
                }`}>
                  {cat.icon}
                </div>
                <h3 className="text-sm font-extrabold text-navy leading-snug mb-1">{cat.name}</h3>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{cat.count} Resources</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Main Split Column Content ── */}
      <section className="py-12 bg-bgLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── LEFT COLUMN: Main Resource Lists ── */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Featured Resources Block */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-extrabold text-navy tracking-tight">Featured Resources</h3>
                </div>

                {filteredFeatured.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-gray-400 font-bold">
                    No featured resources found matching selection.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredFeatured.map((res) => (
                      <div
                        key={res.id}
                        className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
                      >
                        <div className="space-y-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${res.tagColor}`}>
                            {res.tag}
                          </span>
                          <h4 className="text-base font-extrabold text-navy group-hover:text-brandGreen transition-colors duration-200 leading-snug">
                            {res.title}
                          </h4>
                          <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                            {res.desc}
                          </p>
                        </div>

                        <div className="mt-8 pt-4 border-t border-gray-50 flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-xs text-gray-400 font-bold">
                            <span className="flex items-center"><FileText className="w-3.5 h-3.5 mr-1" /> {res.type}</span>
                            <span>•</span>
                            <span className="flex items-center"><Download className="w-3.5 h-3.5 mr-1" /> {res.downloads} Downloads</span>
                          </div>
                          
                          <button
                            onClick={() => handleDownload(res.title)}
                            className={`px-4 py-2.5 text-white text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer shadow-md ${res.btnColor}`}
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Latest Added Resources Block */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 id="latest-resources-heading" className="text-lg sm:text-xl font-extrabold text-navy tracking-tight">Latest Added Resources</h3>
                </div>

                {paginatedAll.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-gray-400 font-bold">
                    No latest resources found.
                  </div>
                ) : (
                  <>
                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm divide-y divide-gray-100">
                      {paginatedAll.map((item) => (
                        <div
                          key={item.id}
                          className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors duration-200"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/5 border border-brandGreen/10 flex items-center justify-center text-brandGreen shrink-0 mt-0.5">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="font-extrabold text-navy text-sm sm:text-base leading-snug">{item.title}</span>
                              <span className="text-xs text-gray-400 font-semibold mt-1">{item.desc}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 border-t border-gray-50 pt-3 sm:pt-0 sm:border-0">
                            <div className="flex flex-col sm:items-end text-left sm:text-right text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                              <span>{item.date}</span>
                              <span className="text-gray-400 font-medium mt-0.5">{item.downloads} Downloads</span>
                            </div>
                            
                            <button
                              onClick={() => handleDownload(item.title)}
                              className="p-2.5 rounded-xl border border-gray-200 hover:border-brandGreen hover:bg-emerald-500/5 text-gray-400 hover:text-brandGreen transition-all duration-200 cursor-pointer flex items-center justify-center"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center space-x-2.5 pt-8">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="p-2 bg-white border border-gray-200 hover:border-brandGreen hover:text-brandGreen rounded-xl text-navy transition-colors disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-navy cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-9 h-9 font-bold text-xs rounded-xl transition-all duration-200 cursor-pointer ${
                              currentPage === page
                                ? 'bg-brandGreen text-white shadow-md shadow-emerald-500/25'
                                : 'bg-white border border-gray-200 hover:border-brandGreen text-navy hover:text-brandGreen'
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="p-2 bg-white border border-gray-200 hover:border-brandGreen hover:text-brandGreen rounded-xl text-navy transition-colors disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-navy cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Banner Card */}
              <div className="bg-gradient-to-r from-navy to-[#052347] border border-white/5 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="absolute -left-16 -bottom-16 w-52 h-52 rounded-full bg-white/5 border-4 border-white/5 pointer-events-none" />
                <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5 border border-white/5 pointer-events-none" />
                
                <div className="flex items-center space-x-5 z-10 text-left">
                  <div className="w-14 h-14 rounded-2xl bg-brandGreen/10 border border-brandGreen/25 flex items-center justify-center text-brandGreen shrink-0 shadow-lg shadow-emerald-500/10">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <h4 className="text-lg font-extrabold tracking-tight">All Resources are 100% Free</h4>
                    <p className="text-xs text-gray-400 font-semibold leading-relaxed max-w-md">
                      We believe in supporting CA/ACCA students with top-quality files, sheets, templates and templates to elevate preparation and careers.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                  className="z-10 px-6 py-4 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl font-bold transition-all duration-200 text-xs shadow-lg shadow-emerald-500/20 whitespace-nowrap flex items-center justify-center"
                >
                  Explore All Resources <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              </div>

            </div>

            {/* ── RIGHT COLUMN: Sidebar Blocks ── */}
            <div className="lg:col-span-4 space-y-8">

              {/* Popular Downloads */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5 text-left">
                <h4 className="text-sm font-extrabold text-navy uppercase tracking-wider pb-3 border-b border-gray-50">
                  Popular Downloads
                </h4>
                <div className="space-y-4">
                  {popularDownloads.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleDownload(item.title)}
                      className="flex items-center space-x-3.5 cursor-pointer group hover:bg-gray-50/50 p-1.5 rounded-xl transition-all"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/5 flex items-center justify-center text-brandGreen group-hover:bg-brandGreen group-hover:text-white transition-colors shrink-0">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-navy text-xs group-hover:text-brandGreen transition-colors leading-snug">{item.title}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{item.downloads}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                  className="w-full py-3 bg-gray-50 hover:bg-brandGreen hover:text-white border border-gray-100 hover:border-brandGreen text-navy text-xs font-bold rounded-xl transition-all duration-200"
                >
                  View All Downloads
                </button>
              </div>

              {/* Need a Resource? */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4 text-left">
                <h4 className="text-sm font-extrabold text-navy uppercase tracking-wider pb-3 border-b border-gray-50">
                  Need a Resource?
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                  Can't find the notes, books, CV layouts, or prep guides you need? Let us know and we'll try to source it.
                </p>
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-navy to-[#052347] hover:from-[#052347] hover:to-navy text-white text-xs font-extrabold rounded-xl transition-all duration-200 cursor-pointer shadow-md shadow-slate-900/10 flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request a Resource</span>
                </button>
              </div>

              {/* Stay Updated Newsletter */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4 text-left">
                <h4 className="text-sm font-extrabold text-navy uppercase tracking-wider pb-3 border-b border-gray-50">
                  Stay Updated
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                  Get instant email alerts when new resources, folders, and study files are compiled.
                </p>
                <form onSubmit={handleSubscribeSubmit} className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200/80 rounded-xl text-xs font-semibold focus:outline-none focus:border-brandGreen focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-200"
                  />
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-brandGreen hover:bg-brandGreen-dark text-white text-xs font-extrabold rounded-xl transition-all duration-200 shadow-md shadow-emerald-500/10 uppercase tracking-wider"
                  >
                    Subscribe Now
                  </button>
                </form>
              </div>

              {/* We're Here to Help */}
              <div className="bg-gradient-to-br from-navy/5 to-[#052347]/[0.02] border border-gray-100 rounded-3xl p-6 shadow-sm text-left flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-brandGreen/10 flex items-center justify-center text-brandGreen">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-extrabold text-navy">We're Here to Help</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                    Have questions about any CA notes, guides or need custom counseling?
                  </p>
                  <button
                    onClick={() => {
                      if (setActiveTab) {
                        setActiveTab('Counseling');
                        window.location.hash = '#guidance';
                      } else {
                        alert("Redirecting to Counseling Page...");
                      }
                    }}
                    className="flex items-center text-xs font-bold text-brandGreen hover:text-brandGreen-dark transition-colors group"
                  >
                    Ask a Question <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── Request Resource Modal ── */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-navy/70 backdrop-blur-md flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-[0_20px_50px_rgba(2,27,58,0.15)] border border-gray-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-300">
            
            {/* Close button */}
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-navy transition-all duration-200 z-20 flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 rotate-90" />
            </button>

            {/* Modal Header */}
            <div className="p-6 pb-2 text-left shrink-0">
              <span className="text-[10px] font-bold text-brandGreen tracking-widest uppercase bg-emerald-500/10 px-2.5 py-1 rounded-full">
                Suggest Files
              </span>
              <h3 className="text-xl font-bold text-navy mt-3">Request a Resource</h3>
              <p className="text-xs text-gray-400 mt-1 font-semibold leading-relaxed">
                Tell us what notes, guides, templates, or files you need.
              </p>
            </div>

            {/* Modal Body form */}
            <form onSubmit={handleRequestSubmit} className="px-6 pb-6 pt-2 space-y-4 bg-white overflow-y-auto flex-grow max-h-[calc(90vh-140px)]">
              
              {/* Name */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Hammad Ahmed"
                  required
                  value={requestForm.name}
                  onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/80 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-brandGreen focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-200 placeholder:text-gray-300 text-navy"
                />
              </div>

              {/* Resource Title */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Resource Title</label>
                <input
                  type="text"
                  placeholder="e.g. Advanced Auditing Checklist"
                  required
                  value={requestForm.resourceTitle}
                  onChange={(e) => setRequestForm({ ...requestForm, resourceTitle: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/80 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-brandGreen focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-200 placeholder:text-gray-300 text-navy"
                />
              </div>

              {/* Category selector */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Category</label>
                <select
                  required
                  value={requestForm.category}
                  onChange={(e) => setRequestForm({ ...requestForm, category: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/80 rounded-xl text-xs sm:text-sm font-semibold text-navy focus:outline-none focus:border-brandGreen focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-200"
                >
                  <option value="" className="text-gray-300">Select a category</option>
                  <option value="PRC">PRC</option>
                  <option value="CAF">CAF</option>
                  <option value="Training/Induction">Training/Induction</option>
                  <option value="CFAP & SCS">CFAP & SCS</option>
                  <option value="ACCA">ACCA</option>
                </select>
              </div>

              {/* Notes */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Any Notes / Details</label>
                <textarea
                  rows="3"
                  placeholder="Enter any details about the resource, link, or specific standards needed..."
                  value={requestForm.notes}
                  onChange={(e) => setRequestForm({ ...requestForm, notes: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200/80 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-brandGreen focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-200 placeholder:text-gray-300 text-navy resize-none"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={requestSubmitted}
                className="w-full py-3.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-extrabold rounded-xl text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:translate-y-0 text-center flex items-center justify-center space-x-2 uppercase tracking-wider"
              >
                {requestSubmitted ? 'Submitting...' : 'Submit Request'}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
