import { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  BookOpen,
  Users,
  User,
  Briefcase,
  Globe,
  Award
} from 'lucide-react';
import { loginUser, registerUser } from '../../../services/authService';
import logoImg from '../../../assets/logo.png';
import TermsAndPrivacyModal from '../../../components/legal/TermsAndPrivacyModal';

export default function Login({ onLoginSuccess, onBack, startFlipped = false, onSignUpRedirect, onLoginRedirect }) {
  const [isFlipped, setIsFlipped] = useState(startFlipped);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Sign Up Form States
  const [signUpName, setSignUpName] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [policyModalTab, setPolicyModalTab] = useState('terms');

  // Global Actions States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Clear errors when toggling forms or typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg('');
      setSuccessMsg('');
    }, 0);
    return () => clearTimeout(timer);
  }, [isFlipped, loginEmail, loginPassword, signUpEmail, signUpPassword, confirmPassword, signUpUsername, signUpName]);

  // Sync state if startFlipped prop changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipped(startFlipped);
    }, 0);
    return () => clearTimeout(timer);
  }, [startFlipped]);

  // Login Handler -> Leads to Home Portal
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const session = await loginUser(loginEmail, loginPassword, rememberMe);

      setSuccessMsg('Welcome back! Entering Home Portal...');
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(session);
        }
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sign Up Handler -> Smoothly transitions to Login view (No direct dashboard bypass)
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!signUpName || !signUpUsername || !signUpEmail || !signUpPassword || !confirmPassword) {
      setErrorMsg('Please fill in all registration fields.');
      return;
    }

    if (signUpPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }

    if (!acceptedTerms) {
      setErrorMsg('Please review and accept the Terms of Service & Privacy and Data Safeguard Policy.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await registerUser(signUpEmail, signUpPassword, signUpUsername, signUpName);

      setSuccessMsg('Account created successfully! Please sign in with your credentials.');
      setLoginEmail(signUpEmail);

      // Auto flip to Login tab after brief feedback
      setTimeout(() => {
        setIsFlipped(false);
        if (onLoginRedirect) {
          onLoginRedirect();
        }
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div data-auth-page="true" className="min-h-screen bg-[#02152c] text-white flex flex-col lg:flex-row font-sans selection:bg-[#00C853] selection:text-white relative overflow-hidden">

      {/* ── LEFT SIDE COLUMN: WELCOME & FEATURE LIST (Hidden on Mobile, Zero Image Clutter) ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-b from-[#02152c] to-[#010e20] p-10 xl:p-14 flex-col justify-between relative overflow-y-auto border-r border-white/5 scrollbar-none">

        {/* Top Header Logo */}
        <div className="flex items-center space-x-3.5 z-10 select-none flex-shrink-0">
          <img
            src={logoImg}
            alt="The TaxMan's Capital Logo"
            className="h-11 w-auto object-contain shrink-0 drop-shadow-[0_2px_12px_rgba(0,230,118,0.25)] translate-y-1"
          />
          <div className="flex flex-col justify-center">
            <span className="text-white font-black text-lg xl:text-xl leading-none tracking-tight font-['Outfit',sans-serif]">
              The TaxMan's
            </span>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="h-[1px] w-4 bg-gradient-to-r from-transparent to-[#00E676]/80"></span>
              <span className="text-[#00E676] font-bold text-[10px] tracking-[0.26em] uppercase leading-none font-['Outfit',sans-serif]">
                Capital
              </span>
              <span className="h-[1px] w-4 bg-gradient-to-l from-transparent to-[#00E676]/80"></span>
            </div>
          </div>
        </div>

        {/* Dynamic Welcome / Register Text Block */}
        <div className="my-8 space-y-7 max-w-lg z-10">
          <div className="space-y-3.5 transition-all duration-300">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#00E676] text-[11px] font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
              <span>{isFlipped ? 'New Student Registration' : 'Candidate & Member Access'}</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-black tracking-tight leading-tight transition-all duration-300">
              {isFlipped ? (
                <>
                  Start Your Journey<br />
                  Join Pakistan's Premier<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C853] to-[#34d399]">Finance Ecosystem</span>
                </>
              ) : (
                <>
                  Welcome Back!<br />
                  Access Your Dedicated<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C853] to-[#34d399]">Career Portal</span>
                </>
              )}
            </h1>

            <p className="text-xs xl:text-sm text-gray-400 font-medium leading-relaxed transition-all duration-300">
              {isFlipped
                ? "Create your student account to unlock Big 4 trainee inductions, access verified CAF & CFAP study resources, and receive 1-on-1 mentorship from Saboor Ahmad CA."
                : "Sign in to explore verified Big 4 trainee inductions, download exclusive study resources, and track your submitted counseling queries."}
            </p>
          </div>

          {/* Dynamic List of Features */}
          <div className="space-y-4 transition-all duration-300">
            {isFlipped ? (
              <>
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-[#00C853] shrink-0">
                    <Briefcase className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs xl:text-sm font-bold text-white">Big 4 & Firm Inductions</h4>
                    <p className="text-[11px] xl:text-xs text-gray-400 font-medium">Priority alerts for articleship and trainee positions across Pakistan and overseas</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-[#00C853] shrink-0">
                    <BookOpen className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs xl:text-sm font-bold text-white">Curated CA & ACCA Study Hub</h4>
                    <p className="text-[11px] xl:text-xs text-gray-400 font-medium">Free access to past papers, suggested solutions, revision checklists & templates</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-[#00C853] shrink-0">
                    <Users className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs xl:text-sm font-bold text-white">1-on-1 Personalized Mentorship</h4>
                    <p className="text-[11px] xl:text-xs text-gray-400 font-medium">Direct counseling on exam strategy, firm selection, and corporate placements</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-[#00C853] shrink-0">
                    <Globe className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs xl:text-sm font-bold text-white">Active Peer Study Rooms</h4>
                    <p className="text-[11px] xl:text-xs text-gray-400 font-medium">Instant connection to level-specific WhatsApp and Discord communities</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-[#00C853] shrink-0">
                    <Briefcase className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs xl:text-sm font-bold text-white">Verified Career Placements</h4>
                    <p className="text-[11px] xl:text-xs text-gray-400 font-medium">Explore active corporate finance, audit, and tax vacancies</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-[#00C853] shrink-0">
                    <BookOpen className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs xl:text-sm font-bold text-white">CAF & CFAP Resource Vault</h4>
                    <p className="text-[11px] xl:text-xs text-gray-400 font-medium">Download verified notes, mock tests & interview preparation guides</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-[#00C853] shrink-0">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs xl:text-sm font-bold text-white">Counseling & Guidance Inbox</h4>
                    <p className="text-[11px] xl:text-xs text-gray-400 font-medium">Submit queries and receive official counselor guidance in your dashboard</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-[#00C853] shrink-0">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs xl:text-sm font-bold text-white">Masterclasses & Webinars</h4>
                    <p className="text-[11px] xl:text-xs text-gray-400 font-medium">Watch exclusive firm reviews and ICAP exam strategy masterclasses</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* ── RIGHT SIDE COLUMN: INTERACTIVE 3D LOGIN & SIGNUP CARD ── */}
      <div className="flex-grow flex items-center justify-center bg-white text-[#111827] px-6 sm:px-10 py-12 relative">

        {/* Back Link at top-left corner */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="absolute top-6 left-6 text-xs font-bold text-gray-400 hover:text-[#00C853] tracking-wider uppercase transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <span>&larr; Back to Website</span>
          </button>
        )}

        {/* Sliding Panel Wrapper */}
        <div className={`max-w-md w-full relative overflow-hidden bg-white border border-gray-100 rounded-3xl shadow-xl transition-all duration-500 ease-in-out ${isFlipped ? 'h-[650px]' : 'h-[480px]'}`}>

          {/* ──────── FRONT FACE: LOGIN ──────── */}
          <div
            className={`w-full h-full absolute inset-0 p-6 sm:p-8 flex flex-col justify-start gap-y-4 transition-all duration-500 ease-in-out transform ${isFlipped ? '-translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100 pointer-events-auto'
              }`}
          >

            <div className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">Login to Your Account</h2>
                <div className="w-10 h-0.5 bg-[#00C853] mx-auto rounded-full" />
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-2">Welcome back! Please enter your details to continue.</p>
              </div>

              {/* Alerts */}
              {errorMsg && !isFlipped && (
                <div className="flex items-start space-x-3 bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-xs font-medium border border-red-100">
                  <ShieldAlert className="w-4.5 h-4.5 flex-shrink-0 text-red-500 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && !isFlipped && (
                <div className="flex items-start space-x-3 bg-emerald-50 text-emerald-600 px-4 py-3 rounded-2xl text-xs font-medium border border-emerald-100">
                  <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0 text-emerald-500 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853]/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Password</label>
                    <button type="button" className="text-xs font-bold text-[#00C853] hover:underline bg-transparent cursor-pointer">Forgot Password?</button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853]/20 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                {/* Keep me signed in */}
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 pt-1">
                  <label className="flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#00C853] focus:ring-[#00C853] mr-2 accent-[#00C853] cursor-pointer"
                    />
                    Remember me
                  </label>
                  <span className="text-[11px] font-medium text-gray-400">Keep me signed in</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full mt-3 py-3.5 bg-[#00C853] hover:bg-[#00963e] text-white font-extrabold rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-brandGreen/10 cursor-pointer transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                  <span>{isSubmitting ? 'Verifying...' : 'Login'}</span>
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

            </div>

            <div className="text-center text-xs sm:text-sm text-gray-500 pt-4 border-t border-gray-50">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  if (onSignUpRedirect) {
                    onSignUpRedirect();
                  } else {
                    setIsFlipped(true);
                  }
                }}
                className="text-[#00C853] hover:underline font-extrabold bg-transparent cursor-pointer ml-1"
              >
                Sign Up
              </button>
            </div>

          </div>

          {/* ──────── BACK FACE: SIGN UP ──────── */}
          <div
            className={`w-full h-full absolute inset-0 p-6 sm:p-8 flex flex-col justify-start gap-y-3 overflow-hidden transition-all duration-500 ease-in-out transform ${isFlipped ? 'translate-x-0 opacity-100 pointer-events-auto' : 'translate-x-full opacity-0 pointer-events-none'
              }`}
          >

            <div className="space-y-4">
              {/* Header */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">Create an Account</h2>
                <div className="w-10 h-0.5 bg-[#00C853] mx-auto rounded-full" />
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-2">Start your success journey by entering your details.</p>
              </div>

              {/* Alerts */}
              {errorMsg && isFlipped && (
                <div className="flex items-start space-x-3 bg-red-50 text-red-600 px-4 py-2.5 rounded-2xl text-xs font-medium border border-red-100">
                  <ShieldAlert className="w-4.5 h-4.5 flex-shrink-0 text-red-500 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && isFlipped && (
                <div className="flex items-start space-x-3 bg-emerald-50 text-emerald-600 px-4 py-2.5 rounded-2xl text-xs font-medium border border-emerald-100">
                  <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0 text-emerald-500 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSignUpSubmit} className="space-y-2">
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Full Name</label>
                  <div className="relative">
                    <User className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853]/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Username</label>
                  <div className="relative">
                    <User className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={signUpUsername}
                      onChange={(e) => setSignUpUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853]/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853]/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Password</label>
                  <div className="relative">
                    <Lock className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full pl-11 pr-11 py-2.5 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853]/20 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 cursor-pointer"
                    >
                      {showSignUpPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853]/20 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Terms & Privacy Consent Checkbox */}
                <div className="pt-2 text-[11px] text-gray-500 flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="signup-terms"
                    required
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#00C853] focus:ring-[#00C853] accent-[#00C853] cursor-pointer flex-shrink-0"
                  />
                  <label htmlFor="signup-terms" className="leading-tight cursor-pointer select-none">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setPolicyModalTab('terms');
                        setPolicyModalOpen(true);
                      }}
                      className="text-[#00C853] font-bold hover:underline bg-transparent p-0 inline cursor-pointer"
                    >
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setPolicyModalTab('privacy');
                        setPolicyModalOpen(true);
                      }}
                      className="text-[#00C853] font-bold hover:underline bg-transparent p-0 inline cursor-pointer"
                    >
                      Privacy & Sensitive Data Protection Policy
                    </button>
                    .
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full mt-2.5 py-3 bg-[#00C853] hover:bg-[#00963e] text-white font-extrabold rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-brandGreen/10 cursor-pointer transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                  <span>{isSubmitting ? 'Creating...' : 'Sign Up'}</span>
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>


            </div>

            {/* Bottom flip option */}
            <div className="text-center text-xs sm:text-sm text-gray-500 pt-4 border-t border-gray-50">
              Already have an account?{' '}
              <button
                onClick={() => {
                  if (onLoginRedirect) {
                    onLoginRedirect();
                  } else {
                    setIsFlipped(false);
                  }
                }}
                className="text-[#00C853] hover:underline font-extrabold bg-transparent cursor-pointer ml-1"
              >
                Log In
              </button>
            </div>

          </div>
        </div>

      </div>

      <TermsAndPrivacyModal
        isOpen={policyModalOpen}
        onClose={() => setPolicyModalOpen(false)}
        initialTab={policyModalTab}
      />
    </div>
  );
}
