export const SEED_ADMIN = {
  name: 'Saboor Ahmad',
  email: 'admin@taxmancapital.com',
  username: 'admin',
  password: 'AdminPassword123!',
  role: 'admin',
  qualification: 'Qualified',
  level: 'Qualified',
  phone: '+92 300 1234567',
  city: 'Lahore',
  institute: 'ICAP / ACCA Global',
  bio: 'Lead Career Mentor, Big 4 Placement Consultant, and Founder of The TaxMan\'s Capital.'
};

export const SEED_STUDENT = {
  name: 'Muhammad Ahmed',
  email: 'student@taxmancapital.com',
  username: 'student_ahmed',
  password: 'StudentPassword123!',
  role: 'student',
  qualification: 'CAF',
  level: 'CAF',
  phone: '+92 300 9876543',
  city: 'Lahore',
  institution: 'PAC / SKANS',
  papersCleared: 6,
  bio: 'CA Intermediate aspirant preparing for Big 4 audit articleship inductions.'
};

export const SEED_MENTOR = {
  name: 'Usman Saleem',
  email: 'mentor@taxmancapital.com',
  username: 'mentor_usman',
  password: 'MentorPassword123!',
  role: 'mentor',
  qualification: 'Qualified',
  level: 'Qualified',
  phone: '+92 321 5554321',
  city: 'Islamabad',
  institute: 'PwC Alum',
  bio: 'Senior Audit Manager with 8+ years experience guiding CA & ACCA candidates.'
};

export const SEED_MODERATOR = {
  name: 'Hamza Content Lead',
  email: 'moderator@taxmancapital.com',
  username: 'moderator',
  password: 'ModeratorPassword123!',
  role: 'moderator',
  qualification: 'CAF',
  level: 'CAF',
  phone: '+92 300 7654321',
  city: 'Lahore',
  institute: 'ICAP Student',
  bio: 'Content Operations & Resource Curator for The TaxMan\'s Capital.'
};

