

export const pwcLogo = (
  <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="12" fill="#FAF5FF" />
    <path d="M30 45h12v12H30V45z" fill="#D24626" />
    <path d="M42 45h12v12H42V45z" fill="#EB8C00" />
    <path d="M42 57h12v12H42V57z" fill="#F3BE12" />
    <path d="M54 33h12v12H54V33z" fill="#40281E" />
    <path d="M54 45h12v12H54V45z" fill="#D24626" />
    <text x="30" y="82" fill="#1C1C1C" fontSize="16" fontWeight="bold" fontFamily="sans-serif">pwc</text>
  </svg>
);

export const eyLogo = (
  <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="12" fill="#FFFDE7" />
    <path d="M25 60 L60 60 L75 30 L40 30 Z" fill="#FFE000" />
    <text x="28" y="52" fill="#111827" fontSize="22" fontWeight="bold" fontFamily="sans-serif">EY</text>
  </svg>
);

export const kpmgLogo = (
  <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="12" fill="#EEF2FF" />
    <path d="M25 22h8v10h-8V22zm16 0h8v10h-8V22zm16 0h8v10h-8V22z" fill="#0A5EA7" />
    <text x="18" y="66" fill="#0A5EA7" fontSize="22" fontWeight="900" letterSpacing="-1" fontFamily="sans-serif">KPMG</text>
  </svg>
);

export const bdoLogo = (
  <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="12" fill="#EFF6FF" />
    <path d="M15 25 H85 V30 H15 Z" fill="#D24626" />
    <text x="22" y="65" fill="#0A5EA7" fontSize="24" fontWeight="800" fontFamily="sans-serif">BDO</text>
  </svg>
);

