import { useState } from 'react';
import {
  Users,
  FileText,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Star,
  Award,
  Building,
  GraduationCap,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  X,
  Target,
  Briefcase
} from 'lucide-react';
import mentorPortrait from '../../../assets/mentor_portrait.png';
import usmanSaleem from '../../../assets/usman_saleem.png';
import hassanRaza from '../../../assets/hassan_raza.png';
import aliIqbal from '../../../assets/ali_iqbal.png';
import mentorsDiscussing from '../../../assets/mentors_discussing.png';
import counselingHeroBg from '../../../assets/counseling_hero_bg.png';

const SERVICES = [
  {
    title: 'Career Roadmap',
    desc: 'Get a step-by-step plan for CA / ACCA from experts.',
    icon: <GraduationCap className="w-6 h-6 text-brandGreen" />,
    bg: 'bg-emerald-50',
    detailedDesc: 'Our expert mentors will map out a customized, step-by-step career path for you, outlining key milestones, exam strategies, and technical skills needed to land top-tier roles.',
    points: [
      'Comprehensive timeline of ICAP & ACCA milestones from entry to final levels.',
      'Strategic study plans, subject grouping tips, and mock exam strategies.',
      'Analysis of firm types (Big 4 vs SMPs) and departmental scopes (Audit vs Tax).',
      'Career mapping for international qualifications and global corporate pathways.'
    ]
  },
  {
    title: 'CV & Resume Review',
    desc: 'Improve your CV and make a strong impression.',
    icon: <FileText className="w-6 h-6 text-brandGreen" />,
    bg: 'bg-emerald-50',
    detailedDesc: 'Get your resume vetted by mentors who have directly guided hundreds of students to secure Big 4 placements. We help you highlight your strengths and make your profile stand out.',
    points: [
      'Recruiter-proven professional formats matching industry standards.',
      'Optimizing content with relevant keywords for ATS (Applicant Tracking Systems).',
      'Proper phrasing of achievements, academic records, and software skills.',
      'Detailed recommendations on fixing structure, layout, and phrasing errors.'
    ]
  },
  {
    title: 'Interview Preparation',
    desc: 'Learn common questions, techniques and tips.',
    icon: <Users className="w-6 h-6 text-brandGreen" />,
    bg: 'bg-emerald-50',
    detailedDesc: 'Build your confidence and master the techniques needed to crack manager and partner-round interviews. We provide structured training on handling difficult questions.',
    points: [
      'Compilations of actual questions asked in PwC, EY, KPMG, and Deloitte.',
      'Coaching on behavioral questions using the STAR response technique.',
      'Body language, communication delivery, and confident posture training.',
      'Preparation for firm-specific admission tests and presentation rounds.'
    ]
  },
  {
    title: 'Articleship Guidance',
    desc: 'Find articleship opportunities and application tips.',
    icon: <Building className="w-6 h-6 text-brandGreen" />,
    bg: 'bg-emerald-50',
    detailedDesc: 'Navigating articleship induction cycles can be complex. We share real-time updates and guidance on training registries, department selections, and firm culture.',
    points: [
      'Tracking induction cycles and portal registration timelines for CA/ACCA.',
      'Insights into department operations: Assurance, Advisory, Tax, and Risk.',
      'Step-by-step guidance on registry paperwork for ICAP/ACCA training agreements.',
      'Strategies for securing internships and converting them to articleships.'
    ]
  },
  {
    title: 'Personal Mentorship',
    desc: 'One-on-one guidance for your career and studies.',
    icon: <Award className="w-6 h-6 text-brandGreen" />,
    bg: 'bg-emerald-50',
    detailedDesc: 'Connect one-on-one with a dedicated senior mentor for personalized coaching tailored to your academic progress, professional goals, and career struggles.',
    points: [
      'Direct, scheduled calls with qualified CA and ACCA professionals.',
      'Exam stress management, time planning, and custom revision schedules.',
      'Personalized goal-setting for corporate and industrial placement paths.',
      'Long-term advice on transitions, career changes, and self-branding.'
    ]
  }
];

