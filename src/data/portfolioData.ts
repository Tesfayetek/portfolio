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
} from '../types';

export const ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida/AEtjO1U22tDXMr4FfLvZCuSJKF9XFffi9uwi7ySB0vSlh6jLEtC1RZ61Ira7-1Vbv4GRc3HHNCq9Xq5eLWTPdDwrrEBqxILjeeQ2ZGN99R3ITuESqPGpy7WopKP_q12pQaIubotWT7-PW6uFXBv0CwZGj4vm4v1FZ4F24gE_HQKO2hSqtQi6VuUvEDoWX8NHH1v8TOm2N_cHGZiKfbYm8WF-VQzL3LGy6xC-OUYiAT6_OWuR2qGgd7NO1RMFmVy8',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC83zoylQsEqr44w9DLYFx8yWQAeJRQGrlmnS6XeP9dwSGl6brtLv_Gt0HnOL6FTSTFuwFmC5kRCO1rZRRdJcltl7nADn4_DXIYeizHezrW4n3SssNi_AFkatOC6PEvPOGikTh3meTqwbzhWHqAWw1tk9JRO4ZriS1InnWuI0J_S_Adis4FM2j4Len62nx0JLDaGXgOPbBFdovu2v3jnZS_ou-pbJOeNrbh26XhkPwMwsIZre9hB1F7IQ',
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
  years: '12+',
  certifications: '18+',
  projects: '45+',
  pillars: '5',
  governedValue: 'Enterprise'
};

export const SKILL_DOMAINS: SkillDomain[] = [
  {
    id: 'tech',
    title: 'Technology & Architecture',
    icon: 'dns',
    tierBadge: 'Tier 1',
    tierClass: 'bg-primary/10 text-primary',
    skills: [
      { name: 'Cloud Computing', level: 'Expert' },
      { name: 'Distributed Systems', level: 'Expert' },
      { name: 'Microservices', level: 'Expert' },
      { name: 'Enterprise Security', level: 'Advanced' },
      { name: 'High-Throughput APIs', level: 'Expert' }
    ]
  },
  {
    id: 'mgmt',
    title: 'Executive Management',
    icon: 'groups_3',
    tierBadge: 'Leadership',
    tierClass: 'bg-secondary/10 text-secondary',
    skills: [
      { name: 'Agile / Scaled Scrum', level: 'Expert' },
      { name: 'Cross-Functional Leadership', level: 'Expert' },
      { name: 'Vendor & Partner Strategy', level: 'Advanced' },
      { name: 'Capital & Resource Allocation', level: 'Expert' }
    ]
  },
  {
    id: 'biz',
    title: 'Business & Transformation',
    icon: 'vital_signs',
    tierBadge: 'Strategic',
    tierClass: 'bg-[#D97706]/10 text-[#D97706]',
    skills: [
      { name: 'Enterprise ERP & CRM', level: 'Expert' },
      { name: 'Data Strategy & Governance', level: 'Expert' },
      { name: 'Process Automation (RPA)', level: 'Advanced' },
      { name: 'ROI & TCO Financial Modeling', level: 'Expert' }
    ]
  },
  {
    id: 'tools',
    title: 'Tooling & Infrastructure',
    icon: 'terminal',
    tierBadge: 'Production',
    tierClass: 'bg-surface-container-high text-on-surface-variant',
    skills: [
      { name: 'Kubernetes', level: 'Expert' },
      { name: 'AWS Cloud', level: 'Expert' },
      { name: 'Microsoft Azure', level: 'Advanced' },
      { name: 'Python', level: 'Expert' },
      { name: 'Node.js', level: 'Expert' },
      { name: 'React Ecosystem', level: 'Advanced' },
      { name: 'Docker', level: 'Expert' },
      { name: 'Terraform (IaC)', level: 'Expert' }
    ]
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case_banking',
    title: 'Next-Gen Enterprise Banking Core Migration',
    role: 'Role: Lead Architect',
    year: '2023',
    domain: 'Financial Technology & Cloud',
    summary: 'Architected and spearheaded the zero-downtime decoupled transition of a high-volume legacy mainframe banking ledger into a resilient, event-driven distributed ecosystem processing $1.8B+ daily transaction volume.',
    detailedImpact: [
      'Eliminated single-point-of-failure bottlenecks across 34 downstream payment clearing rails.',
      'Constructed idempotent Apache Kafka distributed partitions guaranteeing exactly-once transactional semantics.',
      'Achieved continuous ISO27001 and PCI-DSS Level 1 regulatory compliance sign-off with external auditors.'
    ],
    techTags: ['Cloud Architecture', 'Microservices', 'Apache Kafka', 'AWS'],
    kpiHighlight: {
      icon: 'speed',
      text: '99.999% SLA Uptime',
      colorClass: 'text-primary'
    },
    image: ASSETS.caseStudyBanking
  },
  {
    id: 'case_omnichannel',
    title: 'Omnichannel Digital Transformation Platform',
    role: 'Role: Technical Director',
    year: '2022',
    domain: 'Omnichannel Ecosystem',
    summary: 'Unified five disparate customer engagement platforms across mobile, web, and physical branch terminals into a singular reactive interface layer with automated continuous integration pipeline.',
    detailedImpact: [
      'Consolidated fragmented user session data into a unified GraphQL federated gateway.',
      'Reduced average customer onboarding latency from 14 minutes down to 90 seconds.',
      'Delivered synchronized multi-channel cart state with sub-50ms websocket synchronization.'
    ],
    techTags: ['React', 'Node.js', 'AWS', 'CI/CD Automation'],
    kpiHighlight: {
      icon: 'trending_up',
      text: '+42% Customer NPS',
      colorClass: 'text-[#D97706]'
    },
    image: ASSETS.caseStudyOmnichannel
  },
  {
    id: 'case_data',
    title: 'AI-Powered BI & Automated Reporting',
    role: 'Role: Strategic Lead',
    year: '2021',
    domain: 'Data Intelligence',
    summary: 'Conceived and deployed an institutional centralized data lake with intelligent natural-language query models and automated real-time KPI synthesis for executive leadership committees.',
    detailedImpact: [
      'Automated weekly C-suite briefing pack generation with verified audit trails.',
      'Connected 42 distinct enterprise data silos across ERP, CRM, and telemetry clusters.',
      'Democratized SQL-free ad-hoc querying for 180+ business analysts globally.'
    ],
    techTags: ['Python', 'Data Lake', 'PowerBI', 'Predictive ML'],
    kpiHighlight: {
      icon: 'schedule',
      text: '140 hrs/mo Saved',
      colorClass: 'text-secondary'
    },
    image: ASSETS.caseStudyData
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
    institution: 'Accredited University Faculty of Technology',
    honors: 'Conferred with Distinction',
    researchFocus: 'Comprehensive study and practical projects in database management systems, network infrastructure, software engineering, and enterprise systems security.'
  }
];

