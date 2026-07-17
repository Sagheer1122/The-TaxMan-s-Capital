import { useState, useRef } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Globe,
  Sparkles
} from 'lucide-react';
import contactHeadset from '../../../assets/contact_headset.png';
import pakistanMap from '../../../assets/pakistan_map.png';

export default function Contact() {
  // Contact Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  // Ref to form for smooth scroll
  const formRef = useRef(null);

  const faqs = [
    {
      q: 'How can I get career guidance?',
      a: 'You can book a 1-on-1 counseling session with our expert mentors through the Career Support page, or submit a request on our contact form under the "Career Guidance" category.'
    },
    {
      q: 'Do you help with articleship placements?',
      a: 'Yes! We actively post the latest articleship vacancies at Big 4 and other reputable firms in Pakistan under our Inductions section. We also provide ATS-friendly CV templates and partner-level interview prep guides.'
    },
    {
      q: 'How can I join the student community?',
      a: 'You can join our active WhatsApp community rooms by visiting the Community section on our platform. We have dedicated channels for PRC, CAF, CFAP, and ACCA students.'
    },
    {
      q: 'What are your support hours?',
      a: 'Our standard helpline and email support hours are Monday through Saturday, from 10:00 AM to 7:00 PM. However, you can submit inquiries via the contact form or email 24/7, and our team will get back to you within 24 hours.'
    },
    {
      q: 'How can I receive updates?',
      a: 'You can subscribe to our weekly newsletter by entering your email in the footer. You will receive updates about the latest jobs, inductions, and study materials directly in your inbox.'
    },
    {
      q: 'Can I request one-on-one counseling?',
      a: 'Absolutely! Our lead mentor, Saboor Ahmad, along with other industry experts, conducts periodic one-on-one resume review and career evaluation sessions. Keep an eye on our Announcements tab to sign up for the next slot.'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network delay for static UI
    await new Promise(resolve => setTimeout(resolve, 800));

    setIsSubmitting(false);
    setIsSuccess(true);
    setForm({
      name: '',
      email: '',
      phone: '',
      subject: '',
      category: 'General Inquiry',
      message: ''
    });
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen bg-navy-dark text-white flex flex-col font-sans selection:bg-brandGreen selection:text-white">
      
      {/* ── 1. Hero & Message Form Section (Navy-Dark Theme with Brand Green Accents) ── */}
      <section className="relative pt-12 pb-24 overflow-hidden border-b border-brandGreen/10 bg-[radial-gradient(ellipse_at_top_right,rgba(0,200,83,0.08),transparent_50%)] text-left">
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Glowing brandGreen backdrops */}
        <div className="absolute top-24 right-[-10%] w-[500px] h-[500px] bg-brandGreen/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] bg-brandGreen/3 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Side Content & Information */}
            <div className="lg:col-span-5 flex flex-col space-y-8 mt-4">
              <div>
                <span className="inline-block bg-brandGreen/10 border border-brandGreen/30 text-brandGreen text-xs font-extrabold tracking-[0.2em] px-3.5 py-1.5 rounded-full uppercase mb-4 shadow-[0_0_15px_rgba(0,200,83,0.1)]">
                  CONTACT US
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                  We're Here to Help <br />
                  <span className="bg-gradient-to-r from-brandGreen to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(0,200,83,0.15)]">You Succeed</span>
                </h1>
                <p className="text-base sm:text-lg text-gray-400 mt-4 leading-relaxed max-w-lg font-light">
                  Have a question, suggestion, or need support? Our team is ready to assist CA, ACCA and finance students across Pakistan.
                </p>
              </div>

              {/* Information Cards */}
              <div className="space-y-4 max-w-md">
                
                {/* Phone Card */}
                <div className="group flex items-start space-x-4 bg-white/[0.02] border border-white/5 hover:border-brandGreen/30 p-5 rounded-2xl transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-0.5">
                  <div className="w-12 h-12 rounded-xl bg-brandGreen/10 flex items-center justify-center border border-brandGreen/25 text-brandGreen group-hover:scale-105 transition-all shadow-[0_0_10px_rgba(0,200,83,0.05)]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Call Us</span>
                    <span className="text-white font-extrabold text-base mt-0.5 group-hover:text-brandGreen transition-colors">+92 300 1234567</span>
                    <span className="text-xs text-gray-500 mt-0.5 font-medium">Mon - Sat (10:00 AM - 7:00 PM)</span>
                  </div>
                </div>

                {/* Email Card */}
                <div className="group flex items-start space-x-4 bg-white/[0.02] border border-white/5 hover:border-brandGreen/30 p-5 rounded-2xl transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-0.5">
                  <div className="w-12 h-12 rounded-xl bg-brandGreen/10 flex items-center justify-center border border-brandGreen/25 text-brandGreen group-hover:scale-105 transition-all shadow-[0_0_10px_rgba(0,200,83,0.05)]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Us</span>
                    <span className="text-white font-extrabold text-base mt-0.5 group-hover:text-brandGreen transition-colors break-all">support@thetaxmanscapital.com</span>
                    <span className="text-xs text-gray-500 mt-0.5 font-medium">Response within 24 hours</span>
                  </div>
                </div>

                {/* Location Card */}
                <div className="group flex items-start space-x-4 bg-white/[0.02] border border-white/5 hover:border-brandGreen/30 p-5 rounded-2xl transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-0.5">
                  <div className="w-12 h-12 rounded-xl bg-brandGreen/10 flex items-center justify-center border border-brandGreen/25 text-brandGreen group-hover:scale-105 transition-all shadow-[0_0_10px_rgba(0,200,83,0.05)]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Visit Us</span>
                    <span className="text-white font-extrabold text-base mt-0.5">Lahore, Pakistan</span>
                    <a 
                      href="#locations" 
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('locations')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-brandGreen hover:text-brandGreen-light font-bold text-xs mt-1.5 flex items-center group/link"
                    >
                      View all office locations
                      <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover/link:translate-x-0.5" />
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Side - Interactive Form & 3D Image */}
            <div className="lg:col-span-7 flex flex-col relative w-full lg:pl-4">
              
              {/* Premium 3D Headset graphic floating behind/beside the card */}
              <div className="absolute right-[-10%] top-[-10%] w-60 h-60 opacity-20 pointer-events-none select-none blur-[2px] hidden xl:block animate-pulse">
                <img src={contactHeadset} alt="3D Headset Illustration" className="w-full h-full object-contain" />
              </div>

              {/* Form Container Card with Glassmorphic Navy Style */}
              <div 
                ref={formRef}
                className="w-full bg-navy/85 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(0,200,83,0.03)] hover:border-brandGreen/20 transition-all duration-500 relative"
              >
                
                {/* Decorative brandGreen accent bars */}
                <div className="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-brandGreen to-transparent" />
                
                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent flex items-center">
                  <Sparkles className="w-5 h-5 text-brandGreen mr-2 shrink-0" />
                  Send Us A Message
                </h3>
                <div className="h-[1px] bg-white/5 my-5" />

                {isSuccess ? (
                  <div className="py-12 px-6 flex flex-col items-center justify-center space-y-4 text-center">
                     <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-white">Message Sent Successfully!</h4>
                    <p className="text-xs sm:text-sm text-gray-400 max-w-sm">
                      Thank you for contacting us. Our team has received your query and will reply to your email address shortly.
                    </p>
                    <button 
                      onClick={() => setIsSuccess(false)}
                      className="mt-4 px-5 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white text-xs font-bold rounded-xl transition-all shadow-[0_4px_12px_rgba(0,200,83,0.15)]"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Full Name */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest pl-1">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Your Name"
                          required
                          value={form.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-brandGreen focus:bg-white/[0.05] focus:ring-4 focus:ring-brandGreen/5 transition-all text-white placeholder-gray-600"
                        />
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Your Email"
                          required
                          value={form.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-brandGreen focus:bg-white/[0.05] focus:ring-4 focus:ring-brandGreen/5 transition-all text-white placeholder-gray-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Phone Number */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest pl-1">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="e.g. +92 300 1234567"
                          value={form.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-brandGreen focus:bg-white/[0.05] focus:ring-4 focus:ring-brandGreen/5 transition-all text-white placeholder-gray-600"
                        />
                      </div>

                      {/* Subject */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest pl-1">Subject</label>
                        <input
                          type="text"
                          name="subject"
                          placeholder="Message Subject"
                          required
                          value={form.subject}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-brandGreen focus:bg-white/[0.05] focus:ring-4 focus:ring-brandGreen/5 transition-all text-white placeholder-gray-600"
                        />
                      </div>
                    </div>

                    {/* Category Dropdown */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest pl-1">Category</label>
                      <div className="relative">
                        <select
                          name="category"
                          value={form.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-brandGreen focus:bg-white/[0.05] focus:ring-4 focus:ring-brandGreen/5 transition-all text-white appearance-none cursor-pointer"
                        >
                          <option value="General Inquiry" className="bg-navy-dark text-white">General Inquiry</option>
                          <option value="Career Guidance" className="bg-navy-dark text-white">Career Guidance</option>
                          <option value="Jobs & Inductions" className="bg-navy-dark text-white">Jobs & Inductions</option>
                          <option value="Community Support" className="bg-navy-dark text-white">Community Support</option>
                          <option value="Technical Support" className="bg-navy-dark text-white">Technical Support</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Message Text Area */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest pl-1">Your Message</label>
                      <textarea
                        name="message"
                        rows="4"
                        placeholder="Write your query or message details here..."
                        required
                        value={form.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-brandGreen focus:bg-white/[0.05] focus:ring-4 focus:ring-brandGreen/5 transition-all text-white placeholder-gray-600 resize-none animate-none"
                      />
                    </div>

                    {/* Button and Info */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brandGreen to-emerald-400 hover:from-emerald-400 hover:to-brandGreen text-white font-extrabold text-xs tracking-wider rounded-xl transition-all duration-300 shadow-lg shadow-brandGreen/15 hover:shadow-brandGreen/25 hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2 shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center space-x-2 text-gray-500 text-[10px] font-medium leading-tight">
                        <ShieldCheck className="w-4 h-4 text-brandGreen shrink-0" />
                        <span>We respect your privacy.<br />Your information is safe with us.</span>
                      </div>
                    </div>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>
      
      {/* ── 2. Office Locations Section (Light Background / White Area) ── */}
      <section id="locations" className="py-24 bg-white text-navy-dark border-b border-gray-100 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Side: Office Cards */}
            <div className="lg:col-span-6 flex flex-col space-y-8">
              <div>
                <span className="text-brandGreen text-xs font-extrabold tracking-[0.2em] uppercase">OUR NETWORK</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight mt-2 pb-3 relative">
                  Our <span className="text-brandGreen">Office</span> Locations
                  <span className="absolute bottom-0 left-0 w-16 h-1 bg-brandGreen rounded-full" />
                </h2>
                <p className="text-gray-500 mt-4 text-sm sm:text-base font-light">
                  Visit us at our nearest office. Feel free to drop by for queries and guidance.
                </p>
              </div>

              {/* Office Locations Checklist */}
              <div className="space-y-6">
                
                {/* 1. Lahore Card */}
                <div className="bg-gray-50 border border-gray-100 hover:border-brandGreen/35 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-brandGreen/10 flex items-center justify-center text-brandGreen shrink-0 border border-brandGreen/20 mt-1">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <h4 className="font-extrabold text-navy text-base leading-snug">Lahore Head Office</h4>
                      <p className="text-xs text-gray-500 font-semibold mt-1">123-A, Main Boulevard, DHA Phase 6, Lahore, Pakistan</p>
                      <span className="text-[11px] text-gray-400 mt-1.5 flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-brandGreen" /> Mon - Sat (10:00 AM - 7:00 PM)</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert('Redirecting to Google Maps for Lahore Office...')}
                    className="px-4 py-2 border border-gray-200 hover:border-brandGreen/40 text-brandGreen hover:bg-brandGreen/5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Get Directions
                  </button>
                </div>

                {/* 2. Karachi Card */}
                <div className="bg-gray-50 border border-gray-100 hover:border-brandGreen/35 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-brandGreen/10 flex items-center justify-center text-brandGreen shrink-0 border border-brandGreen/20 mt-1">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <h4 className="font-extrabold text-navy text-base leading-snug">Karachi Office</h4>
                      <p className="text-xs text-gray-500 font-semibold mt-1">Office # 201, 2nd Floor, Clifton, Karachi, Pakistan</p>
                      <span className="text-[11px] text-gray-400 mt-1.5 flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-brandGreen" /> Mon - Sat (10:00 AM - 7:00 PM)</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert('Redirecting to Google Maps for Karachi Office...')}
                    className="px-4 py-2 border border-gray-200 hover:border-brandGreen/40 text-brandGreen hover:bg-brandGreen/5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Get Directions
                  </button>
                </div>

                {/* 3. Islamabad Card */}
                <div className="bg-gray-50 border border-gray-100 hover:border-brandGreen/35 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-brandGreen/10 flex items-center justify-center text-brandGreen shrink-0 border border-brandGreen/20 mt-1">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <h4 className="font-extrabold text-navy text-base leading-snug">Islamabad Office</h4>
                      <p className="text-xs text-gray-500 font-semibold mt-1">Office # 402, 4th Floor, F-10 Markaz, Islamabad, Pakistan</p>
                      <span className="text-[11px] text-gray-400 mt-1.5 flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-brandGreen" /> Mon - Sat (10:00 AM - 7:00 PM)</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert('Redirecting to Google Maps for Islamabad Office...')}
                    className="px-4 py-2 border border-gray-200 hover:border-brandGreen/40 text-brandGreen hover:bg-brandGreen/5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Get Directions
                  </button>
                </div>

              </div>
            </div>

            {/* Right Side: Map illustration */}
            <div className="lg:col-span-6 relative flex justify-center w-full">
              <div className="relative border border-gray-200 p-2.5 rounded-3xl bg-gray-50/50 shadow-xl overflow-hidden max-w-lg w-full">
                
                {/* Pakistan Map Background */}
                <img src={pakistanMap} alt="Pakistan Locations Map" className="w-full h-auto rounded-2xl object-cover opacity-85" />
                
                {/* Map Pins absolute layers */}
                
                {/* Islamabad Pin */}
                <div 
                  className="absolute left-[58%] top-[13%] flex items-center space-x-1 group/pin cursor-pointer"
                  onClick={() => alert('Islamabad Office\nOffice # 402, 4th Floor, F-10 Markaz, Islamabad')}
                >
                  <div className="w-4 h-4 rounded-full bg-navy-dark border-2 border-white flex items-center justify-center animate-bounce shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-brandGreen" />
                  </div>
                  <div className="bg-navy-dark border border-white/10 text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow-lg opacity-90 transition-opacity">
                    Islamabad Office
                  </div>
                </div>

                {/* Lahore Pin */}
                <div 
                  className="absolute left-[56%] top-[37%] flex items-center space-x-1 group/pin cursor-pointer"
                  onClick={() => alert('Lahore Head Office\n123-A, Main Boulevard, DHA Phase 6, Lahore')}
                >
                  <div className="w-4 h-4 rounded-full bg-brandGreen border-2 border-white flex items-center justify-center animate-bounce shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <div className="bg-brandGreen border border-white/20 text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow-lg opacity-95 transition-opacity">
                    Lahore Head Office
                  </div>
                </div>

                {/* Karachi Pin */}
                <div 
                  className="absolute left-[28%] top-[78%] flex items-center space-x-1 group/pin cursor-pointer"
                  onClick={() => alert('Karachi Office\nOffice # 201, 2nd Floor, Clifton, Karachi')}
                >
                  <div className="w-4 h-4 rounded-full bg-navy-dark border-2 border-white flex items-center justify-center animate-bounce shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-brandGreen" />
                  </div>
                  <div className="bg-navy-dark border border-white/10 text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow-lg opacity-90 transition-opacity">
                    Karachi Office
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Quick Support Options (Get in Touch in Other Ways - White Background Area) ── */}
      <section className="py-24 bg-white text-navy-dark border-b border-gray-100 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <span className="text-brandGreen text-xs font-extrabold tracking-[0.2em] uppercase mb-2">OTHER CHANNELS</span>
          <h2 className="text-3xl font-extrabold text-navy tracking-tight pb-3 relative">
            Get in <span className="text-brandGreen">Touch</span> in Other Ways
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-brandGreen rounded-full" />
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 w-full">
            
            {/* WhatsApp Support Card */}
            <div className="bg-gray-50 border border-gray-100 hover:border-brandGreen/35 p-6 rounded-3xl flex flex-col items-center text-center justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-brandGreen/10 flex items-center justify-center text-brandGreen mb-5 border border-brandGreen/20">
                  <MessageSquare className="w-5.5 h-5.5" />
                </div>
                <h4 className="font-extrabold text-navy text-base">WhatsApp Support</h4>
                <p className="text-gray-400 text-xs mt-2 font-medium">Chat with us for quick help and student registration guidelines.</p>
              </div>
              <button 
                onClick={() => alert('Redirecting to WhatsApp support chat...')}
                className="mt-6 w-full py-2.5 border border-brandGreen text-brandGreen hover:bg-brandGreen hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Chat on WhatsApp
              </button>
            </div>

            {/* Email Support Card */}
            <div className="bg-gray-50 border border-gray-100 hover:border-brandGreen/35 p-6 rounded-3xl flex flex-col items-center text-center justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-brandGreen/10 flex items-center justify-center text-brandGreen mb-5 border border-brandGreen/20">
                  <Mail className="w-5.5 h-5.5" />
                </div>
                <h4 className="font-extrabold text-navy text-base">Email Support</h4>
                <p className="text-gray-400 text-xs mt-2 font-medium">Drop us an email anytime. We resolve technical queries rapidly.</p>
              </div>
              <button 
                onClick={() => alert('Opening mail composer to support@thetaxmanscapital.com...')}
                className="mt-6 w-full py-2.5 border border-brandGreen text-brandGreen hover:bg-brandGreen hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Send Email
              </button>
            </div>

            {/* Call Support Card */}
            <div className="bg-gray-50 border border-gray-100 hover:border-brandGreen/35 p-6 rounded-3xl flex flex-col items-center text-center justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-brandGreen/10 flex items-center justify-center text-brandGreen mb-5 border border-brandGreen/20">
                  <Phone className="w-5.5 h-5.5" />
                </div>
                <h4 className="font-extrabold text-navy text-base">Call Support</h4>
                <p className="text-gray-400 text-xs mt-2 font-medium">Speak directly with our support team regarding admissions or vacancies.</p>
              </div>
              <button 
                onClick={() => alert('Dialing +92 300 1234567...')}
                className="mt-6 w-full py-2.5 border border-brandGreen text-brandGreen hover:bg-brandGreen hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Call Now
              </button>
            </div>

            {/* Social Media Support Card */}
            <div className="bg-gray-50 border border-gray-100 hover:border-brandGreen/35 p-6 rounded-3xl flex flex-col items-center text-center justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center w-full">
                <div className="w-12 h-12 rounded-2xl bg-brandGreen/10 flex items-center justify-center text-brandGreen mb-5 border border-brandGreen/20">
                  <Globe className="w-5.5 h-5.5" />
                </div>
                <h4 className="font-extrabold text-navy text-base">Connect on Social</h4>
                <p className="text-gray-400 text-xs mt-2 font-medium">Follow us for real-time announcements, induction news, and posts.</p>
              </div>
              
              {/* Social Icons inside Support Card */}
              <div className="flex items-center justify-center space-x-2.5 mt-6 w-full">
                <button 
                  onClick={() => alert('Opening Facebook...')}
                  className="w-9 h-9 rounded-full bg-navy/[0.04] border border-gray-200 hover:border-brandGreen hover:bg-brandGreen/10 hover:text-brandGreen text-gray-500 flex items-center justify-center transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                  </svg>
                </button>
                <button 
                  onClick={() => alert('Opening Instagram...')}
                  className="w-9 h-9 rounded-full bg-navy/[0.04] border border-gray-200 hover:border-brandGreen hover:bg-brandGreen/10 hover:text-brandGreen text-gray-500 flex items-center justify-center transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </button>
                <button 
                  onClick={() => alert('Opening LinkedIn...')}
                  className="w-9 h-9 rounded-full bg-navy/[0.04] border border-gray-200 hover:border-brandGreen hover:bg-brandGreen/10 hover:text-brandGreen text-gray-500 flex items-center justify-center transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </button>
                <button 
                  onClick={() => alert('Opening YouTube...')}
                  className="w-9 h-9 rounded-full bg-navy/[0.04] border border-gray-200 hover:border-brandGreen hover:bg-brandGreen/10 hover:text-brandGreen text-gray-500 flex items-center justify-center transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.029 0 12 0 12s0 3.971.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.475 20.455 12 20.455 12 20.455s7.524 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.971 24 12 24 12s0-3.971-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. Frequently Asked Questions Section (Accordion Style - White Background) ── */}
      <section className="py-24 bg-white text-navy-dark border-b border-gray-100 text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <span className="text-brandGreen text-xs font-extrabold tracking-[0.2em] uppercase mb-2">HAVE QUESTIONS?</span>
          <h2 className="text-3xl font-extrabold text-navy tracking-tight pb-3 relative">
            Frequently Asked <span className="text-brandGreen">Questions</span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-brandGreen rounded-full" />
          </h2>

          <div className="mt-12 w-full space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="border border-gray-150 rounded-2xl overflow-hidden transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-extrabold text-navy hover:text-brandGreen transition-colors focus:outline-none"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-brandGreen shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 ml-4" />
                  )}
                </button>

                {/* Smooth Expandable Answer */}
                <div 
                  className={`overflow-hidden transition-all duration-300 text-left ${
                    openFaq === idx ? 'max-h-48 border-t border-gray-150 bg-white' : 'max-h-0'
                  }`}
                >
                  <div className="p-6 text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CTA Section (Navy-Dark Banner with Brand Green Accents) ── */}
      <section className="py-10 bg-navy-dark relative overflow-hidden border-b border-brandGreen/10">
        
        {/* Subtle patterned brandGreen grids */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,200,83,0.04),transparent_60%)] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left text-left">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-brandGreen/10 border border-brandGreen/35 flex items-center justify-center text-brandGreen shadow-[0_0_20px_rgba(0,200,83,0.05)] shrink-0 hidden sm:flex">
              <Mail className="w-5.5 h-5.5" />
            </div>
            <div className="flex flex-col space-y-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Still have questions?</h3>
              <p className="text-xs text-gray-400 font-light max-w-sm">
                Our team is happy to help. Send us an inquiry, and we'll reply as quickly as possible.
              </p>
            </div>
          </div>
          
          <div className="shrink-0 flex flex-col items-center md:items-end space-y-2">
            <button
              onClick={scrollToForm}
              className="px-6 py-3 bg-gradient-to-r from-brandGreen to-emerald-400 hover:from-emerald-400 hover:to-brandGreen text-white font-extrabold text-xs tracking-wider rounded-xl transition-all duration-300 shadow-lg shadow-brandGreen/15 hover:shadow-brandGreen/25 flex items-center space-x-2 shrink-0 cursor-pointer"
            >
              <span>Send Us A Message</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-[10px] text-gray-500 font-medium tracking-wide">We'll get back to you as soon as possible.</span>
          </div>
        </div>
      </section>

    </div>
  );
}