export const INITIAL_JOBS = [
  {
    id: 1,
    company: 'PwC Pakistan',
    companyKey: 'pwc',
    title: 'Articleship / Internship Program',
    location: 'Lahore',
    level: 'CA Inter / ACCA',
    badge: 'CA Inter / ACCA',
    jobType: 'Articleship',
    deadline: '31 May 2024',
    deadlineDate: new Date('2024-05-31'),
    dateAdded: new Date('2026-06-08'),
    isNew: true,
    logoBg: 'bg-amber-500/10',
    description: 'PwC Pakistan offers rich learning opportunities through its annual Articleship and Internship program. Trainees will gain hands-on experience in Audit, Tax, and Advisory services under the guidance of seasoned professionals.',
    requirements: [
      'CA Inter (passed minimum 2 groups) or ACCA Affiliate/Student (passed at least 9 papers)',
      'Strong analytical and communication skills',
      'Proficiency in MS Excel and analytical tools',
      'Willingness to travel for audit assignments'
    ],
    logoSvg: pwcLogo
  },
  {
    id: 2,
    company: 'Deloitte Pakistan',
    companyKey: 'deloitte',
    title: 'Audit Internship - Summer 2024',
    location: 'Karachi',
    level: 'CA Inter / ACCA',
    badge: 'CA Inter / ACCA',
    jobType: 'Internship',
    deadline: '28 May 2024',
    deadlineDate: new Date('2024-05-28'),
    dateAdded: new Date('2026-06-07'),
    isNew: true,
    logoBg: 'bg-black/5',
    description: 'Join Deloitte Pakistan as an Audit Intern and work on client engagements in diverse industries. You will perform substantive testing, verify account balances, and assist in preparing statutory financial statements.',
    requirements: [
      'CA Inter or ACCA student (minimum F1-F9 cleared)',
      'Basic knowledge of International Financial Reporting Standards (IFRS)',
      'Exceptional critical thinking and problem-solving abilities',
      'Strong written and verbal English skills'
    ],
    logoSvg: (
      <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="12" fill="#F8FAFC" />
        <text x="12" y="55" fill="#111827" fontSize="18" fontWeight="900" fontFamily="sans-serif">Deloitte</text>
        <circle cx="82" cy="51" r="4" fill="#00C853" />
      </svg>
    )
  },
  {
    id: 3,
    company: 'EY Pakistan',
    companyKey: 'ey',
    title: 'Assurance Internship Program',
    location: 'Islamabad',
    level: 'CA Inter / ACCA',
    badge: 'CA Inter / ACCA',
    jobType: 'Internship',
    deadline: '25 May 2024',
    deadlineDate: new Date('2024-05-25'),
    dateAdded: new Date('2026-06-06'),
    isNew: true,
    logoBg: 'bg-yellow-500/10',
    description: 'EY Assurance services help clients protect and maintain investor trust. As an intern, you will receive intensive training on EY Global Audit Methodology and collaborate on real-world audit assignments.',
    requirements: [
      'CA Inter / ACCA part-qualified candidates',
      'Solid command over accounting standards and audit principles',
      'Attentive to detail and highly organized',
      'Ability to thrive in dynamic, fast-paced team environments'
    ],
    logoSvg: eyLogo
  },
  {
    id: 4,
    company: 'BDO Pakistan',
    companyKey: 'bdo',
    title: 'Audit & Assurance - Articleship',
    location: 'Lahore',
    level: 'CA Inter / ACCA',
    badge: 'CA Inter / ACCA',
    jobType: 'Articleship',
    deadline: '30 May 2024',
    deadlineDate: new Date('2024-05-30'),
    dateAdded: new Date('2026-06-05'),
    isNew: false,
    logoBg: 'bg-blue-500/10',
    description: 'BDO Pakistan is offering articleship contracts for CA students under ICAP guidelines. This program is designed to develop complete professionals with cross-functional expertise in audit and taxation.',
    requirements: [
      'CA Intermediate (CAF passed) candidates eligible for ICAP training registry',
      'Proficient in standard software applications (MS Office)',
      'Ethical mindset and commitment to professional standards',
      'Excellent collaborative skills'
    ],
    logoSvg: bdoLogo
  },
  {
    id: 5,
    company: 'KPMG Pakistan',
    companyKey: 'kpmg',
    title: 'Audit Internship Program',
    location: 'Karachi',
    level: 'CA Inter / ACCA',
    badge: 'CA Inter / ACCA',
    jobType: 'Internship',
    deadline: '27 May 2024',
    deadlineDate: new Date('2024-05-27'),
    dateAdded: new Date('2026-06-04'),
    isNew: true,
    logoBg: 'bg-blue-900/10',
    description: 'KPMG Pakistan provides an immersive internship experience in Audit & Assurance. You will work side-by-side with experts to execute financial statement audits for multi-national clients.',
    requirements: [
      'CA Inter / ACCA Student / Affiliate',
      'Familiarity with ISA (International Standards on Auditing)',
      'Highly analytical mind with strong communication skills',
      'Willingness to learn and take ownership of tasks'
    ],
    logoSvg: kpmgLogo
  },
  {
    id: 6,
    company: 'Grant Thornton Pakistan',
    companyKey: 'grant_thornton',
    title: 'Articleship Opportunity',
    location: 'Lahore',
    level: 'CA Inter / ACCA',
    badge: 'CA Inter / ACCA',
    jobType: 'Articleship',
    deadline: '02 June 2024',
    deadlineDate: new Date('2024-06-02'),
    dateAdded: new Date('2026-06-03'),
    isNew: false,
    logoBg: 'bg-purple-900/10',
    description: 'Grant Thornton Pakistan invites CA students to apply for Articleship vacancies. Work in an environment that fosters professional development, technical excellence, and client-centric solutions.',
    requirements: [
      'CAF Qualified or ACCA Affiliate',
      'Sound conceptual clarity on double-entry bookkeeping',
      'Strong interpersonal and report writing skills',
      'Motivated to pursue corporate audits'
    ],
    logoSvg: (
      <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="12" fill="#FAF5FF" />
        <circle cx="50" cy="50" r="30" fill="#E8D5C4" opacity="0.3" />
        <path d="M40 35 H60 V40 H40 Z" fill="#5F249F" />
        <text x="24" y="72" fill="#5F249F" fontSize="32" fontWeight="900" fontFamily="sans-serif">G</text>
        <text x="50" y="72" fill="#5F249F" fontSize="32" fontWeight="900" fontFamily="sans-serif">T</text>
      </svg>
    )
  },
  {
    id: 7,
    company: 'A.F. Ferguson & Co.',
    companyKey: 'affco',
    title: 'Graduate Trainee - Advisory',
    location: 'Karachi',
    level: 'Qualified (CAF / CFAP)',
    badge: 'Qualified (CAF / CFAP)',
    jobType: 'Full Time',
    deadline: '15 June 2024',
    deadlineDate: new Date('2024-06-15'),
    dateAdded: new Date('2026-06-02'),
    isNew: true,
    logoBg: 'bg-orange-500/10',
    description: 'A.F. Ferguson & Co. (PwC Pakistan) is looking for Graduate Trainees for their Risk Advisory department in Karachi. This role involves assessing risk management practices and consulting with major public and private enterprises.',
    requirements: [
      'CA CFAP candidates or qualified ACCA members',
      'Knowledge of risk frameworks (COSO, ISO etc.) is a plus',
      'Analytical and strategic thinker',
      'Superb client negotiation and presentation abilities'
    ],
    logoSvg: (
      <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="12" fill="#FFF8F2" />
        <text x="20" y="55" fill="#D24626" fontSize="24" fontWeight="bold" fontFamily="sans-serif">AFF</text>
        <text x="20" y="78" fill="#1C1C1C" fontSize="12" fontWeight="bold" fontFamily="sans-serif">Ferguson</text>
      </svg>
    )
  },
  {
    id: 8,
    company: 'Crowe Pakistan',
    companyKey: 'crowe',
    title: 'Taxation Associate',
    location: 'Islamabad',
    level: 'CA Final / ACCA Final',
    badge: 'CA Final / ACCA Final',
    jobType: 'Full Time',
    deadline: '10 June 2024',
    deadlineDate: new Date('2024-06-10'),
    dateAdded: new Date('2026-06-01'),
    isNew: false,
    logoBg: 'bg-sky-500/10',
    description: 'Crowe Pakistan is seeking a Taxation Associate to join our Islamabad team. You will prepare corporate tax returns, assist clients with tax audit processes, and conduct research on corporate tax laws.',
    requirements: [
      'ACCA Finalist / CA CFAP Student',
      '1-2 years experience in tax compliance is highly preferred',
      'Deep interest in Pakistani direct & indirect tax laws',
      'Capable of managing filings on FBR portal'
    ],
    logoSvg: (
      <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="12" fill="#F0F9FF" />
        <path d="M30 35 L70 35 L50 65 Z" fill="#005B94" />
        <text x="22" y="82" fill="#005B94" fontSize="16" fontWeight="bold" fontFamily="sans-serif">CROWE</text>
      </svg>
    )
  },
  {
    id: 9,
    company: 'EY Pakistan',
    companyKey: 'ey',
    title: 'PRC Induction - Audit Trainee',
    location: 'Multan',
    level: 'PRC / Articleship',
    badge: 'PRC / Articleship',
    jobType: 'Articleship',
    deadline: '22 May 2024',
    deadlineDate: new Date('2024-05-22'),
    dateAdded: new Date('2026-05-20'),
    isNew: false,
    logoBg: 'bg-yellow-500/10',
    description: 'EY Multan branch is hiring audit trainees under the PRC guidelines. Start your professional audit journey with hands-on practice, client exposures, and excellent peer mentorship.',
    requirements: [
      'PRC qualified candidates eligible for immediate registration',
      'Dedicated, prompt, and eager to acquire skills',
      'Good teamwork aptitude',
      'Basic accounting knowledge'
    ],
    logoSvg: eyLogo
  },
  {
    id: 10,
    company: 'KPMG Pakistan',
    companyKey: 'kpmg',
    title: 'Experienced Senior Auditor',
    location: 'Karachi',
    level: 'Experienced',
    badge: 'Experienced',
    jobType: 'Full Time',
    deadline: '18 June 2024',
    deadlineDate: new Date('2024-06-18'),
    dateAdded: new Date('2026-05-18'),
    isNew: false,
    logoBg: 'bg-blue-900/10',
    description: 'We are seeking an Experienced Senior Auditor to lead challenging engagements. This position offers swift career acceleration and the responsibility to supervise, train, and guide junior audit trainees.',
    requirements: [
      'CA Qualified or ACCA Member',
      '2+ years of post-qualification experience in a Big 4 firm',
      'Strong command over auditing standards (ISAs) and IFRS',
      'Proven leadership and client relationship skills'
    ],
    logoSvg: kpmgLogo
  },
  {
    id: 11,
    company: 'PwC Pakistan',
    companyKey: 'pwc',
    title: 'Advisory Intern',
    location: 'Peshawar',
    level: 'CA Inter / ACCA',
    badge: 'CA Inter / ACCA',
    jobType: 'Internship',
    deadline: '05 June 2024',
    deadlineDate: new Date('2024-06-05'),
    dateAdded: new Date('2026-05-15'),
    isNew: false,
    logoBg: 'bg-amber-500/10',
    description: 'Join PwC Peshawar Advisory practice. This internship is designed for young professional candidates looking to gain experience in corporate strategy, restructuring, and feasibility analysis.',
    requirements: [
      'ACCA Part-Qualified or CA Intermediate student',
      'Strong presentation and analytical writing capabilities',
      'Quick learner with research skills',
      'Based in or willing to relocate to Peshawar'
    ],
    logoSvg: pwcLogo
  },
  {
    id: 12,
    company: 'BDO Pakistan',
    companyKey: 'bdo',
    title: 'Tax Associate - Contractual',
    location: 'Lahore',
    level: 'CA Final / ACCA Final',
    badge: 'CA Final / ACCA Final',
    jobType: 'Contract',
    deadline: '20 June 2024',
    deadlineDate: new Date('2024-06-20'),
    dateAdded: new Date('2026-05-10'),
    isNew: false,
    logoBg: 'bg-blue-500/10',
    description: 'BDO Lahore is hiring a Tax Associate on a 6-month contract. Perfect opportunity to work closely with corporate tax consultants and enhance your tax advisory skills.',
    requirements: [
      'CA Inter / ACCA Affiliate',
      'Prior exposure to sales tax returns and direct tax audit procedures is preferred',
      'Dedicated, reliable and detail-oriented',
      'Immediate availability'
    ],
    logoSvg: bdoLogo
  },
  {
    id: 13,
    company: 'PwC Middle East',
    companyKey: 'pwc',
    title: 'Audit & Assurance Senior',
    location: 'Dubai, UAE',
    level: 'Qualified (CAF / CFAP)',
    badge: 'Qualified CA / ACCA',
    jobType: 'Full Time',
    deadline: '28 June 2026',
    deadlineDate: new Date('2026-06-28'),
    dateAdded: new Date('2026-06-12'),
    isNew: true,
    isOverseas: true,
    logoBg: 'bg-amber-500/10',
    description: 'PwC Middle East is looking for experienced Audit Seniors to join our growing assurance practice in Dubai. You will lead audit teams, perform complex audit procedures, and engage directly with key clients across diverse industries.',
    requirements: [
      'Qualified CA (ICAP) or ACCA Member',
      '2+ years of external audit experience in a reputable firm',
      'Strong knowledge of IFRS and International Standards on Auditing',
      'Excellent leadership and communication skills'
    ],
    logoSvg: pwcLogo
  },
  {
    id: 14,
    company: 'EY Saudi Arabia',
    companyKey: 'ey',
    title: 'Senior Consultant - Risk Advisory',
    location: 'Riyadh, KSA',
    level: 'Qualified (CAF / CFAP)',
    badge: 'CA / ACCA / CIA',
    jobType: 'Full Time',
    deadline: '30 June 2026',
    deadlineDate: new Date('2026-06-30'),
    dateAdded: new Date('2026-06-10'),
    isNew: true,
    isOverseas: true,
    logoBg: 'bg-yellow-500/10',
    description: 'Join EY Riyadh team as a Senior Risk Consultant. You will assist corporate clients in evaluating and implementing robust risk management frameworks, internal controls, and compliance procedures.',
    requirements: [
      'Qualified CA, ACCA, or Certified Internal Auditor (CIA)',
      '3+ years of experience in internal audit or advisory services',
      'Familiarity with corporate governance and risk management methodologies',
      'Fluency in English (Arabic is a plus)'
    ],
    logoSvg: eyLogo
  },
  {
    id: 15,
    company: 'KPMG UK',
    companyKey: 'kpmg',
    title: 'Audit Assistant Manager',
    location: 'London, UK',
    level: 'Experienced',
    badge: 'Qualified CA / ACCA',
    jobType: 'Full Time',
    deadline: '15 July 2026',
    deadlineDate: new Date('2026-07-15'),
    dateAdded: new Date('2026-06-08'),
    isNew: false,
    isOverseas: true,
    logoBg: 'bg-blue-900/10',
    description: 'KPMG UK is seeking qualified Audit Assistant Managers for their London office. You will oversee large-scale audit engagements, manage team deliverables, and ensure compliance with auditing standards.',
    requirements: [
      'Fully qualified CA (ICAP / ICAEW) or ACCA Member',
      'Minimum 4 years of audit experience (with 1 year at senior level)',
      'Expertise in financial services or large corporate sectors',
      'Eligible for UK skilled worker visa sponsorship'
    ],
    logoSvg: kpmgLogo
  }
];
