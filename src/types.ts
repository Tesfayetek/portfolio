export type NavTab = 'home' | 'experience' | 'skills' | 'projects' | 'admin';

export interface ProfileData {
  fullName: string;
  credentialTitle: string;
  tagline: string;
  bio1: string;
  bio2: string;
  email: string;
  phone: string;
  linkedIn: string;
  github: string;
  website: string;
  location: string;
  executiveTitleRank: string;
  boardAbstract: string;
}

export interface MetricBenchmark {
  years: string;
  certifications: string;
  projects: string;
  pillars: string;
  governedValue: string;
}

export interface SkillItem {
  name: string;
  level: 'Expert' | 'Advanced';
}

export interface SkillDomain {
  id: 'tech' | 'mgmt' | 'biz' | 'tools';
  title: string;
  icon: string;
  tierBadge: string;
  tierClass: string;
  skills: SkillItem[];
}

export interface CaseStudy {
  id: string;
  title: string;
  role: string;
  year: string;
  domain: string;
  summary: string;
  detailedImpact?: string[];
  techTags: string[];
  kpiHighlight: {
    icon: string;
    text: string;
    colorClass: string;
  };
  image: string;
}

export interface ExperienceRecord {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  scopeMetric?: string;
  scopeLabel?: string;
  resiliencyMetric?: string;
  resiliencyLabel?: string;
  deliverables?: string[];
  active?: boolean;
}

export interface EducationRecord {
  id: string;
  degree: string;
  field: string;
  institution: string;
  honors: string;
  researchFocus: string;
}

export interface CertificationRecord {
  id: string;
  title: string;
  issuer: string;
  level: string;
  period: string;
  credentialId: string;
  status: 'Active' | 'Certified' | 'Expiring';
  verifyUrl: string;
  icon: string;
}

export interface AwardRecord {
  id: string;
  title: string;
  conferrer: string;
  year: string;
  description: string;
  icon: string;
  colorClass: string;
}

export interface AuditActivity {
  id: string;
  title: string;
  subject: string;
  timestamp: string;
  category: 'check' | 'ai' | 'deploy';
  icon: string;
  colorClass: string;
}

export interface TargetJobParams {
  role: string;
  organization: string;
  hiringAuthority: string;
  location: string;
  scope: string;
  tone: string;
  roleDescription: string;
}
