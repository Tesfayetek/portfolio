/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NavTab = 'home' | 'experience' | 'skills' | 'projects' | 'admin' | 'login';

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
  avatarUrl?: string;
}

export interface MetricBenchmark {
  years: string;
  certifications: string;
  projects: string;
  pillars: string;
  governedValue: string;
}

export interface SkillItem {
  id?: string;
  name: string;
  level: 'Expert' | 'Advanced';
}

export interface LanguageItem {
  id?: string;
  language: string;
  proficiency: string;
  flagCode?: string;
  published?: boolean;
  order?: number;
}

export interface SkillDomain {
  id: string;
  title: string;
  icon: string;
  tierBadge: string;
  tierClass: string;
  skills: SkillItem[];
  published?: boolean;
  order?: number;
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
  storageKey?: string;
  published?: boolean;
  order?: number;
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
  published?: boolean;
  order?: number;
}

export interface EducationRecord {
  id: string;
  degree: string;
  field: string;
  institution: string;
  honors: string;
  researchFocus: string;
  published?: boolean;
  order?: number;
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
  published?: boolean;
  order?: number;
}

export interface AwardRecord {
  id: string;
  title: string;
  conferrer: string;
  year: string;
  description: string;
  icon: string;
  colorClass: string;
  published?: boolean;
  order?: number;
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

export interface ExecutiveLetterRecord {
  id: string;
  title: string;
  date: string;
  recipientName: string;
  recipientTitle: string;
  recipientOrg: string;
  recipientLocation: string;
  subject: string;
  greeting: string;
  introParagraph: string;
  bullets: Array<{ title: string; description: string }>;
  closingParagraph: string;
  senderName: string;
  senderTitle: string;
  createdAt: number;
  published?: boolean;
}

export interface SiteSettings {
  siteTitle: string;
  heroHeadline: string;
  heroTagline: string;
  ctaCvButtonText: string;
  ctaContactButtonText: string;
  footerText: string;
  footerCopyright: string;
  statusAvailability: string;
  contactSubtitle: string;
}

export type HeroIconPosition =
  | 'Top'
  | 'Top Right'
  | 'Right'
  | 'Bottom Right'
  | 'Bottom'
  | 'Bottom Left'
  | 'Left'
  | 'Top Left'
  | 'Custom';

export interface HeroTechnologyIcon {
  id: string;
  name: string;
  imageUrl: string;
  storageKey?: string;
  position: HeroIconPosition;
  customAngle?: number; // Orbital angle: 0–360° (0° = Top / 12 o'clock, clockwise)
  customDistance?: number; // Orbital distance multiplier in percentage (e.g. 60–140%, default 100%)
  displayOrder: number;
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface MediaAssetsState {
  logo: string;
  avatar: string;
  headerThumb: string;
  adminPortrait: string;
  caseStudyOmnichannel: string;
  caseStudyBanking: string;
  caseStudyData: string;
  customUploads: Array<{
    id: string;
    title: string;
    url: string;
    altText: string;
    uploadedAt: number;
  }>;
}

export interface PortfolioContentState {
  profile: ProfileData;
  benchmarks: MetricBenchmark;
  experience: ExperienceRecord[];
  education: EducationRecord[];
  skillDomains: SkillDomain[];
  certifications: CertificationRecord[];
  caseStudies: CaseStudy[];
  awards: AwardRecord[];
  languages: LanguageItem[];
  executiveLetters: ExecutiveLetterRecord[];
  heroTechnologyIcons?: HeroTechnologyIcon[];
  siteSettings: SiteSettings;
  mediaAssets: MediaAssetsState;
  lastPublishedAt: number;
  hasDraftChanges: boolean;
}
