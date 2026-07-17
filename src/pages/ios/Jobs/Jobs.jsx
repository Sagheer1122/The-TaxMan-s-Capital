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
  CheckCircle
} from 'lucide-react';
import hiringChair from '../../../assets/hiring_chair.png';
import jobsHeroBg from '../../../assets/jobs_hero_bg.png';


import { INITIAL_JOBS } from '../../../data/jobsData';

const getJobs = async () => [];

export default function Jobs({
  mode = 'jobs',
  initialSelectedJobId,
  onClearInitialJob,
  savedJobs: propsSavedJobs,
  onToggleSaveJob
}) {
  const localCities = ['Lahore', 'Karachi', 'Islamabad', 'Multan', 'Peshawar'];
  const overseasCities = ['Dubai, UAE', 'Riyadh, KSA', 'London, UK'];
  const visibleCities = mode === 'overseas' ? overseasCities : localCities;

  const localFirms = [
    'PwC Pakistan',
    'Deloitte Pakistan',
    'EY Pakistan',
    'KPMG Pakistan',
    'BDO Pakistan',
    'Grant Thornton Pakistan',
    'A.F. Ferguson & Co.'
  ];
  const overseasFirms = ['PwC Middle East', 'EY Saudi Arabia', 'KPMG UK'];
  const visibleFirms = mode === 'overseas' ? overseasFirms : localFirms;

  const visibleJobTypes = useMemo(() => {
    return mode === 'inductions' ? ['Articleship', 'Internship'] : ['Full Time', 'Contract'];
  }, [mode]);

  // Jobs state with fallback to INITIAL_JOBS
  const [jobsList, setJobsList] = useState(INITIAL_JOBS);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const data = await getJobs();
        if (data && data.length > 0) {
          const mappedJobs = data.map(job => ({
            ...job,
            jobType: job.job_type === 'Full-time' ? 'Full Time' : job.job_type === 'Part-time' ? 'Part Time' : job.job_type,
            isOverseas: job.is_overseas,
            deadlineDate: job.deadline ? new Date(job.deadline) : null,
            dateAdded: job.created_at ? new Date(job.created_at) : new Date(),
            // Render custom logo_svg dynamically or fallback to first two letters
            logoSvg: job.logo_svg ? (
              <div dangerouslySetInnerHTML={{ __html: job.logo_svg }} className="w-10 h-10 flex items-center justify-center" />
            ) : (
              <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" rx="12" fill="#F3F4F6" />
                <text x="50" y="55" fill="#4B5563" fontSize="24" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  {(job.company || 'JB').substring(0, 2).toUpperCase()}
                </text>
              </svg>
            )
          }));
          setJobsList([...mappedJobs, ...INITIAL_JOBS]);
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
  const [levelFilter, setLevelFilter] = useState('All');
  const [firmFilter, setFirmFilter] = useState('All');
  const [deadlineFilter, setDeadlineFilter] = useState('All');

  // Sidebar Filter Checkboxes States
  const [sidebarCities, setSidebarCities] = useState({
    Lahore: false,
    Karachi: false,
    Islamabad: false,
    Multan: false,
    Peshawar: false,
    'Dubai, UAE': false,
    'Riyadh, KSA': false,
    'London, UK': false
  });

  const [sidebarLevels, setSidebarLevels] = useState({
    'PRC / Articleship': false,
    'CA Inter / ACCA': false,
    'CA Final / ACCA Final': false,
    'Qualified (CAF / CFAP)': false,
    Experienced: false
  });

  const [sidebarFirms, setSidebarFirms] = useState({
    'PwC Pakistan': false,
    'Deloitte Pakistan': false,
    'EY Pakistan': false,
    'KPMG Pakistan': false,
    'BDO Pakistan': false,
    'Grant Thornton Pakistan': false,
    'A.F. Ferguson & Co.': false,
    'PwC Middle East': false,
    'EY Saudi Arabia': false,
    'KPMG UK': false
  });

  const [sidebarJobTypes, setSidebarJobTypes] = useState({
    'Full Time': false,
    Internship: false,
    Articleship: false,
    Contract: false
  });

  const [firmSearchQuery, setFirmSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Latest First');
  const [currentPage, setCurrentPage] = useState(1);
  const [localSavedJobs, setLocalSavedJobs] = useState([1, 3, 5]);
  const savedJobs = propsSavedJobs !== undefined ? propsSavedJobs : localSavedJobs;
  const [selectedJob, setSelectedJob] = useState(null);

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
    setLevelFilter('All');
    setFirmFilter('All');
    setDeadlineFilter('All');
    setSearchQuery('');

    setSidebarCities({
      Lahore: false,
      Karachi: false,
      Islamabad: false,
      Multan: false,
      Peshawar: false,
      'Dubai, UAE': false,
      'Riyadh, KSA': false,
      'London, UK': false
    });
    setSidebarLevels({
      'PRC / Articleship': false,
      'CA Inter / ACCA': false,
      'CA Final / ACCA Final': false,
      'Qualified (CAF / CFAP)': false,
      Experienced: false
    });
    setSidebarFirms({
      'PwC Pakistan': false,
      'Deloitte Pakistan': false,
      'EY Pakistan': false,
      'KPMG Pakistan': false,
      'BDO Pakistan': false,
      'Grant Thornton Pakistan': false,
      'A.F. Ferguson & Co.': false,
      'PwC Middle East': false,
      'EY Saudi Arabia': false,
      'KPMG UK': false
    });
    setSidebarJobTypes({
      'Full Time': false,
      Internship: false,
      Articleship: false,
      Contract: false
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

  const isAnyJobTypeCheckboxActive = useMemo(() => {
    return visibleJobTypes.some(type => sidebarJobTypes[type] === true);
  }, [sidebarJobTypes, visibleJobTypes]);

  const isAnyFirmCheckboxActive = useMemo(() => {
    return visibleFirms.some(firm => sidebarFirms[firm] === true);
  }, [sidebarFirms, visibleFirms]);

  // Computed and filtered jobs list
  const filteredJobs = useMemo(() => {
    return jobsList.filter((job) => {
      // 0. Filter by mode (jobs vs inductions vs overseas)
      if (mode === 'jobs') {
        if (job.isOverseas) return false;
        if (job.jobType !== 'Full Time' && job.jobType !== 'Contract') return false;
      } else if (mode === 'inductions') {
        if (job.isOverseas) return false;
        if (job.jobType !== 'Articleship' && job.jobType !== 'Internship') return false;
      } else if (mode === 'overseas') {
        if (!job.isOverseas) return false;
      }

      // 1. Keyword search (company, title, level, description)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesQuery =
          job.company.toLowerCase().includes(query) ||
          job.title.toLowerCase().includes(query) ||
          job.level.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // 2. City Filter (Bar Select + Sidebar Checkboxes)
      if (cityFilter !== 'All') {
        if (job.location !== cityFilter) return false;
      } else if (isAnyCityCheckboxActive) {
        if (!sidebarCities[job.location]) return false;
      }

      // 3. Level Filter (Bar Select + Sidebar Checkboxes)
      if (levelFilter !== 'All') {
        if (job.level !== levelFilter) return false;
      } else if (isAnyCheckboxActive(sidebarLevels)) {
        if (!sidebarLevels[job.level]) return false;
      }

      // 4. Firm Filter (Bar Select + Sidebar Checkboxes)
      if (firmFilter !== 'All') {
        if (job.company !== firmFilter) return false;
      } else if (isAnyFirmCheckboxActive) {
        if (!sidebarFirms[job.company]) return false;
      }

      // 5. Job Type Filter (Sidebar Checkboxes)
      if (isAnyJobTypeCheckboxActive) {
        if (!sidebarJobTypes[job.jobType]) return false;
      }

      // 6. Deadline Filter
      if (deadlineFilter !== 'All') {
        const today = new Date();
        const diffTime = Math.abs(job.deadlineDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (deadlineFilter === 'Under 7 Days' && diffDays > 7) return false;
        if (deadlineFilter === 'Under 15 Days' && diffDays > 15) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort logic
      if (sortBy === 'Latest First') {
        return b.dateAdded - a.dateAdded;
      } else if (sortBy === 'Deadline Approaching') {
        return a.deadlineDate - b.deadlineDate;
      }
      return 0;
    });
  }, [
    mode,
    searchQuery,
    cityFilter,
    levelFilter,
    firmFilter,
    deadlineFilter,
    sidebarCities,
    sidebarLevels,
    sidebarFirms,
    sidebarJobTypes,
    sortBy,
    isAnyCityCheckboxActive,
    isAnyJobTypeCheckboxActive,
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
                  className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-500 font-semibold focus:outline-none focus:border-brandGreen focus:bg-white transition-all cursor-pointer"
                >
                  <option value="All">Select City</option>
                  {visibleCities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <select
                  value={levelFilter}
                  onChange={(e) => {
                    setLevelFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-500 font-semibold focus:outline-none focus:border-brandGreen focus:bg-white transition-all cursor-pointer"
                >
                  <option value="All">Select Level</option>
                  <option value="PRC / Articleship">PRC / Articleship</option>
                  <option value="CA Inter / ACCA">CA Inter / ACCA</option>
                  <option value="CA Final / ACCA Final">CA Final / ACCA Final</option>
                  <option value="Qualified (CAF / CFAP)">Qualified (CAF / CFAP)</option>
                  <option value="Experienced">Experienced</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <select
                  value={firmFilter}
                  onChange={(e) => {
                    setFirmFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-500 font-semibold focus:outline-none focus:border-brandGreen focus:bg-white transition-all cursor-pointer"
                >
                  <option value="All">Select Firm</option>
                  {visibleFirms.map((firm) => (
                    <option key={firm} value={firm}>{firm}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <select
                  value={deadlineFilter}
                  onChange={(e) => {
                    setDeadlineFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-500 font-semibold focus:outline-none focus:border-brandGreen focus:bg-white transition-all cursor-pointer"
                >
                  <option value="All">Deadline</option>
                  <option value="Under 7 Days">Under 7 Days</option>
                  <option value="Under 15 Days">Under 15 Days</option>
                </select>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-3 border-t border-gray-50 gap-3">
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
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 space-y-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center text-navy font-extrabold text-sm sm:text-base">
                <SlidersHorizontal className="w-4 h-4 mr-2 text-navy" />
                Filters
              </div>
              <button
                onClick={handleClearFilters}
                className="text-xs text-gray-400 hover:text-brandGreen font-bold transition-colors"
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

            {/* Level Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Level</h3>
              <div className="space-y-2.5">
                <label className="flex items-center text-xs sm:text-sm text-gray-600 cursor-pointer font-medium hover:text-navy">
                  <input
                    type="checkbox"
                    checked={!isAnyCheckboxActive(sidebarLevels)}
                    onChange={() => {
                      setSidebarLevels({
                        'PRC / Articleship': false,
                        'CA Inter / ACCA': false,
                        'CA Final / ACCA Final': false,
                        'Qualified (CAF / CFAP)': false,
                        Experienced: false
                      });
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 text-brandGreen border-gray-300 rounded focus:ring-brandGreen accent-brandGreen mr-2.5"
                  />
                  All Levels
                </label>
                {Object.keys(sidebarLevels).map((lvl) => (
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

            {/* Job Type Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Job Type</h3>
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

            <button
              onClick={() => {
                setCurrentPage(1);
                alert('Filters applied!');
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
                          </div>

                          {/* Horizontal Tags */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            <span className="inline-flex px-2.5 py-1 bg-gray-50 text-gray-500 border border-gray-100 rounded text-xs font-semibold">
                              {job.level}
                            </span>
                            <span className="inline-flex px-2.5 py-1 bg-gray-50 text-gray-500 border border-gray-100 rounded text-xs font-semibold">
                              {job.jobType}
                            </span>
                            <span className="inline-flex px-2.5 py-1 bg-gray-50 text-gray-500 border border-gray-100 rounded text-xs font-semibold items-center">
                              <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                              {job.location}
                            </span>
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
                  disabled={currentPage === totalPages}
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
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
          {/* Glass backdrop click handler */}
          <div
            onClick={() => setSelectedJob(null)}
            className="absolute inset-0 bg-navy/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl relative z-10 border border-gray-100 animate-fadeIn">

            {/* Modal Header */}
            <div className="p-6 bg-navy text-white flex items-start justify-between relative">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 flex-shrink-0">
                  {selectedJob.logoSvg}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold">{selectedJob.title}</h3>
                  <span className="text-xs font-semibold text-brandGreen">{selectedJob.company}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">

              {/* Job Stats Bar */}
              <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3.5 rounded-2xl text-center border border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Location</span>
                  <span className="text-xs font-extrabold text-navy mt-0.5">{selectedJob.location}</span>
                </div>
                <div className="flex flex-col border-x border-gray-200">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Job Type</span>
                  <span className="text-xs font-extrabold text-navy mt-0.5">{selectedJob.jobType}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Deadline</span>
                  <span className="text-xs font-extrabold text-red-500 mt-0.5">{selectedJob.deadline}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2.5">
                <h4 className="text-sm font-bold text-navy uppercase tracking-wider">Job Description</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  {selectedJob.description}
                </p>
              </div>

              {/* Requirements checklist */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-navy uppercase tracking-wider">Eligibility Requirements</h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 font-medium">
                  {selectedJob.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-brandGreen mr-2.5 mt-0.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>



            </div>
          </div>
        </div>
      )}

    </div>
  );
}