const MENTORS = [
  {
    name: 'Saboor Ahmad',
    credentials: 'CA, ACCA',
    role: 'Career Counselor & Mentor',
    experience: '10+ Years Experience',
    image: mentorPortrait
  },
  {
    name: 'Usman Saleem',
    credentials: 'CA, CFA',
    role: 'Audit & Assurance Expert',
    experience: '8+ Years Experience',
    image: usmanSaleem
  },
  {
    name: 'Hassan Raza',
    credentials: 'CA, ACCA',
    role: 'Taxation & Advisory Expert',
    experience: '7+ Years Experience',
    image: hassanRaza
  },
  {
    name: 'Ali Iqbal',
    credentials: 'ACCA',
    role: 'Finance & Career Mentor',
    experience: '8+ Years Experience',
    image: aliIqbal
  }
];

const TESTIMONIALS = [
  {
    quote: "The guidance I received helped me secure articleship in a Big 4 firm. Highly recommended!",
    name: "Ayesha Khan",
    role: "ACCA Student",
    stars: 5,
    avatar: "AK"
  },
  {
    quote: "Amazing mentors! They helped me improve my CV and crack interviews. Very grateful!",
    name: "Bilal Ahmed",
    role: "CA Intermediate",
    stars: 5,
    avatar: "BA"
  },
  {
    quote: "Best platform for CA/ACCA students in Pakistan. Completely FREE and full of opportunities.",
    name: "Hina Fatima",
    role: "CA Finalist",
    stars: 5,
    avatar: "HF"
  }
];

const FAQS = [
  {
    q: "Is this service really free?",
    a: "Yes, 100% free! Our mission is to support the CA & ACCA community in Pakistan. There are no hidden charges, service fees, or premium upsells."
  },
  {
    q: "Who can book a counseling session?",
    a: "Any student currently pursuing CA (PRC, CAF, CFAP) or ACCA, as well as recent graduates seeking articleships or job placements."
  },
  {
    q: "How long is each session?",
    a: "A standard interactive mentorship session typically lasts 25 to 30 minutes, allowing you ample time to get detailed answers to your questions."
  },
  {
    q: "What topics can I discuss?",
    a: "You can discuss anything related to your career: CV formatting, interview preparation, selecting a training firm, exam planning, or industry career paths."
  },
  {
    q: "How can I book a session?",
    a: "Simply click the 'Book a Session' button, fill out the request form, and select your preferred counseling category. Our team will contact you via email to schedule your slot."
  }
];

