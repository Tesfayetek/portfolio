import {
  ProfileData,
  MetricBenchmark,
  SkillDomain,
  CaseStudy,
  ExperienceRecord,
  EducationRecord,
  CertificationRecord,
  AwardRecord,
  AuditActivity,
  LanguageItem,
} from '../types';

export const ASSETS = {
  headerThumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeXHzj_ZVkbTAvk7o6b1AZG0uvIs_AyNrrJMMaA41qzD2Hfv_Q9vqoj1dbQB8F5mRZl3x9GZxLT1VYFBtUVhmygxOXGoTwaYR7ANUR7AAN1pgwMzJKG4IcTirCNztmLq1KdVyZ1_yOsIpShpIUICjHAJ-1BUrSg4_cxalnGJx9pxfVa4OVTmsqo_Yh6XvHmNufjiX1aHykN-TT-K8E1FGcFOVQ-oQOH7JIcgnQAwxD0Kn_-gYsAtZa9A',
  adminPortrait: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY9A8S6UvKFGj2oR_Ss2ouxueP8c6wMTki_96CfAIpKGPl6lxEv2ooOkHPyK6BgKh-Rpj-MdhMoz4v6VeMe6zensv0WO5XLRwMV6sZ4RUrnZvU6kqfJAxL06zhP_ue5suyNnoDfpa3qEMwLOgXtEbAO83E9KPO-6jIP8LEJAtjm6FaMQltllLMIw9kXFtnAq77fjN3nAp0DHGQ_-0Y6WLYGCzciCPfYCamncRZdkzx6dwb7bJReVl3Dg',
  caseStudyBanking: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByr6i_MR-RTWNI65Rp-ZsUA9yIoFdS-M6-TUQGYrwS-6RXCmseqaeu8sCPzEyXVYYeXxGR0sdbAfJ_KaapO0i1LSDfc8qYAy3JY4HM64gwmcA1g1LJv9ocz58vN6c2W2ynqGY97CclhMXxnlmBxgqwqPZvyPc50l2CV08HZe6q7htl6REeBm7tnSvfPtK_ermEYVqG0SY3v-xb0rtmf6nz6luqxFS7omCQeAKd-rAjAxrQZZWvDbrPmg',
  caseStudyOmnichannel: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlUtbfQphd0NeFnBjl5cIBSAm5jQWgZqnx-4e5YguLpHrTsGRiNNeeIzrfcqzXfA3ZKh7MK4OENNbC8u65sMejJOl45kGzW_K1diYsG0ruM41TiCtOpLtkhnsLtdQaAd8_1BU1CcDNrtKthVfn6P_myy-FMI_c1mu7aEyz8hhbTydlFtJt-cF5RXeM92SN6tBRWgXFedMYxl9M2f9HXyqVc6AObJgjTWkvybnjQFRL_wKaKVItC1jwFA',
  caseStudyData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnBejqHvhb_bCX2bcJ4VV-3y1XEkROaUBKt8WWpkhaNvT8jcALTYe8KCKQAb6yf75wa4-mo3GUy5bDFaq3coypUg-HrFV8dQvQ0EgiB93cQYkFixQHNR-QUy5i7cBlLl2kIqBoraCTgV9QD5D7-kVvm35iVmy44y4XGQeYicwGvIekz0NnMquOIxSCM_iDQK1nc0vQF4597x6Os4qiDuk6N6AR1NtrET0iRvxI-rqMkK4t0Nnmck65Sg'
};

export const INITIAL_PROFILE: ProfileData = {
  fullName: 'Tesfaye Teklu Feyissa',
  credentialTitle: 'System Support Application Officer | IT Systems | Database Administration',
  tagline: 'System Support Application Officer | IT Systems | Database Administration | Web Development',
  bio1: 'Dedicated IT professional with over a decade of experience in database administration, IT systems management, application support, networking, and web development.',
  bio2: 'Skilled in optimizing IT infrastructure, maintaining data integrity, managing enterprise applications, delivering practical technology solutions, and collaborating across teams to achieve strategic organizational objectives.',
  email: 'contactesfaye@gmail.com',
  phone: '+251-932083373',
  linkedIn: 'linkedin.com/in/tesfaye-teklu',
  github: 'github.com/tesfayeteklu',
  website: 'http://www.tesfayeteklu.com',
  location: 'Addis Ababa, Ethiopia',
  executiveTitleRank: 'System Support Application Officer',
  boardAbstract: 'Over a decade of enterprise IT experience across Ethiopian Reinsurance S.C., Urban Revenue Reform Project Office, and national regulatory agencies with specialized command of Oracle DBA, network administration, and enterprise application support.'
};

export const INITIAL_BENCHMARKS: MetricBenchmark = {
  years: '10+',
  certifications: '6',
  projects: '4+',
  pillars: '5',
  governedValue: 'Enterprise'
};

