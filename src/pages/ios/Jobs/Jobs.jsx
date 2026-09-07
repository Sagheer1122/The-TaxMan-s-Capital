import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  MapPin,
  Clock,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal,
  Mail,
  Send,
  Building2,
  CheckCircle,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Laptop,
  Compass
} from 'lucide-react';
import hiringChair from '../../../assets/hiring_chair.png';
import jobsHeroBg from '../../../assets/jobs_hero_bg.png';


import { INITIAL_JOBS } from '../../../data/jobsData';
import { useBodyScrollLock } from '../../../hooks/useBodyScrollLock';
import PortalModal from '../../../components/PortalModal';
import { api } from '../../../services/api';
import { requireAuth } from '../../../services/authService';

const getJobs = async () => {
  try {
    const res = await api.get('/jobs');
    return res?.data?.jobs || res?.data || [];
  } catch {
    return [];
  }
};

export default function Jobs({
  mode = 'jobs',
  initialSelectedJobId,
  onClearInitialJob,
  savedJobs: propsSavedJobs,
  onToggleSaveJob
}) {
  const localCities = ['Lahore', 'Karachi', 'Islamabad', 'Multan', 'Peshawar', 'Faisalabad'];
  const overseasCities = ['Dubai, UAE', 'Riyadh, KSA', 'London, UK', 'Doha, Qatar', 'Muscat, Oman'];
  const visibleCities = mode === 'overseas' ? overseasCities : localCities;

  const overseasCountries = ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Oman', 'United Kingdom'];

  const localFirms = [
    'PwC Pakistan (A.F. Ferguson & Co.)',
    'Deloitte Pakistan',
    'EY Pakistan',
    'KPMG Pakistan',
    'BDO Pakistan',
    'Grant Thornton Pakistan',
    'Crowe Pakistan'
  ];
  const overseasFirms = [
    'PwC Middle East',
    'KPMG Saudi Arabia (Gulf Practice)',
    'KPMG UK',
    'EY Qatar',
    'BDO Middle East (Oman)'
  ];
  const visibleFirms = mode === 'overseas' ? overseasFirms : localFirms;

  const visibleJobTypes = ['Articleship', 'Internship', 'Full Time', 'Contract', 'Part Time'];

  const allLevels = [
    'PRC',
    'CAF / CA Inter',
    'ACCA Finalist',
    'ACCA Affiliate',
    'CA Finalist',
    'CA Qualified',
    'ACCA Member',
    'Experienced'
  ];

  const allWorkModes = ['On-site', 'Virtual / Remote', 'Hybrid'];

  // Jobs state with fallback to INITIAL_JOBS
  const [jobsList, setJobsList] = useState(INITIAL_JOBS);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const data = await getJobs();
        if (data && data.length > 0) {
          const mappedJobs = data.map(job => ({
            id: job._id || job.id,
            _id: job._id || job.id,
            company: job.company,
            title: job.title,
            location: job.location,
            city: job.city || job.location,
            country: job.country || (job.isOverseas ? (job.location?.includes('UAE') ? 'United Arab Emirates' : job.location?.includes('KSA') || job.location?.includes('Saudi') ? 'Saudi Arabia' : job.location?.includes('UK') ? 'United Kingdom' : job.location?.includes('Qatar') ? 'Qatar' : job.location?.includes('Oman') ? 'Oman' : 'Overseas') : 'Pakistan'),
            level: job.level || job.qualification || 'CAF / CA Inter',
            badge: job.level || job.qualification || 'CAF / CA Inter',
            jobType: (job.jobType || job.job_type) === 'Full-time' ? 'Full Time' : (job.jobType || job.job_type) === 'Part-time' ? 'Part Time' : (job.jobType || job.job_type || 'Articleship'),
            workMode: job.workMode || (job.title?.toLowerCase().includes('remote') || job.location?.toLowerCase().includes('remote') ? 'Virtual / Remote' : job.title?.toLowerCase().includes('hybrid') ? 'Hybrid' : 'On-site'),
            isOverseas: !!(job.isOverseas || job.is_overseas),
            deadline: job.deadline || 'Open until filled',
            deadlineDate: job.deadline ? new Date(job.deadline) : null,
            dateAdded: job.createdAt || job.created_at ? new Date(job.createdAt || job.created_at) : new Date(),
            description: job.description || '',
            requirements: Array.isArray(job.requirements) ? job.requirements : [],
            logoSvg: (
              <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" rx="12" fill="#F3F4F6" />
                <text x="50" y="55" fill="#4B5563" fontSize="24" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  {(job.company || 'JB').substring(0, 2).toUpperCase()}
                </text>
              </svg>
            )
          }));

          const serverTitles = new Set(mappedJobs.map(j => `${j.title.toLowerCase()}_${j.company.toLowerCase()}`));
          const uniqueInitials = INITIAL_JOBS.filter(j => !serverTitles.has(`${j.title.toLowerCase()}_${j.company.toLowerCase()}`));
          setJobsList([...mappedJobs, ...uniqueInitials]);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    }
    fetchJobs();
  }, []);

  // Filters States
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [firmFilter, setFirmFilter] = useState('All');
  const [workModeFilter, setWorkModeFilter] = useState('All');
  const [deadlineFilter, setDeadlineFilter] = useState('All');
  const [quickTab, setQuickTab] = useState('All');
  const [targetOverseasQual, setTargetOverseasQual] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');


  // Sidebar Filter Checkboxes States
  const [sidebarCities, setSidebarCities] = useState({
    Lahore: false,
    Karachi: false,
    Islamabad: false,
    Multan: false,
    Peshawar: false,
    Faisalabad: false,
    'Dubai, UAE': false,
    'Riyadh, KSA': false,
    'London, UK': false,
    'Doha, Qatar': false,
    'Muscat, Oman': false
  });

  const [sidebarCountries, setSidebarCountries] = useState({
    'United Arab Emirates': false,
    'Saudi Arabia': false,
    'Qatar': false,
    'Oman': false,
    'United Kingdom': false
  });

  const [sidebarLevels, setSidebarLevels] = useState({
    'PRC': false,
    'CAF / CA Inter': false,
    'ACCA Finalist': false,
    'ACCA Affiliate': false,
    'CA Finalist': false,
    'CA Qualified': false,
    'ACCA Member': false,
    Experienced: false
  });

  const [sidebarFirms, setSidebarFirms] = useState({
    'PwC Pakistan (A.F. Ferguson & Co.)': false,
    'Deloitte Pakistan': false,
    'EY Pakistan': false,
    'KPMG Pakistan': false,
    'BDO Pakistan': false,
    'Grant Thornton Pakistan': false,
    'Crowe Pakistan': false,
    'PwC Middle East': false,
    'KPMG Saudi Arabia (Gulf Practice)': false,
    'KPMG UK': false,
    'EY Qatar': false,
    'BDO Middle East (Oman)': false
  });

  const [sidebarJobTypes, setSidebarJobTypes] = useState({
    Articleship: false,
    Internship: false,
    'Full Time': false,
    Contract: false,
    'Part Time': false
  });

  const [sidebarWorkModes, setSidebarWorkModes] = useState({
    'On-site': false,
    'Virtual / Remote': false,
    'Hybrid': false
  });

  const [firmSearchQuery, setFirmSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Latest First');
  const [currentPage, setCurrentPage] = useState(1);
  const [localSavedJobs, setLocalSavedJobs] = useState([]);
  const savedJobs = propsSavedJobs !== undefined ? propsSavedJobs : localSavedJobs;
  const [selectedJob, setSelectedJob] = useState(null);
  useBodyScrollLock(!!selectedJob);

  useEffect(() => {
    if (initialSelectedJobId) {
      const job = jobsList.find((j) => j.id === initialSelectedJobId);
      if (job) {
        const timer = setTimeout(() => {
          setSelectedJob(job);
          if (onClearInitialJob) {
            onClearInitialJob();
          }
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [initialSelectedJobId, onClearInitialJob, jobsList]);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Toggle saving a job
  const toggleSaveJob = (id) => {
    if (!requireAuth('save or bookmark jobs to your profile')) {
      return;
    }
    if (onToggleSaveJob) {
      onToggleSaveJob(id);
      return;
    }
    if (localSavedJobs.includes(id)) {
      setLocalSavedJobs(localSavedJobs.filter((item) => item !== id));
    } else {
      setLocalSavedJobs([...localSavedJobs, id]);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setCityFilter('All');
    setCountryFilter('All');
    setLevelFilter('All');
    setFirmFilter('All');
    setWorkModeFilter('All');
    setDeadlineFilter('All');
    setQuickTab('All');
    setTargetOverseasQual('All');
    setRegionFilter('All');
    setSearchQuery('');


    setSidebarCities({
      Lahore: false,
      Karachi: false,
      Islamabad: false,
      Multan: false,
      Peshawar: false,
      Faisalabad: false,
      'Dubai, UAE': false,
      'Riyadh, KSA': false,
      'London, UK': false,
      'Doha, Qatar': false,
      'Muscat, Oman': false
    });
    setSidebarCountries({
      'United Arab Emirates': false,
      'Saudi Arabia': false,
      'Qatar': false,
      'Oman': false,
      'United Kingdom': false
    });
    setSidebarLevels({
      'PRC': false,
      'CAF / CA Inter': false,
      'ACCA Finalist': false,
      'ACCA Affiliate': false,
      'CA Finalist': false,
      'CA Qualified': false,
      'ACCA Member': false,
      Experienced: false
    });
    setSidebarFirms({
      'PwC Pakistan (A.F. Ferguson & Co.)': false,
      'Deloitte Pakistan': false,
      'EY Pakistan': false,
      'KPMG Pakistan': false,
      'BDO Pakistan': false,
      'Grant Thornton Pakistan': false,
      'Crowe Pakistan': false,
      'PwC Middle East': false,
      'KPMG Saudi Arabia (Gulf Practice)': false,
      'KPMG UK': false,
      'EY Qatar': false,
      'BDO Middle East (Oman)': false
    });
    setSidebarJobTypes({
      Articleship: false,
      Internship: false,
      'Full Time': false,
      Contract: false,
      'Part Time': false
    });
    setSidebarWorkModes({
      'On-site': false,
      'Virtual / Remote': false,
      'Hybrid': false
    });
    setCurrentPage(1);
  };

  // Check if any sidebar checkboxes are active
  const isAnyCheckboxActive = (checkboxState) => {
    return Object.values(checkboxState).some(val => val === true);
  };

  const isAnyCityCheckboxActive = useMemo(() => {
    return visibleCities.some(city => sidebarCities[city] === true);
  }, [sidebarCities, visibleCities]);

  const isAnyCountryCheckboxActive = useMemo(() => {
    return overseasCountries.some(country => sidebarCountries[country] === true);
  }, [sidebarCountries, overseasCountries]);

  const isAnyJobTypeCheckboxActive = useMemo(() => {
    return visibleJobTypes.some(type => sidebarJobTypes[type] === true);
  }, [sidebarJobTypes, visibleJobTypes]);

  const isAnyWorkModeCheckboxActive = useMemo(() => {
    return allWorkModes.some(modeItem => sidebarWorkModes[modeItem] === true);
  }, [sidebarWorkModes, allWorkModes]);

  const isAnyFirmCheckboxActive = useMemo(() => {
    return visibleFirms.some(firm => sidebarFirms[firm] === true);
  }, [sidebarFirms, visibleFirms]);

  // Computed and filtered jobs list
  const filteredJobs = useMemo(() => {
    return jobsList.filter((job) => {
      // 0. Filter by mode (jobs vs inductions vs overseas)
      if (mode === 'jobs') {
        if (job.isOverseas) return false;
      } else if (mode === 'inductions') {
        if (job.isOverseas) return false;
      } else if (mode === 'overseas') {
        if (!job.isOverseas) return false;
      }

      // Quick Category Tab Filter
      if (quickTab === 'Articleship') {
        if (job.jobType !== 'Articleship') return false;
      } else if (quickTab === 'Internship') {
        if (job.jobType !== 'Internship') return false;
      } else if (quickTab === 'CA Finalist') {
        if (job.level !== 'CA Finalist' && !job.title.toLowerCase().includes('finalist')) return false;
      } else if (quickTab === 'CA Qualified') {
        if (job.level !== 'CA Qualified' && !job.title.toLowerCase().includes('qualified')) return false;
      } else if (quickTab === 'ACCA Stream') {
        if (!['ACCA Finalist', 'ACCA Affiliate', 'ACCA Member'].includes(job.level) && !job.title.toLowerCase().includes('acca')) return false;
      } else if (quickTab === 'Virtual / Remote') {
        if (job.workMode !== 'Virtual / Remote') return false;
      }

      // Regional Filter (Pakistan, KSA & UAE, UK & Europe)
      if (regionFilter === 'Pakistan') {
        const isPak = (job.country === 'Pakistan' || !job.isOverseas || ['Lahore', 'Karachi', 'Islamabad', 'Multan', 'Peshawar', 'Faisalabad'].includes(job.city) || ['Lahore', 'Karachi', 'Islamabad', 'Multan', 'Peshawar', 'Faisalabad'].includes(job.location));
        if (!isPak) return false;
      } else if (regionFilter === 'KSA-UAE') {
        const isGcc = ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Oman'].includes(job.country) ||
          job.location?.includes('UAE') || job.location?.includes('Dubai') || job.location?.includes('KSA') || job.location?.includes('Riyadh') || job.location?.includes('Saudi');
        if (!isGcc) return false;
      } else if (regionFilter === 'UK-Europe') {
        const isUkEurope = ['United Kingdom', 'UK', 'Ireland', 'Europe', 'Germany'].includes(job.country) ||
          job.location?.includes('UK') || job.location?.includes('London') || job.location?.includes('Europe');
        if (!isUkEurope) return false;
      }


      // Overseas specific target qualification
      if (mode === 'overseas' && targetOverseasQual !== 'All') {
        if (targetOverseasQual === 'CA Qualified' && job.level !== 'CA Qualified') return false;
        if (targetOverseasQual === 'CA Finalist' && job.level !== 'CA Finalist') return false;
        if (targetOverseasQual === 'ACCA' && !job.level.includes('ACCA')) return false;
      }

      // 1. Keyword search
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesQuery =
          job.company.toLowerCase().includes(query) ||
          job.title.toLowerCase().includes(query) ||
          job.level.toLowerCase().includes(query) ||
          (job.country && job.country.toLowerCase().includes(query)) ||
          (job.workMode && job.workMode.toLowerCase().includes(query)) ||
          job.description.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // 2. City Filter
      if (cityFilter !== 'All') {
        if (job.location !== cityFilter && job.city !== cityFilter) return false;
      } else if (isAnyCityCheckboxActive) {
        if (!sidebarCities[job.location] && !sidebarCities[job.city]) return false;
      }

      // 2.1 Country Filter
      if (countryFilter !== 'All') {
        if (job.country !== countryFilter) return false;
      } else if (isAnyCountryCheckboxActive) {
        if (!sidebarCountries[job.country]) return false;
      }

      // 3. Level Filter
      if (levelFilter !== 'All') {
        if (job.level !== levelFilter) return false;
      } else if (isAnyCheckboxActive(sidebarLevels)) {
        if (!sidebarLevels[job.level]) return false;
      }

      // 4. Firm Filter
      if (firmFilter !== 'All') {
        if (job.company !== firmFilter) return false;
      } else if (isAnyFirmCheckboxActive) {
        if (!sidebarFirms[job.company]) return false;
      }

      // 5. Job Type Filter
      if (isAnyJobTypeCheckboxActive) {
        if (!sidebarJobTypes[job.jobType]) return false;
      }

      // 6. Work Mode Filter
      if (workModeFilter !== 'All') {
        if (job.workMode !== workModeFilter) return false;
      } else if (isAnyWorkModeCheckboxActive) {
        if (!sidebarWorkModes[job.workMode]) return false;
      }

      // 7. Deadline Filter
      if (deadlineFilter !== 'All') {
        const today = new Date();
        const diffTime = Math.abs(job.deadlineDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (deadlineFilter === 'Under 7 Days' && diffDays > 7) return false;
        if (deadlineFilter === 'Under 15 Days' && diffDays > 15) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'Latest First') {
        return b.dateAdded - a.dateAdded;
      } else if (sortBy === 'Deadline Approaching') {
        return a.deadlineDate - b.deadlineDate;
      }
      return 0;
    });
  }, [
    mode,
    quickTab,
    targetOverseasQual,
    regionFilter,
    searchQuery,
    cityFilter,
    countryFilter,
    levelFilter,
    firmFilter,
    workModeFilter,
    deadlineFilter,
    sidebarCities,
    sidebarCountries,
    sidebarLevels,
    sidebarFirms,
    sidebarJobTypes,
    sidebarWorkModes,
    sortBy,
    isAnyCityCheckboxActive,
    isAnyCountryCheckboxActive,
    isAnyJobTypeCheckboxActive,
    isAnyWorkModeCheckboxActive,
    isAnyFirmCheckboxActive,
    jobsList
  ]);

  // Pagination Variables
  const itemsPerPage = 10;
  const totalItems = filteredJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedJobs = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredJobs, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  // Filter Firm check list search results
  const filteredSidebarFirms = visibleFirms.filter(firm =>
    firm.toLowerCase().includes(firmSearchQuery.toLowerCase())
  );



  // Handle newsletter submission
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim() !== '') {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  return (
    <div className="flex-grow bg-bgLight">

      {/* 1. Header Hero Area */}
      <header
        className="bg-navy text-white pt-16 pb-24 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(2, 27, 58, 0.88), rgba(2, 27, 58, 0.95)), url(${jobsHeroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Hero Left Info */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                {mode === 'jobs' ? 'CA & ACCA Jobs' : mode === 'inductions' ? 'CA & ACCA Inductions' : 'Overseas & Abroad Jobs'}
              </h1>
              <p className="text-base sm:text-lg text-gray-300 max-w-xl font-normal leading-relaxed">
                {mode === 'jobs'
                  ? 'Find the latest CA / ACCA full-time, part-time and contract job opportunities in corporate finance, audit and taxation across Pakistan.'
                  : mode === 'inductions'
                    ? 'Find the latest CA / ACCA articleship and audit internship induction opportunities from top audit firms across Pakistan.'
                    : 'Find the latest international CA & ACCA job opportunities in the Middle East, UK, and other global markets.'}
              </p>

              {/* Green bullet points */}
              <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0 pt-2 text-xs sm:text-sm font-semibold">
                <div className="flex items-center text-gray-200">
                  <CheckCircle className="w-4 h-4 text-brandGreen mr-2 flex-shrink-0" />
                  Verified Opportunities
                </div>
                <div className="flex items-center text-gray-200">
                  <CheckCircle className="w-4 h-4 text-brandGreen mr-2 flex-shrink-0" />
                  Regular Updates & Notifications
                </div>
                <div className="flex items-center text-gray-200">
                  <CheckCircle className="w-4 h-4 text-brandGreen mr-2 flex-shrink-0" />
                  Helping Students Build Careers
                </div>
              </div>
            </div>

            {/* Hero Right Graphic */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center bg-navy-dark hover:scale-105 transition-transform duration-300">
                <img
                  src={hiringChair}
                  alt="We Are Hiring - CA Career Hub"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Floating Search & Selection Filter Bar */}
      <section className="relative -mt-12 z-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">

              {/* Search input field */}
              <div className="md:col-span-4 relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={mode === 'jobs' ? "Search by company name, job title, or keyword..." : mode === 'inductions' ? "Search by firm name, induction or keyword..." : "Search international positions..."}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brandGreen focus:bg-white transition-all font-medium"
                />
              </div>

              {/* Dropdowns */}
              <div className="md:col-span-2">
                <select
                  value={cityFilter}
                  onChange={(e) => {
                    setCityFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 font-semibold focus:outline-none focus:border-brandGreen focus:bg-white transition-all cursor-pointer"
                >
                  <option value="All">All Cities</option>
                  {visibleCities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {mode === 'overseas' && (
                <div className="md:col-span-2">
                  <select
                    value={countryFilter}
                    onChange={(e) => {
                      setCountryFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 font-semibold focus:outline-none focus:border-brandGreen focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="All">All Countries</option>
                    {overseasCountries.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className={mode === 'overseas' ? "md:col-span-2" : "md:col-span-2"}>
                <select
                  value={levelFilter}
                  onChange={(e) => {
                    setLevelFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 font-semibold focus:outline-none focus:border-brandGreen focus:bg-white transition-all cursor-pointer"
                >
                  <option value="All">Target Level</option>
                  <option value="PRC">PRC</option>
                  <option value="CAF / CA Inter">CAF / CA Inter</option>
                  <option value="ACCA Finalist">ACCA Finalist</option>
                  <option value="ACCA Affiliate">ACCA Affiliate</option>
                  <option value="CA Finalist">CA Finalist (Articles Done)</option>
                  <option value="CA Qualified">CA Qualified</option>
                  <option value="ACCA Member">ACCA Member</option>
                  <option value="Experienced">Experienced</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <select
                  value={workModeFilter}
                  onChange={(e) => {
                    setWorkModeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 font-semibold focus:outline-none focus:border-brandGreen focus:bg-white transition-all cursor-pointer"
                >
                  <option value="All">All Work Modes</option>
                  <option value="On-site">On-site</option>
                  <option value="Virtual / Remote">Virtual / Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className={mode === 'overseas' ? "md:col-span-2" : "md:col-span-2"}>
                <select
                  value={firmFilter}
                  onChange={(e) => {
                    setFirmFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 font-semibold focus:outline-none focus:border-brandGreen focus:bg-white transition-all cursor-pointer"
                >
                  <option value="All">Select Firm</option>
                  {visibleFirms.map((firm) => (
                    <option key={firm} value={firm}>{firm}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Regional Filter Pills */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center space-x-2 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">
              <span className="text-[11px] font-extrabold text-navy uppercase tracking-wider whitespace-nowrap mr-1 flex items-center shrink-0">
                <Globe className="w-3.5 h-3.5 mr-1 text-brandGreen" />
                Region:
              </span>
              {[
                { id: 'All', label: 'All Regions' },
                { id: 'Pakistan', label: '🇵🇰 Pakistan (Local Firms & Industry)' },
                { id: 'KSA-UAE', label: '🇸🇦 🇦🇪 Middle East (KSA & UAE)' },
                { id: 'UK-Europe', label: '🇬🇧 🇪🇺 UK & Europe' }
              ].map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => {
                    setRegionFilter(reg.id);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center cursor-pointer shadow-sm ${
                    regionFilter === reg.id
                      ? 'bg-brandGreen text-white ring-2 ring-brandGreen/30 shadow-brandGreen/20'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                  }`}
                >
                  {reg.label}
                </button>
              ))}
            </div>

            {/* Quick Sub-Category Filter Navigation Tabs */}
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">

                {[
                  { id: 'All', label: 'All Opportunities', icon: <Briefcase className="w-3.5 h-3.5" /> },
                  { id: 'Articleship', label: 'CA Articleship', icon: <Building2 className="w-3.5 h-3.5" /> },
                  { id: 'Internship', label: 'Audit & Tax Internships', icon: <GraduationCap className="w-3.5 h-3.5" /> },
                  { id: 'CA Finalist', label: 'CA Finalist (Articles Done)', icon: <Award className="w-3.5 h-3.5" /> },
                  { id: 'CA Qualified', label: 'CA Qualified Positions', icon: <CheckCircle className="w-3.5 h-3.5" /> },
                  { id: 'ACCA Stream', label: 'ACCA Finalist & Affiliate', icon: <Compass className="w-3.5 h-3.5" /> },
                  { id: 'Virtual / Remote', label: 'Virtual / Remote Roles', icon: <Globe className="w-3.5 h-3.5" /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setQuickTab(tab.id);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm ${
                      quickTab === tab.id
                        ? 'bg-navy text-white ring-2 ring-brandGreen shadow-brandGreen/20'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-100 hover:text-navy'
                    }`}
                  >
                    <span className={quickTab === tab.id ? 'text-brandGreen' : 'text-gray-400'}>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Overseas Specific Bifurcation Panel */}
            {mode === 'overseas' && (
              <div className="bg-gradient-to-r from-[#011126] to-navy p-3.5 sm:p-4 rounded-xl text-white space-y-3 shadow-md border border-white/10 mt-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                  <div className="flex items-center space-x-2 text-xs font-extrabold text-brandGreen uppercase tracking-wider">
                    <Globe className="w-4 h-4" />
                    <span>Overseas Country Bifurcation:</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-300">
                    <span className="font-bold">Target Qualification:</span>
                    {['All', 'CA Qualified', 'CA Finalist', 'ACCA'].map((tq) => (
                      <button
                        key={tq}
                        onClick={() => {
                          setTargetOverseasQual(tq);
                          setCurrentPage(1);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          targetOverseasQual === tq
                            ? 'bg-brandGreen text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {tq === 'CA Finalist' ? 'CA Finalist (Articles Done)' : tq}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Country Pills */}
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {['All Countries', 'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Oman', 'United Kingdom'].map((c) => {
                    const flag = c === 'United Arab Emirates' ? '🇦🇪 UAE' : c === 'Saudi Arabia' ? '🇸🇦 Saudi Arabia' : c === 'Qatar' ? '🇶🇦 Qatar' : c === 'Oman' ? '🇴🇲 Oman' : c === 'United Kingdom' ? '🇬🇧 UK' : '🌍 All Countries';
                    return (
                      <button
                        key={c}
                        onClick={() => {
                          setCountryFilter(c === 'All Countries' ? 'All' : c);
                          setCurrentPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                          (countryFilter === 'All' && c === 'All Countries') || countryFilter === c
                            ? 'bg-brandGreen text-white shadow-md'
                            : 'bg-white/10 hover:bg-white/20 text-gray-200 border border-white/5'
                        }`}
                      >
                        <span>{flag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Actions Row */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-3 pt-3 border-t border-gray-50 gap-3">
              <span className="text-xs text-gray-400 font-medium">
                Tip: Combine filters for precise {mode === 'jobs' ? 'job' : mode === 'inductions' ? 'induction' : 'international job'} updates
              </span>
              <div className="flex space-x-3 w-full sm:w-auto">
                <button
                  onClick={handleClearFilters}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-gray-500 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors cursor-pointer text-center"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => handlePageChange(1)}
                  className="w-full sm:w-auto px-6 py-2 bg-navy hover:bg-brandGreen text-white font-bold rounded-lg text-xs transition-colors duration-200 cursor-pointer shadow-md text-center"
                >
                  Search
                </button>
                <button
                  onClick={() => alert(`Saved jobs IDs: ${savedJobs.join(', ')}`)}
                  className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-brandGreen/20 bg-emerald-500/[0.04] text-brandGreen hover:bg-emerald-500/10 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5 mr-1.5 fill-current" />
                  Saved Jobs ({savedJobs.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Listings & Sidebar Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Sidebar Filters Panel */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 space-y-7 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center text-navy font-extrabold text-sm sm:text-base">
                <SlidersHorizontal className="w-4 h-4 mr-2 text-navy" />
                Filters
              </div>
              <button
                onClick={handleClearFilters}
                className="text-xs text-gray-400 hover:text-brandGreen font-bold transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* City Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider">City</h3>
              <div className="space-y-2.5">
                <label className="flex items-center text-xs sm:text-sm text-gray-600 cursor-pointer font-medium hover:text-navy">
                  <input
                    type="checkbox"
                    checked={!isAnyCityCheckboxActive}
                    onChange={() => {
                      const updatedCities = { ...sidebarCities };
                      visibleCities.forEach(city => { updatedCities[city] = false; });
                      setSidebarCities(updatedCities);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 text-brandGreen border-gray-300 rounded focus:ring-brandGreen accent-brandGreen mr-2.5"
                  />
                  All Cities
                </label>
                {visibleCities.map((city) => (
                  <label key={city} className="flex items-center text-xs sm:text-sm text-gray-600 cursor-pointer font-medium hover:text-navy">
                    <input
                      type="checkbox"
                      checked={sidebarCities[city]}
                      onChange={() => {
                        setSidebarCities({
                          ...sidebarCities,
                          [city]: !sidebarCities[city]
                        });
                        setCurrentPage(1);
                      }}
                      className="w-4 h-4 text-brandGreen border-gray-300 rounded focus:ring-brandGreen accent-brandGreen mr-2.5"
                    />
                    {city}
                  </label>
                ))}
              </div>
            </div>

            {/* Country Section (Overseas Mode) */}
            {mode === 'overseas' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Country</h3>
                <div className="space-y-2.5">
                  <label className="flex items-center text-xs sm:text-sm text-gray-600 cursor-pointer font-medium hover:text-navy">
                    <input
                      type="checkbox"
                      checked={!isAnyCountryCheckboxActive}
                      onChange={() => {
                        const updated = { ...sidebarCountries };
                        overseasCountries.forEach(c => { updated[c] = false; });
                        setSidebarCountries(updated);
                        setCurrentPage(1);
                      }}
                      className="w-4 h-4 text-brandGreen border-gray-300 rounded focus:ring-brandGreen accent-brandGreen mr-2.5"
                    />
                    All Countries
                  </label>
                  {overseasCountries.map((c) => (
                    <label key={c} className="flex items-center text-xs sm:text-sm text-gray-600 cursor-pointer font-medium hover:text-navy">
                      <input
                        type="checkbox"
                        checked={sidebarCountries[c]}
                        onChange={() => {
                          setSidebarCountries({
                            ...sidebarCountries,
                            [c]: !sidebarCountries[c]
                          });
                          setCurrentPage(1);
                        }}
                        className="w-4 h-4 text-brandGreen border-gray-300 rounded focus:ring-brandGreen accent-brandGreen mr-2.5"
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Level / Qualification Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Target Level</h3>
              <div className="space-y-2.5">
                <label className="flex items-center text-xs sm:text-sm text-gray-600 cursor-pointer font-medium hover:text-navy">
                  <input
                    type="checkbox"
                    checked={!isAnyCheckboxActive(sidebarLevels)}
                    onChange={() => {
                      const updated = { ...sidebarLevels };
                      Object.keys(updated).forEach(k => { updated[k] = false; });
                      setSidebarLevels(updated);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 text-brandGreen border-gray-300 rounded focus:ring-brandGreen accent-brandGreen mr-2.5"
                  />
                  All Levels
                </label>
                {allLevels.map((lvl) => (
                  <label key={lvl} className="flex items-center text-xs sm:text-sm text-gray-600 cursor-pointer font-medium hover:text-navy">
                    <input
                      type="checkbox"
                      checked={sidebarLevels[lvl]}
                      onChange={() => {
                        setSidebarLevels({
                          ...sidebarLevels,
                          [lvl]: !sidebarLevels[lvl]
                        });
                        setCurrentPage(1);
                      }}
                      className="w-4 h-4 text-brandGreen border-gray-300 rounded focus:ring-brandGreen accent-brandGreen mr-2.5"
                    />
                    {lvl}
                  </label>
                ))}
              </div>
            </div>

            {/* Placement / Job Type Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Placement Type</h3>
              <div className="space-y-2.5">
                <label className="flex items-center text-xs sm:text-sm text-gray-600 cursor-pointer font-medium hover:text-navy">
                  <input
                    type="checkbox"
                    checked={!isAnyJobTypeCheckboxActive}
                    onChange={() => {
                      const updatedTypes = { ...sidebarJobTypes };
                      visibleJobTypes.forEach(type => { updatedTypes[type] = false; });
                      setSidebarJobTypes(updatedTypes);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 text-brandGreen border-gray-300 rounded focus:ring-brandGreen accent-brandGreen mr-2.5"
                  />
                  All Types
                </label>
                {visibleJobTypes.map((type) => (
                  <label key={type} className="flex items-center text-xs sm:text-sm text-gray-600 cursor-pointer font-medium hover:text-navy">
                    <input
                      type="checkbox"
                      checked={sidebarJobTypes[type]}
                      onChange={() => {
                        setSidebarJobTypes({
                          ...sidebarJobTypes,
                          [type]: !sidebarJobTypes[type]
                        });
                        setCurrentPage(1);
                      }}
                      className="w-4 h-4 text-brandGreen border-gray-300 rounded focus:ring-brandGreen accent-brandGreen mr-2.5"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* Work Mode Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Work Mode</h3>
              <div className="space-y-2.5">
                <label className="flex items-center text-xs sm:text-sm text-gray-600 cursor-pointer font-medium hover:text-navy">
                  <input
                    type="checkbox"
                    checked={!isAnyWorkModeCheckboxActive}
                    onChange={() => {
                      const updated = { ...sidebarWorkModes };
                      allWorkModes.forEach(m => { updated[m] = false; });
                      setSidebarWorkModes(updated);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 text-brandGreen border-gray-300 rounded focus:ring-brandGreen accent-brandGreen mr-2.5"
                  />
                  All Modes
                </label>
                {allWorkModes.map((wm) => (
                  <label key={wm} className="flex items-center text-xs sm:text-sm text-gray-600 cursor-pointer font-medium hover:text-navy">
                    <input
                      type="checkbox"
                      checked={sidebarWorkModes[wm]}
                      onChange={() => {
                        setSidebarWorkModes({
                          ...sidebarWorkModes,
                          [wm]: !sidebarWorkModes[wm]
                        });
                        setCurrentPage(1);
                      }}
                      className="w-4 h-4 text-brandGreen border-gray-300 rounded focus:ring-brandGreen accent-brandGreen mr-2.5"
                    />
                    {wm}
                  </label>
                ))}
              </div>
            </div>

            {/* Firm Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Firm</h3>
              {/* Firm Search Box */}
              <input
                type="text"
                placeholder="Search firm..."
                value={firmSearchQuery}
                onChange={(e) => setFirmSearchQuery(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brandGreen font-medium"
              />
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                <label className="flex items-center text-xs sm:text-sm text-gray-600 cursor-pointer font-medium hover:text-navy">
                  <input
                    type="checkbox"
                    checked={!isAnyFirmCheckboxActive}
                    onChange={() => {
                      const updatedFirms = { ...sidebarFirms };
                      visibleFirms.forEach(firm => { updatedFirms[firm] = false; });
                      setSidebarFirms(updatedFirms);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 text-brandGreen border-gray-300 rounded focus:ring-brandGreen accent-brandGreen mr-2.5"
                  />
                  All Firms
                </label>
                {filteredSidebarFirms.map((firm) => (
                  <label key={firm} className="flex items-center text-xs sm:text-sm text-gray-600 cursor-pointer font-medium hover:text-navy">
                    <input
                      type="checkbox"
                      checked={sidebarFirms[firm]}
                      onChange={() => {
                        setSidebarFirms({
                          ...sidebarFirms,
                          [firm]: !sidebarFirms[firm]
                        });
                        setCurrentPage(1);
                      }}
                      className="w-4 h-4 text-brandGreen border-gray-300 rounded focus:ring-brandGreen accent-brandGreen mr-2.5"
                    />
                    {firm}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setCurrentPage(1);
              }}
              className="w-full py-2.5 bg-navy hover:bg-brandGreen text-white font-bold rounded-xl text-xs transition-colors duration-200 cursor-pointer text-center"
            >
              Apply Filters
            </button>
          </aside>

          {/* Right Main Job Listings Column */}
          <section className="lg:col-span-9 space-y-6">

            {/* Header listing info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
              <div className="text-xs sm:text-sm text-gray-500 font-semibold">
                Showing <strong className="text-navy">{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)}</strong> of <strong className="text-navy">{totalItems}</strong> {mode === 'jobs' ? 'jobs' : mode === 'inductions' ? 'inductions' : 'overseas jobs'}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm text-navy font-bold focus:outline-none focus:border-brandGreen cursor-pointer"
                >
                  <option value="Latest First">Latest First</option>
                  <option value="Deadline Approaching">Deadline Approaching</option>
                </select>
              </div>
            </div>

            {/* List of Job Cards */}
            {paginatedJobs.length > 0 ? (
              <div className="space-y-4">
                {paginatedJobs.map((job) => {
                  const isSaved = savedJobs.includes(job.id);
                  return (
                    <div
                      key={job.id}
                      className="bg-white rounded-2xl border border-gray-100/80 p-5 hover:shadow-xl hover:border-emerald-500/20 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 relative group hover:-translate-y-0.5"
                    >
                      {/* Logo and Job Description details */}
                      <div className="flex items-start space-x-4 flex-grow">
                        <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm border border-gray-50 ${job.logoBg}`}>
                          {job.logoSvg}
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            {job.isNew && (
                              <span className="px-2 py-0.5 bg-brandGreen/10 text-[9px] font-bold text-brandGreen rounded-md tracking-wider uppercase">
                                New
                              </span>
                            )}
                            <h3 className="font-extrabold text-navy text-sm sm:text-base leading-snug group-hover:text-brandGreen transition-colors">
                              {job.title}
                            </h3>
                          </div>

                          <div className="text-xs sm:text-sm font-semibold text-gray-500">
                            {job.company}
                             {/* Horizontal Tags */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {/* Level Badge with color distinction */}
                            <span className={`inline-flex px-2.5 py-1 rounded text-xs font-bold ${
                              job.level?.includes('Qualified') 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : job.level?.includes('Finalist') && job.level?.includes('CA')
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : job.level?.includes('ACCA')
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : job.level?.includes('CAF')
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-teal-50 text-teal-700 border border-teal-200'
                            }`}>
                              {job.level}
                            </span>

                            {/* Job / Placement Type */}
                            <span className="inline-flex px-2.5 py-1 bg-gray-50 text-gray-600 border border-gray-100 rounded text-xs font-semibold">
                              {job.jobType}
                            </span>

                            {/* Work Mode Badge */}
                            {job.workMode && (
                              <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold ${
                                job.workMode === 'Virtual / Remote'
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  : job.workMode === 'Hybrid'
                                  ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                  : 'bg-gray-50 text-gray-600 border border-gray-100'
                              }`}>
                                {job.workMode === 'Virtual / Remote' ? '🌐 Virtual / Remote' : job.workMode === 'Hybrid' ? '🔄 Hybrid' : '🏢 On-site'}
                              </span>
                            )}

                            {/* Country / Location */}
                            <span className="inline-flex px-2.5 py-1 bg-gray-50 text-gray-600 border border-gray-100 rounded text-xs font-semibold items-center">
                              <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                              {job.location}
                              {job.country && job.country !== 'Pakistan' && (
                                <span className="ml-1 text-[11px] font-bold text-navy">
                                  ({job.country === 'UAE' ? '🇦🇪 UAE' : job.country === 'Saudi Arabia' ? '🇸🇦 KSA' : job.country === 'Qatar' ? '🇶🇦 Qatar' : job.country === 'Oman' ? '🇴🇲 Oman' : job.country === 'UK' ? '🇬🇧 UK' : job.country})
                                </span>
                              )}
                            </span>
                          </div>
                          </div>
                        </div>
                      </div>

                      {/* Deadline & Actions */}
                      <div className="flex flex-col md:items-end justify-between md:border-l border-gray-100 md:pl-6 md:min-w-44 h-full shrink-0">
                        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center md:space-y-1 text-xs mb-3 md:mb-0 w-full">
                          <span className="text-gray-400 font-medium flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1" /> Deadline:
                          </span>
                          <span className="font-extrabold text-red-500">{job.deadline}</span>
                        </div>

                        <div className="flex space-x-2.5 w-full mt-2.5">
                          <button
                            onClick={() => toggleSaveJob(job.id)}
                            title={isSaved ? "Saved" : "Save Job"}
                            className={`p-2.5 border rounded-xl flex items-center justify-center transition-colors duration-200 cursor-pointer ${isSaved
                              ? 'bg-emerald-500/10 border-brandGreen text-brandGreen'
                              : 'border-gray-200 text-gray-400 hover:text-navy hover:bg-gray-50'
                              }`}
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => setSelectedJob(job)}
                            className="flex-grow py-2.5 bg-navy hover:bg-brandGreen text-white font-bold rounded-xl text-xs transition-colors duration-200 cursor-pointer text-center"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-navy mb-2">No Openings Found</h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
                  We couldn't find any job matches for the selected filters. Try clearing your filters or refining your keyword search.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-6 px-5 py-2.5 bg-navy hover:bg-brandGreen text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination controls */}
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
                    className={`w-9 h-9 font-bold text-xs rounded-xl transition-all duration-200 cursor-pointer ${currentPage === page
                      ? 'bg-brandGreen text-white shadow-md shadow-emerald-500/25'
                      : 'bg-white border border-gray-200 hover:border-brandGreen text-navy hover:text-brandGreen'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                      className="p-2 bg-white border border-gray-200 hover:border-brandGreen hover:text-brandGreen rounded-xl text-navy transition-colors disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-navy cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* 4. Newsletter Subscription Banner */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-3xl p-8 sm:p-10 shadow-xl text-white flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
            {/* background circle designs */}
            <div className="absolute -left-16 -bottom-16 w-60 h-60 rounded-full bg-white/5 border-4 border-white/5 pointer-events-none" />
            <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-white/5 border border-white/5 pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 text-center md:text-left z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <div className="flex flex-col space-y-1">
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">Never Miss an Opportunity</h3>
                <p className="text-xs sm:text-sm text-white/80 max-w-md font-medium leading-relaxed">
                  Subscribe to get the latest jobs and induction updates straight to your inbox.
                </p>
              </div>
            </div>

            <div className="mt-6 md:mt-0 z-10 w-full md:w-auto max-w-sm">
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white text-gray-800 placeholder-gray-400 rounded-xl text-xs sm:text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-navy hover:bg-navy-dark text-white font-bold rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  Subscribe
                  <Send className="w-4 h-4 ml-2" />
                </button>
              </form>
              {newsletterSubscribed && (
                <div className="text-xs font-bold text-navy mt-2 text-center md:text-left">
                  ✓ Successfully subscribed to newsletter alerts!
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Detailed Interactive Modal Popup */}
      <PortalModal isOpen={!!selectedJob} onClose={() => setSelectedJob(null)} maxWidth="max-w-2xl">
        {selectedJob && (
          <>
            {/* Modal Header */}
            <div className="p-6 bg-navy text-white flex items-start justify-between relative shrink-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 flex-shrink-0">
                  {selectedJob.logoSvg}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold">{selectedJob.title}</h3>
                  <span className="text-xs font-semibold text-brandGreen">{selectedJob.company}</span>
                </div>
              </div>
            </div>

            {/* Modal Body - Internal Scroll */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">

              {/* Job Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-50 p-3.5 rounded-2xl text-center border border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Location</span>
                  <span className="text-xs font-extrabold text-navy mt-0.5">
                    {selectedJob.location}
                    {selectedJob.country && selectedJob.country !== 'Pakistan' ? ` (${selectedJob.country})` : ''}
                  </span>
                </div>
                <div className="flex flex-col sm:border-l border-gray-200">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Job Type</span>
                  <span className="text-xs font-extrabold text-navy mt-0.5">{selectedJob.jobType}</span>
                </div>
                <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Target Level</span>
                  <span className="text-xs font-extrabold text-navy mt-0.5">{selectedJob.level}</span>
                </div>
                <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Work Mode</span>
                  <span className="text-xs font-extrabold text-brandGreen mt-0.5">
                    {selectedJob.workMode || 'On-site'}
                  </span>
                </div>
              </div>

              {/* Job Overview */}
              <div>
                <h4 className="text-sm font-extrabold text-navy mb-2 uppercase tracking-wide">Role Specifications</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line font-medium">
                  {selectedJob.description}
                </p>
              </div>

              {/* Candidate Requirements */}
              <div>
                <h4 className="text-sm font-extrabold text-navy mb-2 uppercase tracking-wide">Candidate Requirements</h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600 font-medium">
                  {selectedJob.requirements && selectedJob.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-brandGreen mr-2.5 mt-0.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Modal Action Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => toggleSaveJob(selectedJob.id)}
                  className={`px-4 py-2.5 border rounded-xl flex items-center space-x-2 text-xs font-bold transition-colors cursor-pointer ${
                    savedJobs.includes(selectedJob.id)
                      ? 'bg-emerald-500/10 border-brandGreen text-brandGreen'
                      : 'border-gray-200 text-gray-500 hover:text-navy hover:bg-gray-50'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${savedJobs.includes(selectedJob.id) ? 'fill-current' : ''}`} />
                  <span>{savedJobs.includes(selectedJob.id) ? 'Saved' : 'Save Job'}</span>
                </button>

                <button
                  onClick={() => {
                    if (!requireAuth('apply for this job vacancy')) return;
                    alert(`Application submitted successfully for "${selectedJob.title}" at ${selectedJob.company}! Your profile details have been shared with the firm.`);
                    setSelectedJob(null);
                  }}
                  className="flex-1 py-3 bg-brandGreen hover:bg-brandGreen-dark text-white font-extrabold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20 cursor-pointer text-center"
                >
                  Apply for this Role
                </button>
              </div>

            </div>
          </>
        )}
      </PortalModal>

    </div>
  );
}
