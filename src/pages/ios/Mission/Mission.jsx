import { useEffect } from 'react';
import {
  Users,
  Award,
  Globe,
  Briefcase,
  Heart,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  MessageSquare,
  FileCheck,
  Rocket,
  Mail
} from 'lucide-react';

const Linkedin = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Twitter = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

// Import assets
import missionHero from '../../../assets/mission_hero.png';
import mentorImage from '../../../assets/mentor_portrait.png';
import iramFatima from '../../../assets/iram_fatima.png';
import mBilal from '../../../assets/m_bilal.png';
import ayeshaKhan from '../../../assets/ayesha_khan.png';
import hassanRaza from '../../../assets/hassan_raza.png';
import usmanSaleem from '../../../assets/usman_saleem.png';

export default function Mission() {

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const values = [
    {
      title: 'Student First',
      desc: 'Every decision we make is focused on the success and growth of students.',
      icon: <GraduationCap className="w-6 h-6 text-brandGreen" />
    },
    {
      title: 'Integrity',
      desc: "We believe in honesty, transparency and doing what's right.",
      icon: <ShieldCheck className="w-6 h-6 text-brandGreen" />
    },
    {
      title: 'Empowerment',
      desc: 'We empower students with knowledge, guidance and opportunities.',
      icon: <Users className="w-6 h-6 text-brandGreen" />
    },
    {
      title: 'Quality',
      desc: 'We provide high-quality resources and guidance you can trust.',
      icon: <BookOpen className="w-6 h-6 text-brandGreen" />
    },
    {
      title: 'Community',
      desc: 'We build a supportive community where students learn and grow together.',
      icon: <Users className="w-6 h-6 text-brandGreen" />
    }
  ];

  const teamMembers = [
    {
      name: 'Saboor Ahmad',
      role: 'Founder & Lead Mentor',
      tags: ['CA', 'ACCA'],
      desc: 'Passionate about guiding the next generation of finance professionals in Pakistan.',
      image: mentorImage,
      linkedin: '#',
      email: 'saboor@thetaxmanscapital.com',
      twitter: '#'
    },
    {
      name: 'Iram Fatima',
      role: 'Counseling Head',
      tags: ['CA Finalist'],
      desc: 'Helping students navigate career options, find their path, and achieve success.',
      image: iramFatima,
      linkedin: '#',
      email: 'iram@thetaxmanscapital.com',
      twitter: '#'
    },
    {
      name: 'M. Bilal',
      role: 'Community Manager',
      tags: ['ACCA Member'],
      desc: 'Building a supportive space for accounting and finance aspirants nationwide.',
      image: mBilal,
      linkedin: '#',
      email: 'bilal@thetaxmanscapital.com',
      twitter: '#'
    },
    {
      name: 'Ayesha Khan',
      role: 'Resource Curator',
      tags: ['CA Intermediate'],
      desc: 'Ensuring students have access to top-notch study materials and guides.',
      image: ayeshaKhan,
      linkedin: '#',
      email: 'ayesha@thetaxmanscapital.com',
      twitter: '#'
    },
    {
      name: 'Hassan Raza',
      role: 'Career Support Lead',
      tags: ['CA Finalist'],
      desc: 'Connecting talented candidates with leading professional firms and employers.',
      image: hassanRaza,
      linkedin: '#',
      email: 'hassan@thetaxmanscapital.com',
      twitter: '#'
    },
    {
      name: 'Usman Ali',
      role: 'Tech & Operations Lead',
      tags: ['ACCA Affiliate'],
      desc: 'Keeping the platform running smoothly and accessible to all students.',
      image: usmanSaleem,
      linkedin: '#',
      email: 'usman@thetaxmanscapital.com',
      twitter: '#'
    }
  ];

  return (
    <div className="flex-grow bg-bgLight">

      {/* ── 1. Hero Section ── */}
      <section className="relative bg-navy text-white pt-24 pb-28 overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#021b3a_1px,transparent_1px),linear-gradient(to_bottom,#021b3a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
              <span className="bg-brandGreen/10 text-brandGreen text-[11px] font-extrabold tracking-widest px-3 py-1.5 rounded-full uppercase">
                OUR MISSION
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
                Guiding Today,<br />
                <span className="text-brandGreen">Building Tomorrow</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-300 max-w-xl font-normal leading-relaxed">
                We are on a mission to empower every CA/ACCA student in Pakistan with the right guidance, resources, and opportunities to build successful and meaningful careers.
              </p>

              {/* 4 Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 w-full max-w-xl">
                <div className="flex items-start space-x-3 bg-white/5 border border-white/10 p-4 rounded-2xl hover:border-brandGreen/30 transition-colors duration-200">
                  <div className="w-10 h-10 rounded-xl bg-brandGreen/10 flex items-center justify-center border border-brandGreen/20 text-brandGreen shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-white text-sm">100% Free</span>
                    <span className="text-xs text-gray-400 mt-0.5 font-semibold leading-relaxed">All our services are completely free</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white/5 border border-white/10 p-4 rounded-2xl hover:border-brandGreen/30 transition-colors duration-200">
                  <div className="w-10 h-10 rounded-xl bg-brandGreen/10 flex items-center justify-center border border-brandGreen/20 text-brandGreen shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-white text-sm">Student Focused</span>
                    <span className="text-xs text-gray-400 mt-0.5 font-semibold leading-relaxed">Everything we do is for students</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white/5 border border-white/10 p-4 rounded-2xl hover:border-brandGreen/30 transition-colors duration-200">
                  <div className="w-10 h-10 rounded-xl bg-brandGreen/10 flex items-center justify-center border border-brandGreen/20 text-brandGreen shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-white text-sm">Accessible for All</span>
                    <span className="text-xs text-gray-400 mt-0.5 font-semibold leading-relaxed">Reaching every corner of Pakistan</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white/5 border border-white/10 p-4 rounded-2xl hover:border-brandGreen/30 transition-colors duration-200">
                  <div className="w-10 h-10 rounded-xl bg-brandGreen/10 flex items-center justify-center border border-brandGreen/20 text-brandGreen shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-white text-sm">Stronger Together</span>
                    <span className="text-xs text-gray-400 mt-0.5 font-semibold leading-relaxed">Building a supportive CA community</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column — Image */}
            <div className="lg:col-span-5 flex justify-center relative pt-8 lg:pt-0">
              <div className="relative group max-w-[440px] w-full">
                <div className="absolute -inset-2 bg-brandGreen rounded-3xl blur-xl opacity-20 group-hover:opacity-35 transition duration-500 pointer-events-none" />
                <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/3] bg-navy">
                  <img
                    src={missionHero}
                    alt="Students collaborating"
                    className="w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. Mission Statement ── */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase mb-2">WHAT DRIVES US</span>
          <h2 className="text-3xl font-extrabold text-navy tracking-tight mb-6">Our Mission Statement</h2>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-semibold max-w-2xl">
            To guide, support, and empower CA &amp; ACCA students by providing free career guidance, quality resources, and real opportunities, helping them build successful careers and become future leaders of Pakistan.
          </p>
          <div className="w-16 h-1 bg-brandGreen rounded-full mt-6" />
        </div>
      </section>

      {/* ── 3. Core Values ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase mb-8">OUR CORE VALUES</span>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0 w-full border border-gray-100 rounded-3xl overflow-hidden shadow-sm bg-white">
            {values.map((v, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-8 bg-white relative hover:bg-gray-50/50 transition-colors duration-200 md:border-r border-gray-100 last:border-r-0 border-b md:border-b-0 last:border-b-0"
              >
                <div className="w-14 h-14 rounded-full border border-brandGreen/20 flex items-center justify-center bg-emerald-500/5 mb-5 shadow-sm">
                  {v.icon}
                </div>
                <h3 className="text-base font-extrabold text-navy mb-3 tracking-wide">{v.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-semibold">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Vision & Impact ── */}
      <section id="our-impact-section" className="py-24 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

            {/* Vision Card */}
            <div id="our-vision" className="lg:col-span-5 flex">
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 rounded-3xl p-8 border border-emerald-500/20 shadow-2xl flex flex-col justify-between w-full min-h-[420px] transition-all duration-300 hover:scale-[1.01] hover:shadow-emerald-500/10 hover:shadow-2xl group">
                
                {/* Glowing radial gradient overlays */}
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:opacity-75 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:opacity-75 transition-opacity duration-500" />
                
                {/* Textured background overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(rgba(16,185,129,0.08)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-60 pointer-events-none" />

                <div className="flex flex-col items-start text-left relative z-10">
                  <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-4">
                    <Rocket className="w-3.5 h-3.5 text-brandGreen animate-pulse" />
                    <span className="text-brandGreen text-[10px] font-black tracking-widest uppercase">OUR VISION</span>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 mb-4 leading-tight">
                    Shaping the Future <br />of Pakistan's Professionals
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-emerald-100/80 font-medium leading-relaxed mb-6">
                    We envision a Pakistan where every CA &amp; ACCA student, regardless of background or location, has equal access to guidance, resources, and opportunities to achieve their dreams.
                  </p>
                  
                  {/* Vision Pillars/Points */}
                  <div className="space-y-3 w-full">
                    <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3 rounded-2xl hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-200 group/item">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-brandGreen font-black text-xs shrink-0 group-hover/item:scale-110 transition-transform duration-200">
                        01
                      </div>
                      <span className="text-xs font-semibold text-gray-200">Equal Opportunity for Remote Students</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3 rounded-2xl hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-200 group/item">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-brandGreen font-black text-xs shrink-0 group-hover/item:scale-110 transition-transform duration-200">
                        02
                      </div>
                      <span className="text-xs font-semibold text-gray-200">100% Free Counseling &amp; Mentorship</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3 rounded-2xl hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-200 group/item">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-brandGreen font-black text-xs shrink-0 group-hover/item:scale-110 transition-transform duration-200">
                        03
                      </div>
                      <span className="text-xs font-semibold text-gray-200">Seamless Transition to Corporate Roles</span>
                    </div>
                  </div>
                </div>

                <div className="relative mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-400 font-bold group-hover:text-emerald-300 transition-colors duration-200 z-10">
                  <span>Empowerment through action</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </div>

            {/* Impact Card */}
            <div className="lg:col-span-7 flex">
              <div className="bg-navy rounded-3xl p-8 border border-white/5 shadow-xl text-white flex flex-col justify-between w-full">
                <div className="flex flex-col items-start text-left mb-6">
                  <span className="text-brandGreen text-[11px] font-extrabold tracking-widest uppercase mb-2">OUR IMPACT</span>
                  <h3 className="text-2xl font-extrabold tracking-tight mt-1">Making a Real Difference</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-auto">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brandGreen shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xl sm:text-2xl font-black leading-tight">10,000+</span>
                      <span className="text-xs font-bold text-brandGreen">Students Guided</span>
                      <span className="text-[10px] text-gray-400 mt-0.5 font-medium">Across Pakistan &amp; Globally</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brandGreen shrink-0">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xl sm:text-2xl font-black leading-tight">1,000+</span>
                      <span className="text-xs font-bold text-brandGreen">Resources Shared</span>
                      <span className="text-[10px] text-gray-400 mt-0.5 font-medium">High-quality study material</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brandGreen shrink-0">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xl sm:text-2xl font-black leading-tight">500+</span>
                      <span className="text-xs font-bold text-brandGreen">Opportunities Shared</span>
                      <span className="text-[10px] text-gray-400 mt-0.5 font-medium">Jobs, articleships &amp; more</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brandGreen shrink-0">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xl sm:text-2xl font-black leading-tight">∞</span>
                      <span className="text-xs font-bold text-brandGreen">Free Guidance</span>
                      <span className="text-[10px] text-gray-400 mt-0.5 font-medium">Always free, always for you</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5. Commitment ── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-emerald-500/[0.03] border border-brandGreen/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-brandGreen/10 flex items-center justify-center border border-brandGreen/20 text-brandGreen shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-brandGreen text-[10px] font-extrabold tracking-widest uppercase">OUR COMMITMENT</span>
                <h4 className="text-base sm:text-lg font-extrabold text-navy">We are committed to walking with you on your journey.</h4>
                <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
                  From your first step to your dream career, we are here to guide, support, and celebrate your success every step of the way.
                </p>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-brandGreen/10 flex items-center justify-center border border-brandGreen/20 text-brandGreen shrink-0">
              <Heart className="w-6 h-6 fill-current animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Our Team ── */}
      <section id="our-team" className="py-24 bg-gray-50/60 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">

          {/* Section header */}
          <span className="text-brandGreen text-xs tracking-widest font-extrabold uppercase mb-2">WHO WE ARE</span>
          <h2 className="text-3xl font-extrabold text-navy tracking-tight mb-3">Our Team</h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-lg font-semibold leading-relaxed text-center mb-16">
            A passionate team of CA professionals and mentors dedicated to guiding students.
          </p>

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Portrait */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {/* Green tint on hover */}
                  <div className="absolute inset-0 bg-brandGreen/0 group-hover:bg-brandGreen/10 transition-colors duration-300 pointer-events-none" />
                </div>

                {/* Info */}
                <div className="p-6 flex flex-col items-center text-center flex-grow">
                  <h3 className="text-lg font-extrabold text-navy group-hover:text-brandGreen transition-colors duration-200 mb-1">
                    {member.name}
                  </h3>
                  <span className="text-xs font-extrabold text-brandGreen uppercase tracking-wider mb-2">
                    {member.role}
                  </span>

                  {/* Qualification badges */}
                  <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                    {member.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="text-[10px] font-bold text-gray-400 border border-gray-200 px-2.5 py-0.5 rounded-full uppercase bg-gray-50 tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-gray-400 font-semibold leading-relaxed mb-6 max-w-[220px]">
                    {member.desc}
                  </p>

                  {/* Social links */}
                  <div className="mt-auto flex items-center justify-center space-x-3">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      id={`linkedin-${idx}`}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brandGreen hover:border-brandGreen hover:bg-emerald-500/5 transition-all duration-200"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      id={`email-${idx}`}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brandGreen hover:border-brandGreen hover:bg-emerald-500/5 transition-all duration-200"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      id={`twitter-${idx}`}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brandGreen hover:border-brandGreen hover:bg-emerald-500/5 transition-all duration-200"
                    >
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CTA Banner ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-navy border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -left-16 -bottom-16 w-52 h-52 rounded-full bg-white/5 border-4 border-white/5 pointer-events-none" />
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5 border border-white/5 pointer-events-none" />

            <div className="flex items-center space-x-4 z-10 text-left">
              <div className="w-12 h-12 rounded-2xl bg-brandGreen/10 flex items-center justify-center border border-brandGreen/20 shrink-0">
                <Rocket className="w-6 h-6 text-brandGreen" />
              </div>
              <div className="flex flex-col space-y-1">
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">Let's Build Your Successful Future Together</h3>
                <p className="text-xs sm:text-sm text-gray-400 font-semibold leading-relaxed">
                  Join thousands of CA &amp; ACCA students who are already growing with us.
                </p>
              </div>
            </div>

            <div className="z-10 w-full sm:w-auto shrink-0">
              <button
                onClick={() => {
                  const element = document.getElementById('our-impact-section');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl font-bold transition-all duration-200 text-xs shadow-lg shadow-emerald-500/20 group cursor-pointer"
              >
                Explore Opportunities
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