export const INITIAL_LANGUAGES: LanguageItem[] = [
  {
    language: 'Amharic',
    proficiency: 'Native',
    flagCode: 'ET'
  },
  {
    language: 'English',
    proficiency: 'Proficient',
    flagCode: 'EN'
  }
];

export const SKILL_DOMAINS: SkillDomain[] = [
  {
    id: 'database',
    title: 'Database Management',
    icon: 'dns',
    tierBadge: 'Core Discipline',
    tierClass: 'bg-primary/10 text-primary',
    skills: [
      { name: 'Oracle', level: 'Expert' },
      { name: 'MySQL', level: 'Expert' }
    ]
  },
  {
    id: 'networking',
    title: 'Networking',
    icon: 'hub',
    tierBadge: 'Infrastructure',
    tierClass: 'bg-secondary/10 text-secondary',
    skills: [
      { name: 'Cisco Networking', level: 'Expert' },
      { name: 'Network Security', level: 'Advanced' }
    ]
  },
  {
    id: 'web',
    title: 'Web Development',
    icon: 'code',
    tierBadge: 'Full Stack',
    tierClass: 'bg-[#D97706]/10 text-[#D97706]',
    skills: [
      { name: 'HTML', level: 'Expert' },
      { name: 'CSS', level: 'Expert' },
      { name: 'JavaScript', level: 'Expert' },
      { name: 'ASP.NET', level: 'Expert' }
    ]
  },
  {
    id: 'os',
    title: 'Operating Systems',
    icon: 'computer',
    tierBadge: 'Systems Administration',
    tierClass: 'bg-primary/10 text-primary',
    skills: [
      { name: 'Windows Server', level: 'Expert' },
      { name: 'Linux', level: 'Advanced' }
    ]
  },
  {
    id: 'tools',
    title: 'Tools & Utilities',
    icon: 'construction',
    tierBadge: 'Production Stack',
    tierClass: 'bg-surface-container-high text-on-surface-variant',
    skills: [
      { name: 'VMware', level: 'Expert' },
      { name: 'cPanel', level: 'Expert' },
      { name: 'Git', level: 'Advanced' }
    ]
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case_yerora',
    title: 'Yerora.com',
    role: 'Lead Web Architect & Developer',
    year: 'E-Commerce Platform',
    domain: 'Online Retail',
    summary: 'Designed and developed a robust e-commerce platform with product catalogs, shopping cart flow, secure checkout, and performant backend data integration.',
    detailedImpact: [
      'Designed and developed an intuitive, responsive e-commerce storefront for mobile and desktop shoppers.',
      'Configured cPanel deployment, MySQL database normalization, and secure checkout workflows.',
      'Implemented automated inventory management and order notification systems.'
    ],
    techTags: ['E-Commerce', 'Web Development', 'HTML/CSS/JS', 'MySQL', 'cPanel'],
    kpiHighlight: {
      icon: 'shopping_bag',
      text: 'Robust E-Commerce',
      colorClass: 'text-primary'
    },
    image: ASSETS.caseStudyOmnichannel
  },
  {
    id: 'case_urrpo',
    title: 'Urrpo.gov.et',
    role: 'Web & Systems Administrator',
    year: 'Official Portal',
    domain: 'Government & Public Sector',
    summary: 'Managed website development and ongoing maintenance for the Urban Revenue Reform Project Office, ensuring high availability, network security, and prompt public announcements.',
    detailedImpact: [
      'Managed end-to-end portal development, ongoing maintenance, and routine software updates.',
      'Enforced network security controls, SSL certificate management, and web server stability.',
      'Coordinated with organizational teams to publish revenue reform documentation and citizen notices.'
    ],
    techTags: ['Government Portal', 'Web Management', 'Network Security', 'Windows Server'],
    kpiHighlight: {
      icon: 'account_balance',
      text: 'Official Portal',
      colorClass: 'text-secondary'
    },
    image: ASSETS.caseStudyBanking
  },
  {
    id: 'case_ethiopiab2b',
    title: 'Ethiopiab2b.com',
    role: 'Full-Stack Developer',
    year: 'Online Delivery Platform',
    domain: 'B2B & Retail Apparel',
    summary: 'Created a comprehensive online delivery clothing store facilitating B2B apparel transactions with structured product categories, supplier inquiries, and fulfillment tracking.',
    detailedImpact: [
      'Created an end-to-end online clothing store and delivery platform tailored for B2B transactions.',
      'Developed dynamic product catalogs with ASP.NET, JavaScript, and database integration.',
      'Streamlined customer order processing, catalog categorization, and delivery coordination.'
    ],
    techTags: ['ASP.NET', 'Online Delivery Store', 'B2B Commerce', 'JavaScript', 'Database'],
    kpiHighlight: {
      icon: 'local_shipping',
      text: 'Online Delivery Store',
      colorClass: 'text-[#D97706]'
    },
    image: ASSETS.caseStudyData
  },
  {
    id: 'case_cadastral_qa',
    title: 'Cadastral & Real Property Registration System',
    role: 'QA Specialist & DBA',
    year: 'National System',
    domain: 'Software Testing & QA',
    summary: 'Conducted rigorous testing and quality assurance for a cadastral and real property registration system, ensuring data integrity, business logic compliance, and Oracle database stability.',
    detailedImpact: [
      'Executed thorough test plans, regression testing, and verification for national property titles.',
      'Validated Oracle database schema constraints, stored procedure executions, and rollback safety.',
      'Identified and documented software issues, coordinating with engineering teams for quality sign-off.'
    ],
    techTags: ['Software Testing', 'Quality Assurance', 'Oracle Database', 'Cadastral System', 'Data Integrity'],
    kpiHighlight: {
      icon: 'verified',
      text: 'Verified SQA',
      colorClass: 'text-primary'
    },
    image: ASSETS.caseStudyBanking
  }
];