export default function Counseling() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('book'); // 'book' or 'ask'
  const [selectedService, setSelectedService] = useState('');
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    level: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState(null);

  const openModal = (type, serviceTitle = '') => {
    setModalType(type);
    setSelectedService(serviceTitle);
    setIsModalOpen(true);
    setSubmitted(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      alert(`Thank you for reaching out!\n\nYour request has been received. Our team will review your query and get back to you at ${formState.email} within 24-48 hours.`);
      setFormState({
        name: '',
        email: '',
        level: '',
        message: ''
      });
      setSubmitted(false);
    }, 1200);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="flex-grow bg-bgLight">
      {/* 1. Hero Section */}
      <section
        className="bg-navy text-white pt-16 pb-24 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(2, 27, 58, 0.95), rgba(2, 27, 58, 0.92)), url(${counselingHeroBg})`,
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
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-block px-3 py-1 bg-brandGreen/10 border border-brandGreen/25 rounded-full text-xs font-bold text-brandGreen tracking-wide">
                FREE FOR CA & ACCA STUDENTS
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Completely FREE <br />
                <span className="text-brandGreen">Career Guidance</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-300 max-w-xl font-normal leading-relaxed">
                We are here to help CA & ACCA students at every step of their journey. Get personalized guidance from experienced mentors and take the right steps towards a successful career.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <button
                  onClick={() => openModal('book')}
                  className="flex items-center justify-center px-6 py-4 bg-brandGreen hover:bg-brandGreen-dark text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 group cursor-pointer text-sm"
                >
                  <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Book a Session
                </button>
                <button
                  onClick={() => openModal('ask')}
                  className="flex items-center justify-center px-6 py-4 border border-white/30 hover:border-white hover:bg-white/5 text-white font-bold rounded-xl transition-all duration-200 group cursor-pointer text-sm"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Ask a Question
                </button>
              </div>

              {/* Badges checklist */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-xs text-gray-200 font-bold border-t border-white/5">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-brandGreen/20 flex items-center justify-center text-brandGreen shrink-0 font-extrabold">✓</span>
                  <span>100% Free</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-brandGreen/20 flex items-center justify-center text-brandGreen shrink-0 font-extrabold">✓</span>
                  <span>Expert Mentors</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-brandGreen/20 flex items-center justify-center text-brandGreen shrink-0 font-extrabold">✓</span>
                  <span>Personalized Guidance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-brandGreen/20 flex items-center justify-center text-brandGreen shrink-0 font-extrabold">✓</span>
                  <span>Student Focused</span>
                </div>
              </div>
            </div>

            {/* Hero Right Graphic Container */}
            <div className="lg:col-span-5 flex justify-center relative pt-8 lg:pt-0">
              <div className="relative w-full max-w-sm sm:max-w-md">
                
                {/* SVG connection lines for dashboard mockup */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden sm:block" viewBox="0 0 500 500">
                  <path d="M 120 180 C 150 150, 280 150, 310 180" fill="none" stroke="#00C853" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.6" />
                  <path d="M 100 340 C 140 380, 240 380, 320 340" fill="none" stroke="#00C853" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.6" />
                  <path d="M 400 240 H 420" fill="none" stroke="#00C853" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.6" />
                  <path d="M 70 260 H 90" fill="none" stroke="#00C853" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.6" />
                </svg>

                {/* Central portrait image with premium custom styling */}
                <div className="relative mx-auto w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden border-4 border-brandGreen shadow-2xl z-10 bg-navy-dark">
                  <img
                    src={mentorsDiscussing}
                    alt="Career guidance session"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/70 via-transparent to-transparent" />
                </div>

                {/* Floating connected cards around the central portrait */}
                {/* Badge 1: Top Left */}
                <div className="absolute -top-4 -left-4 sm:-left-8 bg-navy-dark/95 border border-white/10 p-3 rounded-2xl shadow-xl flex items-center space-x-2.5 z-20 hover:-translate-y-1 transition-transform">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-brandGreen">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-white">Career Roadmap</h4>
                    <p className="text-[9px] text-gray-400">Plan your journey the smart way</p>
                  </div>
                </div>

                {/* Badge 2: Mid Left */}
                <div className="absolute top-[65%] -left-8 sm:-left-12 bg-navy-dark/95 border border-white/10 p-3 rounded-2xl shadow-xl flex items-center space-x-2.5 z-20 hover:-translate-y-1 transition-transform">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-white">Resume Review</h4>
                    <p className="text-[9px] text-gray-400">Get professional feedback</p>
                  </div>
                </div>

                {/* Badge 3: Top Right */}
                <div className="absolute top-[10%] -right-4 sm:-right-8 bg-navy-dark/95 border border-white/10 p-3 rounded-2xl shadow-xl flex items-center space-x-2.5 z-20 hover:-translate-y-1 transition-transform">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-white">Interview Tips</h4>
                    <p className="text-[9px] text-gray-400">Prepare and ace interviews</p>
                  </div>
                </div>

                {/* Badge 4: Bottom Right */}
                <div className="absolute bottom-[5%] -right-4 sm:-right-8 bg-navy-dark/95 border border-white/10 p-3 rounded-2xl shadow-xl flex items-center space-x-2.5 z-20 hover:-translate-y-1 transition-transform">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-white">Articleship Guidance</h4>
                    <p className="text-[9px] text-gray-400">Find the best opportunities</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. How We Can Help You Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
          <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase mb-2">OUR SERVICES</span>
          <h2 className="text-3xl font-extrabold text-navy tracking-tight pb-3 relative">
            How We Can Help You
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-brandGreen rounded-full" />
          </h2>
        </div>

        {/* 5 services cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {SERVICES.map((srv, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedServiceForDetail(srv)}
              className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl ${srv.bg} flex items-center justify-center mb-5 group-hover:bg-brandGreen/10 transition-colors`}>
                  {srv.icon}
                </div>
                <h3 className="font-extrabold text-navy text-base sm:text-lg mb-2 group-hover:text-brandGreen transition-colors leading-snug">
                  {srv.title}
                </h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
                  {srv.desc}
                </p>
              </div>
              <span className="inline-flex items-center text-xs font-bold text-brandGreen group-hover:translate-x-1 transition-transform">
                Learn More <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Why Choose Us? Section */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side checklist */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl font-extrabold text-navy tracking-tight">
                Why Choose Us?
              </h2>
              
              <div className="space-y-4">
                {[
                  'Experienced CA & ACCA Mentors',
                  '100% Free for Students',
                  'Personalized One-on-One Support',
                  'Practical Career Advice',
                  'Focus on Your Success'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-sm font-semibold text-textColor">
                    <span className="w-5 h-5 rounded-full bg-brandGreen/15 flex items-center justify-center text-brandGreen font-bold shrink-0 text-xs">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side stats grid */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-center space-y-1.5 shadow-sm">
                <span className="text-3xl sm:text-4xl font-black text-navy leading-none">5000+</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Students Guided</span>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-center space-y-1.5 shadow-sm">
                <span className="text-3xl sm:text-4xl font-black text-navy leading-none">50+</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Expert Mentors</span>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-center space-y-1.5 shadow-sm">
                <span className="text-3xl sm:text-4xl font-black text-navy leading-none">1000+</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sessions Conducted</span>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-center space-y-1.5 shadow-sm">
                <div className="flex items-center space-x-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-navy leading-none">4.9/5</span>
                  <Star className="w-6 h-6 text-brandGreen fill-brandGreen shrink-0" />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Student Satisfaction</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Simple Steps to Get Guidance Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
          <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase mb-2">HOW IT WORKS</span>
          <h2 className="text-3xl font-extrabold text-navy tracking-tight pb-3 relative">
            Simple Steps to Get Guidance
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-brandGreen rounded-full" />
          </h2>
        </div>

        {/* Horizontal workflow steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-4 relative group">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-brandGreen/25 flex items-center justify-center transition-colors group-hover:bg-brandGreen/10">
              <Calendar className="w-6 h-6 text-brandGreen" />
            </div>
            <div>
              <h3 className="font-extrabold text-navy text-base">1. Book a Session</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1 max-w-[200px]">
                Choose a time slot that works for you.
              </p>
            </div>
            <div className="hidden md:block absolute top-6 -right-4 text-gray-300 font-black text-xl">→</div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-4 relative group">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-brandGreen/25 flex items-center justify-center transition-colors group-hover:bg-brandGreen/10">
              <Users className="w-6 h-6 text-brandGreen" />
            </div>
            <div>
              <h3 className="font-extrabold text-navy text-base">2. Meet Your Mentor</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1 max-w-[200px]">
                Connect with our expert mentor.
              </p>
            </div>
            <div className="hidden md:block absolute top-6 -right-4 text-gray-300 font-black text-xl">→</div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-4 relative group">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-brandGreen/25 flex items-center justify-center transition-colors group-hover:bg-brandGreen/10">
              <MessageSquare className="w-6 h-6 text-brandGreen" />
            </div>
            <div>
              <h3 className="font-extrabold text-navy text-base">3. Get Guidance</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1 max-w-[200px]">
                Discuss your goals and get personalized advice.
              </p>
            </div>
            <div className="hidden md:block absolute top-6 -right-4 text-gray-300 font-black text-xl">→</div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center space-y-4 relative group">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-brandGreen/25 flex items-center justify-center transition-colors group-hover:bg-brandGreen/10">
              <Target className="w-6 h-6 text-brandGreen" />
            </div>
            <div>
              <h3 className="font-extrabold text-navy text-base">4. Achieve Success</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1 max-w-[200px]">
                Take action and build your future.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Learn From Experienced Professionals Section */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
            <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase mb-2">OUR MENTORS</span>
            <h2 className="text-3xl font-extrabold text-navy tracking-tight pb-3 relative">
              Learn From Experienced Professionals
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-brandGreen rounded-full" />
            </h2>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {MENTORS.map((m, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center p-6 text-center group"
              >
                {/* Photo container */}
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 group-hover:border-brandGreen transition-colors duration-300 mb-5 shadow-inner bg-gray-50">
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h3 className="font-extrabold text-navy text-lg leading-tight group-hover:text-brandGreen transition-colors">
                  {m.name}
                </h3>
                <span className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider block">
                  {m.credentials}
                </span>
                <p className="text-xs font-semibold text-gray-500 mt-2 leading-relaxed">
                  {m.role}
                </p>

                {/* Experience Badge */}
                <div className="mt-4 pt-3 border-t border-gray-50 w-full flex items-center justify-center text-[10px] font-bold text-brandGreen">
                  <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                  <span>{m.experience}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => { window.location.hash = '#team'; }}
              className="px-6 py-3 border border-brandGreen text-brandGreen hover:bg-brandGreen hover:text-white rounded-xl font-bold transition-colors cursor-pointer text-xs uppercase tracking-wider"
            >
              View All Mentors →
            </button>
          </div>
        </div>
      </section>

      {/* 6. Success Stories Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
          <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase mb-2">WHAT STUDENTS SAY</span>
          <h2 className="text-3xl font-extrabold text-navy tracking-tight pb-3 relative">
            Success Stories
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-brandGreen rounded-full" />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex space-x-1 text-amber-400 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current animate-pulse" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center space-x-3.5 border-t border-gray-50 pt-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brandGreen to-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                  {t.avatar}
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-navy text-xs sm:text-sm leading-none">{t.name}</span>
                  <span className="text-[10px] text-brandGreen font-bold mt-1 leading-none">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center space-x-2 mt-10">
          <span className="w-5 h-1.5 rounded-full bg-brandGreen"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
        </div>
      </section>

      {/* 7. Have Questions? We've Got Answers Section */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
            <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase mb-2">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="text-3xl font-extrabold text-navy tracking-tight pb-3 relative">
              Have Questions? We've Got Answers
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-brandGreen rounded-full" />
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* FAQ Accordion on the left */}
            <div className="lg:col-span-8 space-y-4">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-6 py-4.5 font-extrabold text-navy text-sm sm:text-base flex items-center justify-between hover:text-brandGreen transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {activeFaq === idx ? (
                      <ChevronUp className="w-5 h-5 text-brandGreen shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                    )}
                  </button>
                  
                  {activeFaq === idx && (
                    <div className="px-6 pb-5 border-t border-gray-50 pt-4 text-xs sm:text-sm text-gray-500 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Box on the right */}
            <div className="lg:col-span-4 bg-navy text-white rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xl relative overflow-hidden flex flex-col justify-between h-full min-h-[300px]">
              {/* background design circles */}
              <div className="absolute -right-16 -top-16 w-40 h-40 bg-white/5 border border-white/5 rounded-full pointer-events-none" />
              <div className="absolute -left-16 -bottom-16 w-40 h-40 bg-white/5 border border-white/5 rounded-full pointer-events-none" />

              <div className="relative z-10 space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-brandGreen" />
                </div>
                
                <h3 className="text-xl font-extrabold tracking-tight">Still have questions?</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                  Ask anything about your career, studies or opportunities.
                </p>
              </div>

              <div className="relative z-10 pt-8">
                <button
                  onClick={() => openModal('ask')}
                  className="w-full py-3.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-extrabold rounded-xl text-xs transition-colors flex items-center justify-center cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  Ask a Question →
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Join community banner */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16 pt-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-navy border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -left-16 -bottom-16 w-52 h-52 rounded-full bg-white/5 border border-white/5 pointer-events-none" />
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5 border border-white/5 pointer-events-none" />
            
            <div className="flex items-center space-x-4 z-10">
              <div className="w-12 h-12 rounded-2xl bg-brandGreen/10 flex items-center justify-center border border-brandGreen/20 shrink-0">
                <Users className="w-6 h-6 text-brandGreen" />
              </div>
              <div className="flex flex-col space-y-1 text-left">
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">Join Our Free CA & ACCA Student Community</h3>
                <p className="text-xs sm:text-sm text-gray-400 font-semibold leading-relaxed">
                  Connect, learn and grow with thousands of students across Pakistan.
                </p>
              </div>
            </div>

            <div className="z-10 w-full sm:w-auto shrink-0">
              <a
                href="#communities"
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl font-bold transition-all duration-200 text-xs shadow-lg shadow-emerald-500/20"
              >
                Join Community →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Booking / Query Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-navy/70 backdrop-blur-md flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-[0_20px_50px_rgba(2,27,58,0.15)] border border-gray-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-300">
            
            {/* Minimalist Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-navy transition-all duration-200 z-20 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header - Clean & Minimalist */}
            <div className="p-6 pb-2 text-left shrink-0">
              <span className="text-[10px] font-bold text-brandGreen tracking-widest uppercase bg-emerald-500/10 px-2.5 py-1 rounded-full">
                {modalType === 'book' ? 'Free Mentorship' : 'Q&A Support'}
              </span>
              <h3 className="text-xl font-bold text-navy mt-3">
                {modalType === 'book' ? 'Book a Counseling Session' : 'Ask a Career Question'}
              </h3>
              <p className="text-xs text-gray-400 mt-1 font-medium leading-relaxed">
                {selectedService ? `Category: ${selectedService}` : 'Get personalized career guidance from CA & ACCA experts.'}
              </p>
            </div>

            {/* Modal Body - Clean scrollable form */}
            <form onSubmit={handleFormSubmit} className="px-6 pb-6 pt-2 space-y-4 bg-white overflow-y-auto flex-grow max-h-[calc(90vh-140px)]">
              
              {/* Name Input */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Usama Khan"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/80 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-brandGreen focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-200 placeholder:text-gray-300 text-navy"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. usama@example.com"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/80 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-brandGreen focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-200 placeholder:text-gray-300 text-navy"
                />
              </div>

              {/* Level select */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Qualification Level</label>
                <div className="relative">
                  <select
                    required
                    value={formState.level}
                    onChange={(e) => setFormState({ ...formState, level: e.target.value })}
                    className="w-full px-4 pr-10 py-3 bg-gray-50/50 border border-gray-200/80 rounded-xl text-xs sm:text-sm font-semibold text-navy focus:outline-none focus:border-brandGreen focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-200 appearance-none"
                  >
                    <option value="" className="text-gray-300">Select qualification level</option>
                    <option value="PRC">PRC / Entry Level</option>
                    <option value="CA Intermediate">CA Intermediate (CAF)</option>
                    <option value="CA Finalist">CA Finalist (CFAP)</option>
                    <option value="ACCA Student">ACCA Student</option>
                    <option value="Qualified">Qualified CA/ACCA</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center justify-center">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                  {modalType === 'book' ? 'Topic Details' : 'Describe your query'}
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder={modalType === 'book' ? 'What specific goals or challenges would you like to discuss?' : 'Write your question in detail...'}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200/80 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-brandGreen focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-200 placeholder:text-gray-300 text-navy resize-none"
                />
              </div>

              {/* Secure Notice */}
              <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-bold py-2 px-3 bg-emerald-500/5 rounded-xl border border-brandGreen/10 text-left">
                <ShieldCheck className="w-4 h-4 text-brandGreen flex-shrink-0" />
                <span>100% Free guidance. Your data is kept private.</span>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={submitted}
                className="w-full py-3.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-extrabold rounded-xl text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:translate-y-0 text-center flex items-center justify-center space-x-2 uppercase tracking-wider"
              >
                {submitted ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>{modalType === 'book' ? 'Confirm Booking Slot' : 'Submit My Query'}</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      )}

      {/* 10. Service Details Modal Popup */}
      {selectedServiceForDetail && (
        <div className="fixed inset-0 bg-navy/70 backdrop-blur-md flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-[0_20px_50px_rgba(2,27,58,0.15)] border border-gray-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-300">
            
            {/* Minimalist Close Button */}
            <button
              onClick={() => setSelectedServiceForDetail(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-navy transition-all duration-200 z-20 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="p-6 pb-2 text-left shrink-0">
              <span className="text-[10px] font-bold text-brandGreen tracking-widest uppercase bg-emerald-500/10 px-2.5 py-1 rounded-full">
                Service Details
              </span>
              <div className="flex items-center space-x-3 mt-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  {selectedServiceForDetail.icon}
                </div>
                <h3 className="text-xl font-bold text-navy">
                  {selectedServiceForDetail.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 pb-6 pt-3 space-y-5 bg-white overflow-y-auto flex-grow text-left">
              <div className="space-y-2">
                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Overview</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  {selectedServiceForDetail.detailedDesc}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Key Highlights</h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 font-semibold">
                  {selectedServiceForDetail.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle2 className="w-4.5 h-4.5 text-brandGreen mr-2.5 mt-0.5 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Booking Redirection CTA */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => {
                    const serviceTitle = selectedServiceForDetail.title;
                    setSelectedServiceForDetail(null);
                    openModal('book', serviceTitle);
                  }}
                  className="flex-grow py-3 bg-brandGreen hover:bg-brandGreen-dark text-white font-extrabold rounded-xl text-xs sm:text-sm transition-all duration-200 cursor-pointer text-center flex items-center justify-center space-x-2 uppercase tracking-wider shadow-md shadow-emerald-500/10"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Counseling Session</span>
                </button>
                <button
                  onClick={() => setSelectedServiceForDetail(null)}
                  className="py-3 px-5 border border-gray-200 hover:bg-gray-50 text-navy font-extrabold rounded-xl text-xs sm:text-sm transition-all duration-200 cursor-pointer text-center"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