export const INITIAL_CERTIFICATIONS: CertificationRecord[] = [
  {
    id: 'cert_oracle_dba',
    title: 'Oracle Database Administrator Certified',
    issuer: 'Oracle Corporation',
    level: 'Associate & Professional Level',
    period: 'Active • Certified',
    credentialId: 'ORA-DBA-9412',
    status: 'Active',
    verifyUrl: 'https://education.oracle.com',
    icon: 'dns'
  },
  {
    id: 'cert_cisco_ccna',
    title: 'Cisco Certified Network Associate (CCNA)',
    issuer: 'Cisco Systems',
    level: 'Routing & Switching / Enterprise Network Infrastructure',
    period: 'Active • Valid',
    credentialId: 'CSCO-129481',
    status: 'Active',
    verifyUrl: 'https://www.cisco.com/c/en/us/training-events/career-certifications.html',
    icon: 'hub'
  },
  {
    id: 'cert_ms_server',
    title: 'Microsoft Certified: Systems & Cloud Administration',
    issuer: 'Microsoft Corporation',
    level: 'Windows Server & Azure Fundamentals',
    period: 'Active • Certified',
    credentialId: 'MS-891043',
    status: 'Active',
    verifyUrl: 'https://learn.microsoft.com/en-us/credentials/',
    icon: 'cloud'
  },
  {
    id: 'cert_itil_found',
    title: 'ITIL® 4 Foundation in IT Service Management',
    issuer: 'AXELOS Global / PeopleCert',
    level: 'ITSM & Operational Incident Governance',
    period: 'Lifetime Accreditation',
    credentialId: 'ITIL-4-8841',
    status: 'Certified',
    verifyUrl: 'https://www.axelos.com',
    icon: 'assignment_turned_in'
  }
];

export const AWARDS: AwardRecord[] = [
  {
    id: 'award_1',
    title: 'Excellence in Enterprise Innovation Award',
    conferrer: 'Global Tech Forum',
    year: '2023',
    description: 'Conferred for pioneering architectural resilience in enterprise financial systems migration.',
    icon: 'military_tech',
    colorClass: 'text-[#D97706]'
  },
  {
    id: 'award_2',
    title: 'Top 40 Digital Leaders Under 40',
    conferrer: 'Leadership Council',
    year: '2022',
    description: 'Recognized for transformative team leadership and enterprise-wide strategic execution.',
    icon: 'workspace_premium',
    colorClass: 'text-secondary'
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