export const INITIAL_EXPERIENCE: ExperienceRecord[] = [
  {
    id: 'exp_01',
    role: 'System Support Application Officer',
    company: 'Ethiopian Reinsurance S.C.',
    period: 'July 2025 – Present',
    location: 'Addis Ababa, Ethiopia',
    summary: 'Delivering day-to-day technical and functional support for enterprise business applications, comprehensive user access lifecycle governance, and incident root cause mitigation.',
    scopeMetric: 'Enterprise',
    scopeLabel: 'Reinsurance Applications',
    resiliencyMetric: '99.9%',
    resiliencyLabel: 'Service Availability',
    deliverables: [
      'Provide day-to-day technical and functional support for business applications.',
      'Create, modify, disable, and manage application user accounts.',
      'Manage user roles and permissions according to approved access requirements.',
      'Receive and analyze application-related incidents.',
      'Identify root causes of recurring problems.'
    ],
    active: true
  },
  {
    id: 'exp_02',
    role: 'Network and Hardware Administrator',
    company: 'Urban Revenue Reform Project Office',
    period: 'July 2018 – July 2025',
    location: 'Addis Ababa, Ethiopia',
    summary: 'Overseeing institutional IT systems and mission-critical network operations, deploying robust hardware/software infrastructures, and providing high-efficiency troubleshooting.',
    scopeMetric: '7 Years',
    scopeLabel: 'Network Governance',
    resiliencyMetric: 'Optimal',
    resiliencyLabel: 'Network & System Uptime',
    deliverables: [
      'Oversee IT systems and network operations to ensure optimal performance.',
      'Implement and maintain hardware and software solutions to support organizational goals.',
      'Collaborate with teams to troubleshoot and resolve technical issues efficiently.'
    ],
    active: false
  },
  {
    id: 'exp_03',
    role: 'Database Administrator',
    company: 'Federal Urban Land and Land-Related Property Registry and Information Agency',
    period: 'July 2017 – June 2018',
    location: 'Addis Ababa, Ethiopia',
    summary: 'Administered high-availability Oracle database systems vital to national land and property records, guaranteeing enterprise data security, backup resiliency, and performance.',
    scopeMetric: 'National',
    scopeLabel: 'Cadastral & Land Registry',
    resiliencyMetric: 'Zero Loss',
    resiliencyLabel: 'Backup & Recovery SLA',
    deliverables: [
      'Managed Oracle database systems critical to national land management.',
      'Ensured data security, integrity, and reliability.',
      'Optimized database performance and implemented backup and recovery strategies.'
    ],
    active: false
  },
  {
    id: 'exp_04',
    role: 'IT Expert',
    company: 'Ethiopian Fruit and Vegetable Market S.C.',
    period: 'July 2014 – July 2017',
    location: 'Addis Ababa, Ethiopia',
    summary: 'Spearheaded enterprise IT infrastructure expansion, user enablement, technical support, and comprehensive data management across corporate branches.',
    scopeMetric: '3 Years',
    scopeLabel: 'Infrastructure Leadership',
    resiliencyMetric: '100%',
    resiliencyLabel: 'User & System Support',
    deliverables: [
      'Spearheaded IT infrastructure projects to enhance operational efficiency.',
      'Provided technical support and training to staff.',
      'Maintained IT systems and ensured secure data management.'
    ],
    active: false
  },
  {
    id: 'exp_05',
    role: 'Database Administrator',
    company: 'Radiation Protection Authority',
    period: 'August 2013 – July 2014',
    location: 'Addis Ababa, Ethiopia',
    summary: 'Designed and administered secure Oracle databases supporting radiation regulation, compliance monitoring, and mission-critical executive decision support reporting.',
    scopeMetric: 'Regulatory',
    scopeLabel: 'Oracle Database Systems',
    resiliencyMetric: 'Secure',
    resiliencyLabel: 'Data Confidentiality',
    deliverables: [
      'Designed and managed Oracle databases to support organizational activities.',
      'Implemented database security measures to protect sensitive information.',
      'Developed reports to support decision-making processes.'
    ],
    active: false
  }
];