export const SEED_JOBS = [
  {
    title: 'CA Articleship Training Induction',
    company: 'A.F. Ferguson & Co. (PwC Pakistan)',
    companyLogo: '',
    description: 'A.F. Ferguson & Co. (a member firm of the PwC network) invites applications from energetic, highly motivated CA CAF qualified candidates for its Fall training induction batch in Assurance & Business Advisory Services.\n\nTrainees will gain comprehensive exposure to statutory financial audits, internal control reviews, IFRS compliance, and client risk assessments across leading multinational corporations and financial institutions in Pakistan.',
    requirements: [
      'CAF Qualified from ICAP (all 8 papers cleared)',
      'Strong conceptual clarity in IFRS and International Standards on Auditing (ISAs)',
      'Proficiency in Microsoft Excel, data analytics, and verbal communication',
      'High standard of professional ethics, integrity, and time management'
    ],
    responsibilities: [
      'Execute substantive testing and tests of controls under ISA 330',
      'Perform analytical reviews on balance sheet and profit and loss line items',
      'Assist in drafting audit findings, management letters, and client memos'
    ],
    location: 'Lahore, Karachi, Islamabad',
    city: 'Lahore',
    country: 'Pakistan',
    workMode: 'On-site',
    jobType: 'Articleship',
    category: 'Audit',
    salary: 'ICAP Standard Stipend (Rs. 29,700/mo)',
    stipend: 'Rs. 29,700 / month',
    qualification: 'CAF / CA Inter',
    level: 'CAF / CA Inter',
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    isOverseas: false,
    featured: true
  },
  {
    title: 'ACCA Finalist Assurance Internship',
    company: 'EY Ford Rhodes',
    companyKey: 'ey',
    companyLogo: '',
    description: 'EY Pakistan is hiring ACCA Finalists for its 8-week corporate Assurance & Tax Internship program. Gain real audit room experience, perform client substantive testing, and work alongside seasoned Big 4 audit managers.',
    requirements: [
      'ACCA Finalist (passed Applied Skills, attempting Strategic Professional exams)',
      'Strong grasp of IFRS standards and auditing principles',
      'Analytical aptitude and high attention to detail'
    ],
    responsibilities: [
      'Assist audit engagement teams with working papers and bank confirmations',
      'Test internal financial controls under International Standards on Auditing',
      'Participate in stock-count observations and analytical reconciliations'
    ],
    location: 'Karachi, Lahore, Islamabad',
    city: 'Karachi',
    country: 'Pakistan',
    workMode: 'On-site',
    jobType: 'Internship',
    category: 'Audit',
    salary: 'Rs. 25,000 / month',
    stipend: 'Rs. 25,000 / month',
    qualification: 'ACCA Finalist',
    level: 'ACCA Finalist',
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    isOverseas: false,
    featured: true
  },
  {
    title: 'Senior Auditor - Assurance (CA Qualified)',
    company: 'PwC Middle East',
    companyLogo: '',
    description: 'PwC Middle East is seeking high-performing Qualified Chartered Accountants (ICAP ACA / FCA) with 2-4 years of external audit experience for its Dubai and Abu Dhabi assurance practices. Package includes tax-free salary, relocation allowance, visa sponsorship, and private medical insurance.',
    requirements: [
      'Qualified CA (ICAP/ICAEW) or ACCA Member',
      '2+ years post-qualification external audit experience in Big 4',
      'Demonstrated leadership in managing engagement field teams'
    ],
    responsibilities: [
      'Lead statutory audits for tier-1 regional banks, real estate, and energy clients',
      'Review working paper files and supervise junior associates',
      'Coordinate directly with Partner and client C-suite executives'
    ],
    location: 'Dubai, UAE',
    city: 'Dubai, UAE',
    country: 'United Arab Emirates',
    workMode: 'On-site',
    jobType: 'Full Time',
    category: 'Audit',
    salary: 'AED 16,000 - 22,000 / month (Tax Free)',
    qualification: 'CA Qualified',
    level: 'CA Qualified',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    isOverseas: true,
    featured: true
  },
  {
    title: 'Audit Senior (CA Finalist Hire - Articles Completed)',
    company: 'KPMG Saudi Arabia (Gulf Practice)',
    companyLogo: '',
    description: 'KPMG Saudi Arabia has an open hiring pipeline specifically for CA Finalists who have completed their 3.5 years of articleship in Pakistan. Position offers tax-free Gulf compensation, Saudi work visa, and rapid career progression in Riyadh.',
    requirements: [
      'CA Finalist (Articleship fully completed from Big 4 / top-10 CA firm in Pakistan)',
      'Demonstrated audit senior experience leading engagement teams',
      'High technical clarity in IFRS revenue recognition and leasing',
      'Available for prompt overseas deployment to Riyadh'
    ],
    responsibilities: [
      'Manage fieldwork audit teams across large Saudi corporations',
      'Draft ISA-compliant audit deliverables and management letters',
      'Facilitate audit reporting to Partners and client audit committees'
    ],
    location: 'Riyadh, KSA',
    city: 'Riyadh, KSA',
    country: 'Saudi Arabia',
    workMode: 'On-site',
    jobType: 'Full Time',
    category: 'Audit',
    salary: 'SAR 14,000 - 18,000 / month (Tax Free)',
    qualification: 'CA Finalist',
    level: 'CA Finalist',
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    isOverseas: true,
    featured: true
  },
  {
    title: 'Virtual Financial Controller (Remote UK/US Practice)',
    company: 'Global Offshore CFO Advisory',
    companyLogo: '',
    description: 'Work from home as a Virtual Financial Controller managing financial consolidation, monthly management accounts, and cash flow forecasting for UK and European SME clients.',
    requirements: [
      'Qualified CA or ACCA Member with 2+ years experience',
      'Comprehensive understanding of US GAAP or UK GAAP (FRS 102)',
      'Hands-on mastery of NetSuite, Xero, or QuickBooks',
      'Dedicated remote home office setup'
    ],
    responsibilities: [
      'Deliver monthly management accounts and variance analyses',
      'Oversee offshore accounts payable, receivable, and VAT filings',
      'Lead quarterly financial forecasting models for overseas executive leadership'
    ],
    location: 'Remote, Pakistan',
    city: 'Islamabad',
    country: 'Pakistan',
    workMode: 'Virtual / Remote',
    jobType: 'Full Time',
    category: 'Finance',
    salary: 'Rs. 250,000 - 350,000 / month',
    qualification: 'CA Qualified',
    level: 'CA Qualified',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isOverseas: false,
    featured: true
  }
];

export const SEED_RESOURCES = [
  {
    title: 'Professional Big 4 CV Template (CA/ACCA Student)',
    description: 'Recruiter-approved, ATS-friendly curriculum vitae template specially formatted for CA CAF & ACCA firm induction applications.',
    category: 'Training/Induction',
    qualification: 'Both',
    resourceType: 'DOCX',
    tag: 'CV Template',
    downloads: 485,
    fileUrl: 'https://res.cloudinary.com/taxmancapital/sample_cv_template.docx',
    featured: true,
    isFeatured: true
  },
  {
    title: 'Top 50 Big 4 Audit Interview Questions & Technical Answers',
    description: 'Comprehensive handbook compiling actual technical and partner-round questions asked at PwC, EY, KPMG, and Deloitte in Pakistan.',
    category: 'Training/Induction',
    qualification: 'Both',
    resourceType: 'PDF',
    tag: 'Interview Prep',
    downloads: 620,
    fileUrl: 'https://res.cloudinary.com/taxmancapital/audit_interview_questions.pdf',
    featured: true,
    isFeatured: true
  },
  {
    title: 'CAF-5 Audit & Assurance (AAA) Quick Revision Notes',
    description: 'Standard-by-standard revision summary covering ISA 200 through ISA 700 with key assertion tables and exam checklists.',
    category: 'CAF',
    qualification: 'CA',
    resourceType: 'PDF',
    tag: 'Study Notes',
    downloads: 780,
    fileUrl: 'https://res.cloudinary.com/taxmancapital/caf5_audit_notes.pdf',
    featured: true,
    isFeatured: true
  },
  {
    title: 'Pakistan Income Tax Law Cheat Sheet (Finance Act 2024)',
    description: 'Consolidated summary of corporate and individual tax slabs, minimum tax rules under Section 113, and major tax credits.',
    category: 'CAF',
    qualification: 'Both',
    resourceType: 'PDF',
    tag: 'Tax Law',
    downloads: 910,
    fileUrl: 'https://res.cloudinary.com/taxmancapital/tax_cheat_sheet.pdf',
    featured: false,
    isFeatured: false
  }
];

export const SEED_COMMUNITY_GROUPS = [
  {
    title: 'PRC Entry-Level CA Discussion Group',
    categoryKey: 'prc',
    badge: 'PRC Group',
    description: 'Dedicated study group for CA Foundation & PRC students with daily quiz questions and study tips.',
    membersCountText: '2,400+ Active Members',
    whatsappLink: 'https://chat.whatsapp.com/sample_prc_group'
  },
  {
    title: 'CAF Intermediate Official Study Hub',
    categoryKey: 'caf',
    badge: 'CAF Group',
    description: 'Moderated peer-to-peer discussions for CAF 1 through CAF 8 subjects, past paper solutions, and teacher recommendations.',
    membersCountText: '4,800+ Active Members',
    whatsappLink: 'https://chat.whatsapp.com/sample_caf_group'
  },
  {
    title: 'Big 4 Induction & Articleship Alerts Network',
    categoryKey: 'cfap',
    badge: 'Inductions Alert',
    description: 'Real-time announcements on firm induction tests, interview dates, shortlist rosters, and registration registries.',
    membersCountText: '6,200+ Active Members',
    whatsappLink: 'https://chat.whatsapp.com/sample_induction_group'
  },
  {
    title: 'ACCA Pakistan & Global Support Community',
    categoryKey: 'acca',
    badge: 'ACCA Group',
    description: 'Practical Experience Requirement (PER) guidance, approved employer vacancies, and global exam session tips.',
    membersCountText: '3,250+ Active Members',
    whatsappLink: 'https://chat.whatsapp.com/sample_acca_group'
  }
];