export const INITIAL_EDUCATION: EducationRecord[] = [
  {
    id: 'edu_01',
    degree: 'B.Sc.',
    field: 'Information Technology',
    institution: 'Addis Ababa University, Addis Ababa',
    honors: 'Conferred with Distinction',
    researchFocus: 'Comprehensive curriculum and hands-on projects in database management systems, network engineering, web application development, operating systems, and systems security.'
  }
];

export const INITIAL_CERTIFICATIONS: CertificationRecord[] = [
  {
    id: 'cert_oracle_11g',
    title: 'Oracle 11g: DBA Administration Workshop I',
    issuer: 'Oracle Corporation',
    level: 'Database Administration & Architecture',
    period: 'Certified',
    credentialId: 'ORA-11G-DBA-01',
    status: 'Active',
    verifyUrl: 'https://education.oracle.com',
    icon: 'dns'
  },
  {
    id: 'cert_cisco_ccna',
    title: 'Cisco CCNA Routing and Switching',
    issuer: 'Cisco Systems',
    level: 'Routing & Switching / Enterprise Network Infrastructure',
    period: 'Certified',
    credentialId: 'CSCO-CCNA-RS-02',
    status: 'Active',
    verifyUrl: 'https://www.cisco.com',
    icon: 'hub'
  },
  {
    id: 'cert_ms_server',
    title: 'Microsoft Windows Server 2012 R2 (Installing, Configuring, and Administering)',
    issuer: 'Microsoft Corporation',
    level: 'Server Infrastructure & Active Directory Administration',
    period: 'Certified',
    credentialId: 'MS-WS2012-R2-03',
    status: 'Active',
    verifyUrl: 'https://learn.microsoft.com',
    icon: 'computer'
  },
  {
    id: 'cert_asp_net',
    title: 'Web Application Development Using ASP.NET',
    issuer: 'Professional Development Program',
    level: 'Web Application & Backend Engineering',
    period: 'Certified',
    credentialId: 'ASPNET-DEV-04',
    status: 'Certified',
    verifyUrl: 'https://learn.microsoft.com',
    icon: 'code'
  },
  {
    id: 'cert_sqa',
    title: 'Software Testing and Quality Assurance',
    issuer: 'Professional Software Quality Certification',
    level: 'System Testing, Verification & Quality Assurance',
    period: 'Certified',
    credentialId: 'SQA-TEST-05',
    status: 'Certified',
    verifyUrl: '#',
    icon: 'verified'
  },
  {
    id: 'cert_appreciation',
    title: 'Certificate of Appreciation',
    issuer: 'Ethiopian Fruit and Vegetable Market S.C.',
    level: 'Recognition for IT Infrastructure & Operational Excellence',
    period: 'Honored',
    credentialId: 'EFVMSC-REC-06',
    status: 'Certified',
    verifyUrl: '#',
    icon: 'military_tech'
  }
];

export const AWARDS: AwardRecord[] = [
  {
    id: 'award_1',
    title: 'Certificate of Appreciation',
    conferrer: 'Ethiopian Fruit and Vegetable Market S.C.',
    year: '2017',
    description: 'Conferred in recognition of dedication, spearheading IT infrastructure projects, providing technical support, and maintaining secure data management.',
    icon: 'military_tech',
    colorClass: 'text-[#D97706]'
  }
];

export const AUDIT_STREAM: AuditActivity[] = [
  {
    id: 'aud_1',
    title: 'Updated AWS Solutions Architect credential expiration.',
    subject: 'AWS Solutions Architect',
    timestamp: '2 hours ago • Automated Check',
    category: 'check',
    icon: 'sync_saved_locally',
    colorClass: 'text-[#D97706]'
  },
  {
    id: 'aud_2',
    title: 'Exported Executive Cover Letter for Chief Technology Officer role at Apex Global.',
    subject: 'Apex Global',
    timestamp: 'Yesterday • AI Portal Engine',
    category: 'ai',
    icon: 'forward_to_inbox',
    colorClass: 'text-secondary'
  },
  {
    id: 'aud_3',
    title: 'Synced new production build to Cloudflare CDN Edge.',
    subject: 'Cloudflare CDN Edge',
    timestamp: '3 days ago • System Dispatch',
    category: 'deploy',
    icon: 'deployed_code',
    colorClass: 'text-primary'
  }
];
